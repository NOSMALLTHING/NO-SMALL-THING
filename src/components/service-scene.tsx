"use client";

import { useState, type ReactNode } from "react";
import { motion } from "motion/react";
import { useCinematicMotion } from "./ui/use-cinematic-motion";

export function ServiceScene({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const enabled = useCinematicMotion();
  return <motion.li className="service-scene" data-active={active || undefined}
    onViewportEnter={() => setActive(true)} onViewportLeave={() => setActive(false)} viewport={{ amount: 0.45 }}>
    <motion.span aria-hidden="true" className="scene-rule"
      initial={enabled ? { scaleX: 0 } : false}
      whileInView={enabled ? { scaleX: 1 } : undefined}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }} />
    {children}
  </motion.li>;
}
