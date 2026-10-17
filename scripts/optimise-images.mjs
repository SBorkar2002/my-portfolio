// Turns source images into the WebP files the site serves from public/images.
// Usage: node scripts/optimise-images.mjs <source-dir> <name:displayWidth> [...]
// Each image is written at 1x and 2x of its display width (never upscaled),
// for example lead-intro-320.webp and lead-intro-640.webp.
import sharp from "sharp";
import { existsSync, mkdirSync } from "node:fs";
import path from "node:path";

const [srcDir, ...specs] = process.argv.slice(2);
if (!srcDir || specs.length === 0) {
  console.error("usage: node scripts/optimise-images.mjs <source-dir> <name:displayWidth> ...");
  process.exit(1);
}

const outDir = path.join(process.cwd(), "public", "images");
mkdirSync(outDir, { recursive: true });

for (const spec of specs) {
  const [name, widthText] = spec.split(":");
  const display = Number(widthText);
  const src = ["png", "jpg", "jpeg", "webp"]
    .map((ext) => path.join(srcDir, `${name}.${ext}`))
    .find((p) => existsSync(p));
  if (!src) {
    console.error(`missing source for ${name}`);
    process.exitCode = 1;
    continue;
  }
  const meta = await sharp(src).metadata();
  for (const scale of [1, 2]) {
    const width = Math.min(display * scale, meta.width ?? display * scale);
    const out = path.join(outDir, `${name}-${display * scale}.webp`);
    const info = await sharp(src)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 80, effort: 6 })
      .toFile(out);
    console.log(`${path.basename(out)} ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`);
  }
}
