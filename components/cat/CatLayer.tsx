"use client";

import { usePathname } from "next/navigation";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import type { CatState } from "@/lib/cat/frames";
import { catEnabled, onCatChange } from "@/lib/cat/prefs";
import { onThemeChange } from "@/lib/theme";

type Sprite = typeof import("@/lib/cat/sprite");
type Data = typeof import("@/lib/cat/frames");

/** One run of frames. `walk` repeats the frames, moving `dx` sprite px per frame, until the cat reaches `rest`. */
type Step = { state: CatState; frames?: number[]; loops?: number; flip?: boolean; walk?: { dx: number }; at?: number };

type Plan = {
  id: string;
  s: number; // CSS px per sprite px
  floor: number; // page Y of the feet
  start: number; // page X of the sprite box when it enters
  rest: number; // page X of the sprite box once settled
  enter: Step[];
  idle: () => Step[];
  states: CatState[]; // every state drawn here, for the overlap check and the hit area
  section: Element;
  reduced?: { state: CatState; frame: number };
};

type Ctx = { sprite: Sprite; data: Data; reduced: boolean; mobile: boolean };

const SIZE = 48;
const CONTENT = "h1,h2,h3,p,a,button,img,kbd,li,dt,dd,figcaption,blockquote,input";

function page(el: Element) {
  const r = el.getBoundingClientRect();
  return { top: r.top + scrollY, bottom: r.bottom + scrollY, left: r.left + scrollX, right: r.right + scrollX, width: r.width, height: r.height };
}

/** Page rectangle the cat can cover between start and rest, across every state used at the perch. */
function coverage(ctx: Ctx, plan: Plan) {
  let top = Infinity;
  let left = Infinity;
  let right = -Infinity;
  for (const state of plan.states) {
    const b = ctx.sprite.stateBox(state);
    const flips = state === "Walk" ? [false, true] : [false];
    for (const flip of flips) {
      const l = flip ? SIZE - 1 - b.right : b.left;
      const r = flip ? SIZE - 1 - b.left : b.right;
      top = Math.min(top, plan.floor - (SIZE - b.top) * plan.s);
      left = Math.min(left, Math.min(plan.start, plan.rest) + l * plan.s);
      right = Math.max(right, Math.max(plan.start, plan.rest) + (r + 1) * plan.s);
    }
  }
  return { top, left, right, bottom: plan.floor };
}

/** True when the cat would sit on top of any text, link, button or image. It must only ever use empty space. */
function overlapsContent(rect: { top: number; left: number; right: number; bottom: number }, section: Element) {
  if (rect.left < 0 || rect.right > document.documentElement.clientWidth) return true;
  for (const el of section.querySelectorAll(CONTENT)) {
    const r = page(el);
    if (r.width === 0 || r.height === 0) continue;
    if (rect.left < r.right - 0.5 && rect.right > r.left + 0.5 && rect.top < r.bottom - 0.5 && rect.bottom > r.top + 0.5) return true;
  }
  return false;
}

function pick<T>(list: T[]) {
  return list[Math.floor(Math.random() * list.length)];
}

// Sitting idle: blinks, with a look around or a yawn now and then.
const sitIdle = (): Step[] => [{ state: "Sit", loops: 2 }, pick<Step>([{ state: "Sit" }, { state: "Look", frames: [0, 1] }, { state: "Yawn" }])];

