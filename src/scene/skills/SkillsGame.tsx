import { useCallback, useEffect, useMemo, useReducer, useRef, useState, Suspense, lazy } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { Sparkles } from '@react-three/drei';
import { RigidBody, CuboidCollider, type RapierRigidBody } from '@react-three/rapier';
import { skillGroups } from '../../data/portfolio';
import { SKILLS_GAME } from '../../config/skillsGame';
import { getCrateTexture } from './crateTexture';
import { skillsGame, useSkillsGame } from './store';
import { skillsControls, POWER_FLOOR } from './controls';
import { Cannon } from './Cannon';
import { AngryBird } from './AngryBird';
import { DustPoof } from './DustPoof';
import type { Vec3 } from '../../types/three';

const DEV = import.meta.env.DEV;
const TunableCannon = DEV ? lazy(() => import('../../dev/TunableCannon')) : null;

const C = SKILLS_GAME.crate;
const HALF = C.size / 2;
const STEP = C.size + C.gap;

/** Grid offsets for a small 3-wide stack of `n` crates (bottom-up). */
function stackLayout(n: number): Vec3[] {
  const cols = Math.min(3, n);
  return Array.from({ length: n }, (_, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    return [(col - (cols - 1) / 2) * STEP, HALF + row * STEP, 0];
  });
}

interface StackProps {
  items: string[];
  color: string;
  position: Vec3;
  rotationY: number;
  active: boolean;
  nonce: number;
  onClear: () => void;
  onBreak: (pos: Vec3) => void;
}

function Stack({ items, color, position, rotationY, active, nonce, onClear, onBreak }: StackProps) {
  const bodies = useRef<(RapierRigidBody | null)[]>([]);
  const brokenRef = useRef<Set<number>>(new Set());
  const clearedRef = useRef(false);
  const [, force] = useReducer((x) => x + 1, 0);

  const layout = useMemo(() => stackLayout(items.length), [items.length]);
  const textures = useMemo(() => items.map((it) => getCrateTexture(it, color)), [items, color]);

  useEffect(() => {
    brokenRef.current = new Set();
    clearedRef.current = false;
    bodies.current = [];
    force();
  }, [nonce]);

  useFrame(() => {
    if (!active || clearedRef.current) return;
    let changed = false;
    bodies.current.forEach((b, idx) => {
      if (!b || brokenRef.current.has(idx)) return;
      const t = b.translation();
      if (t.y < SKILLS_GAME.breakY) {
        brokenRef.current.add(idx);
        changed = true;
        onBreak([t.x, SKILLS_GAME.topY + 0.3, t.z]);
      }
    });
    if (changed) {
      force();
      if (brokenRef.current.size >= items.length) {
        clearedRef.current = true;
        onClear();
      }
    }
  });

  return (
    <group position={position} rotation={[0, rotationY, 0]}>
      {/* Flat box pad directly under the stack: box-on-box rest is far more
          stable than resting on the island's convex-hull floor. */}
      <RigidBody type="fixed" colliders={false}>
        <CuboidCollider args={[1.9, 0.1, 1.9]} position={[0, -0.1, 0]} friction={C.friction} />
      </RigidBody>
      {items.map((_, idx) =>
        brokenRef.current.has(idx) ? null : (
          <RigidBody
            key={idx}
            ref={(el) => {
              bodies.current[idx] = el;
            }}
            position={layout[idx]}
            colliders={false}
            restitution={C.restitution}
            friction={C.friction}
            linearDamping={C.linearDamping}
            angularDamping={C.angularDamping}
            canSleep
          >
            <CuboidCollider args={[HALF, HALF, HALF]} mass={C.mass} />
            <mesh castShadow receiveShadow>
              <boxGeometry args={[C.size, C.size, C.size]} />
              <meshStandardMaterial map={textures[idx]} roughness={0.7} />
            </mesh>
          </RigidBody>
        ),
      )}
    </group>
  );
}

