"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import gsap from "gsap";

const LOGOS = [
  { name: "Airbnb", src: "/marketing-assets/images/logos/airbnb-logo.png", width: 4320, height: 1348 },
  { name: "Netflix", src: "/marketing-assets/images/logos/netflix-logo.png", width: 2049, height: 555 },
  { name: "Canva", src: "/marketing-assets/images/logos/canva-logo.png", width: 3793, height: 1216 },
  { name: "Sony Music", src: "/marketing-assets/images/logos/sony-music-logo.png", width: 1843, height: 141 },
  { name: "AG1", src: "/marketing-assets/images/logos/ag1-logo.png", width: 2402, height: 1074 },
  { name: "Pinterest", src: "/marketing-assets/images/logos/pinterest-logo.png", width: 1734, height: 1735 },
  { name: "Urban Outfitters", src: "/marketing-assets/images/logos/urban-outfitters-logo.png", width: 4839, height: 527 },
  { name: "SpaceX", src: "/marketing-assets/images/logos/spacex-logo.png", width: 2460, height: 304 },
  { name: "Lyft", src: "/marketing-assets/images/logos/lyft-logo.png", width: 1601, height: 1094 },
  { name: "Crocs", src: "/marketing-assets/images/logos/crocs-wordmark-logo.png", width: 400, height: 98 },
  { name: "Seed", src: "/marketing-assets/images/logos/seed-logo.png", width: 400, height: 144 },
  { name: "Mejuri", src: "/marketing-assets/images/logos/mejuri-logo.png", width: 2466, height: 425 },
  { name: "DoorDash", src: "/marketing-assets/images/logos/doordash-logo.png", width: 2711, height: 316 },
  { name: "Mercedes-Benz", src: "/marketing-assets/images/logos/mercedes-benz-logo.png", width: 1668, height: 1668 },
  { name: "Disney", src: "/marketing-assets/images/logos/disney-logo.png", width: 1385, height: 573 },
  { name: "Eight Sleep", src: "/marketing-assets/images/logos/eight-sleep-logo.png", width: 1871, height: 754 },
  { name: "The Atlantic", src: "/marketing-assets/images/logos/the-atlantic-logo.png", width: 6187, height: 962 },
  { name: "Ritual", src: "/marketing-assets/images/logos/ritual-wordmark-logo.png", width: 400, height: 147 },
  { name: "IDEO", src: "/marketing-assets/images/logos/ideo-wordmark-logo.png", width: 400, height: 117 },
  { name: "Hims & Hers", src: "/marketing-assets/images/logos/hims-amp-hers-logo.png", width: 6832, height: 1340 },
  { name: "Harry's", src: "/marketing-assets/images/logos/harry-s-logo.png", width: 4611, height: 819 },
  { name: "Grüns", src: "/marketing-assets/images/logos/gr-ns-logo.png", width: 3382, height: 1268 },
  { name: "Olipop", src: "/marketing-assets/images/logos/olipop-logo.png", width: 2683, height: 1046 },
  { name: "Olly", src: "/marketing-assets/images/logos/olly-logo.png", width: 1846, height: 616 },
];

const STATEMENT_BLOCKS = [
  {
    src: "/marketing-assets/images/statement/home-icons/py.png",
    alt: "Py icon",
  },
  {
    src: "/marketing-assets/images/statement/home-icons/ai.png",
    alt: "AI icon",
  },
  {
    src: "/marketing-assets/images/statement/home-icons/flower.png",
    alt: "Daisy flower",
  },
  {
    src: "/marketing-assets/images/statement/home-icons/n-coin.png",
    alt: "N coin icon",
  },
  {
    src: "/marketing-assets/images/statement/home-icons/keyboard.png",
    alt: "Keyboard keys",
  },
];

const FUTURE_INFLATE_LETTERS = [
  { char: "f", src: "/marketing-assets/images/text-effects/inflate/f.png", width: 122, height: 187, className: "story-inflate-f", percent: 16.35 },
  { char: "u", src: "/marketing-assets/images/text-effects/inflate/u.png", width: 127, height: 148, className: "story-inflate-u1", percent: 17.02 },
  { char: "t", src: "/marketing-assets/images/text-effects/inflate/t.png", width: 111, height: 175, className: "story-inflate-t", percent: 14.88 },
  { char: "u", src: "/marketing-assets/images/text-effects/inflate/u.png", width: 127, height: 148, className: "story-inflate-u2", percent: 17.02 },
  { char: "r", src: "/marketing-assets/images/text-effects/inflate/r.png", width: 130, height: 148, className: "story-inflate-r", percent: 17.43 },
  { char: "e", src: "/marketing-assets/images/text-effects/inflate/e.png", width: 129, height: 148, className: "story-inflate-e", percent: 17.30 },
];

const AI_INFLATE_LETTERS = [
  { char: "A", src: "/marketing-assets/images/text-effects/inflate/a.png", width: 179, height: 186, className: "story-inflate-a", percent: 59.67 },
  { char: "I", src: "/marketing-assets/images/text-effects/inflate/i.png", width: 121, height: 186, className: "story-inflate-i", percent: 40.33 },
];

const INFLATE_LETTERS = [
  { char: "b", src: "/marketing-assets/images/text-effects/inflate/b.png", width: 139, height: 187, className: "dSFIkm", percent: 19.6 },
  { char: "l", src: "/marketing-assets/images/text-effects/inflate/l.png", width: 61, height: 186, className: "hBBHrG", percent: 8.6 },
  { char: "o", src: "/marketing-assets/images/text-effects/inflate/o.png", width: 133, height: 147, className: "bZXNyl", percent: 18.8 },
  { char: "c", src: "/marketing-assets/images/text-effects/inflate/c.png", width: 123, height: 149, className: "ipkyZC", percent: 17.4 },
  { char: "k", src: "/marketing-assets/images/text-effects/inflate/k.png", width: 130, height: 187, className: "PyBAF", percent: 18.4 },
  { char: "s", src: "/marketing-assets/images/text-effects/inflate/s.png", width: 122, height: 149, className: "jtEPpI", percent: 17.2 },
];

