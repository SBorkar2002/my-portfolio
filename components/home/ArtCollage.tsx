"use client";

import { useEffect, useRef } from "react";

const CELL = 28;
const RADIUS = 76;
const FALL_MS = 520;
const OPEN_MS = 1300;
const FREEZE_MS = 320;

/** Art room background: her art as a collage (no piece next to itself), hidden under a pixel grid like ice.
    Under the pointer the pixels crack and fall away to show the art, then freeze back over after a moment.
    One canvas, animated only while something is cracking. Reduced motion shows the art faintly with no grid. */
export function ArtCollage() {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const section = canvas?.closest("section");
    if (!canvas || !section || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    canvas.hidden = false;
    canvas.parentElement!.dataset.ice = "";
    const g = canvas.getContext("2d")!;
    let cols = 0;
    let rows = 0;
    let dpr = 1;
    let broke = new Float64Array(0); // 0 = frozen, otherwise the time the cell cracked
    let delay = new Float32Array(0); // a little randomness per cell so it refreezes unevenly
    let frame = 0;
    let colors = { ice: "#fff", edge: "#000", crack: "#000" };

    const readColors = () => {
      const st = getComputedStyle(document.documentElement);
      colors = {
        ice: st.getPropertyValue("--bg-base").trim() || "#f3f0fa",
        edge: st.getPropertyValue("--line").trim() || "#d4cde4",
        crack: st.getPropertyValue("--pastel-lilac").trim() || "#c3b5ff",
      };
    };

    const size = () => {
      dpr = Math.min(2, window.devicePixelRatio || 1);
      const w = section.clientWidth;
      const h = section.clientHeight;
      canvas.width = Math.ceil(w * dpr);
      canvas.height = Math.ceil(h * dpr);
      cols = Math.ceil(w / CELL);
      rows = Math.ceil(h / CELL);
      broke = new Float64Array(cols * rows);
      delay = new Float32Array(cols * rows).map(() => Math.random() * 600);
      draw(performance.now());
    };

    function draw(now: number) {
      g.setTransform(dpr, 0, 0, dpr, 0, 0);
      g.fillStyle = colors.ice;
      g.fillRect(0, 0, cols * CELL, rows * CELL);
      // Faint pixel grid so the ice reads as pixels.
      g.fillStyle = colors.edge;
      g.globalAlpha = 0.45;
      for (let c = 1; c < cols; c++) g.fillRect(c * CELL, 0, 1, rows * CELL);
      for (let r = 1; r < rows; r++) g.fillRect(0, r * CELL, cols * CELL, 1);
      g.globalAlpha = 1;
      let active = false;
      for (let i = 0; i < broke.length; i++) {
        const t0 = broke[i];
        if (!t0) continue;
        const age = now - t0;
        if (age < 0) continue;
        const x = (i % cols) * CELL;
        const y = Math.floor(i / cols) * CELL;
        const open = OPEN_MS + delay[i];
        if (age > open + FREEZE_MS) {
          broke[i] = 0;
          continue;
        }
        active = true;
        g.clearRect(x, y, CELL, CELL);
        if (age < FALL_MS) {
          // The pixel drops and shrinks (no rotation), with a lilac crack edge.
          const p = age / FALL_MS;
          const s = Math.round(CELL * (1 - p * 0.7));
          const fx = x + (CELL - s) / 2;
          const fy = y + p * p * CELL * 2.2;
          g.globalAlpha = 1 - p;
          g.fillStyle = colors.crack;
          g.fillRect(fx - 1, fy - 1, s + 2, s + 2);
          g.fillStyle = colors.ice;
          g.fillRect(fx, fy, s, s);
          g.globalAlpha = 1;
        } else if (age > open) {
          // Refreezing: the pixel grows back from its centre.
          const p = (age - open) / FREEZE_MS;
          const s = Math.round(CELL * p);
          g.fillStyle = colors.ice;
          g.fillRect(x + (CELL - s) / 2, y + (CELL - s) / 2, s, s);
        }
      }
      return active;
    }

    const loop = () => {
      frame = 0;
      if (draw(performance.now())) frame = requestAnimationFrame(loop);
    };

    const crack = (e: PointerEvent) => {
      const r = canvas.getBoundingClientRect();
      const px = e.clientX - r.left;
      const py = e.clientY - r.top;
      const now = performance.now();
      const c0 = Math.max(0, Math.floor((px - RADIUS) / CELL));
      const c1 = Math.min(cols - 1, Math.floor((px + RADIUS) / CELL));
      const r0 = Math.max(0, Math.floor((py - RADIUS) / CELL));
      const r1 = Math.min(rows - 1, Math.floor((py + RADIUS) / CELL));
      for (let rr = r0; rr <= r1; rr++)
        for (let cc = c0; cc <= c1; cc++) {
          const d = Math.hypot(cc * CELL + CELL / 2 - px, rr * CELL + CELL / 2 - py);
          const i = rr * cols + cc;
          if (d > RADIUS) continue;
          // Cells already open stay open while the pointer is over them; frozen ones crack outwards from the pointer.
          const age = broke[i] ? now - broke[i] : Infinity;
          if (age === Infinity) broke[i] = now + d * 2.2;
          else if (age > FALL_MS) broke[i] = now - FALL_MS;
        }
      if (!frame) frame = requestAnimationFrame(loop);
    };

    readColors();
    size();
    const resize = new ResizeObserver(size);
    resize.observe(section);
    const theme = new MutationObserver(() => {
      readColors();
      draw(performance.now());
    });
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    section.addEventListener("pointermove", crack, { passive: true });
    section.addEventListener("pointerdown", crack, { passive: true });
    return () => {
      resize.disconnect();
      theme.disconnect();
      section.removeEventListener("pointermove", crack);
      section.removeEventListener("pointerdown", crack);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="art-collage absolute inset-0" />
      <canvas ref={ref} hidden className="absolute inset-0 size-full" />
    </div>
  );
}