const MUZZLE: Vec3 = [SKILLS_GAME.cannon.pos[0], SKILLS_GAME.cannon.muzzleY, SKILLS_GAME.cannon.pos[2]];
const AIM_DEG_PER_SEC = 70;
const CHARGE_PER_SEC = 1.3;

function spawnFromVel(vel: Vec3): Vec3 {
  const len = Math.hypot(vel[0], vel[1], vel[2]) || 1;
  const o = SKILLS_GAME.cannon.barrelOffset;
  return [MUZZLE[0] + (vel[0] / len) * o, MUZZLE[1] + (vel[1] / len) * o, MUZZLE[2] + (vel[2] / len) * o];
}

/** Launch direction (+Z forward, fixed elevation) and speed from yaw + power. */
function aimVel(yawDeg: number, power: number): Vec3 {
  const yaw = (yawDeg * Math.PI) / 180;
  const { minSpeed, maxSpeed, pitch } = SKILLS_GAME.launch;
  const speed = minSpeed + (maxSpeed - minSpeed) * power;
  const ch = Math.cos(pitch) * speed;
  return [Math.sin(yaw) * ch, Math.sin(pitch) * speed, Math.cos(yaw) * ch];
}

function predictPath(vel: Vec3): Vec3[] {
  const pts: Vec3[] = [];
  const p = [...MUZZLE] as Vec3;
  const vx = vel[0];
  let vy = vel[1];
  const vz = vel[2];
  const dt = 0.07;
  for (let i = 0; i < 22; i++) {
    vy += -9.81 * dt;
    p[0] += vx * dt;
    p[1] += vy * dt;
    p[2] += vz * dt;
    if (p[1] < SKILLS_GAME.breakY) break;
    pts.push([p[0], p[1], p[2]]);
  }
  return pts;
}