const TEXT_EFFECT_ITEMS = [
  { id: "inflate", label: "Inflate", image: "/marketing-assets/images/text-effects/inflate.png" },
  { id: "glow", label: "Glow", image: "/marketing-assets/images/text-effects/glow.png" },
  { id: "focus", label: "Focus", image: "/marketing-assets/images/text-effects/focus.png" },
  { id: "halftone", label: "Halftone", image: "/marketing-assets/images/text-effects/halftone.png" },
];

export function ButterServices() {
  // =========================================================================
  // 1. Ticker Section State & Animation
  // =========================================================================
  const tickerSectionRef = useRef<HTMLElement>(null);
  const tickerWrapperRef = useRef<HTMLDivElement>(null);
  const tickerLogosRef = useRef<HTMLDivElement>(null);
  const tickerTweenRef = useRef<gsap.core.Tween | null>(null);
  const [tickerInView, setTickerInView] = useState(false);
  const [repeatCount, setRepeatCount] = useState(2);

  // Compute necessary repetitions for seamless infinite looping on wide screens
  useEffect(() => {
    const updateRepeat = () => {
      const wrapper = tickerWrapperRef.current;
      const el = tickerLogosRef.current;
      if (!wrapper || !el) return;
      const singleSetWidth = LOGOS.length * 270; // approx logo + gap
      const viewportW = typeof window !== "undefined" ? window.innerWidth : 0;
      const containerW = Math.max(wrapper.clientWidth, viewportW);
      const needed = Math.max(Math.ceil((2.8 * containerW) / singleSetWidth), 2);
      setRepeatCount((prev) => (prev !== needed ? needed : prev));
    };

    updateRepeat();

    let debounceTimer: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.resize();
      }
      updateRepeat();
      if (debounceTimer) clearTimeout(debounceTimer);
      debounceTimer = setTimeout(updateRepeat, 150);
    };

    window.addEventListener("resize", handleResize);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && tickerWrapperRef.current) {
      ro = new ResizeObserver(() => {
        handleResize();
      });
      ro.observe(tickerWrapperRef.current);
    }

    return () => {
      window.removeEventListener("resize", handleResize);
      if (debounceTimer) clearTimeout(debounceTimer);
      ro?.disconnect();
    };
  }, []);

  // IntersectionObserver for ticker entrance animation and visibility
  useEffect(() => {
    const sec = tickerSectionRef.current;
    if (!sec) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          setTickerInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: "100px 0px" }
    );
    observer.observe(sec);

    // Fallback timer ensures logos are always visible even without scroll
    const fallbackTimer = setTimeout(() => {
      setTickerInView(true);
    }, 600);

    return () => {
      observer.disconnect();
      clearTimeout(fallbackTimer);
    };
  }, []);

  // GSAP Ticker animation & Lenis scroll velocity speedup
  useEffect(() => {
    const el = tickerLogosRef.current;
    if (!el) return;

    let targetTimeScale = 1;
    let currentTimeScale = 1;
    let lastScrollY = window.scrollY;
    let lastTime = performance.now();

    const tween = gsap.fromTo(
      el,
      { xPercent: 0 },
      {
        xPercent: -100 / repeatCount,
        ease: "none",
        duration: 1.5 * LOGOS.length,
        repeat: -1,
      }
    );
    tickerTweenRef.current = tween;

    // Lenis velocity integration
    const onLenisScroll = (e: { velocity: number }) => {
      targetTimeScale = 1 + Math.min(Math.abs(e.velocity) * 0.02, 2.5);
    };
    if (typeof window !== "undefined" && window.__lenis) {
      window.__lenis.on("scroll", onLenisScroll);
    }

    // Native scroll fallback
    const onScroll = () => {
      const now = performance.now();
      const dt = Math.max(now - lastTime, 16);
      const dy = window.scrollY - lastScrollY;
      lastScrollY = window.scrollY;
      lastTime = now;
      const velocity = Math.abs(dy / dt);
      targetTimeScale = 1 + Math.min(velocity * 1.5, 2.5);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    // Hover pause integration
    let isHovered = false;
    const onMouseEnter = () => {
      isHovered = true;
    };
    const onMouseLeave = () => {
      isHovered = false;
    };
    const wrapper = tickerWrapperRef.current;
    if (wrapper) {
      wrapper.addEventListener("mouseenter", onMouseEnter);
      wrapper.addEventListener("mouseleave", onMouseLeave);
    }

    const tick = () => {
      const baseTarget = isHovered ? 0 : targetTimeScale;
      currentTimeScale += (baseTarget - currentTimeScale) * 0.08;
      targetTimeScale += (1 - targetTimeScale) * 0.04;
      tween.timeScale(Math.max(currentTimeScale, 0));
    };

    let tickerRunning = false;
    const startTicker = () => {
      if (tickerRunning) return;
      tickerRunning = true;
      tween.play();
      gsap.ticker.add(tick);
    };
    const stopTicker = () => {
      if (!tickerRunning) return;
      tickerRunning = false;
      gsap.ticker.remove(tick);
      tween.pause();
    };

    const tickerTarget = tickerSectionRef.current ?? el;
    const tickerObserver = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) startTicker();
        else stopTicker();
      },
      { rootMargin: "180px 0px" }
    );
    tickerObserver.observe(tickerTarget);

    return () => {
      if (wrapper) {
        wrapper.removeEventListener("mouseenter", onMouseEnter);
        wrapper.removeEventListener("mouseleave", onMouseLeave);
      }
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.off("scroll", onLenisScroll);
      }
      window.removeEventListener("scroll", onScroll);
      tickerObserver.disconnect();
      gsap.ticker.remove(tick);
      tween.kill();
    };
  }, [repeatCount]);

  const displayLogos = useMemo(() => {
    return Array.from({ length: LOGOS.length * repeatCount }, (_, i) => LOGOS[i % LOGOS.length]);
  }, [repeatCount]);

  // =========================================================================
  // 2. Statement-Timeline FLIP Animation
  // =========================================================================
  const statementContainerRef = useRef<HTMLDivElement>(null);
  const timelineContainerRef = useRef<HTMLDivElement>(null);
  const statementWrappersRef = useRef<(HTMLDivElement | null)[]>([]);
  const timelineWrappersRef = useRef<(HTMLDivElement | null)[]>([]);
  const blockElementsRef = useRef<(HTMLDivElement | null)[]>([]);
  const isInTimelineRef = useRef(false);
  const hasEnteredRef = useRef(false);
  const timelineAnimRef = useRef<gsap.core.Timeline | null>(null);
  const entranceBounceAnimRef = useRef<gsap.core.Tween | null>(null);

  const getBlockTransform = useCallback((sEl: HTMLElement, tEl: HTMLElement, inTimeline: boolean) => {
    if (inTimeline) {
      return { scale: 1, x: 0, y: 0 };
    }
    const sRect = sEl.getBoundingClientRect();
    const tRect = tEl.getBoundingClientRect();
    if (tRect.width === 0) return { scale: 1, x: 0, y: 0 };
    const scale = sRect.width / tRect.width;
    const x = sRect.left - tRect.left + (sRect.width - tRect.width) / 2;
    const y = sRect.top - tRect.top + (sRect.height - tRect.height) / 2;
    return { scale, x, y };
  }, []);

  const updateBlockPositions = useCallback(() => {
    const inTimeline = isInTimelineRef.current;
    blockElementsRef.current.forEach((block, idx) => {
      if (!block) return;
      if (inTimeline) {
        gsap.killTweensOf(block);
        gsap.set(block, { scale: 1, x: 0, y: 0, rotation: 0 });
      } else {
        const sEl = statementWrappersRef.current[idx];
        const tEl = timelineWrappersRef.current[idx];
        if (sEl && tEl) {
          const { scale, x, y } = getBlockTransform(sEl, tEl, false);
          gsap.killTweensOf(block);
          gsap.set(block, { scale, x, y, rotation: 0 });
        }
      }
    });
  }, [getBlockTransform]);

  useEffect(() => {
    let isMounted = true;

    // Initial placement after layout paints and after fonts finish loading
    const initialTimer = setTimeout(() => {
      if (isMounted) updateBlockPositions();
    }, 40);

    if (typeof document !== "undefined" && "fonts" in document) {
      document.fonts.ready.then(() => {
        if (isMounted) updateBlockPositions();
      });
    }

    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    let resizeRafId: number | null = null;

    const handleResize = () => {
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.resize();
      }

      if (resizeRafId) cancelAnimationFrame(resizeRafId);
      resizeRafId = requestAnimationFrame(() => {
        if (!isMounted) return;
        updateBlockPositions();
      });

      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!isMounted) return;
        if (typeof window !== "undefined" && window.__lenis) {
          window.__lenis.resize();
        }

        const tCont = timelineContainerRef.current;
        if (tCont) {
          const tRect = tCont.getBoundingClientRect();
          const windowH = window.innerHeight;
          if (tRect.top <= windowH * 0.88) {
            isInTimelineRef.current = true;
          } else if (tRect.top > windowH * 0.92) {
            isInTimelineRef.current = false;
          }
        }

        timelineAnimRef.current?.kill();
        updateBlockPositions();
        onScroll();
      }, 100);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        handleResize();
      });
      if (statementContainerRef.current) ro.observe(statementContainerRef.current);
      if (timelineContainerRef.current) ro.observe(timelineContainerRef.current);
    }

    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const sCont = statementContainerRef.current;
      const tCont = timelineContainerRef.current;
      if (!sCont || !tCont) return;

      const sRect = sCont.getBoundingClientRect();
      const tRect = tCont.getBoundingClientRect();
      const windowH = window.innerHeight;
      const farAbove = sRect.bottom < -windowH * 0.25 && tRect.bottom < -windowH * 0.25;
      const farBelow = sRect.top > windowH * 1.25 && tRect.top > windowH * 1.25;
      if (farAbove || farBelow) return;

      const curScrollY = window.scrollY;
      const isScrollingDown = curScrollY >= lastScrollY;
      lastScrollY = curScrollY;

      // Drop entrance bounce for block 0 (animate inner block without disturbing slot positioning)
      if (!hasEnteredRef.current && sRect.top < windowH * 0.85 && !isInTimelineRef.current) {
        hasEnteredRef.current = true;
        const firstBlock = blockElementsRef.current[0];
        const firstInner = firstBlock?.firstElementChild;
        if (firstInner) {
          entranceBounceAnimRef.current?.kill();
          entranceBounceAnimRef.current = gsap.from(firstInner, {
            y: "-260px",
            rotation: 15,
            duration: 1.1,
            ease: "power2.out",
          });
        }
      }

      // Hysteresis threshold: trigger early at windowH * 0.88 so icons take flight early under fast scroll
      let shouldBeInTimeline = isInTimelineRef.current;
      if (isScrollingDown) {
        if (tRect.top <= windowH * 0.88) {
          shouldBeInTimeline = true;
        }
      } else {
        if (tRect.top > windowH * 0.92) {
          shouldBeInTimeline = false;
        }
      }

      if (shouldBeInTimeline && !isInTimelineRef.current) {
        isInTimelineRef.current = true;
        timelineAnimRef.current?.kill();
        const tl = gsap.timeline();
        timelineAnimRef.current = tl;
        blockElementsRef.current.forEach((block, idx) => {
          if (!block) return;
          const stagger = idx * 0.035;
          tl.to(
            block,
            {
              scale: 1,
              x: 0,
              y: 0,
              duration: 0.52,
              ease: "power2.out",
            },
            stagger
          );
          tl.to(
            block,
            {
              rotation: 12 * (idx % 2 === 0 ? 1 : -1),
              duration: 0.26,
              ease: "power2.in",
            },
            stagger
          );
          tl.to(
            block,
            {
              rotation: 0,
              duration: 0.26,
              ease: "power2.out",
            },
            stagger + 0.26
          );
        });
      } else if (!shouldBeInTimeline && isInTimelineRef.current) {
        isInTimelineRef.current = false;
        timelineAnimRef.current?.kill();
        const tl = gsap.timeline();
        timelineAnimRef.current = tl;
        blockElementsRef.current.forEach((block, idx) => {
          if (!block) return;
          const sEl = statementWrappersRef.current[idx];
          const tEl = timelineWrappersRef.current[idx];
          if (!sEl || !tEl) return;
          const { scale, x, y } = getBlockTransform(sEl, tEl, false);
          const stagger = idx * 0.03;

          tl.to(
            block,
            {
              scale,
              x,
              y,
              duration: 0.5,
              ease: "power2.out ",
            },
            stagger
          );
          tl.to(
            block,
            {
              rotation: 12 * (idx % 2 === 0 ? -1 : 1),
              duration: 0.25,
              ease: "power2.in",
            },
            stagger
          );
          tl.to(
            block,
            {
              rotation: 0,
              duration: 0.25,
              ease: "power2.out",
            },
            stagger + 0.25
          );
        });
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    if (typeof window !== "undefined" && window.__lenis) {
      window.__lenis.on("scroll", onScroll);
    }
    onScroll();

    return () => {
      isMounted = false;
      clearTimeout(initialTimer);
      if (resizeTimer) clearTimeout(resizeTimer);
      if (resizeRafId) cancelAnimationFrame(resizeRafId);
      ro?.disconnect();
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", onScroll);
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.off("scroll", onScroll);
      }
      timelineAnimRef.current?.kill();
      entranceBounceAnimRef.current?.kill();
    };
  }, [getBlockTransform, updateBlockPositions]);

  // =========================================================================
  // 3. StoryOne Text Effects State & Interactions
  // =========================================================================
  const [pinnedEffect, setPinnedEffect] = useState<string | null>(null);
  const [hoveredEffect, setHoveredEffect] = useState<string | null>(null);
  const activeEffect = hoveredEffect || pinnedEffect;

  const futureInflateLettersRef = useRef<(HTMLImageElement | null)[]>([]);
  const aiInflateLettersRef = useRef<(HTMLImageElement | null)[]>([]);
  const inflateLettersRef = useRef<(HTMLImageElement | null)[]>([]);
  const futureLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const aiLettersRef = useRef<(HTMLSpanElement | null)[]>([]);
  const buildingWordRef = useRef<HTMLSpanElement | null>(null);
  const whereWordRef = useRef<HTMLSpanElement | null>(null);
  const theWordRef = useRef<HTMLSpanElement | null>(null);
  const isWordRef = useRef<HTMLSpanElement | null>(null);
  const charSpansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const halftoneVideoRef = useRef<HTMLVideoElement | null>(null);

  const hasEverAnimatedInflateRef = useRef(false);

  // Focus effect: progressive optical camera blur ramp radiating out from keywords
  useEffect(() => {
    const isFocus = activeEffect === "focus";
    const chars = charSpansRef.current.filter((c): c is HTMLSpanElement => Boolean(c));
    if (!chars.length) return;

    if (isFocus) {
      const tl = gsap.timeline({ defaults: { duration: 0.8, ease: "power2.out" } });
      tl.to(chars, {
        filter: (_i, target) => {
          const charIdx = parseInt(target.getAttribute("data-char-idx") || "0", 10);
          let dist = 0;
          if (charIdx < 9) dist = 9 - charIdx;
          else if (charIdx <= 14) dist = 0; // "future" (9..14)
          else if (charIdx < 52) dist = Math.min(charIdx - 14, 52 - charIdx);
          else if (charIdx <= 53) dist = 0; // "AI" (52..53)
          else dist = charIdx - 53;

          const blurVal = dist === 0 ? 0 : Math.min(Math.pow(dist, 0.85) * 0.45, 8);
          return `blur(${blurVal.toFixed(1)}px)`;
        },
        stagger: {
          each: 0.005,
          from: "start",
        },
      });
      return () => {
        tl.kill();
        gsap.killTweensOf(chars);
      };
    } else {
      const tween = gsap.to(chars, {
        filter: "blur(0px)",
        duration: 0.45,
        ease: "power2.out",
        overwrite: "auto",
      });
      return () => {
        tween.kill();
      };
    }
  }, [activeEffect]);

  // Inflate effect: 3D bounce letters & adjacent word push matching Butter 1:1
  useEffect(() => {
    const isInflate = activeEffect === "inflate";
    const futureInflateLetters = futureInflateLettersRef.current.filter((l): l is HTMLImageElement => Boolean(l));
    const aiInflateLetters = aiInflateLettersRef.current.filter((l): l is HTMLImageElement => Boolean(l));
    const allInflateLetters = [...futureInflateLetters, ...aiInflateLetters];
    const wordBuilding = buildingWordRef.current;
    const wordWhere = whereWordRef.current;
    const wordThe = theWordRef.current;
    const wordIs = isWordRef.current;

    if (!isInflate && !hasEverAnimatedInflateRef.current) {
      return;
    }
    hasEverAnimatedInflateRef.current = true;

    const duration = isInflate ? 0.8 : 0.4;
    const ease = isInflate ? "back.out(1)" : "power2.out";
    const tl = gsap.timeline();

    gsap.killTweensOf(allInflateLetters);
    if (wordBuilding) gsap.killTweensOf(wordBuilding);
    if (wordWhere) gsap.killTweensOf(wordWhere);
    if (wordThe) gsap.killTweensOf(wordThe);
    if (wordIs) gsap.killTweensOf(wordIs);

    // Staggered letter inflate bounce and random rotation matching Butter 1:1
    futureInflateLetters.forEach((el, idx) => {
      const delay = 0.02 * idx;
      const rot = 40 * Math.random() - 20;
      tl.to(
        el,
        {
          scale: isInflate ? 1 : 0,
          duration,
          ease,
        },
        delay
      );
      tl.fromTo(
        el,
        { rotate: isInflate ? rot : 0 },
        { rotate: isInflate ? 0 : rot, duration, ease },
        delay
      );
    });

    aiInflateLetters.forEach((el, idx) => {
      const delay = 0.02 * idx;
      const rot = 40 * Math.random() - 20;
      tl.to(
        el,
        {
          scale: isInflate ? 1 : 0,
          duration,
          ease,
        },
        delay
      );
      tl.fromTo(
        el,
        { rotate: isInflate ? rot : 0 },
        { rotate: isInflate ? 0 : rot, duration, ease },
        delay
      );
    });

    // Adjacent words push spacing matching Butter 1:1 (-0.15em / +0.15em)
    const halfDur = 0.5 * duration;
    if (wordBuilding) {
      tl.to(
        wordBuilding,
        {
          x: isInflate ? "-0.15em" : 0,
          duration: halfDur,
          ease,
        },
        0.1
      );
    }

    if (wordWhere) {
      tl.to(
        wordWhere,
        {
          x: isInflate ? "0.15em" : 0,
          duration: halfDur,
          ease,
        },
        0.02 * futureInflateLetters.length + 0.1
      );
    }

    if (wordThe) {
      tl.to(
        wordThe,
        {
          x: isInflate ? "-0.15em" : 0,
          duration: halfDur,
          ease,
        },
        0.1
      );
    }

    if (wordIs) {
      tl.to(
        wordIs,
        {
          x: isInflate ? "0.15em" : 0,
          duration: halfDur,
          ease,
        },
        0.02 * aiInflateLetters.length + 0.1
      );
    }

    return () => {
      tl.kill();
      gsap.killTweensOf(allInflateLetters);
      if (wordBuilding) gsap.killTweensOf(wordBuilding);
      if (wordWhere) gsap.killTweensOf(wordWhere);
      if (wordThe) gsap.killTweensOf(wordThe);
      if (wordIs) gsap.killTweensOf(wordIs);
    };
  }, [activeEffect]);

  // Halftone effect: video playback toggle
  useEffect(() => {
    const video = halftoneVideoRef.current;
    if (!video) return;

    if (activeEffect === "halftone") {
      video.currentTime = 0;
      video.play().catch(() => {});
    } else {
      video.pause();
    }

    return () => {
      video.pause();
    };
  }, [activeEffect]);

  const handleCardClick = (id: string) => {
    setPinnedEffect((prev) => (prev === id ? null : id));
  };

  const handleResetEffects = () => {
    setPinnedEffect(null);
    setHoveredEffect(null);
  };

  // Helper to render a word as animated characters with individual index tracking
  const renderWord = (word: string, startIdx: number, ref?: React.RefObject<HTMLSpanElement | null>) => (
    <span ref={ref} className="story-word">
      {word.split("").map((c, i) => {
        const idx = startIdx + i;
        return (
          <span
            key={idx}
            data-char-idx={idx}
            ref={(el) => {
              charSpansRef.current[idx] = el;
            }}
            className="story-char"
          >
            {c}
          </span>
        );
      })}
    </span>
  );

  return (
    <section id="services" data-theme="light" className="butter-part2-root">
      {/* 0. SVG squircle clipPath for butter cards and blocks */}
      <svg viewBox="0 0 200 200" style={{ position: "absolute", width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <clipPath id="squircle" clipPathUnits="objectBoundingBox">
            <path d="M 0.5 0 c 0.2251 0 0.3477 0 0.4238 0.0762 a 0.2600 0.2600 0 0 1 0.0000 0.0000 c 0.0762 0.0762 0.0762 0.1987 0.0762 0.4238 L 1 0.5 c 0 0.2251 0 0.3477 -0.0762 0.4238 a 0.2600 0.2600 0 0 1 -0.0000 0.0000 c -0.0762 0.0762 -0.1987 0.0762 -0.4238 0.0762 L 0.5 1 c -0.2251 0 -0.3477 0 -0.4238 -0.0762 a 0.2600 0.2600 0 0 1 -0.0000 -0.0000 c -0.0762 -0.0762 -0.0762 -0.1987 -0.0762 -0.4238 L 0 0.5 c 0 -0.2251 0 -0.3477 0.0762 -0.4238 a 0.2600 0.2600 0 0 1 0.0000 -0.0000 c 0.0762 -0.0762 0.1987 -0.0762 0.4238 -0.0762 Z" />
          </clipPath>
        </defs>
      </svg>

      <div className="index-style__PageBackgroundMain-sc-ef9a9ebb-0 iPkdfn">
        {/* ========================================================== */}
        {/* SECTION 1: Ticker Logo Marquee                             */}
        {/* ========================================================== */}
        <section
          ref={tickerSectionRef}
          className={`index-style__TickerSectionMain-sc-f994884c-0 glnUmG ${tickerInView ? "is-inview" : ""}`}
        >
          <div className="index-style__ContainerMain-sc-3e6ebae-0 dONKYH">
            <p className="TextStyles__TextBodyStyled-sc-358d108c-5 fWzyEw">
              <span className="index-style__SplitTextSrOnly-sc-6461e2eb-0 jreyVw">
                Teams from top brands and agencies we learn from
              </span>
              <span aria-hidden="true" className="index-style__SplitTextWrapper-sc-6461e2eb-1 hwJVXf">
                Teams from top brands and agencies we learn from
              </span>
            </p>
            <span className="index-style__SpacerMain-sc-f2e865fb-0 iJTUgd" />
          </div>

          <div ref={tickerWrapperRef} className="index-style__TickerSectionLogosWrapper-sc-f994884c-1 iYrDHs">
            <div ref={tickerLogosRef} className="index-style__TickerSectionLogos-sc-f994884c-2 jMGSsw">
              {displayLogos.map((logo, index) => (
                <div key={index} className="index-style__TickerSectionLogoWrapper-sc-f994884c-3 jGVAxN">
                  <span className="index-style__AnimateWrapper-sc-8bf3a78c-0 gevjNg">
                    <span
                      className={`index-style__AnimateSlide-sc-8bf3a78c-2 eCzlPx ${tickerInView ? "is-visible" : ""}`}
                      style={{ transitionDelay: `${0.06 * (index % LOGOS.length)}s` }}
                    >
                      <div className="index-style__TickerSectionLogo-sc-f994884c-4 kUxdkg">
                        <div className="index-style__ImgMain-sc-2f7799e5-0 fZzdWn">
                          <img
                            alt={`${logo.name} logo`}
                            loading="lazy"
                            width={logo.width}
                            height={logo.height}
                            decoding="async"
                            style={{ color: "transparent", objectFit: "contain" }}
                            src={logo.src}
                          />
                        </div>
                      </div>
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* SECTION 2: Statement-Timeline FLIP Scroll Animation        */}
        {/* ========================================================== */}
        <section className="index-style__StatementTimelineMain-sc-87b51a93-0 lhNRew">
          <div className="index-style__ContainerMain-sc-3e6ebae-0 dONKYH">
            <div ref={statementContainerRef} className="index-style__StatementContainer-sc-87b51a93-1 ilxOZw">
              <div className="index-style__StatementInner-sc-87b51a93-2 kVakhn">
                <h2 className="TextStyles__Heading2Styled-sc-358d108c-1 gbMovY">
                  <span className="index-style__SplitTextSrOnly-sc-6461e2eb-0 jreyVw">
                    SKIP THE WHOLE THING. NO SMALL THING specializes in the design and development of AI n IT Services. Founded with the mission of driving the future through disruptive technology, from the initial sketch to the final.
                  </span>
                  <span aria-hidden="true" className="index-style__SplitTextWrapper-sc-6461e2eb-1 hwJVXf">
                    SKIP THE WHOLE THING.
                    <div
                      data-type="statement-block-wrapper"
                      ref={(el) => {
                        statementWrappersRef.current[0] = el;
                      }}
                      className="index-style__StatementBlockWrapper-sc-87b51a93-3 iTVauV"
                    />{" "}
                    NO SMALL THING specializes in the design and development
                    <div
                      data-type="statement-block-wrapper"
                      ref={(el) => {
                        statementWrappersRef.current[1] = el;
                      }}
                      className="index-style__StatementBlockWrapper-sc-87b51a93-3 iTVauV"
                    />{" "}
                    of AI n IT Services.
                    <div
                      data-type="statement-block-wrapper"
                      ref={(el) => {
                        statementWrappersRef.current[2] = el;
                      }}
                      className="index-style__StatementBlockWrapper-sc-87b51a93-3 iTVauV"
                    />{" "}
                    Founded with the mission of driving the future through disruptive technology,
                    <div
                      data-type="statement-block-wrapper"
                      ref={(el) => {
                        statementWrappersRef.current[3] = el;
                      }}
                      className="index-style__StatementBlockWrapper-sc-87b51a93-3 iTVauV"
                    />{" "}
                    from the initial sketch to the final.
                    <div
                      data-type="statement-block-wrapper"
                      ref={(el) => {
                        statementWrappersRef.current[4] = el;
                      }}
                      className="index-style__StatementBlockWrapper-sc-87b51a93-3 iTVauV"
                    />
                  </span>
                </h2>
              </div>
            </div>

            <div ref={timelineContainerRef} className="index-style__TimelineContainer-sc-87b51a93-4 bLSAVe">
              <div className="index-style__TimelineInner-sc-87b51a93-5 csACRL">
                <div className="index-style__TimelineBackground-sc-87b51a93-6 ehZCIX">
                  <img
                    alt="Butter timeline illustration"
                    loading="lazy"
                    width={1576}
                    height={783}
                    decoding="async"
                    style={{ color: "transparent" }}
                    src="/marketing-assets/images/statement/timeline.png"
                  />
                </div>

                <div className="index-style__TimelineBlocks-sc-87b51a93-7 fDjlRy">
                  {STATEMENT_BLOCKS.map((block, idx) => (
                    <div
                      key={idx}
                      data-type="timeline-block-wrapper"
                      ref={(el) => {
                        timelineWrappersRef.current[idx] = el;
                      }}
                      className="index-style__TimelineBlockWrapper-sc-87b51a93-8 czwcKY"
                    >
                      <div
                        ref={(el) => {
                          blockElementsRef.current[idx] = el;
                        }}
                        className="index-style__StatementBlockMain-sc-f0669d10-0 jICkic"
                      >
                        <div
                          className={`index-style__ButterBlockWrapper-sc-dca6eb83-0 ${
                            idx === 0 ? "gZNzdz" : "eKDGlc"
                          }`}
                        >
                          <div className="index-style__MediaMain-sc-e3c393d5-0 hUbRiY">
                            <div className="index-style__MediaInner-sc-e3c393d5-1 dlCpXA">
                              <div className="index-style__ImgMain-sc-2f7799e5-0 cWOMHg">
                                <img
                                  alt={block.alt}
                                  loading="lazy"
                                  decoding="async"
                                  style={{
                                    position: "absolute",
                                    height: "100%",
                                    width: "100%",
                                    left: 0,
                                    top: 0,
                                    right: 0,
                                    bottom: 0,
                                    objectFit: "cover",
                                    color: "transparent",
                                  }}
                                  src={block.src}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================== */}
        {/* SECTION 3: StoryOne Text Effects                           */}
        {/* ========================================================== */}
        <section className="index-style__StoryOneMain-sc-be78c17d-0 hKanzn">
          <div className="index-style__ContainerMain-sc-3e6ebae-0 dONKYH">
            <div className="index-style__GridMain-sc-577d9628-0 ePEgYo">
              {/* Left Column: Interactive Heading & Text Effects */}
              <div className="index-style__GridItemMain-sc-a1d4ce5-0 eGWFRL">
                <p className="TextStyles__TextCapStyled-sc-358d108c-8 iFhYZQ">
                  <span className="index-style__SplitTextSrOnly-sc-6461e2eb-0 jreyVw">
                    Websites, software, and AI. Shipped, and running.
                  </span>
                  <span aria-hidden="true" className="index-style__SplitTextWrapper-sc-6461e2eb-1 hwJVXf">
                    Websites, software, and AI. Shipped, and running.
                  </span>
                </p>
                <span className="index-style__SpacerMain-sc-f2e865fb-0 jfbqDa" />

                <div className={`index-style__StoryOneTextWrapper-sc-be78c17d-1 jKOOXd effect-${activeEffect || "null"}`}>
                  <h2 className="TextStyles__Heading2Styled-sc-358d108c-1 eUmFMS">
                    <span className="index-style__SplitTextSrOnly-sc-6461e2eb-0 jreyVw">
                      Building future where humanity is out exploring the AI is fundamentally more exciting than one where we are not.
                    </span>
                    <span aria-hidden="true" className="index-style__SplitTextWrapper-sc-6461e2eb-1 hwJVXf">
                      {renderWord("Building", 0, buildingWordRef)}
                      {" "}
                      <div className="index-style__StoryOneDecorativeTextWrapper-sc-be78c17d-4 ddmokf story-keyword-wrapper">
                        {/* Glow effect radiant aura */}
                        <div className="index-style__StoryOneGlow-sc-be78c17d-6 iFeYpC story-glow-aura story-glow-future">
                          <img
                            alt=""
                            loading="lazy"
                            width={611}
                            height={226}
                            decoding="async"
                            style={{ color: "transparent" }}
                            src="/marketing-assets/images/text-effects/word_glow_future.png"
                          />
                        </div>

                        {/* Inflate effect letters */}
                        <div className="index-style__StoryOneInflate-sc-be78c17d-7 jICMZH">
                          {FUTURE_INFLATE_LETTERS.map((letter, i) => (
                            <img
                              key={`${letter.char}-${i}`}
                              ref={(el) => {
                                futureInflateLettersRef.current[i] = el;
                              }}
                              alt=""
                              data-effect-elem="inflate"
                              loading="lazy"
                              width={letter.width}
                              height={letter.height}
                              decoding="async"
                              className={`index-style__StoryOneInflateLetter-sc-be78c17d-8 ${letter.className}`}
                              style={{ color: "transparent" }}
                              src={letter.src}
                            />
                          ))}
                        </div>

                        {/* Interactive keyword letters */}
                        <span className="index-style__StoryOneDecorativeText-sc-be78c17d-5 ktBmdf story-keyword-text story-keyword-future">
                          {"future".split("").map((c, i) => {
                            const idx = 9 + i;
                            return (
                              <span
                                key={idx}
                                data-char-idx={idx}
                                ref={(el) => {
                                  futureLettersRef.current[i] = el;
                                  charSpansRef.current[idx] = el;
                                }}
                                className="story-char story-inflate-letter"
                              >
                                {c}
                              </span>
                            );
                          })}
                        </span>
                      </div>
                      {" "}
                      {renderWord("where", 16, whereWordRef)}
                      {" "}
                      {renderWord("humanity", 22)}
                      {" "}
                      {renderWord("is", 31)}
                      {" "}
                      {renderWord("out", 34)}
                      {" "}
                      {renderWord("exploring", 38)}
                      {" "}
                      {renderWord("the", 48, theWordRef)}
                      {" "}
                      <div className="index-style__StoryOneDecorativeTextWrapper-sc-be78c17d-4 ddmokf story-keyword-wrapper">
                        {/* Glow effect radiant aura */}
                        <div className="index-style__StoryOneGlow-sc-be78c17d-6 iFeYpC story-glow-aura story-glow-ai">
                          <img
                            alt=""
                            loading="lazy"
                            width={257}
                            height={226}
                            decoding="async"
                            style={{ color: "transparent" }}
                            src="/marketing-assets/images/text-effects/word_glow_ai.png"
                          />
                        </div>

                        {/* Inflate effect letters */}
                        <div className="index-style__StoryOneInflate-sc-be78c17d-7 jICMZH">
                          {AI_INFLATE_LETTERS.map((letter, i) => (
                            <img
                              key={`${letter.char}-${i}`}
                              ref={(el) => {
                                aiInflateLettersRef.current[i] = el;
                              }}
                              alt=""
                              data-effect-elem="inflate"
                              loading="lazy"
                              width={letter.width}
                              height={letter.height}
                              decoding="async"
                              className={`index-style__StoryOneInflateLetter-sc-be78c17d-8 ${letter.className}`}
                              style={{ color: "transparent" }}
                              src={letter.src}
                            />
                          ))}
                        </div>

                        {/* Interactive keyword letters */}
                        <span className="index-style__StoryOneDecorativeText-sc-be78c17d-5 ktBmdf story-keyword-text story-keyword-ai">
                          {"AI".split("").map((c, i) => {
                            const idx = 52 + i;
                            return (
                              <span
                                key={idx}
                                data-char-idx={idx}
                                ref={(el) => {
                                  aiLettersRef.current[i] = el;
                                  charSpansRef.current[idx] = el;
                                }}
                                className="story-char story-inflate-letter"
                              >
                                {c}
                              </span>
                            );
                          })}
                        </span>
                      </div>
                      {" "}
                      {renderWord("is", 55, isWordRef)}
                      {" "}
                      {renderWord("fundamentally", 58)}
                      {" "}
                      {renderWord("more", 72)}
                      {" "}
                      {renderWord("exciting", 77)}
                      {" "}
                      {renderWord("than", 86)}
                      {" "}
                      {renderWord("one", 91)}
                      {" "}
                      {renderWord("where", 95)}
                      {" "}
                      {renderWord("we", 101)}
                      {" "}
                      {renderWord("are", 104)}
                      {" "}
                      {renderWord("not.", 108)}
                    </span>
                  </h2>

                  {/* Halftone effect overlay with live halftone particle video */}
                  <div aria-hidden="true" className="index-style__StoryOneTextHalftone-sc-be78c17d-2 cqjpGA">
                    <video
                      ref={halftoneVideoRef}
                      src="/marketing-assets/images/text-effects/halftone_bg.mp4"
                      loop
                      muted
                      playsInline
                      aria-hidden="true"
                    />
                    <div className="index-style__StoryOneTextHalftoneInner-sc-be78c17d-3 jKEoAW">
                      Building future where humanity is out exploring the AI is fundamentally more exciting than one where we are not.
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column: Interactive UI Selector Cards */}
              <div className="index-style__GridItemMain-sc-a1d4ce5-0 bdmaFz">
                <div className="index-style__StoryOneUI-sc-be78c17d-9 gIFObO">
                  <div className="index-style__StoryOneUIHeader-sc-be78c17d-10 iHIJlF">
                    <div className="index-style__StoryOneUIHeaderButtons-sc-be78c17d-12 gQhGnT">
                      <p className="TextStyles__TextCapStyled-sc-358d108c-8 epNqCJ">
                        <span className="index-style__SplitTextSrOnly-sc-6461e2eb-0 jreyVw">Library | Text Blocks</span>
                        <span aria-hidden="true" className="index-style__SplitTextWrapper-sc-6461e2eb-1 hwJVXf">
                          Library | Text Blocks
                        </span>
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={handleResetEffects}
                      className="index-style__StoryOneUIHeaderClose-sc-be78c17d-11 keANfc"
                      title="Reset effect"
                      aria-label="Reset text effects"
                      style={{ border: "none", cursor: "pointer" }}
                    >
                      <svg viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg" width="9" height="9">
                        <path
                          d="M0.707031 7.69725L4.20212 4.20219M4.20212 4.20219L7.69718 0.707092M4.20212 4.20219L0.707031 0.707092M4.20212 4.20219L7.69718 7.69725"
                          stroke="currentColor"
                          strokeLinecap="square"
                          strokeLinejoin="round"
                        />
                      </svg>
                    </button>
                  </div>

                  <div className="index-style__StoryOneUIItems-sc-be78c17d-13 hqYnlu">
                    {TEXT_EFFECT_ITEMS.map((item) => (
                      <div
                        key={item.id}
                        role="button"
                        tabIndex={0}
                        aria-pressed={activeEffect === item.id}
                        aria-label={`${item.label} text effect`}
                        data-effect={item.id}
                        onClick={() => handleCardClick(item.id)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            handleCardClick(item.id);
                          }
                        }}
                        onMouseEnter={() => setHoveredEffect(item.id)}
                        onMouseLeave={() => setHoveredEffect(null)}
                        className={`index-style__StoryOneUIItem-sc-be78c17d-14 cYA-Dcr ${
                          activeEffect === item.id ? "is-active" : ""
                        }`}
                      >
                        <div className="index-style__StoryOneUIItemImage-sc-be78c17d-15 hnhweN">
                          <div className="index-style__ButterBlockWrapper-sc-dca6eb83-0 dQYNXs">
                            <img
                              alt={`${item.label} Effect`}
                              loading="lazy"
                              width={339}
                              height={339}
                              decoding="async"
                              style={{ color: "transparent", width: "100%", height: "100%", objectFit: "cover" }}
                              src={item.image}
                            />
                          </div>
                        </div>
                        <p className="TextStyles__TextCapStyled-sc-358d108c-8 epNqCJ">
                          <span className="index-style__SplitTextSrOnly-sc-6461e2eb-0 jreyVw">{item.label}</span>
                          <span aria-hidden="true" className="index-style__SplitTextWrapper-sc-6461e2eb-1 hwJVXf">
                            {item.label}
                          </span>
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}
