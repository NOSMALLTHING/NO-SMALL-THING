import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();

test("SiteFooter component renders Demo3 footer structure with interactive hooks", () => {
  const footerPath = path.join(root, "src/components/site-footer.tsx");
  assert.ok(fs.existsSync(footerPath), "site-footer.tsx must exist");
  const code = fs.readFileSync(footerPath, "utf8");

  assert.ok(code.includes('className="footer site-footer"'), "must include footer and site-footer classes");
  assert.ok(code.includes("data-fit-text"), "must include data-fit-text attribute");
  assert.ok(code.includes("data-weight-hover"), "must include data-weight-hover attribute");
  assert.ok(code.includes("SAY HELLO"), "must include SAY HELLO headline");
  assert.ok(code.includes("data-sticker"), "must include data-sticker attribute");
  assert.ok(code.includes("data-peel"), "must include data-peel attribute");
  assert.ok(code.includes("data-holo"), "must include data-holo attribute");
  assert.ok(code.includes("data-ar-time"), "must include data-ar-time attribute");
  assert.ok(code.includes("data-to-top"), "must include data-to-top attribute");
  assert.ok(code.includes("initPeel"), "must initialize Peel effect");
  assert.ok(code.includes("initHolo"), "must initialize Holo effect");
  assert.ok(code.includes("initFitText"), "must initialize FitText effect");
  assert.ok(code.includes("initWeightHover"), "must initialize WeightHover effect");
});

test("Demo3 footer font assets and images exist and are non-empty in public/demoFooter", () => {
  const requiredFonts = [
    "archivo-variable.woff2",
    "departure-mono-400.woff2",
    "inter-400.woff2",
    "inter-500.woff2",
    "inter-600.woff2",
    "inter-700.woff2",
    "switzer-400.woff2",
    "switzer-500.woff2",
    "anton-400.woff2",
    "general-sans-500.woff2",
  ];

  for (const font of requiredFonts) {
    const fontPath = path.join(root, "public/demoFooter/fonts", font);
    assert.ok(fs.existsSync(fontPath), `Font ${font} must exist`);
    assert.ok(fs.statSync(fontPath).size > 1000, `Font ${font} must be non-empty`);
  }

  const logoPath = path.join(root, "public/demoFooter/logo-dovv-black.svg");
  assert.ok(fs.existsSync(logoPath), "logo-dovv-black.svg must exist");
  assert.ok(fs.statSync(logoPath).size > 100, "logo must be non-empty");
});

test("demo-footer.css imports all required fonts and defines responsive rules", () => {
  const cssPath = path.join(root, "src/app/demo-footer.css");
  assert.ok(fs.existsSync(cssPath), "demo-footer.css must exist");
  const css = fs.readFileSync(cssPath, "utf8");

  assert.ok(css.includes("/demoFooter/fonts/archivo-variable.woff2"), "must reference Archivo variable font");
  assert.ok(css.includes("/demoFooter/fonts/departure-mono-400.woff2"), "must reference Departure Mono font");
  assert.ok(css.includes("--off-white:"), "must define --off-white");
  assert.ok(css.includes(".footer[data-astro-cid-jo6i4kqk]"), "must style footer container");
  assert.ok(css.includes(".hello[data-astro-cid-jo6i4kqk]"), "must style hello link");
  assert.ok(css.includes(".sticker[data-astro-cid-mqob2q4p]"), "must style stickers");
  assert.ok(css.includes(".holo[data-astro-cid-syr6i6or]"), "must style holo elements");
});
