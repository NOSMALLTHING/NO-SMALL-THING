"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { useCinematicMotion } from "./ui/use-cinematic-motion";
import { Container, Grid } from "./ui/container";
import { SectionLabel } from "./ui/section-label";
import styles from "./brand-introduction.module.css";

/** Readable SSR; masked words follow native scroll progress in either direction. */
export function BrandIntroduction() {
  const ref = useRef<HTMLElement>(null);
  const enabled = useCinematicMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 12%"] });
  const first = useTransform(scrollYProgress, [.08, .68], ["105%", "0%"]);
  const second = useTransform(scrollYProgress, [.22, .85], ["105%", "0%"]);
  const copyOpacity = useTransform(scrollYProgress, [.45, .82], [0, 1]);
  const copyY = useTransform(scrollYProgress, [.45, .82], [18, 0]);

  return (
    <section ref={ref} className={styles.section} data-theme="light" aria-labelledby="brand-introduction-title">
      <Container>
        <SectionLabel className={styles.label}>THREE MINDS. ONE AMBITION.</SectionLabel>

        <h2 id="brand-introduction-title" className={styles.title} aria-label="STAY BIG.">
          {["STAY", "BIG."].map((word, index) => (
            <span className={styles.wordMask} key={word} aria-hidden="true">
              <motion.span
                className={styles.word}
                style={{ y: enabled ? (index === 0 ? first : second) : 0 }}
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h2>

        <Grid className={styles.copy}>
          <motion.p
            className={styles.statement}
            style={{ opacity: enabled ? copyOpacity : 1, y: enabled ? copyY : 0 }}
          >
            Great things start small.
          </motion.p>
          <motion.p
            className={styles.description}
            style={{ opacity: enabled ? copyOpacity : 1, y: enabled ? copyY : 0 }}
          >
            We turn ideas into meaningful digital experiences through technology,
            creativity, and thoughtful execution.
          </motion.p>
        </Grid>
      </Container>
    </section>
  );
}
