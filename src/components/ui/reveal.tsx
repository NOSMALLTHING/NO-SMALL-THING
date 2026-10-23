"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useCinematicMotion } from "./use-cinematic-motion";

/** Progressive enhancement: content is visible even before JS or with reduced motion. */
export function Reveal({ children, className = "", delay = 0 }: { children: ReactNode; className?: string; delay?: number }) {
  const enabled = useCinematicMotion();
  return <motion.div
    className={className}
    initial={enabled ? { opacity: 0, y: 16 } : false}
    whileInView={enabled ? { opacity: 1, y: 0 } : undefined}
    viewport={{ once: true, amount: 0.15 }}
    transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
  >{children}</motion.div>;
}
