"use client";

import { useEffect, useState } from "react";
import { jumpTo } from "../SiteChrome";

const sections = [
  { id: "top", label: "HELLO" },
  { id: "work", label: "WORK" },
  { id: "experience", label: "EXPERIENCE" },
  { id: "art", label: "ART" },
  { id: "contact", label: "CONTACT" },
];

/** Section index in the left gutter (from the look reference). Wide screens only, never over content. */
export function SectionRail() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    let timer = 0;
    const update = () => {
      timer = 0;
      let current = 0;
      sections.forEach((s, i) => {
        if (i === 0) return;
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top <= innerHeight * 0.45) current = i;
      });
      setActive(current);
    };
    const onScroll = () => {
      if (!timer) timer = window.setTimeout(update, 80);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.clearTimeout(timer);
    };
  }, []);

  const progress = (active / (sections.length - 1)) * 100;
  return (
    <nav aria-label="Sections" className="fixed top-[120px] left-6 z-30 hidden w-[72px] flex-col gap-3 min-[1280px]:flex">
      <p className="type-label-s flex items-center gap-2 text-ink">
        <span aria-hidden="true" className="size-2 bg-ink" />
        {String(active + 1).padStart(2, "0")}
      </p>
      <p className="type-label-s text-muted">/{String(sections.length).padStart(2, "0")}</p>
      <div aria-hidden="true" className="relative ml-[3px] h-28 w-0.5 bg-line">
        <span className="absolute top-0 left-0 w-0.5 bg-ink transition-[height] duration-300" style={{ height: `${progress}%` }} />
      </div>
      <ol className="flex flex-col gap-2">
        {sections.map((s, i) => (
          <li key={s.id}>
            <a
              href={s.id === "top" ? "#main" : `#${s.id}`}
              onClick={(e) => {
                if (s.id === "top") {
                  e.preventDefault();
                  window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
                } else if (jumpTo(s.id)) e.preventDefault();
              }}
              aria-current={active === i ? "location" : undefined}
              className={`font-label block text-[10px] leading-3 tracking-[0.04em] transition-colors duration-100 hover:text-primary ${
                active === i ? "text-primary" : "text-muted"
              }`}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
