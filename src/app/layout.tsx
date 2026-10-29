import type { Metadata, Viewport } from "next";
import { TelemetryPreloader } from "@/components/telemetry-preloader";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { SmoothScroll } from "@/components/smooth-scroll";
import { site } from "@/lib/site";
import { contactDetails } from "@/lib/contact";
import { pageMetadata, publicSiteUrl } from "@/lib/seo";
import "./globals.css";

export const metadata: Metadata = {
  ...pageMetadata("Transcend Everything", site.description, "/"),
  title: { default: "NO SMALL THING — Transcend Everything", template: "%s — NO SMALL THING" },
  description: site.description,
  icons: { icon: "/brand/monogram-icon.png" },
  ...(publicSiteUrl ? { metadataBase: new URL(publicSiteUrl) } : {}),
  robots: { index: true, follow: true },
  applicationName: site.name,
};

export const viewport: Viewport = { themeColor: "#080809", colorScheme: "dark light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const organization = { "@context": "https://schema.org", "@type": "Organization", name: site.name, slogan: site.tagline, email: contactDetails.email, sameAs: contactDetails.socials.map(social => social.href), ...(publicSiteUrl ? { url: publicSiteUrl, logo: `${publicSiteUrl}/brand/monogram-768.webp` } : {}) };
  return <html lang="en" data-scroll-behavior="smooth"><head>
    <link rel="preload" href="/fonts/manrope-regular.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
    <link rel="preload" href="/fonts/cormorant-garamond-italic.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
  </head><body id="top">
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organization).replace(/</g, "\\u003c") }} />
    <a href="#main-content" className="skip-link">Skip to content</a>
    <TelemetryPreloader />
    <SmoothScroll />
    <SiteHeader />
    <main id="main-content" tabIndex={-1}>{children}</main>
    <SiteFooter />
  </body></html>;
}
