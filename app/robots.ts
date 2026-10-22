import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo";

// Open to every search engine, except the private /analytics page (which also carries its own noindex).
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: "/analytics" }],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
