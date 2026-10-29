"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useCinematicMotion } from "./ui/use-cinematic-motion";

export function CinematicArtwork({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useCinematicMotion(true);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const frame = useTransform(scrollYProgress, [0, .3, 1], ["inset(0% 0%)", "inset(0% 0%)", "inset(7% 5%)"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.14]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -28]);
  const invitation = useTransform(scrollYProgress, [0, .25], [1, 0]);
  const lookX = useSpring(0, { stiffness: 45, damping: 20 });
  const lookY = useSpring(0, { stiffness: 45, damping: 20 });
  const shiftX = useSpring(0, { stiffness: 45, damping: 20 });
  const shiftY = useSpring(0, { stiffness: 45, damping: 20 });

  return <div className="hero-scene" ref={ref}>
    <motion.section className="home-hero" aria-labelledby="hero-title" style={{ clipPath: enabled ? frame : undefined }}
      onPointerMove={event => {
        if (!enabled || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        const normX = (event.clientX - rect.left) / rect.width - .5;
        const normY = (event.clientY - rect.top) / rect.height - .5;
        lookX.set(normX * 5.5);
        lookY.set(-normY * 4);
        shiftX.set(normX * 10);
        shiftY.set(normY * 6);
      }} onPointerLeave={() => { lookX.set(0); lookY.set(0); shiftX.set(0); shiftY.set(0); }}>
      <h1 id="hero-title" className="sr-only">NO SMALL THING — Transcend Everything</h1>
      <figure className="hero-figure">
        <motion.div className="hero-artwork" style={{
          scale: 1,
          y: enabled ? y : 0,
          x: enabled ? shiftX : 0,
          rotateY: enabled ? lookX : 0,
          rotateX: enabled ? lookY : 0,
          transformPerspective: 1800,
        }}>
          {children}
        </motion.div>
      </figure>
      <motion.a className="hero-scroll" href="#hero-end" aria-label="Scroll beyond the opening scene" style={{ opacity: enabled ? invitation : 1 }}>
        <span className="eyebrow">SCROLL TO EXPLORE</span><span className="hero-scroll-line" aria-hidden="true" />
      </motion.a>
    </motion.section>
  </div>;
}
