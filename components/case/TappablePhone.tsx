"use client";

import { useEffect, useRef, useState } from "react";
import { SCREEN_H, SCREEN_W, screenSrc, screens } from "@/lib/sourcedApp";

type Size = "hero" | "small";

// Phone frames from Figma: hero 340 x 732 (55:757), decision phones 256 x 550 (56:754).
const frame: Record<Size, { w: number; radius: number; inner: number; inset: number; shadow: string }> = {
  hero: { w: 340, radius: 40, inner: 32, inset: 8, shadow: "8px 8px 0 0 var(--pastel-lilac)" },
  small: { w: 256, radius: 34, inner: 26, inset: 6, shadow: "6px 6px 0 0 var(--line)" },
};

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

/** One phone running the exported Sourced screens with the prototype's hotspots.
    Tapping a hotspot moves to its target screen with a 0.25s dissolve, like the Figma prototype. */
export function TappablePhone({ start, size = "small", label }: { start: number; size?: Size; label: string }) {
  const [current, setCurrent] = useState(start);
  const [previous, setPrevious] = useState<number | null>(null);
  const [hint, setHint] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  const hintTimer = useRef<number | undefined>(undefined);
  const screen = screens[current];
  const f = frame[size];

  // Warm the cache for every screen this one links to, so taps feel instant.
  useEffect(() => {
    for (const [, , , , , to] of screen.hotspots) {
      const img = new Image();
      img.src = screenSrc(to);
    }
  }, [screen]);

  useEffect(
    () => () => {
      window.clearTimeout(timer.current);
      window.clearTimeout(hintTimer.current);
    },
    [],
  );

  function go(to: number) {
    if (to === current) return;
    window.clearTimeout(timer.current);
    setPrevious(current);
    setCurrent(to);
    timer.current = window.setTimeout(() => setPrevious(null), 260);
  }

  function showHint() {
    setHint(true);
    window.clearTimeout(hintTimer.current);
    hintTimer.current = window.setTimeout(() => setHint(false), 700);
  }

  return (
    <div
      className="relative w-full overflow-hidden border-2 border-line bg-[#0b0b0d]"
      style={{ maxWidth: f.w, aspectRatio: size === "hero" ? "340 / 732" : "256 / 550", borderRadius: f.radius, boxShadow: f.shadow }}
    >
      <div
        role="group"
        aria-label={`${label}. Sourced prototype, screen: ${screen.name}`}
        className="absolute overflow-hidden"
        style={{ inset: f.inset, borderRadius: f.inner }}
        onClick={(e) => {
          if (e.target === e.currentTarget || (e.target as HTMLElement).tagName === "IMG") showHint();
        }}
      >
        {previous !== null && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={screenSrc(previous)} alt="" aria-hidden="true" className="absolute inset-0 size-full object-cover" />
        )}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          key={current}
          src={screenSrc(current)}
          alt={`Sourced app: ${screen.name}`}
          width={SCREEN_W}
          height={SCREEN_H}
          loading={size === "hero" ? "eager" : "lazy"}
          decoding="async"
          className={`absolute inset-0 size-full object-cover ${previous !== null ? "animate-[dissolve_250ms_ease-out]" : ""}`}
        />
        {screen.hotspots.map(([text, x, y, w, h, to], i) => (
          <button
            key={`${current}-${i}`}
            type="button"
            aria-label={text}
            onClick={() => go(to)}
            className={`absolute cursor-pointer rounded-md outline-offset-0 transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-lilac ${
              hint ? "bg-[color-mix(in_srgb,var(--pastel-lilac)_35%,transparent)]" : "bg-transparent"
            }`}
            style={{ left: pct(x, SCREEN_W), top: pct(y, SCREEN_H), width: pct(w, SCREEN_W), height: pct(h, SCREEN_H) }}
          />
        ))}
      </div>
      <span className="sr-only" aria-live="polite">
        {screen.name}
      </span>
    </div>
  );
}
