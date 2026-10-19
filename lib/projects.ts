import type { TagKind } from "@/components/ui";

export type Project = {
  number: number;
  /** Short name used in the jump-in panel. */
  name: string;
  /** Tile headline. */
  title: string;
  tag: TagKind;
  meta: string;
  summary: string;
  /** Route of the case study, or null when there is no inner page yet. */
  href: string | null;
  /** Live site or source files, opened in a new tab. Only real URLs from the inventory. */
  links?: { label: string; href: string }[];
  /** Listed under "More work" instead of the main grid. */
  more?: boolean;
};

// Copy from Figma "Home · Desktop (Dark)" 27:386; order and links from Sejal (18 Oct).
export const projects: Project[] = [
  {
    number: 1,
    name: "Marketing site and component library",
    title: "Marketing site and a 20-component library",
    tag: "shipped",
    meta: "EPIFI · TETRIZ · 2026",
    summary:
      "Five feature pages in production Next.js, composed from one shared kit. The feature nav went from a pillar taxonomy to a flat five.",
    href: "/work/marketing-site",
    links: [{ label: "TETRIZ.AI", href: "https://tetriz.ai/features/ai-adoption/" }],
  },
  {
    number: 2,
    name: "Sourced",
    title: "Sourced: human-made and AI art, side by side",
    tag: "personal",
    meta: "MOBILE APP · 2025 TO 2026",
    summary:
      "An app that verifies human artists and pairs them as Art Buddies. Shaped by a survey of 25+ artists.",
    href: "/work/sourced",
    links: [{ label: "BEHANCE", href: "https://www.behance.net/gallery/257216237/Sourced-Artist-Accountability-Verification-Platform" }],
  },
  {
    number: 3,
    name: "#futureofhr webinar page",
    title: "#futureofhr: a webinar page built like a video call",
    tag: "take-home",
    meta: "LANDING PAGE · VIDEO · POSTER · 2026",
    summary: "Landing page, launch video and LinkedIn poster, designed in 72 hours.",
    href: "/work/futureofhr",
  },
  {
    number: 4,
    name: "AppsForBharat blog",
    title: "Company blog and a themed thumbnail system",
    tag: "shipped",
    meta: "APPSFORBHARAT · 2026",
    summary:
      "Home, article and category pages, live at blog.appsforbharat.com. One visual identity per category.",
    href: "/work/afb-blog",
    links: [{ label: "THE LIVE BLOG", href: "https://blog.appsforbharat.com/" }],
  },
  {
    number: 5,
    name: "Video production system",
    title: "Video production system",
    tag: "shipped",
    meta: "EPIFI · 2026",
    summary:
      "Script to final render, with reusable skill files in the repo and review gates. Storyboards went from 4 days to 1.",
    href: "/work/video-system",
  },
  {
    number: 6,
    name: "Lead-gen assessment",
    title: "Lead-gen assessment, redesigned and shipped",
    tag: "shipped",
    meta: "EPIFI · TETRIZ · 2026",
    summary:
      "I rebuilt the result around the answers people gave, then added the email step the funnel was missing.",
    href: "/work/lead-gen-assessment",
    more: true,
  },
];

export const liveProjects = projects.filter((p) => p.href !== null);

export function projectByNumber(n: number) {
  return projects.find((p) => p.number === n);
}

/** The next live case study after this one, wrapping around. */
export function nextLiveProject(n: number) {
  const later = liveProjects.find((p) => p.number > n);
  return later ?? liveProjects[0];
}

export const links = {
  email: "sejalborkar2002@gmail.com",
  resume: "/Sejal_Borkar_Resume.pdf",
};

export const socials = [
  { label: "LINKEDIN", href: "https://www.linkedin.com/in/sejalborkar/" },
  { label: "BEHANCE", href: "https://www.behance.net/sejalborkar04" },
  { label: "GITHUB", href: "https://github.com/SBorkar2002" },
  { label: "ARTSTATION", href: "https://www.artstation.com/jen_chan" },
  { label: "INSTAGRAM", href: "https://www.instagram.com/_jeneko" },
  { label: "WEBTOON", href: "https://www.webtoons.com/p/community/en/u/ha8lk" },
];
