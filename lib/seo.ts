import type { Metadata } from "next";
import { projects, socials } from "./projects";

export const SITE_URL = "https://sejalborkar.vercel.app";
export const SITE_NAME = "Sejal Borkar";
const PERSON_ID = `${SITE_URL}/#person`;

type Page = {
  /** <title> before " · Sejal Borkar". */
  title: string;
  description: string;
  /** Kicker and headline for the share image. */
  card: { kicker: string; title: string };
  /** Case study number in lib/projects, for the structured data. */
  project?: number;
};

// One source for every indexable page: its title, description and share card. Keep descriptions under ~160 characters.
export const PAGES: Record<string, Page> = {
  "/work/marketing-site": {
    title: "Marketing site and a 20-component library",
    description: "Product design case study: five Tetriz feature pages built in production Next.js from one shared kit, and a feature nav cut from pillars to a flat five.",
    card: { kicker: "CASE STUDY · SHIPPED · 2026", title: "Marketing site and a 20-component library" },
    project: 1,
  },
  "/work/sourced": {
    title: "Sourced: an app that verifies human artists",
    description: "Product design case study: Sourced, an app that verifies human artists and pairs them as Art Buddies. Shaped by a survey of 25+ artists.",
    card: { kicker: "CASE STUDY · PERSONAL · 2025 TO 2026", title: "Sourced: human-made and AI art, side by side" },
    project: 2,
  },
  "/work/futureofhr": {
    title: "#futureofhr: a webinar page built like a video call",
    description: "Product design case study: a webinar landing page designed as a video call, with a launch video and a LinkedIn poster. A take-home brief.",
    card: { kicker: "CASE STUDY · TAKE-HOME · 2026", title: "#futureofhr: a webinar page built like a video call" },
    project: 3,
  },
  "/work/afb-blog": {
    title: "AppsForBharat company blog",
    description: "Product design case study: the AppsForBharat company blog and its themed thumbnail system, live at blog.appsforbharat.com.",
    card: { kicker: "CASE STUDY · SHIPPED · 2026", title: "Company blog and a themed thumbnail system" },
    project: 4,
  },
  "/work/video-system": {
    title: "Video production system",
    description: "Case study: how a B2B SaaS launch film was made, from script spine to storyboard, Remotion build, voiceover, captions and review gates.",
    card: { kicker: "CASE STUDY · SHIPPED · 2026", title: "Video production system for a launch film" },
    project: 5,
  },
  "/work/lead-gen-assessment": {
    title: "Lead-gen assessment, redesigned and shipped",
    description: "Product design case study: a lead-gen assessment for Tetriz, redesigned around the answers people gave and shipped to production.",
    card: { kicker: "CASE STUDY · SHIPPED · 2026", title: "Lead-gen assessment, redesigned and shipped" },
    project: 6,
  },
  "/art/comics": {
    title: "Comics",
    description: "Comics by Sejal Borkar: action scenes from her webtoon, client comic pages for Pocket Toons and a one-shot cricket comic.",
    card: { kicker: "ART ROOM · COMICS", title: "Webtoon action, client pages and a cricket one-shot" },
  },
  "/art/motion": {
    title: "Motion",
    description: "Motion work by Sejal Borkar: a comic video series, a webinar launch video and excerpts from a launch film, with sound.",
    card: { kicker: "ART ROOM · MOTION", title: "Comic videos, a launch video and a film" },
  },
};

/** Title, description, canonical URL, hreflang and share tags for one page. The share image comes from the
    route's opengraph-image file. */
export function pageMetadata(path: keyof typeof PAGES): Metadata {
  const p = PAGES[path];
  const full = `${p.title} · ${SITE_NAME}`;
  return {
    title: p.title,
    description: p.description,
    alternates: { canonical: path, languages: { en: path, "x-default": path } },
    openGraph: { title: full, description: p.description, url: path, siteName: SITE_NAME, locale: "en_US", type: "article" },
    twitter: { card: "summary_large_image", title: full, description: p.description },
  };
}

const sameAs = socials.filter((s) => ["LINKEDIN", "BEHANCE", "ARTSTATION", "GITHUB", "INSTAGRAM", "WEBTOON"].includes(s.label)).map((s) => s.href);

/** Who the site is about, for search engines (home page). */
export function personJsonLd() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Person",
        "@id": PERSON_ID,
        name: "Sejal Borkar",
        url: SITE_URL,
        image: `${SITE_URL}/images/portrait-720.webp`,
        jobTitle: "Product designer",
        description: "Product designer who ships. B2B SaaS, from research to merged pull requests. Illustrator and comic artist, drawing since 2020.",
        address: { "@type": "PostalAddress", addressLocality: "Bengaluru", addressCountry: "IN" },
        alumniOf: { "@type": "CollegeOrUniversity", name: "Ramaiah Institute of Technology" },
        knowsAbout: ["Product design", "UX design", "Design systems", "Prototyping", "Illustration", "Comics", "Motion design"],
        sameAs,
      },
      {
        "@type": "WebSite",
        "@id": `${SITE_URL}/#website`,
        url: SITE_URL,
        name: SITE_NAME,
        inLanguage: "en",
        author: { "@id": PERSON_ID },
      },
    ],
  };
}

/** One case study or art page as a CreativeWork by the person above. */
export function workJsonLd(path: keyof typeof PAGES) {
  const p = PAGES[path];
  const project = p.project ? projects.find((x) => x.number === p.project) : undefined;
  const year = project?.meta.match(/\b(20\d\d)\b/)?.[1];
  return {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: p.title,
    headline: p.card.title,
    description: p.description,
    url: `${SITE_URL}${path}`,
    image: `${SITE_URL}${path}/opengraph-image`,
    inLanguage: "en",
    genre: project ? "Product design case study" : "Art portfolio",
    ...(year ? { dateCreated: year } : {}),
    author: { "@type": "Person", "@id": PERSON_ID, name: "Sejal Borkar", url: SITE_URL },
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };
}
