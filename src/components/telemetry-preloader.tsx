"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import monogram from "../../public/brand/monogram.png";
import styles from "./telemetry-preloader.module.css";

const STATUS_STAGES = [
  { threshold: 0, index: "01", text: "OPTICAL SENSORS ONLINE" },
  { threshold: 28, index: "02", text: "SYNCHRONIZING ORBITAL TRAJECTORY" },
  { threshold: 62, index: "03", text: "TARGET ACQUIRED: MARS HORIZON" },
  { threshold: 92, index: "04", text: "SYSTEM ARMED // TRANSCEND EVERYTHING" },
];

export function TelemetryPreloader() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [opened, setOpened] = useState(false);
  const [progress, setProgress] = useState(0);
  const [telemetryValues, setTelemetryValues] = useState({
    lat: "04°12'S",
    lon: "137°26'E",
    velocity: "11.2",
    altitude: "384.2",
  });

  const animFrameRef = useRef<number | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const isFinishedRef = useRef(false);

  const finish = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    setProgress(100);
    setOpened(true);

    try {
      sessionStorage.setItem("nst-intro-seen", "1");
    } catch {}

    window.dispatchEvent(new CustomEvent("nst-intro-complete"));
    document.body.style.overflow = "";

    // Completely unmount after shutters have cleared
    const timer = setTimeout(() => {
      setActive(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setMounted(true);

    // Skip if already seen in this session
    let seen = false;
    try {
      seen = sessionStorage.getItem("nst-intro-seen") === "1";
    } catch {}

    if (seen) {
      return;
    }

    setActive(true);
    document.body.style.overflow = "hidden";

    // Duration of sequence in ms
    const TOTAL_DURATION = 1750;

    const animateProgress = (timestamp: number) => {
      if (!startTimeRef.current) startTimeRef.current = timestamp;
      const elapsed = timestamp - startTimeRef.current;
      const p = Math.min(1, elapsed / TOTAL_DURATION);

      // Ease out quad
      const eased = 1 - (1 - p) * (1 - p);
      const currentVal = Math.floor(eased * 100);
      setProgress(currentVal);

      // Jitter telemetry values slightly to simulate live telemetry data
      if (Math.random() < 0.25) {
        setTelemetryValues({
          lat: `04°${(10 + Math.floor(Math.random() * 5)).toString().padStart(2, "0")}'S`,
          lon: `137°${(24 + Math.floor(Math.random() * 5)).toString().padStart(2, "0")}'E`,
          velocity: (11.18 + Math.random() * 0.08).toFixed(2),
          altitude: (384.1 + (currentVal / 100) * 16.1).toFixed(1),
        });
      }

      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(animateProgress);
      } else {
        // Hold briefly at 100% before firing shutter split
        setTimeout(() => {
          finish();
        }, 180);
      }
    };

    animFrameRef.current = requestAnimationFrame(animateProgress);

    // Allow escape key to skip
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        finish();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
    };
  }, [finish]);

  if (!mounted || !active) return null;

  const currentStage =
    STATUS_STAGES.slice()
      .reverse()
      .find((s) => progress >= s.threshold) || STATUS_STAGES[0];

  return (
    <aside
      className={`${styles.overlay} ${opened ? styles.shutterOpened : ""}`}
      aria-label="System telemetry calibration"
      role="status"
    >
      {/* Upper and Lower Shutter Blades */}
      <div className={styles.shutterTop} aria-hidden="true" />
      <div className={styles.shutterBottom} aria-hidden="true" />

      {/* Telemetry HUD Layer */}
      <div className={styles.hudLayer}>
        {/* Top telemetry bar */}
        <div className={styles.topBar}>
          <div className={styles.telemetryGroup}>
            <span className={styles.missionTag}>
              <span className={styles.liveIndicator} aria-hidden="true" />
              MISSION NST-01 // TELEMETRY
            </span>
            <span>
              LAT {telemetryValues.lat} // LON {telemetryValues.lon}
            </span>
          </div>

          <div className={`${styles.telemetryGroup} ${styles.topRight}`}>
            <span>VELOCITY // {telemetryValues.velocity} KM/S</span>
            <span>ORBITAL ALTITUDE // {telemetryValues.altitude} KM</span>
          </div>
        </div>

        {/* Center Stage: Percentage, Laser Line, Status Readout */}
        <div className={styles.centerStage}>
          <div className={`${styles.reticleBracket} ${styles.cornerTL}`} aria-hidden="true" />
          <div className={`${styles.reticleBracket} ${styles.cornerTR}`} aria-hidden="true" />
          <div className={`${styles.reticleBracket} ${styles.cornerBL}`} aria-hidden="true" />
          <div className={`${styles.reticleBracket} ${styles.cornerBR}`} aria-hidden="true" />

          <div className={styles.counterWrap}>
            <span className={styles.counterValue}>
              {progress.toString().padStart(2, "0")}
            </span>
            <span className={styles.counterPercent}>%</span>
          </div>

          {/* Central Laser Scanning Line */}
          <div className={styles.laserBarWrap} aria-hidden="true">
            <div
              className={styles.laserBarProgress}
              style={{ width: `${progress}%` }}
            >
              <span className={styles.laserHead} />
            </div>
          </div>

          {/* Status index and label */}
          <div className={styles.statusReadout}>
            <span className={styles.statusIndex}>[{currentStage.index}]</span>
            <span className={styles.statusText}>{currentStage.text}</span>
          </div>
        </div>

        {/* Bottom bar */}
        <div className={styles.bottomBar}>
          <div className={styles.bottomBrand}>
            <Image
              src={monogram}
              alt=""
              width={18}
              height={18}
              className={styles.brandMonogram}
            />
            <span>NO SMALL THING</span>
          </div>

          <button
            type="button"
            className={styles.skipButton}
            onClick={finish}
            aria-label="Skip website intro animation"
          >
            [ ESC // SKIP ]
          </button>
        </div>
      </div>
    </aside>
  );
}
