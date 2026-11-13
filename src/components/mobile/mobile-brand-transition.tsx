"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import styles from "./mobile-brand-transition.module.css";

const BRAND_SCROLL_DISTANCE = 460;

/** Uses the official wordmark and moves it into the mobile masthead as the hero scrolls away. */
export function MobileBrandTransition({ isLight }: { isLight: boolean }) {
  const [viewport, setViewport] = useState({ width: 390, height: 844 });
  const { scrollY } = useScroll();
  const easedScroll = useSpring(scrollY, { stiffness: 110, damping: 26, mass: 0.55 });
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const updateViewport = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    updateViewport();
    window.addEventListener("resize", updateViewport, { passive: true });
    return () => window.removeEventListener("resize", updateViewport);
  }, []);

  const startWidth = viewport.width * 0.82;
  const endWidth = viewport.width * 0.18;
  const logoHeight = startWidth * (148 / 1220);
  const left = useTransform(easedScroll, [0, BRAND_SCROLL_DISTANCE], [viewport.width / 2, 14]);
  const top = useTransform(easedScroll, [0, BRAND_SCROLL_DISTANCE], [viewport.height * 0.45, 22]);
  const width = useTransform(easedScroll, [0, BRAND_SCROLL_DISTANCE], [startWidth, endWidth]);
  const x = useTransform(easedScroll, [0, BRAND_SCROLL_DISTANCE], [-startWidth / 2, 0]);
  const y = useTransform(easedScroll, [0, BRAND_SCROLL_DISTANCE], [-logoHeight / 2, 0]);

  return (
    <motion.div
      className={`${styles.brand} mobile-brand-transition`}
      data-light={isLight ? "true" : "false"}
      style={reducedMotion
        ? { left: 14, top: 22, width: endWidth, x: 0, y: 0 }
        : { left, top, width, x, y }}
    >
      <Link
        href="/"
        aria-label="NO SMALL THING — Home"
        onClick={(event) => {
          event.preventDefault();
          window.dispatchEvent(new CustomEvent("nst-intro-replay"));
        }}
      >
        <img src="/brand/wordmark-white.png" alt="" className={styles.wordmark} />
      </Link>
    </motion.div>
  );
}
