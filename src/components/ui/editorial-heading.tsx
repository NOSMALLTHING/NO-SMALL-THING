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

/** Keep the accessible heading intact; the visible glyphs turn into the page as one phrase. Supports *word* or italicWords for editorial serif italic accents. */
export function EditorialHeading({
  lines,
  id,
  className = "",
  as: Heading = "h2",
  italicWords = []
}: {
  lines: readonly string[];
  id: string;
  className?: string;
  as?: "h1" | "h2";
  italicWords?: readonly string[];
}) {
  const enabled = useCinematicMotion();
  let character = 0;
  const accessibleLabel = lines.map(l => l.replace(/\*/g, "")).join(" ");

  return (
    <Heading id={id} className={className} aria-label={accessibleLabel}>
      {lines.map(line => (
        <span className="editorial-line" aria-hidden="true" key={line}>
          {line.split(" ").map((rawWord, wordIndex) => {
            const hasStar = rawWord.startsWith("*") && rawWord.endsWith("*");
            const cleanWord = rawWord.replace(/^\*|\*$/g, "");
            const wordOnly = cleanWord.replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "");
            const isItalic =
              hasStar ||
              italicWords.some(
                w =>
                  w.toLowerCase() === wordOnly.toLowerCase() ||
                  w.toLowerCase() === cleanWord.toLowerCase()
              );

            return (
              <span key={`${rawWord}-${wordIndex}`}>
                {wordIndex > 0 && " "}
                <span className={`editorial-word ${isItalic ? "serif-accent" : ""}`}>
                  {Array.from(cleanWord).map((letter, index) => {
                    const order = character++;
                    return (
                      <motion.span
                        key={index}
                        className="editorial-glyph"
                        variants={glyphVariants}
                        custom={order}
                        initial={enabled ? "hidden" : false}
                        whileInView={enabled ? "visible" : undefined}
                        viewport={{ once: true, amount: 0.25 }}
                      >
                        {letter}
                      </motion.span>
                    );
                  })}
                </span>
              </span>
            );
          })}
        </span>
      ))}
    </Heading>
  );
}
