"use client";

import { useEffect, useState } from "react";
import { ARROW_UP, PixelGlyph, ToolButton } from "./home/Doodle";

/** Back to the top, fixed at the bottom-left of the screen once the page has scrolled. Desktop and tablet only
    (phones have none), and hidden once the contact section is on screen, which has its own. */
export function GoTop() {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const update = () => {
      const contact = document.getElementById("contact");
      setShown(scrollY > 320 && !(contact && contact.getBoundingClientRect().top < innerHeight * 0.85));
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);
  return (
    <div data-go-top="" inert={!shown} className={`fixed bottom-4 left-4 z-[60] hidden transition-opacity duration-200 md:block ${shown ? "opacity-100" : "pointer-events-none opacity-0"}`}>
      <ToolButton
        label="Go to top"
        onClick={() => {
          window.scrollTo({ top: 0, behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
          // The button hides at the top, so keyboard focus moves to the page start instead of being lost.
          document.getElementById("main")?.focus({ preventScroll: true });
        }}
      >
        <PixelGlyph rows={ARROW_UP} />
      </ToolButton>
    </div>
  );
}
