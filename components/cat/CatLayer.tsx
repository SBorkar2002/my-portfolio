"use client";

import { usePathname } from "next/navigation";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import type { CatState } from "@/lib/cat/frames";
import { catEnabled, onCatChange } from "@/lib/cat/prefs";
import { onThemeChange } from "@/lib/theme";

type Sprite = typeof import("@/lib/cat/sprite");
type Data = typeof import("@/lib/cat/frames");

type Perch = {
  id: string;
  /** Element whose geometry gives the floor. */
  selector: string;
  /** Floor is the element's bottom edge (sections) instead of its top edge. */
  floorAtBottom?: boolean;
  /** Short friendly lines for the speech bubble (no em dashes). */
  lines: string[];
  /** Where the cat sits: the floor (page Y of its feet) and the left edge of its sprite box. */
  place: (el: HTMLElement, s: number, sprite: Sprite) => { floor: number; left: number } | null;
  /** Pose for reduced motion; perches without one are skipped then. */
  still?: { state: CatState; frame: number };
};

type Plan = Perch & { s: number; floor: number; left: number; section: Element };
type Ctx = { sprite: Sprite; data: Data; reduced: boolean; mobile: boolean };

const SIZE = 48;
const CONTENT = "h1,h2,h3,p,a,button,img,video,kbd,li,dt,dd,figcaption,blockquote,input";
const SLEEP_AFTER = 5000;

function page(el: Element) {
  const r = el.getBoundingClientRect();
  return { top: r.top + scrollY, bottom: r.bottom + scrollY, left: r.left + scrollX, right: r.right + scrollX, width: r.width, height: r.height };
}

function overlaps(rect: { top: number; left: number; right: number; bottom: number }, section: Element) {
  if (rect.left < 0 || rect.right > document.documentElement.clientWidth) return true;
  for (const el of section.querySelectorAll(CONTENT)) {
    const r = page(el);
    if (r.width === 0 || r.height === 0) continue;
    if (rect.left < r.right - 0.5 && rect.right > r.left + 0.5 && rect.top < r.bottom - 0.5 && rect.bottom > r.top + 0.5) return true;
  }
  return false;
}

/** Rest spot at the bottom-right of a section, inside its bottom padding. */
function sectionBottom(el: HTMLElement, s: number, sprite: Sprite) {
  const inner = el.querySelector(":scope > .mx-auto") ?? el;
  const box = page(inner);
  const pad = parseFloat(getComputedStyle(inner).paddingRight || "0");
  return { floor: page(el).bottom - 2, left: box.right - pad - (sprite.stateBox("Sit").right + 1) * s };
}

const perches: Perch[] = [
  {
    id: "hero-panel",
    selector: '[data-cat-perch="hero-panel"]',
    lines: ["hey!", "press 1 to 6", "try the ? key"],
    place: (el, s, sprite) => {
      const p = page(el);
      return { floor: p.top, left: p.right - 28 - (sprite.stateBox("Sit").right + 1) * s };
    },
    still: { state: "Sit", frame: 0 },
  },
  { id: "work", selector: "#work", floorAtBottom: true, lines: ["tap a tile", "press 2 for Sourced"], place: sectionBottom },
  { id: "experience", selector: "#experience", floorAtBottom: true, lines: ["five stops so far"], place: sectionBottom },
  { id: "art", selector: "#art", floorAtBottom: true, lines: ["drawing since 2020"], place: sectionBottom },
  {
    id: "footer",
    selector: '[data-cat-perch="footer"]',
    lines: ["say hi!"],
    place: (el, s, sprite) => {
      const label = el.firstElementChild;
      const button = el.lastElementChild;
      if (!label || !button) return null;
      const l = page(label);
      const b = page(button);
      const sleep = sprite.stateBox("Sleep");
      const width = (sleep.right - sleep.left + 1) * s;
      const sameRow = Math.abs(b.top - l.top) < 4 && b.left - l.right > width + 48;
      const visibleLeft = sameRow ? (l.right + b.left) / 2 - width / 2 : page(el).right - width;
      return { floor: sameRow ? l.bottom : Math.min(l.top, b.top) - 8, left: visibleLeft - sleep.left * s };
    },
    still: { state: "Sleep", frame: 0 },
  },
];

