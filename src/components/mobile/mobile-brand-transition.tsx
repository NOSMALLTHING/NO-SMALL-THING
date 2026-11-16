"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion, useMotionValue, useReducedMotion, useScroll, useTransform } from "motion/react";
import styles from "./mobile-brand-transition.module.css";

const BRAND_SCROLL_DISTANCE = 460;
const BRAND_LEFT = 14;
const BRAND_TOP = 21;

/** The hero wordmark scales into the exact mobile masthead position. */
export function MobileBrandTransition({ isLight }: { isLight: boolean }) {
  const [viewport, setViewport] = useState({ width: 390, height: 844 });
  const [wordmarkSize, setWordmarkSize] = useState({ width: 140, height: 23 });
  const [isParked, setIsParked] = useState(false);
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const { scrollY } = useScroll();
  const brandScrollY = useMotionValue(0);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    // The brand component only animates on phones. Reset before paint so a
    // restored browser scroll position can never render the parked logo first.
    if (window.matchMedia("(max-width: 767px)").matches) {
      window.__lenis?.scrollTo(0, { immediate: true });
      window.scrollTo(0, 0);
    }

    brandScrollY.set(0);
    const unsubscribeScroll = scrollY.on("change", (value) => brandScrollY.set(value));
    const updateParkedState = (value: number) => {
      setIsParked(reducedMotion || value >= BRAND_SCROLL_DISTANCE);
    };

    updateParkedState(0);
    const unsubscribeParked = brandScrollY.on("change", updateParkedState);
    return () => {
      unsubscribeScroll();
      unsubscribeParked();
    };
  }, [brandScrollY, reducedMotion, scrollY]);

  useEffect(() => {
    let mounted = true;
    const updateViewport = () => {
      if (mounted) setViewport({ width: window.innerWidth, height: window.innerHeight });
    };
    const updateWordmarkSize = () => {
      if (!mounted) return;
      const bounds = wordmarkRef.current?.getBoundingClientRect();
      if (bounds && bounds.width > 0 && bounds.height > 0) {
        setWordmarkSize({ width: bounds.width, height: bounds.height });
      }
    };

    updateViewport();
    updateWordmarkSize();
    window.addEventListener("resize", updateViewport, { passive: true });
    const observer = wordmarkRef.current && typeof ResizeObserver !== "undefined"
      ? new ResizeObserver(updateWordmarkSize)
      : null;
    if (observer && wordmarkRef.current) observer.observe(wordmarkRef.current);
    document.fonts?.ready.then(updateWordmarkSize);

    return () => {
      mounted = false;
      window.removeEventListener("resize", updateViewport);
      observer?.disconnect();
    };
  }, []);

  const startScale = (viewport.width * 0.82) / Math.max(wordmarkSize.width, 1);
  const startX = viewport.width / 2 - BRAND_LEFT - (wordmarkSize.width * startScale) / 2;
  const startY = viewport.height * 0.45 - BRAND_TOP - (wordmarkSize.height * startScale) / 2;
  const x = useTransform(brandScrollY, [0, BRAND_SCROLL_DISTANCE], [startX, 0]);
  const y = useTransform(brandScrollY, [0, BRAND_SCROLL_DISTANCE], [startY, 0]);
  const scale = useTransform(brandScrollY, [0, BRAND_SCROLL_DISTANCE], [startScale, 1]);

  return (
    <motion.div
      className={`${styles.brand} mobile-brand-transition`}
      data-light={isLight ? "true" : "false"}
      data-parked={isParked ? "true" : "false"}
      style={reducedMotion ? { x: 0, y: 0, scale: 1 } : { x, y, scale }}
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
        <span ref={wordmarkRef} className={styles.wordmark} aria-hidden="true">NO SMALL THING</span>
      </Link>
    </motion.div>
  );
}
