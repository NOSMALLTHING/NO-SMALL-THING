import type { Metadata } from "next";
import Image from "next/image";
import { Container, Grid } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { TextLink } from "@/components/ui/text-link";
import { BrandLogo } from "@/components/brand-logo";
import horizon from "../../../public/brand/mars-horizon.png";

export const metadata: Metadata = { title: "Design foundation", robots: { index: false, follow: false } };

const colors = [
  { name: "Black", hex: "#080809", ink: "#F0ECE7" },
  { name: "Charcoal", hex: "#171719", ink: "#F0ECE7" },
  { name: "Warm White", hex: "#F0ECE7", ink: "#080809" },
  { name: "Mars Orange", hex: "#C87450", ink: "#080809" },
];

export default function DesignSystem() {
  return <Container className="design-system">
    <SectionLabel index="V.01">NO SMALL THING / DESIGN FOUNDATION</SectionLabel>
    <div className="ds-intro"><h1 className="type-heading">A considered system.<br /><span className="muted-text">Room for ambition.</span></h1><p>The shared visual language for NO SMALL THING. Cinematic imagery, editorial typography and purposeful restraint.</p></div>
    <section className="ds-section" aria-labelledby="palette-title"><SectionLabel index="01"><span id="palette-title">COLOR</span></SectionLabel><div className="ds-palette">{colors.map(color => <div key={color.name} className="ds-swatch" style={{ background: color.hex, color: color.ink }}><span>{color.name}</span><span className="eyebrow">{color.hex}</span></div>)}</div><p className="ds-note">Black sets the atmosphere. Warm White brings clarity. Charcoal adds depth. Mars Orange marks a moment, an action, a point of focus.</p></section>
    <section className="ds-section" aria-labelledby="type-title"><SectionLabel index="02"><span id="type-title">TYPOGRAPHY</span></SectionLabel>
      <div className="ds-type-row"><span className="eyebrow">DISPLAY / FLUID</span><p className="type-display">Beyond<br />boundaries.</p></div>
      <div className="ds-type-row"><span className="eyebrow">HEADING / FLUID</span><p className="type-heading">Three minds.<br />One ambition.</p></div>
      <div className="ds-type-row"><span className="eyebrow">BODY / 16—18 PX</span><p>AI, design and technology. Built with purpose. Made to matter.</p></div>
      <div className="ds-type-row"><span className="eyebrow">LABEL / 10 PX</span><p className="eyebrow">TRANSCEND EVERYTHING / NO SMALL THING</p></div>
    </section>
    <section className="ds-section" aria-labelledby="grid-title"><SectionLabel index="03"><span id="grid-title">RESPONSIVE GRID</span></SectionLabel><Grid className="ds-grid">{Array.from({ length: 12 }, (_, i) => <div className="eyebrow" key={i}>{String(i + 1).padStart(2, "0")}</div>)}</Grid><p className="ds-note">12 columns on desktop · 8 on tablet · 4 on mobile. Fluid outer margins, a 1600px content maximum and a shared spacing rhythm.</p></section>
    <section className="ds-section" aria-labelledby="space-title"><SectionLabel index="04"><span id="space-title">SPACING / 4 PX BASE</span></SectionLabel><div className="ds-spaces">{[4, 8, 12, 16, 24, 32, 48, 64, 96, 128].map(size => <div className="ds-space" key={size}><div style={{ width: size }} /><span className="eyebrow">{size}</span></div>)}</div></section>
    <section className="ds-section" aria-labelledby="components-title"><SectionLabel index="05"><span id="components-title">SHARED COMPONENTS</span></SectionLabel><div className="ds-components"><TextLink href="/studio">Meet the studio</TextLink><TextLink href="/expertise" direction="right">Our expertise</TextLink><SectionLabel index="01">A NEW PERSPECTIVE</SectionLabel></div><p className="ds-note">Links, section labels, containers, grids, original brand artwork, the shared masthead, modal navigation and subtle reveal motion. Keyboard accessible. Reduced motion aware.</p></section>
    <section className="ds-section" aria-labelledby="assets-title"><SectionLabel index="06"><span id="assets-title">ORIGINAL BRAND ARTWORK</span></SectionLabel><div className="ds-assets"><BrandLogo className="ds-logo" sizes="320px" /><Image src={horizon} alt="Original Transcend Everything — Mars Horizon brand banner" sizes="(max-width: 767px) 100vw, 66vw" /></div><p className="ds-note">The original artwork is preserved in full, without redrawing, stretching, recoloring or cropping. The Mars Horizon banner is also the homepage Hero visual.</p></section>
    <TextLink href="/">View the homepage</TextLink>
  </Container>;
}
