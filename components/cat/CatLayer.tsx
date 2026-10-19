"use client";

import { usePathname } from "next/navigation";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import type { CatState } from "@/lib/cat/frames";
import { catEnabled, onCatChange } from "@/lib/cat/prefs";
import { onThemeChange } from "@/lib/theme";

type Sprite = typeof import("@/lib/cat/sprite");
type Data = typeof import("@/lib/cat/frames");
type Ctx = { sprite: Sprite; data: Data; reduced: boolean; mobile: boolean };

/** Where the cat is and how it got there. Page pixels: left edge of the 48 x 48 box, Y of the feet. */
type Spot = {
  id: string;
  left: number;
  floor: number;
  s: number;
  /** How it arrives: fall in from above, peek over an edge, poke out sideways, hang from a top edge, or just appear. */
  enter: "fall" | "peek" | "side" | "hang" | "appear";
  /** What it does once there. */
  then: "talk" | "wander" | "nap" | "hold";
  line?: string;
  flip?: boolean;
};

const SIZE = 48;
const SLEEP_AFTER = 5000;
const LASER_REST = 1200;
const LASER_COOLDOWN = 9000;

// One short line per work tile (hover), no em dashes. Order matches lib/projects.ts.
const TILE_LINES: Record<string, string> = {
  "project-1": "five pages, one shared kit",
  "project-2": "human art, verified",
  "project-3": "a webinar built like a call",
  "project-4": "one look per category",
  "project-5": "script to render, with review gates",
};
const SECTION_LINES: Record<string, string[]> = {
  "hero-panel": ["hey!", "press 1 to 6", "try the ? key"],
  work: ["tap a tile", "press 2 for Sourced"],
  art: ["drawing since 2020"],
  footer: ["say hi!"],
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
  const shadowRef = useRef<HTMLCanvasElement>(null);
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
    let lastLaser = 0;
    const reducedQuery = matchMedia("(prefers-reduced-motion: reduce)");
    const mobileQuery = matchMedia("(max-width: 767px)");
    const fineQuery = matchMedia("(pointer: fine)");
    const wrap = wrapRef.current!;
    const canvas = canvasRef.current!;
    const shadow = shadowRef.current!;
    const hit = hitRef.current!;
    const bubble = bubbleRef.current!;
    const laser = laserRef.current!;

    const baseScale = () => ctx!.sprite.pixelScale(ctx!.mobile ? 2.4 : 3.4);

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
    }

    function draw(shadowScale = 1) {
      if (!ctx || !spot) return;
      const s = spot.s;
      paint(canvas, frame.state, frame.index, frame.flip, s);
      const dpr = window.devicePixelRatio || 1;
      const snap = (v: number) => Math.round(v * dpr) / dpr;
      const top = Math.round((y - SIZE * s) / s) * s;
      wrap.style.transform = `translate(${snap(x)}px, ${snap(top)}px)`;
      wrap.dataset.state = `${spot.id}:${frame.state}`;
      // Ground shadow stays on the floor and grows as the cat comes down (2.5D cue). Not drawn for peeks.
      const grounded = spot.enter === "fall" || spot.enter === "appear";
      shadow.hidden = !grounded;
      if (grounded) shadow.style.transform = `translate(0px, ${snap(spot.floor - y + 3 * s)}px) scale(${shadowScale})`;
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
      const speed = state === "Run" ? 520 : 140;
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

    function wake() {
      lastActive = performance.now();
      if (mode !== "sleeping" || !ctx || ctx.reduced) return;
      stop();
      mode = "idle";
      play("Sit", idle, { frames: [2, 3, 0] });
    }

    function say(text: string | undefined, then: () => void) {
      if (!text || !ctx) return then();
      showBubble(text);
      if (ctx.reduced) return then();
      play("Talk", then);
    }

    function showBubble(text: string) {
      if (!spot || !ctx) return;
      bubble.textContent = text;
      bubble.hidden = false;
      const w = bubble.offsetWidth;
      const s = spot.s;
      const b = ctx.sprite.stateBox("Sit");
      // Beside the head: left of the cat, or right of it when the left side would leave the screen.
      let left = b.left * s - w - 10;
      if (x + left < 8) left = (b.right + 1) * s + 10;
      bubble.style.left = `${left}px`;
      bubble.style.top = `${(b.top + 2) * s}px`;
      window.clearTimeout(bubbleTimer);
      if (!ctx.reduced) bubbleTimer = window.setTimeout(hideBubble, 4200);
    }

    function hideBubble() {
      window.clearTimeout(bubbleTimer);
      bubble.hidden = true;
    }

    function hide() {
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
      paint(shadow, "Shadow", 0, false, s);
    }

    /** Settles into a spot with its entrance, then its behaviour. */
    function go(next: Spot) {
      stop();
      hideBubble();
      spot = next;
      wrap.hidden = false;
      placeHit();
      if (!ctx) return;
      const s = next.s;
      x = next.left;
      y = next.floor;
      if (ctx.reduced) {
        frame = next.then === "nap" ? { state: "Sleep", index: 0, flip: false } : { state: "Sit", index: 0, flip: false };
        mode = "idle";
        draw();
        if (next.line) showBubble(next.line);
        return;
      }
      mode = "moving";
      const after = () => behave(next);
      if (next.enter === "fall") {
        // Fall from the top of the screen, spinning: Fall x2, Tumble x2, Fall, then Land.
        const startY = Math.min(Math.max(next.floor - innerHeight, scrollY + 60) + SIZE * s * 0.6, next.floor);
        y = startY;
        const distance = next.floor - startY;
        const duration = Math.min(1300, Math.max(650, Math.sqrt(Math.max(0, distance)) * 34));
        const seq: [CatState, number][] = [];
        const add = (st: CatState) => ctx!.data.frames[st].forEach((_, i) => seq.push([st, i]));
        add("Fall");
        add("Fall");
        add("Tumble");
        add("Tumble");
        add("Fall");
        const t0 = performance.now();
        const tick = () => {
          if (disposed || !ctx) return;
          const t = Math.min(1, (performance.now() - t0) / duration);
          y = startY + distance * t * t;
          const [st, i] = seq[Math.min(seq.length - 1, Math.floor(t * seq.length))];
          frame = { state: st, index: i, flip: false };
          draw(0.4 + 0.6 * t);
          if (t < 1) timer = window.setTimeout(tick, 33);
          else {
            y = next.floor;
            play("Land", after);
          }
        };
        tick();
      } else if (next.enter === "peek") play("Peek", after);
      else if (next.enter === "side") play("PeekSide", after, { flip: next.flip });
      else if (next.enter === "hang") play("PeekTop", after);
      else after();
    }

    function behave(next: Spot) {
      lastActive = performance.now();
      const line = next.line;
      if (next.then === "hold") {
        mode = "idle";
        if (line) showBubble(line);
        const st: CatState = next.enter === "peek" ? "Peek" : next.enter === "side" ? "PeekSide" : "PeekTop";
        const last = ctx!.data.frames[st].length - 1;
        const loop = () => play(st, loop, { frames: [last - 1, last], flip: next.flip });
        loop();
        return;
      }
      if (next.then === "nap") {
        // Contact: sit, then yawn and sleep; waking brings it back to sitting.
        say(line, idle);
        return;
      }
      if (next.then === "wander") {
        // Walk a few steps, come back, sit, say the line. Idle then yawns and sleeps after 5 s.
        const home = next.left;
        const away = Math.max(16, home - SIZE * next.s * 1.6);
        moveTo(away, next.floor, "Walk", () => moveTo(home, next.floor, "Walk", () => say(line, idle)));
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
        const el = document.querySelector('[data-cat-perch="hero-panel"]');
        if (!el) return null;
        const p = page(el);
        return { id, s, left: p.right - 28 - (sit.right + 1) * s, floor: p.top, enter: "fall", then: "talk", line };
      }
      if (id === "work" || id === "art") {
        const el = document.getElementById(id);
        const inner = el?.querySelector(":scope > .mx-auto");
        if (!el || !inner) return null;
        const box = page(inner);
        const pad = parseFloat(getComputedStyle(inner).paddingRight || "0");
        return { id, s, left: box.right - pad - (sit.right + 1) * s, floor: page(el).bottom - 2, enter: "fall", then: "wander", line };
      }
      if (id === "work-peek") {
        // Peek over the top edge of the work tile nearest the middle of the screen, so the cat is never missing here.
        let best: Element | null = null;
        let bestD = Infinity;
        for (const t of document.querySelectorAll("#work [id^='project-']")) {
          const r = t.getBoundingClientRect();
          if (r.top < 90 || r.top > innerHeight - 60) continue;
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
      if (id === "experience") {
        const row = document.querySelector<HTMLElement>("[data-exp-active]");
        if (!row) return null;
        const p = page(row);
        const side = ctx.sprite.stateBox("PeekSide");
        // Pokes out from behind the right edge of the active role, into the gutter.
        const headMid = ((side.top + side.bottom) / 2) * s;
        return {
          id: `experience:${row.dataset.step ?? ""}`,
          s,
          left: p.right,
          floor: p.top + p.height / 2 - headMid + SIZE * s,
          enter: "side",
          then: "hold",
        };
      }
      if (id === "footer") {
        const el = document.querySelector('[data-cat-perch="footer"]');
        const section = document.getElementById("contact");
        const inner = section?.querySelector(":scope > .mx-auto");
        if (!el || !inner) return null;
        const big = ctx.sprite.pixelScale(ctx.mobile ? 3.6 : 5.25);
        const box = page(inner);
        const pad = parseFloat(getComputedStyle(inner).paddingRight || "0");
        return { id, s: big, left: box.right - pad - (sit.right + 1) * big, floor: page(el).top - 8, enter: "appear", then: "nap", line };
      }
      return null;
    }

    /** What the cat should be doing for the current scroll position. */
    function target(): string | null {
      const vh = innerHeight;
      const between = (el: Element | null, edge: "top" | "bottom", lo: number, hi = vh - 8) => {
        if (!el) return false;
        const v = el.getBoundingClientRect()[edge];
        return v > lo && v < hi;
      };
      const contact = document.getElementById("contact");
      if (contact && contact.getBoundingClientRect().top < vh * 0.55) return "footer";
      const art = document.getElementById("art");
      if (between(art, "bottom", 160)) return "art";
      const exp = document.getElementById("experience");
      if (exp) {
        const r = exp.getBoundingClientRect();
        if (r.top < vh * 0.5 && r.bottom > vh * 0.5 && document.querySelector("[data-exp-active]")) return "experience";
      }
      const work = document.getElementById("work");
      if (between(work, "bottom", 160)) return "work";
      if (work) {
        const r = work.getBoundingClientRect();
        if (r.top < vh * 0.6 && r.bottom > vh * 0.4) return "work-peek";
      }
      const panel = document.querySelector('[data-cat-perch="hero-panel"]');
      if (between(panel, "top", 80)) return "hero-panel";
      return null;
    }

    let pending: string | null | undefined;
    let settle = 0;
    function choose() {
      if (!ctx || hoverTile || mode === "laser") return;
      let want = target();
      if (ctx.reduced && want !== "hero-panel" && want !== "footer") want = null;
      const next = want ? spotFor(want) : null;
      const key = next ? next.id : null;
      if (key === pending) return;
      window.clearTimeout(settle);
      if (key === (spot?.id ?? null)) {
        pending = undefined;
        return;
      }
      pending = key;
      settle = window.setTimeout(() => {
        pending = undefined;
        const fresh = want ? spotFor(want) : null;
        if (fresh && fresh.id !== spot?.id) {
          lineIndex++;
          go(fresh);
        } else if (!fresh) hide();
      }, 160);
    }

    // ---------- hover a work tile: the cat hangs from its top edge and says one line ----------

    const onTileEnter = (e: Event) => {
      if (!ctx || ctx.reduced || ctx.mobile) return;
      const tile = e.currentTarget as HTMLElement;
      hoverTile = tile;
      const p = page(tile);
      const s = baseScale();
      const top = ctx.sprite.stateBox("PeekTop");
      go({ id: `hover:${tile.id}`, s, left: p.right - 48 - (top.right + 1) * s, floor: p.top + SIZE * s, enter: "hang", then: "hold", line: TILE_LINES[tile.id] });
    };
    const onTileLeave = () => {
      hoverTile = null;
      spot = null;
      choose();
    };

    // ---------- laser pointer: a dot follows the pointer; when it rests, the cat runs over once and inspects it ----------

    let restTimer = 0;
    let laserX = 0;
    let laserY = 0;
    const onPointer = (e: PointerEvent) => {
      wake();
      if (!ctx || ctx.reduced || !fineQuery.matches) return;
      laserX = e.clientX;
      laserY = e.clientY;
      laser.style.transform = `translate(${laserX + 10}px, ${laserY + 10}px)`;
      laser.hidden = false;
      window.clearTimeout(restTimer);
      if (mode === "laser") return;
      restTimer = window.setTimeout(chaseLaser, LASER_REST);
    };
    function chaseLaser() {
      if (!ctx || !spot || hoverTile || mode === "moving" || performance.now() - lastLaser < LASER_COOLDOWN) return;
      const el = document.elementFromPoint(laserX, laserY);
      if (el?.closest("a, button, input, nav, header, dialog")) return; // stay calm over controls
      lastLaser = performance.now();
      stop();
      hideBubble();
      mode = "laser";
      const s = spot.s;
      const insp = ctx.sprite.stateBox("Inspect");
      const dotX = laserX + 10 + scrollX;
      const dotY = laserY + 10 + scrollY;
      const fromLeft = x + SIZE * s * 0.5 < dotX;
      const goalX = fromLeft ? dotX - (insp.right + 1) * s : dotX - (SIZE - 1 - insp.right) * s;
      spot = { ...spot, id: "laser", enter: "appear", then: "talk" };
      moveTo(goalX, dotY + 4 * s, "Run", () =>
        play("Inspect", () => {
          mode = "idle";
          idle();
        }, { flip: !fromLeft }),
      );
    }

    // ---------- wiring ----------

    let scrollTimer = 0;
    const onScroll = () => {
      wake();
      laser.hidden = true;
      if (mode === "laser" || spot?.id === "laser") {
        mode = "idle";
        spot = null;
      }
      if (!scrollTimer)
        scrollTimer = window.setTimeout(() => {
          scrollTimer = 0;
          choose();
        }, 80);
    };
    const onExp = () => {
      if (spot?.id.startsWith("experience")) {
        spot = null;
        choose();
      }
    };
    const onKey = () => wake();
    const onVisibility = () => {
      if (document.hidden) stop();
      else if (spot && ctx && !ctx.reduced && (mode === "idle" || mode === "sleeping")) idle();
    };
    const resize = new ResizeObserver(() => {
      if (!spot || mode === "moving" || mode === "laser" || hoverTile) return;
      const id = spot.id;
      spot = null;
      choose();
      void id;
    });
    let unTheme = () => {};
    const tiles: Element[] = [];

    petRef.current = () => {
      if (!ctx || !spot || ctx.reduced || mode === "moving") return;
      lastActive = performance.now();
      stop();
      const lines = SECTION_LINES[spot.id] ?? ["meow"];
      showBubble(lines[lineIndex++ % lines.length]);
      mode = "idle";
      if (spot.enter === "fall" || spot.enter === "appear") play("React", idle);
      else play("Sit", idle, { frames: [0, 3, 0] });
    };

    async function boot() {
      const [sprite, data] = await Promise.all([import("@/lib/cat/sprite"), import("@/lib/cat/frames")]);
      if (disposed) return;
      ctx = { sprite, data, reduced: reducedQuery.matches, mobile: mobileQuery.matches };
      cache = new sprite.FrameCache();
      cache.setPalette(sprite.readPalette());
      unTheme = onThemeChange(() => {
        cache!.setPalette(sprite.readPalette());
        if (spot) {
          placeHit();
          draw();
        }
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
      if (document.documentElement.dataset.loading) window.addEventListener("loaderdone", () => choose(), { once: true });
      else choose();
    }

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
      window.clearTimeout(restTimer);
      if (window.cancelIdleCallback && typeof handle === "number") window.cancelIdleCallback(handle);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      window.removeEventListener("pointermove", onPointer);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("exprole", onExp);
      document.removeEventListener("visibilitychange", onVisibility);
      tiles.forEach((t) => {
        t.removeEventListener("pointerenter", onTileEnter);
        t.removeEventListener("pointerleave", onTileLeave);
      });
      resize.disconnect();
      unTheme();
    };
  }, []);

  return (
    <>
      <div ref={laserRef} hidden aria-hidden="true" className="laser-dot pointer-events-none fixed top-0 left-0 z-[65]" />
      <div ref={wrapRef} hidden className="pointer-events-none absolute top-0 left-0 z-40" style={{ width: 0, height: 0 }}>
        <canvas ref={shadowRef} aria-hidden="true" className="absolute top-0 left-0 block origin-bottom [image-rendering:pixelated]" />
        <canvas ref={canvasRef} aria-hidden="true" className="relative block [image-rendering:pixelated]" />
        <div
          ref={bubbleRef}
          hidden
          role="status"
          className="type-label-s absolute z-10 border-2 border-line bg-raised px-2.5 py-2 whitespace-nowrap text-primary shadow-[3px_3px_0_0_var(--pastel-lilac)]"
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
