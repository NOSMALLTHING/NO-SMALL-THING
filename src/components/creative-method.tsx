"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { useReducedMotion } from "motion/react";

const clamp = (val: number, min: number, max: number) => Math.min(max, Math.max(min, val));
const lerp = (from: number, to: number, amount: number) => from + (to - from) * amount;
const easeInOut = (t: number) => {
  const c = clamp(t, 0, 1);
  return c * c * (3 - 2 * c);
};
const easeOutCubic = (t: number) => {
  const c = clamp(t, 0, 1);
  return 1 - Math.pow(1 - c, 3);
};

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

// Concept preview board images per hotspot group
const METHOD_PREVIEWS: Record<string, string[]> = {
  vision: [
    "/brand/method/vision-1.webp",
    "/brand/method/vision-2.webp",
    "/brand/method/vision-3.webp",
    "/brand/method/vision-4.webp",
    "/brand/method/vision-5.webp",
    "/brand/method/vision-6.webp",
  ],
  idea: ["/brand/method/idea-1.webp", "/brand/method/idea-2.webp"],
  mood: [
    "/brand/method/mood-1.webp",
    "/brand/method/mood-2.webp",
    "/brand/method/mood-3.webp",
    "/brand/method/mood-4.webp",
    "/brand/method/mood-5.webp",
    "/brand/method/mood-6.webp",
  ],
};