/** The five perches from the Home notes (Figma 30:811). Each returns where the cat goes and what it does. */
const perches: { id: string; mobile: boolean; plan: (el: HTMLElement, ctx: Ctx) => Omit<Plan, "id" | "section"> | null }[] = [
  {
    // Sits on the top edge of the jump-in panel when the page loads.
    id: "hero-panel",
    mobile: true,
    plan: (el, { sprite }) => {
      const s = sprite.pixelScale(2);
      const panel = page(el);
      const rest = panel.right - 28 - (sprite.stateBox("Sit").right + 1) * s;
      return {
        s,
        floor: panel.top,
        start: rest,
        rest,
        enter: [{ state: "Land" }],
        idle: sitIdle,
        states: ["Land", "Sit", "Look", "Yawn"],
        reduced: { state: "Sit", frame: 0 },
      };
    },
  },
  {
    // Walks once along the gutter above tile 01, then sits beside the title.
    id: "work-gutter",
    mobile: false,
    plan: (el, { sprite }) => {
      const s = sprite.pixelScale(2);
      const tile = el.nextElementSibling;
      const title = el.firstElementChild;
      if (!tile || !title) return null;
      const floor = page(tile).top;
      const rest = page(title).right + 24 - sprite.stateBox("Sit").left * s;
      const label = el.querySelector(":scope > p");
      const laneEnd = label && page(label).width > 0 ? page(label).left - 16 : page(el).right;
      const start = Math.min(rest + 280, laneEnd - (sprite.stateBox("Walk").right + 1) * s);
      return {
        s,
        floor,
        start: Math.max(start, rest),
        rest,
        enter: [{ state: "Walk", flip: true, walk: { dx: -4 } }],
        idle: sitIdle,
        states: ["Walk", "Sit", "Look", "Yawn"],
      };
    },
  },
  {
    // Peeks out from behind the Sourced image as it scrolls in.
    id: "tile-03",
    mobile: false,
    plan: (el, { sprite }) => {
      const tile = el.closest("a, article");
      const section = el.closest("section");
      if (!tile || !section) return null;
      const t = page(tile);
      const edge = t.top;
      // Free space between this tile and the tile above it, minus that tile's 8px hard shadow.
      let above = -Infinity;
      for (const other of section.querySelectorAll("a, article")) {
        const o = page(other);
        if (other !== tile && o.bottom <= edge && o.right > t.left && o.left < t.right) above = Math.max(above, o.bottom + 8);
      }
      const room = edge - (Number.isFinite(above) ? above : edge - 160);
      const peekRows = SIZE - sprite.stateBox("Peek").top;
      const s = sprite.pixelScale(2, room, peekRows);
      if (peekRows * s > room) return null;
      const rest = t.right - 56 - (sprite.stateBox("Peek").right + 1) * s;
      return {
        s,
        floor: edge,
        start: rest,
        rest,
        enter: [{ state: "Peek" }],
        idle: () => [{ state: "Peek", frames: [4, 5, 4, 6] }],
        states: ["Peek"],
      };
    },
  },
  {
    // Sits next to the section title and inspects the mosaics.
    id: "art-room",
    mobile: false,
    plan: (el, { sprite }) => {
      const s = sprite.pixelScale(2);
      const heading = el.firstElementChild;
      if (!heading) return null;
      const rest = page(heading).right + 32 - sprite.stateBox("Sit").left * s;
      return {
        s,
        floor: page(el).bottom,
        start: rest,
        rest,
        enter: [{ state: "Sit" }, { state: "Look", frames: [5] }, { state: "Inspect" }],
        idle: () => [{ state: "Sit", loops: 2 }, pick<Step>([{ state: "Inspect" }, { state: "Look", frames: [1, 5] }, { state: "Sit" }])],
        states: ["Sit", "Look", "Inspect"],
      };
    },
  },
  {
    // Curls up and sleeps by the footer.
    id: "footer",
    mobile: true,
    plan: (el, { sprite }) => {
      const s = sprite.pixelScale(2);
      const label = el.firstElementChild;
      const button = el.lastElementChild;
      if (!label || !button) return null;
      const l = page(label);
      const b = page(button);
      const sleep = sprite.stateBox("Sleep");
      const width = (sleep.right - sleep.left + 1) * s;
      const sameRow = Math.abs(b.top - l.top) < 4 && b.left - l.right > width + 48;
      // In the gap between the two labels, or above the row when they wrap on narrow screens.
      const visibleLeft = sameRow ? (l.right + b.left) / 2 - width / 2 : page(el).right - width;
      const floor = sameRow ? l.bottom : Math.min(l.top, b.top) - 8;
      const rest = visibleLeft - sleep.left * s;
      return {
        s,
        floor,
        start: rest,
        rest,
        enter: [{ state: "Yawn" }],
        idle: () => [{ state: "Sleep", loops: 4 }],
        states: ["Yawn", "Sleep"],
        reduced: { state: "Sleep", frame: 0 },
      };
    },
  },
];

