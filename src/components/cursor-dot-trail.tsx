"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import styles from "./cursor-dot-trail.module.css";

const CELL = 4;
const DOT_GAP = 5;

export function CursorDotTrail() {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d", { alpha: true });
    if (!canvas || !context) return;

    let width = 0;
    let height = 0;
    let cols = 0;
    let rows = 0;
    let field = new Float32Array(0);
    let velocityX = new Float32Array(0);
    let velocityY = new Float32Array(0);
    let lastX = 0;
    let lastY = 0;
    let hasLast = false;
    let frame = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      cols = Math.ceil(width / CELL);
      rows = Math.ceil(height / CELL);
      field = new Float32Array(cols * rows);
      velocityX = new Float32Array(cols * rows);
      velocityY = new Float32Array(cols * rows);
      hasLast = false;
    };

    const stamp = (x: number, y: number, dx: number, dy: number, radius: number, amount: number) => {
      const minCol = Math.max(0, Math.floor((x - radius) / CELL));
      const maxCol = Math.min(cols - 1, Math.ceil((x + radius) / CELL));
      const minRow = Math.max(0, Math.floor((y - radius) / CELL));
      const maxRow = Math.min(rows - 1, Math.ceil((y + radius) / CELL));
      const reach = radius * radius;
      for (let row = minRow; row <= maxRow; row++) {
        for (let col = minCol; col <= maxCol; col++) {
          const px = col * CELL + CELL / 2;
          const py = row * CELL + CELL / 2;
          const ox = px - x;
          const oy = py - y;
          const distance = ox * ox + oy * oy;
          if (distance > reach) continue;
          const falloff = Math.exp(-distance / (radius * radius * 0.22));
          const index = row * cols + col;
          field[index] = Math.min(1.8, field[index] + falloff * amount);
          velocityX[index] += dx * falloff * 0.035;
          velocityY[index] += dy * falloff * 0.035;
        }
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;
      if (!hasLast) {
        lastX = event.clientX;
        lastY = event.clientY;
        hasLast = true;
        return;
      }
      const dx = event.clientX - lastX;
      const dy = event.clientY - lastY;
      const speed = Math.hypot(dx, dy);
      const radius = Math.max(86, Math.min(168, 162 - speed * 0.72));
      const amount = Math.max(0.22, Math.min(0.78, 0.74 - speed * 0.0045));
      const steps = Math.max(1, Math.ceil(speed / 10));
      for (let step = 1; step <= steps; step++) {
        const t = step / steps;
        stamp(lastX + dx * t, lastY + dy * t, dx, dy, radius, amount);
      }
      lastX = event.clientX;
      lastY = event.clientY;
    };

    const drawDot = (x: number, y: number, radius: number, alpha: number) => {
      context.globalAlpha = alpha;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
    };

    const draw = () => {
      context.clearRect(0, 0, width, height);
      context.fillStyle = "#ffffff";
      for (let index = 0; index < field.length; index++) {
        field[index] *= 0.965;
        velocityX[index] *= 0.94;
        velocityY[index] *= 0.94;
      }
      for (let y = DOT_GAP / 2; y < height; y += DOT_GAP) {
        const row = Math.min(rows - 1, (y / CELL) | 0);
        for (let x = DOT_GAP / 2; x < width; x += DOT_GAP) {
          const col = Math.min(cols - 1, (x / CELL) | 0);
          const index = row * cols + col;
          const energy = field[index];
          if (energy < 0.045) continue;
          const shift = Math.min(energy, 1);
          const px = x + velocityX[index] * (0.35 + shift);
          const py = y + velocityY[index] * (0.35 + shift);
          drawDot(px, py, 0.55, Math.min(0.28, energy * 0.34));
          if (energy > 0.22) drawDot(px, py, 0.95, Math.min(0.62, (energy - 0.18) * 0.85));
          if (energy > 0.55) {
            drawDot(px, py, 1.35, Math.min(0.95, (energy - 0.45) * 1.15));
            drawDot(px + DOT_GAP * 0.45, py + DOT_GAP * 0.2, 0.7, Math.min(0.55, (energy - 0.5) * 0.9));
          }
        }
      }
      context.globalAlpha = 1;
      frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    frame = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;
  return <canvas ref={canvasRef} className={styles.trail} aria-hidden="true" />;
}