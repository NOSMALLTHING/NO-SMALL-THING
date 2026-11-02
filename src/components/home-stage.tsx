"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { OurServices } from "./our-services";
import { SelectedWork } from "./selected-work";
import { useCinematicMotion } from "./ui/use-cinematic-motion";
import styles from "./home-stage.module.css";

/** First 420vh keeps the services choreography. The last 150vh slides that scene out. */
const CONTENT_END = 420 / 570;

function slideAmount(progress: number) {
  if (progress <= CONTENT_END) return 0;
  if (progress >= 1) return 1;
  return (progress - CONTENT_END) / (1 - CONTENT_END);
}

export function HomeStage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const enabled = useCinematicMotion(true);
  const [pinned, setPinned] = useState(false);

  const { scrollYProgress } = useScroll({
    target: trackRef,
    offset: ["start start", "end end"],
  });

  const contentProgress = useTransform(scrollYProgress, (value) => {
    if (value <= 0) return 0;
    if (value >= CONTENT_END) return 1;
    return value / CONTENT_END;
  });
  const servicesX = useTransform(scrollYProgress, (value) => `${-slideAmount(value) * 100}%`);
  const workX = useTransform(scrollYProgress, (value) => `${(1 - slideAmount(value)) * 100}%`);

  const syncPin = (value: number) => {
    if (!enabled) {
      setPinned(false);
      return;
    }
    const amount = slideAmount(value);
    const next = amount > 0.001 && amount < 0.999;
    setPinned((current) => (current === next ? current : next));
  };

  useMotionValueEvent(scrollYProgress, "change", syncPin);

  useEffect(() => {
    syncPin(scrollYProgress.get());
  }, [enabled, scrollYProgress]);

  useLayoutEffect(() => {
    const panel = panelRef.current;
    const anchor = anchorRef.current;
    if (!panel || !anchor) return;
    if (!pinned) {
      anchor.style.minHeight = "";
      return;
    }
    const apply = () => {
      anchor.style.minHeight = `${panel.offsetHeight}px`;
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(panel);
    return () => observer.disconnect();
  }, [pinned]);

  return (
    <>
      <OurServices trackRef={trackRef} progress={contentProgress} planeX={servicesX} handoff />
      <div ref={anchorRef} className={styles.workAnchor}>
        <div className={pinned ? styles.workViewport : undefined}>
          <motion.div ref={panelRef} className={styles.workPlane} style={{ x: pinned && enabled ? workX : 0 }}>
            <SelectedWork immediateHeading />
          </motion.div>
        </div>
      </div>
    </>
  );
}
