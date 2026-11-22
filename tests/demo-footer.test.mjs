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

  // Content customizations
  assert.ok(code.includes("nosmallthing.limited@gmail.com"), "must include custom email");
  assert.ok(code.includes("https://cal.com/no-small-thing-ejfl44/quick-chat"), "must include updated cal.com booking link");
  assert.ok(code.includes("BEGIN WITH US"), "must include BEGIN WITH US heading");
  for (let i = 1; i <= 7; i++) {
    assert.ok(code.includes(`demo${i}`), `must include demo${i} service item`);
  }
  // Services should have no anchor/jump links
  assert.ok(!code.includes("<a href=\"/#services\">demo1</a>"), "services must not have jump links");
  assert.ok(code.includes("<li data-astro-cid-jo6i4kqk>demo1</li>"), "services must be plain list items");

  // Pages links
  assert.ok(code.includes('href="/#work"'), "must include internal #work link");
  assert.ok(code.includes('href="/studio"'), "must include internal /studio link");
  assert.ok(code.includes('href="/#creative"'), "must include internal #creative link");
  assert.ok(code.includes("Creative"), "must include Creative page item");
  assert.ok(!code.includes("dovvstudio.com/work"), "must not include external dovvstudio work link");
  assert.ok(!code.includes("dovvstudio.com/about"), "must not include external dovvstudio about link");
  assert.ok(!code.includes("dovvstudio.com/blog"), "must not include external dovvstudio blog link");
  assert.ok(code.includes("faceboook"), "must include faceboook social link");
  assert.ok(code.includes("小红书"), "must include 小红书 social link");
  assert.ok(code.includes("https://www.instagram.com/nosmallthing.limited/"), "must include Instagram link");
  assert.ok(code.includes("https://www.linkedin.com/in/no-small-thing-987899445/"), "must include LinkedIn link");
  assert.ok(!code.includes("volkmanndario"), "must not include old Dario X link");
  assert.ok(code.includes("KUALA LUMPUR"), "must include KUALA LUMPUR location");
  assert.ok(code.includes("UTC+8"), "must include UTC+8 time label");
  assert.ok(code.includes("Ask AI about US"), "must include Ask AI about US label");
  assert.ok(!code.includes("Ask AI about DOVV"), "must not include DOVV in Ask AI label");
  assert.ok(code.includes("wordmark-black.png"), "must include NO SMALL THING wordmark");
  assert.ok(code.includes("@2026 no small thing"), "must include custom copyright text");
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

  const logoPath = path.join(root, "public/brand/wordmark-black.png");
  assert.ok(fs.existsSync(logoPath), "wordmark-black.png must exist");
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
  assert.ok(css.includes('.label[data-astro-cid-jo6i4kqk]{font-family:"Inter Tight"'), "must style labels with Inter Tight font");
  assert.ok(css.includes('.bar[data-astro-cid-jo6i4kqk] p[data-astro-cid-jo6i4kqk]{font-family:"Inter Tight"'), "must style copyright with Inter Tight font");
});
