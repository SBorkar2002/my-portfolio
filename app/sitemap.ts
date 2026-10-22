import type { MetadataRoute } from "next";
import { PAGES, SITE_URL } from "@/lib/seo";

// Every public page. The private stats page is deliberately left out.
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    { url: SITE_URL, lastModified: now, changeFrequency: "monthly", priority: 1 },
    ...Object.keys(PAGES).map((path) => ({
      url: `${SITE_URL}${path}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: path.startsWith("/work/") ? 0.8 : 0.6,
    })),
  ];
}
