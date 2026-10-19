"use client";

import { useEffect } from "react";

const BLOCKS = 12;

/** Pixel loading screen, first visit to home only. Clears after the page loads (at least 0.7s, at most 1.6s). */
export function Loader() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.dataset.loading) return;
    const started = performance.now();
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      const wait = Math.max(0, 700 - (performance.now() - started));
      window.setTimeout(() => {
        root.dataset.loaderExit = "1";
        window.setTimeout(() => {
          delete root.dataset.loading;
          delete root.dataset.loaderExit;
          try {
            sessionStorage.setItem("loaded", "1");
          } catch {
            // Storage blocked: the loader just shows again next visit.
          }
          window.dispatchEvent(new CustomEvent("loaderdone"));
        }, 420);
      }, wait);
    };
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    const cap = window.setTimeout(finish, 1600);
    return () => window.clearTimeout(cap);
  }, []);

  return (
    <div id="loader" aria-hidden="true" className="loader fixed inset-0 z-[80] flex-col items-center justify-center gap-6 bg-page">
      <p className="type-display-l text-primary">SB</p>
      <div className="flex gap-1.5">
        {Array.from({ length: BLOCKS }, (_, i) => (
          <span key={i} className="loader-block size-3 bg-lilac" style={{ animationDelay: `${i * 45}ms` }} />
        ))}
      </div>
      <p className="type-label-s text-muted">LOADING THE WORK</p>
    </div>
  );
}
