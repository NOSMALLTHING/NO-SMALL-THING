"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useReducedMotion } from "motion/react";

interface ProjectCardData {
  id: string;
  number: string;
  tag: string;
  titleLines: [string, string];
  description: string;
  themeClass: string;
  poster: string;
  videoSrc?: string;
}

interface CardMetric {
  cardTop: number;
  normalTop: number;
  cardWidth: number;
  cardHeight: number;
}

const PROJECT_CARDS: ProjectCardData[] = [
  {
    id: "project-1",
    number: "(01)",
    tag: "AI & Innovation",
    titleLines: ["PROJECT", "1"],
    description:
      "AI integration, intelligent automation and workflow optimization. Purposeful AI solutions that support the way your business works.",
    themeClass: "service-card-lime",
    poster: "/brand/service-cards/service-1.webp",
    videoSrc: "/brand/service-cards/service-1.mp4",
  },
  {
    id: "project-2",
    number: "(02)",
    tag: "Digital Platforms",
    titleLines: ["PROJECT", "2"],
    description:
      "Custom business websites and web platforms, thoughtfully designed and responsively built for distinctive market impression.",
    themeClass: "service-card-pink",
    poster: "/brand/service-cards/service-2.webp",
    videoSrc: "/brand/service-cards/service-2.mp4",
  },
  {
    id: "project-3",
    number: "(03)",
    tag: "UI/UX Experience",
    titleLines: ["PROJECT", "3"],
    description:
      "Intuitive interfaces, considered user journeys and memorable digital interactions designed to stay in people's minds.",
    themeClass: "service-card-violet",
    poster: "/brand/service-cards/service-3.webp",
    videoSrc: "/brand/service-cards/service-3.mp4",
  },
  {
    id: "project-4",
    number: "(04)",
    tag: "Systems Architecture",
    titleLines: ["PROJECT", "4"],
    description:
      "Custom software, scalable cloud architecture and connected digital workflows shaped around your team's real challenges.",
    themeClass: "service-card-lilac",
    poster: "/brand/service-cards/service-4.webp",
    videoSrc: "/brand/service-cards/service-4.mp4",
  },
  {
    id: "project-5",
    number: "(05)",
    tag: "Design Support",
    titleLines: ["PROJECT", "5"],
    description:
      "For companies that need regular design: social media visuals, pitch presentations, landing pages and continuous brand assets.",
    themeClass: "service-card-white",
    poster: "/brand/service-cards/service-5.webp",
  },
];

// Mathematical easing and interpolation functions
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;

const easeOutCubic = (value: number) => {
  const t = clamp(value, 0, 1);
  return 1 - Math.pow(1 - t, 3);
};

// Smoothstep curve for side entrance/exit
const easeInOut = (value: number) => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};

const easeInOutQuint = (value: number) => {
  const t = clamp(value, 0, 1);
  return t < 0.5 ? 16 * Math.pow(t, 5) : 1 - Math.pow(-2 * t + 2, 5) / 2;
};

// Pure, deterministic depth accumulation across stacked cards
const computeCardDepth = (
  index: number,
  totalCards: number,
  getProgress: (i: number) => number
) => {
  let sum = 0;
  for (let later = index + 1; later < totalCards; later++) {
    const laterIndex = later - (index + 1);
    const weight = Math.max(0.36, 1 - laterIndex * 0.22);
    const layered = easeOutCubic(getProgress(later));
    sum += layered * weight;
  }
  return clamp(sum, 0, 2.7);
};

