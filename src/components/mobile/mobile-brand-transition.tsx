"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from "motion/react";
import styles from "./mobile-brand-transition.module.css";

const BRAND_SCROLL_DISTANCE = 460;

interface TargetMetrics {
  viewportWidth: number;
  viewportHeight: number;
  targetLeft: number;
  targetTop: number;
  targetWidth: number;
  targetHeight: number;
}

export function MobileBrandTransition({
  isLight,
  anchorRef,
}: {
  isLight: boolean;
  anchorRef?: React.RefObject<HTMLAnchorElement | null>;
}) {
  const [metrics, setMetrics] = useState<TargetMetrics>({
    viewportWidth: typeof window !== "undefined" ? window.innerWidth : 390,
    viewportHeight: typeof window !== "undefined" ? window.innerHeight : 844,
    targetLeft: 14,
    targetTop: 21,
    targetWidth: 140,
    targetHeight: 23,
  });

  const [isParked, setIsParked] = useState(false);
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const { scrollY } = useScroll();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    let mounted = true;
    const timers: (NodeJS.Timeout | number)[] = [];

    const updateMetrics = () => {
      if (!mounted) return;
      const vw = typeof window !== "undefined" ? window.innerWidth : 390;
      const vh = typeof window !== "undefined" ? window.innerHeight : 844;

      let left = 14;
      let top = 21;
      let width = 140;
      let height = 23;

      const anchor = anchorRef?.current;
      if (anchor) {
        const rect = anchor.getBoundingClientRect();
        if (rect.width > 20 && rect.width < vw) {
          width = rect.width;
        }
        if (rect.height > 10 && rect.height < 100) {
          height = rect.height;
        }
        // Guard against transient corrupted coordinates (e.g. during animations or layout recalculation)
        if (rect.left > 0 && rect.left < vw * 0.45) {
          left = rect.left;
        }
        if (rect.top >= 0 && rect.top < 120) {
          top = rect.top;
        }
      } else if (wordmarkRef.current) {
        const ow = wordmarkRef.current.offsetWidth;
        const oh = wordmarkRef.current.offsetHeight;
        if (ow > 20 && ow < vw) width = ow;
        if (oh > 10 && oh < 100) height = oh;
      }

      setMetrics({
        viewportWidth: vw,
        viewportHeight: vh,
        targetLeft: left,
        targetTop: top,
        targetWidth: width,
        targetHeight: height,
      });
    };

    updateMetrics();
    const rafId = requestAnimationFrame(updateMetrics);

    const handleOrientationChange = () => {
      updateMetrics();
      requestAnimationFrame(updateMetrics);
      timers.push(setTimeout(updateMetrics, 50));
      timers.push(setTimeout(updateMetrics, 150));
      timers.push(setTimeout(updateMetrics, 300));
      timers.push(setTimeout(updateMetrics, 500));
    };

    window.addEventListener("resize", updateMetrics, { passive: true });
    window.addEventListener("orientationchange", handleOrientationChange, { passive: true });
    if (typeof window !== "undefined" && window.visualViewport) {
      window.visualViewport.addEventListener("resize", updateMetrics, { passive: true });
    }
    document.fonts?.ready.then(updateMetrics);

    let ro: ResizeObserver | null = null;
    if (typeof ResizeObserver !== "undefined" && anchorRef?.current) {
      ro = new ResizeObserver(updateMetrics);
      ro.observe(anchorRef.current);
    }

    return () => {
      mounted = false;
      cancelAnimationFrame(rafId);
      timers.forEach((t) => clearTimeout(t));
      window.removeEventListener("resize", updateMetrics);
      window.removeEventListener("orientationchange", handleOrientationChange);
      if (typeof window !== "undefined" && window.visualViewport) {
        window.visualViewport.removeEventListener("resize", updateMetrics);
      }
      ro?.disconnect();
    };
  }, [anchorRef]);

  // Synchronize parked state with live scroll and reduced motion preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsParked(Boolean(reducedMotion) || window.scrollY >= BRAND_SCROLL_DISTANCE);
    }
  }, [reducedMotion]);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsParked(Boolean(reducedMotion) || latest >= BRAND_SCROLL_DISTANCE);
  });

  const targetWidth = Math.max(metrics.targetWidth, 1);
  const targetHeight = Math.max(metrics.targetHeight, 1);

  // In hero at scroll = 0: wordmark spans ~82% of phone screen width, capped at 380px for wide screens
  // and guaranteed to leave at least 14px edge margin on both sides
  const maxAllowedWidth = Math.max(120, Math.min(metrics.viewportWidth * 0.82, metrics.viewportWidth - 28, 380));
  const heroDesiredWidth = maxAllowedWidth;
  const startScale = Math.max(1, heroDesiredWidth / targetWidth);
  const actualHeroWidth = targetWidth * startScale;

  // Center horizontally in viewport at scroll = 0, strictly clamped within viewport boundaries
  const rawStartX = (metrics.viewportWidth - actualHeroWidth) / 2;
  const startX = Math.max(14, Math.min(rawStartX, metrics.viewportWidth - actualHeroWidth - 14));

  // Position at ~45% of viewport height at scroll = 0, strictly bounded within viewport
  const rawStartY = metrics.viewportHeight * 0.45 - (targetHeight * startScale) / 2;
  const startY = Math.max(metrics.targetTop, Math.min(rawStartY, metrics.viewportHeight - targetHeight * startScale - 40));

  const targetLeft = metrics.targetLeft;
  const targetTop = metrics.targetTop;

  // Clamped transitions: strictly clamps to [0, BRAND_SCROLL_DISTANCE] so overscroll pull-down
  // or fast scrolling down never drifts or throws coordinates out of bounds.
  const x = useTransform(scrollY, [0, BRAND_SCROLL_DISTANCE], [startX, targetLeft], { clamp: true });
  const y = useTransform(scrollY, [0, BRAND_SCROLL_DISTANCE], [startY, targetTop], { clamp: true });
  const scale = useTransform(scrollY, [0, BRAND_SCROLL_DISTANCE], [startScale, 1], { clamp: true });

  return (
    <motion.div
      className={`${styles.brand} mobile-brand-transition`}
      data-light={isLight ? "true" : "false"}
      data-parked={isParked ? "true" : "false"}
      style={reducedMotion ? { x: targetLeft, y: targetTop, scale: 1 } : { x, y, scale }}
    >
      <Link
        href="/"
        aria-label="NO SMALL THING — Home"
        onClick={(event) => {
          event.preventDefault();
          if (window.__lenis && !reducedMotion) {
            window.__lenis.scrollTo(0, { duration: 0.9, force: true });
          } else {
            window.scrollTo({ top: 0, behavior: reducedMotion ? "auto" : "smooth" });
          }
        }}
      >
        <span ref={wordmarkRef} className={styles.wordmark} aria-hidden="true">
          NO SMALL THING
        </span>
      </Link>
    </motion.div>
  );
}
