export type Theme = "light" | "dark";

const STORAGE_KEY = "theme";
const EVENT = "themechange";

/** Runs in <head> before paint so a stored choice never flashes the wrong theme. */
export const themeInitScript = `try{var t=localStorage.getItem("${STORAGE_KEY}");document.documentElement.dataset.theme=t==="dark"?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}`;

export function currentTheme(): Theme {
  const set = document.documentElement.dataset.theme;
  if (set === "light" || set === "dark") return set;
  return "light";
}

export function setTheme(theme: Theme) {
  document.documentElement.dataset.theme = theme;
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Private mode or blocked storage: the theme still applies for this visit.
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function onThemeChange(callback: () => void) {
  const media = window.matchMedia("(prefers-color-scheme: dark)");
  window.addEventListener(EVENT, callback);
  media.addEventListener("change", callback);
  return () => {
    window.removeEventListener(EVENT, callback);
    media.removeEventListener("change", callback);
  };
}
