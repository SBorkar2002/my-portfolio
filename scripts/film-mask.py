"""Builds public/video/motion/film-smarter.mp4: the "every week starts smarter" stretch of the launch film,
with the product name on the memory card's header painted out in every frame (the card moves with the camera,
so its box is tracked per frame). Needs ffmpeg, numpy, pillow and scipy.

Usage: python3 scripts/film-mask.py
"""
import json, os, subprocess, tempfile
import numpy as np
from PIL import Image, ImageDraw
from scipy import ndimage

SRC = os.path.expanduser("~/Documents/tetriz-launch-video-v4.2/out/tetriz-launch-v5.mp4")
OUT = "public/video/motion/film-smarter"
START, FRAMES, FPS = 82.45, 171, 30  # voice gap before "So your org..." to just before the scene fades out
CW, CH = 668, 394  # card size at rest (px)
HEADER = (34, 339, 36, 58)  # header text inside the card at rest: left, right, top, bottom
BG = "0xF1F2F6"


def card_box(a):
    """Bounding box of the largest white region that is not the white band along the bottom."""
    w = a.min(axis=2) >= 250
    lab, n = ndimage.label(w)
    sizes = ndimage.sum(w, lab, range(1, n + 1))
    best = None
    for k, sl in enumerate(ndimage.find_objects(lab)):
        x0, x1, y0, y1 = sl[1].start, sl[1].stop, sl[0].start, sl[0].stop
        if y1 >= 1000 or y1 - y0 < 150 or sizes[k] < 5000:
            continue
        if best is None or sizes[k] > best[4]:
            best = (x0, x1, y0, y1, sizes[k])
    return best


def main():
    tmp = tempfile.mkdtemp()
    ff = lambda *a: subprocess.run(["ffmpeg", "-loglevel", "error", "-y", *a], check=True)
    ff("-ss", str(START), "-i", SRC, "-frames:v", str(FRAMES), "-an", f"{tmp}/%04d.png")
    for i in range(1, FRAMES + 1):
        path = f"{tmp}/{i:04d}.png"
        img = Image.open(path).convert("RGB")
        a = np.array(img)
        box = card_box(a)
        if box:
            x0, x1, y0, y1, _ = box
            s = (y1 - y0) / CH  # the card's left edge can be off screen, so measure from its right edge
            hx0, hx1 = x1 - s * (CW - HEADER[0]) - 14 * s, x1 - s * (CW - HEADER[1]) + 14 * s
            hy0, hy1 = y0 + s * HEADER[2] - 8 * s, y0 + s * HEADER[3] + 8 * s
            if hx1 > 0:
                sy, sx0 = int(y0 + s * 22), max(0, int(hx0))
                sx1 = max(sx0 + 1, min(1919, int(hx1)))
                fill = tuple(int(v) for v in np.median(a[sy:sy + 3, sx0:sx1].reshape(-1, 3), axis=0))
                ImageDraw.Draw(img).rectangle([hx0, hy0, hx1, hy1], fill=fill)
        img.save(path)
    dur = FRAMES / FPS
    ff("-framerate", str(FPS), "-i", f"{tmp}/%04d.png", "-ss", str(START), "-t", f"{dur:.3f}", "-i", SRC,
       "-map", "0:v", "-map", "1:a",
       "-vf", f"scale=1280:720,fade=t=out:st={dur - 0.3:.3f}:d=0.3:color={BG}",
       "-c:v", "libx264", "-preset", "slow", "-crf", "29", "-pix_fmt", "yuv420p",
       "-c:a", "aac", "-b:a", "96k", "-af", f"afade=t=in:d=0.15,afade=t=out:st={dur - 0.3:.3f}:d=0.3",
       "-movflags", "+faststart", f"{OUT}.mp4")
    ff("-ss", "4.6", "-i", f"{OUT}.mp4", "-frames:v", "1", f"{tmp}/poster.png")
    Image.open(f"{tmp}/poster.png").save(f"{OUT}-poster.webp", quality=78)
    print("video film-smarter")


if __name__ == "__main__":
    main()
