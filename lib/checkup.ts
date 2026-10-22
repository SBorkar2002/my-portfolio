// Snapshot of the 22 Oct 2026 code-doctor checkup, shown on /analytics. Measured that day: Lighthouse 12.2.1 on a
// phone profile, a Playwright crawl with axe-core 4.10.2, the studio phone sweep, a Playwright loader timer, contrast
// computed from the colour tokens in app/globals.css, and file sizes from public/. "Old" is the site that was live
// before the 22 Oct launch; "new" is the revamp that went live that evening.

export const CHECKUP_DATE = "22 Oct 2026";

export type Site = "old" | "new";

export const LIGHTHOUSE: { site: Site; page: string; perf: number; a11y: number; bp: number; seo: number; lcp: number; fcp: number; tbt: number; cls: number; kb: number }[] = [
  { site: "old", page: "/", perf: 93, a11y: 96, bp: 100, seo: 100, lcp: 2.75, fcp: 0.98, tbt: 172, cls: 0, kb: 733 },
  { site: "old", page: "/work/sourced", perf: 100, a11y: 100, bp: 100, seo: 100, lcp: 1.59, fcp: 0.95, tbt: 7, cls: 0, kb: 734 },
  { site: "old", page: "/work/video-system", perf: 98, a11y: 100, bp: 100, seo: 100, lcp: 2.43, fcp: 0.93, tbt: 20, cls: 0, kb: 860 },
  { site: "new", page: "/", perf: 92, a11y: 100, bp: 96, seo: 100, lcp: 3.3, fcp: 0.9, tbt: 10, cls: 0, kb: 756 },
  { site: "new", page: "/work/sourced", perf: 97, a11y: 100, bp: 96, seo: 100, lcp: 2.56, fcp: 0.9, tbt: 10, cls: 0, kb: 730 },
  { site: "new", page: "/work/video-system", perf: 92, a11y: 100, bp: 96, seo: 100, lcp: 3.31, fcp: 0.75, tbt: 10, cls: 0, kb: 854 },
  { site: "new", page: "/art/comics", perf: 99, a11y: 100, bp: 96, seo: 100, lcp: 2.26, fcp: 0.75, tbt: 8, cls: 0, kb: 1427 },
  { site: "new", page: "/art/motion", perf: 87, a11y: 100, bp: 96, seo: 100, lcp: 4.05, fcp: 0.75, tbt: 9, cls: 0, kb: 576 },
];

/** Loading screen: [run, shown at, exit starts, gone] in ms from navigation. RM = reduced motion. */
export const LOADER: [string, number, number, number][] = [
  ["1440 · home", 162, 1509, 1741],
  ["1440 · motion", 78, 1514, 1744],
  ["390 · home", 73, 1511, 1739],
  ["390 · motion", 47, 1518, 1733],
  ["1440 · home · RM", 73, 275, 494],
  ["1440 · motion · RM", 48, 230, 451],
  ["390 · home · RM", 101, 249, 477],
  ["390 · motion · RM", 44, 196, 415],
];

export const CONTRAST: [string, number][] = [
  ["Light · primary on page", 16.13],
  ["Light · muted on page", 8.51],
  ["Light · ink on page", 5.62],
  ["Light · ink on sunken", 4.99],
  ["Dark · primary on page", 16.2],
  ["Dark · muted on raised", 8.64],
  ["Dark · ink on raised", 9.15],
  ["Ink on lilac chip", 9.84],
  ["Ink on lime button", 15.17],
];

export const MEDIA: [string, number][] = [
  ["EP 05", 4608080],
  ["EP 04", 3015019],
  ["Prompt eng.", 3001390],
  ["EP 01", 2515636],
  ["EP 02", 2505347],
  ["EP 03", 1846848],
  ["#futureofhr", 756775],
  ["Film · harness", 630745],
  ["Film · question", 340600],
  ["Film · smarter", 274244],
];

export const CRAWL = { routes: 10, loads: 80, jsErrors: 0, brokenImages: 0, overflow: 0, axeViolations: 0 };
export const LINKS = { ok: 33, botBlocked: 2, notOpened: 1 };
export const SWEEP = { old: { runs: 72, findings: 5 }, new: { runs: 72, findings: 1 } };

export type Finding = { level: "p0" | "p1" | "p2" | "note" | "done"; title: string; body: string };

export const FINDINGS: Finding[] = [
  { level: "p0", title: "The resume PDF still shows the Epifi role title that is not announced yet.", body: "It is linked from the nav and the footer. It needs a new export from your source file, saved as public/Sejal_Borkar_Resume.pdf." },
  { level: "p2", title: "The biggest content waits for the intro.", body: "Motion 4.0 s, home 3.3 s on a local build. The loading screen and the page rise are a design choice, so they stay. The 1.5 s loader already moves every page about 0.5 s earlier." },
  { level: "p2", title: "Home work tiles send 1168 px images to mid-size phones.", body: "About 120 KB could be saved with an 876 px size in between. On a 3x iPhone the 1168 px file is the right one." },
  { level: "p2", title: "The cat falls over one art card on phones.", body: "Up to 28% of one thumbnail while it passes: 1 time in 72 phone runs on the new site, 3 on the old one." },
  { level: "note", title: "Old home accessibility 96 was a timing artifact.", body: "The nav's JUMP TO label was sampled while it faded in. Settled, it is 7.56:1. The new site scores 100." },
  { level: "done", title: "The new site went live on 22 Oct.", body: "Art pages, company logos, the 1.5 s loader, per-page share images, sitemap and robots are all on production." },
];
