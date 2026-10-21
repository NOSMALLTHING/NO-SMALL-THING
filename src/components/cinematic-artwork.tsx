"use client";

import { useRef, type ReactNode } from "react";
import { motion, useScroll, useSpring, useTransform } from "motion/react";
import { useCinematicMotion } from "./ui/use-cinematic-motion";

export function CinematicArtwork({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const enabled = useCinematicMotion(true);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const frame = useTransform(scrollYProgress, [0, .3, 1], ["inset(0% 0%)", "inset(0% 0%)", "inset(7% 5%)"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, .97]);
  const y = useTransform(scrollYProgress, [0, 1], [0, -24]);
  const invitation = useTransform(scrollYProgress, [0, .25], [1, 0]);
  const lookX = useSpring(0, { stiffness: 65, damping: 24 });
  const lookY = useSpring(0, { stiffness: 65, damping: 24 });
  return <div className="hero-scene" ref={ref}>
    <motion.section className="home-hero" aria-labelledby="hero-title" style={{ clipPath: enabled ? frame : undefined }}
      onPointerMove={event => {
        if (!enabled || event.pointerType !== "mouse") return;
        const rect = event.currentTarget.getBoundingClientRect();
        lookX.set(((event.clientX - rect.left) / rect.width - .5) * 1.4);
        lookY.set(-((event.clientY - rect.top) / rect.height - .5));
      }} onPointerLeave={() => { lookX.set(0); lookY.set(0); }}>
      <h1 id="hero-title" className="sr-only">NO SMALL THING — Transcend Everything</h1>
      <figure className="hero-figure"><motion.div className="hero-artwork" style={{ scale: enabled ? scale : 1, y: enabled ? y : 0, rotateY: enabled ? lookX : 0, rotateX: enabled ? lookY : 0, transformPerspective: 1800 }}>{children}</motion.div></figure>
      <motion.a className="hero-scroll" href="#hero-end" aria-label="Scroll beyond the opening scene" style={{ opacity: enabled ? invitation : 1 }}>
        <span className="eyebrow">SCROLL TO EXPLORE</span><span className="hero-scroll-line" aria-hidden="true" />
      </motion.a>
    </motion.section>
  </div>;
}
