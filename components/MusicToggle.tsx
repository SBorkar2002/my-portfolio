"use client";

import { useEffect, useState } from "react";
import { bootMusic, musicEnabled, musicPlaying, onMusicChange, setMusicEnabled } from "@/lib/music";

// 12 x 12 pixel speaker, '#' filled. ON adds sound waves, OFF adds a cross.
const SPEAKER = [
  "............",
  "....#.......",
  "...##.......",
  "..###.......",
  "#####.......",
  "#####.......",
  "#####.......",
  "#####.......",
  "..###.......",
  "...##.......",
  "....#.......",
  "............",
];
const WAVES = [
  [7, 4], [7, 5], [7, 6], [7, 7],
  [9, 2], [9, 3], [10, 4], [10, 5], [10, 6], [10, 7], [9, 8], [9, 9],
];
const CROSS = [
  [7, 4], [8, 5], [9, 6], [10, 7], [10, 4], [9, 5], [8, 6], [7, 7],
];

/** Background music on or off (lib/music.ts): a pixel speaker with sound waves when on and a cross when off, plus a
    SOUND ON / OFF label on wide screens. Butter while on, like the cat toggle. */
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
      // On but not yet playing (no gesture so far): a tap means "play", not "turn off".
      onClick={() => setMusicEnabled(!(musicEnabled() && musicPlaying()))}
      title={on ? "Turn the music off" : "Turn the music on"}
      className={`relative flex shrink-0 items-center gap-2 border-2 border-line p-2 transition-colors duration-100 lg:pr-3 ${
        on ? "bg-butter text-on-pastel" : "text-muted hover:text-primary"
      }`}
    >
      <svg aria-hidden="true" width="18" height="18" viewBox="0 0 12 12" shapeRendering="crispEdges">
        {SPEAKER.flatMap((r, y) => [...r].map((c, x) => (c === "#" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" /> : null)))}
        {(on ? WAVES : CROSS).map(([x, y]) => (
          <rect key={`w${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" />
        ))}
      </svg>
      <span aria-hidden="true" className="type-label-s hidden lg:inline">{on ? "SOUND ON" : "SOUND OFF"}</span>
      <span className="sr-only">Background music</span>
    </button>
  );
}
