"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** Progressive enhancement: content is visible even before JS or with reduced motion. */
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const reducedMotion = useReducedMotion();
  return <motion.div
    className={className}
    initial={false}
    whileInView={reducedMotion ? undefined : { y: [12, 0] }}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
  >{children}</motion.div>;
}
