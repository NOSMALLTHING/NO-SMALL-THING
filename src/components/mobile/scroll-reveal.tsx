"use client";

import { useEffect, useState, type ReactNode } from "react";
import { motion, useReducedMotion } from "motion/react";

/** A touch-sized right-to-left entrance for sections that use a pinned wipe on desktop. */
export function MobileScrollReveal({ children }: { children: ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const query = window.matchMedia("(max-width: 767px)");
    const update = () => setIsMobile(query.matches);
    update();
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);

  const enabled = isMobile && !reducedMotion;

  return (
    <motion.div
      initial={enabled ? { opacity: 0.65, x: "12%" } : false}
      whileInView={enabled ? { opacity: 1, x: 0 } : undefined}
      viewport={{ once: true, amount: 0.08 }}
      transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
