"use client";

import { useEffect, useState } from "react";
import { currentTheme, onThemeChange, setTheme, type Theme } from "@/lib/theme";
import { Icon } from "./ui";

/** Moon / sun pair from the nav (Figma 28:593). The active side is butter.
    Which side looks active is decided in CSS (globals.css, .theme-toggle) so it
    is right on first paint, before React hydrates. */
export function ThemeToggle() {
  const [theme, setThemeState] = useState<Theme | null>(null);

  useEffect(() => {
    const update = () => setThemeState(currentTheme());
    update();
    return onThemeChange(update);
  }, []);

  return (
    <div role="group" aria-label="Colour theme" className="theme-toggle flex shrink-0 border-2 border-line">
      <button
        type="button"
        data-side="dark"
        aria-pressed={theme === null ? undefined : theme === "dark"}
        onClick={() => setTheme("dark")}
        className="flex p-2 text-muted transition-colors duration-100"
      >
        <Icon name="moon" />
        <span className="sr-only">Dark theme (D)</span>
      </button>
      <button
        type="button"
        data-side="light"
        aria-pressed={theme === null ? undefined : theme === "light"}
        onClick={() => setTheme("light")}
        className="flex p-2 text-muted transition-colors duration-100"
      >
        <Icon name="sun" />
        <span className="sr-only">Light theme (T)</span>
      </button>
    </div>
  );
}
