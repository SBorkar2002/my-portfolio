"use client";

import { useEffect, useState } from "react";
import { bootMusic, musicEnabled, onMusicChange, setMusicEnabled } from "@/lib/music";

// 12 x 12 pixel eighth notes, '#' filled.
const NOTE = [
  "....#######.",
  "....#######.",
  "....#.....#.",
  "....#.....#.",
  "....#.....#.",
  "....#.....#.",
  "....#.....#.",
  "..###...###.",
  ".####..####.",
  ".####..####.",
  "..##....##..",
  "............",
];

/** Background music on or off (lib/music.ts). Butter while on, like the cat toggle; a slash through the note when off. */
export function MusicToggle() {
  const [on, setOn] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setOn(musicEnabled());
    update();
    const off = onMusicChange(update);
    const unboot = bootMusic();
    return () => {
      off();
      unboot();
    };
  }, []);

  return (
    <button
      type="button"
      data-music-toggle=""
      aria-pressed={on === null ? undefined : on}
      onClick={() => setMusicEnabled(!musicEnabled())}
      title={on ? "Turn the music off" : "Turn the music on"}
      className={`relative flex shrink-0 border-2 border-line p-2 transition-colors duration-100 ${
        on ? "bg-butter text-on-pastel" : "text-muted hover:text-primary"
      }`}
    >
      <svg aria-hidden="true" width="16" height="16" viewBox="0 0 12 12" shapeRendering="crispEdges">
        {NOTE.flatMap((r, y) => [...r].map((c, x) => (c === "#" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" /> : null)))}
        {on === false && [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map((i) => <rect key={`s${i}`} x={i} y={i} width="1" height="1" fill="currentColor" />)}
      </svg>
      <span className="sr-only">Background music</span>
    </button>
  );
}
