import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { PAGES } from "./seo";

// Share card for one page, 1200 x 630, in the site's pixel chrome: SB badge, kicker, Jersey headline and the page's
// own screenshot in a bordered frame with a hard offset shadow. Rendered once at build time.
export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const C = { bg: "#f3f0fa", raised: "#ffffff", line: "#d4cde4", fg: "#17141f", muted: "#474259", ink: "#5b47d6", lilac: "#c3b5ff", lime: "#d9f860" };

export async function ogImage(path: keyof typeof PAGES, shot: string) {
  const root = process.cwd();
  const [jersey, silk, img] = await Promise.all([
    readFile(join(root, "assets/fonts/Jersey15-Regular.ttf")),
    readFile(join(root, "assets/fonts/Silkscreen-Regular.ttf")),
    readFile(join(root, "assets/og", `${shot}.png`)),
  ]);
  const { card } = PAGES[path];
  const src = `data:image/png;base64,${img.toString("base64")}`;
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", background: C.bg, padding: 56, gap: 48, fontFamily: "Silkscreen" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", width: 520, height: "100%" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 64, height: 64, background: C.lilac, border: `4px solid ${C.fg}`, fontFamily: "Jersey", fontSize: 44, color: C.fg }}>SB</div>
            <div style={{ fontSize: 20, color: C.fg, letterSpacing: 2 }}>SEJAL BORKAR</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div style={{ fontSize: 20, color: C.ink, letterSpacing: 1 }}>{card.kicker}</div>
            <div style={{ fontFamily: "Jersey", fontSize: 76, lineHeight: 0.92, color: C.fg }}>{card.title}</div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ display: "flex", background: C.lime, border: `3px solid ${C.fg}`, padding: "8px 14px", fontSize: 16, color: C.fg }}>PRODUCT DESIGNER</div>
            <div style={{ fontSize: 16, color: C.muted }}>SEJALBORKAR.VERCEL.APP</div>
          </div>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
          <div style={{ display: "flex", width: 540, height: 430, border: `4px solid ${C.line}`, background: C.raised, boxShadow: `14px 14px 0 0 ${C.lilac}` }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={src} width={532} height={422} alt="" style={{ width: 532, height: 422, objectFit: "cover" }} />
          </div>
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: "Jersey", data: jersey, style: "normal", weight: 400 },
        { name: "Silkscreen", data: silk, style: "normal", weight: 400 },
      ],
    },
  );
}
