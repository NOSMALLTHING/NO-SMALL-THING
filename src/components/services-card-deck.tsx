"use client";

import { useEffect, useRef, useCallback } from "react";
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

interface CardPhysicsState {
  x: number;
  y: number;
  z: number;
  scale: number;
  rotateX: number;
  rotateY: number;
  rotateZ: number;
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

// Exact Emblematica mathematical easings and interpolation functions
const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;
const easeOutCubic = (value: number) => {
  const t = clamp(value, 0, 1);
  return 1 - Math.pow(1 - t, 3);
};
// Smoothstep curve used by Emblematica side entry
const easeInOut = (value: number) => {
  const t = clamp(value, 0, 1);
  return t * t * (3 - 2 * t);
};
const easeInOutQuint = (value: number) => {
  const t = clamp(value, 0, 1);
  return t < 0.5 ? 16 * Math.pow(t, 5) : 1 - Math.pow(-2 * t + 2, 5) / 2;
};

export function ServicesCardDeck() {
  const sectionRef = useRef<HTMLElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  // Persistent physics states per card for continuous lerp inertia
  const cardStates = useRef<CardPhysicsState[]>([
    { x: 0, y: 0, z: 0, scale: 1, rotateX: 0, rotateY: 0, rotateZ: 0 },
    { x: 0, y: 0, z: 0, scale: 1, rotateX: 0, rotateY: 0, rotateZ: 0 },
    { x: 0, y: 0, z: 0, scale: 1, rotateX: 0, rotateY: 0, rotateZ: 0 },
    { x: 0, y: 0, z: 0, scale: 1, rotateX: 0, rotateY: 0, rotateZ: 0 },
    { x: 0, y: 0, z: 0, scale: 1, rotateX: 0, rotateY: 0, rotateZ: 0 },
  ]);

  const metricsRef = useRef<CardMetric[]>([]);
  const wasOutsideRef = useRef(true);
  const unitPxRef = useRef(1);

  // Sync geometry and card slot metrics without forced reflow inside render loop
  const syncMetrics = useCallback(() => {
    const section = sectionRef.current;
    if (!section) return;

    const u =
      typeof window !== "undefined"
        ? Math.min(
            window.innerWidth * 0.000694444444,
            (window.innerHeight || document.documentElement.clientHeight) * 0.001315789474
          ) || 1
        : 1;
    unitPxRef.current = u;

    const slots = slotRefs.current.filter(Boolean) as HTMLDivElement[];
    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];

    metricsRef.current = slots.map((slot, index) => {
      const card = cards[index] || slot;
      return {
        cardTop: parseFloat(window.getComputedStyle(slot).top) || 228 * u,
        normalTop: slot.offsetTop,
        cardWidth: card.offsetWidth,
        cardHeight: card.offsetHeight,
      };
    });
  }, []);

