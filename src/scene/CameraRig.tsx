import { useEffect, useMemo, useRef } from 'react';
import * as THREE from 'three';
import { useFrame, useThree } from '@react-three/fiber';
import { useScroll } from '@react-three/drei';
import { stations } from '../data/portfolio';

interface CameraRigProps {
  setActive: (i: number) => void;
  scrollTo: { index: number; nonce: number };
}

/**
 * Drives the camera along scroll: interpolates position + lookAt between
 * per-island anchor points, and reports the active station index.
 * Also handles programmatic navigation (nav dots) via the `scrollTo` prop.
 */
export default function CameraRig({ setActive, scrollTo }: CameraRigProps) {
  const scroll = useScroll();
  const { camera } = useThree();
  const lastIndex = useRef(-1);

  // Precompute camera + lookAt anchors for each station.
  const anchors = useMemo(() => {
    return stations.map((s) => {
      const island = new THREE.Vector3(...s.position);
      const cam = new THREE.Vector3(island.x * 0.45, island.y + 3, island.z + 12);
      const look = new THREE.Vector3(island.x, island.y + 1, island.z);
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
    const pages = stations.length;
    const t = scroll.offset * (pages - 1);
    const i = Math.min(Math.floor(t), pages - 2);
    const f = smoothstep(t - i);

    const a = anchors[i];
    const b = anchors[i + 1] ?? a;

    tmpCam.current.lerpVectors(a.cam, b.cam, f);
    tmpLook.current.lerpVectors(a.look, b.look, f);

    // Subtle mouse parallax for a tactile, 3D feel.
    tmpCam.current.x += state.pointer.x * 1.4;
    tmpCam.current.y += state.pointer.y * 0.8;

    camera.position.lerp(tmpCam.current, 0.12);
    camera.lookAt(tmpLook.current);

    const idx = Math.round(t);
    if (idx !== lastIndex.current) {
      lastIndex.current = idx;
      setActive(idx);
    }
  });

  return null;
}

function smoothstep(x: number) {
  const c = Math.min(1, Math.max(0, x));
  return c * c * (3 - 2 * c);
}
