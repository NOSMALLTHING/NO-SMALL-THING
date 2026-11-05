"use client";

import { useState, useRef, useEffect, useCallback, type RefObject } from "react";
import {
  motion,
  useMotionValue,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
  useReducedMotion,
  type MotionValue,
} from "motion/react";
import styles from "./our-services.module.css";

const services = [
  {
    number: "01",
    shortName: "01 // AI SERVICES & SOLUTIONS",
    title: "AI Services & Solutions",
    description:
      "AI integration, intelligent automation and workflow optimization. Purposeful AI solutions that support the way your business works.",
  },
  {
    number: "02",
    shortName: "02 // WEBSITE DESIGN & DEV",
    title: "Website Design & Development",
    description:
      "Custom business websites, thoughtfully designed and responsively built. From a new digital presence to optimizing an existing website.",
  },
  {
    number: "03",
    shortName: "03 // UI/UX DESIGN",
    title: "UI/UX Design",
    description:
      "Intuitive interfaces, considered user journeys and clear interactions. Digital product design that puts people first.",
  },
  {
    number: "04",
    shortName: "04 // SOFTWARE DEVELOPMENT",
    title: "Software Development",
    description:
      "Custom software, web applications and business systems. Practical internal tools shaped around your team’s needs.",
  },
  {
    number: "05",
    shortName: "05 // IT SERVICES & SOLUTIONS",
    title: "IT Services & Digital Solutions",
    description:
      "Technology consulting, system integration and technical support. Connected digital solutions for your everyday business challenges.",
  },
] as const;

function segment(value: number, start: number, end: number) {
  if (value <= start) return 0;
  if (value >= end) return 1;
  return (value - start) / (end - start);
}

function silk(amount: number) {
  const t = Math.min(1, Math.max(0, amount));
  return 0.5 - Math.cos(Math.PI * t) / 2;
}

function glide(amount: number) {
  return silk(amount);
}

function useDepart(progress: MotionValue<number>, start: number, end: number, distanceVw: number) {
  const x = useTransform(progress, (value) => `${-glide(segment(value, start, end)) * distanceVw}vw`);
  const opacity = useTransform(progress, (value) => {
    const t = segment(value, start, end);
    if (t <= 0.55) return 1;
    return 1 - silk((t - 0.55) / 0.45);
  });
  return { x, opacity };
}

interface NarrativeLineProps {
  children: React.ReactNode;
  lineIndex: number;
  scrollYProgress: MotionValue<number>;
  enabled: boolean;
}

function NarrativeLine({
  children,
  lineIndex,
  scrollYProgress,
  depart,
  enabled,
}: NarrativeLineProps & { depart: MotionValue<number> }) {
  const e0 = 0.01 + lineIndex * 0.014;
  const e1 = e0 + 0.064;
  const exit = useDepart(depart, 0.02 + lineIndex * 0.05, 0.5 + lineIndex * 0.05, 108);

  const y = useTransform(scrollYProgress, (value) => `${(1 - silk(segment(value, e0, e1))) * 100}%`);
  const opacity = useTransform(scrollYProgress, (value) => silk(segment(value, e0, e1)));

  const line = enabled ? (
    <motion.span className={styles.narrativeLineInner} style={{ y, opacity }}>
      {children}
    </motion.span>
  ) : (
    <span className={styles.narrativeLineInner}>{children}</span>
  );

  return (
    <motion.span className={styles.departLine} style={enabled ? exit : undefined}>
      <span className={styles.narrativeLineMask}>{line}</span>
    </motion.span>
  );
}

interface HeadlineRowProps {
  children: React.ReactNode;
  scrollYProgress: MotionValue<number>;
  range: [number, number, number]; // [enterStart, coverComplete, exitComplete]
  enabled: boolean;
}

