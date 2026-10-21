import type { MetadataRoute } from "next";
import { publicSiteUrl } from "@/lib/seo";
import { projects } from "@/lib/projects";

export const dynamic = "force-static";
export default function sitemap(): MetadataRoute.Sitemap {
  // No invented production hostname. Configure the real domain before publishing.
  if (!publicSiteUrl) return [];
  return ["/", "/work", "/expertise", "/studio", "/contact", ...projects.map(project => `/work/${project.slug}`)].map(path => ({ url: new URL(path, publicSiteUrl).toString() }));
}