/** The pixel cat on the home page: falls into each section, lands at its bottom, talks a little, naps when left alone. */
export function CatLayer() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    const update = () => setEnabled(catEnabled());
    update();
    return onCatChange(update);
  }, []);

  if (pathname !== "/" || !enabled) return null;
  return (
    <CatBoundary>
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
  const petRef = useRef<() => void>(() => {});

  useEffect(() => {
    let disposed = false;
    let ctx: Ctx | null = null;
    let cache: InstanceType<Sprite["FrameCache"]> | null = null;
    let plan: Plan | null = null;
    let y = 0; // page Y of the feet
    let frame = { state: "Sit" as CatState, index: 0 };
    let timer = 0;
    let fallFrame = 0;
    let mode: "away" | "falling" | "landing" | "idle" | "sleeping" = "away";
    let lastActive = performance.now();
    let lineIndex = 0;
    let bubbleTimer = 0;
    const reducedQuery = matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = matchMedia("(max-width: 767px)");
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const hit = hitRef.current!;
    const bubble = bubbleRef.current!;

    function boxTop() {
      return plan ? plan.floor - SIZE * plan.s : 0;
    }

    function draw() {
      if (!ctx || !cache || !plan) return;
      const dpr = window.devicePixelRatio || 1;
      const px = Math.round(plan.s * dpr);
      const size = SIZE * px;
      if (canvas.width !== size) {
        canvas.width = size;
        canvas.height = size;
      }
      canvas.style.width = canvas.style.height = `${size / dpr}px`;
      const g = canvas.getContext("2d")!;
      g.clearRect(0, 0, size, size);
      g.imageSmoothingEnabled = false;
      g.drawImage(cache.get(frame.state, frame.index), 0, 0, size, size);
      // Whole sprite pixels only, so the cat stays on the pixel grid while it falls.
      const top = Math.round((y - SIZE * plan.s) / plan.s) * plan.s;
      wrap.style.transform = `translate(${Math.round(plan.left * dpr) / dpr}px, ${Math.round(top * dpr) / dpr}px)`;
      wrap.dataset.state = `${plan.id}:${frame.state}`;
    }

    function placeHit() {
      if (!ctx || !plan) return;
      const b = ctx.sprite.stateBox("Sit");
      Object.assign(hit.style, {
        left: `${b.left * plan.s}px`,
        top: `${b.top * plan.s}px`,
        width: `${(b.right - b.left + 1) * plan.s}px`,
        height: `${(SIZE - b.top) * plan.s}px`,
      });
    }

    function stop() {
      window.clearTimeout(timer);
      window.clearTimeout(fallFrame);
      timer = 0;
      fallFrame = 0;
    }

    /** Plays a state's frames (optionally a subset or several loops) with the cat studio's timings, then calls next. */
    function play(state: CatState, next: () => void, opts: { frames?: number[]; loops?: number } = {}) {
      if (!ctx) return;
      const list = opts.frames ?? ctx.data.frames[state].map((_, i) => i);
      const total = list.length * (opts.loops ?? 1);
      let i = 0;
      const step = () => {
        if (disposed || !ctx) return;
        if (i >= total) return next();
        frame = { state, index: list[i % list.length] };
        draw();
        i++;
        timer = window.setTimeout(step, ctx.data.timings[state][frame.index] * 1000);
      };
      step();
    }

    function idle() {
      mode = "idle";
      if (performance.now() - lastActive > SLEEP_AFTER) return sleep();
      if (Math.random() < 0.15) play("Look", idle, { frames: [0, 1] });
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

    function wake() {
      lastActive = performance.now();
      if (mode !== "sleeping" || !ctx || ctx.reduced) return;
      stop();
      mode = "idle";
      play("Sit", idle, { frames: [2, 3, 0] });
    }

    function showBubble(text: string) {
      if (!plan || !ctx) return;
      bubble.textContent = text;
      bubble.hidden = false;
      const w = bubble.offsetWidth;
      const h = bubble.offsetHeight;
      const b = ctx.sprite.stateBox("Sit");
      const catTop = plan.floor - (SIZE - b.top) * plan.s;
      // Beside the head, on the cat's left: always inside the empty padding the cat sits in.
      const right = plan.left + b.left * plan.s - 8;
      const rect = { left: right - w, right, top: catTop + 4, bottom: catTop + 4 + h };
      if (overlaps(rect, plan.section)) {
        bubble.hidden = true;
        return;
      }
      Object.assign(bubble.style, { left: `${rect.left - plan.left}px`, top: `${rect.top - boxTop()}px` });
      window.clearTimeout(bubbleTimer);
      if (!ctx.reduced) bubbleTimer = window.setTimeout(hideBubble, 4000);
    }

    function hideBubble() {
      window.clearTimeout(bubbleTimer);
      bubble.hidden = true;
    }

    /** Falls from the top of the section (or the top of the screen) and lands on the floor. */
    function fallInto(next: Plan) {
      stop();
      hideBubble();
      plan = next;
      wrap.hidden = false;
      placeHit();
      if (!ctx) return;
      if (ctx.reduced) {
        const pose = next.still!;
        y = next.floor;
        frame = { state: pose.state, index: pose.frame };
        mode = "idle";
        draw();
        if (next.id === "hero-panel") showBubble(next.lines[0]);
        return;
      }
      const start = Math.max(page(next.section).top, scrollY + 80) + 24;
      const distance = Math.max(0, next.floor - start);
      const duration = Math.min(900, Math.max(320, Math.sqrt(distance) * 28));
      const t0 = performance.now();
      let f = 0;
      let lastFrameAt = t0;
      mode = "falling";
      // Timer-driven (about 30 fps) rather than rAF, so a paused rAF can never strand the cat mid-air.
      const tickFall = () => {
        if (disposed || !plan || !ctx) return;
        const now = performance.now();
        const t = Math.min(1, (now - t0) / duration);
        y = start + distance * t * t;
        if (now - lastFrameAt > 90) {
          f = (f + 1) % ctx.data.frames.Fall.length;
          lastFrameAt = now;
        }
        frame = { state: "Fall", index: f };
        draw();
        if (t < 1) {
          fallFrame = window.setTimeout(tickFall, 33);
          return;
        }
        y = next.floor;
        mode = "landing";
        play("Land", () => {
          lastActive = performance.now();
          if (next.id !== "footer") showBubble(next.lines[lineIndex++ % next.lines.length]);
          if (next.id === "footer") sleep();
          else idle();
        });
      };
      tickFall();
    }

    function hide() {
      stop();
      hideBubble();
      plan = null;
      mode = "away";
      wrap.hidden = true;
    }

    function planFor(def: Perch): Plan | null {
      if (!ctx) return null;
      if (ctx.reduced && !def.still) return null;
      const el = document.querySelector<HTMLElement>(def.selector);
      if (!el) return null;
      const section = el.closest("section") ?? el;
      const s = ctx.sprite.pixelScale(ctx.mobile ? 2 : 2.6);
      const spot = def.place(el, s, ctx.sprite);
      if (!spot) return null;
      const box = ctx.sprite.stateBox(def.still?.state === "Sleep" ? "Sleep" : "Sit");
      const rect = { left: spot.left + box.left * s, right: spot.left + (box.right + 1) * s, top: spot.floor - (SIZE - box.top) * s, bottom: spot.floor };
      if (overlaps(rect, section)) return null;
      return { ...def, s, floor: spot.floor, left: spot.left, section };
    }

    /** The perch whose floor is on screen and nearest the lower part of the viewport wins, after 180ms. */
    let pending: string | null | undefined;
    let settle = 0;
    function choose() {
      if (!ctx) return;
      const target = innerHeight * 0.7;
      let best: string | null = null;
      let bestDistance = Infinity;
      for (const def of perches) {
        if (ctx.reduced && !def.still) continue;
        const el = document.querySelector<HTMLElement>(def.selector);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        const floor = def.floorAtBottom ? r.bottom : r.top;
        if (floor < 140 || floor > innerHeight - 8) continue;
        const d = Math.abs(floor - target);
        if (d < bestDistance) {
          bestDistance = d;
          best = def.id;
        }
      }
      const current = plan?.id ?? null;
      if (best === pending) return;
      window.clearTimeout(settle);
      if (best === current) {
        pending = undefined;
        return;
      }
      pending = best;
      settle = window.setTimeout(() => {
        const id = pending;
        pending = undefined;
        if (id === undefined || id === (plan?.id ?? null)) return;
        const def = id ? perches.find((p) => p.id === id) : undefined;
        const next = def ? planFor(def) : null;
        if (next) fallInto(next);
        else hide();
      }, 180);
    }

    function relayout() {
      if (!plan) return;
      const next = planFor(plan);
      if (!next) return hide();
      plan = next;
      if (mode !== "falling") y = next.floor;
      placeHit();
      draw();
    }

    let scrollTimer = 0;
    const onScroll = () => {
      wake();
      if (!scrollTimer)
        scrollTimer = window.setTimeout(() => {
          scrollTimer = 0;
          choose();
        }, 80);
    };
    const onActivity = () => wake();
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (plan && ctx && !ctx.reduced && (mode === "idle" || mode === "sleeping")) idle();
    };
    const resize = new ResizeObserver(() => relayout());
    let unTheme = () => {};

    petRef.current = () => {
      if (!ctx || !plan || ctx.reduced || mode === "falling" || mode === "landing") return;
      lastActive = performance.now();
      stop();
      showBubble(plan.lines[lineIndex++ % plan.lines.length]);
      const react = ctx.sprite.stateBox("React");
      const room = !overlaps(
        { left: plan.left + react.left * plan.s, right: plan.left + (react.right + 1) * plan.s, top: plan.floor - (SIZE - react.top) * plan.s, bottom: plan.floor },
        plan.section,
      );
      mode = "idle";
      if (room) play("React", idle);
      else play("Look", idle, { frames: [0, 1, 0] });
    };

    async function boot() {
      const [sprite, data] = await Promise.all([import("@/lib/cat/sprite"), import("@/lib/cat/frames")]);
      if (disposed) return;
      ctx = { sprite, data, reduced: reducedQuery.matches, mobile: mobileQuery.matches };
      cache = new sprite.FrameCache();
      cache.setPalette(sprite.readPalette());
      unTheme = onThemeChange(() => {
        cache!.setPalette(sprite.readPalette());
        draw();
      });
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll);
      window.addEventListener("pointermove", onActivity, { passive: true });
      window.addEventListener("keydown", onActivity);
      document.addEventListener("visibilitychange", onVisibility);
      resize.observe(document.body);
      // Wait for the loading screen to clear so the first fall is seen.
      if (document.documentElement.dataset.loading) window.addEventListener("loaderdone", () => choose(), { once: true });
      else choose();
    }

    // Load the sprites once the page is idle, so the cat never delays the first paint.
    const idleCb = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 600));
    const handle = idleCb(() => {
      boot().catch(() => hide());
    });

    return () => {
      disposed = true;
      stop();
      hideBubble();
      window.clearTimeout(settle);
      window.clearTimeout(scrollTimer);
      if (window.cancelIdleCallback && typeof handle === "number") window.cancelIdleCallback(handle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onActivity);
      window.removeEventListener("keydown", onActivity);
      document.removeEventListener("visibilitychange", onVisibility);
      resize.disconnect();
      unTheme();
    };
  }, []);

  return (
    <div ref={wrapRef} hidden className="pointer-events-none absolute top-0 left-0 z-40" style={{ width: 0, height: 0 }}>
      <canvas ref={canvasRef} aria-hidden="true" className="block [image-rendering:pixelated]" />
      <div
        ref={bubbleRef}
        hidden
        role="status"
        className="type-label-s absolute border-2 border-line bg-raised px-2.5 py-2 whitespace-nowrap text-primary shadow-[3px_3px_0_0_var(--pastel-lilac)]"
      />
      <button
        ref={hitRef}
        type="button"
        onClick={() => petRef.current()}
        aria-label="Pet the cat"
        className="pointer-events-auto absolute cursor-pointer rounded-sm focus-visible:outline-2 focus-visible:outline-ink"
      />
    </div>
  );
}