export function CreativeMethod() {
  const [isPhone, setIsPhone] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const copyRef = useRef<HTMLParagraphElement>(null);
  const lastActiveIndexRef = useRef<number>(-999);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsPhone(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  // Floating cursor preview state
  const previewTimerRef = useRef<number>(0);
  const previewIndexRef = useRef<number>(0);
  const previewPointRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const activeGroupRef = useRef<string>("");
  const isPinnedRef = useRef<boolean>(false);

  // Character-by-character color illumination
  const updateScrollCopy = useCallback(() => {
    const copyEl = copyRef.current;
    if (!copyEl) return;

    const chars = Array.from(copyEl.querySelectorAll<HTMLSpanElement>(".scroll-char"));
    if (!chars.length) return;

    const isMobile = window.matchMedia("(max-width: 767px)").matches;

    if (reducedMotion) {
      chars.forEach((c) => {
        c.style.color = isMobile ? "#ffffff" : "#dadada";
      });
      return;
    }

    const vh = window.innerHeight || document.documentElement.clientHeight;
    const rect = copyEl.getBoundingClientRect();
    let progress: number;

    if (isMobile) {
      const sectionTop = sectionRef.current?.getBoundingClientRect().top ?? rect.top;
      progress = clamp((vh - sectionTop) / vh, 0, 1);
    } else {
      if (rect.bottom < 0 || rect.top > vh) return;
      const scrollRange = Math.max(1, rect.height + vh * 0.32);
      progress = clamp((vh * 0.82 - rect.top) / scrollRange, 0, 1);
    }

    const activeIndex = Math.floor(progress * chars.length) - 1;

    if (lastActiveIndexRef.current === activeIndex) return;
    lastActiveIndexRef.current = activeIndex;

    chars.forEach((char, index) => {
      char.style.color = index <= activeIndex ? "#dadada" : "#323232";
    });
  }, [reducedMotion]);

  // Mobile scroll is native and event-driven; avoid running an idle RAF loop.
  useEffect(() => {
    let rafId = 0;
    let isMounted = true;

    if (isPhone) {
      const scheduleUpdate = () => {
        if (rafId) return;
        rafId = requestAnimationFrame(() => {
          rafId = 0;
          updateScrollCopy();
        });
      };

      scheduleUpdate();
      window.addEventListener("scroll", scheduleUpdate, { passive: true });
      window.addEventListener("resize", scheduleUpdate, { passive: true });
      return () => {
        isMounted = false;
        if (rafId) cancelAnimationFrame(rafId);
        window.removeEventListener("scroll", scheduleUpdate);
        window.removeEventListener("resize", scheduleUpdate);
      };
    }

    const loop = () => {
      if (!isMounted) return;
      updateScrollCopy();
      rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const scheduleUpdate = () => {
      updateScrollCopy();
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });

    if (window.__lenis) {
      window.__lenis.on("scroll", scheduleUpdate);
    }

    return () => {
      isMounted = false;
      if (rafId) cancelAnimationFrame(rafId);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      if (window.__lenis) {
        window.__lenis.off("scroll", scheduleUpdate);
      }
    };
  }, [isPhone, updateScrollCopy]);

  // Method Cursor Preview (Polaroid/Moodboard Card Spawner)
  const stopMethodPreview = useCallback(() => {
    if (previewTimerRef.current) {
      window.clearInterval(previewTimerRef.current);
      previewTimerRef.current = 0;
    }
    document
      .querySelectorAll(".method-cursor-preview")
      .forEach((preview) => preview.classList.add("is-leaving"));
  }, []);

  const getMethodPreviewPoint = useCallback(() => {
    const isMobile = window.matchMedia("(max-width: 900px)").matches;
    const width = isMobile ? window.innerWidth * 0.7 : Math.min(window.innerWidth * 0.34, 320);
    const height = width / 1.68;
    const x = clamp(previewPointRef.current.x, width * 0.52 + 8, window.innerWidth - width * 0.52 - 8);
    const y = clamp(previewPointRef.current.y, height * 0.52 + 8, window.innerHeight - height * 0.52 - 8);
    return { x, y };
  }, []);

  const showMethodPreviewFrame = useCallback(
    (group: string) => {
      const images = METHOD_PREVIEWS[group];
      if (!images || !images.length) return;

      const imageSrc = images[previewIndexRef.current % images.length];
      const isMobile = window.matchMedia("(max-width: 900px)").matches;

      const preview = document.createElement("div");
      const { x, y } = getMethodPreviewPoint();
      const direction = previewIndexRef.current % 2 === 0 ? -1 : 1;
      const jitterX = (Math.random() - 0.5) * (isMobile ? 20 : 34);
      const jitterY = (Math.random() - 0.5) * (isMobile ? 14 : 22);
      const rotateStart = direction * (5.5 + Math.random() * 2.5);
      const rotateEnd = direction * (1.5 + Math.random() * 3);

      preview.className = "method-cursor-preview";
      preview.setAttribute("aria-hidden", "true");
      preview.style.setProperty("--preview-ratio", "1.68");
      preview.style.setProperty("--preview-image", `url("${imageSrc}")`);
      preview.style.setProperty("--preview-x", `${(x + jitterX).toFixed(2)}px`);
      preview.style.setProperty("--preview-y-start", `${(y + 62 + jitterY).toFixed(2)}px`);
      preview.style.setProperty("--preview-y-peak", `${(y - 14 + jitterY).toFixed(2)}px`);
      preview.style.setProperty("--preview-y-end", `${(y + 18 + jitterY).toFixed(2)}px`);
      preview.style.setProperty("--preview-rotate-start", `${rotateStart.toFixed(2)}deg`);
      preview.style.setProperty("--preview-rotate-end", `${rotateEnd.toFixed(2)}deg`);
      preview.style.zIndex = String(90 + (previewIndexRef.current % 50));

      document.body.appendChild(preview);
      window.setTimeout(() => preview.classList.add("is-leaving"), 1160);
      window.setTimeout(() => preview.remove(), 1840);
      previewIndexRef.current += 1;
    },
    [getMethodPreviewPoint]
  );

  const startMethodPreview = useCallback(
    (group: string) => {
      stopMethodPreview();
      previewIndexRef.current = 0;
      showMethodPreviewFrame(group);
      previewTimerRef.current = window.setInterval(() => {
        if (!activeGroupRef.current) return;
        showMethodPreviewFrame(activeGroupRef.current);
      }, 480);
    },
    [stopMethodPreview, showMethodPreviewFrame]
  );

  const updatePreviewPoint = useCallback(
    (eventOrEl: React.PointerEvent | React.MouseEvent | React.FocusEvent | HTMLElement) => {
      let x = window.innerWidth * 0.5;
      let y = window.innerHeight * 0.5;

      if ("clientX" in eventOrEl && typeof eventOrEl.clientX === "number") {
        x = eventOrEl.clientX;
        y = eventOrEl.clientY;
      } else if (eventOrEl instanceof HTMLElement) {
        const rect = eventOrEl.getBoundingClientRect();
        x = rect.left + rect.width * 0.55;
        y = rect.top + rect.height * 0.5;
      } else if ("currentTarget" in eventOrEl && eventOrEl.currentTarget instanceof HTMLElement) {
        const rect = eventOrEl.currentTarget.getBoundingClientRect();
        x = rect.left + rect.width * 0.55;
        y = rect.top + rect.height * 0.5;
      }

      previewPointRef.current = { x, y };
    },
    []
  );

  const handleHotspotEnter = useCallback(
    (group: string, e: React.PointerEvent<HTMLButtonElement>) => {
      updatePreviewPoint(e);
      if (!isPinnedRef.current) {
        activeGroupRef.current = group;
        startMethodPreview(group);
      }
    },
    [updatePreviewPoint, startMethodPreview]
  );

  const handleHotspotMove = useCallback(
    (group: string, e: React.PointerEvent<HTMLButtonElement>) => {
      updatePreviewPoint(e);
      if (!isPinnedRef.current && activeGroupRef.current !== group) {
        activeGroupRef.current = group;
        startMethodPreview(group);
      }
    },
    [updatePreviewPoint, startMethodPreview]
  );

  const handleHotspotLeave = useCallback(() => {
    if (!isPinnedRef.current) {
      activeGroupRef.current = "";
      stopMethodPreview();
    }
  }, [stopMethodPreview]);

  const handleHotspotClick = useCallback(
    (group: string, e: React.MouseEvent<HTMLButtonElement>) => {
      updatePreviewPoint(e);
      const isMobile = window.matchMedia("(max-width: 900px)").matches;
      if (isMobile) {
        if (activeGroupRef.current === group && isPinnedRef.current) {
          isPinnedRef.current = false;
          activeGroupRef.current = "";
          stopMethodPreview();
        } else {
          isPinnedRef.current = true;
          activeGroupRef.current = group;
          startMethodPreview(group);
        }
      }
    },
    [updatePreviewPoint, startMethodPreview, stopMethodPreview]
  );

  // Global document click unpin listener & cleanup on unmount
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      if (!isPinnedRef.current) return;
      const target = e.target as HTMLElement | null;
      if (target && target.closest(".method-hotspot")) return;
      isPinnedRef.current = false;
      activeGroupRef.current = "";
      stopMethodPreview();
    };

    document.addEventListener("click", handleDocumentClick);
    return () => {
      document.removeEventListener("click", handleDocumentClick);
      stopMethodPreview();
      document
        .querySelectorAll(".method-cursor-preview")
        .forEach((preview) => preview.remove());
    };
  }, [stopMethodPreview]);

  useEffect(() => {
    if (!isPhone) return;
    const cancelPreviewOnScroll = () => {
      if (!activeGroupRef.current) return;
      activeGroupRef.current = "";
      isPinnedRef.current = false;
      stopMethodPreview();
    };

    window.addEventListener("scroll", cancelPreviewOnScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", cancelPreviewOnScroll);
    };
  }, [isPhone, stopMethodPreview]);

  return (
    <>
      <section
        ref={sectionRef}
        className="method"
        id="method"
        aria-label="Creative method"
        data-theme="dark"
      >
        <span
          id="creative"
          style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
          aria-hidden="true"
        />
        <span
          id="approach"
          style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
          aria-hidden="true"
        />
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
                    onPointerEnter={(e) => handleHotspotEnter(seg.id, e)}
                    onPointerMove={(e) => handleHotspotMove(seg.id, e)}
                    onPointerLeave={handleHotspotLeave}
                    onFocus={(e) => {
                      updatePreviewPoint(e);
                      activeGroupRef.current = seg.id;
                      startMethodPreview(seg.id);
                    }}
                    onBlur={() => {
                      if (!isPinnedRef.current) {
                        activeGroupRef.current = "";
                        stopMethodPreview();
                      }
                    }}
                    onClick={(e) => handleHotspotClick(seg.id, e)}
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
    </>
  );
}
