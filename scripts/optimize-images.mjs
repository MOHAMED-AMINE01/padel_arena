import sharp from 'sharp';
import { readdir, stat, rename, unlink } from 'node:fs/promises';
import path from 'node:path';

const ROOT = path.resolve('public/IMAGES');
const MAX_DIM = 2000;          // cap longest side (largement suffisant, écrans retina inclus)
const JPEG_Q = 80;
const PNG_Q = 80;

const exts = new Set(['.jpg', '.jpeg', '.png']);

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) files.push(...(await walk(full)));
    else if (exts.has(path.extname(e.name).toLowerCase())) files.push(full);
  }
  return files;
}

function fmt(bytes) {
  return (bytes / 1024).toFixed(0) + ' KB';
}

let totalBefore = 0, totalAfter = 0;

const files = await walk(ROOT);
for (const file of files) {
  const ext = path.extname(file).toLowerCase();
  const before = (await stat(file)).size;
  const tmp = file + '.tmp';
  try {
    const img = sharp(file, { failOn: 'none' });
    const meta = await img.metadata();
    const longest = Math.max(meta.width || 0, meta.height || 0);
    let pipeline = img.rotate(); // respecte l'orientation EXIF
    if (longest > MAX_DIM) {
      pipeline = pipeline.resize({ width: MAX_DIM, height: MAX_DIM, fit: 'inside', withoutEnlargement: true });
    }
    if (ext === '.png') {
      pipeline = pipeline.png({ quality: PNG_Q, compressionLevel: 9, palette: true, effort: 8 });
    } else {
      pipeline = pipeline.jpeg({ quality: JPEG_Q, mozjpeg: true, progressive: true });
    }
    await pipeline.toFile(tmp);
    const after = (await stat(tmp)).size;
    // On ne remplace que si on gagne réellement de la place
    if (after < before) {
      await rename(tmp, file);
      totalBefore += before; totalAfter += after;
      console.log(`✓ ${path.relative(ROOT, file)}  ${fmt(before)} -> ${fmt(after)}  (-${Math.round((1 - after / before) * 100)}%)`);
    } else {
      await unlink(tmp);
      totalBefore += before; totalAfter += before;
      console.log(`= ${path.relative(ROOT, file)}  ${fmt(before)} (déjà optimal)`);
    }
  } catch (err) {
    try { await unlink(tmp); } catch {}
    console.log(`✗ ${path.relative(ROOT, file)}  ERREUR: ${err.message}`);
  }
}

console.log(`\nTOTAL: ${fmt(totalBefore)} -> ${fmt(totalAfter)}  (-${Math.round((1 - totalAfter / totalBefore) * 100)}%)`);
