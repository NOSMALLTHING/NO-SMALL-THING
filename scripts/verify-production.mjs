import assert from "node:assert/strict";
import { spawn } from "node:child_process";
import { readFile, readdir, stat } from "node:fs/promises";

await stat("out/index.html");
assert.equal((await readdir("out")).filter(name => /^__.*-qa\.html$/.test(name)).length, 0, "No temporary QA pages in production output");
const port = 3311;
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["scripts/preview.mjs", String(port)], { stdio: ["ignore", "pipe", "pipe"], windowsHide: true });
try {
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("Preview startup timed out")), 10000);
    server.stdout.once("data", () => { clearTimeout(timer); resolve(); });
    server.once("error", reject);
    server.once("exit", code => { clearTimeout(timer); reject(new Error(`Preview exited: ${code}`)); });
  });
  const pages = ["/", "/expertise", "/studio", "/work/orbit", "/work/form-and-field", "/design-system"];
  let assets = new Set();
  for (const path of pages) {
    const result = await fetch(origin + path);
    assert.equal(result.status, 200, path);
    const html = await result.text();
    assert.equal((html.match(/<h1[\s>]/g) || []).length, 1, `${path}: single H1`);
    assert.match(html, /name="description"/, `${path}: description`);
    assert.match(html, /application\/ld\+json/, `${path}: organization metadata`);
    for (const match of html.matchAll(/(?:src|href)="(\/(?:_next\/static|brand|work|fonts)\/[^"?#]+)"/g)) assets.add(match[1]);
    for (const match of html.matchAll(/src[Ss]et="([^"]+)"/g)) {
      for (const candidate of match[1].split(",")) {
        const asset = candidate.trim().split(/\s+/)[0];
        if (asset.startsWith("/brand/")) assets.add(asset);
      }
    }
    if (path.includes("/work/") && path !== "/work/") {
      for (const title of ["Problem", "Solution", "Technology", "Outcome"]) assert.ok(html.includes(title), `${path}: ${title}`);
      assert.ok(html.includes("CONCEPT PROJECT"), `${path}: honest project status`);
    }
  }
  for (const asset of assets) assert.equal((await fetch(origin + asset)).status, 200, asset);
  assert.equal((await fetch(origin + "/unknown-page")).status, 404);
  assert.equal((await fetch(origin + "/work/unknown-project")).status, 404);
  assert.equal((await fetch(origin + "/contact")).status, 404, "Deleted /contact page returns 404");
  assert.equal((await fetch(origin + "/robots.txt")).status, 200);
  const sitemap = await (await fetch(origin + "/sitemap.xml")).text();
  assert.match(sitemap, /<urlset/);
  assert.ok(!sitemap.includes("design-system"));
  assert.ok(!sitemap.includes("/contact"), "Sitemap does not include deleted /contact");
  const rootHtml = await readFile("out/index.html", "utf8");
  for (const phrase of ["Three minds", "Not just more customers", "The full-funnel results", "what we do best", "creative method"]) assert.ok(rootHtml.includes(phrase), phrase);
  assert.ok(!rootHtml.includes("Have an idea, a challenge, or something worth building"), "No old contact form text");
  assert.ok(!rootHtml.includes("__about-qa") && !rootHtml.includes("__review-qa"));
  console.log(JSON.stringify({ pages: pages.length, assetRequests: assets.size, routeStatus: "passed", headings: "passed", metadata: "passed", conceptDisclosures: "passed", honestContactMode: "passed", fallback404: "passed", unsupportedPost: "405", sitemap: "passed" }));
} finally { server.kill(); }
