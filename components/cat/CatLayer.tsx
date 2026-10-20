"use client";

import { usePathname } from "next/navigation";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import type { CatState } from "@/lib/cat/frames";
import { catEnabled, onCatChange } from "@/lib/cat/prefs";
import { onWardrobeChange, wornItems, type Item } from "@/lib/cat/wardrobe";
import { currentTheme, onThemeChange } from "@/lib/theme";

type Sprite = typeof import("@/lib/cat/sprite");
type Data = typeof import("@/lib/cat/frames");
type Ctx = { sprite: Sprite; data: Data; reduced: boolean; mobile: boolean };

/** Where the cat is and how it got there. Page pixels: left edge of the 48 x 48 box, Y of the feet. */
type Spot = {
  id: string;
  left: number;
  floor: number;
  s: number;
  /** How it arrives: fall in from above, peek over an edge, poke out sideways, hop in, run in from the left, or just appear. */
  enter: "fall" | "peek" | "side" | "pop" | "run" | "appear";
  /** What it does once there. Guide reacts per experience chapter; doze loops sit, yawn and sleep and ignores the pointer. */
  then: "talk" | "wander" | "hold" | "guide" | "doze";
  line?: string;
  flip?: boolean;
  /** Viewport coordinates instead of page coordinates (the pinned experience story). */
  fixed?: boolean;
  /** Spins on the way down. */
  spins?: number;
  /** Not wanted anywhere right now: left where it was, to scroll away with the page. */
  parked?: boolean;
};

const SIZE = 48;
const SLEEP_AFTER = 5000;
const LASER_REST = 1000;
const RUN_SPEED = 900;
const CONTACT_LINE = "In this section, you're free to draw.";

// One short line per work tile (hover), no em dashes. Order matches lib/projects.ts.
const TILE_LINES: Record<string, string> = {
  "project-1": "five pages, one shared kit",
  "project-2": "human art, verified",
  "project-3": "a webinar built like a call",
  "project-4": "one look per category",
  "project-5": "script to render, with review gates",
};
/** The white cat (dark theme) is Mimi, the black cat (light theme) is Cookie. */
const catName = () => (currentTheme() === "dark" ? "Mimi" : "Cookie");
// Said when the cat is clicked, shuffled so none repeats until all have been said. {name} is Cookie or Mimi.
const PET_LINES = [
  "purr purr",
  "that tickles!",
  "more pets, please",
  "hi again, I'm {name}",
  "boop!",
  "five more minutes...",
  "seen the art room yet?",
  "you found me!",
];
const SECTION_LINES: Record<string, string[]> = {
  "hero-panel": ["hey, I'm {name}! I'll be your guide to this portfolio", "press 1 to 6", "try the ? key"],
  work: ["tap a tile", "press 2 for Sourced"],
  art: ["drawing since 2020"],
};

function page(el: Element) {
  const r = el.getBoundingClientRect();
  return { top: r.top + scrollY, bottom: r.bottom + scrollY, left: r.left + scrollX, right: r.right + scrollX, width: r.width, height: r.height };
}

/** The pixel cat on the home page. Art by the cat studio (lib/cat/frames.ts). */
export function CatLayer() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  useEffect(() => {
    const update = () => setEnabled(catEnabled());
    update();
    return onCatChange(update);
  }, []);
  if (!enabled) return null;
  // Remounted per page: home has the full set of spots, case studies a perch on the "Next" card, 404 its own.
  return (
    <CatBoundary key={pathname}>
      <Cat />
    </CatBoundary>
  );
}

/** If anything in the cat fails, the cat quietly disappears and the page keeps working. */
class CatBoundary extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

