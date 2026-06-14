import * as THREE from 'three';

// Item -> Devicon slug (files live in public/logos/<slug>.svg).
const LOGO_SLUGS: Record<string, string> = {
  'React.js': 'react',
  'Next.js': 'nextjs',
  TypeScript: 'typescript',
  'Node.js': 'nodejs',
  'Express.js': 'express',
  'Java Spring Boot': 'spring',
  PostgreSQL: 'postgresql',
  MongoDB: 'mongodb',
  MySQL: 'mysql',
  Redis: 'redis',
  Prisma: 'prisma',
  Docker: 'docker',
  Prometheus: 'prometheus',
  Grafana: 'grafana',
  'C++': 'cplusplus',
  Java: 'java',
  Python: 'python',
  JavaScript: 'javascript',
  Bash: 'bash',
};

// Custom glyphs for items with no brand logo.
const GLYPHS: Record<string, string> = {
  'REST APIs': '{ }',
  'CI/CD': '∞',
  OpenTelemetry: '◎',
  Loki: '≋',
  Tempo: '⧗',
  'Data Structures': '⌗',
  OOP: '❖',
  'Operating Systems': '⊞',
  DBMS: '⛁',
  'System Design': '▦',
  'Distributed Systems': '⌬',
};

const texCache = new Map<string, THREE.CanvasTexture>();
const imgCache = new Map<string, HTMLImageElement | null>();

function loadLogo(slug: string, onReady: (img: HTMLImageElement) => void) {
  const cached = imgCache.get(slug);
  if (cached) {
    onReady(cached);
    return;
  }
  if (cached === null) return; // previously failed
  const img = new Image();
  img.onload = () => {
    imgCache.set(slug, img);
    onReady(img);
  };
  img.onerror = () => imgCache.set(slug, null);
  img.src = `/logos/${slug}.svg`;
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

function fitText(ctx: CanvasRenderingContext2D, text: string, maxW: number, startPx: number) {
  let px = startPx;
  do {
    ctx.font = `700 ${px}px Inter, system-ui, sans-serif`;
    if (ctx.measureText(text).width <= maxW) break;
    px -= 2;
  } while (px > 12);
  return px;
}

/** A 256² crate face: brand logo on a chip (or a glyph) over an accent panel + label. */
export function getCrateTexture(item: string, color: string): THREE.CanvasTexture {
  const key = `${item}|${color}`;
  const cached = texCache.get(key);
  if (cached) return cached;

  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 256;
  const ctx = canvas.getContext('2d')!;
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;

  const slug = LOGO_SLUGS[item];

  const draw = (logo?: HTMLImageElement) => {
    ctx.clearRect(0, 0, 256, 256);
    // panel
    const base = new THREE.Color(color);
    ctx.fillStyle = `#${base.clone().offsetHSL(0, 0, -0.18).getHexString()}`;
    roundRect(ctx, 6, 6, 244, 244, 26);
    ctx.fill();
    ctx.fillStyle = `#${base.getHexString()}`;
    roundRect(ctx, 16, 16, 224, 224, 20);
    ctx.fill();

    // logo chip or glyph
    if (logo) {
      ctx.fillStyle = 'rgba(255,255,255,0.94)';
      roundRect(ctx, 58, 36, 140, 140, 24);
      ctx.fill();
      ctx.drawImage(logo, 74, 52, 108, 108);
    } else {
      ctx.fillStyle = 'rgba(255,255,255,0.92)';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.font = '700 96px Inter, system-ui, sans-serif';
      ctx.fillText(GLYPHS[item] ?? item.charAt(0), 128, 104);
    }

    // label
    ctx.fillStyle = 'rgba(255,255,255,0.96)';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const px = fitText(ctx, item, 212, 34);
    ctx.font = `700 ${px}px Inter, system-ui, sans-serif`;
    ctx.fillText(item, 128, 214);

    tex.needsUpdate = true;
  };

  draw();
  if (slug) loadLogo(slug, (img) => draw(img));

  texCache.set(key, tex);
  return tex;
}
