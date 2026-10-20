/** The cat's wardrobe: which accessories are on. Remembered across visits; shared by every cat on the page. */
export const ITEMS = ["hat", "tie", "glasses", "bow"] as const;
export type Item = (typeof ITEMS)[number];
export type Wardrobe = Record<Item, boolean>;

const KEY = "cat-wardrobe";
const EVENT = "wardrobechange";
const NONE: Wardrobe = { hat: false, tie: false, glasses: false, bow: false };

/** Sejal's rules: the bow is its own look, so it never goes with the hat or the tie; glasses go with anything.
    Valid sets: any of hat, tie and glasses, or bow plus glasses. */
function valid(w: Wardrobe): Wardrobe {
  return w.bow ? { ...w, hat: false, tie: false } : w;
}

export function wardrobe(): Wardrobe {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
    // A saved choice from before the rules (bow with a hat or tie) keeps the hat and tie, the newer look.
    const w = { ...NONE, ...Object.fromEntries(ITEMS.map((i) => [i, saved[i] === true])) } as Wardrobe;
    return w.bow && (w.hat || w.tie) ? { ...w, bow: false } : valid(w);
  } catch {
    return { ...NONE };
  }
}

export function toggleItem(item: Item) {
  const now = wardrobe();
  const on = !now[item];
  let next: Wardrobe = { ...now, [item]: on };
  // Turning the bow on takes the hat and tie off; turning the hat or tie on takes the bow off.
  if (on && item === "bow") next = { ...next, hat: false, tie: false };
  if (on && (item === "hat" || item === "tie")) next = { ...next, bow: false };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage blocked: the choice still applies for this visit.
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

/** What is switched on. Where the hat and the bow would clash in a frame (the studio's hatHidesBow), the renderer
    leaves the bow out for that frame. */
export function wornItems(w: Wardrobe = wardrobe()): Item[] {
  return ITEMS.filter((i) => w[i]);
}

export function onWardrobeChange(callback: () => void) {
  window.addEventListener(EVENT, callback);
  const storage = (e: StorageEvent) => e.key === KEY && callback(); // other tabs
  window.addEventListener("storage", storage);
  return () => {
    window.removeEventListener(EVENT, callback);
    window.removeEventListener("storage", storage);
  };
}
