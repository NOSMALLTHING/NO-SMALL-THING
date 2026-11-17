import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const brandTsxFile = path.resolve("src/components/mobile/mobile-brand-transition.tsx");
const brandCssFile = path.resolve("src/components/mobile/mobile-brand-transition.module.css");
const headerTsxFile = path.resolve("src/components/site-header.tsx");
const globalsCssFile = path.resolve("src/app/globals.css");

test("MobileBrandTransition component uses clamped transforms and anchorRef measurements", () => {
  const content = fs.readFileSync(brandTsxFile, "utf-8").replace(/\r\n/g, "\n");

  // Clamped transform usage
  assert.ok(content.includes("{ clamp: true }"), "Transforms must clamp to [0, BRAND_SCROLL_DISTANCE]");
  assert.ok(content.includes("useTransform(scrollY, [0, BRAND_SCROLL_DISTANCE], [startX, targetLeft], { clamp: true })"));
  assert.ok(content.includes("useTransform(scrollY, [0, BRAND_SCROLL_DISTANCE], [startY, targetTop], { clamp: true })"));
  assert.ok(content.includes("useTransform(scrollY, [0, BRAND_SCROLL_DISTANCE], [startScale, 1], { clamp: true })"));

  // Uses untransformed anchorRef measurement
  assert.ok(content.includes("anchor.getBoundingClientRect()"), "Must measure header anchor rect without scale distortion");
  assert.ok(!content.includes("brandScrollY.set(0)"), "Must not force brandScrollY to 0 desyncing from scroll");
  assert.ok(!content.includes("window.scrollTo(0, 0)"), "Must not force window scroll to 0 on mount");

  // Re-measures on resize and orientationchange
  assert.ok(content.includes('"resize"'));
  assert.ok(content.includes('"orientationchange"'));
  assert.ok(content.includes("handleOrientationChange"), "Must handle asynchronous orientation change reflows");
  assert.ok(content.includes("Math.min(rawStartX, metrics.viewportWidth - actualHeroWidth - 14)"), "Must clamp startX to viewport boundaries");
  assert.ok(content.includes("rect.left > 0 && rect.left < vw * 0.45"), "Must guard against transient corrupted anchor coordinates");
});

test("CSS rules guarantee desktop isolation and mobile-only execution", () => {
  const brandCss = fs.readFileSync(brandCssFile, "utf-8").replace(/\r\n/g, "\n");
  const globalsCss = fs.readFileSync(globalsCssFile, "utf-8").replace(/\r\n/g, "\n");

  // Default desktop state: hidden
  assert.ok(brandCss.includes(".brand {\n  display: none;\n}"));

  // Mobile media query constraints
  assert.ok(brandCss.includes("@media (max-width: 767px)"));
  assert.ok(brandCss.includes("top: 0;"));
  assert.ok(brandCss.includes("left: 0;"));
  assert.ok(brandCss.includes("backface-visibility: hidden;"), "Must enable GPU antialiasing to prevent text jitter on high-DPI screens");

  // Menu-open handling
  assert.ok(brandCss.includes(":global(body.menu-open) .brand"));
  assert.ok(globalsCss.includes(".site-header.is-home .header-bar .brand-name"));
  assert.ok(globalsCss.includes("visibility: hidden;"));
  assert.ok(globalsCss.includes("body.menu-open .site-header.is-home .header-bar .brand-name"));
});

test("SiteHeader passes anchorRef to MobileBrandTransition", () => {
  const headerContent = fs.readFileSync(headerTsxFile, "utf-8");
  assert.ok(headerContent.includes("<MobileBrandTransition isLight={isLight} anchorRef={logoRef} />"));
});

test("MobileBrandTransition prevents hydration mismatches via mounted guard and suppressHydrationWarning", () => {
  const content = fs.readFileSync(brandTsxFile, "utf-8").replace(/\r\n/g, "\n");
  assert.ok(content.includes("const [mounted, setMounted] = useState(false)"), "Must track client mount state");
  assert.ok(content.includes("if (!mounted)"), "Must guard against rendering during SSR and initial hydration");
  assert.ok(content.includes("suppressHydrationWarning"), "Must add suppressHydrationWarning to motion.div");
  assert.ok(content.includes("viewportWidth: 390"), "Must initialize with deterministic mobile fallback width");
  assert.ok(content.includes("viewportHeight: 844"), "Must initialize with deterministic mobile fallback height");
  assert.ok(content.includes("[anchorRef, mounted]"), "Metrics and observer effect must depend on mounted state to measure DOM");
});
