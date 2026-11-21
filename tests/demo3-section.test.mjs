import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const pageFile = path.resolve("src/app/page.tsx");
const componentFile = path.resolve("src/components/demo3-section.tsx");
const cssModuleFile = path.resolve("src/components/demo3-section.module.css");
const publicFontsDir = path.resolve("public/demo3/fonts");

test("Demo3Section placement in src/app/page.tsx", () => {
  const pageContent = fs.readFileSync(pageFile, "utf-8").replace(/\r\n/g, "\n");

  assert.ok(
    pageContent.includes('import { Demo3Section } from "@/components/demo3-section";'),
    "Should import Demo3Section in page.tsx"
  );

  const butterIndex = pageContent.indexOf("<ButterServices />");
  const demo3Index = pageContent.indexOf("<Demo3Section />");
  const servicesCardDeckIndex = pageContent.indexOf("<ServicesCardDeck />");

  assert.ok(butterIndex !== -1, "<ButterServices /> must exist in page.tsx");
  assert.ok(demo3Index !== -1, "<Demo3Section /> must exist in page.tsx");
  assert.ok(servicesCardDeckIndex !== -1, "<ServicesCardDeck /> must exist in page.tsx");

  assert.ok(
    butterIndex < demo3Index && demo3Index < servicesCardDeckIndex,
    "<Demo3Section /> must be directly below <ButterServices /> and above <ServicesCardDeck />"
  );
});

test("Demo3Section component structure, semantic markup, and tool categories", () => {
  const compContent = fs.readFileSync(componentFile, "utf-8").replace(/\r\n/g, "\n");

  // Core texts
  assert.ok(compContent.includes("How we&nbsp;work"), "Must include 'How we work' headline");
  assert.ok(compContent.includes("The requirement comes first. What does not need to exist gets"), "Must include lead paragraph");
  assert.ok(compContent.includes("The requirement first. Automation last."), "Must include pullout text");

  // Theme attributes for SiteHeader contrast
  assert.ok(compContent.includes('data-theme="light"'), "Must include data-theme='light' for header contrast");
  assert.ok(compContent.includes('data-topbar-theme="light"'), "Must include data-topbar-theme='light'");

  // Categories
  assert.ok(compContent.includes("Design"), "Must include Design category");
  assert.ok(compContent.includes("Web"), "Must include Web category");
  assert.ok(compContent.includes("AI"), "Must include AI category");
  assert.ok(compContent.includes("Measure"), "Must include Measure category");

  // Logos
  const expectedLogos = [
    "Adobe", "Figma", "Illustrator", "InDesign", "Blender", "Canva",
    "WordPress", "Cloudflare", "Astro", "Google Cloud",
    "Claude", "Grok", "Gemini", "ChatGPT",
    "Google Analytics", "Google Search Console", "Google Search SEO"
  ];

  for (const logo of expectedLogos) {
    assert.ok(compContent.includes(`<span>${logo}</span>`), `Must include tool logo ${logo}`);
  }

  // SVGs
  assert.ok(compContent.includes('viewBox="0 0 24 24"'), "Must include SVG icons");
  assert.ok(compContent.includes('--hue": "#EB1000'), "Adobe logo must have red hue style");
  assert.ok(compContent.includes('--hue": "#D97757'), "Claude logo must have orange hue style");
  assert.ok(compContent.includes('--hue": "#3186FF'), "Gemini logo must have blue hue style");

  // Reveal observer and scroll integration
  assert.ok(compContent.includes("data-reveal"), "Must preserve data-reveal attributes");
  assert.ok(compContent.includes("IntersectionObserver"), "Must use IntersectionObserver for entrance reveal");
  assert.ok(!compContent.includes("fallbackTimer = setTimeout"), "Must NOT use premature offscreen fallback timer");
  assert.ok(compContent.includes("window.__lenis.resize()"), "Must synchronize layout with Lenis scroll");
});

test("Demo3 responsive CSS module rules, typography features, and media queries", () => {
  const cssContent = fs.readFileSync(cssModuleFile, "utf-8").replace(/\r\n/g, "\n");

  // Responsive media queries with clean boundaries
  assert.ok(cssContent.includes("@media (min-width: 900px)"), "Must preserve desktop >=900px media query");
  assert.ok(cssContent.includes("@media (max-width: 899.98px)"), "Must use exclusive mobile <=899.98px boundary");

  // Fluid clamp expressions
  assert.ok(cssContent.includes("clamp("), "Must preserve fluid clamp() rules");
  assert.ok(cssContent.includes("clamp(64px, 9vw, 150px)"), "Must preserve stack padding clamp");
  assert.ok(cssContent.includes("clamp(18px, 2.6vw, 44px)"), "Must preserve logo margin clamp");

  // Typographic styling
  assert.ok(cssContent.includes('font-feature-settings: "cv11", "ss03"'), "Must include geometric font stylistic sets");
  assert.ok(cssContent.includes("-webkit-font-smoothing: antialiased"), "Must enable font antialiasing");

  // Font face declarations and dual format support
  assert.ok(cssContent.includes("@font-face"), "Must declare @font-face rules");
  assert.ok(cssContent.includes("Inter Tight Variable"), "Must declare Inter Tight Variable font");
  assert.ok(cssContent.includes('/demo3/fonts/'), "Must point to local /demo3/fonts/ directory");
  assert.ok(cssContent.includes('format("woff2")'), "Must support standard woff2 format");
});

test("Demo3 font assets exist in public/demo3/fonts and are non-empty", () => {
  assert.ok(fs.existsSync(publicFontsDir), "public/demo3/fonts directory must exist");

  const fontFiles = fs.readdirSync(publicFontsDir);
  assert.ok(fontFiles.length >= 7, "Must contain all 7 woff2 font files");

  for (const file of fontFiles) {
    const fullPath = path.join(publicFontsDir, file);
    const stat = fs.statSync(fullPath);
    assert.ok(stat.size > 1000, `Font file ${file} should have meaningful size (> 1KB)`);
  }
});