  // Update loop reproducing 1:1 Emblematica updateServiceCards physics and transforms
  const updateServiceCards = useCallback(
    (instant = false) => {
      const section = sectionRef.current;
      const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
      const slots = slotRefs.current.filter(Boolean) as HTMLDivElement[];
      if (!section || !cards.length) return;

      const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth;
      const isMobile = window.matchMedia("(max-width: 900px)").matches;
      const serviceSideEntryEnabled = true;

      // In case metrics are uninitialized
      if (!metricsRef.current.length) {
        syncMetrics();
      }

      // Read live compositor position directly to prevent any scroll/layout drift
      const sectionRect = section.getBoundingClientRect();
      const servicesTop = sectionRect.top;
      const servicesBoxHeight = sectionRect.height;

      // Emblematica runway check: skip whole update when section is well outside viewport
      if (servicesTop > viewportHeight * 1.5) {
        wasOutsideRef.current = true;
        const u = unitPxRef.current || 1;
        const cardPerspective = `perspective(${(1800 * u).toFixed(2)}px) `;
        const cardWidthFallback = viewportWidth * 0.8;

        cards.forEach((card, index) => {
          const state = cardStates.current[index];
          if (!state) return;
          const sideDirection = index % 2 === 0 ? -1 : 1;
          const cardWidth = metricsRef.current[index]?.cardWidth || card.offsetWidth || cardWidthFallback;
          const sideEntryOffset = viewportWidth * 0.52 + cardWidth * 0.58;

          state.x = sideDirection * sideEntryOffset;
          state.y = 74;
          state.z = 0;
          state.scale = 1;
          state.rotateX = 0;
          state.rotateY = sideDirection * -7;
          state.rotateZ = sideDirection * 8.5;

          card.classList.remove("is-active", "is-stacked");
          card.classList.add("is-next");

          if (isMobile) {
            card.style.transform = "";
          } else {
            card.style.transform =
              cardPerspective +
              `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, ${state.z.toFixed(2)}px) ` +
              `rotateX(${state.rotateX.toFixed(2)}deg) rotateY(${state.rotateY.toFixed(2)}deg) ` +
              `rotateZ(${state.rotateZ.toFixed(2)}deg) ` +
              `scale(${state.scale.toFixed(4)})`;
          }
        });
        return;
      }

      if (servicesTop + servicesBoxHeight < -viewportHeight * 0.5) {
        wasOutsideRef.current = true;
        return;
      }

      const shouldSnap = instant || wasOutsideRef.current;
      wasOutsideRef.current = false;

      const unitPx = unitPxRef.current;
      const enterRange = viewportHeight * (serviceSideEntryEnabled && !isMobile ? 0.78 : 0.46);
      const sectionScroll = -servicesTop;
      const sectionProgress = clamp(
        sectionScroll / Math.max(1, servicesBoxHeight - viewportHeight * 0.82),
        0,
        1
      );
      const groupCruise = easeInOutQuint(clamp((sectionProgress - 0.54) / 0.28, 0, 1));
      const groupRelease = easeInOutQuint(clamp((sectionProgress - 0.88) / 0.12, 0, 1));
      const groupShiftY = lerp(0, -14, groupCruise) + lerp(0, -24, groupRelease);
      section.style.setProperty("--services-release-y", `${groupShiftY.toFixed(2)}px`);

      // Kicker exit follows visible stack
      if (cards.length && isMobile) {
        const frontCard = cards[cards.length - 1];
        const lockedTop = metricsRef.current[cards.length - 1]?.cardTop || 0;
        const scrolledUp = Math.max(0, lockedTop - frontCard.getBoundingClientRect().top);
        const kickerExit = clamp(scrolledUp / Math.max(1, 200 * unitPx), 0, 1);
        section.style.setProperty("--services-kicker-exit", kickerExit.toFixed(3));
      } else if (cards.length) {
        const stackTop = Math.min(...cards.map((c) => c.getBoundingClientRect().top));
        const approach = Math.max(0, 170 * unitPx - stackTop);
        const kickerExit = clamp(approach / Math.max(1, 130 * unitPx), 0, 1);
        section.style.setProperty("--services-kicker-exit", kickerExit.toFixed(3));
      } else {
        section.style.setProperty("--services-kicker-exit", "0");
      }

      const desktopTimeline = !isMobile;
      const firstNormalTop = metricsRef.current[0]?.normalTop || 0;
      const introDelay = viewportHeight * (serviceSideEntryEnabled ? 0.14 : 0.08);

      const cardData = cards.map((card, index) => {
        const metrics = metricsRef.current[index] || {
          cardTop: parseFloat(window.getComputedStyle(card).top) || 0,
          normalTop: card.offsetTop,
          cardWidth: card.offsetWidth,
          cardHeight: card.offsetHeight,
        };
        const distance = metrics.normalTop - sectionScroll - metrics.cardTop;
        const entryTrigger = introDelay + (metrics.normalTop - firstNormalTop);
        const progress = desktopTimeline
          ? clamp((sectionScroll - entryTrigger) / enterRange, 0, 1)
          : clamp(1 - distance / enterRange, 0, 1);

        return { progress };
      });

      // Batch read bounding rects before mutating styles to prevent forced reflows
      const cardTops = cards.map((c) => c.getBoundingClientRect().top);

      cards.forEach((card, index) => {
        const state = cardStates.current[index];
        const metrics = metricsRef.current[index] || {
          cardTop: 0,
          normalTop: card.offsetTop,
          cardWidth: card.offsetWidth,
          cardHeight: card.offsetHeight,
        };
        const ownProgress = cardData[index].progress;
        const flatStack = isMobile;

        const depth = clamp(
          cardData.slice(index + 1).reduce((sum, item, laterIndex) => {
            const nextIndex = index + laterIndex + 1;
            const nextTop = cardTops[nextIndex] ?? Infinity;
            const overlapProgress = flatStack
              ? 0
              : clamp(
                  (metrics.cardTop + 150 * unitPx - nextTop) / Math.max(1, 180 * unitPx),
                  0,
                  1
                );
            const weight = Math.max(0.36, 1 - laterIndex * 0.22);
            const layeredProgress = flatStack
              ? easeInOutQuint(clamp((item.progress - 0.04) / 0.82, 0, 1))
              : Math.max(
                  easeOutCubic(clamp(item.progress / 0.96, 0, 1)),
                  easeOutCubic(overlapProgress)
                );
            return sum + layeredProgress * weight;
          }, 0),
          0,
          2.7
        );

        const sideEntry = serviceSideEntryEnabled && !flatStack;
        const cardSlot = slots[index];
        if (cardSlot) cardSlot.style.transform = "";

        const enterProgress = sideEntry ? easeInOut(ownProgress) : easeOutCubic(ownProgress);
        const readLift = lerp(0, -1, groupCruise) + lerp(0, -1, groupRelease);

        const sideDirection = index % 2 === 0 ? -1 : 1;
        const cardWidth = metrics.cardWidth || card.offsetWidth;
        const cardHeight = metrics.cardHeight || card.offsetHeight;
        const sideEntryOffset = viewportWidth * 0.52 + cardWidth * 0.58;
        const sideEntryRest = 1 - enterProgress;

        const targetX = sideEntry ? sideDirection * sideEntryOffset * sideEntryRest : 0;
        const targetRotateZ = sideEntry ? sideDirection * lerp(8.5, 0, enterProgress) : 0;
        const targetRotateY = sideEntry ? sideDirection * lerp(-7, 0, enterProgress) : 0;
        const bottomEntryOffset = Math.max(viewportHeight * 0.72, cardHeight * 1.15);
        const recedeY = flatStack
          ? 0
          : lerp(sideEntry ? 74 : bottomEntryOffset, 0, enterProgress) - depth * 16 + readLift;
        const recedeZ = flatStack ? 0 : -depth * 28;
        const scale = flatStack ? 1 : 1 - depth * 0.018;
        const active = ownProgress > 0.04;

        card.classList.toggle("is-active", active);
        card.classList.toggle("is-next", ownProgress < 0.08);
        card.classList.toggle("is-stacked", depth > 0.01);
        card.style.zIndex = String(10 + index);
        if (cardSlot) cardSlot.style.zIndex = String(10 + index);

        if (shouldSnap || reducedMotion) {
          state.x = targetX;
          state.y = recedeY;
          state.z = recedeZ;
          state.scale = scale;
          state.rotateX = 0;
          state.rotateY = targetRotateY;
          state.rotateZ = targetRotateZ;
        } else {
          state.x = lerp(state.x, targetX, 0.18);
          state.y = lerp(state.y, recedeY, 0.18);
          state.z = lerp(state.z, recedeZ, 0.16);
          state.scale = lerp(state.scale, scale, 0.18);
          state.rotateX = lerp(state.rotateX, 0, 0.18);
          state.rotateY = lerp(state.rotateY, targetRotateY, 0.18);
          state.rotateZ = lerp(state.rotateZ, targetRotateZ, 0.18);
        }

        if (flatStack) {
          card.style.transform = "";
        } else {
          const cardPerspective = sideEntry
            ? `perspective(${(1800 * unitPx).toFixed(2)}px) `
            : "";
          card.style.transform =
            cardPerspective +
            `translate3d(${state.x.toFixed(2)}px, ${state.y.toFixed(2)}px, ${state.z.toFixed(2)}px) ` +
            `rotateX(${state.rotateX.toFixed(2)}deg) rotateY(${state.rotateY.toFixed(2)}deg) ` +
            `rotateZ(${state.rotateZ.toFixed(2)}deg) ` +
            `scale(${state.scale.toFixed(4)})`;
        }
      });
    },
    [reducedMotion, syncMetrics]
  );

