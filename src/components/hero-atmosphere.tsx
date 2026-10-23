"use client";

import { useEffect, useRef } from "react";
import styles from "./hero-atmosphere.module.css";

interface Star {
  x: number;
  y: number;
  size: number;
  alpha: number;
  speed: number;
  phase: number;
}

export function HeroAtmosphere() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.parentElement?.clientWidth || window.innerWidth);
    let height = (canvas.height = canvas.parentElement?.clientHeight || window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.parentElement?.clientWidth || window.innerWidth;
      height = canvas.height = canvas.parentElement?.clientHeight || window.innerHeight;
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Generate 45 realistic distant stars concentrated in upper dark space
    const stars: Star[] = Array.from({ length: 45 }, () => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.65),
      size: Math.random() * 1.3 + 0.4,
      alpha: Math.random() * 0.7 + 0.25,
      speed: Math.random() * 0.008 + 0.003,
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;
    const render = () => {
      ctx.clearRect(0, 0, width, height);
      time += 0.015;

      for (let i = 0; i < stars.length; i++) {
        const s = stars[i];
        // Organic star twinkle
        const currentAlpha = s.alpha * (0.6 + 0.4 * Math.sin(time * s.speed * 100 + s.phase));

        ctx.fillStyle = `rgba(240, 236, 231, ${currentAlpha})`;
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
        ctx.fill();

        // Slow horizontal cosmic drift
        s.x -= s.speed * 15;
        if (s.x < 0) s.x = width;
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={styles.atmosphereWrap} aria-hidden="true">
      {/* 1. Deep Space Starfield Canvas */}
      <canvas ref={canvasRef} className={styles.starCanvas} />

      {/* 2. Planetary Atmospheric Corona / Sunrise Glow */}
      <div className={styles.planetCorona} />

      {/* 3. Anamorphic Cinema Lens Flare Line */}
      <div className={styles.lensGlow} />
    </div>
  );
}
