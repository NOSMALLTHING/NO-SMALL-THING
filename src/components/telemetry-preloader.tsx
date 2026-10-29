"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import styles from "./telemetry-preloader.module.css";

const COUNT_MS = 1400;
const EXIT_MS = 700;

export function TelemetryPreloader() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [leaving, setLeaving] = useState(false);
  const [progress, setProgress] = useState(0);
  const frameRef = useRef<number | null>(null);
  const doneRef = useRef(false);

  const finish = useCallback(() => {
    if (doneRef.current) return;
    doneRef.current = true;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    try {
      sessionStorage.setItem("nst-intro-seen", "1");
    } catch {}
    window.dispatchEvent(new CustomEvent("nst-intro-complete"));
    document.body.style.overflow = "";
    setActive(false);
  }, []);

  const play = useCallback(() => {
    doneRef.current = false;
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    setProgress(0);
    setLeaving(false);
    setActive(true);
    document.body.style.overflow = "hidden";
    const start = performance.now();

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / COUNT_MS);
      const eased = 1 - Math.pow(1 - t, 2.5);
      setProgress(Math.floor(eased * 100));
      if (t < 1) {
        frameRef.current = requestAnimationFrame(tick);
        return;
      }
      setProgress(100);
      window.setTimeout(() => setLeaving(true), 120);
    };

    frameRef.current = requestAnimationFrame(tick);
  }, []);

  useEffect(() => {
    setMounted(true);

    let seen = false;
    try {
      seen = sessionStorage.getItem("nst-intro-seen") === "1";
    } catch {}

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!seen && !reduced) {
      play();
    } else {
      window.dispatchEvent(new CustomEvent("nst-intro-complete"));
    }

    const onReplay = () => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      play();
    };

    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") finish();
    };

    window.addEventListener("nst-intro-replay", onReplay);
    window.addEventListener("keydown", onKey);

    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
      window.removeEventListener("nst-intro-replay", onReplay);
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [play, finish]);

  useEffect(() => {
    if (!leaving) return;
    const timer = window.setTimeout(finish, EXIT_MS);
    return () => window.clearTimeout(timer);
  }, [leaving, finish]);

  if (!mounted || !active) return null;

  return (
    <aside className={`${styles.overlay} ${leaving ? styles.overlayLeaving : ""}`} aria-label="Website loading intro" role="status">
      <div className={styles.counter}>{progress}%</div>
      <button type="button" className={styles.skip} onClick={finish}>
        ESC
      </button>
    </aside>
  );
}
