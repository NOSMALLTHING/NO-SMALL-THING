import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const globalsCssFile = path.resolve("src/app/globals.css");
const siteHeaderFile = path.resolve("src/components/site-header.tsx");

test("SiteHeader menu drawer and parrot fixed positioning in globals.css", () => {
  const css = fs.readFileSync(globalsCssFile, "utf-8").replace(/\r\n/g, "\n");

  // .menu-drawer must be position: fixed to eliminate downward displacement during scroll or route navigation
  const drawerRuleMatch = css.match(/\.menu-drawer\s*\{([^}]+)\}/);
  assert.ok(drawerRuleMatch, ".menu-drawer CSS rule must exist");
  const drawerBlock = drawerRuleMatch[1];
  assert.ok(
    drawerBlock.includes("position: fixed"),
    ".menu-drawer must have position: fixed"
  );
  assert.ok(
    drawerBlock.includes("top: var(--menu-edge-gap)"),
    ".menu-drawer desktop top must be strictly pinned to var(--menu-edge-gap)"
  );

  // .menu-parrot must be position: fixed
  const parrotRuleMatch = css.match(/\.menu-parrot\s*\{([^}]+)\}/);
  assert.ok(parrotRuleMatch, ".menu-parrot CSS rule must exist");
  const parrotBlock = parrotRuleMatch[1];
  assert.ok(
    parrotBlock.includes("position: fixed"),
    ".menu-parrot must have position: fixed"
  );
  assert.ok(
    parrotBlock.includes("top: calc(var(--menu-edge-gap) + calc(76 * var(--emb-u)))"),
    ".menu-parrot desktop top must be pinned relative to var(--menu-edge-gap)"
  );
});

test("SiteHeader geometry sync avoids mutating --menu-anchor-top", () => {
  const headerCode = fs.readFileSync(siteHeaderFile, "utf-8").replace(/\r\n/g, "\n");

  // Ensure syncMenuGeometry does not mutate --menu-anchor-top
  assert.ok(
    !headerCode.includes('overlay.style.setProperty("--menu-anchor-top"'),
    "site-header.tsx must NOT set --menu-anchor-top on overlay style to prevent feedback loop displacement"
  );

  // Ensure route change cleanup resets menuOpen and cleans up overlay
  assert.ok(
    headerCode.includes("useEffect(() => {"),
    "site-header.tsx must have route cleanup effect"
  );
  assert.ok(
    headerCode.includes('document.body.classList.remove("menu-open")'),
    "route cleanup must clear menu-open from body"
  );
});
