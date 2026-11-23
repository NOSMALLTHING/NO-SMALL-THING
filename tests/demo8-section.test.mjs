import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const pageFile = path.resolve("src/app/page.tsx");
const contactPageFile = path.resolve("src/app/contact/page.tsx");
const componentFile = path.resolve("src/components/demo8-section.tsx");
const cssFile = path.resolve("src/app/demo8.css");
const publicFontsDir = path.resolve("public/demo8/fonts");

test("Demo8Section placement in src/app/page.tsx", () => {
  const pageContent = fs.readFileSync(pageFile, "utf-8").replace(/\r\n/g, "\n");

  assert.ok(
    pageContent.includes('import { Demo8Section } from "@/components/demo8-section";'),
    "Should import Demo8Section in page.tsx"
  );

  const creativeMethodIndex = pageContent.indexOf("<CreativeMethod />");
  const demo8Index = pageContent.indexOf("<Demo8Section />");

  assert.ok(creativeMethodIndex !== -1, "<CreativeMethod /> must exist in page.tsx");
  assert.ok(demo8Index !== -1, "<Demo8Section /> must exist in page.tsx");
  assert.ok(
    creativeMethodIndex < demo8Index,
    "<Demo8Section /> must be placed after <CreativeMethod />"
  );

  // The old phrase must not exist in page.tsx
  assert.ok(
    !pageContent.includes("Have an idea, a challenge, or something worth building"),
    "Old contact text must not exist in page.tsx"
  );
});

test("Legacy contact page is completely removed", () => {
  assert.ok(!fs.existsSync(contactPageFile), "src/app/contact must be deleted cleanly");
});

test("Demo8Section component structure and semantic markup", () => {
  const compContent = fs.readFileSync(componentFile, "utf-8").replace(/\r\n/g, "\n");

  // Section 04 Headlines and labels
  assert.ok(compContent.includes("RESULTS"), "Must include section indicator RESULTS");
  assert.ok(compContent.includes("Why you need a website that works"), "Must include 'Why you need a website that works'");
  assert.ok(compContent.includes("Where others failed, we delivered"), "Must include we delivered tag");
  assert.ok(compContent.includes("Not just easier to find."), "Must include main headline first line");
  assert.ok(compContent.includes("Easier to trust."), "Must include main headline second line");

  // Sticky slot and articles
  assert.ok(compContent.includes('id="slotNum"'), "Must include sticky 3D slot #slotNum");
  assert.ok(compContent.includes("46%"), "Must include 46% credibility metric");
  assert.ok(compContent.includes("10X"), "Must include 10X SEO metric");
  assert.ok(compContent.includes("$1K → $80K+"), "Must include TikTok Shop GMV metric");

  // Canvases and WebGL logic
  assert.ok(compContent.includes('ref={paintCanvasRef}'), "Must render paint canvas");
  assert.ok(compContent.includes('ref={glCanvasRef}'), "Must render WebGL gl canvas");
  assert.ok(compContent.includes("THREE.WebGLRenderer"), "Must initialize THREE.WebGLRenderer");
  assert.ok(compContent.includes("generateTextMesh"), "Must include particle text mesh generator");
  assert.ok(compContent.includes("drawWatercolorBlob"), "Must include watercolor paint blob renderer");

  // Semantic layout, navigation, and CTA button
  assert.ok(compContent.includes('id="results"'), "Section must include id='results' for site navigation");
  assert.ok(!compContent.includes('id="contact"'), "Must not include obsolete id='contact'");
  assert.ok(!compContent.includes('<main className="demo8-main">'), "Must not render nested <main> landmark tag");
  assert.ok(compContent.includes('<div className="demo8-main">'), "Must render <div className='demo8-main'>");
  assert.ok(compContent.includes('href="#site-footer"'), "CTA button must point to site-footer");
  assert.ok(compContent.includes('(scroll to footer)'), "CTA button must declare accessible screen reader text");
  assert.ok(compContent.includes("alphaToCoverage: true"), "Shader material must declare alphaToCoverage");
  assert.ok(compContent.includes("tiltX = B.sy * 0.16"), "3D tilt pitch must follow Demo8 positive Y axis convention");
  assert.ok(compContent.includes("pointerdown"), "Pointer listeners must respond immediately to pointerdown");
});

