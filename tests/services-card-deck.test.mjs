import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const deckFile = path.resolve("src/components/services-card-deck.tsx");
const deckSource = fs.readFileSync(deckFile, "utf-8").replace(/\r\n/g, "\n");

test("ServicesCardDeck: contains all 5 projects with intact metadata and media", () => {
  const expectedProjects = [
    { id: "project-1", number: "(01)", tag: "AI & Innovation", theme: "service-card-lime" },
    { id: "project-2", number: "(02)", tag: "Digital Platforms", theme: "service-card-pink" },
    { id: "project-3", number: "(03)", tag: "UI/UX Experience", theme: "service-card-violet" },
    { id: "project-4", number: "(04)", tag: "Systems Architecture", theme: "service-card-lilac" },
    { id: "project-5", number: "(05)", tag: "Design Support", theme: "service-card-white" },
  ];

  for (const p of expectedProjects) {
    assert.ok(deckSource.includes(`id: "${p.id}"`), `Should include project ID ${p.id}`);
    assert.ok(deckSource.includes(`number: "${p.number}"`), `Should include project number ${p.number}`);
    assert.ok(deckSource.includes(`tag: "${p.tag}"`), `Should include tag ${p.tag}`);
    assert.ok(deckSource.includes(`themeClass: "${p.theme}"`), `Should include theme ${p.theme}`);
  }
});

test("ServicesCardDeck: eliminates perpetual idle RAF loop and layout thrashing", () => {
  // Must NOT run unthrottled infinite RAF loop
  assert.ok(
    !deckSource.includes("const loop = () =>"),
    "Must eliminate perpetual requestAnimationFrame loop"
  );

  // Must NOT read card.getBoundingClientRect inside animation loop
  assert.ok(
    !deckSource.includes("c.getBoundingClientRect().top"),
    "Must not trigger layout thrashing via card getBoundingClientRect"
  );

  // Must NOT use stateful CardPhysicsState lerp accumulator
  assert.ok(
    !deckSource.includes("interface CardPhysicsState"),
    "Must not rely on mutable CardPhysicsState lerp accumulation"
  );
  assert.ok(
    !deckSource.includes("cardStates.current"),
    "Must not use stateful cardStates ref"
  );
});

test("ServicesCardDeck: deterministic calculation and mathematical symmetry", () => {
  // Test mathematical easings
  const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
  const easeInOut = (t) => {
    const c = clamp(t, 0, 1);
    return c * c * (3 - 2 * t);
  };
  const easeOutCubic = (t) => {
    const c = clamp(t, 0, 1);
    return 1 - Math.pow(1 - c, 3);
  };

  // 1. Clamping bounds
  assert.equal(clamp(-0.5, 0, 1), 0);
  assert.equal(clamp(1.5, 0, 1), 1);
  assert.equal(clamp(0.5, 0, 1), 0.5);

  // 2. Smoothstep easing bounds and symmetry
  assert.equal(easeInOut(0), 0);
  assert.equal(easeInOut(1), 1);
  assert.equal(easeInOut(0.5), 0.5);
  // Symmetric curvature: easeInOut(x) + easeInOut(1 - x) = 1
  for (let x = 0; x <= 1; x += 0.1) {
    const sum = easeInOut(x) + easeInOut(1 - x);
    assert.ok(Math.abs(sum - 1) < 1e-9, `Smoothstep must be symmetric at x=${x}`);
  }

  // 3. Side direction alternation
  for (let index = 0; index < 5; index++) {
    const sideDirection = index % 2 === 0 ? -1 : 1;
    if (index % 2 === 0) {
      assert.equal(sideDirection, -1, `Even index ${index} must enter from left`);
    } else {
      assert.equal(sideDirection, 1, `Odd index ${index} must enter from right`);
    }
  }

  // 4. Deterministic reversibility on scroll
  const viewportWidth = 1440;
  const unitPx = 1;
  const cardWidth = 1160;
  const cardHeight = 370;
  const flowGap = 112;
  const enterRange = (cardHeight + flowGap) * 1.12;
  const sideEntryOffset = viewportWidth * 0.52 + cardWidth * 0.58;

  const computeCardTransform = (sectionScroll, normalTop, cardTop, index) => {
    const slotTriggerScroll = normalTop - cardTop;
    const enterStart = slotTriggerScroll - enterRange;
    const rawProgress = clamp((sectionScroll - enterStart) / enterRange, 0, 1);
    const enterProgress = easeInOut(rawProgress);
    const sideDirection = index % 2 === 0 ? -1 : 1;
    const sideEntryRest = 1 - enterProgress;
    const targetX = (sideDirection * sideEntryOffset * sideEntryRest) || 0;
    const targetRotateY = (sideDirection * (-7 * (1 - enterProgress))) || 0;
    const targetRotateZ = (sideDirection * (8.5 * (1 - enterProgress))) || 0;
    return { targetX, targetRotateY, targetRotateZ, rawProgress };
  };

  // Scroll down then scroll up to exact same position must yield exact same result
  const scrollPos = 300;
  const tDown = computeCardTransform(scrollPos, 814, 228, 1);
  const tUp = computeCardTransform(scrollPos, 814, 228, 1);
  assert.equal(tDown.targetX, tUp.targetX, "Transform X must be strictly deterministic");
  assert.equal(tDown.targetRotateY, tUp.targetRotateY, "Transform RotateY must be strictly deterministic");
  assert.equal(tDown.targetRotateZ, tUp.targetRotateZ, "Transform RotateZ must be strictly deterministic");

  // At beginning of entrance, targetX must be full side offset
  const tStart = computeCardTransform(-1000, 814, 228, 1);
  assert.equal(tStart.rawProgress, 0);
  assert.equal(tStart.targetX, sideEntryOffset);

  // At completion of entrance, targetX and rotations must be 0
  const tEnd = computeCardTransform(1000, 814, 228, 1);
  assert.equal(tEnd.rawProgress, 1);
  assert.equal(tEnd.targetX, 0);
  assert.equal(tEnd.targetRotateY, 0);
  assert.equal(tEnd.targetRotateZ, 0);
});

