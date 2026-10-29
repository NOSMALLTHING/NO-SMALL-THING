"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import styles from "./cursor-dot-trail.module.css";

const GRID_SPACING = 14;
const INFLUENCE_RADIUS = 62;
const SPRING = 0.088;
const DAMPING = 0.845;
const DECAY = 0.942;
const NEIGHBOR_PUSH = 0.032;
const NEIGHBOR_ALPHA = 0.016;

const VERT_SRC = `
attribute vec2 a_pos;
attribute float a_alpha;
attribute float a_size;
uniform vec2 u_res;
varying float v_alpha;

void main() {
  vec2 clip = (a_pos / u_res) * 2.0 - 1.0;
  clip.y = -clip.y;
  gl_Position = vec4(clip, 0.0, 1.0);
  gl_PointSize = a_size;
  v_alpha = a_alpha;
}
`;

const FRAG_SRC = `
precision mediump float;
varying float v_alpha;

void main() {
  vec2 p = abs(gl_PointCoord - vec2(0.5)) * 2.0;
  float d = length(max(p - vec2(0.38), vec2(0.0)));
  float a = smoothstep(0.62, 0.30, d);
  if (a < 0.01) discard;
  gl_FragColor = vec4(0.96, 0.96, 0.98, v_alpha * a * 0.95);
}
`;

