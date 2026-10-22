import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Open to every search engine. The private stats page is not listed here on purpose (listing it would reveal its
// address); it carries its own noindex instead.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
