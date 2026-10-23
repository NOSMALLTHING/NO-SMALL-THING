"use client";

import { motion } from "motion/react";
import type { ReactNode } from "react";
import { useCinematicMotion } from "./use-cinematic-motion";

/** A quiet aperture reveal, separate from the image's hover transform. */
export function SceneReveal({ children }: { children: ReactNode }) {
  const enabled = useCinematicMotion();
  return <motion.div
    className="scene-reveal"
    initial={enabled ? { clipPath: "inset(8% 0% 8% 0%)", opacity: 0.85 } : false}
    whileInView={enabled ? { clipPath: "inset(0% 0% 0% 0%)", opacity: 1 } : undefined}
    viewport={{ once: true, amount: 0.18 }}
    transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1] }}
  >
    {children}
  </motion.div>;
}
