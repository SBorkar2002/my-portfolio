import type { CSSProperties } from "react";
import { PixelStar } from "./Hero";

// Positions in the side gutters of selected work: [side, top %, size px, delay s]. The left ones sit outside the
// section rail's column.
// Right gutter only: the section rail lives in the left one. [top %, size px, inset from the right px, delay s].
const STARS: [number, number, number, number][] = [
  [6, 40, 40, 0],
  [22, 24, 78, 1.4],
  [38, 34, 26, 0.6],
  [55, 26, 74, 2.1],
  [71, 40, 36, 1.1],
  [88, 24, 70, 2.6],
];
// Vertical pipelines with a light travelling down them: [inset from the right px, duration s, delay s].
const LINES: [number, number, number][] = [
  [30, 7, 0],
  [62, 9, 2.5],
  [94, 8, 4.2],
];

/** Selected work right gutter: twinkling pixel stars and light pipelines, the hero's motifs. Wide screens only, decorative. */
export function GutterSky() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 hidden overflow-hidden xl:block">
      {LINES.map(([right, dur, delay], i) => (
        <span key={`l${i}`} className="gutter-line" style={{ right, "--dur": `${dur}s`, "--delay": `${delay}s` } as CSSProperties} />
      ))}
      {STARS.map(([top, size, right, delay], i) => (
        <span
          key={`s${i}`}
          className="gutter-star absolute text-lilac"
          style={{ right: right - size / 2, top: `${top}%`, "--delay": `${delay}s` } as CSSProperties}
        >
          <PixelStar size={size} />
        </span>
      ))}
    </div>
  );
}
