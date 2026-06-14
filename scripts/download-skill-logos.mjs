// Downloads brand logos (Devicon, MIT-licensed) for the Skills game crates.
// Items without a brand logo get a custom canvas glyph at runtime instead.
import { mkdir, writeFile } from 'fs/promises';

const OUT = 'public/logos';
const CDN = 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons';

// slug -> candidate file names (first that exists wins)
const LOGOS = {
  react: ['react-original'],
  nextjs: ['nextjs-original'],
  typescript: ['typescript-original'],
  nodejs: ['nodejs-original'],
  express: ['express-original'],
  spring: ['spring-original'],
  postgresql: ['postgresql-original'],
  mongodb: ['mongodb-original'],
  mysql: ['mysql-original'],
  redis: ['redis-original'],
  prisma: ['prisma-original'],
  docker: ['docker-original'],
  prometheus: ['prometheus-original'],
  grafana: ['grafana-original'],
  cplusplus: ['cplusplus-original'],
  java: ['java-original'],
  python: ['python-original'],
  javascript: ['javascript-original'],
  bash: ['bash-original'],
};

await mkdir(OUT, { recursive: true });

let ok = 0;
let fail = 0;
for (const [slug, candidates] of Object.entries(LOGOS)) {
  let saved = false;
  for (const file of candidates) {
    const url = `${CDN}/${slug}/${file}.svg`;
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const svg = await res.text();
      await writeFile(`${OUT}/${slug}.svg`, svg, 'utf8');
      console.log('ok  ', slug);
      saved = true;
      ok++;
      break;
    } catch {
      /* try next candidate */
    }
  }
  if (!saved) {
    console.warn('MISS', slug);
    fail++;
  }
}
console.log(`\n${ok} downloaded, ${fail} missing`);
