"use client";

import { useEffect } from "react";

/** Pixel loading screen.
    Shown on every full load for at least 2 s (no minimum with reduced motion), longer while assets still load.
    The cat spins on top of the bar (CatLayer), then falls while the page rises from the bottom to meet it. */
export function Loader() {
  useEffect(() => {
    const root = document.documentElement;
    if (!root.dataset.loading) return;
    const started = 0; // the loader has been up since navigation start
    let done = false;
    const finish = () => {
      if (done) return;
      done = true;
      const min = matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 2000;
      const wait = Math.max(0, min - (performance.now() - started));
      window.setTimeout(() => {
        // The loader's text and bar fade; the cat keeps spinning above where the bar was.
        root.dataset.loaderExit = "1";
        window.setTimeout(() => {
          // Clear the loading lock first (the scrollbar comes back), then tell the cat so it measures the final layout,
          // then let the hero rise from the bottom. All in one task, so nothing paints in between.
          delete root.dataset.loading;
          delete root.dataset.loaderExit;
          window.dispatchEvent(new CustomEvent("loaderdone"));
          root.dataset.intro = "1";
          // The nav comes in once the cat has reached the bottom of the hero (intro-rise is 1.1 s).
          window.setTimeout(() => delete root.dataset.intro, 1150);
        }, 220);
      }, wait);
    };
    if (document.readyState === "complete") finish();
    else window.addEventListener("load", finish, { once: true });
    // Never stuck: give up waiting for slow assets after 8 s.
    const cap = window.setTimeout(finish, 8000);
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
