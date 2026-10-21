"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll } from "motion/react";
import { useCinematicMotion } from "./ui/use-cinematic-motion";
import { Container } from "./ui/container";
import { SectionLabel } from "./ui/section-label";
import styles from "./our-approach.module.css";
import { EditorialHeading } from "./ui/editorial-heading";

const stages = [
  { number: "01", title: "Discover", description: "Understand your needs, business goals and the problem we’re here to solve." },
  { number: "02", title: "Design", description: "Shape the user experience, visual direction and technical plan around a clear purpose." },
  { number: "03", title: "Develop", description: "Build and integrate the website, software or AI solution, bringing the plan to life." },
  { number: "04", title: "Deliver", description: "Test, refine and deliver a practical solution that’s ready for you to use." },
] as const;

export function OurApproach() {
  const reducedMotion = useReducedMotion();
  const ref = useRef<HTMLElement>(null);
  const enabled = useCinematicMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 50%", "end 70%"] });

  return <section ref={ref} id="approach" className={styles.section} aria-labelledby="approach-title">
    <Container>
      <SectionLabel className={styles.label}>OUR APPROACH</SectionLabel>
      <EditorialHeading id="approach-title" className={styles.title} lines={["THINK BEYOND.", "BUILD WITH PURPOSE."]} />
      <div className={styles.progress} aria-hidden="true"><motion.span style={{ scaleX: enabled ? scrollYProgress : 1 }} /></div>
      <ol className={styles.stages} role="list">
        {stages.map((stage, index) => <motion.li
          key={stage.number}
          className={styles.stage}
          initial={false}
          whileInView={reducedMotion ? undefined : { clipPath: ["inset(0% 100% 0% 0%)", "inset(0% 0% 0% 0%)"] }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.8, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.number} aria-hidden="true">{stage.number}</span>
          <div className={styles.copy}><h3>{stage.title}</h3><p>{stage.description}</p></div>
        </motion.li>)}
      </ol>
    </Container>
  </section>;
}