export function CursorDotTrail() {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGLRenderingContext | null =
      (canvas.getContext("webgl2", { alpha: true, antialias: false, premultipliedAlpha: false }) as WebGLRenderingContext | null) ||
      (canvas.getContext("webgl", { alpha: true, antialias: false, premultipliedAlpha: false }) as WebGLRenderingContext | null);

    let ctx2d: CanvasRenderingContext2D | null = null;
    let program: WebGLProgram | null = null;
    let buffer: WebGLBuffer | null = null;
    let posLoc = -1;
    let alphaLoc = -1;
    let sizeLoc = -1;
    let resLoc: WebGLUniformLocation | null = null;

    if (gl) {
      const compile = (type: number, src: string) => {
        if (!gl) return null;
        const shader = gl.createShader(type);
        if (!shader) return null;
        gl.shaderSource(shader, src);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
          gl.deleteShader(shader);
          return null;
        }
        return shader;
      };

      const vs = compile(gl.VERTEX_SHADER, VERT_SRC);
      const fs = compile(gl.FRAGMENT_SHADER, FRAG_SRC);
      if (vs && fs) {
        program = gl.createProgram();
        if (program) {
          gl.attachShader(program, vs);
          gl.attachShader(program, fs);
          gl.linkProgram(program);
          if (gl.getProgramParameter(program, gl.LINK_STATUS)) {
            gl.useProgram(program);
            posLoc = gl.getAttribLocation(program, "a_pos");
            alphaLoc = gl.getAttribLocation(program, "a_alpha");
            sizeLoc = gl.getAttribLocation(program, "a_size");
            resLoc = gl.getUniformLocation(program, "u_res");
            buffer = gl.createBuffer();
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
          } else {
            gl.deleteProgram(program);
            program = null;
          }
        }
      }
    }

    if (!gl || !program) {
      gl = null;
      ctx2d = canvas.getContext("2d");
      if (!ctx2d) return;
    }

    let width = 0;
    let height = 0;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    let total = 0;

    let x0 = new Float32Array(0);
    let y0 = new Float32Array(0);
    let x = new Float32Array(0);
    let y = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let alpha = new Float32Array(0);
    let isActive = new Uint8Array(0);
    let activeList: number[] = [];
    let vertexData = new Float32Array(0);

    let lastX = 0;
    let lastY = 0;
    let hasLast = false;
    let running = false;
    let rafId = 0;
    let lastTime = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);

      cols = Math.ceil(width / GRID_SPACING) + 1;
      rows = Math.ceil(height / GRID_SPACING) + 1;
      total = cols * rows;

      x0 = new Float32Array(total);
      y0 = new Float32Array(total);
      x = new Float32Array(total);
      y = new Float32Array(total);
      vx = new Float32Array(total);
      vy = new Float32Array(total);
      alpha = new Float32Array(total);
      isActive = new Uint8Array(total);
      activeList = [];
      vertexData = new Float32Array(total * 4);

      for (let r = 0; r < rows; r += 1) {
        for (let c = 0; c < cols; c += 1) {
          const idx = r * cols + c;
          const px = (c + 0.5) * GRID_SPACING;
          const py = (r + 0.5) * GRID_SPACING;
          x0[idx] = px;
          y0[idx] = py;
          x[idx] = px;
          y[idx] = py;
        }
      }

      if (gl) {
        gl.viewport(0, 0, canvas.width, canvas.height);
      }
      hasLast = false;
    };

    const injectAt = (mx: number, my: number, dx: number, dy: number, impulseWeight: number) => {
      const rMin = Math.max(0, Math.floor((my - INFLUENCE_RADIUS) / GRID_SPACING));
      const rMax = Math.min(rows - 1, Math.ceil((my + INFLUENCE_RADIUS) / GRID_SPACING));
      const cMin = Math.max(0, Math.floor((mx - INFLUENCE_RADIUS) / GRID_SPACING));
      const cMax = Math.min(cols - 1, Math.ceil((mx + INFLUENCE_RADIUS) / GRID_SPACING));
      const r2 = INFLUENCE_RADIUS * INFLUENCE_RADIUS;
      const coreDenom = r2 * 0.42;

      for (let r = rMin; r <= rMax; r += 1) {
        for (let c = cMin; c <= cMax; c += 1) {
          const idx = r * cols + c;
          const dX = x0[idx] - mx;
          const dY = y0[idx] - my;
          const distSq = dX * dX + dY * dY;
          if (distSq > r2) continue;

          const influence = Math.exp(-distSq / coreDenom);
          vx[idx] += dx * influence * 0.38;
          vy[idx] += dy * influence * 0.38;
          alpha[idx] = Math.min(1.0, alpha[idx] + impulseWeight * influence);

          if (!isActive[idx]) {
            isActive[idx] = 1;
            activeList.push(idx);
          }
        }
      }
    };

    const frameLoop = (time: number) => {
      if (!lastTime) lastTime = time;
      const dt = Math.min(34, time - lastTime);
      lastTime = time;
      const timeScale = Math.max(0.4, Math.min(2.0, dt / 16.67));

      const damp = Math.pow(DAMPING, timeScale);
      const dec = Math.pow(DECAY, timeScale);
      const springK = SPRING * timeScale;

      const currentActiveCount = activeList.length;

      // Neighbor fluid coupling for active dots
      for (let i = 0; i < currentActiveCount; i += 1) {
        const idx = activeList[i];
        const a = alpha[idx];
        if (a < 0.08) continue;

        const c = idx % cols;
        const r = Math.floor(idx / cols);

        const pushX = vx[idx] * NEIGHBOR_PUSH * timeScale;
        const pushY = vy[idx] * NEIGHBOR_PUSH * timeScale;
        const pushA = a * NEIGHBOR_ALPHA * timeScale;

        const neighbors = [
          c > 0 ? idx - 1 : -1,
          c < cols - 1 ? idx + 1 : -1,
          r > 0 ? idx - cols : -1,
          r < rows - 1 ? idx + cols : -1,
        ];

        for (let n = 0; n < 4; n += 1) {
          const nb = neighbors[n];
          if (nb === -1) continue;
          vx[nb] += pushX;
          vy[nb] += pushY;
          alpha[nb] = Math.min(1.0, alpha[nb] + pushA);
          if (!isActive[nb]) {
            isActive[nb] = 1;
            activeList.push(nb);
          }
        }
      }

      // Physics update and active list compacting
      let writeIdx = 0;
      let renderCount = 0;

      for (let i = 0; i < activeList.length; i += 1) {
        const idx = activeList[i];
        const fx = (x0[idx] - x[idx]) * springK;
        const fy = (y0[idx] - y[idx]) * springK;

        vx[idx] = (vx[idx] + fx) * damp;
        vy[idx] = (vy[idx] + fy) * damp;
        x[idx] += vx[idx] * timeScale;
        y[idx] += vy[idx] * timeScale;
        alpha[idx] *= dec;

        const a = alpha[idx];
        const dx = Math.abs(x[idx] - x0[idx]);
        const dy = Math.abs(y[idx] - y0[idx]);

        if (a < 0.008 && dx < 0.15 && dy < 0.15) {
          x[idx] = x0[idx];
          y[idx] = y0[idx];
          vx[idx] = 0;
          vy[idx] = 0;
          alpha[idx] = 0;
          isActive[idx] = 0;
        } else {
          activeList[writeIdx] = idx;
          writeIdx += 1;

          if (a >= 0.01) {
            const vOffset = renderCount * 4;
            const sz = (2.3 + a * 1.5) * dpr;
            vertexData[vOffset] = x[idx] * dpr;
            vertexData[vOffset + 1] = y[idx] * dpr;
            vertexData[vOffset + 2] = a;
            vertexData[vOffset + 3] = sz;
            renderCount += 1;
          }
        }
      }
      activeList.length = writeIdx;

      // Rendering
      if (gl && program && buffer) {
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.clearColor(0, 0, 0, 0);
        gl.clear(gl.COLOR_BUFFER_BIT);

        if (renderCount > 0) {
          gl.useProgram(program);
          gl.uniform2f(resLoc, canvas.width, canvas.height);

          gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
          gl.bufferData(gl.ARRAY_BUFFER, vertexData.subarray(0, renderCount * 4), gl.DYNAMIC_DRAW);

          gl.enableVertexAttribArray(posLoc);
          gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 16, 0);

          gl.enableVertexAttribArray(alphaLoc);
          gl.vertexAttribPointer(alphaLoc, 1, gl.FLOAT, false, 16, 8);

          gl.enableVertexAttribArray(sizeLoc);
          gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, 16, 12);

          gl.drawArrays(gl.POINTS, 0, renderCount);
        }
      } else if (ctx2d) {
        ctx2d.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < renderCount; i += 1) {
          const vOffset = i * 4;
          const px = vertexData[vOffset];
          const py = vertexData[vOffset + 1];
          const a = vertexData[vOffset + 2];
          const sz = vertexData[vOffset + 3];
          ctx2d.fillStyle = `rgba(245, 245, 248, ${a * 0.95})`;
          ctx2d.fillRect(px - sz * 0.5, py - sz * 0.5, sz, sz);
        }
      }

      if (activeList.length > 0) {
        rafId = requestAnimationFrame(frameLoop);
      } else {
        running = false;
        lastTime = 0;
      }
    };

    const onPointerMove = (event: PointerEvent) => {
      if (event.pointerType === "touch") return;

      const cx = event.clientX;
      const cy = event.clientY;

      if (!hasLast) {
        lastX = cx;
        lastY = cy;
        hasLast = true;
        return;
      }

      const dx = cx - lastX;
      const dy = cy - lastY;
      const dist = Math.hypot(dx, dy);

      if (dist < 0.5) return;

      const subSteps = Math.max(1, Math.min(10, Math.ceil(dist / (GRID_SPACING * 0.75))));
      const impulseWeight = (0.34 + Math.min(dist / 30, 0.66)) / subSteps;

      for (let s = 1; s <= subSteps; s += 1) {
        const t = s / subSteps;
        const subX = lastX + dx * t;
        const subY = lastY + dy * t;
        injectAt(subX, subY, dx / subSteps, dy / subSteps, impulseWeight);
      }

      lastX = cx;
      lastY = cy;

      if (!running) {
        running = true;
        lastTime = 0;
        rafId = requestAnimationFrame(frameLoop);
      }
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      if (gl) {
        if (program) gl.deleteProgram(program);
        if (buffer) gl.deleteBuffer(buffer);
      }
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;
  return <canvas ref={canvasRef} className={styles.trail} aria-hidden="true" />;
}
