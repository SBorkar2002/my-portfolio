"use client";

import { useEffect, useState } from "react";
import { catEnabled, onCatChange, setCatEnabled } from "@/lib/cat/prefs";
import { Icon } from "../ui";

/** Shows or hides the pixel cat. Butter when the cat is out, like the active side of the theme toggle.
    The look is set in CSS from html[data-cat] so it is right before React loads. */
export function CatToggle() {
  const [on, setOn] = useState<boolean | null>(null);

  useEffect(() => {
    const update = () => setOn(catEnabled());
    update();
    return onCatChange(update);
  }, []);

  return (
    <button
      type="button"
      aria-pressed={on === null ? undefined : on}
      onClick={() => setCatEnabled(!catEnabled())}
      title={on === false ? "Show the cat" : "Hide the cat"}
      className="cat-toggle flex shrink-0 border-2 border-line p-2 transition-colors duration-100"
    >
      <Icon name="cat" />
      <span className="sr-only">Cat</span>
    </button>
  );
}
