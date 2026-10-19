"use client";

import { useEffect } from "react";

/** Pixel loading screen, first visit to home only. Clears after the page loads (at least 0.7s, at most 1.6s).
    The cat spins on top of the bar (CatLayer), then falls while the page rises from the bottom to meet it. */
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
        // The loader's text and bar fade; the cat keeps spinning above where the bar was.
        root.dataset.loaderExit = "1";
        window.setTimeout(() => {
          // Tell the cat first, while the layout is still final, then let the hero rise from the bottom.
          window.dispatchEvent(new CustomEvent("loaderdone"));
          root.dataset.intro = "1";
          delete root.dataset.loading;
          delete root.dataset.loaderExit;
          try {
            sessionStorage.setItem("loaded", "1");
          } catch {
            // Storage blocked: the loader just shows again next visit.
          }
          // The nav comes in once the cat has reached the bottom of the hero (intro-rise is 1.1 s).
          window.setTimeout(() => delete root.dataset.intro, 1150);
        }, 220);
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
      {/* The cat spins here, on top of the bar (CatLayer). */}
      <div className="h-[150px]" />
      <div className="loader-track" aria-hidden="true">
        <span className="loader-runner" />
      </div>
      <p className="type-label-s text-muted">LOADING THE WORK</p>
    </div>
  );
}