function HeadlineRow({
  children,
  scrollYProgress,
  range,
  depart,
  lineIndex,
  enabled,
}: HeadlineRowProps & { depart: MotionValue<number>; lineIndex: number }) {
  const [a, b, c] = range;
  const exit = useDepart(depart, 0.28 + lineIndex * 0.07, 0.7 + lineIndex * 0.07, 124);

  // Phase 1 (a -> b): the block eases across the line.
  // Phase 2 (b -> c): it eases away and leaves the type.
  const blockClipPath = useTransform(scrollYProgress, (value) => {
    if (value <= a) return "inset(0% 100% 0% 0%)";
    if (value <= b) return `inset(0% ${(1 - silk(segment(value, a, b))) * 100}% 0% 0%)`;
    if (value <= c) return `inset(0% 0% 0% ${silk(segment(value, b, c)) * 100}%)`;
    return "inset(0% 0% 0% 100%)";
  });

  const blockOpacity = useTransform(
    scrollYProgress,
    [0, Math.max(0, a - 0.001), a, c, Math.min(1, c + 0.001), 1],
    [0, 0, 1, 1, 0, 0]
  );

  const textOpacity = useTransform(
    scrollYProgress,
    [0, Math.max(0, b - 0.001), b, 1],
    [0, 0, 1, 1]
  );

  if (!enabled) {
    return (
      <span className={styles.headlineRow}>
        <span className={styles.textInner}>{children}</span>
      </span>
    );
  }

  return (
    <motion.span className={styles.headlineRow} style={exit}>
      <motion.span
        className={styles.textInner}
        style={{ opacity: textOpacity }}
      >
        {children}
      </motion.span>
      <motion.span
        className={styles.blackBlock}
        style={{
          clipPath: blockClipPath,
          opacity: blockOpacity,
        }}
        aria-hidden="true"
      />
    </motion.span>
  );
}

function ServiceStripButton({
  depart,
  index,
  enabled,
  selected,
  label,
  onSelect,
}: {
  depart: MotionValue<number>;
  index: number;
  enabled: boolean;
  selected: boolean;
  label: string;
  onSelect: () => void;
}) {
  const exit = useDepart(depart, 0.06 + index * 0.028, 0.26 + index * 0.02, 28);
  return (
    <motion.button
      type="button"
      className={`${styles.stripItem} ${selected ? styles.isActive : ""}`}
      style={enabled ? exit : undefined}
      onClick={onSelect}
      onMouseEnter={onSelect}
      aria-pressed={selected}
    >
      <span className={`${styles.stripBracket} ${styles.bracketLeft}`} aria-hidden="true">[</span>
      <span>{label}</span>
      <span className={`${styles.stripBracket} ${styles.bracketRight}`} aria-hidden="true">]</span>
    </motion.button>
  );
}

