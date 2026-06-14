import { useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import type { RapierRigidBody } from '@react-three/rapier';
import { CAMERA_RIG, EXPLORE } from '../config/scene';
import { SKILLS_GAME } from '../config/skillsGame';
import { INTRO, type Phase } from '../config/intro';
import { stations } from '../data/portfolio';
import { smooth } from '../lib/math';

interface CameraRigProps {
  phase: Phase;
  bodyRef: React.MutableRefObject<RapierRigidBody | null>;
  /** Index of the island being explored (camera frames it), or -1 to chase the boat. */
  exploring: number;
}

const FORWARD = new THREE.Vector3(0, 0, 1);

/**
 * Free-roam chase camera: sits behind + above the boat along its heading and
 * looks slightly ahead, so you feel like you're sailing it. Reads the boat's
 * Rapier transform each frame and eases toward the ideal pose.
 */
export default function CameraRig({ phase, bodyRef, exploring }: CameraRigProps) {
  const { camera } = useThree();
  const introStart = useRef<number | null>(null);
  const introFrom = useMemo(() => new THREE.Vector3(...CAMERA_RIG.introFrom), []);

  const q = useRef(new THREE.Quaternion());
  const fwd = useRef(new THREE.Vector3());
  const boatPos = useRef(new THREE.Vector3(0, 0, 0));
  const camTarget = useRef(new THREE.Vector3());
  const lookTarget = useRef(new THREE.Vector3());

  /** Ideal chase position + look target for the boat's current pose. */
  const chasePose = (camOut: THREE.Vector3, lookOut: THREE.Vector3) => {
    const body = bodyRef.current;
    if (body) {
      const p = body.translation();
      const r = body.rotation();
      boatPos.current.set(p.x, p.y, p.z);
      q.current.set(r.x, r.y, r.z, r.w);
    }
    fwd.current.copy(FORWARD).applyQuaternion(q.current);
    camOut.set(
      boatPos.current.x - fwd.current.x * CAMERA_RIG.chase.back,
      boatPos.current.y + CAMERA_RIG.chase.up,
      boatPos.current.z - fwd.current.z * CAMERA_RIG.chase.back,
    );
    lookOut.set(
      boatPos.current.x + fwd.current.x * CAMERA_RIG.chase.lookAhead,
      boatPos.current.y + CAMERA_RIG.lookOffset.y,
      boatPos.current.z + fwd.current.z * CAMERA_RIG.chase.lookAhead,
    );
  };

  useFrame((state) => {
    if (phase === 'loading') {
      camera.position.copy(introFrom);
      chasePose(camTarget.current, lookTarget.current);
      camera.lookAt(lookTarget.current);
      return;
    }

    if (phase === 'intro') {
      if (introStart.current === null) introStart.current = state.clock.getElapsedTime();
      const it = state.clock.getElapsedTime() - introStart.current;
      const k = smooth(Math.min(1, it / INTRO.approach));
      chasePose(camTarget.current, lookTarget.current);
      camTarget.current.lerpVectors(introFrom, camTarget.current, k);
      camera.position.lerp(camTarget.current, CAMERA_RIG.introLerp);
      camera.lookAt(lookTarget.current);
      return;
    }

    // Explore mode: frame the chosen island in a steady view.
    if (exploring >= 0 && stations[exploring]) {
      const s = stations[exploring];
      const [sx, , sz] = s.position;
      if (s.id === 'skills') {
        // Skills game wants a fixed above-and-behind framing of the fan.
        const c = SKILLS_GAME.camera;
        camTarget.current.set(sx + c.pos[0], c.pos[1], sz + c.pos[2]);
        lookTarget.current.set(sx + c.look[0], c.look[1], sz + c.look[2]);
        camera.position.lerp(camTarget.current, c.lerp);
        camera.lookAt(lookTarget.current);
        return;
      }
      const f = EXPLORE.focus;
      camTarget.current.set(sx + f.side, f.up, sz + f.back);
      lookTarget.current.set(sx, f.lookY, sz);
      camera.position.lerp(camTarget.current, f.lerp);
      camera.lookAt(lookTarget.current);
      return;
    }

    chasePose(camTarget.current, lookTarget.current);
    camTarget.current.x += state.pointer.x * CAMERA_RIG.parallax.x;
    camTarget.current.y += state.pointer.y * CAMERA_RIG.parallax.y;
    camera.position.lerp(camTarget.current, CAMERA_RIG.followLerp);
    camera.lookAt(lookTarget.current);
  });

  return null;
}
