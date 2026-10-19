"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { projects } from "@/lib/projects";
import { LightLines } from "../vendor/light-lines";
import { useChrome } from "../SiteChrome";
import { Button, Keycap } from "../ui";

/** Hero: layered grid + glow backdrop, a mixed serif and pixel headline, and the jump-in panel on floating cards. */
export function Hero() {
  return (
    <section aria-labelledby="hero-title" data-section-index="hero" className="hero-backdrop relative overflow-hidden">
      <HeroBackdrop />
      <div className="relative mx-auto flex max-w-[1440px] flex-col gap-12 px-[clamp(20px,8.333vw,120px)] pt-12 pb-20 lg:flex-row lg:items-center lg:gap-16 lg:pt-24 lg:pb-32">
        <div className="flex min-w-0 flex-1 flex-col items-start gap-7">
          <p className="flex items-center gap-2.5 border-2 border-line bg-raised px-3 py-2">
            <span aria-hidden="true" className="size-2.5 shrink-0 bg-mint" />
            <span className="type-label-s text-muted">CONSULTANT AT EPIFI UNTIL NOV 2026 · OPEN TO PRODUCT DESIGN ROLES</span>
          </p>
          <h1 id="hero-title" className="hero-title text-primary">
            <span className="font-serif">Product </span>
            <span className="pixel-pick">
              designer
              <span aria-hidden="true" className="pick-handle -top-1 -left-1" />
              <span aria-hidden="true" className="pick-handle -top-1 -right-1" />
              <span aria-hidden="true" className="pick-handle -bottom-1 -left-1" />
              <span aria-hidden="true" className="pick-handle -right-1 -bottom-1" />
            </span>
            <br />
            <span className="font-serif text-ink italic">who ships.</span>
          </h1>
          <p className="type-body-l max-w-[560px] bg-page/70 text-primary">
            B2B SaaS, from research to merged pull requests. Drawing since 2020.
          </p>
          <div className="flex flex-wrap items-start gap-4">
            <Button href="#work" label="VIEW WORK" />
            <Button href="#art" label="SEE THE ART" kind="secondary" />
          </div>
        </div>
        <div className="relative w-full shrink-0 lg:w-[400px]">
          {/* Floating layers behind the panel. Decorative, never over text. */}
          <div aria-hidden="true" className="float-slow absolute -top-10 -left-12 hidden h-[260px] w-[300px] border-2 border-line bg-raised bg-[linear-gradient(var(--line)_1px,transparent_1px),linear-gradient(90deg,var(--line)_1px,transparent_1px)] bg-[size:16px_16px] lg:block" />
          <PixelStar className="float-fast absolute -top-20 -left-20 hidden text-lilac lg:block" />
          <span aria-hidden="true" className="float-fast absolute -bottom-10 -left-8 hidden size-4 bg-lime lg:block" />
          <span aria-hidden="true" className="float-slow absolute right-[-36px] bottom-16 hidden size-3 bg-lilac lg:block" />
          <div className="relative">
            <JumpPanel />
          </div>
        </div>
      </div>
    </section>
  );
}

/** Pointer spotlight over the grid. Off for reduced motion and touch. */
function HeroBackdrop() {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current?.parentElement;
    if (!el || matchMedia("(prefers-reduced-motion: reduce)").matches || matchMedia("(pointer: coarse)").matches) return;
    let frame = 0;
    const move = (e: PointerEvent) => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const r = el.getBoundingClientRect();
        el.style.setProperty("--mx", `${e.clientX - r.left}px`);
        el.style.setProperty("--my", `${e.clientY - r.top}px`);
      });
    };
    el.addEventListener("pointermove", move);
    return () => {
      el.removeEventListener("pointermove", move);
      cancelAnimationFrame(frame);
    };
  }, []);
  return (
    <div ref={ref} aria-hidden="true" className="pointer-events-none absolute inset-0 [mask-image:linear-gradient(90deg,transparent_0%,#000_45%)]">
      <div className="hero-grid absolute inset-0" />
      <LightLines
        gradientFrom="transparent"
        gradientTo="transparent"
        lineColor="var(--line)"
        lightColor="var(--pastel-lilac)"
        linesOpacity={0.35}
        lightsOpacity={0.55}
        speedMultiplier={0.5}
      />
      <div className="hero-glow absolute inset-0" />
      <div className="hero-spot absolute inset-0" />
    </div>
  );
}

function PixelStar({ className = "" }: { className?: string }) {
  // 9 x 9 pixel sparkle, drawn on a grid so it stays crisp.
  const px = [
    [4, 0], [4, 1], [4, 2], [3, 3], [4, 3], [5, 3], [0, 4], [1, 4], [2, 4], [3, 4], [4, 4], [5, 4], [6, 4], [7, 4], [8, 4],
    [3, 5], [4, 5], [5, 5], [4, 6], [4, 7], [4, 8],
  ];
  return (
    <svg aria-hidden="true" width="72" height="72" viewBox="0 0 9 9" shapeRendering="crispEdges" className={className}>
      {px.map(([x, y]) => (
        <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />
      ))}
    </svg>
  );
}

function JumpPanel() {
  const { openSheet } = useChrome();
  const row = "flex w-full items-center gap-3.5 border-t-2 border-line py-3";
  return (
    <aside
      aria-label="Jump straight in"
      data-cat-perch="hero-panel"
      className="w-full shrink-0 border-2 border-line bg-raised px-6 py-5 shadow-pixel-8 lg:w-[400px]"
    >
      <div className="flex items-start pb-3">
        <p className="type-label-s text-ink">JUMP STRAIGHT IN</p>
        <span className="min-w-px flex-1" />
        <p className="type-label-s hidden text-muted md:block">KEYS 1 TO 6</p>
      </div>
      <ul>
        {projects.map((p) => {
          const label = <span className="type-label-s text-muted">{p.href || !p.links ? p.tag.toUpperCase() : `${p.links[0].label} ↗`}</span>;
          const inner = (
            <>
              <Keycap>{p.number}</Keycap>
              <span className="type-body-m flex-1 text-primary transition-colors duration-100 group-hover:text-ink">{p.name}</span>
              {label}
            </>
          );
          return (
            <li key={p.number}>
              {p.href ? (
                <Link href={p.href} className={`${row} group`}>
                  {inner}
                </Link>
              ) : p.links ? (
                <a href={p.links[0].href} target="_blank" rel="noopener noreferrer" className={`${row} group`}>
                  {inner}
                  <span className="sr-only">(opens in a new tab)</span>
                </a>
              ) : (
                <a href={`#project-${p.number}`} className={`${row} group`}>
                  {inner}
                </a>
              )}
            </li>
          );
        })}
      </ul>
      <div className="flex items-center gap-2.5 border-t-2 border-line pt-4">
        <button type="button" onClick={openSheet} className="type-label-s flex items-center gap-2.5 text-muted hover:text-primary">
          <Keycap>?</Keycap>
          ALL SHORTCUTS
        </button>
        <span className="min-w-px flex-1" />
        <button type="button" onClick={openSheet} className="type-label-s flex items-center gap-2.5 text-muted hover:text-primary">
          <Keycap>⌘ K</Keycap>
          SEARCH
        </button>
      </div>
    </aside>
  );
}
