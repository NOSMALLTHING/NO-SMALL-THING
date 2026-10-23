"use client";

import type { ReactNode } from "react";
import { motion, useSpring } from "motion/react";
import { useCinematicMotion } from "./use-cinematic-motion";

/** Pointer-driven depth, with a damped return; touch devices keep a flat composition. */
export function SpatialSurface({ children, strength = 3, className = "" }: { children: ReactNode; strength?: number; className?: string }) {
  const enabled = useCinematicMotion(true);
  const rotateX = useSpring(0, { stiffness: 110, damping: 24, mass: .65 });
  const rotateY = useSpring(0, { stiffness: 110, damping: 24, mass: .65 });
  const reset = () => { rotateX.set(0); rotateY.set(0); };

  return <div className={`spatial-surface ${className}`} onPointerLeave={reset} onPointerCancel={reset} onBlur={reset}
    onPointerMove={event => {
      if (!enabled || event.pointerType !== "mouse") return;
      if (event.buttons !== 0) { reset(); return; }
      const rect = event.currentTarget.getBoundingClientRect();
      rotateY.set(((event.clientX - rect.left) / rect.width - .5) * strength * 2);
      rotateX.set(-((event.clientY - rect.top) / rect.height - .5) * strength * 1.4);
    }}>
    <motion.div className="spatial-plane" style={{ rotateX: enabled ? rotateX : 0, rotateY: enabled ? rotateY : 0, transformPerspective: 1200 }}>{children}</motion.div>
  </div>;
}
