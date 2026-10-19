"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Section-in reveals: anything marked data-reveal steps up into place the first time it scrolls into view. */
export function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    const items = document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-in])");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) {
      items.forEach((el) => (el.dataset.in = "1"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          (entry.target as HTMLElement).dataset.in = "1";
          io.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 },
    );
    items.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [pathname]);
  return null;
}
