"use client";

import { useEffect } from "react";

const KEY = "home-scroll";
let cameBack = false;
// Registered once, as soon as this module loads, so it sees the Back or Forward that returns to home.
if (typeof window !== "undefined") window.addEventListener("popstate", () => (cameBack = true));

/** Home reloads start at the hero (scroll restoration is manual, lib/loader.ts), which also stops the browser
    from restoring the place on Back. This remembers where the reader was on home and returns there only when
    they come back with Back or Forward. */
export function ScrollMemory() {
  useEffect(() => {
    if (cameBack) {
      cameBack = false;
      let saved = 0;
      try {
        saved = Number(sessionStorage.getItem(KEY)) || 0;
      } catch {
        // Storage blocked: start at the top.
      }
      // After the pinned story has its height, so the saved position still points at the same place.
      if (saved) window.setTimeout(() => window.scrollTo({ top: saved, behavior: "instant" }), 60);
    }
    let timer = 0;
    const save = () => {
      if (timer) return;
      timer = window.setTimeout(() => {
        timer = 0;
        try {
          sessionStorage.setItem(KEY, String(Math.round(scrollY)));
        } catch {
          // Storage blocked: Back just starts at the top.
        }
      }, 150);
    };
    window.addEventListener("scroll", save, { passive: true });
    return () => {
      window.removeEventListener("scroll", save);
      window.clearTimeout(timer);
    };
  }, []);
  return null;
}