  // Set side-entry modifier class on document body
  useEffect(() => {
    document.body.classList.add("services-side-entry");
    return () => {
      document.body.classList.remove("services-side-entry");
    };
  }, []);

  // Continuous physics RAF loop (0.18 lerp damping) matching Emblematica render tick
  useEffect(() => {
    syncMetrics();
    updateServiceCards(true);

    let rafId = 0;
    let isMounted = true;

    const loop = () => {
      if (!isMounted) return;
      try {
        updateServiceCards(false);
      } catch (err) {
        console.error("Error updating service cards:", err);
      }
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const handleResize = () => {
      syncMetrics();
      updateServiceCards(true);
    };

    window.addEventListener("resize", handleResize, { passive: true });

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined") {
      ro = new ResizeObserver(() => {
        syncMetrics();
      });
      if (sectionRef.current) ro.observe(sectionRef.current);
    }

    if (typeof document !== "undefined" && document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        syncMetrics();
      });
    }

    const t1 = setTimeout(syncMetrics, 100);
    const t2 = setTimeout(syncMetrics, 500);

    return () => {
      isMounted = false;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("resize", handleResize);
      if (ro) ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [reducedMotion, syncMetrics, updateServiceCards]);

  // Video playback management via IntersectionObserver (plays 1 screen ahead, pauses when away)
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