export default function SkillsGame({ accent, active }: { accent: string; active: boolean }) {
  const { resetNonce, won, yawDeg, power } = useSkillsGame();
  const colors = useMemo(
    () => skillGroups.map((_, i) => `#${new THREE.Color(accent).offsetHSL(i * 0.13, 0, 0).getHexString()}`),
    [accent],
  );

  // Each stack faces the cannon at the apex.
  const placements = useMemo(() => {
    const [ax, , az] = SKILLS_GAME.cannon.pos;
    return SKILLS_GAME.stacks.map(([x, z]) => ({
      position: [x, 0, z] as Vec3,
      rotationY: Math.atan2(ax - x, az - z),
    }));
  }, []);

  const clearedCount = useRef(0);
  useEffect(() => {
    skillsGame.setTotal(skillGroups.length);
  }, []);
  useEffect(() => {
    clearedCount.current = 0; // reset() bumped the nonce
  }, [resetNonce]);

  const [bird, setBird] = useState<{ pos: Vec3; vel: Vec3; key: number } | null>(null);
  const birdRef = useRef(bird);
  birdRef.current = bird;

  // Dust bursts spawned when a crate is knocked off the island.
  const [poofs, setPoofs] = useState<{ pos: Vec3; key: number }[]>([]);
  const addPoof = useCallback((pos: Vec3) => {
    setPoofs((ps) => [...ps, { pos, key: performance.now() + Math.random() }]);
  }, []);
  useEffect(() => {
    if (!active) setPoofs([]);
  }, [active]);
  useEffect(() => {
    setPoofs([]);
  }, [resetNonce]);

  const aim = useMemo(() => ({ yaw: (yawDeg * Math.PI) / 180, pitch: SKILLS_GAME.launch.pitch }), [yawDeg]);

  // Keyboard: ← → aim, hold Space to charge power (ping-pong), release to fire.
  const keys = useRef({ left: false, right: false });

  useEffect(() => {
    if (!active) return;
    skillsControls.setChargeGuard(() => {
      const s = skillsGame.getState();
      return !s.won && !birdRef.current;
    });
    const onDown = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        e.preventDefault();
        skillsControls.beginCharge();
      } else if (e.code === 'ArrowLeft') {
        keys.current.left = true;
        skillsControls.setKeyboardAim(keys.current.left, keys.current.right);
      } else if (e.code === 'ArrowRight') {
        keys.current.right = true;
        skillsControls.setKeyboardAim(keys.current.left, keys.current.right);
      }
    };
    const onUp = (e: KeyboardEvent) => {
      if (e.code === 'Space') {
        skillsControls.endCharge();
      } else if (e.code === 'ArrowLeft') {
        keys.current.left = false;
        skillsControls.setKeyboardAim(keys.current.left, keys.current.right);
      } else if (e.code === 'ArrowRight') {
        keys.current.right = false;
        skillsControls.setKeyboardAim(keys.current.left, keys.current.right);
      }
    };
    window.addEventListener('keydown', onDown);
    window.addEventListener('keyup', onUp);
    return () => {
      window.removeEventListener('keydown', onDown);
      window.removeEventListener('keyup', onUp);
      keys.current = { left: false, right: false };
      skillsControls.reset();
    };
  }, [active]);

  const wasCharging = useRef(false);

  useFrame((_, dt) => {
    if (!active) return;
    const d = Math.min(dt, 1 / 30);
    const aimRate = skillsControls.getAimRate();
    if (aimRate !== 0) skillsGame.aimBy(AIM_DEG_PER_SEC * d * aimRate);
    if (skillsControls.isCharging()) {
      let p = skillsGame.getState().power + skillsControls.getChargeDir() * CHARGE_PER_SEC * d;
      if (p >= 1) {
        p = 1;
        skillsControls.setChargeDir(-1);
      } else if (p <= POWER_FLOOR) {
        p = POWER_FLOOR;
        skillsControls.setChargeDir(1);
      }
      skillsGame.setPower(p);
    }

    const charging = skillsControls.isCharging();
    if (wasCharging.current && !charging) {
      const s = skillsGame.getState();
      if (!s.won && !birdRef.current) {
        const vel = aimVel(s.yawDeg, s.power);
        setBird({ pos: spawnFromVel(vel), vel, key: performance.now() });
      }
    }
    wasCharging.current = charging;
  });

  // Drop the bird when leaving the island or resetting.
  useEffect(() => {
    if (!active) setBird(null);
  }, [active]);
  useEffect(() => {
    setBird(null);
  }, [resetNonce]);

  const preview = active && !won && !bird ? predictPath(aimVel(yawDeg, power)) : null;

  return (
    <group>
      {/* floor + boat wall live in Experience (ConvexHullCollider for the shield) */}
      {TunableCannon && active ? (
        <Suspense fallback={<Cannon aim={aim} />}>
          <TunableCannon aim={aim} />
        </Suspense>
      ) : (
        <Cannon aim={aim} />
      )}

      {skillGroups.map((g, i) => (
        <Stack
          key={`${resetNonce}-${g.label}`}
          items={g.items}
          color={colors[i]}
          position={placements[i].position}
          rotationY={placements[i].rotationY}
          active={active}
          nonce={resetNonce}
          onClear={() => {
            clearedCount.current += 1;
            skillsGame.setCleared(clearedCount.current);
          }}
          onBreak={addPoof}
        />
      ))}

      {poofs.map((p) => (
        <DustPoof key={p.key} position={p.pos} onDone={() => setPoofs((ps) => ps.filter((x) => x.key !== p.key))} />
      ))}

      {bird && <AngryBird key={bird.key} position={bird.pos} vel={bird.vel} onSettle={() => setBird(null)} />}

      {preview?.map((p, i) => (
        <mesh key={i} position={p}>
          <sphereGeometry args={[0.07, 6, 6]} />
          <meshBasicMaterial color="#ffffff" transparent opacity={0.6} />
        </mesh>
      ))}

      {won && (
        <Sparkles
          count={40}
          scale={[SKILLS_GAME.radius, 5, SKILLS_GAME.radius]}
          position={[0, 3, 5]}
          size={3}
          speed={0.4}
          color={accent}
        />
      )}
    </group>
  );
}
