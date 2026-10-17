"use client";

import Link from "next/link";
import { projects } from "@/lib/projects";
import { useChrome } from "../SiteChrome";
import { Button, Keycap } from "../ui";

/** Hero (Figma 27:388): intro on the left, jump-in panel on the right. */
export function Hero() {
  return (
    <section
      aria-labelledby="hero-title"
      className="mx-auto flex max-w-[1440px] flex-col gap-12 px-[clamp(20px,8.333vw,120px)] pt-12 pb-20 lg:flex-row lg:items-center lg:gap-16 lg:pt-24 lg:pb-32"
    >
      <div className="flex min-w-0 flex-1 flex-col items-start gap-7">
        <p className="flex items-start gap-2.5">
          <span aria-hidden="true" className="mt-px size-2.5 shrink-0 bg-mint" />
          <span className="type-label-s text-muted">CONSULTANT AT EPIFI UNTIL NOV 2026 · OPEN TO PRODUCT DESIGN ROLES</span>
        </p>
        <h1 id="hero-title" className="type-display-xl text-primary">
          Product designer <br className="hidden sm:block" />
          who ships.
        </h1>
        <p className="type-body-l max-w-[560px] text-muted">
          B2B SaaS, from research to merged pull requests. Drawing since 2020.
        </p>
        <div className="flex flex-wrap items-start gap-4">
          <Button href="#work" label="VIEW WORK" />
          <Button href="#art" label="SEE THE ART" kind="secondary" />
        </div>
      </div>
      <JumpPanel />
    </section>
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
        {projects.map((p) =>
          p.href ? (
            <li key={p.number}>
              <Link href={p.href} className={`${row} group`}>
                <Keycap>{p.number}</Keycap>
                <span className="type-body-m flex-1 text-primary transition-colors duration-100 group-hover:text-ink">
                  {p.name}
                </span>
                <span className="type-label-s text-muted">{p.tag.toUpperCase()}</span>
              </Link>
            </li>
          ) : (
            <li key={p.number} className={row}>
              <Keycap>{p.number}</Keycap>
              <span className="type-body-m flex-1 text-muted">{p.name}</span>
              <span className="type-label-s text-muted">COMING SOON</span>
            </li>
          ),
        )}
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