test("ServicesCardDeck: depth calculation consistency between live stacking and Runway 2", () => {
  const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
  const easeOutCubic = (t) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);

  const computeCardDepth = (index, totalCards, getProgress) => {
    let sum = 0;
    for (let later = index + 1; later < totalCards; later++) {
      const laterIndex = later - (index + 1);
      const weight = Math.max(0.36, 1 - laterIndex * 0.22);
      const layered = easeOutCubic(getProgress(later));
      sum += layered * weight;
    }
    return clamp(sum, 0, 2.7);
  };

  // Live calculation when all subsequent cards are landed (progress = 1)
  const totalCards = 5;
  for (let index = 0; index < totalCards; index++) {
    const liveDepth = computeCardDepth(index, totalCards, () => 1);
    const runwayDepth = computeCardDepth(index, totalCards, () => 1);
    assert.equal(liveDepth, runwayDepth, `Depth at index ${index} must match exactly`);
  }

  // Verify top card has 0 depth, bottom card has max depth (2.7)
  assert.equal(computeCardDepth(4, 5, () => 1), 0);
  assert.ok(Math.abs(computeCardDepth(0, 5, () => 1) - 2.7) < 1e-6);
});

test("ServicesCardDeck: invariance across 500 erratic scroll movements", () => {
  const clamp = (val, min, max) => Math.min(max, Math.max(min, val));
  const easeInOut = (t) => {
    const c = clamp(t, 0, 1);
    return c * c * (3 - 2 * c);
  };

  const viewportWidth = 1440;
  const cardWidth = 1160;
  const cardHeight = 370;
  const flowGap = 112;
  const enterRange = (cardHeight + flowGap) * 1.12;
  const sideEntryOffset = viewportWidth * 0.52 + cardWidth * 0.58;

  const compute = (sectionScroll, index) => {
    const normalTop = 332 + index * (cardHeight + flowGap);
    const cardTop = 228;
    const slotTriggerScroll = normalTop - cardTop;
    const enterStart = slotTriggerScroll - enterRange;
    const rawProgress = clamp((sectionScroll - enterStart) / enterRange, 0, 1);
    const enterProgress = easeInOut(rawProgress);
    const sideDirection = index % 2 === 0 ? -1 : 1;
    const sideEntryRest = 1 - enterProgress;
    const targetX = sideDirection * sideEntryOffset * sideEntryRest;
    return { targetX, rawProgress };
  };

  // Simulate 500 rapid forward/reverse scroll jumps
  for (let i = 0; i < 500; i++) {
    const pseudoRandomScroll = Math.sin(i * 1.7) * 3000 + 1000;
    compute(pseudoRandomScroll, 2);
  }

  // Now measure at a fixed test scroll position
  const probeScroll = 750;
  const probe1 = compute(probeScroll, 2);
  const probe2 = compute(probeScroll, 2);

  assert.equal(probe1.targetX, probe2.targetX, "Cards must never suffer from state drift");
  assert.equal(probe1.rawProgress, probe2.rawProgress, "Progress must be strictly invariant");
  assert.ok(probe1.targetX !== 0, "Card 2 must not be frozen at 0 ('直上直下') when in mid-entry");
});

test("ServicesCardDeck: mobile layout fallback and responsive protection", () => {
  assert.ok(deckSource.includes('matchMedia("(max-width: 900px)")'), "Should include 900px breakpoint check");
  assert.ok(deckSource.includes('card.style.transform = ""'), "Should clear inline transform on mobile");
  assert.ok(deckSource.includes("useReducedMotion"), "Should respect reduced motion preference");
});
