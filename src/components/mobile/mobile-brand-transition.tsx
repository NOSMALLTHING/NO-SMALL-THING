"use client";

import Link from "next/link";
import { useEffect, useState, useRef } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import styles from "./mobile-brand-transition.module.css";

const BRAND_SCROLL_DISTANCE = 460;
const BRAND_LEFT = 14;
const BRAND_TOP = 21;

/** The hero wordmark scales into the exact mobile masthead position. */
export function MobileBrandTransition({ isLight }: { isLight: boolean }) {
  const [viewport, setViewport] = useState({ width: 390, height: 844 });
  const [wordmarkSize, setWordmarkSize] = useState({ width: 140, height: 23 });
  const wordmarkRef = useRef<HTMLSpanElement>(null);
  const { scrollY } = useScroll();
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const updateViewport = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    const updateWordmarkSize = () => {
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
      window.removeEventListener("resize", updateViewport);
      observer?.disconnect();
    };
  }, []);

  const startScale = (viewport.width * 0.82) / Math.max(wordmarkSize.width, 1);
  const startX = viewport.width / 2 - BRAND_LEFT - (wordmarkSize.width * startScale) / 2;
  const startY = viewport.height * 0.45 - BRAND_TOP - (wordmarkSize.height * startScale) / 2;
  const x = useTransform(scrollY, [0, BRAND_SCROLL_DISTANCE], [startX, 0]);
  const y = useTransform(scrollY, [0, BRAND_SCROLL_DISTANCE], [startY, 0]);
  const scale = useTransform(scrollY, [0, BRAND_SCROLL_DISTANCE], [startScale, 1]);

  return (
    <motion.div
      className={`${styles.brand} mobile-brand-transition`}
      data-light={isLight ? "true" : "false"}
      style={reducedMotion ? { x: 0, y: 0, scale: 1 } : { x, y, scale }}
    >
      <Link
        href="/"
        aria-label="NO SMALL THING — Home"
        onClick={(event) => {
          event.preventDefault();
          window.dispatchEvent(new CustomEvent("nst-intro-replay"));
        }}
      >
        <span ref={wordmarkRef} className={styles.wordmark} aria-hidden="true">NO SMALL THING</span>
      </Link>
    </motion.div>
  );
}
