import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const butterServicesFile = path.resolve("src/components/butter-services.tsx");
const butterCssFile = path.resolve("src/app/butter-part2.css");

test("Section 2 Statement Timeline text and 5 block slots", () => {
  const content = fs.readFileSync(butterServicesFile, "utf-8");

  // Verify the exact replacement statement text
  const expectedStatementText =
    "SKIP THE WHOLE THING. NO SMALL THING specializes in the design and development of AI n IT Services. Founded with the mission of driving the future through disruptive technology, from the initial sketch to the final.";
  assert.ok(content.includes(expectedStatementText), "Should include new statement text in sr-only");

  // Verify the 5 slots are naturally embedded with clean word spacing
  assert.ok(content.includes("SKIP THE WHOLE THING."));
  assert.ok(content.includes("statementWrappersRef.current[0]"));
  assert.ok(content.includes("NO SMALL THING specializes in the design and development"));
  assert.ok(content.includes("statementWrappersRef.current[1]"));
  assert.ok(content.includes("of AI n IT Services."));
  assert.ok(content.includes("statementWrappersRef.current[2]"));
  assert.ok(content.includes("Founded with the mission of driving the future through disruptive technology,"));
  assert.ok(content.includes("statementWrappersRef.current[3]"));
  assert.ok(content.includes("from the initial sketch to the final."));
  assert.ok(content.includes("statementWrappersRef.current[4]"));

  // Check no leftover old Butter text in statement
  assert.ok(!content.includes("Butter is the first video editor"), "Old statement text must not exist");
});

test("Section 3 StoryOne tag, headline and interactive keywords future & AI", () => {
  const content = fs.readFileSync(butterServicesFile, "utf-8");

  // Kicker tag
  assert.ok(content.includes("Websites, software, and AI. Shipped, and running."));
  assert.ok(!content.includes("There’s a block for that"), "Old kicker tag must not exist");

  // Headline
  const expectedHeadline =
    "Building future where humanity is out exploring the AI is fundamentally more exciting than one where we are not.";
  assert.ok(content.includes(expectedHeadline), "Should include new headline in sr-only");
  assert.ok(!content.includes("Browse curated blocks for motion graphics"), "Old headline must not exist");

  // Halftone text mask sync
  assert.ok(
    content.includes(
      `className="index-style__StoryOneTextHalftoneInner-sc-be78c17d-3 jKEoAW">\n                      ${expectedHeadline}`
    )
  );

  // Interactive keywords future and AI
  assert.ok(content.includes("story-glow-future"));
  assert.ok(content.includes("story-glow-ai"));
  assert.ok(content.includes("story-keyword-future"));
  assert.ok(content.includes("story-keyword-ai"));
  assert.ok(content.includes("buildingWordRef"));
  assert.ok(content.includes("whereWordRef"));
  assert.ok(content.includes("theWordRef"));
  assert.ok(content.includes("isWordRef"));

  // Word-level wrapping integrity: words must be wrapped in renderWord to prevent broken mid-word linebreaks
  assert.ok(content.includes('renderWord("Building", 0, buildingWordRef)'));
  assert.ok(content.includes('renderWord("where", 16, whereWordRef)'));
  assert.ok(content.includes('renderWord("humanity", 22)'));
  assert.ok(content.includes('renderWord("exploring", 38)'));
  assert.ok(content.includes('renderWord("fundamentally", 58)'));

  // Optical focus tracking: chars must carry data-char-idx for accurate depth calculation
  assert.ok(content.includes("data-char-idx"));
  assert.ok(content.includes('target.getAttribute("data-char-idx")'));

  // Radiant glowing background aura should be a pure CSS radiant glow aura rather than hardcoded "blocks" image
  assert.ok(content.includes("story-glow-aura"));
});

test("Flight animation trigger threshold and speedup timing", () => {
  const content = fs.readFileSync(butterServicesFile, "utf-8");

  // Advanced trigger threshold: 0.88
  assert.ok(content.includes("windowH * 0.88"), "Trigger threshold must be advanced to windowH * 0.88");

  // Forward duration ~0.52s and stagger 0.035s
  assert.ok(content.includes("duration: 0.52"));
  assert.ok(content.includes("stagger = idx * 0.035"));

  // Reverse flight speedup
  assert.ok(content.includes("duration: 0.5"));
  assert.ok(content.includes("stagger = idx * 0.03"));
});

test("CSS styles for inflate, glow and optical focus", () => {
  const css = fs.readFileSync(butterCssFile, "utf-8");

  assert.ok(css.includes(".story-inflate-letter"));
  assert.ok(css.includes(".effect-inflate .story-inflate-letter"));
  assert.ok(css.includes(".story-glow-future"));
  assert.ok(css.includes(".story-glow-ai"));
  assert.ok(css.includes(".story-glow-aura"));
  assert.ok(css.includes("white-space: nowrap"));
});
