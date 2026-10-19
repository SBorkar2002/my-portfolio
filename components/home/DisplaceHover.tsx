"use client";

import { useEffect } from "react";

/** Displacement hover for the work tile images: a short pixel ripple that settles back to the clean image.
    One SVG filter, driven per hover. Off for reduced motion and touch. */
export function DisplaceHover() {
  useEffect(() => {
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(pointer: coarse)").matches) return;
    const map = document.getElementById("displace-map");
    if (!map) return;
    let frame = 0;
    let current: HTMLElement | null = null;

    const run = (el: HTMLElement) => {
      cancelAnimationFrame(frame);
      current?.style.removeProperty("filter");
      current = el;
      el.style.filter = "url(#displace)";
      const t0 = performance.now();
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / 520);
        // Stepped decay so it reads as pixels settling, not a smooth blur.
        const scale = Math.round((1 - t) * 6) * 6;
        map.setAttribute("scale", String(scale));
        if (t < 1) frame = requestAnimationFrame(tick);
        else {
          el.style.removeProperty("filter");
          current = null;
        }
      };
      frame = requestAnimationFrame(tick);
    };

    const targets = document.querySelectorAll<HTMLElement>("[data-displace]");
    const enter = (e: Event) => run(e.currentTarget as HTMLElement);
    targets.forEach((el) => el.addEventListener("pointerenter", enter));
    return () => {
      cancelAnimationFrame(frame);
      targets.forEach((el) => el.removeEventListener("pointerenter", enter));
    };
  }, []);

  return (
    <svg aria-hidden="true" width="0" height="0" className="absolute">
      <filter id="displace" x="0" y="0" width="100%" height="100%">
        <feTurbulence type="fractalNoise" baseFrequency="0.02 0.18" numOctaves="1" seed="4" result="noise" />
        <feDisplacementMap id="displace-map" in="SourceGraphic" in2="noise" scale="0" xChannelSelector="R" yChannelSelector="G" />
      </filter>
    </svg>
  );
}
