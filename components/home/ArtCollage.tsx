"use client";

import { useEffect, useRef } from "react";

/** Art room background: her drawings, comics and graphics as a dark, low-opacity collage.
    A spotlight follows the pointer and reveals the art under it. Static for reduced motion and touch. */
export function ArtCollage() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    const section = el?.parentElement;
    if (!el || !section || matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(pointer: coarse)").matches) return;
    let frame = 0;
    const move = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--sx", `${e.clientX - r.left}px`);
        el.style.setProperty("--sy", `${e.clientY - r.top}px`);
        el.dataset.lit = "1";
      });
    };
    const leave = () => delete el.dataset.lit;
    section.addEventListener("pointermove", move);
    section.addEventListener("pointerleave", leave);
    return () => {
      section.removeEventListener("pointermove", move);
      section.removeEventListener("pointerleave", leave);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div ref={ref} aria-hidden="true" className="art-collage pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="art-collage-dim absolute inset-0" />
      <div className="art-collage-lit absolute inset-0" />
    </div>
  );
}