export function ServicesCardDeck() {
  const sectionRef = useRef<HTMLElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useReducedMotion();
  const [isTouchLayout, setIsTouchLayout] = useState(false);

  const metricsRef = useRef<CardMetric[]>([]);
  const unitPxRef = useRef(1);
  const runwayStateRef = useRef<"below" | "inside" | "above" | "init">("init");

  // Sync media query for touch / mobile screen widths
  useEffect(() => {
    const query = window.matchMedia("(max-width: 900px)");
    const update = () => setIsTouchLayout(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Measure static slot and card geometry relative to section
  const syncMetrics = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const viewportWidth =
      typeof window !== "undefined"
        ? window.innerWidth || document.documentElement.clientWidth
        : 1440;
    const viewportHeight =
      typeof window !== "undefined"
        ? window.innerHeight || document.documentElement.clientHeight
        : 900;
    const isMobile =
      typeof window !== "undefined"
        ? window.matchMedia("(max-width: 900px)").matches
        : false;

    const u =
      Math.min(
        viewportWidth * 0.000694444444,
        viewportHeight * 0.001315789474
      ) || 1;
    unitPxRef.current = u;

    const slots = slotRefs.current.filter(Boolean) as HTMLDivElement[];
    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];

    // Baseline layout parameters from globals.css
    // Desktop: kicker 132u, kicker-height 16u, kicker-gap 80u, stack-intro 120u, flow-gap 112u
    // Mobile:  kicker 92u,  kicker-height 16u, kicker-gap 44u, stack-intro 72u,  flow-gap 64u
    const kickerTop = (isMobile ? 92 : 132) * u;
    const kickerHeight = 16 * u;
    const kickerGap = (isMobile ? 44 : 80) * u;
    const stackIntro = (isMobile ? 72 : 120) * u;
    const flowGap = (isMobile ? 64 : 112) * u;

    const defaultCardTop = kickerTop + kickerHeight + kickerGap;
    const defaultCardWidth = isMobile
      ? Math.max(300, viewportWidth - 28)
      : Math.min(1160 * u, viewportWidth - 40 * u);
    const defaultCardHeight = isMobile ? 360 * u : 370 * u;
    const slot0NormalTop = kickerTop + kickerGap + stackIntro;

    const cardCount = PROJECT_CARDS.length;
    metricsRef.current = Array.from({ length: cardCount }, (_, index) => {
      const card = cards[index] || slots[index];
      const cardWidth = card && card.offsetWidth > 0 ? card.offsetWidth : defaultCardWidth;
      const cardHeight = card && card.offsetHeight > 0 ? card.offsetHeight : defaultCardHeight;

      let measuredCardTop = defaultCardTop;
      if (slots[index]) {
        const computed = parseFloat(window.getComputedStyle(slots[index]).top);
        if (Number.isFinite(computed) && computed > 0) {
          measuredCardTop = computed;
        }
      }

      // Normal flow top of each slot is mathematically defined by CSS rules:
      // slot(0) starts at slot0NormalTop. Each subsequent slot is spaced by cardHeight + flowGap.
      // This is 100% immune to WebKit sticky offsetTop bugs or scroll-position shifts.
      const normalTop = slot0NormalTop + index * (cardHeight + flowGap);

      return {
        cardTop: measuredCardTop,
        normalTop,
        cardWidth,
        cardHeight,
      };
    });
  }, []);

  // Deterministic, stateless card transform calculation based directly on scroll progress
  const updateServiceCards = useCallback(() => {
    const section = sectionRef.current;
    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
    const slots = slotRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!section || !cards.length) return;

    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    const isReduced = !!reducedMotion;

    if (!metricsRef.current.length || metricsRef.current.length < cards.length) {
      syncMetrics();
    }

    const sectionRect = section.getBoundingClientRect();
    const servicesTop = sectionRect.top;
    const servicesBoxHeight = sectionRect.height;
    const unitPx = unitPxRef.current || 1;
    const cardPerspective = `perspective(${(1800 * unitPx).toFixed(2)}px) `;

    // Runway 1: Section is far below viewport (not yet entered)
    if (servicesTop > viewportHeight * 1.5) {
      if (runwayStateRef.current === "below") return;
      runwayStateRef.current = "below";

      const cardWidthFallback = Math.min(1160 * unitPx, viewportWidth * 0.85);

      cards.forEach((card, index) => {
        const sideDirection = index % 2 === 0 ? -1 : 1;
        const cardWidth = metricsRef.current[index]?.cardWidth || cardWidthFallback;
        const sideEntryOffset = viewportWidth * 0.52 + cardWidth * 0.58;

        card.classList.remove("is-active", "is-stacked");
        card.classList.add("is-next");
        card.style.zIndex = String(10 + index);

        if (isMobile || isReduced) {
          card.style.transform = "";
        } else {
          card.style.transform =
            cardPerspective +
            `translate3d(${(sideDirection * sideEntryOffset).toFixed(2)}px, 74.00px, 0.00px) ` +
            `rotateX(0.00deg) rotateY(${(sideDirection * -7).toFixed(2)}deg) ` +
            `rotateZ(${(sideDirection * 8.5).toFixed(2)}deg) ` +
            `scale(1.0000)`;
        }
      });
      section.style.setProperty("--services-kicker-exit", "0");
      section.style.setProperty("--services-release-y", "0px");
      return;
    }

    // Runway 2: Section is far above viewport (already scrolled past)
    if (servicesTop + servicesBoxHeight < -viewportHeight * 0.5) {
      if (runwayStateRef.current === "above") return;
      runwayStateRef.current = "above";

      cards.forEach((card, index) => {
        card.classList.remove("is-next");
        card.classList.add("is-active", "is-stacked");
        card.style.zIndex = String(10 + index);

        if (isMobile || isReduced) {
          card.style.transform = "";
        } else {
          const depth = computeCardDepth(index, cards.length, () => 1);
          const recedeY = -depth * 16 - 28;
          const recedeZ = -depth * 28;
          const scale = 1 - depth * 0.018;
          card.style.transform =
            cardPerspective +
            `translate3d(0.00px, ${recedeY.toFixed(2)}px, ${recedeZ.toFixed(2)}px) ` +
            `rotateX(0.00deg) rotateY(0.00deg) rotateZ(0.00deg) scale(${scale.toFixed(4)})`;
        }
      });
      section.style.setProperty("--services-kicker-exit", "1");
      section.style.setProperty("--services-release-y", "-28px");
      return;
    }

    runwayStateRef.current = "inside";

    // Live section scroll progress
    const sectionScroll = -servicesTop;

    // Release animation as section approaches end
    const maxScroll = Math.max(1, servicesBoxHeight - viewportHeight);
    const sectionProgress = clamp(sectionScroll / maxScroll, 0, 1);
    const releaseProgress = clamp((sectionProgress - 0.82) / 0.16, 0, 1);
    const groupShiftY = lerp(0, -28, easeInOutQuint(releaseProgress));
    section.style.setProperty("--services-release-y", `${groupShiftY.toFixed(2)}px`);

    // Kicker exit follows release near section end
    const kickerExit = clamp((sectionProgress - 0.85) / 0.12, 0, 1);
    section.style.setProperty("--services-kicker-exit", kickerExit.toFixed(3));

    // Calculate deterministic scroll progress for each card
    const cardData = cards.map((card, index) => {
      const metrics = metricsRef.current[index] || {
        cardTop: 228 * unitPx,
        normalTop: (132 + 200) * unitPx + index * (370 + 112) * unitPx,
        cardWidth: Math.min(1160 * unitPx, viewportWidth - 40 * unitPx),
        cardHeight: 370 * unitPx,
      };

      const enterRange = (metrics.cardHeight + 112 * unitPx) * 1.12;
      const slotTriggerScroll = metrics.normalTop - metrics.cardTop;
      const enterStart = slotTriggerScroll - enterRange;
      const rawProgress = clamp((sectionScroll - enterStart) / enterRange, 0, 1);

      return { rawProgress, metrics };
    });

    // Apply transforms deterministically (pure function of scroll position)
    cards.forEach((card, index) => {
      const { rawProgress, metrics } = cardData[index];
      const cardSlot = slots[index];

      if (cardSlot) {
        cardSlot.style.transform = "";
        cardSlot.style.zIndex = String(10 + index);
      }
      card.style.zIndex = String(10 + index);

      const active = rawProgress > 0.04;
      card.classList.toggle("is-active", active);
      card.classList.toggle("is-next", rawProgress < 0.08);

      if (isMobile || isReduced) {
        card.style.transform = "";
        card.classList.toggle("is-stacked", index < cards.length - 1);
        return;
      }

      // Depth accumulated from all subsequent cards landing on top
      const depth = computeCardDepth(index, cards.length, (i) => cardData[i].rawProgress);

      card.classList.toggle("is-stacked", depth > 0.01);

      const enterProgress = easeInOut(rawProgress);
      const sideDirection = index % 2 === 0 ? -1 : 1;
      const cardWidth = metrics.cardWidth || card.offsetWidth;
      const sideEntryOffset = viewportWidth * 0.52 + cardWidth * 0.58;
      const sideEntryRest = 1 - enterProgress;

      const targetX = (sideDirection * sideEntryOffset * sideEntryRest) || 0;
      const targetRotateY = (sideDirection * lerp(-7, 0, enterProgress)) || 0;
      const targetRotateZ = (sideDirection * lerp(8.5, 0, enterProgress)) || 0;
      const targetY = lerp(74, 0, enterProgress) - depth * 16 + groupShiftY;
      const targetZ = -depth * 28;
      const scale = 1 - depth * 0.018;

      card.style.transform =
        cardPerspective +
        `translate3d(${targetX.toFixed(2)}px, ${targetY.toFixed(2)}px, ${targetZ.toFixed(2)}px) ` +
        `rotateX(0.00deg) rotateY(${targetRotateY.toFixed(2)}deg) ` +
        `rotateZ(${targetRotateZ.toFixed(2)}deg) ` +
        `scale(${scale.toFixed(4)})`;
    });
  }, [reducedMotion, syncMetrics]);

  // Set side-entry modifier class on document body
  useEffect(() => {
    document.body.classList.add("services-side-entry");
    return () => {
      document.body.classList.remove("services-side-entry");
    };
  }, []);

  // Coalesced scroll & resize event updates (No perpetual idle RAF loop)
  useEffect(() => {
    runwayStateRef.current = "init";
    syncMetrics();
    updateServiceCards();

    let rafId = 0;
    let isMounted = true;

    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        if (!isMounted) return;
        updateServiceCards();
      });
    };

    // 1. Lenis smooth scroll listener
    const attachLenis = () => {
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.on("scroll", scheduleUpdate);
        return true;
      }
      return false;
    };

    let checkLenisTimer: ReturnType<typeof setInterval> | null = null;
    if (!attachLenis()) {
      checkLenisTimer = setInterval(() => {
        if (attachLenis() && checkLenisTimer) {
          clearInterval(checkLenisTimer);
          checkLenisTimer = null;
        }
      }, 100);
      setTimeout(() => {
        if (checkLenisTimer) {
          clearInterval(checkLenisTimer);
          checkLenisTimer = null;
        }
      }, 3000);
    }

    // 2. Native window scroll listener (passive)
    window.addEventListener("scroll", scheduleUpdate, { passive: true });

    // 3. Debounced window resize handler
    let resizeTimer: ReturnType<typeof setTimeout> | null = null;
    const handleResize = () => {
      const isTouch = window.matchMedia("(max-width: 900px)").matches;
      setIsTouchLayout((prev) => (prev !== isTouch ? isTouch : prev));
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.resize();
      }
      runwayStateRef.current = "init";
      syncMetrics();
      scheduleUpdate();
      if (resizeTimer) clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (!isMounted) return;
        runwayStateRef.current = "init";
        syncMetrics();
        scheduleUpdate();
      }, 120);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // 4. ResizeObserver on section container to re-sync metrics if layout shifts
    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        const isTouch = window.matchMedia("(max-width: 900px)").matches;
        setIsTouchLayout((prev) => (prev !== isTouch ? isTouch : prev));
        runwayStateRef.current = "init";
        syncMetrics();
        scheduleUpdate();
      });
      if (sectionRef.current) ro.observe(sectionRef.current);
    }

    // 5. Font loading listener for accurate font metrics
    if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        if (!isMounted) return;
        runwayStateRef.current = "init";
        syncMetrics();
        scheduleUpdate();
      });
    }

    // Initial stabilization ticks
    const t1 = setTimeout(() => {
      if (!isMounted) return;
      runwayStateRef.current = "init";
      syncMetrics();
      scheduleUpdate();
    }, 100);
    const t2 = setTimeout(() => {
      if (!isMounted) return;
      runwayStateRef.current = "init";
      syncMetrics();
      scheduleUpdate();
    }, 500);

    return () => {
      isMounted = false;
      if (rafId) cancelAnimationFrame(rafId);
      if (checkLenisTimer) clearInterval(checkLenisTimer);
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.off("scroll", scheduleUpdate);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", handleResize);
      if (resizeTimer) clearTimeout(resizeTimer);
      if (ro) ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [syncMetrics, updateServiceCards]);

  // Video playback management via IntersectionObserver (plays within 1 screen, pauses when away)
  useEffect(() => {
    const videoEls = sectionRef.current?.querySelectorAll<HTMLVideoElement>(".service-card-video");
    if (!videoEls || !videoEls.length) return;

    const playVideoSafe = (video: HTMLVideoElement) => {
      const p = video.play();
      if (p && typeof p.catch === "function") p.catch(() => {});
    };

    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const video = entry.target as HTMLVideoElement;
            if (entry.isIntersecting) {
              playVideoSafe(video);
            } else {
              video.pause();
            }
          });
        },
        { threshold: 0, rootMargin: "100% 0px" }
      );

      videoEls.forEach((video) => observer.observe(video));

      return () => {
        observer.disconnect();
        videoEls.forEach((video) => {
          if (!video.paused) video.pause();
        });
      };
    } else {
      videoEls.forEach(playVideoSafe);
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="services"
      id="what-we-do-best"
      aria-label="What we do best"
      data-theme="dark"
    >
      <span
        id="selected-work"
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
        aria-hidden="true"
      />
      <span
        id="work"
        style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
        aria-hidden="true"
      />
      <div className="services-shell">
        <p className="services-kicker" ref={kickerRef}>
          what we do best
        </p>

        <div className="services-stack">
          {PROJECT_CARDS.map((project, index) => (
            <div
              key={project.id}
              className="service-card-slot"
              ref={(el) => {
                slotRefs.current[index] = el;
              }}
            >
              <article
                className={`service-card ${project.themeClass}`}
                ref={(el) => {
                  cardRefs.current[index] = el;
                }}
              >
                <div className="service-card-meta">
                  <span>{project.number}</span>
                  <span>{project.tag}</span>
                </div>

                <div className="service-card-body">
                  <h2>
                    {project.titleLines[0]}
                    <br />
                    {project.titleLines[1]}
                  </h2>
                  <p>{project.description}</p>
                </div>

                <div className="service-card-media service-card-media-video">
                  {project.videoSrc ? (
                    <video
                      className="service-card-video"
                      muted
                      loop
                      playsInline
                      preload="auto"
                      poster={project.poster}
                    >
                      <source src={project.videoSrc} type="video/mp4" />
                    </video>
                  ) : (
                    <img
                      src={project.poster}
                      alt={project.titleLines.join(" ")}
                      className="service-card-img"
                    />
                  )}
                </div>
              </article>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
