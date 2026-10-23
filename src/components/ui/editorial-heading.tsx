"use client";

import { motion, type Variants } from "motion/react";
import { useCinematicMotion } from "./use-cinematic-motion";

const glyphVariants: Variants = {
  hidden: { y: "110%", rotateX: 55, opacity: 0 },
  visible: (order: number) => ({
    y: "0%",
    rotateX: 0,
    opacity: 1,
    transition: {
      duration: 0.85,
      delay: Math.min(order * 0.015, 0.32),
      ease: [0.22, 1, 0.36, 1] as const,
    },
  }),
};

/** Keep the accessible heading intact; the visible glyphs turn into the page as one phrase. */
export function EditorialHeading({ lines, id, className = "", as: Heading = "h2" }: { lines: readonly string[]; id: string; className?: string; as?: "h1" | "h2" }) {
  const enabled = useCinematicMotion();
  let character = 0;
  return <Heading id={id} className={className} aria-label={lines.join(" ")}>
    {lines.map(line => <span className="editorial-line" aria-hidden="true" key={line}>
      {line.split(" ").map((word, wordIndex) => <span key={`${word}-${wordIndex}`}>
        {wordIndex > 0 && " "}<span className="editorial-word">{Array.from(word).map((letter, index) => {
          const order = character++;
          return <motion.span key={index} className="editorial-glyph"
            variants={glyphVariants}
            custom={order}
            initial={enabled ? "hidden" : false}
            whileInView={enabled ? "visible" : undefined}
            viewport={{ once: true, amount: 0.25 }}>{letter}</motion.span>;
        })}</span>
      </span>)}
    </span>)}
  </Heading>;
}
