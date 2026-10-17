const STORAGE_KEY = "cat";
const EVENT = "catchange";

/** Runs in <head> with the theme script, so the toggle shows the right state before React loads. */
export const catInitScript = `try{if(localStorage.getItem("${STORAGE_KEY}")==="off")document.documentElement.dataset.cat="off"}catch(e){}`;

export function catEnabled() {
  return document.documentElement.dataset.cat !== "off";
}

export function setCatEnabled(on: boolean) {
  if (on) delete document.documentElement.dataset.cat;
  else document.documentElement.dataset.cat = "off";
  try {
    if (on) localStorage.removeItem(STORAGE_KEY);
    else localStorage.setItem(STORAGE_KEY, "off");
  } catch {
    // Storage blocked: the choice still applies for this visit.
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

export function onCatChange(callback: () => void) {
  window.addEventListener(EVENT, callback);
  return () => window.removeEventListener(EVENT, callback);
}
