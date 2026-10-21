"use client";

import { motion, useReducedMotion } from "motion/react";
import type { ReactNode } from "react";

/** A quiet aperture reveal, separate from the image's hover transform. */
export function SceneReveal({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  return <motion.div className="scene-reveal" initial={false}
    whileInView={reduced ? undefined : { clipPath: ["inset(12% 0% 12% 0%)", "inset(0% 0% 0% 0%)"] }}
    viewport={{ once: true, amount: .18 }} transition={{ duration: 1.1, ease: [.22, 1, .36, 1] }}>
    {children}
  </motion.div>;
}