test("Demo8 CSS rules, fonts, and responsive layouts", () => {
  const cssContent = fs.readFileSync(cssFile, "utf-8").replace(/\r\n/g, "\n");

  assert.ok(cssContent.includes("@font-face"), "Must declare @font-face");
  assert.ok(cssContent.includes("Neue Haas Display"), "Must declare Neue Haas Display font");
  assert.ok(cssContent.includes("/demo8/fonts/NeueHaasDisplayRoman6d6d.woff2"), "Must point to Roman font file");
  assert.ok(cssContent.includes("/demo8/fonts/NeueHaasDisplayMediu21aa.woff2"), "Must point to Medium font file");

  assert.ok(cssContent.includes(".demo8-root"), "Must scope styles to .demo8-root");
  assert.ok(cssContent.includes("--lime: #E5F075"), "Must define --lime brand color");
  assert.ok(cssContent.includes("--green: #163F35"), "Must define --green background color");
  assert.ok(cssContent.includes("@media (max-width: 900px)"), "Must support responsive layout for mobile");
  assert.ok(cssContent.includes(".results {\n  background: transparent;"), "Results section must be transparent for WebGL");
  assert.ok(cssContent.includes(".grid9 {\n  background: transparent;"), "Grid9 section must be transparent for watercolor bloom");
  assert.ok(cssContent.includes(".demo8-root ::selection"), "Must define ::selection brand highlight");
  assert.ok(cssContent.includes(".demo8-root :focus-visible"), "Must define :focus-visible outline");
});

test("Demo8 font assets exist in public/demo8/fonts and are non-empty", () => {
  assert.ok(fs.existsSync(publicFontsDir), "public/demo8/fonts directory must exist");
  const romanFont = path.join(publicFontsDir, "NeueHaasDisplayRoman6d6d.woff2");
  const mediumFont = path.join(publicFontsDir, "NeueHaasDisplayMediu21aa.woff2");

  assert.ok(fs.existsSync(romanFont), "Roman font must exist");
  assert.ok(fs.existsSync(mediumFont), "Medium font must exist");
  assert.ok(fs.statSync(romanFont).size > 10000, "Roman font must be non-empty");
  assert.ok(fs.statSync(mediumFont).size > 10000, "Medium font must be non-empty");
});

test("Demo8Section mobile vertical sliding and scroll-linked positioning implementation", () => {
  const compContent = fs.readFileSync(componentFile, "utf-8").replace(/\r\n/g, "\n");
  const cssContent = fs.readFileSync(cssFile, "utf-8").replace(/\r\n/g, "\n");

  // 1. Mobile viewport slot--mini tracking
  assert.ok(
    compContent.includes('isMobile ? miniSlots[idx] : slotNum'),
    "Component must select slot--mini on mobile and slotNum on desktop"
  );
  assert.ok(
    compContent.includes('m: isMobile ? null : el'),
    "Component must set m to null on mobile and card element on desktop"
  );
  assert.ok(
    compContent.includes('inset: isMobile ? 0 : 0.28'),
    "Component must set inset to 0 on mobile and 0.28 on desktop"
  );

  // 2. Exact scroll progression math from Demo8 (appca85.js)
  assert.ok(
    compContent.includes('w = i0((i - m[y][1]) / Math.max(1, m[y + 1][0] - m[y][1]))'),
    "Component must calculate scroll progress between slot y bottom and slot y+1 top"
  );
  assert.ok(
    compContent.includes('g = M ? (w < 0.5 ? 0 : 1) : bf(w)'),
    "Component must ease scroll progression via bf(w)"
  );
  assert.ok(
    compContent.includes('l = T === h ? 0 : J(j(w, 0.06, 0.94))'),
    "Component must calculate smooth morph factor l with deadband"
  );

  // 3. Screen-to-world 3D projection and lerp
  assert.ok(
    compContent.includes('ke(v[y], ut)'),
    "Component must project current slot rect to ut vector"
  );
  assert.ok(
    compContent.includes('ke(v[F], dt)'),
    "Component must project next slot rect to dt vector"
  );
  assert.ok(
    compContent.includes('le.copy(ut).lerp(dt, g)'),
    "Component must interpolate 3D particle group position with lerp"
  );

  // 4. Smooth visibility transfer between slots
  assert.ok(
    compContent.includes('Math.max(') && compContent.includes('z0(v[y]) * (1 - g * 0.999)'),
    "Component must blend slot visibilities using Math.max and smooth falloff"
  );

  // 5. CSS slot--mini display on mobile
  assert.ok(
    cssContent.includes('.slot--mini {\n    display: block;\n    height: 34vh;'),
    "Mobile CSS must display slot--mini with height 34vh"
  );
  assert.ok(
    cssContent.includes('.nums__stick {\n    display: none;'),
    "Mobile CSS must hide sticky desktop slot"
  );
});

