import type { MetadataRoute } from "next";
import { abs } from "@/lib/seo";

// Everything public is open to search and AI crawlers; only account, admin and API
// paths are kept out. Those pages also carry noindex.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/api/",
        "/auth/",
        "/partners/dashboard",
        "/partners/review",
        "/partners/apply",
        "/community/moderation",
        "/community/notifications",
      ],
    },
    sitemap: abs("/sitemap.xml"),
  };
}
