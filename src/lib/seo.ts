import type { Metadata } from "next";
import { site } from "./site";

function configuredSiteUrl(): string | undefined {
  const value = process.env.NEXT_PUBLIC_SITE_URL;
  if (!value) return undefined;
  try {
    const url = new URL(value);
    return url.protocol === "https:" || (url.protocol === "http:" && ["localhost", "127.0.0.1"].includes(url.hostname)) ? url.origin : undefined;
  } catch { return undefined; }
}

export const publicSiteUrl = configuredSiteUrl();

export function pageMetadata(title: string, description: string, path: string, image = "/brand/social-share.jpg"): Metadata {
  return {
    title,
    description,
    ...(publicSiteUrl ? { alternates: { canonical: new URL(path, publicSiteUrl) } } : {}),
    openGraph: {
      title: `${title} — ${site.name}`,
      description,
      type: "website",
      siteName: site.name,
      locale: "en_US",
      ...(publicSiteUrl ? { url: new URL(path, publicSiteUrl), images: [{ url: new URL(image, publicSiteUrl), alt: `${site.name} — ${title}` }] } : {}),
    },
    twitter: { card: "summary_large_image", title: `${title} — ${site.name}`, description, ...(publicSiteUrl ? { images: [new URL(image, publicSiteUrl).toString()] } : {}) },
  };
}
