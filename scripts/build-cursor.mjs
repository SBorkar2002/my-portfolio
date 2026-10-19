// Draws the pixel fish-cookie cursor (16 x 16 sprite pixels) and writes it at 32 and 64 px to public/cursors.
// The fish points up and to the left; the hotspot is its nose, sprite pixel (1, 1).
// Usage: node scripts/build-cursor.mjs
import sharp from "sharp";

const N = 16;
const COLORS = { o: [74, 42, 20], c: [214, 150, 86], h: [242, 196, 132], d: [58, 30, 14] };
const grid = Array.from({ length: N }, () => Array(N).fill("."));
const inside = (x, y) => {
  const px = x + 0.5;
  const py = y + 0.5;
  const along = (px + py) / Math.SQRT2;
  const perp = (px - py) / Math.SQRT2;
  const body = ((along - 8.2) / 6.6) ** 2 + (perp / 3.9) ** 2 <= 1;
  const tail = along >= 14.2 && along <= 19.2 && Math.abs(perp) <= (along - 14.2) * 0.85 + 0.6;
  return body || tail;
};
for (let y = 0; y < N; y++) for (let x = 0; x < N; x++) if (inside(x, y)) grid[y][x] = "c";
// Outline: any filled pixel next to an empty one.
const filled = (x, y) => x >= 0 && y >= 0 && x < N && y < N && grid[y][x] !== ".";
const edge = [];
for (let y = 0; y < N; y++)
  for (let x = 0; x < N; x++)
    if (filled(x, y) && (!filled(x - 1, y) || !filled(x + 1, y) || !filled(x, y - 1) || !filled(x, y + 1))) edge.push([x, y]);
for (const [x, y] of edge) grid[y][x] = "o";
// Eye near the nose, a highlight along the top, two chocolate chips.
const put = (x, y, k) => grid[y][x] !== "." && grid[y][x] !== "o" && (grid[y][x] = k);
put(4, 3, "d");
[[5, 2], [6, 3], [7, 3], [8, 4]].forEach(([x, y]) => put(x, y, "h"));
put(8, 7, "d");
put(6, 9, "d");
put(10, 8, "d");

console.log(grid.map((r) => r.join("")).join("\n"));
const raw = Buffer.alloc(N * N * 4);
grid.forEach((r, y) =>
  r.forEach((k, x) => {
    const i = (y * N + x) * 4;
    if (k === ".") return;
    raw.set([...COLORS[k], 255], i);
  }),
);
for (const size of [32, 64])
  await sharp(raw, { raw: { width: N, height: N, channels: 4 } })
    .resize(size, size, { kernel: "nearest" })
    .png()
    .toFile(`public/cursors/fish-cookie-${size}.png`);
