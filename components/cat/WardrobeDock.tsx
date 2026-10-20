"use client";

import { useEffect, useState } from "react";
import { catEnabled, onCatChange } from "@/lib/cat/prefs";
import { ITEMS, onWardrobeChange, toggleItem, wardrobe, type Item, type Wardrobe } from "@/lib/cat/wardrobe";

const LABELS: Record<Item, string> = { hat: "Hat", tie: "Tie", glasses: "Glasses", bow: "Bow" };

// 12 x 12 coat hanger for the phone toggle ('#' filled). The accessory icons come from the cat studio.
const HANGER = [
  ".....##.....",
  "....#..#....",
  ".......#....",
  "......#.....",
  ".....#......",
  "....###.....",
  "...#...#....",
  "..#.....#...",
  ".#.......#..",
  "#.........#.",
  "###########.",
  "............",
];

// Icon colours from the cat's palette ('#' is the button's text colour).
const ICON_FILL: Record<string, string> = {
  "#": "currentColor",
  H: "var(--cat-hat)",
  b: "var(--cat-band)",
  h: "var(--cat-heart)",
  M: "var(--cat-mouth-inner)",
  k: "var(--cat-glasses)",
};

function Glyph({ rows, size = 18 }: { rows: readonly string[]; size?: number }) {
  const w = Math.max(...rows.map((r) => r.length));
  return (
    <svg aria-hidden="true" width={size} height={size} viewBox={`0 0 ${w} ${rows.length}`} shapeRendering="crispEdges">
      {rows.flatMap((r, y) =>
        [...r].map((c, x) => (ICON_FILL[c] ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill={ICON_FILL[c]} /> : null)),
      )}
    </svg>
  );
}

/** The cat's wardrobe: four toggles fixed to the right edge, mid-height (a single hanger button that opens them on
    phones, so it stays out of the way). Hidden whenever the cat is switched off. */
export function WardrobeDock() {
  const [catOn, setCatOn] = useState(false);
  const [state, setState] = useState<Wardrobe | null>(null);
  const [icons, setIcons] = useState<Record<string, string[]>>({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const updateCat = () => setCatOn(catEnabled());
    const updateWardrobe = () => setState(wardrobe());
    updateCat();
    updateWardrobe();
    const offCat = onCatChange(updateCat);
    const offWardrobe = onWardrobeChange(updateWardrobe);
    // The icons live with the cat art, loaded after the page so they never slow the first screen.
    let alive = true;
    void import("@/lib/cat/frames").then((m) => alive && setIcons(m.accessoryIcons));
    return () => {
      alive = false;
      offCat();
      offWardrobe();
    };
  }, []);

  // Phones: the opened dock closes as soon as the page scrolls.
  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, { passive: true, once: true });
    return () => window.removeEventListener("scroll", close);
  }, [open]);

  if (!catOn || !state) return null;

  const buttons = ITEMS.map((item) => {
    const label = LABELS[item];
    return (
      <button
        key={item}
        type="button"
        aria-pressed={state[item]}
        aria-label={label}
        title={label}
        onClick={() => toggleItem(item)}
        className={`flex size-10 items-center justify-center border-2 border-line shadow-[0_2px_0_0_var(--line)] transition-colors duration-100 ${
          state[item] ? "bg-butter text-on-pastel" : "bg-raised text-muted hover:text-primary"
        }`}
      >
        {icons[item] ? <Glyph rows={icons[item]} size={24} /> : <span className="type-label-s text-[10px]">{LABELS[item].slice(0, 3).toUpperCase()}</span>}
      </button>
    );
  });

  return (
    <div data-wardrobe="" role="group" aria-label="Cat wardrobe" className="contents">
      {/* Tablet and desktop: in the right gutter, mid-height. */}
      <div className="fixed top-1/2 right-3 z-40 hidden -translate-y-1/2 flex-col gap-2 md:flex">{buttons}</div>
      {/* Phones: one small hanger button in the bottom-right corner that opens the four. */}
      <div className="fixed right-3 bottom-[max(12px,env(safe-area-inset-bottom))] z-40 flex flex-col items-end gap-2 md:hidden">
        {open && buttons}
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? "Close the cat wardrobe" : "Open the cat wardrobe"}
          title="Cat wardrobe"
          onClick={() => setOpen((v) => !v)}
          className={`flex size-9 items-center justify-center border-2 border-line shadow-[0_2px_0_0_var(--line)] ${
            open ? "bg-ink text-page" : "bg-raised text-primary"
          }`}
        >
          <Glyph rows={HANGER} size={16} />
        </button>
      </div>
    </div>
  );
}
