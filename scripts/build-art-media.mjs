// Builds the comics and motion pages' media from Sejal's source folders (career/portfolio-pixel inventory, the
// comics-video finals, the #futureofhr render and the launch film). Re-run after a source changes.
// Usage: node scripts/build-art-media.mjs   (needs ffmpeg on PATH)
import { execFileSync } from "node:child_process";
import { mkdirSync } from "node:fs";
import { homedir } from "node:os";
import sharp from "sharp";

const H = homedir();
const INV = `${H}/Documents/career/portfolio-pixel/inventory`;
const OUT = "public/images/comics";
mkdirSync(OUT, { recursive: true });
mkdirSync("public/video/motion", { recursive: true });

// [name, source, crop top, crop height (null = to the end), display width]
const PANELS = [
  ["olc-kaboom", `${INV}/external/webtoon/ep1-excerpt-b-slices49-52-ka-boom.jpg`, 480, 2080, 800],
  ["olc-whoosh", `${INV}/external/webtoon/ep1-excerpt-a-slices09-11-motivation.jpg`, 1650, null, 800],
  ["olc-finale", `${INV}/external/webtoon/ep1-excerpt-c-slices58-61-finale-title.jpg`, 200, 2750, 800],
  ["lastover-p1", `${INV}/drive/TheAlterOffice/PAGE 1.png`, 0, null, 1240],
  ["lastover-p2", `${INV}/drive/TheAlterOffice/PAGE 2.png`, 0, null, 1240],
  ["pt-smack", `${INV}/drive/pfm/preg news/2.png`, 0, 1420, 800],
  ["pt-ah", `${INV}/drive/pfm/preg news/8.png`, 0, 1420, 800],
  ["pt-airport", `${INV}/drive/pfm/preg news/12.png`, 0, 1420, 800],
  ["pt-grit", `${INV}/drive/pfm/fiance puked/2.png`, 0, 1420, 800],
  ["pt-reddoor", `${INV}/drive/pfm/angela mocking/4.png`, 0, 1420, 800],
  ["pt-anthony", `${INV}/drive/pfm/angela mocking/11.png`, 0, 1420, 800],
  ["pt-flip-1", `${INV}/drive/pfm/rh wish i could see/19.png`, 0, null, 540],
  ["pt-flip-2", `${INV}/drive/pfm/rh wish i could see/20.png`, 0, null, 540],
  ["pt-flip-3", `${INV}/drive/pfm/rh wish i could see/21.png`, 0, null, 540],
  ["pt-flip-4", `${INV}/drive/pfm/rh wish i could see/22.png`, 0, null, 540],
  ["pt-eye-1", `${INV}/drive/pfm/stun app/PANEL 1.png`, 0, null, 540],
  ["pt-eye-2", `${INV}/drive/pfm/stun app/PANEL 2.png`, 0, null, 540],
  ["pt-eye-3", `${INV}/drive/pfm/stun app/PANEL 5.png`, 0, null, 540],
  ["pt-eye-4", `${INV}/drive/pfm/stun app/PANEL 6.png`, 0, null, 540],
];

for (const [name, src, top, height, width] of PANELS) {
  const meta = await sharp(src).metadata();
  const h = height ?? meta.height - top;
  for (const w of [width, width * 2]) {
    if (w > meta.width * 1.05 && w !== width) continue; // never upscale the 2x
    await sharp(src).extract({ left: 0, top, width: meta.width, height: Math.min(h, meta.height - top) }).resize({ width: Math.min(w, meta.width) }).webp({ quality: 80 }).toFile(`${OUT}/${name}-${w}.webp`);
  }
  console.log("panel", name);
}

const ff = (...args) => execFileSync("ffmpeg", ["-loglevel", "error", "-y", ...args], { stdio: "inherit" });
const COMICS = `${H}/Desktop/to-personal-drive/comics/final-videos`;
// [name, source, start, end (null = whole), width, height]
const VIDEOS = [
  ["comic-ep1", `${COMICS}/EP001 loop - final.mp4`, 0, null, 720, 1280],
  ["comic-ep2", `${COMICS}/EP002 graph engineering - final.mp4`, 0, null, 720, 1280],
  ["comic-ep3", `${COMICS}/EP003 remote control - final (v20).mp4`, 0, null, 720, 1280],
  ["comic-ep4", `${COMICS}/EP004 insights - final (v8).mp4`, 0, null, 720, 1280],
  ["comic-ep5", `${COMICS}/EP005 system one model - final (v8).mp4`, 0, null, 720, 1280],
  ["comic-pe", `${COMICS}/Prompt engineering - final (v3).mp4`, 0, null, 720, 1280],
  ["futureofhr-full", `${H}/Documents/instahyre-launch-video/out/futureofhr-launch.mp4`, 0, null, 864, 1080],
  // Launch film: only stretches where the product is neither said (checked with a transcript) nor shown.
  ["film-question", `${H}/Documents/tetriz-launch-video-v4.2/out/tetriz-launch-v5.mp4`, 3.5, 18.3, 1280, 720],
  ["film-harness", `${H}/Documents/tetriz-launch-video-v4.2/out/tetriz-launch-v5.mp4`, 51.5, 68.8, 1280, 720],
  ["film-coaching", `${H}/Documents/tetriz-launch-video-v4.2/out/tetriz-launch-v5.mp4`, 95, 112.5, 1280, 720],
];
for (const [name, src, start, end, w, h] of VIDEOS) {
  const cut = end === null ? [] : ["-ss", String(start), "-to", String(end)];
  const out = `public/video/motion/${name}.mp4`;
  ff(...cut, "-i", src, "-vf", `scale=${w}:${h}:force_original_aspect_ratio=decrease,pad=${w}:${h}:(ow-iw)/2:(oh-ih)/2`, "-c:v", "libx264", "-preset", "slow", "-crf", "29", "-pix_fmt", "yuv420p", "-c:a", "aac", "-b:a", "96k", "-af", "afade=t=in:d=0.25", "-movflags", "+faststart", out);
  // Poster: a frame a quarter of the way in.
  const posterAt = end === null ? 2 : 1;
  ff("-ss", String(posterAt), "-i", out, "-frames:v", "1", `/tmp/${name}.png`);
  await sharp(`/tmp/${name}.png`).resize({ width: Math.min(w, 720) }).webp({ quality: 78 }).toFile(`public/video/motion/${name}-poster.webp`);
  console.log("video", name);
}
