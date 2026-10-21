"use client";

import { useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

export function ServiceScene({ children }: { children: ReactNode }) {
  const [active, setActive] = useState(false);
  const reduced = useReducedMotion();
  return <motion.li className="service-scene" data-active={active || undefined}
    onViewportEnter={() => setActive(true)} onViewportLeave={() => setActive(false)} viewport={{ amount: .65 }}>
    <motion.span aria-hidden="true" className="scene-rule" initial={false}
      whileInView={reduced ? undefined : { scaleX: [0, 1] }} viewport={{ once: true, amount: .5 }}
      transition={{ duration: .9, ease: [.22, 1, .36, 1] }} />
    {children}
  </motion.li>;
}
