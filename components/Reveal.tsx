"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

/** Section-in reveals: anything marked data-reveal steps up into place the first time it scrolls into view.
    It also watches for elements added later (content that streams in after this runs on a slow phone, or a
    section that switches layout), so nothing is ever left hidden. */
export function Reveal() {
  const pathname = usePathname();
  useEffect(() => {
    const pending = () => document.querySelectorAll<HTMLElement>("[data-reveal]:not([data-in])");
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      const showAll = () => pending().forEach((el) => (el.dataset.in = "1"));
      showAll();
      const mo = new MutationObserver(showAll);
      mo.observe(document.body, { childList: true, subtree: true });
      return () => mo.disconnect();
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
    const watched = new WeakSet<Element>();
    const watchAll = () =>
      pending().forEach((el) => {
        if (watched.has(el)) return;
        watched.add(el);
        io.observe(el);
      });
    watchAll();
    document.documentElement.dataset.revealReady = "";
    const mo = new MutationObserver(watchAll);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => {
      io.disconnect();
      mo.disconnect();
      delete document.documentElement.dataset.revealReady;
    };
  }, [pathname]);
  return null;
}
