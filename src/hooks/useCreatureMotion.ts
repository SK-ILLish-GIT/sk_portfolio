import { useRef, type RefObject } from 'react';
import * as THREE from 'three';
import { useFrame } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import { stations } from '../data/portfolio';
import { INTRO, type Phase } from '../config/intro';
import { CREATURE_ENTRY, ORBIT, FOLLOW } from '../config/creature';
import { smooth } from '../lib/math';

function orbitPosition(angle: number, now: number, out: THREE.Vector3) {
  out.set(
    Math.cos(angle) * ORBIT.radius,
    ORBIT.height + Math.sin(now * ORBIT.bobSpeed) * ORBIT.bobAmplitude,
    Math.sin(angle) * ORBIT.radius + 0.2,
  );
}

/**
 * Drives the guide stork: glide in from the left, then circle the welcome
 * island continuously (never lands). Once the user scrolls, it flies between
 * islands, banking into its travel direction.
 */
export function useCreatureMotion(bodyRef: RefObject<THREE.Object3D>, phase: Phase) {
  const startRef = useRef<number | null>(null);
  const tmp = useRef(new THREE.Vector3());
  const islandA = useRef(new THREE.Vector3());
  const islandB = useRef(new THREE.Vector3());
  const far = useRef(new THREE.Vector3(...CREATURE_ENTRY));
  const prevPos = useRef(new THREE.Vector3());
  const bank = useRef(0);
  // Pure (sway-free) path point + the smoothed travel heading it produces.
  const base = useRef(new THREE.Vector3(...stations[0].position));
  const basePrev = useRef(new THREE.Vector3(...stations[0].position));
  const heading = useRef(new THREE.Vector3(0, 0, -1));
  const lookTarget = useRef(new THREE.Vector3());
  const scroll = useScroll();

  useFrame((state) => {
    const g = bodyRef.current;
    if (!g) return;
    const now = state.clock.getElapsedTime();

    if (phase === 'loading') {
      g.visible = false;
      return;
    }
    g.visible = true;
    if (startRef.current === null) startRef.current = now;
    const t = now - startRef.current;

    const orbitT = Math.max(0, t - INTRO.approach);
    const angle = ORBIT.entryAngle + orbitT * ORBIT.speed;

    // Glide in from the off-screen entry point onto the orbit.
    if (phase === 'intro' && t < INTRO.approach) {
      orbitPosition(ORBIT.entryAngle, now, tmp.current);
      g.position.lerpVectors(far.current, tmp.current, smooth(t / INTRO.approach));
      g.lookAt(0, 3.2, 0.2);
      g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, 0, 0.1);
      return;
    }

    // Continuous welcome orbit (intro tail + idle on the hero island).
    if (phase === 'intro' || scroll.offset < FOLLOW.orbitThreshold) {
      orbitPosition(angle, now, tmp.current);
      g.position.lerp(tmp.current, phase === 'intro' ? FOLLOW.orbitLerpIntro : FOLLOW.orbitLerpLive);
      const ahead = angle + ORBIT.lookAhead;
      g.lookAt(Math.cos(ahead) * ORBIT.radius, 3.5, Math.sin(ahead) * ORBIT.radius + 0.2);
      g.rotation.z = THREE.MathUtils.lerp(g.rotation.z, Math.cos(angle) * ORBIT.bankAmount, 0.08);
      return;
    }

    // Live: follow the scroll between islands.
    const n = stations.length;
    const p = scroll.offset * (n - 1);
    const i = Math.min(Math.floor(p), n - 2);
    const f = p - i;
    islandA.current.set(...stations[i].position);
    islandB.current.set(...stations[i + 1].position);

    // Sway-free path point: its frame-to-frame delta is the true travel
    // direction (forward or backward), which the creature turns to face. This
    // ignores hover sway so an idle creature keeps its last heading instead of
    // drifting sideways.
    base.current.lerpVectors(islandA.current, islandB.current, f);
    tmp.current.subVectors(base.current, basePrev.current);
    const moved = tmp.current.length();
    if (moved > FOLLOW.headingDeadzone) {
      tmp.current.divideScalar(moved);
      heading.current.lerp(tmp.current, FOLLOW.headingLerp);
    }
    basePrev.current.copy(base.current);

    // Position target: path point + hover offset, sway, and a vertical bob.
    tmp.current.copy(base.current);
    tmp.current.x += Math.sin(now * FOLLOW.offset.swaySpeed) * FOLLOW.offset.sway;
    tmp.current.y += FOLLOW.offset.y + Math.sin(now * FOLLOW.travelBob.speed) * FOLLOW.travelBob.amplitude;
    tmp.current.z += FOLLOW.offset.z;
    g.position.lerp(tmp.current, FOLLOW.travelLerp);

    const dx = g.position.x - prevPos.current.x;
    bank.current = THREE.MathUtils.lerp(bank.current, dx * FOLLOW.bankGain, FOLLOW.bankLerp);

    // Face the travel direction, then roll for banking about the local forward
    // axis. Rolling via rotateZ (not g.rotation.z) avoids the Euler flip that
    // left the bird upside down when heading away from the camera (−Z). The
    // guard skips the brief zero-length heading during a scroll U-turn.
    if (heading.current.lengthSq() > 0.04) {
      lookTarget.current.copy(g.position).addScaledVector(heading.current, FOLLOW.lookDistance);
      g.lookAt(lookTarget.current);
      g.rotateZ(bank.current);
    }
    prevPos.current.copy(g.position);
  });
}
