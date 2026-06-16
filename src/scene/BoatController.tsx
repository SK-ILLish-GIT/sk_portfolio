import { useRef } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { RigidBody, CuboidCollider, type RapierRigidBody } from '@react-three/rapier';
import { stations } from '../data/portfolio';
import { ISLAND } from '../config/scene';
import { BOAT, BOAT_PHYSICS } from '../config/ocean';
import { SAILBOAT } from '../config/boats';
import type { Phase } from '../config/intro';
import { waveHeight } from '../lib/waves';
import { sailingInput } from './controls/sailingInput';
import { BoatModel } from './components';

interface BoatControllerProps {
  phase: Phase;
  bodyRef: React.MutableRefObject<RapierRigidBody | null>;
  headingRef: React.MutableRefObject<number>;
  /** Live boat XZ position for the minimap. */
  posRef: React.MutableRefObject<{ x: number; z: number }>;
  onNearest: (index: number) => void;
  /** Index of the island the boat is docked beside, or -1 when out at sea. */
  onDock: (index: number) => void;
  /** When exploring an island the boat is frozen so the camera can frame it. */
  exploring: number;
}

const FORWARD = new THREE.Vector3(0, 0, 1);

// Playable sea bounds derived from the island layout (+ margin), so the soft
// walls always wrap the archipelago however it's scattered.
const BOUNDS = {
  maxX: Math.max(...stations.map((s) => Math.abs(s.position[0]))) + 16,
  maxZ: Math.max(...stations.map((s) => s.position[2])) + 16,
  minZ: Math.min(...stations.map((s) => s.position[2])) - 16,
};

/**
 * The player's boat as a dynamic Rapier body. Only yaw is simulated (pitch/roll
 * are faked on the model for stability); a buoyancy spring keeps it on the
 * swell, thrust/steer come from the keyboard, and water drag damps it.
 */
export default function BoatController({
  phase,
  bodyRef,
  headingRef,
  posRef,
  onNearest,
  onDock,
  exploring,
}: BoatControllerProps) {
  const model = useRef<THREE.Group>(null);
  const q = useRef(new THREE.Quaternion());
  const forward = useRef(new THREE.Vector3());
  const lean = useRef(0);
  const lastNearest = useRef(-1);
  const lastDock = useRef(-2);

  useFrame((state, delta) => {
    const body = bodyRef.current;
    if (!body) return;
    const dt = Math.min(delta, 1 / 30);
    const t = state.clock.getElapsedTime();

    const pos = body.translation();
    const rot = body.rotation();
    const lin = body.linvel();

    // Heading for the compass: North = into the scene (−Z, the voyage direction).
    q.current.set(rot.x, rot.y, rot.z, rot.w);
    forward.current.copy(FORWARD).applyQuaternion(q.current);
    headingRef.current = (Math.atan2(forward.current.x, -forward.current.z) * 180) / Math.PI;
    posRef.current.x = pos.x;
    posRef.current.z = pos.z;

    // Buoyancy spring → ride the wave surface (gravity is disabled on the body).
    // Applied as an impulse (force × dt) so it does not accumulate across steps.
    const surfaceY = waveHeight(pos.x, pos.z, t) + BOAT_PHYSICS.floatLine;
    const fy = BOAT_PHYSICS.buoyancyK * (surfaceY - pos.y) - BOAT_PHYSICS.buoyancyC * lin.y;
    body.applyImpulse({ x: 0, y: fy * dt, z: 0 }, true);

    // Controls only once we're sailing — and frozen while exploring an island.
    const live = phase === 'live';
    const frozen = exploring >= 0;
    const inp = sailingInput.read();
    const throttle = live && !frozen ? inp.forward : 0;
    const steer = live && !frozen ? inp.turn : 0;

    if (throttle !== 0) {
      const power = BOAT_PHYSICS.thrust * (throttle > 0 ? throttle : throttle * BOAT_PHYSICS.reverseFactor) * dt;
      body.applyImpulse({ x: forward.current.x * power, y: 0, z: forward.current.z * power }, true);
    }
    if (steer !== 0) {
      body.applyTorqueImpulse({ x: 0, y: steer * BOAT_PHYSICS.turnTorque * dt, z: 0 }, true);
    }

    // Explore mode brakes hard to settle the boat; otherwise normal water drag.
    body.setLinearDamping(frozen ? BOAT_PHYSICS.anchorDamping : BOAT_PHYSICS.linearDamping);

    // Soft bounds — nudge back toward the playable sea if we wander too far.
    const pull = BOAT_PHYSICS.boundsPull * dt;
    if (pos.x < -BOUNDS.maxX) body.applyImpulse({ x: pull, y: 0, z: 0 }, true);
    if (pos.x > BOUNDS.maxX) body.applyImpulse({ x: -pull, y: 0, z: 0 }, true);
    if (pos.z > BOUNDS.maxZ) body.applyImpulse({ x: 0, y: 0, z: -pull }, true);
    if (pos.z < BOUNDS.minZ) body.applyImpulse({ x: 0, y: 0, z: pull }, true);

    // Visual lean: tilt the model into turns + gentle wave roll/pitch.
    const speed = Math.hypot(lin.x, lin.z) / BOAT_PHYSICS.refSpeed;
    const targetLean = -steer * 0.18 * Math.min(1, speed + 0.25);
    lean.current = THREE.MathUtils.lerp(lean.current, targetLean, 0.08);
    if (model.current) {
      model.current.rotation.z = lean.current + Math.sin(t * BOAT.rollSpeed) * BOAT.rollAmp;
      model.current.rotation.x = Math.sin(t * BOAT.pitchSpeed) * BOAT.pitchAmp - throttle * 0.05;
    }

    // Report the nearest island so the overlay can show its content.
    let best = 0;
    let bestD = Infinity;
    for (let i = 0; i < stations.length; i++) {
      const [sx, , sz] = stations[i].position;
      const d = (sx - pos.x) ** 2 + (sz - pos.z) ** 2;
      if (d < bestD) {
        bestD = d;
        best = i;
      }
    }
    if (best !== lastNearest.current) {
      lastNearest.current = best;
      onNearest(best);
    }

    // Docked when within range of the nearest island's shoreline. Respect each
    // island's radius override (e.g. the larger Skills island) so the dock zone
    // matches its explore ring.
    const radius = stations[best].radius ?? (stations[best].id === 'hero' ? ISLAND.heroRadius : ISLAND.defaultRadius);
    const dockRange = radius * 1.05 + BOAT_PHYSICS.dockRange;
    const docked = Math.sqrt(bestD) < dockRange ? best : -1;
    if (docked !== lastDock.current) {
      lastDock.current = docked;
      onDock(docked);
    }
  });

  return (
    <RigidBody
      ref={bodyRef}
      position={BOAT_PHYSICS.spawn}
      rotation={[0, BOAT_PHYSICS.spawnYaw, 0]}
      colliders={false}
      gravityScale={0}
      linearDamping={BOAT_PHYSICS.linearDamping}
      angularDamping={BOAT_PHYSICS.angularDamping}
      enabledRotations={[false, true, false]}
      canSleep={false}
    >
      <CuboidCollider
        args={[BOAT_PHYSICS.hull.halfX, BOAT_PHYSICS.hull.halfY, BOAT_PHYSICS.hull.halfZ]}
        mass={BOAT_PHYSICS.mass}
      />
      <group ref={model}>
        <BoatModel option={SAILBOAT} />
      </group>
    </RigidBody>
  );
}
