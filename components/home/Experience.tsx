"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Img } from "../Img";
import { SectionTitle, Tag, type TagKind } from "../ui";

const gutter = "mx-auto max-w-[1440px] px-[clamp(20px,8.333vw,120px)]";

type Chapter = {
  key: string;
  dates: string;
  rail: string;
  role: string;
  detail: string;
  /** Roles only: three short "what I did" points (experience-copy.md, verbatim). */
  points?: string[];
  tag?: TagKind;
  color: string;
  icon?: string[];
  /** The company's logo, shown in the tile so the company reads before the text. `mask` art is drawn in the
      tile's ink colour, so line art recolours with no white box. */
  logo?: { src: string; alt: string; pad?: boolean; mask?: boolean };
  /** What the guide cat says when this chapter zooms in. */
  line: string;
  /** Intro only: degrees, shown as their own block under the intro text. [degree, school and place, years] */
  education?: [string, string, string][];
};

// Pixel icons, one per role. '#' is a filled pixel.
const ICONS = {
  spark: [
    "......#......",
    "......#......",
    ".....###.....",
    ".....###.....",
    "...#######...",
    "#############",
    "...#######...",
    ".....###.....",
    ".....###.....",
    "......#......",
    "......#......",
  ],
  page: [
    "#########..",
    "#.......##.",
    "#.###....##",
    "#.........#",
    "#.#######.#",
    "#.........#",
    "#.#######.#",
    "#.........#",
    "#.####....#",
    "#.........#",
    "###########",
  ],
  bubble: [
    ".###########.",
    "#...........#",
    "#.##.##.###.#",
    "#...........#",
    "#.####.##...#",
    "#...........#",
    ".#####.######",
    ".....#.#.....",
    ".....##......",
    ".....#.......",
  ],
  cup: [
    "..#...#...#....",
    "...#...#...#...",
    "..#...#...#....",
    "...............",
    "###########....",
    "#.........#####",
    "#.........#...#",
    "#.........#####",
    "#.........#....",
    ".#.......#.....",
    "..#######......",
  ],
  pencil: [
    ".........###",
    "........####",
    ".......####.",
    "......####..",
    ".....####...",
    "....####....",
    "...####.....",
    "..####......",
    ".###........",
    "##..........",
    "#...........",
  ],
};

const chapters: Chapter[] = [
  {
    key: "intro",
    dates: "HELLO",
    rail: "HI",
    role: "Hi, I am Sejal.",
    detail: "Before product design I spent four years drawing for clients as Jeneko, and it still shapes how I work.",
    color: "var(--pastel-mint)",
    line: "scroll, I'll show you",
    education: [["MCA", "Ramaiah Institute of Technology, Bengaluru", "2024 TO 2025"]],
  },
  {
    key: "epifi",
    dates: "SINCE JUN 2026",
    rail: "2026",
    role: "GenAI Product Designer · Epifi Technologies (Fi Money)",
    detail: "Product design for Tetriz, a B2B engineering-intelligence platform, from research to merged pull requests.",
    points: [
      "Redesigned the lead-gen assessment, then built and shipped it in the production codebase.",
      "Rebuilt the marketing site's feature pages into product-accurate stories with interactive charts, and restructured the nav.",
      "Set up an AI video and comic pipeline (script, storyboard, Remotion) behind the launch film and a comic series with a 30,000+ view reel.",
    ],
    tag: "shipped",
    color: "var(--pastel-lilac)",
    icon: ICONS.spark,
    logo: { src: "/logos/fi.webp", alt: "Fi Money logo" },
    line: "AI products, shipped",
  },
  {
    key: "afb",
    dates: "JAN TO JUN 2026",
    rail: "2026",
    role: "Design Intern · AppsForBharat",
    detail: "Brand and content design for a devotional tech company.",
    points: [
      "Designed the company blog and its themed thumbnail system, now live.",
      "Made print and merch: buddy tee, appreciation cards, Women's Day checklist, keychain.",
      "Produced AI videos for employer-brand campaigns.",
    ],
    tag: "shipped",
    color: "var(--pastel-peach)",
    icon: ICONS.page,
    logo: { src: "/logos/appsforbharat.svg", alt: "AppsForBharat logo", pad: true },
    line: "blogs and merch",
  },
  {
    key: "pocketfm",
    dates: "AUG TO DEC 2025",
    rail: "2025",
    role: "Post-production Digital Artist · Pocket FM",
    detail: "Turned scripts into finished comic pages for Pocket Toons.",
    points: [
      "Generated, retouched and lettered comic panels.",
      "Laid out pages, posters and series openings.",
      "Retouched client art to match each series' style.",
    ],
    tag: "client",
    color: "var(--pastel-butter)",
    icon: ICONS.bubble,
    logo: { src: "/logos/pocketfm.svg", alt: "Pocket FM logo" },
    line: "comic panels!",
  },
  {
    key: "cafe",
    dates: "AUG 2023 TO MAY 2025",
    rail: "2023",
    role: "Graphic Designer (Freelance) · Maggilicious Cafe and others",
    detail: "Brand identity for small food and lifestyle businesses.",
    points: [
      "Designed Maggilicious Cafe's logo, menus and posters.",
      "Ran social creatives and built the cafe's website in Canva.",
      "Drew a commissioned character artwork for the cafe.",
    ],
    tag: "client",
    color: "var(--pastel-sky)",
    icon: ICONS.cup,
    line: "menus and logos",
  },
  {
    key: "jeneko",
    dates: "FEB 2021 TO MAR 2025",
    rail: "2021",
    role: "Freelance Digital Artist · Jeneko",
    detail: "Semi-realistic character art, drawing since 2020.",
    points: [
      "Took commissions on Fiverr, Discord and Pixiv Fanbox.",
      "Drew character portraits, original-character reworks and fan art.",
      "Built my own art portfolio site.",
    ],
    tag: "client",
    color: "var(--pastel-pink)",
    icon: ICONS.pencil,
    logo: { src: "/logos/jeneko.webp", alt: "Jeneko logo: a line-art girl with horns", mask: true },
    line: "where it all started",
  },
];

