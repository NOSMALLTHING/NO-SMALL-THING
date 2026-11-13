"use client";

import { useEffect, useRef, useCallback } from "react";
import { useReducedMotion } from "motion/react";

const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));

interface TextSegment {
  type: "text";
  content: string;
}

interface HotspotSegment {
  type: "hotspot";
  id: string;
  label: string;
}

type Segment = TextSegment | HotspotSegment;

const SEGMENTS: Segment[] = [
  {
    type: "text",
    content:
      "First we make it make sense. Then we make it look good. We analyse your task and create a ",
  },
  {
    type: "hotspot",
    id: "vision",
    label: "project vision",
  },
  {
    type: "text",
    content:
      ": three possible ways the brand or website can develop. Each one includes a ",
  },
  {
    type: "hotspot",
    id: "idea",
    label: "creative idea",
  },
  {
    type: "text",
    content: ", mood board and references, so from the start you can choose the ",
  },
  {
    type: "hotspot",
    id: "mood",
    label: "idea and mood",
  },
  {
    type: "text",
    content: " behind the future project.",
  },
];

export function CreativeMethod() {
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const lastActiveIndexRef = useRef<number>(-999);
  const reducedMotion = useReducedMotion();

  const updateScrollCopy = useCallback(() => {
    const copyEl = copyRef.current;
    if (!copyEl) return;

    const chars = Array.from(copyEl.querySelectorAll<HTMLSpanElement>(".scroll-char"));
    if (!chars.length) return;

    if (reducedMotion) {
      chars.forEach((c) => {
        c.style.color = "#dadada";
      });
      return;
    }

    const vh = window.innerHeight || document.documentElement.clientHeight;
    const rect = copyEl.getBoundingClientRect();

    if (rect.bottom < 0 || rect.top > vh) return;

    const scrollRange = Math.max(1, rect.height + vh * 0.32);
    const progress = clamp((vh * 0.82 - rect.top) / scrollRange, 0, 1);
    const activeIndex = Math.floor(progress * chars.length) - 1;

    if (lastActiveIndexRef.current === activeIndex) return;
    lastActiveIndexRef.current = activeIndex;

    chars.forEach((char, index) => {
      char.style.color = index <= activeIndex ? "#dadada" : "#323232";
    });
  }, [reducedMotion]);

  useEffect(() => {
    let rafId = 0;
    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        updateScrollCopy();
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

    updateScrollCopy();
    const t1 = setTimeout(updateScrollCopy, 60);
    const t2 = setTimeout(updateScrollCopy, 250);
    const t3 = setTimeout(updateScrollCopy, 600);

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
      clearTimeout(t3);
    };
  }, [updateScrollCopy]);

  return (
    <section
      ref={sectionRef}
      className="method"
      id="method"
      aria-label="Creative method"
      data-theme="dark"
    >
      <div className="method-shell">
        <p className="method-kicker">creative method</p>

        <p className="method-copy scroll-copy" ref={copyRef}>
          {SEGMENTS.map((seg, sIdx) => {
            if (seg.type === "hotspot") {
              return (
                <button
                  key={seg.id}
                  className="method-hotspot underline-accent"
                  data-method-hover={seg.id}
                  type="button"
                  aria-label={seg.label}
                >
                  <span className="method-hotspot-label">
                    {Array.from(seg.label).map((char, cIdx) =>
                      char === " " ? (
                        " "
                      ) : (
                        <span className="scroll-char" key={cIdx}>
                          {char}
                        </span>
                      )
                    )}
                  </span>
                  <span className="method-hotspot-line" aria-hidden="true" />
                </button>
              );
            }

            return Array.from(seg.content).map((char, cIdx) =>
              char === " " ? (
                " "
              ) : (
                <span className="scroll-char" key={`${sIdx}-${cIdx}`}>
                  {char}
                </span>
              )
            );
          })}
        </p>
      </div>
    </section>
  );
}