export function OurServices({
  standalone = false,
  trackRef,
  progress,
  exitProgress,
  handoff = false,
}: {
  standalone?: boolean;
  trackRef?: RefObject<HTMLDivElement | null>;
  progress?: MotionValue<number>;
  exitProgress?: MotionValue<number>;
  handoff?: boolean;
}) {
  const [activeService, setActiveService] = useState(0);
  const [isOverText, setIsOverText] = useState(false);
  const [isOverBracket, setIsOverBracket] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);

  const textHoverCounter = useRef(0);
  const bracketHoverCounter = useRef(0);

  const handleTextEnter = useCallback(() => {
    textHoverCounter.current += 1;
    setIsOverText(true);
  }, []);

  const handleTextLeave = useCallback(() => {
    textHoverCounter.current = Math.max(0, textHoverCounter.current - 1);
    if (textHoverCounter.current === 0) {
      setIsOverText(false);
    }
  }, []);

  const handleBracketEnter = useCallback(() => {
    bracketHoverCounter.current += 1;
    setIsOverBracket(true);
  }, []);

  const handleBracketLeave = useCallback(() => {
    bracketHoverCounter.current = Math.max(0, bracketHoverCounter.current - 1);
    if (bracketHoverCounter.current === 0) {
      setIsOverBracket(false);
    }
  }, []);

  const prefersReduced = useReducedMotion();

  const internalTrackRef = useRef<HTMLDivElement>(null);
  const scrollTrackRef = trackRef ?? internalTrackRef;
  const stickySectionRef = useRef<HTMLElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);

  // Scroll tracking for the pinned services scene. Homepage hands in its own
  // progress so the horizontal exit can share the same track.
  const { scrollYProgress } = useScroll({
    target: scrollTrackRef,
    offset: ["start start", "end end"],
  });

  const sprungProgress = useSpring(scrollYProgress, {
    stiffness: 50,
    damping: 20,
    mass: 0.8,
    restDelta: 0.0005,
  });
  const smoothProgress = progress ?? sprungProgress;

  const Heading = standalone ? "h1" : "h2";

  // Check window breakpoint & mount state
  useEffect(() => {
    setIsMounted(true);

    const checkDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024);
    };

    checkDesktop();
    window.addEventListener("resize", checkDesktop, { passive: true });
    return () => window.removeEventListener("resize", checkDesktop);
  }, []);

  // Cursor following video physics (smooth lerp with inertia)
  const posRef = useRef({
    currentX: 240,
    currentY: 520,
    targetX: 240,
    targetY: 520,
    hasMoved: false,
  });
  const videoDepartRef = useRef(0);
  const motionEnabledRef = useRef(false);

  useEffect(() => {
    if (!isDesktop) return;

    const section = stickySectionRef.current;
    if (!section) return;

    const updateDefaultPos = () => {
      const rect = section.getBoundingClientRect();
      const defaultX = Math.min(260, rect.width * 0.22);
      const defaultY = Math.max(rect.height - 180, 260);
      if (!posRef.current.hasMoved) {
        posRef.current.currentX = defaultX;
        posRef.current.currentY = defaultY;
        posRef.current.targetX = defaultX;
        posRef.current.targetY = defaultY;
      }
    };
    updateDefaultPos();

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = section.getBoundingClientRect();
      const padX = Math.min(180, rect.width * 0.18);
      const padY = Math.min(110, rect.height * 0.15);
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      posRef.current.targetX = Math.max(padX, Math.min(rect.width - padX, mouseX));
      posRef.current.targetY = Math.max(padY, Math.min(rect.height - padY, mouseY));
      posRef.current.hasMoved = true;
    };

    const handlePointerLeave = () => {
      textHoverCounter.current = 0;
      bracketHoverCounter.current = 0;
      setIsOverText(false);
      setIsOverBracket(false);
      const rect = section.getBoundingClientRect();
      posRef.current.targetX = Math.min(260, rect.width * 0.22);
      posRef.current.targetY = Math.max(rect.height - 180, 260);
      posRef.current.hasMoved = false;
    };

    section.addEventListener("pointermove", handlePointerMove, { passive: true });
    section.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    window.addEventListener("resize", updateDefaultPos);

    let animationFrameId: number;
    const LERP_FACTOR = 0.12;

    const render = () => {
      const p = posRef.current;
      const dx = p.targetX - p.currentX;
      const dy = p.targetY - p.currentY;

      p.currentX += dx * LERP_FACTOR;
      p.currentY += dy * LERP_FACTOR;

      if (videoWrapRef.current) {
        const travel = motionEnabledRef.current ? glide(segment(videoDepartRef.current, 0.04, 0.42)) : 0;
        const fade = travel <= 0.55 ? 1 : 1 - silk((travel - 0.55) / 0.45);
        const shift = -travel * window.innerWidth * 0.92;
        videoWrapRef.current.style.transform = `translate3d(${p.currentX + shift}px, ${p.currentY}px, 0) translate(-50%, -50%)`;
        videoWrapRef.current.style.opacity = motionEnabledRef.current ? String(fade) : "";
        videoWrapRef.current.style.transition = travel > 0 ? "none" : "";
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(animationFrameId);
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("resize", updateDefaultPos);
    };
  }, [isDesktop]);

  const animationsEnabled = isMounted && isDesktop && !prefersReduced;

  // The service bar eases open instead of cutting across.
  const stripClipPath = useTransform(smoothProgress, (value) => {
    const eased = silk(segment(value, 0.02, 0.14));
    return `inset(0% ${(1 - eased) * 100}% 0% 0%)`;
  });
  const stripOpacity = useTransform(smoothProgress, (value) => silk(segment(value, 0.02, 0.1)));
  const stripX = useTransform(smoothProgress, (value) => -24 * (1 - silk(segment(value, 0.02, 0.14))));

  const fbOpacity = useTransform(smoothProgress, (value) => silk(segment(value, 0.74, 0.84)));
  const fbY = useTransform(smoothProgress, (value) => 12 * (1 - silk(segment(value, 0.74, 0.84))));

  const rnOpacity = useTransform(smoothProgress, (value) => silk(segment(value, 0.78, 0.88)));
  const rnY = useTransform(smoothProgress, (value) => 12 * (1 - silk(segment(value, 0.78, 0.88))));

  const igOpacity = useTransform(smoothProgress, (value) => silk(segment(value, 0.82, 0.92)));
  const igY = useTransform(smoothProgress, (value) => 12 * (1 - silk(segment(value, 0.82, 0.92))));

  const quoteOpacity = useTransform(smoothProgress, (value) => silk(segment(value, 0.86, 0.96)));
  const quoteY = useTransform(smoothProgress, (value) => 12 * (1 - silk(segment(value, 0.86, 0.96))));

  const idleExit = useMotionValue(0);
  const depart = exitProgress ?? idleExit;
  useMotionValueEvent(depart, "change", (value) => {
    videoDepartRef.current = value;
  });
  useEffect(() => {
    motionEnabledRef.current = animationsEnabled;
  }, [animationsEnabled]);
  const stripBarExit = useDepart(depart, 0.05, 0.34, 132);
  const facebookExit = useDepart(depart, 0.5, 0.78, 104);
  const rednoteExit = useDepart(depart, 0.56, 0.84, 104);
  const instagramExit = useDepart(depart, 0.62, 0.9, 104);
  const quoteExit = useDepart(depart, 0.68, 0.96, 112);

  // Render media frame. Desktop pointer movement smears the picture; touch keeps the video.
  const renderMediaFrame = (key: string) => (
    <div key={key} className={styles.mediaFrame}>
      <video className={styles.mediaVideo} autoPlay muted loop playsInline preload="metadata" poster="/brand/mars-horizon.webp" src="https://s3.amazonaws.com/webflow-prod-assets/69f205b0a0439779a1d746f7/6a023cc07c5866c024c8055a_Hero_section_About_Us_01.mp4" aria-hidden="true" />

      {/* Optical Reticle Crosshair */}
      <div className={styles.mediaReticle} aria-hidden="true">
        <span className={styles.reticleTickH} />
        <span className={styles.reticleTickV} />
        <span className={styles.reticleDot} />
      </div>
    </div>
  );

  return (
    <div ref={scrollTrackRef} className={`${styles.scrollTrack} ${handoff ? styles.scrollTrackHandoff : ""}`}>
      <section
        ref={stickySectionRef}
        id="services"
        data-theme="light"
        className={styles.stickySection}
        aria-labelledby="services-title"
      >
        <div className={styles.plane}>
        {/* 1. Organic Fluid Lava Lamp Moving Background (Option A: Light theme) */}
        <div className={styles.lavaLamp} aria-hidden="true">
          <div className={styles.lavaBg}>
            <div className={styles.blob} />
            <div className={styles.blob} />
            <div className={styles.blob} />
            <div className={styles.blob} />
            <div className={styles.blob} />
          </div>
        </div>

        {/* 2. Desktop Cursor-Following Floating Video Box */}
        {/* Disappears when hovering any [...] bracket elements; activates difference mode over text */}
        <div
          ref={videoWrapRef}
          className={`${styles.cursorVideoWrap} ${isOverText ? styles.blendDifference : ""} ${isOverBracket ? styles.videoHidden : ""}`}
          aria-hidden="true"
        >
          {renderMediaFrame("cursor-media")}
        </div>

        {/* 3. Structured Content Layout Layer */}
        <div className={styles.contentLayer}>
          {/* Top: Upper-Right Narrative Lead */}
          <div className={styles.topSection}>
            <div
              className={styles.narrativeBlock}
              onMouseEnter={handleTextEnter}
              onMouseLeave={handleTextLeave}
            >
              <div className={styles.narrativeLead}>
                <NarrativeLine lineIndex={0} scrollYProgress={smoothProgress} depart={depart} enabled={animationsEnabled}>
                  At NO SMALL THING, every project is guided by three minds with
                </NarrativeLine>
                <NarrativeLine lineIndex={1} scrollYProgress={smoothProgress} depart={depart} enabled={animationsEnabled}>
                  one shared ambition.
                </NarrativeLine>
              </div>
              <div className={styles.narrativeBody}>
                <NarrativeLine lineIndex={2} scrollYProgress={smoothProgress} depart={depart} enabled={animationsEnabled}>
                  We partner with forward-thinking businesses, founders, and teams to build purposeful
                </NarrativeLine>
                <NarrativeLine lineIndex={3} scrollYProgress={smoothProgress} depart={depart} enabled={animationsEnabled}>
                  digital solutions across AI, custom software, UI/UX, and web development. Combining
                </NarrativeLine>
                <NarrativeLine lineIndex={4} scrollYProgress={smoothProgress} depart={depart} enabled={animationsEnabled}>
                  strategic foresight with hands-on technical craftsmanship.
                </NarrativeLine>
              </div>
              <div className={styles.narrativeKicker}>
                <NarrativeLine lineIndex={5} scrollYProgress={smoothProgress} depart={depart} enabled={animationsEnabled}>
                  From AI integration and software engineering to bespoke websites and digital systems.
                </NarrativeLine>
              </div>
            </div>
          </div>

          {/* Middle: Full-bleed Horizontal Service Links Strip with left-to-right entrance */}
          <motion.div className={styles.stripDepart} style={animationsEnabled ? stripBarExit : undefined}>
          <motion.nav
            className={styles.linksStrip}
            aria-label="Core services list"
            style={{
              clipPath: animationsEnabled ? stripClipPath : undefined,
              opacity: animationsEnabled ? stripOpacity : 1,
              x: animationsEnabled ? stripX : 0,
            }}
            onMouseEnter={handleBracketEnter}
            onMouseLeave={handleBracketLeave}
          >
            {services.map((item, index) => (
              <ServiceStripButton
                key={item.number}
                depart={depart}
                index={index}
                enabled={animationsEnabled}
                selected={index === activeService}
                label={item.shortName}
                onSelect={() => setActiveService(index)}
              />
            ))}
          </motion.nav>
          </motion.div>

          {/* Bottom: Mobile Media Card + Right Massive Typography Headline */}
          <div className={styles.bottomSection}>
            {/* Mobile inline video fallback */}
            <div className={styles.mobileVideoCard}>
              {renderMediaFrame("mobile-media")}
            </div>

            {/* Right: Massive Typography Poster Headline & Interaction Target */}
            <div className={styles.rightHeadlineCol}>
              <div
                className={styles.headlineTarget}
                onMouseEnter={handleTextEnter}
                onMouseLeave={handleTextLeave}
              >
                <Heading
                  id="services-title"
                  className={styles.headline}
                  aria-label="WHAT WE DO. FOCUS BUILD WHAT MATTERS. Among THE STARS. AI & DIGITAL, DONE RIGHT."
                >
                  {/* Line 1: ®WHAT WE DO. (0.10 -> 0.19 -> 0.26) */}
                  <HeadlineRow
                    scrollYProgress={smoothProgress}
                    depart={depart}
                    lineIndex={0}
                    range={[0.10, 0.22, 0.32]}
                    enabled={animationsEnabled}
                  >
                    <span className={styles.regMark} aria-hidden="true">®</span>WHAT WE DO.
                  </HeadlineRow>

                  {/* Line 2: FOCUS BUILD WHAT MATTERS. (0.26 -> 0.35 -> 0.42) */}
                  <HeadlineRow
                    scrollYProgress={smoothProgress}
                    depart={depart}
                    lineIndex={1}
                    range={[0.26, 0.38, 0.48]}
                    enabled={animationsEnabled}
                  >
                    FOCUS BUILD WHAT MATTERS.
                  </HeadlineRow>

                  {/* Line 3: Among THE STARS (0.42 -> 0.51 -> 0.58) */}
                  <HeadlineRow
                    scrollYProgress={smoothProgress}
                    depart={depart}
                    lineIndex={2}
                    range={[0.42, 0.54, 0.64]}
                    enabled={animationsEnabled}
                  >
                    <span className={styles.serifWord}>Among</span> THE STARS
                  </HeadlineRow>

                  {/* Line 4: AI & DIGITAL, DONE RIGHT. (0.58 -> 0.67 -> 0.74) */}
                  <HeadlineRow
                    scrollYProgress={smoothProgress}
                    depart={depart}
                    lineIndex={3}
                    range={[0.56, 0.70, 0.82]}
                    enabled={animationsEnabled}
                  >
                    AI &amp; DIGITAL, DONE RIGHT.
                  </HeadlineRow>
                </Heading>
              </div>

              {/* Bottom Socials & Philosophy Statement (0.74 -> 0.88) */}
              <div className={styles.bottomEnd}>
                <div
                  className={styles.socialGroup}
                  aria-label="Social links"
                  onMouseEnter={handleBracketEnter}
                  onMouseLeave={handleBracketLeave}
                >
                  <motion.span className={styles.departItem} style={animationsEnabled ? facebookExit : undefined}>
                    <motion.a
                      href="https://facebook.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialBracketLink}
                      style={{
                        opacity: animationsEnabled ? fbOpacity : 1,
                        y: animationsEnabled ? fbY : 0,
                      }}
                      aria-label="Facebook (opens in new tab)"
                    >
                      <span className={`${styles.stripBracket} ${styles.bracketLeft}`} aria-hidden="true">[</span>
                      <span>FACEBOOK</span>
                      <span className={`${styles.stripBracket} ${styles.bracketRight}`} aria-hidden="true">]</span>
                    </motion.a>
                  </motion.span>

                  <motion.span className={styles.departItem} style={animationsEnabled ? rednoteExit : undefined}>
                    <motion.a
                      href="https://xiaohongshu.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialBracketLink}
                      style={{
                        opacity: animationsEnabled ? rnOpacity : 1,
                        y: animationsEnabled ? rnY : 0,
                      }}
                      aria-label="Rednote (opens in new tab)"
                    >
                      <span className={`${styles.stripBracket} ${styles.bracketLeft}`} aria-hidden="true">[</span>
                      <span>REDNOTE</span>
                      <span className={`${styles.stripBracket} ${styles.bracketRight}`} aria-hidden="true">]</span>
                    </motion.a>
                  </motion.span>

                  <motion.span className={styles.departItem} style={animationsEnabled ? instagramExit : undefined}>
                    <motion.a
                      href="https://instagram.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.socialBracketLink}
                      style={{
                        opacity: animationsEnabled ? igOpacity : 1,
                        y: animationsEnabled ? igY : 0,
                      }}
                      aria-label="Instagram (opens in new tab)"
                    >
                      <span className={`${styles.stripBracket} ${styles.bracketLeft}`} aria-hidden="true">[</span>
                      <span>IG</span>
                      <span className={`${styles.stripBracket} ${styles.bracketRight}`} aria-hidden="true">]</span>
                    </motion.a>
                  </motion.span>
                </div>

                <motion.div className={styles.departLine} style={animationsEnabled ? quoteExit : undefined}>
                  <motion.p
                    className={styles.endParagraph}
                    style={{
                      opacity: animationsEnabled ? quoteOpacity : 1,
                      y: animationsEnabled ? quoteY : 0,
                    }}
                    onMouseEnter={handleTextEnter}
                    onMouseLeave={handleTextLeave}
                  >
                    <span className={styles.dash}>— </span>
                    The first step is to establish that something is possible then probability will occur.{" "}
                    <strong className={styles.endHighlight}>From idea to execution.</strong>
                  </motion.p>
                </motion.div>
              </div>
            </div>
          </div>
        </div>
        </div>
      </section>
    </div>
  );
}
