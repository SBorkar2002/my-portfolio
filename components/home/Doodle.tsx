"use client";

import { useEffect, useRef, useState } from "react";

const PX = 6;

/** Doodle mode, contact section only: drag anywhere that is not a link or button to draw chunky pixels.
    On by default with a mouse or pen; on touch it starts off so the page still scrolls, and the toggle turns it on. */
export function Doodle() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [on, setOn] = useState(true);
  const [inked, setInked] = useState(false);

  useEffect(() => {
    if (matchMedia("(pointer: coarse)").matches) setOn(false);
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    const section = canvas?.closest("section");
    if (!canvas || !section) return;
    const g = canvas.getContext("2d")!;
    let dpr = 1;
    const size = () => {
      // Keep what is drawn when the section changes size.
      const old = document.createElement("canvas");
      old.width = canvas.width;
      old.height = canvas.height;
      if (canvas.width) old.getContext("2d")!.drawImage(canvas, 0, 0);
      dpr = Math.min(2, window.devicePixelRatio || 1);
      canvas.width = Math.ceil(section.clientWidth * dpr);
      canvas.height = Math.ceil(section.clientHeight * dpr);
      g.imageSmoothingEnabled = false;
      g.drawImage(old, 0, 0);
    };
    size();
    const resize = new ResizeObserver(size);
    resize.observe(section);
    return () => resize.disconnect();
  }, []);

  useEffect(() => {
    const canvas = ref.current;
    const section = canvas?.closest("section");
    if (!canvas || !section || !on) return;
    const g = canvas.getContext("2d")!;
    section.style.touchAction = "none";
    let last: [number, number] | null = null;
    let id = -1;
    const cell = (e: PointerEvent): [number, number] => {
      const r = canvas.getBoundingClientRect();
      return [Math.floor((e.clientX - r.left) / PX), Math.floor((e.clientY - r.top) / PX)];
    };
    const dot = (cx: number, cy: number) => {
      const d = canvas.width / canvas.getBoundingClientRect().width;
      g.fillRect(Math.round(cx * PX * d), Math.round(cy * PX * d), Math.ceil(PX * d), Math.ceil(PX * d));
    };
    // Bresenham between pointer samples so fast strokes stay connected.
    const line = (a: [number, number], b: [number, number]) => {
      let [x0, y0] = a;
      const [x1, y1] = b;
      const dx = Math.abs(x1 - x0);
      const dy = -Math.abs(y1 - y0);
      const sx = x0 < x1 ? 1 : -1;
      const sy = y0 < y1 ? 1 : -1;
      let err = dx + dy;
      for (;;) {
        dot(x0, y0);
        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * err;
        if (e2 >= dy) {
          err += dy;
          x0 += sx;
        }
        if (e2 <= dx) {
          err += dx;
          y0 += sy;
        }
      }
    };
    const down = (e: PointerEvent) => {
      if (e.button !== 0 || (e.target as Element).closest("a, button, input, label, [data-no-doodle]")) return;
      e.preventDefault();
      id = e.pointerId;
      section.setPointerCapture(id);
      g.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--accent-ink").trim() || "#5b47d6";
      last = cell(e);
      dot(...last);
      setInked(true);
    };
    const move = (e: PointerEvent) => {
      if (e.pointerId !== id || !last) return;
      const next = cell(e);
      line(last, next);
      last = next;
    };
    const up = (e: PointerEvent) => {
      if (e.pointerId !== id) return;
      id = -1;
      last = null;
    };
    section.addEventListener("pointerdown", down);
    section.addEventListener("pointermove", move);
    section.addEventListener("pointerup", up);
    section.addEventListener("pointercancel", up);
    return () => {
      section.style.touchAction = "";
      section.removeEventListener("pointerdown", down);
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerup", up);
      section.removeEventListener("pointercancel", up);
    };
  }, [on]);

  const clear = () => {
    const c = ref.current;
    c?.getContext("2d")!.clearRect(0, 0, c.width, c.height);
    setInked(false);
  };

  return (
    <>
      <canvas ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 size-full [image-rendering:pixelated]" />
      <ToolButton label={on ? "Doodle mode on: drag anywhere to draw. Turn off" : "Turn on doodle mode"} pressed={on} onClick={() => setOn((v) => !v)}>
        <PixelGlyph rows={PENCIL} />
      </ToolButton>
      <ToolButton label="Clear the doodle" onClick={clear} disabled={!inked}>
        <PixelGlyph rows={ERASER} />
      </ToolButton>
    </>
  );
}

// 12 x 12 pixel glyphs, '#' filled.
const PENCIL = [
  "........##..",
  ".......####.",
  "......#.####",
  ".....#...##.",
  "....#...#...",
  "...#...#....",
  "..#...#.....",
  ".#...#......",
  ".#..#.......",
  ".###........",
  "##..........",
  "............",
];
const ERASER = [
  "......###...",
  ".....#####..",
  "....#######.",
  "...#######..",
  "..#.#####...",
  ".#...###....",
  "#.....#.....",
  ".#...#......",
  "..###.......",
  "............",
  "..########..",
  "............",
];
export const ARROW_UP = [
  ".....##.....",
  "....####....",
  "...######...",
  "..##.##.##..",
  ".##..##..##.",
  ".....##.....",
  ".....##.....",
  ".....##.....",
  ".....##.....",
  ".....##.....",
  ".....##.....",
  "............",
];

export function PixelGlyph({ rows }: { rows: string[] }) {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 12 12" shapeRendering="crispEdges">
      {rows.flatMap((r, y) => [...r].map((c, x) => (c === "#" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" /> : null)))}
    </svg>
  );
}

/** Square icon button with a label that shows on hover and focus. */
export function ToolButton({
  label,
  pressed,
  disabled,
  onClick,
  children,
}: {
  label: string;
  pressed?: boolean;
  disabled?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      aria-pressed={pressed}
      disabled={disabled}
      onClick={onClick}
      className={`flex size-11 items-center justify-center border-2 border-line shadow-[0_2px_0_0_var(--line)] transition-colors disabled:opacity-40 ${
        pressed ? "bg-ink text-page" : "bg-raised text-primary hover:text-ink"
      }`}
    >
      {children}
    </button>
  );
}
