import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import { stations } from '../data/portfolio';
import { CAMERA_RIG } from '../config/scene';
import { INTRO, type Phase } from '../config/intro';
import { smooth } from '../lib/math';

interface CameraRigProps {
  setActive: (i: number) => void;
  scrollTo: { index: number; nonce: number };
  phase: Phase;
}

/**
 * Drives the camera along scroll: interpolates position + lookAt between
 * per-island anchor points, and reports the active station index.
 * Also handles programmatic navigation (nav dots) via the `scrollTo` prop.
 */
export default function CameraRig({ setActive, scrollTo, phase }: CameraRigProps) {
  const scroll = useScroll();
  const { camera } = useThree();
  const lastIndex = useRef(-1);
  const introStart = useRef<number | null>(null);
  const introFrom = useMemo(() => new THREE.Vector3(...CAMERA_RIG.introFrom), []);

  // Precompute camera + lookAt anchors for each station.
  const anchors = useMemo(() => {
    return stations.map((s) => {
      const island = new THREE.Vector3(...s.position);
      const cam = new THREE.Vector3(
        island.x * CAMERA_RIG.camOffset.xFactor,
        island.y + CAMERA_RIG.camOffset.y,
        island.z + CAMERA_RIG.camOffset.z,
      );
      const look = new THREE.Vector3(island.x, island.y + CAMERA_RIG.lookOffset.y, island.z);
      return { cam, look };
    });
  }, []);

  const tmpCam = useRef(new THREE.Vector3());
  const tmpLook = useRef(new THREE.Vector3());

  // Programmatic scroll when a nav dot is clicked.
  useEffect(() => {
    const el = scroll.el;
    if (!el) return;
    const pages = stations.length;
    const target = scrollTo.index / (pages - 1);
    const top = target * (el.scrollHeight - el.clientHeight);
    el.scrollTo({ top, behavior: 'smooth' });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollTo.nonce]);

  useFrame((state) => {
    // While the loader is up, park the camera deep in the fog (off-screen
    // behind the overlay) so the fly-in is fully seen once the intro starts.
    if (phase === 'loading') {
      camera.position.copy(introFrom);
      camera.lookAt(anchors[0].look);
      return;
    }

    // Cinematic arrival: ease the camera out of the fog onto the welcome island.
    if (phase === 'intro') {
      if (introStart.current === null) introStart.current = state.clock.getElapsedTime();
      const it = state.clock.getElapsedTime() - introStart.current;
      const k = smooth(Math.min(1, it / INTRO.approach));
      tmpCam.current.lerpVectors(introFrom, anchors[0].cam, k);
      camera.position.lerp(tmpCam.current, CAMERA_RIG.introLerp);
      camera.lookAt(anchors[0].look);
      return;
    }

    const pages = stations.length;
    const t = scroll.offset * (pages - 1);
    const i = Math.min(Math.floor(t), pages - 2);
    const f = smooth(t - i);

    const a = anchors[i];
    const b = anchors[i + 1] ?? a;

    tmpCam.current.lerpVectors(a.cam, b.cam, f);
    tmpLook.current.lerpVectors(a.look, b.look, f);

    // Subtle mouse parallax for a tactile, 3D feel.
    tmpCam.current.x += state.pointer.x * CAMERA_RIG.parallax.x;
    tmpCam.current.y += state.pointer.y * CAMERA_RIG.parallax.y;

    camera.position.lerp(tmpCam.current, CAMERA_RIG.followLerp);
    camera.lookAt(tmpLook.current);

    const idx = Math.round(t);
    if (idx !== lastIndex.current) {
      lastIndex.current = idx;
      setActive(idx);
    }
  });

  return null;
}
