"use client";

import { useRef, type ReactNode } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";

/** Touch-friendly counterpart to the desktop pointer-following service media. */
export function ScrollMedia({ children, className }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [12, -12]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.985, 1.015]);

  return (
    <motion.div
      ref={ref}
      className={className}
      style={{ y: reducedMotion ? 0 : y, scale: reducedMotion ? 1 : scale }}
    >
      {children}
    </motion.div>
  );
}
