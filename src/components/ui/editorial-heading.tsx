"use client";

import { motion, useReducedMotion } from "motion/react";

/** Keep the accessible heading intact; the visible glyphs turn into the page as one phrase. */
export function EditorialHeading({ lines, id, className = "", as: Heading = "h2" }: { lines: readonly string[]; id: string; className?: string; as?: "h1" | "h2" }) {
  const reduced = useReducedMotion();
  let character = 0;
  return <Heading id={id} className={className} aria-label={lines.join(" ")}>
    {lines.map(line => <span className="editorial-line" aria-hidden="true" key={line}>
      {line.split(" ").map((word, wordIndex) => <span key={`${word}-${wordIndex}`}>
        {wordIndex > 0 && " "}<span className="editorial-word">{Array.from(word).map((letter, index) => {
          const order = character++;
          return <motion.span key={index} className="editorial-glyph" initial={false}
            whileInView={reduced ? undefined : { y: ["112%", "0%"], rotateX: [60, 0], opacity: [.35, 1] }}
            viewport={{ once: true, amount: .7 }} transition={{ duration: .9, delay: Math.min(order * .014, .34), ease: [.22, 1, .36, 1] }}>{letter}</motion.span>;
        })}</span>
      </span>)}
    </span>)}
  </Heading>;
}
