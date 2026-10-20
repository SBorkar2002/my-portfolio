/** The cat's wardrobe: which accessories are on. Remembered across visits; shared by every cat on the page. */
export const ITEMS = ["hat", "tie", "glasses", "bow"] as const;
export type Item = (typeof ITEMS)[number];
export type Wardrobe = Record<Item, boolean>;

const KEY = "cat-wardrobe";
const EVENT = "wardrobechange";
const NONE: Wardrobe = { hat: false, tie: false, glasses: false, bow: false };

export function wardrobe(): Wardrobe {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || "{}");
    return { ...NONE, ...Object.fromEntries(ITEMS.map((i) => [i, saved[i] === true])) };
  } catch {
    return { ...NONE };
  }
}

export function toggleItem(item: Item) {
  const next = { ...wardrobe(), [item]: !wardrobe()[item] };
  try {
    localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage blocked: the choice still applies for this visit.
  }
  window.dispatchEvent(new CustomEvent(EVENT));
}

/** What is actually drawn: the hat and the bow clash, so the hat wins and the bow waits underneath. */
export function wornItems(w: Wardrobe = wardrobe()): Item[] {
  return ITEMS.filter((i) => w[i] && !(i === "bow" && w.hat));
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
