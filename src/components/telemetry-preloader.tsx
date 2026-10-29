"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import styles from "./telemetry-preloader.module.css";

// The 7 canonical blocks of the NO SMALL THING pixel monogram (4x4 grid)
const MONOGRAM_BLOCKS = [
  { id: "b1", col: 0, row: 0, dx: -1.2, dy: -1.2, rot: -45 },
  { id: "b2", col: 0, row: 1, dx: -1.5, dy: -0.2, rot: -75 },
  { id: "b3", col: 0, row: 2, dx: -1.3, dy: 0.8, rot: -110 },
  { id: "b4", col: 2, row: 1, dx: 1.2, dy: -0.3, rot: 60 },
  { id: "b5", col: 2, row: 2, dx: 1.1, dy: 0.9, rot: 95 },
  { id: "b6", col: 1, row: 3, dx: -0.3, dy: 1.6, rot: 30 },
  { id: "b7", col: 3, row: 3, dx: 1.7, dy: 1.5, rot: 135 },
];

export function TelemetryPreloader() {
  const [mounted, setMounted] = useState(false);
  const [active, setActive] = useState(false);
  const [phase, setPhase] = useState<"counting" | "monogram" | "exploding" | "complete">("counting");
  const [progress, setProgress] = useState(0);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animFrameRef = useRef<number | null>(null);
  const isFinishedRef = useRef(false);

  const finish = useCallback(() => {
    if (isFinishedRef.current) return;
    isFinishedRef.current = true;

    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
    }

    try {
      sessionStorage.setItem("nst-intro-seen", "1");
    } catch {}

    window.dispatchEvent(new CustomEvent("nst-intro-complete"));
    document.body.style.overflow = "";
    setPhase("complete");
    setActive(false);
  }, []);

  // Initialize Canvas to solid black on mount
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;

    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  }, [mounted, active]);

  useEffect(() => {
    setMounted(true);

    let seen = false;
    try {
      seen = sessionStorage.getItem("nst-intro-seen") === "1";
    } catch {}

    if (seen) {
      return;
    }

    setActive(true);
    document.body.style.overflow = "hidden";

    // --- Phase 1: Minimalist Center Progress Counter (0% -> 100%) ---
    const COUNT_DURATION = 1250; // 1.25s
    const startCountTime = performance.now();

    const updateCounter = (currentTime: number) => {
      const elapsed = currentTime - startCountTime;
      const t = Math.min(1, elapsed / COUNT_DURATION);

      // Smooth modern cubic-bezier ease out
      const eased = 1 - Math.pow(1 - t, 2.5);
      const currentVal = Math.floor(eased * 100);
      setProgress(currentVal);

      if (t < 1) {
        animFrameRef.current = requestAnimationFrame(updateCounter);
      } else {
        setProgress(100);
        // Transition to Phase 2: Monogram
        setTimeout(() => {
          setPhase("monogram");

          // Hold Monogram in center for 380ms, then trigger explosion
          setTimeout(() => {
            setPhase("exploding");
          }, 380);
        }, 180);
      }
    };

    animFrameRef.current = requestAnimationFrame(updateCounter);

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

  // --- Phase 3: Organic Canvas 2D Ink Explosion (水墨风爆炸破圈) ---
  useEffect(() => {
    if (phase !== "exploding") return;

    const canvas = canvasRef.current;
    if (!canvas) {
      finish();
      return;
    }

    const ctx = canvas.getContext("2d");
    if (!ctx) {
      finish();
      return;
    }

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = (canvas.width = window.innerWidth * dpr);
    let height = (canvas.height = window.innerHeight * dpr);

    const onResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth * dpr;
      height = canvas.height = window.innerHeight * dpr;
    };
    window.addEventListener("resize", onResize);

    const centerX = width / 2;
    const centerY = height / 2;
    const maxRadius = Math.sqrt(width * width + height * height) * 0.95;

    // Splashing ink droplets
    const dropletCount = 55;
    const droplets = Array.from({ length: dropletCount }, () => {
      const angle = Math.random() * Math.PI * 2;
      const speed = (Math.random() * 24 + 10) * dpr;
      return {
        x: centerX,
        y: centerY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        radius: (Math.random() * 6 + 2) * dpr,
        alpha: 1.0,
        decay: Math.random() * 0.025 + 0.015,
      };
    });

    const BLAST_DURATION = 720; // 720ms ink explosion
    const blastStartTime = performance.now();

    const renderInkExplosion = (now: number) => {
      const elapsed = now - blastStartTime;
      const p = Math.min(1, elapsed / BLAST_DURATION);

      // Explosive expansion: fast blast initial, easing out
      const easeBlast = 1 - Math.pow(1 - p, 3);
      const currentRadius = maxRadius * easeBlast;

      ctx.clearRect(0, 0, width, height);

      // 1. Draw solid black base
      ctx.globalCompositeOperation = "source-over";
      ctx.fillStyle = "#000000";
      ctx.fillRect(0, 0, width, height);

      // 2. Punch organic ink burst hole through the black veil
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();

      const segments = 80;
      for (let i = 0; i <= segments; i++) {
        const theta = (i / segments) * Math.PI * 2;
        // Multi-frequency organic liquid harmonics for water-ink splatter contour
        const harmonic =
          1 +
          0.18 * Math.sin(3 * theta + 1.2) +
          0.12 * Math.cos(5 * theta + 2.4) +
          0.08 * Math.sin(7 * theta + 0.5) +
          0.05 * Math.cos(11 * theta + 3.1);

        const r = currentRadius * harmonic;
        const px = centerX + Math.cos(theta) * r;
        const py = centerY + Math.sin(theta) * r;

        if (i === 0) {
          ctx.moveTo(px, py);
        } else {
          ctx.lineTo(px, py);
        }
      }
      ctx.closePath();
      ctx.fill();

      // 3. Flying ink droplets puncturing ahead of the wave
      for (let i = 0; i < droplets.length; i++) {
        const d = droplets[i];
        d.x += d.vx;
        d.y += d.vy;
        d.vx *= 0.94;
        d.vy *= 0.94;
        d.alpha = Math.max(0, d.alpha - d.decay);

        if (d.alpha > 0) {
          ctx.beginPath();
          ctx.arc(d.x, d.y, d.radius, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      if (p < 1) {
        animFrameRef.current = requestAnimationFrame(renderInkExplosion);
      } else {
        // Complete! All black has been blown away by the ink explosion
        window.removeEventListener("resize", onResize);
        finish();
      }
    };

    animFrameRef.current = requestAnimationFrame(renderInkExplosion);

    return () => {
      window.removeEventListener("resize", onResize);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [phase, finish]);

  if (!mounted || !active || phase === "complete") return null;

  return (
    <aside
      className={`${styles.overlay} ${
        phase === "exploding" ? styles.overlayExploding : ""
      }`}
      aria-label="Website loading intro"
      role="status"
    >
      {/* 1. Fullscreen Canvas for Black Background & Ink Splash Tear-Through */}
      <canvas ref={canvasRef} className={styles.blastCanvas} />

      {/* 2. Phase 1: Minimalist Digital Percentage Counter in Exact Screen Center */}
      <div
        className={`${styles.counterWrap} ${
          phase !== "counting" ? styles.counterHidden : ""
        }`}
        aria-hidden={phase !== "counting"}
      >
        <span className={styles.counterText}>{progress}%</span>
      </div>

      {/* 3. Phase 2 & 3: Brand Pixel Monogram (NST 4x4 Grid) in Exact Screen Center */}
      {phase !== "counting" && (
        <div
          className={`${styles.monogramWrap} ${
            phase === "monogram"
              ? styles.monogramVisible
              : phase === "exploding"
              ? styles.monogramInitial
              : ""
          }`}
          aria-hidden="true"
        >
          {MONOGRAM_BLOCKS.map((block) => {
            const isExploding = phase === "exploding";
            const transform = isExploding
              ? `translate(${block.dx * 220}px, ${block.dy * 220}px) rotate(${
                  block.rot
                }deg) scale(0)`
              : "none";
            const opacity = isExploding ? 0 : 1;

            return (
              <div
                key={block.id}
                className={styles.monogramBlock}
                style={{
                  gridColumn: block.col + 1,
                  gridRow: block.row + 1,
                  transform,
                  opacity,
                }}
              />
            );
          })}
        </div>
      )}

      {/* 4. Discreet Skip Button */}
      <button
        type="button"
        className={styles.skipButton}
        onClick={finish}
        aria-label="Skip website intro animation"
      >
        [ ESC // SKIP ]
      </button>
    </aside>
  );
}
