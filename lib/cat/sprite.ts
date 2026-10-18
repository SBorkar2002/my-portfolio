import { frames, SIZE, type CatState } from "./frames";

/** Sprite character -> CSS variable holding its colour (Figma cat/*). */
const PALETTE_VARS: Record<string, string> = {
  "#": "--cat-body",
  f: "--cat-body-far",
  Y: "--cat-eye",
  p: "--cat-pupil",
  w: "--cat-shine",
  m: "--cat-mouth",
  M: "--cat-mouth-inner",
  z: "--cat-zzz",
  h: "--cat-heart",
};

export type Palette = Record<string, [number, number, number]>;

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.trim().replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

export function readPalette(): Palette {
  const style = getComputedStyle(document.documentElement);
  const palette: Palette = {};
  for (const [ch, v] of Object.entries(PALETTE_VARS)) palette[ch] = hexToRgb(style.getPropertyValue(v) || "#000000");
  return palette;
}

export type Box = { top: number; left: number; right: number; bottom: number };

const boxes = new Map<CatState, Box>();

/** Union of the opaque pixels across every frame of a state, in sprite pixels (right/bottom inclusive). */
export function stateBox(state: CatState): Box {
  const cached = boxes.get(state);
  if (cached) return cached;
  const box = { top: SIZE, left: SIZE, right: -1, bottom: -1 };
  for (const rows of frames[state]) {
    rows.forEach((row, r) => {
      for (let c = 0; c < row.length; c++) {
        if (row[c] === ".") continue;
        box.top = Math.min(box.top, r);
        box.bottom = Math.max(box.bottom, r);
        box.left = Math.min(box.left, c);
        box.right = Math.max(box.right, c);
      }
    });
  }
  boxes.set(state, box);
  return box;
}

/** Each frame drawn once at 1 sprite px = 1 canvas px for the current palette, then scaled with nearest-neighbour. */
export class FrameCache {
  private cache = new Map<string, HTMLCanvasElement>();
  private palette: Palette = {};

  setPalette(palette: Palette) {
    this.palette = palette;
    this.cache.clear();
  }

  get(state: CatState, index: number) {
    const key = `${state}:${index}`;
    let canvas = this.cache.get(key);
    if (canvas) return canvas;
    canvas = document.createElement("canvas");
    canvas.width = SIZE;
    canvas.height = SIZE;
    const ctx = canvas.getContext("2d")!;
    const image = ctx.createImageData(SIZE, SIZE);
    frames[state][index].forEach((row, r) => {
      for (let c = 0; c < row.length; c++) {
        const rgb = this.palette[row[c]];
        if (!rgb) continue;
        const i = (r * SIZE + c) * 4;
        image.data[i] = rgb[0];
        image.data[i + 1] = rgb[1];
        image.data[i + 2] = rgb[2];
        image.data[i + 3] = 255;
      }
    });
    ctx.putImageData(image, 0, 0);
    this.cache.set(key, canvas);
    return canvas;
  }
}

/**
 * Whole-pixel scale in DEVICE pixels, so every sprite pixel is the same size on 1.25x and 1.5x screens.
 * Returns CSS pixels per sprite pixel.
 */
export function pixelScale(targetCssPerSpritePx: number, maxCssHeight?: number, rows = SIZE) {
  const dpr = window.devicePixelRatio || 1;
  let k = Math.max(1, Math.round(targetCssPerSpritePx * dpr));
  if (maxCssHeight !== undefined) {
    while (k > 1 && (k / dpr) * rows > maxCssHeight) k--;
  }
  return k / dpr;
}
