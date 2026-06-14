// Downloads CC0 stylized / cartoon island ground textures (OpenGameArt, CC0).
import { mkdir } from 'fs/promises';
import { createWriteStream } from 'fs';
import { pipeline } from 'stream/promises';

const OUT = 'public/textures';
const FILES = [
  {
    out: 'grass-stylized.jpg',
    url: 'https://opengameart.org/sites/default/files/Stylized_Grass_Texture.jpg',
  },
  {
    out: 'grass-cartoon.jpg',
    url: 'https://opengameart.org/sites/default/files/grass.jpg',
  },
  {
    out: 'sand-cartoon.jpg',
    url: 'https://opengameart.org/sites/default/files/sand.jpg',
  },
  {
    out: 'grass-brush-a.png',
    url: 'https://opengameart.org/sites/default/files/grassbrushcc001.png',
  },
  {
    out: 'grass-brush-b.png',
    url: 'https://opengameart.org/sites/default/files/grassbrushcc002.png',
  },
  {
    out: 'grass-brush-c.png',
    url: 'https://opengameart.org/sites/default/files/grassbrushcc003.png',
  },
  {
    out: 'grass-brush-d.png',
    url: 'https://opengameart.org/sites/default/files/grassbrushcc004.png',
  },
];

await mkdir(OUT, { recursive: true });

for (const { out, url } of FILES) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed ${url}: ${res.status}`);
  const dest = `${OUT}/${out}`;
  await pipeline(res.body, createWriteStream(dest));
  console.log('wrote', dest);
}
