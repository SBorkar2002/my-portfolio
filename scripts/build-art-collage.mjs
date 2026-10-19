// Builds public/images/art_collage.webp, the art room background, from the art pieces already in public/images.
// No piece ever sits next to itself: neighbours across, down and diagonally are always different pieces.
// Usage: node scripts/build-art-collage.mjs
import { readdirSync } from "node:fs";
import sharp from "sharp";

const COLS = 9;
const ROWS = 8;
const CELL = 160;
const pieces = readdirSync("public/images")
  .filter((f) => /^a_(ill|com|gra|mot)_\d-280\.webp$/.test(f))
  .sort();

// Small seeded random so the collage is the same on every build.
let seed = 7;
const rand = () => ((seed = (seed * 16807) % 2147483647) - 1) / 2147483646;

const grid = [];
const used = new Map(pieces.map((p) => [p, 0]));
for (let r = 0; r < ROWS; r++) {
  for (let c = 0; c < COLS; c++) {
    const near = [
      [r, c - 1],
      [r - 1, c - 1],
      [r - 1, c],
      [r - 1, c + 1],
    ]
      .filter(([rr, cc]) => rr >= 0 && cc >= 0 && cc < COLS)
      .map(([rr, cc]) => grid[rr * COLS + cc]);
    const options = pieces.filter((p) => !near.includes(p));
    const least = Math.min(...options.map((p) => used.get(p)));
    const fair = options.filter((p) => used.get(p) === least);
    const pick = fair[Math.floor(rand() * fair.length)];
    used.set(pick, used.get(pick) + 1);
    grid.push(pick);
  }
}

// Check the rule before writing.
for (let r = 0; r < ROWS; r++)
  for (let c = 0; c < COLS; c++) {
    const me = grid[r * COLS + c];
    for (const [dr, dc] of [[0, 1], [1, -1], [1, 0], [1, 1]]) {
      const rr = r + dr;
      const cc = c + dc;
      if (rr < ROWS && cc >= 0 && cc < COLS && grid[rr * COLS + cc] === me) throw new Error(`duplicate next to ${me}`);
    }
  }

const tiles = await Promise.all(
  grid.map(async (p, i) => ({
    input: await sharp(`public/images/${p}`).resize(CELL, CELL, { fit: "cover" }).toBuffer(),
    left: (i % COLS) * CELL,
    top: Math.floor(i / COLS) * CELL,
  })),
);
await sharp({ create: { width: COLS * CELL, height: ROWS * CELL, channels: 3, background: "#000" } })
  .composite(tiles)
  .webp({ quality: 72 })
  .toFile("public/images/art_collage.webp");
console.log(`art_collage.webp ${COLS * CELL}x${ROWS * CELL} from ${pieces.length} pieces`, Object.fromEntries(used));
