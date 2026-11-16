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
    src: "/marketing-assets/images/statement/statement-1.png",
    alt: "Orange Nike swoosh on a glossy blue app icon",
  },
  {
    src: "/marketing-assets/images/statement/statement-2.jpg",
    alt: "Cropped black-and-white typographic composition",
  },
  {
    src: "/marketing-assets/images/statement/statement-3.jpg",
    alt: "Blue halftone silhouettes of people riding horses",
  },
  {
    src: "/marketing-assets/images/statement/statement-4.jpg",
    alt: "Red and white Justified Studio typographic poster",
  },
  {
    src: "/marketing-assets/images/statement/statement-5.jpg",
    alt: "Repeating red Art Direction typography",
  },
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
      const singleSetWidth = (LOGOS.length * 270); // approx logo + gap
      const needed = Math.max(Math.ceil((2.5 * wrapper.clientWidth) / singleSetWidth), 2);
      setRepeatCount(needed);
    };

    updateRepeat();
    window.addEventListener("resize", updateRepeat);
    return () => window.removeEventListener("resize", updateRepeat);
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
    gsap.ticker.add(tick);

    return () => {
      if (wrapper) {
        wrapper.removeEventListener("mouseenter", onMouseEnter);
        wrapper.removeEventListener("mouseleave", onMouseLeave);
      }
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.off("scroll", onLenisScroll);
      }
      window.removeEventListener("scroll", onScroll);
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

    const onResize = () => {
      updateBlockPositions();
    };
    window.addEventListener("resize", onResize);

    let lastScrollY = window.scrollY;

    const onScroll = () => {
      const sCont = statementContainerRef.current;
      const tCont = timelineContainerRef.current;
      if (!sCont || !tCont) return;

      const sRect = sCont.getBoundingClientRect();
      const tRect = tCont.getBoundingClientRect();
      const windowH = window.innerHeight;
      const curScrollY = window.scrollY;
      const isScrollingDown = curScrollY >= lastScrollY;
      lastScrollY = curScrollY;

      // Drop entrance bounce for block 0 (animate inner block without disturbing slot positioning)
      if (!hasEnteredRef.current && sRect.top < windowH * 0.82 && !isInTimelineRef.current) {
        hasEnteredRef.current = true;
        const firstBlock = blockElementsRef.current[0];
        const firstInner = firstBlock?.firstElementChild;
        if (firstInner) {
          entranceBounceAnimRef.current?.kill();
          entranceBounceAnimRef.current = gsap.from(firstInner, {
            y: "-300px",
            rotation: 15,
            duration: 1.8,
            ease: "power2.out",
          });
        }
      }

      // Hysteresis threshold to prevent rapid jitter across scroll border
      let shouldBeInTimeline = isInTimelineRef.current;
      if (isScrollingDown) {
        if (tRect.top <= windowH * 0.72) {
          shouldBeInTimeline = true;
        }
      } else {
        if (tRect.top > windowH * 0.78) {
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
          const stagger = idx * 0.1;
          tl.to(
            block,
            {
              scale: 1,
              x: 0,
              y: 0,
              duration: 1.4,
              ease: "power2.inOut",
            },
            stagger
          );
          tl.to(
            block,
            {
              rotation: 15 * (idx % 2 === 0 ? 1 : -1),
              duration: 0.7,
              ease: "power2.in",
            },
            stagger
          );
          tl.to(
            block,
            {
              rotation: 0,
              duration: 0.7,
              ease: "power2.out",
            },
            stagger + 0.7
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
          const stagger = idx * 0.05;

          tl.to(
            block,
            {
              scale,
              x,
              y,
              duration: 1.3,
              ease: "power2.inOut",
            },
            stagger
          );
          tl.to(
            block,
            {
              rotation: 15 * (idx % 2 === 0 ? -1 : 1),
              duration: 0.65,
              ease: "power2.in",
            },
            stagger
          );
          tl.to(
            block,
            {
              rotation: 0,
              duration: 0.65,
              ease: "power2.out",
            },
            stagger + 0.65
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
      window.removeEventListener("resize", onResize);
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

  const inflateLettersRef = useRef<(HTMLImageElement | null)[]>([]);
  const curatedWordRef = useRef<HTMLSpanElement | null>(null);
  const forWordRef = useRef<HTMLSpanElement | null>(null);
  const charSpansRef = useRef<(HTMLSpanElement | null)[]>([]);
  const halftoneVideoRef = useRef<HTMLVideoElement | null>(null);

  // Focus effect: segmented depth-of-field interpolation matching Butter
  useEffect(() => {
    const isFocus = activeEffect === "focus";
    const chars = charSpansRef.current.filter((c): c is HTMLSpanElement => Boolean(c));
    if (!chars.length) return;

    if (isFocus) {
      // Segmented ranges around "blocks" (indices 0..14 before, 15..83 after)
      const segments = [
        { slice: chars.slice(0, 15), from: 8, to: 0 },
        { slice: chars.slice(15, 23), from: 0, to: 8 },
        { slice: chars.slice(23, 48), from: 8, to: 0 },
        { slice: chars.slice(48), from: 8, to: 2 },
      ];

      const tl = gsap.timeline({ defaults: { duration: 0.8, ease: "power2.out" } });
      segments.forEach((seg) => {
        tl.to(
          seg.slice,
          {
            filter: (idx, _target, targets) => {
              const alpha = idx / Math.max(targets.length - 1, 1);
              const blurVal = gsap.utils.interpolate(seg.from, seg.to, alpha);
              return `blur(${blurVal.toFixed(1)}px)`;
            },
            stagger: 0.015,
          },
          "<+=0.05"
        );
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

  // Inflate effect: 3D bounce letters & word push
  useEffect(() => {
    const isInflate = activeEffect === "inflate";
    const letters = inflateLettersRef.current.filter((l): l is HTMLImageElement => Boolean(l));
    const wordCurated = curatedWordRef.current;
    const wordFor = forWordRef.current;

    const duration = isInflate ? 0.8 : 0.4;
    const ease = isInflate ? "back.out(1.2)" : "power2.out";
    const tl = gsap.timeline();

    gsap.killTweensOf(letters);
    if (wordCurated) gsap.killTweensOf(wordCurated);
    if (wordFor) gsap.killTweensOf(wordFor);

    letters.forEach((el, idx) => {
      const delay = 0.025 * idx;
      const rot = 36 * Math.random() - 18;
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

    if (wordCurated) {
      tl.to(
        wordCurated,
        {
          x: isInflate ? "-0.15em" : "0em",
          duration: 0.5 * duration,
          ease,
        },
        0.08
      );
    }

    if (wordFor) {
      tl.to(
        wordFor,
        {
          x: isInflate ? "0.15em" : "0em",
          duration: 0.5 * duration,
          ease,
        },
        0.02 * letters.length + 0.08
      );
    }

    return () => {
      tl.kill();
      gsap.killTweensOf(letters);
      if (wordCurated) gsap.killTweensOf(wordCurated);
      if (wordFor) gsap.killTweensOf(wordFor);
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

  // Helper to split text into animated characters with index tracking
  const makeCharSpans = (text: string, startIndex: number) => {
    return text.split("").map((c, i) => {
      const idx = startIndex + i;
      return (
        <span
          key={i}
          ref={(el) => {
            charSpansRef.current[idx] = el;
          }}
          className="story-char"
        >
          {c === " " ? "\u00A0" : c}
        </span>
      );
    });
  };

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
                Teams from top brands and agencies build with Butter
              </span>
              <span aria-hidden="true" className="index-style__SplitTextWrapper-sc-6461e2eb-1 hwJVXf">
                Teams from top brands and agencies build with Butter
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
                    Butter is the first video editor where creatives can build and remix custom design tools right on
                    timeline.
                  </span>
                  <span aria-hidden="true" className="index-style__SplitTextWrapper-sc-6461e2eb-1 hwJVXf">
                    Butter
                    <div
                      data-type="statement-block-wrapper"
                      ref={(el) => {
                        statementWrappersRef.current[0] = el;
                      }}
                      className="index-style__StatementBlockWrapper-sc-87b51a93-3 iTVauV"
                    />
                    is the first video
                    <div
                      data-type="statement-block-wrapper"
                      ref={(el) => {
                        statementWrappersRef.current[1] = el;
                      }}
                      className="index-style__StatementBlockWrapper-sc-87b51a93-3 iTVauV"
                    />
                    editor where creatives can
                    <div
                      data-type="statement-block-wrapper"
                      ref={(el) => {
                        statementWrappersRef.current[2] = el;
                      }}
                      className="index-style__StatementBlockWrapper-sc-87b51a93-3 iTVauV"
                    />
                    build and remix
                    <div
                      data-type="statement-block-wrapper"
                      ref={(el) => {
                        statementWrappersRef.current[3] = el;
                      }}
                      className="index-style__StatementBlockWrapper-sc-87b51a93-3 iTVauV"
                    />
                    custom design tools
                    <div
                      data-type="statement-block-wrapper"
                      ref={(el) => {
                        statementWrappersRef.current[4] = el;
                      }}
                      className="index-style__StatementBlockWrapper-sc-87b51a93-3 iTVauV"
                    />
                    right on timeline.
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
                  <span className="index-style__SplitTextSrOnly-sc-6461e2eb-0 jreyVw">There’s a block for that</span>
                  <span aria-hidden="true" className="index-style__SplitTextWrapper-sc-6461e2eb-1 hwJVXf">
                    There’s a block for that
                  </span>
                </p>
                <span className="index-style__SpacerMain-sc-f2e865fb-0 jfbqDa" />

                <div className={`index-style__StoryOneTextWrapper-sc-be78c17d-1 jKOOXd effect-${activeEffect || "null"}`}>
                  <h2 className="TextStyles__Heading2Styled-sc-358d108c-1 eUmFMS">
                    <span className="index-style__SplitTextSrOnly-sc-6461e2eb-0 jreyVw">
                      Browse curated blocks for motion graphics, kinetic type, 3D, shader effects, and beyond..
                    </span>
                    <span aria-hidden="true" className="index-style__SplitTextWrapper-sc-6461e2eb-1 hwJVXf">
                      {makeCharSpans("Browse ", 0)}
                      <span ref={curatedWordRef} className="story-word">
                        {makeCharSpans("curated", 7)}
                      </span>
                      {makeCharSpans(" ", 14)}
                      <div className="index-style__StoryOneDecorativeTextWrapper-sc-be78c17d-4 ddmokf">
                        {/* Glow effect aura image */}
                        <div className="index-style__StoryOneGlow-sc-be78c17d-6 iFeYpC">
                          <img
                            alt=""
                            loading="lazy"
                            width={169}
                            height={52}
                            decoding="async"
                            style={{ color: "transparent" }}
                            src="/marketing-assets/images/text-effects/word_glow.png"
                          />
                        </div>

                        {/* Inflate effect letters */}
                        <div className="index-style__StoryOneInflate-sc-be78c17d-7 jICMZH">
                          {INFLATE_LETTERS.map((letter, i) => (
                            <img
                              key={letter.char}
                              ref={(el) => {
                                inflateLettersRef.current[i] = el;
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

                        {/* Decorative base word */}
                        <span className="index-style__StoryOneDecorativeText-sc-be78c17d-5 ktBmdf">blocks</span>
                      </div>
                      {makeCharSpans(" ", 15)}
                      <span ref={forWordRef} className="story-word">
                        {makeCharSpans("for", 16)}
                      </span>
                      {makeCharSpans(" motion graphics, kinetic type, 3D, shader effects, and beyond.", 19)}
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
                      Browse curated blocks for motion graphics, kinetic type, 3D, shader effects, and beyond.
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
