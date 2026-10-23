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
 * Tuned with a responsive 0.085 lerp for buttery momentum without scroll lag.
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
      lerp: 0.085,
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
      // Only handle in-page anchors on the same path
      if (url.pathname !== window.location.pathname) return;

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
        lenis.scrollTo(target as HTMLElement, { offset: -32, duration: 1.2 });
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

  // Reset scroll position on route transitions
  useEffect(() => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
  }, [pathname]);

  return null;
}
