"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { MouseEvent } from "react";
import { links } from "@/lib/projects";
import { homeSections, jumpTo, useChrome } from "./SiteChrome";
import { CatToggle } from "./cat/CatToggle";
import { Logo } from "./Logo";
import { MusicToggle } from "./MusicToggle";
import { ThemeToggle } from "./ThemeToggle";
import { Button, Keycap } from "./ui";

/** Fixed top bar (Figma 28:567 on home, 41:775 on case studies, where the links go home). */
export function Nav() {
  const { openSheet } = useChrome();
  const isHome = usePathname() === "/";

  function onSectionClick(e: MouseEvent<HTMLAnchorElement>, id: string) {
    if (isHome && jumpTo(id)) e.preventDefault();
  }

  return (
    <header className="sticky top-0 z-50 border-b-2 border-line bg-page">
      <nav
        aria-label="Main"
        className="mx-auto flex h-[70px] max-w-[1440px] items-center gap-3 px-[clamp(20px,8.333vw,120px)] sm:gap-6"
      >
        <Link
          href="/"
          onClick={(e) => {
            if (isHome) {
              e.preventDefault();
              window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
            }
          }}
          className="flex shrink-0 items-center gap-3"
          aria-label="Sejal Borkar, home"
        >
          <Logo className="h-[30px] w-auto" />
          <span className="type-label-s hidden text-muted sm:inline">SEJAL BORKAR</span>
        </Link>
        <span className="min-w-px flex-1" />
        <ul className="hidden items-center gap-6 min-[1400px]:flex">
          {homeSections.map((s) => (
            <li key={s.id}>
              <a
                href={`/#${s.id}`}
                onClick={(e) => onSectionClick(e, s.id)}
                className="type-label-s flex items-center gap-2 text-muted transition-colors duration-100 hover:text-primary"
              >
                {s.id === "art" ? "ART" : s.label.toUpperCase()}
                <Keycap>{s.key}</Keycap>
              </a>
            </li>
          ))}
        </ul>
        <span aria-hidden="true" className="hidden h-7 w-0.5 shrink-0 bg-line min-[1400px]:block" />
        <button
          type="button"
          onClick={openSheet}
          aria-haspopup="dialog"
          className="type-label-s flex shrink-0 items-center gap-2 bg-sunken py-1.5 pr-2 pl-3 text-muted transition-colors duration-100 hover:text-primary"
        >
          JUMP TO
          <span className="hidden md:contents">
            <Keycap>⌘ K</Keycap>
          </span>
        </button>
        <ThemeToggle />
        <MusicToggle />
        {isHome && <CatToggle />}
        <div className="hidden md:block">
          <Button href={links.resume} label="RESUME" icon="download" download />
        </div>
      </nav>
    </header>
  );
}
