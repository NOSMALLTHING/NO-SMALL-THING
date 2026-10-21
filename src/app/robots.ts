import type { MetadataRoute } from "next";
import { publicSiteUrl } from "@/lib/seo";

export const dynamic = "force-static";
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/design-system" },
    ...(publicSiteUrl ? { sitemap: `${publicSiteUrl}/sitemap.xml` } : {}),
  };
}
