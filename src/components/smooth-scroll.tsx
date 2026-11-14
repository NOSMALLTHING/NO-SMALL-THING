"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "motion/react";
import Lenis from "lenis";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

/**
 * Cinematic smooth scrolling powered by Lenis.
 * The wheel stays close to the picture. A short lerp keeps the handoff scrubbed to the scroll.
 * Automatically bypassed on touch devices and for reduced-motion preferences.
 */
export function SmoothScroll() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    // Respect user motion preferences and touch/mobile devices
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (reducedMotion || !isFinePointer) return;

    const lenis = new Lenis({
      lerp: 0.22,
      smoothWheel: true,
      syncTouch: false,
    });

    lenisRef.current = lenis;
    window.__lenis = lenis;

    let rafId: number;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Smooth anchor navigation (#services, #approach, #about, #top)
    const handleAnchorClick = (event: MouseEvent) => {
      const anchor = (event.target as HTMLElement).closest<HTMLAnchorElement>("a[href*='#']");
      if (!anchor) return;

      const url = new URL(anchor.href, window.location.href);
      // If navigating to another page with a hash, record it for post-transition scroll
      if (url.pathname !== window.location.pathname) {
        if (url.hash && url.hash !== "#top") {
          sessionStorage.setItem("nst_scroll_target", url.hash);
        }
        return;
      }

      const hash = url.hash;
      if (!hash) return;

      if (hash === "#top") {
        event.preventDefault();
        lenis.scrollTo(0, { duration: 1.2 });
        return;
      }

      const target = document.querySelector(hash);
      if (target) {
        event.preventDefault();
        lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1.2 });
      }
    };

    document.addEventListener("click", handleAnchorClick, { capture: true });

    return () => {
      document.removeEventListener("click", handleAnchorClick, { capture: true });
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
      delete window.__lenis;
    };
  }, [reducedMotion]);

  // Reset scroll position on route transitions or scroll to pending anchor target
  useEffect(() => {
    const pendingTarget =
      typeof window !== "undefined"
        ? sessionStorage.getItem("nst_scroll_target") || (window.location.hash && window.location.hash !== "#top" ? window.location.hash : null)
        : null;

    if (pendingTarget && pendingTarget.startsWith("#") && pendingTarget !== "#top") {
      sessionStorage.removeItem("nst_scroll_target");
      let attempts = 0;
      const scrollToPending = () => {
        const target = document.querySelector(pendingTarget);
        if (target) {
          if (lenisRef.current) {
            lenisRef.current.scrollTo(target as HTMLElement, { offset: 0, duration: 1.2 });
          } else {
            target.scrollIntoView({ behavior: "smooth" });
          }
        } else if (attempts < 15) {
          attempts++;
          setTimeout(scrollToPending, 60);
        }
      };
      setTimeout(scrollToPending, 80);
    } else {
      if (lenisRef.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
    }
  }, [pathname]);

  return null;
}