test("Demo8 mobile scroll trajectory numerical simulation and continuity", () => {
  const i0 = (f, e = 0, t = 1) => Math.min(t, Math.max(e, f));
  const I = (f, e, t) => f + (e - f) * t;
  const j = (f, e, t) => i0((f - e) / (t - e));
  const J = (f) => f * f * (3 - 2 * f);
  const bf = (f) => (f < 0.5 ? 4 * f * f * f : 1 - Math.pow(-2 * f + 2, 3) / 2);
  const WORLD_H = 2 * Math.tan((15 * Math.PI) / 180) * 20;

  // Simulate mobile 390x844
  const viewportHeight = 844;
  const viewportWidth = 390;
  const cardHeight = 720;
  const slotHeight = 844 * 0.34; // 34vh = ~287px

  const z0 = (f) =>
    i0((Math.min(f.bottom, viewportHeight) - Math.max(f.top, 0)) / Math.max(1, Math.min(f.height, viewportHeight)));

  const ke = (f) => {
    const t = WORLD_H / viewportHeight;
    return {
      x: (f.left + f.width / 2 - viewportWidth / 2) * t,
      y: -(f.top + f.height / 2 - viewportHeight / 2) * t,
    };
  };

  let prevPosY = null;
  let activeTransitions = 0;

  for (let scroll = 0; scroll <= 2400; scroll += 10) {
    const sectionTop = 600 - scroll;
    const slots = [0, 1, 2].map((idx) => {
      const top = sectionTop + 100 + idx * cardHeight;
      return {
        top,
        bottom: top + slotHeight,
        left: 20,
        width: 350,
        height: slotHeight,
      };
    });

    const i = viewportHeight * 0.5;
    const v = slots;
    const m = v.map((K) => [K.top, K.bottom]);

    let y = 0;
    for (let A = 0; A < 3; A++) {
      if (m[A][0] <= i) y = A;
    }

    let w = 0;
    if (m[y][0] <= i && i > m[y][1] && y < 2) {
      w = i0((i - m[y][1]) / Math.max(1, m[y + 1][0] - m[y][1]));
    }

    const F = Math.min(2, y + 1);
    const g = bf(w);
    const l = y === F ? 0 : J(j(w, 0.06, 0.94));

    const ut = ke(v[y]);
    const dt = ke(v[F]);
    const posY = I(ut.y, dt.y, g);

    assert.ok(w >= 0 && w <= 1, `Scroll progress w must be bounded in [0, 1], got ${w}`);
    assert.ok(l >= 0 && l <= 1, `Morph progress l must be bounded in [0, 1], got ${l}`);

    if (w > 0 && w < 1) activeTransitions++;

    // Continuous trajectory check: no sudden displacement > 0.6 world units across 10px scroll steps
    if (prevPosY !== null) {
      const delta = Math.abs(posY - prevPosY);
      assert.ok(
        delta < 0.6,
        `Discontinuous jump detected at scroll=${scroll}: delta=${delta.toFixed(4)}`
      );
    }
    prevPosY = posY;
  }

  assert.ok(activeTransitions > 10, "Must exercise continuous morph transitions across slots");
});