function Cat() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const hitRef = useRef<HTMLButtonElement>(null);
  const bubbleRef = useRef<HTMLDivElement>(null);
  const laserRef = useRef<HTMLDivElement>(null);
  const petRef = useRef<() => void>(() => {});

  useEffect(() => {
    let disposed = false;
    let ctx: Ctx | null = null;
    let cache: InstanceType<Sprite["FrameCache"]> | null = null;
    let spot: Spot | null = null;
    let x = 0;
    let y = 0;
    let frame = { state: "Sit" as CatState, index: 0, flip: false };
    let timer = 0;
    let mode: "away" | "moving" | "idle" | "sleeping" | "laser" = "away";
    let lastActive = performance.now();
    let lineIndex = 0;
    let bubbleTimer = 0;
    let hoverTile: Element | null = null;
    let expLine = "";
    let worn: Item[] = wornItems();
    /** Which side of the screen the cat last left by. */
    let lastExit: "left" | "right" = "right";
    const reducedQuery = matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = matchMedia("(max-width: 767px)");
    const tabletQuery = matchMedia("(max-width: 1023px)");
    const fineQuery = matchMedia("(pointer: fine)");
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const hit = hitRef.current!;
    const bubble = bubbleRef.current!;
    const laser = laserRef.current!;

    /** Cat size per breakpoint (CSS px per sprite pixel): phone, tablet, desktop. Every cat, the contact one too,
        fits whole on a 360 to 430 px wide phone. */
    const SCALES = { phone: { base: 2, hero: 2, contact: 3 }, tablet: { base: 2.6, hero: 3, contact: 5 }, desktop: { base: 3.4, hero: 4, contact: 9 } };
    const scales = () => SCALES[ctx!.mobile ? "phone" : tabletQuery.matches ? "tablet" : "desktop"];
    const baseScale = () => ctx!.sprite.pixelScale(scales().base);
    /** States the cat studio ships in later rounds; the cat falls back to older ones until they land. */
    const has = (st: string) => Boolean(ctx && (ctx.data.frames as Record<string, unknown>)[st]);
    const pick = (...list: string[]) => (list.find(has) ?? "Sit") as CatState;

    function paint(target: HTMLCanvasElement, state: CatState, index: number, flip: boolean, s: number) {
      if (!cache) return;
      const dpr = window.devicePixelRatio || 1;
      const size = SIZE * Math.round(s * dpr);
      if (target.width !== size) {
        target.width = size;
        target.height = size;
      }
      target.style.width = target.style.height = `${size / dpr}px`;
      const g = target.getContext("2d")!;
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, size, size);
      g.imageSmoothingEnabled = false;
      if (flip) g.setTransform(-1, 0, 0, 1, size, 0);
      g.drawImage(cache.get(state, index), 0, 0, size, size);
      // Wardrobe overlays from the cat studio, placed per frame and mirrored with the cat, in their draw order.
      const k = size / SIZE;
      if (ctx && worn.length)
        for (const item of ctx.data.accessoryOrder) {
          if (!worn.includes(item as Item)) continue;
          if (item === "bow" && worn.includes("hat") && ctx.data.hatHidesBow[state]?.[index]) continue;
          const acc = ctx.data.accessories[item];
          const anchor = acc?.anchors[state]?.[index];
          const rows = anchor && acc.sprites[anchor[2] ?? 0];
          if (!anchor || !rows) continue;
          const sprite = cache.rows(`${item}:${anchor[2] ?? 0}`, rows);
          g.drawImage(sprite, anchor[0] * k, anchor[1] * k, sprite.width * k, sprite.height * k);
        }
    }

    function draw() {
      if (!ctx || !spot) return;
      const s = spot.s;
      paint(canvas, frame.state, frame.index, frame.flip, s);
      const dpr = window.devicePixelRatio || 1;
      const snap = (v: number) => Math.round(v * dpr) / dpr;
      const top = Math.round((y - SIZE * s) / s) * s;
      wrap.style.position = spot.fixed ? "fixed" : "absolute";
      wrap.style.transform = `translate(${snap(x)}px, ${snap(top)}px)`;
      wrap.dataset.state = `${spot.id}:${frame.state}`;
    }

    function stop() {
      window.clearTimeout(timer);
      timer = 0;
    }

    /** Plays frames with the cat studio's timings, then calls next. */
    function play(state: CatState, next: () => void, opts: { frames?: number[]; loops?: number; flip?: boolean } = {}) {
      if (!ctx) return;
      const list = opts.frames ?? ctx.data.frames[state].map((_, i) => i);
      const total = list.length * (opts.loops ?? 1);
      let i = 0;
      const step = () => {
        if (disposed || !ctx) return;
        if (i >= total) return next();
        frame = { state, index: list[i % list.length], flip: Boolean(opts.flip) };
        draw();
        i++;
        timer = window.setTimeout(step, ctx.data.timings[state][frame.index] * 1000);
      };
      step();
    }

    /** Walks or runs to a point, timer driven and quantised to sprite pixels, then calls next. */
    function moveTo(targetX: number, targetY: number, state: "Walk" | "Run", next: () => void) {
      if (!ctx || !spot) return;
      const speed = state === "Run" ? RUN_SPEED : 140;
      const startX = x;
      const startY = y;
      const dist = Math.hypot(targetX - startX, targetY - startY);
      const duration = Math.max(200, (dist / speed) * 1000);
      const flip = targetX < startX; // sprites face right
      const t0 = performance.now();
      let f = 0;
      let lastFrame = t0;
      const tick = () => {
        if (disposed || !ctx) return;
        const now = performance.now();
        const t = Math.min(1, (now - t0) / duration);
        x = startX + (targetX - startX) * t;
        y = startY + (targetY - startY) * t;
        if (now - lastFrame > ctx.data.timings[state][0] * 1000) {
          f = (f + 1) % ctx.data.frames[state].length;
          lastFrame = now;
        }
        frame = { state, index: f, flip };
        draw();
        if (t < 1) timer = window.setTimeout(tick, 33);
        else next();
      };
      tick();
    }

    function idle() {
      mode = "idle";
      if (performance.now() - lastActive > SLEEP_AFTER) return sleep();
      if (Math.random() < 0.15) play("Sit", idle, { frames: [0, 3] });
      else play("Sit", idle);
    }

    function sleep() {
      hideBubble();
      mode = "sleeping";
      play("Yawn", () => {
        const loop = () => play("Sleep", loop);
        loop();
      });
    }

    /** Contact: sit a while, yawn, sleep, wake, and again. It stays put whatever the pointer does. */
    function doze() {
      mode = "idle";
      play("Sit", () =>
        play("Yawn", () => {
          mode = "sleeping";
          play("Sleep", () => play("Sit", doze, { frames: [2, 3, 0] }), { loops: 4 });
        }),
        { loops: 3 },
      );
    }

    function wake() {
      lastActive = performance.now();
      if (mode !== "sleeping" || !ctx || ctx.reduced || spot?.then === "doze") return;
      stop();
      mode = "idle";
      play("Sit", idle, { frames: [2, 3, 0] });
    }

    function say(text: string | undefined, then: () => void, ms?: number) {
      if (!text || !ctx) return then();
      showBubble(text, ms);
      if (ctx.reduced) return then();
      play("Talk", then);
    }

    let bubbleSource = "";
    function showBubble(text: string, ms = 4200) {
      if (!spot || !ctx) return;
      bubbleSource = text;
      bubble.textContent = text.replace("{name}", catName());
      bubble.hidden = false;
      const w = bubble.offsetWidth;
      const s = spot.s;
      const b = ctx.sprite.stateBox("Sit");
      // Tries spots around the cat in order: beside the head (left, right), beside the feet, above, below. Each is
      // clamped 12 px inside the screen, and the first that keeps clear of [data-bubble-avoid] (the hero buttons)
      // wins, so the bubble never covers something to click.
      const M = 12;
      const h = bubble.offsetHeight;
      const vw = document.documentElement.clientWidth;
      const wrapX = spot.fixed ? x : x - scrollX;
      const wrapY = Math.round((y - SIZE * s) / s) * s - (spot.fixed ? 0 : scrollY);
      const clampX = (l: number) => Math.min(vw - M - w - wrapX, Math.max(M - wrapX, l));
      const clampY = (t: number) => Math.min(innerHeight - M - h - wrapY, Math.max(72 + M - wrapY, t));
      const sideL = b.left * s - w - 10;
      const sideR = (b.right + 1) * s + 10;
      const centre = ((b.left + b.right + 1) / 2) * s - w / 2;
      const candidates: [number, number][] = [
        [sideL, (b.top + 2) * s],
        [sideR, (b.top + 2) * s],
        [sideL, SIZE * s - h],
        [sideR, SIZE * s - h],
        [centre, b.top * s - h - 8],
        [centre, SIZE * s + 8],
      ];
      // The marked row's children (the buttons themselves), so the space beside a short button stays usable.
      const avoid: { left: number; right: number; top: number; bottom: number }[] = [
        ...[...document.querySelectorAll("[data-bubble-avoid] > *, [data-bubble-keep-clear]")].map((el) => el.getBoundingClientRect()),
        // The cat itself, so the bubble never sits on its face.
        { left: wrapX + b.left * s, right: wrapX + (b.right + 1) * s, top: wrapY + b.top * s, bottom: wrapY + SIZE * s },
      ];
      const clear = ([l, t]: [number, number]) => {
        const r = { left: wrapX + l - 6, right: wrapX + l + w + 6, top: wrapY + t - 6, bottom: wrapY + t + h + 6 };
        return avoid.every((a) => r.right <= a.left || r.left >= a.right || r.bottom <= a.top || r.top >= a.bottom);
      };
      // Prefer a spot that fits on screen without being pushed sideways; then one pushed sideways; then any clear
      // spot; then the first one.
      const fits = ([l, t]: [number, number]) =>
        wrapX + l >= M && wrapX + l + w <= vw - M && wrapY + t >= 72 + M && wrapY + t + h <= innerHeight - M;
      const fitsDown = ([l, t]: [number, number]) => wrapY + t >= 72 + M && wrapY + t + h <= innerHeight - M && clear([clampX(l), t]);
      // Below the nav and above the bottom edge too, so it is never cut off.
      const pick =
        candidates.find((c) => fits(c) && clear(c)) ??
        candidates.find(fitsDown) ??
        candidates.map((c): [number, number] => [c[0], clampY(c[1])]).find((c) => clear([clampX(c[0]), c[1]])) ??
        candidates.find((c) => clear([clampX(c[0]), c[1]])) ??
        candidates[0];
      const left = clampX(pick[0]);
      const top = pick[1];
      bubble.style.left = `${left}px`;
      bubble.style.top = `${top}px`;
      window.clearTimeout(bubbleTimer);
      if (!ctx.reduced && ms > 0) bubbleTimer = window.setTimeout(hideBubble, ms);
    }

    /** Remembers which half of the screen the cat was on, for when it next runs in. */
    function noteSide() {
      if (!spot || wrap.hidden) return;
      const vx = spot.fixed ? x : x - scrollX;
      lastExit = vx + SIZE * spot.s * 0.5 < innerWidth / 2 ? "left" : "right";
    }

    function hideBubble() {
      window.clearTimeout(bubbleTimer);
      bubble.hidden = true;
    }

    /** Nowhere to be: the cat stays where it is on the page and scrolls away with it, so it never pops out of sight. */
    function park() {
      if (!spot || spot.parked) return;
      if (spot.fixed) return hide();
      noteSide();
      hideBubble();
      spot.parked = true;
    }

    function hide() {
      noteSide();
      stop();
      hideBubble();
      spot = null;
      mode = "away";
      wrap.hidden = true;
    }

    function placeHit() {
      if (!ctx || !spot) return;
      const b = ctx.sprite.stateBox("Sit");
      const s = spot.s;
      Object.assign(hit.style, {
        left: `${b.left * s}px`,
        top: `${b.top * s}px`,
        width: `${(b.right - b.left + 1) * s}px`,
        height: `${(SIZE - b.top) * s}px`,
      });
    }

    /** Settles into a spot with its entrance, then its behaviour. */
    function go(next: Spot) {
      if (intro) finishIntro(false);
      stop();
      hideBubble();
      if (next.enter === "run" && ctx && !ctx.reduced) return runIn(next);
      spot = next;
      wrap.hidden = false;
      placeHit();
      if (!ctx) return;
      const s = next.s;
      x = next.left;
      y = next.floor;
      if (ctx.reduced) {
        frame = next.then === "doze" ? { state: "Sleep", index: 0, flip: false } : { state: "Sit", index: 0, flip: false };
        mode = "idle";
        draw();
        if (next.line) showBubble(next.line);
        return;
      }
      mode = "moving";
      const after = () => behave(next);
      if (next.enter === "fall") {
        // One clean drop from the top of the screen: the Fall loop is one full turn, played once or twice, then Land.
        const startY = Math.min(Math.max(next.floor - innerHeight, scrollY + 60) + SIZE * s * 0.6, next.floor);
        y = startY;
        const distance = next.floor - startY;
        const duration = Math.min(1300, Math.max(650, Math.sqrt(Math.max(0, distance)) * 34));
        const seq: [CatState, number][] = [];
        const add = (st: CatState) => ctx!.data.frames[st].forEach((_, i) => seq.push([st, i]));
        for (let k = 0; k < (next.spins ?? 1); k++) add("Fall");
        const t0 = performance.now();
        const tick = () => {
          if (disposed || !ctx) return;
          const t = Math.min(1, (performance.now() - t0) / duration);
          y = startY + distance * t * t;
          const [st, i] = seq[Math.min(seq.length - 1, Math.floor(t * seq.length))];
          frame = { state: st, index: i, flip: false };
          draw();
          if (t < 1) timer = window.setTimeout(tick, 33);
          else {
            y = next.floor;
            play("Land", after);
          }
        };
        tick();
      } else if (next.enter === "peek") play("Peek", after);
      else if (next.enter === "side") play("PeekSide", after, { flip: next.flip });
      else if (next.enter === "pop") play("React", after);
      else after();
    }

    /** Contact entrance: run off the nearest side of the screen, then come back in from that same side and run to the spot. */
    function runIn(next: Spot) {
      if (!ctx) return;
      mode = "moving";
      const comeIn = () => {
        spot = next;
        wrap.hidden = false;
        placeHit();
        const sit = ctx!.sprite.stateBox("Sit");
        // Always comes in from the right edge, so it never walks across the contact text.
        x = scrollX + innerWidth - sit.left * next.s + 8;
        y = next.floor;
        moveTo(next.left, next.floor, "Run", () => play("Sit", () => behave(next), { frames: [0] }));
      };
      const vx = x - scrollX;
      const vy = y - scrollY;
      const onScreen = spot && !wrap.hidden && !spot.fixed && vx > -100 && vx < innerWidth && vy > 0 && vy < innerHeight + 100;
      if (!onScreen) return comeIn();
      const w = SIZE * spot!.s;
      spot = { ...spot!, enter: "appear" };
      lastExit = vx + w / 2 < innerWidth / 2 ? "left" : "right";
      const edge = lastExit === "left" ? scrollX - w : scrollX + innerWidth + 8;
      moveTo(edge, y, "Run", comeIn);
    }

    function behave(next: Spot) {
      lastActive = performance.now();
      const line = next.line;
      if (next.then === "hold" && next.enter === "pop") {
        // Sitting on top of a hovered tile with its line, until the pointer leaves.
        mode = "idle";
        if (line) showBubble(line, 0);
        const loop = () => play("Sit", loop);
        loop();
        return;
      }
      if (next.then === "doze") {
        say(line, doze, 7000);
        return;
      }
      if (next.then === "guide") {
        say(document.getElementById("experience")?.dataset.expLine || line, idle);
        return;
      }
      if (next.then === "hold") {
        mode = "idle";
        if (line) showBubble(line);
        const st: CatState = next.enter === "side" ? "PeekSide" : "Peek";
        const last = ctx!.data.frames[st].length - 1;
        const loop = () => play(st, loop, { frames: [last - 1, last], flip: next.flip });
        loop();
        return;
      }
      if (next.then === "wander") {
        // Walk a few steps, come back, sit, say the line. Idle then yawns and sleeps after 5 s.
        const home = next.left;
        // Always walks towards the middle of the screen, never off the edge.
        const step = SIZE * next.s * 1.6;
        const away = home + SIZE * next.s * 0.5 - scrollX < innerWidth / 2 ? home + step : Math.max(16, home - step);
        moveTo(away, next.floor, "Walk", () => moveTo(home, next.floor, "Walk", () => say(line, idle)));
        return;
      }
      // Phones: the full intro is too long to fit beside the cat, so it comes as two short bubbles.
      if (next.id === "hero-panel" && ctx!.mobile && line?.includes("{name}")) {
        say("hi, I'm {name}!", () => {
          if (spot?.id === "hero-panel") showBubble("I'll be your guide");
          idle();
        });
        return;
      }
      say(line, idle);
    }

    // ---------- where to be ----------

    function spotFor(id: string): Spot | null {
      if (!ctx) return null;
      const s = baseScale();
      const sit = ctx.sprite.stateBox("Sit");
      const lines = SECTION_LINES[id] ?? [];
      const line = lines.length ? lines[lineIndex % lines.length] : undefined;
      if (id === "hero-panel") {
        // Lands on the bottom edge of the hero, beside the jump-in panel (never on it). One whole pixel bigger than elsewhere.
        const panel = document.querySelector('[data-cat-perch="hero-panel"]');
        const hero = panel?.closest("section");
        if (!panel || !hero) return null;
        const p = page(panel);
        const h = page(hero);
        if (ctx.mobile) {
          // Phones: smaller, and on top of the jump-in panel (the hero bottom is crowded there).
          const small = ctx.sprite.pixelScale(scales().hero);
          return { id, s: small, left: p.right - 16 - (sit.right + 1) * small, floor: p.top, enter: "fall", then: "talk", line, spins: 1 };
        }
        const big = ctx.sprite.pixelScale(scales().hero);
        return { id, s: big, left: p.left - 32 - (sit.right + 1) * big, floor: h.bottom - 2, enter: "fall", then: "talk", line, spins: 1 };
      }
      if (id === "work" || id === "art") {
        const el = document.getElementById(id);
        const inner = el?.querySelector(":scope > .mx-auto");
        if (!el || !inner) return null;
        const box = page(inner);
        const pad = parseFloat(getComputedStyle(inner).paddingRight || "0");
        // The art room cat falls on the left, on the same side as the experience ledge it came from.
        const left = id === "art" ? box.left + pad - sit.left * s : box.right - pad - (sit.right + 1) * s;
        return { id, s, left, floor: page(el).bottom - 2, enter: "fall", then: "wander", line, spins: 2 };
      }
      if (id === "work-peek") {
        // Peek over the top edge of a work tile, only once it has finished its scroll entrance (work-enter ends at
        // "cover 28%"), and stay on the same tile while it still qualifies.
        const settled = (t: Element) => {
          const r = t.getBoundingClientRect();
          return r.top >= 170 && r.top <= innerHeight - 0.28 * (innerHeight + r.height);
        };
        const current = spot?.id.startsWith("work-peek:") ? document.getElementById(spot.id.slice(10)) : null;
        let best: Element | null = current && settled(current) ? current : null;
        let bestD = Infinity;
        for (const t of best ? [] : document.querySelectorAll("#work [id^='project-']")) {
          if (!settled(t)) continue;
          const r = t.getBoundingClientRect();
          const d = Math.abs(r.top - innerHeight * 0.45);
          if (d < bestD) {
            bestD = d;
            best = t;
          }
        }
        if (!best) return null;
        const p = page(best);
        const peek = ctx.sprite.stateBox("Peek");
        return { id: `work-peek:${best.id}`, s, left: p.right - 40 - (peek.right + 1) * s, floor: p.top, enter: "peek", then: "hold" };
      }
      if (id === "case-next" || id === "notfound") {
        // Case studies: sits on the top edge of the "Next" card, at its right end, and says a line about it.
        // 404: sits on its ledge and dozes.
        const el = document.querySelector<HTMLElement>(`[data-cat-perch="${id}"]`);
        if (!el) return null;
        const p = page(el);
        if (id === "notfound") {
          const big = ctx.sprite.pixelScale(scales().hero);
          const mid = ((sit.left + sit.right + 1) / 2) * big;
          return { id, s: big, left: p.left + p.width / 2 - mid, floor: p.top, enter: "fall", then: "doze", line: el.dataset.catLine, spins: 1 };
        }
        return { id, s, left: p.right - 24 - (sit.right + 1) * s, floor: p.top, enter: "pop", then: "talk", line: el.dataset.catLine };
      }
      if (id === "exp-role") {
        let best: HTMLElement | null = null;
        let bestD = Infinity;
        for (const el of document.querySelectorAll<HTMLElement>('[data-cat-perch="exp-role"]')) {
          const r = el.getBoundingClientRect();
          const d = Math.abs(r.top + r.height / 2 - innerHeight * 0.5);
          if (r.bottom > 80 && r.top < innerHeight - 40 && d < bestD) {
            bestD = d;
            best = el;
          }
        }
        if (!best) return null;
        const p = page(best);
        const i = [...document.querySelectorAll('[data-cat-perch="exp-role"]')].indexOf(best);
        // At the right edge of the screen, level with the role's picture, so the photo and the text stay clear.
        const right = document.documentElement.clientWidth + scrollX - 12;
        return { id: `exp-role:${i}`, s, left: right - (sit.right + 1) * s, floor: p.bottom, enter: "pop", then: "guide", line: best.dataset.catLine };
      }
      if (id === "experience") {
        // The guide: one ledge in the pinned story, in viewport coordinates, for every chapter.
        const ledge = document.querySelector('[data-cat-perch="exp-guide"]');
        if (!ledge) return null;
        const r = ledge.getBoundingClientRect();
        const mid = ((sit.left + sit.right + 1) / 2) * s;
        const line = document.getElementById("experience")?.dataset.expLine || expLine;
        return { id, s, fixed: true, left: r.left + r.width / 2 - mid, floor: r.top, enter: "pop", then: "guide", line };
      }
      if (id === "footer") {
        // Centred in the empty space beside "Hiring a product designer?", about 30% bigger than round 2 at a whole-pixel scale.
        const el = document.querySelector('[data-cat-perch="contact"]');
        if (!el) return null;
        const big = ctx.sprite.pixelScale(scales().contact);
        const p = page(el);
        // Centre of the open space: from the end of the text column to the screen edge (gutter included) on wide
        // screens, the perch itself on phones; vertically centred in it too.
        const col = el.previousElementSibling;
        const from = !ctx.mobile && col ? page(col).right : p.left;
        const to = ctx.mobile ? p.right : document.documentElement.clientWidth + scrollX;
        const mid = ((sit.left + sit.right + 1) / 2) * big;
        const tall = (SIZE - sit.top) * big;
        const floor = Math.min(p.bottom, p.top + (p.height + tall) / 2);
        return { id, s: big, left: (from + to) / 2 - mid, floor, enter: "run", then: "doze", line: CONTACT_LINE };
      }
      return null;
    }

    /** What the cat should be doing for the current scroll position. */
    function target(): string | null {
      const vh = innerHeight;
      // Other pages: the 404 cat, or the case study cat on the "Next case study" card once it is in view.
      if (document.querySelector('[data-cat-perch="notfound"]')) return "notfound";
      const next = document.querySelector('[data-cat-perch="case-next"]');
      if (next) {
        const r = next.getBoundingClientRect();
        return r.top < vh * 0.85 && r.bottom > 120 ? "case-next" : null;
      }
      const between = (el: Element | null, edge: "top" | "bottom", lo: number, hi = vh - 8) => {
        if (!el) return false;
        const v = el.getBoundingClientRect()[edge];
        return v > lo && v < hi;
      };
      const contact = document.getElementById("contact");
      if (contact && contact.getBoundingClientRect().top < vh * 0.55) return "footer";
      const art = document.getElementById("art");
      if (between(art, "bottom", 160)) return "art";
      // Experience as a plain list (phones, short screens): the cat sits beside the role nearest the middle.
      if (document.querySelector("#experience:not([data-exp-story])")) {
        const ex = document.getElementById("experience")!.getBoundingClientRect();
        if (ex.top < vh * 0.5 && ex.bottom > vh * 0.5) return "exp-role";
      }
      const exp = document.querySelector("#experience[data-exp-story]");
      if (exp) {
        const r = exp.getBoundingClientRect();
        if (r.top <= 80 && r.bottom >= vh - 4) return "experience";
      }
      const work = document.getElementById("work");
      if (between(work, "bottom", 160)) return "work";
      // The walking cat at the bottom of selected work is still (partly) on screen: no peeking on top of it.
      if (between(work, "bottom", vh - 9, vh + 200)) return null;
      if (work) {
        const r = work.getBoundingClientRect();
        if (r.top < vh * 0.6 && r.bottom > vh * 0.4) return "work-peek";
      }
      const hero = document.querySelector('[data-cat-perch="hero-panel"]')?.closest("section");
      if (between(hero ?? null, "bottom", 160, vh + 40)) return "hero-panel";
      return null;
    }

    // ---------- first visit: spin on the loading bar, then fall while the hero rises up to meet the cat ----------

    let intro = false;
    let introTimer = 0;
    const INTRO_MS = 1100; // matches the intro-rise animation in globals.css

    function spinOnLoader() {
      const track = document.querySelector(".loader-track");
      if (!ctx || !track) return;
      const r = track.getBoundingClientRect();
      const s = baseScale();
      const fall = ctx.sprite.stateBox("Fall");
      intro = true;
      spot = { id: "loader", s, fixed: true, left: r.left + r.width / 2 - ((fall.left + fall.right + 1) / 2) * s, floor: r.top - 8, enter: "appear", then: "hold" };
      wrap.hidden = false;
      wrap.style.zIndex = "90"; // above the loading screen
      placeHit();
      x = spot.left;
      y = spot.floor;
      mode = "moving";
      const loop = () => play("Fall", loop);
      loop();
    }

    /** Called just before the hero starts rising (layout is final, not yet moved). */
    function dropIntoHero() {
      if (!ctx || !intro || !spot) return choose();
      const hero = spotFor("hero-panel");
      if (!hero) {
        // Not the home page: let the page finish rising before measuring where the cat goes.
        intro = false;
        wrap.style.zIndex = "";
        hide();
        introTimer = window.setTimeout(choose, INTRO_MS + 100);
        return;
      }
      stop();
      const startX = x;
      const startY = y;
      const endX = hero.left - scrollX;
      const endY = hero.floor - scrollY;
      spot = { ...hero, id: "intro", fixed: true };
      placeHit();
      wrap.style.zIndex = "";
      introHero = hero;
      const list = ctx.data.frames.Fall.map((_, i) => i);
      const t0 = performance.now();
      const tick = () => {
        if (disposed || !ctx) return;
        const t = Math.min(1, (performance.now() - t0) / INTRO_MS);
        // Picks up speed like a falling drop; the hero arrives under it at the same moment.
        x = startX + (endX - startX) * (1 - (1 - t) * (1 - t));
        y = startY + (endY - startY) * t * t;
        frame = { state: "Fall", index: list[Math.floor((performance.now() - t0) / 90) % list.length], flip: false };
        draw();
        if (t < 1) timer = window.setTimeout(tick, 33);
        else finishIntro(true);
      };
      tick();
    }

    /** Ends the intro on the hero spot. Also used when something interrupts the drop (tab switch, tile hover),
        so the intro can never stay half done and block the cat for the rest of the visit. */
    let introHero: Spot | null = null;
    function finishIntro(land: boolean) {
      if (!intro) return;
      intro = false;
      wrap.style.zIndex = "";
      const hero = introHero;
      introHero = null;
      if (!hero || !ctx) return;
      stop();
      spot = hero;
      x = hero.left;
      y = hero.floor;
      if (land) play("Land", () => behave(hero));
      else {
        mode = "idle";
        frame = { state: "Sit", index: 0, flip: false };
        draw();
      }
      // The reader may have scrolled during the drop: go where the scroll position says.
      choose();
    }

    let pending: string | null | undefined;
    let settle = 0;
    function choose() {
      if (disposed || !ctx || intro || hoverTile || mode === "laser") return;
      let want = target();
      if (ctx.reduced && !["hero-panel", "footer", "case-next", "notfound"].includes(want ?? "")) want = null;
      const next = want ? spotFor(want) : null;
      const key = next ? next.id : null;
      if (key === pending) return;
      window.clearTimeout(settle);
      if (key === (spot && !spot.parked ? spot.id : null)) {
        pending = undefined;
        return;
      }
      pending = key;
      settle = window.setTimeout(() => {
        pending = undefined;
        if (hoverTile || mode === "laser") return;
        const fresh = want ? spotFor(want) : null;
        if (fresh && spot && fresh.id === spot.id) spot.parked = false; // already there
        else if (fresh) {
          lineIndex++;
          go(fresh);
        } else park();
      }, 160);
    }

    // ---------- hover a work tile: the cat hops onto that tile's top edge and says its line ----------

    const onTileEnter = (e: Event) => {
      if (!ctx || intro || ctx.reduced || ctx.mobile) return;
      const tile = e.currentTarget as HTMLElement;
      // Only when the tile's top edge is on screen, so the cat is never sitting out of view.
      const top = tile.getBoundingClientRect().top;
      if (top < 80 || top > innerHeight - 40) return;
      // A pending scroll spot must not land after this and move the cat to another tile.
      window.clearTimeout(settle);
      pending = undefined;
      hoverTile = tile;
      const p = page(tile);
      const s = baseScale();
      const sit = ctx.sprite.stateBox("Sit");
      go({ id: `hover:${tile.id}`, s, left: p.right - 40 - (sit.right + 1) * s, floor: p.top, enter: "pop", then: "hold", line: TILE_LINES[tile.id] });
    };
    const onTileLeave = (e: Event) => {
      if (hoverTile !== e.currentTarget) return;
      hoverTile = null;
      // Stays on that tile until it has somewhere else to be.
      if (spot) spot.parked = true;
      hideBubble();
      choose();
    };

    // ---------- laser pointer: when the dot rests for a second, the cat runs straight to it, settles in the sphinx pose
    // and taps it two or three times, rests, and taps again until the pointer moves. Never over controls or in contact. ----------

    let restTimer = 0;
    let laserX = 0;
    let laserY = 0;
    const onPointer = (e: PointerEvent) => {
      wake();
      if (!ctx || ctx.reduced || !fineQuery.matches) return;
      laserX = e.clientX;
      laserY = e.clientY;
      const inContact = Boolean((e.target as Element | null)?.closest?.("#contact"));
      laser.style.transform = `translate(${laserX + 10}px, ${laserY + 10}px)`;
      laser.hidden = inContact;
      window.clearTimeout(restTimer);
      if (mode === "laser") {
        // The dot moved: stop tapping and sit where it is until the dot rests again.
        stop();
        mode = "idle";
        play("Sit", idle, { frames: [0] });
      }
      if (!inContact) restTimer = window.setTimeout(chaseLaser, LASER_REST);
    };
    function chaseLaser() {
      if (!ctx || !spot || hoverTile || spot.fixed || spot.then === "doze" || mode === "moving") return;
      const el = document.elementFromPoint(laserX, laserY);
      if (el?.closest("a, button, input, nav, header, dialog, #contact")) return; // stay calm over controls
      stop();
      hideBubble();
      mode = "laser";
      const s = spot.s;
      const pose = pick("Sphinx", "Sit");
      const box = ctx.sprite.stateBox(pose);
      const dotX = laserX + 10 + scrollX;
      const dotY = laserY + 10 + scrollY;
      const fromLeft = x + SIZE * s * 0.5 < dotX;
      // Front paws end at the dot.
      const goalX = fromLeft ? dotX - (box.right + 1) * s : dotX - box.left * s;
      spot = { ...spot, id: "laser", enter: "appear", then: "talk" };
      moveTo(goalX, dotY + 3 * s, "Run", () => tapDot(!fromLeft));
    }
    function tapDot(flip: boolean) {
      if (mode !== "laser") return;
      const tap = pick("SphinxTap", "Pounce", "Inspect");
      const rest = pick("Sphinx", "Sit");
      const taps = (tap as string) === "SphinxTap" ? 2 + Math.round(Math.random()) : 1;
      play(tap, () => play(rest, () => tapDot(flip), { flip, loops: 2 }), { flip, loops: taps });
    }

    // ---------- wiring ----------

    /** The guide sits on the story's ledge: fixed while the story is pinned, then carried off with the page. */
    function rideLedge() {
      if (!ctx || spot?.id !== "experience") return;
      const ledge = document.querySelector('[data-cat-perch="exp-guide"]');
      const exp = document.getElementById("experience");
      if (!ledge || !exp) return;
      const r = ledge.getBoundingClientRect();
      const e = exp.getBoundingClientRect();
      const sit = ctx.sprite.stateBox("Sit");
      const left = r.left + r.width / 2 - ((sit.left + sit.right + 1) / 2) * spot.s;
      spot.fixed = e.top <= 80 && e.bottom >= innerHeight - 4;
      x = spot.left = spot.fixed ? left : left + scrollX;
      y = spot.floor = spot.fixed ? r.top : r.top + scrollY;
      draw();
    }

    let scrollTimer = 0;
    const onScroll = () => {
      wake();
      rideLedge();
      laser.hidden = true;
      if (mode === "laser" || spot?.id === "laser") {
        stop();
        mode = "idle";
        if (spot) spot.parked = true;
        play("Sit", idle, { frames: [0] });
      }
      if (!scrollTimer)
        scrollTimer = window.setTimeout(() => {
          scrollTimer = 0;
          choose();
        }, 80);
    };
    // A new experience chapter zoomed in: the guide hops and reads its line, and stays on its ledge.
    const onExp = (e: Event) => {
      expLine = (e as CustomEvent<{ line: string }>).detail?.line ?? "";
      if (spot?.id !== "experience" || spot.parked || !ctx || ctx.reduced || mode === "moving") return;
      stop();
      // The line shows at once so a fast scroll never skips it; the hop and the talk follow.
      showBubble(expLine);
      play("React", () => play("Talk", idle));
    };
    const onKey = () => wake();
    const onVisibility = () => {
      if (document.hidden) {
        if (intro) finishIntro(false);
        stop();
        return;
      }
      if (!spot || !ctx || ctx.reduced) return;
      if (mode === "idle" || mode === "sleeping") (spot.then === "doze" ? doze : idle)();
      else if (mode === "moving") {
        // A move was cut off by the tab switch: arrive again instead of staying frozen mid-move.
        const again = spot;
        spot = null;
        go({ ...again, parked: false });
      }
    };
    const resize = new ResizeObserver(() => {
      if (!spot || spot.parked || spot.id === "experience" || mode === "moving" || mode === "laser" || hoverTile) return;
      // Marked stale so the next choice moves it to the new layout, or leaves it where it is.
      spot = { ...spot, id: `${spot.id}:stale`, parked: true };
      choose();
    });
    let unTheme = () => {};
    let unWardrobe = () => {};
    const tiles: Element[] = [];

    let petBag: string[] = [];
    let lastPet = "";
    function nextPetLine() {
      if (!petBag.length) {
        petBag = [...PET_LINES].sort(() => Math.random() - 0.5);
        if (petBag[petBag.length - 1] === lastPet) petBag.unshift(petBag.pop()!);
      }
      lastPet = petBag.pop()!;
      return lastPet;
    }

    petRef.current = () => {
      if (!ctx || !spot || ctx.reduced || mode === "moving") return;
      lastActive = performance.now();
      stop();
      showBubble(nextPetLine());
      mode = "idle";
      const after = spot.then === "doze" ? doze : idle;
      if (spot.enter === "peek" || spot.enter === "side") play("Sit", after, { frames: [0, 3, 0] });
      else play("React", after);
    };

    async function boot() {
      const [sprite, data] = await Promise.all([import("@/lib/cat/sprite"), import("@/lib/cat/frames")]);
      if (disposed) return;
      ctx = { sprite, data, reduced: reducedQuery.matches, mobile: mobileQuery.matches };
      cache = new sprite.FrameCache();
      cache.setPalette(sprite.readPalette());
      unTheme = onThemeChange(() => {
        cache!.setPalette(sprite.readPalette());
        // The name in an open bubble follows the theme straight away (Cookie in light, Mimi in dark).
        if (!bubble.hidden && bubbleSource.includes("{name}")) bubble.textContent = bubbleSource.replace("{name}", catName());
        if (spot) {
          placeHit();
          draw();
        }
      });
      unWardrobe = onWardrobeChange(() => {
        worn = wornItems();
        if (spot) draw();
      });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      window.addEventListener("pointermove", onPointer, { passive: true });
      window.addEventListener("keydown", onKey);
      window.addEventListener("exprole", onExp);
      document.addEventListener("visibilitychange", onVisibility);
      resize.observe(document.body);
      document.querySelectorAll("#work [id^='project-']").forEach((t) => {
        if (!TILE_LINES[t.id]) return;
        t.addEventListener("pointerenter", onTileEnter);
        t.addEventListener("pointerleave", onTileLeave);
        tiles.push(t);
      });
      if (document.documentElement.dataset.loading) {
        if (!ctx.reduced) spinOnLoader();
        window.addEventListener("loaderdone", dropIntoHero, { once: true });
      } else if (document.documentElement.dataset.intro) {
        // Booted while the page is still rising after the loader: measure once it has settled.
        introTimer = window.setTimeout(choose, INTRO_MS + 100);
      } else choose();
    }

    // On the first visit the cat is part of the loading screen, so it boots straight away.
    const idleCb = document.documentElement.dataset.loading
      ? (cb: () => void) => window.setTimeout(cb, 0)
      : (window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 600)));
    const handle = idleCb(() => {
      boot().catch(() => hide());
    });

    return () => {
      disposed = true;
      stop();
      hideBubble();
      window.clearTimeout(settle);
      window.clearTimeout(introTimer);
      window.clearTimeout(scrollTimer);
      window.clearTimeout(restTimer);
      if (window.cancelIdleCallback && typeof handle === "number") window.cancelIdleCallback(handle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("exprole", onExp);
      window.removeEventListener("loaderdone", dropIntoHero);
      document.removeEventListener("visibilitychange", onVisibility);
      tiles.forEach((t) => {
        t.removeEventListener("pointerenter", onTileEnter);
        t.removeEventListener("pointerleave", onTileLeave);
      });
      resize.disconnect();
      unTheme();
      unWardrobe();
    };
  }, []);

  return (
    <>
      <div ref={laserRef} hidden aria-hidden="true" className="laser-dot pointer-events-none fixed top-0 left-0 z-[65]" />
      <div ref={wrapRef} hidden className="pointer-events-none absolute top-0 left-0 z-40" style={{ width: 0, height: 0 }}>
        <canvas ref={canvasRef} aria-hidden="true" className="relative block [image-rendering:pixelated]" />
        <div
          ref={bubbleRef}
          hidden
          role="status"
          className="type-label-s absolute z-10 border-2 border-primary bg-primary w-max max-w-[min(380px,calc(100vw-24px))] break-words px-2.5 py-2 leading-relaxed text-page shadow-[3px_3px_0_0_var(--pastel-lilac)]"
        />
        <button
          ref={hitRef}
          type="button"
          onClick={() => petRef.current()}
          aria-label="Pet the cat"
          className="pointer-events-auto absolute cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-ink"
        />
      </div>
    </>
  );
}
