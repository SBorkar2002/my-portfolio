"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { jumpTo } from "../SiteChrome";
import { Icon, Keycap } from "../ui";

/** Fixed contents rail (Figma 41:812 / 56:986). Numbers double as keys 1 to 6; Esc goes home. */
export function CaseRail({ items }: { items: string[] }) {
  const [active, setActive] = useState(1);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      let current = 1;
      items.forEach((_, i) => {
        const el = document.getElementById(`section-${i + 1}`);
        if (el && el.getBoundingClientRect().top <= 160) current = i + 1;
      });
      setActive(current);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, [items]);

  return (
    <nav aria-label="Case study contents" className="sticky top-[136px] hidden w-[220px] shrink-0 self-start xl:block">
      <Link href="/#work" className="type-label-s flex items-center gap-2.5 pb-6 text-muted transition-colors duration-100 hover:text-primary">
        <Icon name="arrow-left" />
        ALL WORK
        <Keycap>ESC</Keycap>
      </Link>
      <p className="type-label-s pb-3 text-ink">CONTENTS</p>
      <ol>
        {items.map((label, i) => {
          const n = i + 1;
          const isActive = active === n;
          return (
            <li key={label}>
              <a
                href={`#section-${n}`}
                onClick={(e) => {
                  if (jumpTo(`section-${n}`)) e.preventDefault();
                }}
                aria-current={isActive ? "location" : undefined}
                className={`type-body-s flex w-full items-center gap-2.5 border-l-2 py-2.5 pl-3 transition-colors duration-100 hover:text-primary ${
                  isActive ? "border-butter text-primary" : "border-line text-muted"
                }`}
              >
                <Keycap>{n}</Keycap>
                {label}
              </a>
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
