"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { motion, useMotionValueEvent, useScroll, useTransform } from "motion/react";
import { OurServices } from "./our-services";
import { SelectedWork } from "./selected-work";
import { useCinematicMotion } from "./ui/use-cinematic-motion";
import styles from "./home-stage.module.css";

/** Services plays for 420vh, leaves over 200vh, and the next page begins 160vh before that exit finishes. */
const CONTENT_SCROLL = 420;
const EXIT_SCROLL = 200;
const REVEAL_LEAD = 160;
const TOTAL_SCROLL = CONTENT_SCROLL + EXIT_SCROLL + 136;
const CONTENT_END = CONTENT_SCROLL / TOTAL_SCROLL;
const EXIT_END = (CONTENT_SCROLL + EXIT_SCROLL) / TOTAL_SCROLL;
const REVEAL_START = (CONTENT_SCROLL + EXIT_SCROLL - REVEAL_LEAD) / TOTAL_SCROLL;

function arrive(amount: number) {
  const t = Math.min(1, Math.max(0, amount));
  return 1 - (1 - t) ** 2.4;
}

function revealAmount(progress: number) {
  if (progress <= REVEAL_START) return 0;
  if (progress >= 1) return 1;
  return arrive((progress - REVEAL_START) / (1 - REVEAL_START));
}

export function HomeStage() {
  const trackRef = useRef<HTMLDivElement>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const revealDoneRef = useRef(false);
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
  const edgeOpacity = useTransform(scrollYProgress, (value) => {
    const travel = 1 - revealAmount(value);
    if (travel <= 0.02) return 0;
    return Math.min(1, (travel - 0.02) * 2.8);
  });

  const syncPin = (value: number) => {
    if (!enabled) {
      revealDoneRef.current = false;
      setPinned(false);
      return;
    }
    revealDoneRef.current = value >= 0.999;
    const next = value > CONTENT_END + 0.001 && !revealDoneRef.current;
    setPinned((current) => (current === next ? current : next));
  };

  useMotionValueEvent(scrollYProgress, "change", syncPin);

  useEffect(() => {
    syncPin(scrollYProgress.get());
  }, [enabled, scrollYProgress]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track) return;
    const releaseWhite = enabled && !pinned && revealDoneRef.current;
    track.classList.toggle("handoff-released", releaseWhite);
  }, [pinned, enabled]);

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
            {pinned ? <motion.div className={styles.revealEdge} style={{ opacity: edgeOpacity }} /> : null}
            <SelectedWork immediateHeading />
          </motion.div>
        </div>
      </div>
    </>
  );
}
