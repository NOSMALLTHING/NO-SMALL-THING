"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { OurServices } from "./our-services";
import { SelectedWork } from "./selected-work";
import { useCinematicMotion } from "./ui/use-cinematic-motion";
import styles from "./home-stage.module.css";

/** 420vh of services choreography, then a 200vh exit, then a 180vh reveal. */
const CONTENT_SCROLL = 420;
const EXIT_SCROLL = 200;
const REVEAL_SCROLL = 180;
const TOTAL_SCROLL = CONTENT_SCROLL + EXIT_SCROLL + REVEAL_SCROLL;
const CONTENT_END = CONTENT_SCROLL / TOTAL_SCROLL;
const EXIT_END = (CONTENT_SCROLL + EXIT_SCROLL) / TOTAL_SCROLL;

function glide(amount: number) {
  const t = Math.min(1, Math.max(0, amount));
  return t < 0.5 ? 4 * t * t * t : 1 - ((-2 * t + 2) ** 3) / 2;
}

function revealAmount(progress: number) {
  if (progress <= EXIT_END) return 0;
  if (progress >= 1) return 1;
  return glide((progress - EXIT_END) / (1 - EXIT_END));
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
  const exitProgress = useTransform(scrollYProgress, (value) => {
    if (value <= CONTENT_END) return 0;
    if (value >= EXIT_END) return 1;
    return (value - CONTENT_END) / (EXIT_END - CONTENT_END);
  });
  const workX = useTransform(scrollYProgress, (value) => `${(1 - revealAmount(value)) * 100}%`);
  const workScale = useTransform(scrollYProgress, (value) => 1.045 - revealAmount(value) * 0.045);

  const syncPin = (value: number) => {
    if (!enabled) {
      setPinned(false);
      return;
    }
    const next = value > CONTENT_END + 0.001 && value < 0.999;
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
      <OurServices trackRef={trackRef} progress={contentProgress} exitProgress={exitProgress} handoff />
      <div ref={anchorRef} className={styles.workAnchor}>
        <div className={pinned ? styles.workViewport : undefined}>
          <motion.div ref={panelRef} className={styles.workPlane} style={{ x: pinned && enabled ? workX : 0 }}>
            <motion.div className={styles.workSettle} style={{ scale: pinned && enabled ? workScale : 1 }}>
              <SelectedWork immediateHeading />
            </motion.div>
          </motion.div>
        </div>
      </div>
    </>
  );
}
