import { useEffect, useRef } from 'react';
import { stations } from '../data/portfolio';

interface MinimapProps {
  posRef: React.MutableRefObject<{ x: number; z: number }>;
  headingRef: React.MutableRefObject<number>;
  docked: number;
}

const SIZE = 156;
// World bounds of the playable sea (from the island layout + margin), mapped
// into the minimap square so the whole archipelago always fits.
const M = 24;
const xs = stations.map((s) => s.position[0]);
const zs = stations.map((s) => s.position[2]);
const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...zs) - Math.min(...zs)) + 2 * M;
const cx = (Math.max(...xs) + Math.min(...xs)) / 2;
const cz = (Math.max(...zs) + Math.min(...zs)) / 2;
// Square, centered bounds keep the map aspect-correct (no x/z stretching).
const BOUNDS = { minX: cx - span / 2, maxX: cx + span / 2, minZ: cz - span / 2, maxZ: cz + span / 2 };
const PAD = 14;
const REVEAL = 26; // fog-clear radius in px around the boat

/** Top-down minimap with a fog-of-war that lifts as you explore. */
export default function Minimap({ posRef, headingRef, docked }: MinimapProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const fog = useRef<HTMLCanvasElement | null>(null);
  const dockedRef = useRef(docked);
  dockedRef.current = docked;

  const toMap = (x: number, z: number) => ({
    mx: PAD + ((x - BOUNDS.minX) / (BOUNDS.maxX - BOUNDS.minX)) * (SIZE - 2 * PAD),
    my: PAD + ((z - BOUNDS.minZ) / (BOUNDS.maxZ - BOUNDS.minZ)) * (SIZE - 2 * PAD),
  });

  useEffect(() => {
    const cv = canvas.current;
    if (!cv) return;
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    // Persistent fog layer (opaque until "erased" by exploration).
    const fogCv = document.createElement('canvas');
    fogCv.width = SIZE;
    fogCv.height = SIZE;
    const fogCtx = fogCv.getContext('2d')!;
    fogCtx.fillStyle = 'rgba(12, 30, 52, 0.82)';
    fogCtx.fillRect(0, 0, SIZE, SIZE);
    fog.current = fogCv;

    let raf = 0;
    const draw = () => {
      const { x, z } = posRef.current;
      const { mx, my } = toMap(x, z);

      // Reveal around the boat (accumulates).
      fogCtx.globalCompositeOperation = 'destination-out';
      const grad = fogCtx.createRadialGradient(mx, my, 0, mx, my, REVEAL);
      grad.addColorStop(0, 'rgba(0,0,0,1)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      fogCtx.fillStyle = grad;
      fogCtx.beginPath();
      fogCtx.arc(mx, my, REVEAL, 0, Math.PI * 2);
      fogCtx.fill();
      fogCtx.globalCompositeOperation = 'source-over';

      // Sea base.
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.fillStyle = '#2f6f99';
      ctx.fillRect(0, 0, SIZE, SIZE);

      // Islands.
      const dk = dockedRef.current;
      for (let i = 0; i < stations.length; i++) {
        const s = stations[i];
        const p = toMap(s.position[0], s.position[2]);
        ctx.beginPath();
        ctx.arc(p.mx, p.my, i === dk ? 6 : 4.5, 0, Math.PI * 2);
        ctx.fillStyle = s.accent;
        ctx.fill();
        if (i === dk) {
          ctx.lineWidth = 2;
          ctx.strokeStyle = '#ffffff';
          ctx.stroke();
        }
      }

      // Fog overlay (hides unexplored sea + islands).
      ctx.drawImage(fogCv, 0, 0);

      // Boat marker (triangle pointing along heading).
      const a = (headingRef.current * Math.PI) / 180;
      ctx.save();
      ctx.translate(mx, my);
      ctx.rotate(a);
      ctx.beginPath();
      ctx.moveTo(0, -6);
      ctx.lineTo(4.5, 5);
      ctx.lineTo(-4.5, 5);
      ctx.closePath();
      ctx.fillStyle = '#fff';
      ctx.strokeStyle = '#1a1028';
      ctx.lineWidth = 1.5;
      ctx.fill();
      ctx.stroke();
      ctx.restore();

      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(raf);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="minimap" aria-hidden>
      <canvas ref={canvas} width={SIZE} height={SIZE} />
    </div>
  );
}