/** The pixel cat (owned by the cat studio, art from cat v2). Home page only for now. */
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
  const petRef = useRef<() => void>(() => {});

  useEffect(() => {
    let disposed = false;
    let ctx: Ctx | null = null;
    let cache: InstanceType<Sprite["FrameCache"]> | null = null;
    let plan: Plan | null = null;
    let left = 0;
    let queue: Step[] = [];
    let entered = false;
    let timer = 0;
    let frame = { state: "Sit" as CatState, index: 0, flip: false };
    const walked = new Set<string>();
    const visits = new Set<string>();
    const reducedQuery = matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = matchMedia("(max-width: 767px)");

    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const hit = hitRef.current!;

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
      g.setTransform(1, 0, 0, 1, 0, 0);
      g.clearRect(0, 0, size, size);
      g.imageSmoothingEnabled = false;
      if (frame.flip) g.setTransform(-1, 0, 0, 1, size, 0);
      g.drawImage(cache.get(frame.state, frame.index), 0, 0, size, size);
      const x = Math.round(left * dpr) / dpr;
      const y = Math.round((plan.floor - SIZE * plan.s) * dpr) / dpr;
      wrap.style.transform = `translate(${x}px, ${y}px)`;
      wrap.dataset.state = `${plan.id}:${frame.state}`;
    }

    function placeHitArea() {
      if (!ctx || !plan) return;
      let t = SIZE;
      let l = SIZE;
      let r = 0;
      for (const state of plan.states) {
        if (state === "Walk") continue;
        const b = ctx.sprite.stateBox(state);
        t = Math.min(t, b.top);
        l = Math.min(l, b.left);
        r = Math.max(r, b.right + 1);
      }
      Object.assign(hit.style, {
        left: `${l * plan.s}px`,
        top: `${t * plan.s}px`,
        width: `${(r - l) * plan.s}px`,
        height: `${(SIZE - t) * plan.s}px`,
      });
    }

    function stop() {
      window.clearTimeout(timer);
      timer = 0;
    }

    /** Plays the queue frame by frame using the cat studio's timings; refills from the perch's idle loop. */
    function tick() {
      if (!ctx || !plan || disposed) return;
      if (queue.length === 0) {
        entered = true;
        queue = plan.idle().map((s) => ({ ...s }));
      }
      const step = queue[0];
      const list = step.frames ?? ctx.data.frames[step.state].map((_, i) => i);
      const cursor = step.at ?? 0;
      const index = list[cursor % list.length];
      frame = { state: step.state, index, flip: Boolean(step.flip) };
      if (step.walk) {
        left += step.walk.dx * plan.s;
        if ((step.walk.dx < 0 && left <= plan.rest) || (step.walk.dx > 0 && left >= plan.rest)) {
          left = plan.rest;
          queue.shift();
        } else {
          step.at = cursor + 1;
        }
      } else {
        const loops = step.loops ?? 1;
        if (cursor + 1 >= list.length * loops) queue.shift();
        else step.at = cursor + 1;
      }
      draw();
      timer = window.setTimeout(tick, ctx.data.timings[step.state][index] * 1000);
    }

    function hide() {
      stop();
      plan = null;
      wrap.hidden = true;
    }

    function show(next: Plan) {
      stop();
      plan = next;
      wrap.hidden = false;
      placeHitArea();
      if (ctx!.reduced) {
        const pose = next.reduced!;
        left = next.rest;
        frame = { state: pose.state, index: pose.frame, flip: false };
        draw();
        return;
      }
      const first = !visits.has(next.id);
      visits.add(next.id);
      entered = false;
      // The walk happens once per visit to the page; Land plays only on the first arrival.
      if (next.id === "work-gutter" && walked.has(next.id)) queue = [];
      else if (next.id === "hero-panel" && !first) queue = [];
      else queue = next.enter.map((s) => ({ ...s }));
      if (next.id === "work-gutter") walked.add(next.id);
      left = queue.length ? next.start : next.rest;
      tick();
    }

    function planFor(id: string): Plan | null {
      if (!ctx) return null;
      const def = perches.find((p) => p.id === id)!;
      const el = document.querySelector<HTMLElement>(`[data-cat-perch="${id}"]`);
      if (!el) return null;
      const section = el.closest("section, header") ?? document.body;
      const raw = def.plan(el, ctx);
      if (!raw) return null;
      const full: Plan = { ...raw, id, section };
      if (ctx.reduced && !full.reduced) return null;
      if (overlapsContent(coverage(ctx, full), section)) return null;
      return full;
    }

    /** The perch nearest the middle of the viewport wins, after it has been the nearest for 200ms.
        `pending` is undefined when nothing is waiting, null when the cat is about to leave. */
    let pending: string | null | undefined = undefined;
    let settle = 0;
    function choose() {
      if (!ctx) return;
      const middle = innerHeight / 2;
      let best: string | null = null;
      let bestDistance = Infinity;
      for (const def of perches) {
        if (ctx.mobile && !def.mobile) continue;
        if (ctx.reduced && def.id !== "hero-panel" && def.id !== "footer") continue;
        const el = document.querySelector(`[data-cat-perch="${def.id}"]`);
        if (!el) continue;
        const r = el.getBoundingClientRect();
        if (r.bottom < 0 || r.top > innerHeight) continue;
        const distance = Math.abs((r.top + r.bottom) / 2 - middle);
        if (distance < bestDistance) {
          bestDistance = distance;
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
        const target = pending;
        pending = undefined;
        if (target === undefined || target === (plan?.id ?? null)) return;
        const next = target ? planFor(target) : null;
        if (next) show(next);
        else hide();
      }, 200);
    }

    /** Layout changed (resize, fonts, images): recompute the current perch without replaying its entrance. */
    function relayout() {
      if (!plan || !ctx) return;
      const next = planFor(plan.id);
      if (!next) return hide();
      const settled = entered || ctx.reduced;
      plan = next;
      if (settled) left = next.rest;
      placeHitArea();
      draw();
    }

    // Throttled with a timer rather than rAF so a paused rAF (background tabs) never leaves it stuck.
    let scrollTimer = 0;
    const onScroll = () => {
      if (!scrollTimer) scrollTimer = window.setTimeout(() => {
        scrollTimer = 0;
        choose();
      }, 80);
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (plan && ctx && !ctx.reduced && !timer) tick();
    };
    const resize = new ResizeObserver(() => relayout());
    let unTheme = () => {};

    petRef.current = () => {
      if (!ctx || !plan || ctx.reduced || !entered) return;
      const react = { ...plan, states: ["React" as CatState], start: plan.rest };
      const room = !overlapsContent(coverage(ctx, react), plan.section);
      stop();
      queue = room ? [{ state: "React" }] : [{ state: "Look", frames: [0, 1, 0] }];
      tick();
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
      document.addEventListener("visibilitychange", onVisibility);
      resize.observe(document.body);
      choose();
    }

    const onPrefs = () => {
      if (!ctx) return;
      ctx.reduced = reducedQuery.matches;
      ctx.mobile = mobileQuery.matches;
      const id = plan?.id;
      hide();
      pending = undefined;
      if (id) {
        const next = planFor(id);
        if (next) show(next);
      }
      choose();
    };
    reducedQuery.addEventListener("change", onPrefs);
    mobileQuery.addEventListener("change", onPrefs);

    // Load the sprites once the page is idle, so the cat never delays the first paint.
    const idle = window.requestIdleCallback ?? ((cb: () => void) => window.setTimeout(cb, 600));
    const handle = idle(() => {
      boot().catch(() => hide());
    });

    return () => {
      disposed = true;
      stop();
      window.clearTimeout(settle);
      window.clearTimeout(scrollTimer);
      if (window.cancelIdleCallback && typeof handle === "number") window.cancelIdleCallback(handle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      document.removeEventListener("visibilitychange", onVisibility);
      reducedQuery.removeEventListener("change", onPrefs);
      mobileQuery.removeEventListener("change", onPrefs);
      resize.disconnect();
      unTheme();
    };
  }, []);

  return (
    <div ref={wrapRef} hidden className="pointer-events-none absolute top-0 left-0 z-40" style={{ width: 0, height: 0 }}>
      <canvas ref={canvasRef} aria-hidden="true" className="block [image-rendering:pixelated]" />
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