/** Lines the guide cat reads, by chapter. CatLayer picks them up from data-cat-line. */
export const EXPERIENCE_LINES = chapters.map((c) => c.line);

function PixelIcon({ rows, className = "" }: { rows: string[]; className?: string }) {
  const w = Math.max(...rows.map((r) => r.length));
  return (
    <svg aria-hidden="true" viewBox={`0 0 ${w} ${rows.length}`} shapeRendering="crispEdges" className={className}>
      {rows.flatMap((r, y) =>
        [...r].map((c, x) => (c === "#" ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" /> : null)),
      )}
    </svg>
  );
}

/** "What I did" points with a small pixel square as the bullet. */
function Points({ items, size }: { items: string[]; size: "m" | "s" }) {
  return (
    <ul className={`flex flex-col ${size === "m" ? "gap-2" : "gap-1.5"}`}>
      {items.map((t) => (
        <li key={t} className={`flex items-start gap-3 text-primary ${size === "m" ? "type-body-m" : "type-body-s"}`}>
          <span aria-hidden="true" className={`mt-[0.55em] size-2 shrink-0 bg-ink`} />
          <span>{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Education({ items }: { items: [string, string, string][] }) {
  return (
    <section aria-label="Education" className="flex w-full flex-col gap-3 border-t-2 border-line pt-4">
      <h4 className="type-label-s text-ink">EDUCATION</h4>
      <ul className="flex flex-col gap-2">
        {items.map(([degree, school, years]) => (
          <li key={degree + school} className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
            <span className="type-body-m font-semibold text-primary">{degree}</span>
            <span className="type-body-m text-muted">{school}</span>
            <span className="type-label-s text-muted">{years}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

function Visual({ c, size }: { c: Chapter; size: "l" | "s" }) {
  const box = size === "l" ? "size-[min(300px,34vh)]" : "size-24";
  return (
    <div
      className={`${box} flex shrink-0 items-center justify-center overflow-hidden border-2 border-line text-on-pastel shadow-pixel-8`}
      style={{ background: c.color, "--pixel-shadow": "var(--line)" } as CSSProperties}
    >
      {c.logo ? <Logo logo={c.logo} /> : c.icon ? <PixelIcon rows={c.icon} className="w-[58%]" /> : <Img name="portrait" width={360} alt="Portrait of Sejal Borkar" />}
    </div>
  );
}

function Logo({ logo }: { logo: NonNullable<Chapter["logo"]> }) {
  if (logo.mask)
    return (
      <span
        role="img"
        aria-label={logo.alt}
        className="aspect-square w-[78%] bg-current"
        style={{ mask: `url(${logo.src}) center / contain no-repeat`, WebkitMask: `url(${logo.src}) center / contain no-repeat` }}
      />
    );
  return (
    <span className={`aspect-square w-[58%] overflow-hidden border-2 border-line bg-white ${logo.pad ? "p-[14%]" : ""}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={logo.src} alt={logo.alt} width={192} height={192} loading="lazy" decoding="async" className="block size-full object-contain" />
    </span>
  );
}

/** Experience as a zoom scroll story. On wide, tall screens the section pins and each scroll step zooms the
    current chapter out past the camera while the next one zooms in from the distance. Concentric frames behind
    it zoom with the scroll. The cat sits on one ledge as the guide and reacts per chapter (CatLayer reads
    data-exp-step). Phones, short screens and reduced motion get a plain list.
    Pin and progress pattern from scroll-craft (MIT, github.com/nateherkai/scroll-craft), rebuilt in React with no dependencies. */
export function Experience() {
  const outer = useRef<HTMLElement>(null);
  const items = useRef<(HTMLDivElement | null)[]>([]);
  const frames = useRef<(HTMLDivElement | null)[]>([]);
  const [story, setStory] = useState(false);
  // Pixel height fixed when the story mounts, so a changing viewport height never resizes the page under the reader.
  const [storyHeight, setStoryHeight] = useState<number | undefined>(undefined);
  useEffect(() => {
    if (story) setStoryHeight(Math.round(innerHeight * (chapters.length * 0.85 + 0.6)));
  }, [story]);
  const [step, setStep] = useState(0);

  useEffect(() => {
    // Decided on load and again only when the width crosses the breakpoint. Height changes (browser toolbars
    // showing and hiding near the bottom of the page, zoom) must never switch modes: the pinned story is thousands
    // of pixels taller, so switching mid-scroll used to throw the reader back up to the art room.
    const wide = matchMedia("(min-width: 1024px)");
    const update = () =>
      setStory(wide.matches && innerHeight >= 640 && !matchMedia("(prefers-reduced-motion: reduce)").matches);
    update();
    wide.addEventListener("change", update);
    return () => wide.removeEventListener("change", update);
  }, []);

  useEffect(() => {
    const el = outer.current;
    if (!story || !el) return;
    const n = chapters.length;
    let last = -1;
    const render = () => {
      const r = el.getBoundingClientRect();
      const total = Math.max(1, el.offsetHeight - innerHeight);
      const raw = Math.min(1, Math.max(0, -r.top / total)) * (n - 1);
      // Hold on each chapter, then zoom through to the next one.
      const seg = Math.min(n - 2, Math.floor(raw));
      const f = Math.min(1, Math.max(0, (raw - seg - 0.3) / 0.4));
      const pos = seg + f * f * (3 - 2 * f);
      items.current.forEach((node, i) => {
        if (!node) return;
        const d = i - pos;
        const t = Math.min(1, Math.abs(d));
        const scale = d >= 0 ? 1 - 0.65 * t : 1 + 1.8 * t;
        const opacity = Math.max(0, 1 - t * (d >= 0 ? 1.25 : 1.7));
        node.style.transform = `scale(${scale.toFixed(4)})`;
        node.style.opacity = opacity.toFixed(3);
        node.style.visibility = opacity < 0.01 ? "hidden" : "visible";
      });
      frames.current.forEach((node, k) => {
        if (!node) return;
        const v = (k + pos * 1.5) % frames.current.length;
        node.style.transform = `translate(-50%, -50%) scale(${(0.18 * Math.pow(1.5, v)).toFixed(4)})`;
        node.style.opacity = (Math.min(1, v / 1.5) * Math.max(0, 1 - v / frames.current.length)).toFixed(3);
      });
      const now = Math.round(pos);
      if (now !== last) {
        last = now;
        setStep(now);
        el.dataset.expStep = String(now);
        el.dataset.expLine = chapters[now].line;
        window.dispatchEvent(new CustomEvent("exprole", { detail: { step: now, line: chapters[now].line } }));
      }
    };
    render();
    window.addEventListener("scroll", render, { passive: true });
    window.addEventListener("resize", render);
    return () => {
      window.removeEventListener("scroll", render);
      window.removeEventListener("resize", render);
      delete el.dataset.expStep;
      delete el.dataset.expLine;
    };
  }, [story]);

  const goTo = (i: number) => {
    const el = outer.current;
    if (!el) return;
    const total = el.offsetHeight - innerHeight;
    window.scrollTo({ top: el.getBoundingClientRect().top + scrollY + (i / (chapters.length - 1)) * total + 2 });
  };

  if (!story)
    return (
      <section ref={outer} id="experience" aria-labelledby="experience-title" className="border-t-2 border-line">
        <div className={`${gutter} flex flex-col gap-10 pt-16 pb-20`}>
          <SectionTitle kicker="02 · EXPERIENCE" title="Where I have worked" id="experience-title" />
          <ol className="flex flex-col gap-10">
            {chapters.map((c) => (
              <li key={c.key} data-reveal className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-8">
                {/* The cat sits beside the role nearest the middle of the screen (CatLayer). */}
                <div data-cat-perch="exp-role" data-cat-line={c.line} data-bubble-keep-clear="" className="self-start">
                  <Visual c={c} size="s" />
                </div>
                <div data-bubble-keep-clear="" className="flex min-w-0 flex-1 flex-col items-start gap-2">
                  <p className="type-label-s text-muted">{c.dates}</p>
                  <h3 className="type-heading-s text-primary">{c.role}</h3>
                  <p className="type-body-m text-muted">{c.detail}</p>
                  {c.points && <Points items={c.points} size="m" />}
                  {c.tag && <Tag kind={c.tag} />}
                  {c.education && <Education items={c.education} />}
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
    );

  return (
    <section
      ref={outer}
      id="experience"
      aria-labelledby="experience-title"
      data-exp-story=""
      className="border-t-2 border-line"
      style={{ height: storyHeight ?? `calc(100vh * ${chapters.length * 0.85 + 0.6})` }}
    >
      <div className="sticky top-[72px] h-[calc(100vh-72px)] overflow-hidden">
        {/* Concentric frames that zoom with the scroll: this section's own treatment. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          {Array.from({ length: 7 }, (_, k) => (
            <div
              key={k}
              ref={(n) => {
                frames.current[k] = n;
              }}
              className="absolute top-1/2 left-1/2 aspect-[16/10] w-[90vw] border-2 border-line"
            />
          ))}
        </div>
        <div className={`${gutter} relative flex h-full flex-col pt-8 pb-6`}>
          <div className="flex items-end gap-6">
            <SectionTitle kicker="02 · EXPERIENCE" title="Where I have worked" id="experience-title" />
            <span className="min-w-px flex-1" />
            <p className="type-label-s text-muted" aria-hidden="true">
              {String(step + 1).padStart(2, "0")} / {String(chapters.length).padStart(2, "0")} · SCROLL
            </p>
          </div>
          <ol className="relative min-h-0 flex-1 overflow-hidden">
            {chapters.map((c, i) => (
              <li
                key={c.key}
                ref={(n) => {
                  items.current[i] = n as HTMLDivElement | null;
                }}
                aria-current={i === step ? "step" : undefined}
                className="absolute inset-0 flex origin-center items-center justify-center gap-[clamp(32px,5vw,80px)] will-change-transform"
                style={{ opacity: i === 0 ? 1 : 0 }}
              >
                <Visual c={c} size="l" />
                <div data-bubble-keep-clear="" className="flex max-w-[620px] min-w-0 flex-col items-start gap-4">
                  <p className="type-label-s text-ink">
                    {String(i + 1).padStart(2, "0")} · {c.dates}
                  </p>
                  <h3 className="type-display-m text-primary">{c.role}</h3>
                  <p className="type-body-l text-muted">{c.detail}</p>
                  {c.points && <Points items={c.points} size="m" />}
                  {c.tag && <Tag kind={c.tag} />}
                  {c.education && <Education items={c.education} />}
                </div>
              </li>
            ))}
          </ol>
          <div className="flex items-end gap-6">
            {/* The guide cat sits on this ledge for the whole story. */}
            <div data-cat-perch="exp-guide" className="h-2 w-[200px] shrink-0 bg-line" />
            <nav aria-label="Experience chapters" className="flex flex-1 items-end gap-2">
              {chapters.map((c, i) => (
                <button
                  key={c.key}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Chapter ${i + 1}: ${c.role}`}
                  aria-current={i === step ? "step" : undefined}
                  className="group flex flex-1 flex-col items-start gap-2"
                >
                  <span className={`type-label-s ${i === step ? "text-ink" : "text-muted group-hover:text-primary"}`}>{c.rail}</span>
                  <span className={`h-2 w-full ${i <= step ? "bg-ink" : "bg-line"}`} />
                </button>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </section>
  );
}
