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

const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));
const lerp = (start: number, end: number, progress: number) => start + (end - start) * progress;
const easeInOut = (t: number) => 0.5 * (1 - Math.cos(Math.PI * t));
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);

export function ServicesCardDeck() {
  const sectionRef = useRef<HTMLElement>(null);
  const kickerRef = useRef<HTMLParagraphElement>(null);
  const cardRefs = useRef<(HTMLElement | null)[]>([]);
  const slotRefs = useRef<(HTMLDivElement | null)[]>([]);
  const reducedMotion = useReducedMotion();

  const updateDeck = useCallback(() => {
    const section = sectionRef.current;
    if (!section || reducedMotion) return;

    const vh = window.innerHeight || document.documentElement.clientHeight;
    const vw = window.innerWidth || document.documentElement.clientWidth;
    const isMobile = vw <= 900;
    const sectionRect = section.getBoundingClientRect();

    // Skip if section is far offscreen
    if (sectionRect.bottom < -vh * 0.5 || sectionRect.top > vh * 1.5) return;

    const cards = cardRefs.current.filter(Boolean) as HTMLElement[];
    const slots = slotRefs.current.filter(Boolean) as HTMLDivElement[];
    if (!cards.length) return;

    const enterRange = vh * (isMobile ? 0.46 : 0.78);
    const unitPx = isMobile ? Math.min(vw * 0.0023, 0.92) : Math.min(vw * 0.0006944, vh * 0.0013158);

    // Kicker exit translation
    if (kickerRef.current) {
      const stackTop = Math.min(...cards.map((c) => c.getBoundingClientRect().top));
      const approach = Math.max(0, 170 * unitPx - stackTop);
      const kickerExit = clamp(approach / Math.max(1, 130 * unitPx), 0, 1);
      section.style.setProperty("--services-kicker-exit", kickerExit.toFixed(3));
    }

    // Measure card progression and depth
    const cardData = slots.map((slot) => {
      const slotRect = slot.getBoundingClientRect();
      const cardTop = parseFloat(window.getComputedStyle(slot).top) || 0;
      const distance = slotRect.top - cardTop;
      const progress = clamp(1 - distance / enterRange, 0, 1);
      return { progress, top: slotRect.top, cardTop };
    });

    cards.forEach((card, index) => {
      const { progress, cardTop } = cardData[index];

      if (isMobile) {
        card.style.transform = "";
        return;
      }

      // Calculate depth based on subsequent cards stacking on top
      const depth = clamp(
        cardData.slice(index + 1).reduce((sum, item, laterIndex) => {
          const nextTop = item.top;
          const overlapProgress = clamp(
            (cardTop + 150 * unitPx - nextTop) / Math.max(1, 180 * unitPx),
            0,
            1
          );
          const weight = Math.max(0.36, 1 - laterIndex * 0.22);
          return sum + easeOutCubic(overlapProgress) * weight;
        }, 0),
        0,
        2.7
      );

      const sideDirection = index % 2 === 0 ? -1 : 1;
      const enterProgress = easeInOut(progress);
      const sideEntryOffset = vw * 0.52 + card.offsetWidth * 0.58;
      const sideEntryRest = 1 - enterProgress;

      const targetX = sideDirection * sideEntryOffset * sideEntryRest;
      const targetRotateZ = sideDirection * lerp(8.5, 0, enterProgress);
      const targetRotateY = sideDirection * lerp(-7, 0, enterProgress);
      const recedeY = lerp(74, 0, enterProgress) - depth * 16;
      const recedeZ = -depth * 28;
      const scale = 1 - depth * 0.018;

      card.style.transform = `perspective(1800px) translate3d(${targetX.toFixed(
        2
      )}px, ${recedeY.toFixed(2)}px, ${recedeZ.toFixed(2)}px) rotateY(${targetRotateY.toFixed(
        2
      )}deg) rotateZ(${targetRotateZ.toFixed(2)}deg) scale(${scale.toFixed(4)})`;

      card.classList.toggle("is-active", progress > 0.04);
    });
  }, [reducedMotion]);

  useEffect(() => {
    document.body.classList.add("services-side-entry");
    return () => {
      document.body.classList.remove("services-side-entry");
    };
  }, []);

  useEffect(() => {
    let rafId = 0;
    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        updateDeck();
      });
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    const attachLenis = () => {
      if (window.__lenis) {
        window.__lenis.on("scroll", scheduleUpdate);
        return true;
      }
      return false;
    };

    let checkLenisTimer: NodeJS.Timeout | null = null;
    if (!attachLenis()) {
      checkLenisTimer = setInterval(() => {
        if (attachLenis() && checkLenisTimer) clearInterval(checkLenisTimer);
      }, 100);
      setTimeout(() => {
        if (checkLenisTimer) clearInterval(checkLenisTimer);
      }, 3000);
    }

    updateDeck();
    const t1 = setTimeout(updateDeck, 100);
    const t2 = setTimeout(updateDeck, 400);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (checkLenisTimer) clearInterval(checkLenisTimer);
      if (window.__lenis) {
        window.__lenis.off("scroll", scheduleUpdate);
      }
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [updateDeck]);

  return (
    <section
      ref={sectionRef}
      className="services"
      id="selected-work"
      aria-label="What we do best"
      data-theme="dark"
    >
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
                      autoPlay
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
