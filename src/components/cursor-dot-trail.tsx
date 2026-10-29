"use client";

import { useEffect, useRef } from "react";
import { useReducedMotion } from "motion/react";
import styles from "./cursor-dot-trail.module.css";

const DIV = 12;
const ENERGY_SCALE = 2;

const VERT = `#version 300 es
void main() {
  vec2 p = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
  gl_Position = vec4(p * 2.0 - 1.0, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
uniform sampler2D u_field;
uniform vec2 u_res;
uniform float u_dpr;
out vec4 outColor;

void main() {
  vec2 screen = vec2(gl_FragCoord.x, u_res.y - gl_FragCoord.y);
  vec2 uv = screen / u_res;
  vec4 field = texture(u_field, uv);
  float energy = field.r * ${ENERGY_SCALE}.0;
  if (energy < 0.035) discard;
  vec2 vel = (field.gb - 0.5) * 8.0;

  float gap = 6.0 * u_dpr;
  vec2 p = screen - vel * 4.0 * u_dpr;
  vec2 cell = abs(fract(p / gap) - 0.5);
  float dist = length(cell);
  float tone = smoothstep(0.035, 0.9, energy);
  float radius = mix(0.055, 0.3, tone);
  float alpha = 0.0;
  if (dist < radius) {
    alpha = mix(0.18, 0.95, tone) * (1.0 - smoothstep(radius * 0.15, radius, dist));
  }

  float core = smoothstep(0.42, 1.15, energy);
  if (core > 0.0) {
    vec2 cell2 = abs(fract(p / gap + 0.5) - 0.5);
    float dist2 = length(cell2);
    float radius2 = 0.18 * core;
    if (dist2 < radius2) {
      alpha = max(alpha, 0.72 * core * (1.0 - dist2 / radius2));
    }
  }

  if (alpha < 0.03) discard;
  outColor = vec4(1.0, 1.0, 1.0, alpha);
}`;

export function CursorDotTrail() {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (reducedMotion) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const canvas = canvasRef.current;
    const gl = canvas?.getContext("webgl2", { alpha: true, antialias: false, premultipliedAlpha: false });
    if (!canvas || !gl) return;

    const compile = (type: number, source: string) => {
      const shader = gl.createShader(type);
      if (!shader) return null;
      gl.shaderSource(shader, source);
      gl.compileShader(shader);
      if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        gl.deleteShader(shader);
        return null;
      }
      return shader;
    };
    const vertex = compile(gl.VERTEX_SHADER, VERT);
    const fragment = compile(gl.FRAGMENT_SHADER, FRAG);
    const program = gl.createProgram();
    if (!vertex || !fragment || !program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const resLoc = gl.getUniformLocation(program, "u_res");
    const dprLoc = gl.getUniformLocation(program, "u_dpr");
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    let width = 0;
    let height = 0;
    let dpr = 1;
    let cols = 0;
    let rows = 0;
    let energy = new Float32Array(0);
    let vx = new Float32Array(0);
    let vy = new Float32Array(0);
    let pixels = new Uint8Array(0);
    let lastX = 0;
    let lastY = 0;
    let hasLast = false;
    let frame = 0;
    let running = false;
    let lastTime = 0;

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      cols = Math.max(2, Math.ceil(width / DIV));
      rows = Math.max(2, Math.ceil(height / DIV));
      energy = new Float32Array(cols * rows);
      vx = new Float32Array(cols * rows);
      vy = new Float32Array(cols * rows);
      pixels = new Uint8Array(cols * rows * 4);
      gl.viewport(0, 0, canvas.width, canvas.height);
      hasLast = false;
    };

    const inject = (x: number, y: number, dx: number, dy: number, weight: number) => {
      const aspect = width / Math.max(height, 1);
      const radius = 0.085;
      const reach = radius * 2.2;
      const minCol = Math.max(0, Math.floor(((x / width) - reach) * cols));
      const maxCol = Math.min(cols - 1, Math.ceil(((x / width) + reach) * cols));
      const minRow = Math.max(0, Math.floor(((y / height) - reach) * rows));
      const maxRow = Math.min(rows - 1, Math.ceil(((y / height) + reach) * rows));
      for (let row = minRow; row <= maxRow; row += 1) {
        for (let col = minCol; col <= maxCol; col += 1) {
          let du = x / width - (col + 0.5) / cols;
          const dv = y / height - (row + 0.5) / rows;
          du *= aspect;
          const dist = du * du + dv * dv;
          if (dist > reach * reach) continue;
          const influence = Math.exp(-dist / (radius * radius));
          const index = row * cols + col;
          energy[index] = Math.min(ENERGY_SCALE, energy[index] + weight * influence);
          vx[index] += dx * influence * 0.03;
          vy[index] += dy * influence * 0.03;
        }
      }
    };

    const upload = () => {
      for (let index = 0; index < energy.length; index += 1) {
        pixels[index * 4] = Math.max(0, Math.min(255, Math.round((energy[index] / ENERGY_SCALE) * 255)));
        pixels[index * 4 + 1] = Math.max(0, Math.min(255, Math.round((vx[index] / 8 + 0.5) * 255)));
        pixels[index * 4 + 2] = Math.max(0, Math.min(255, Math.round((vy[index] / 8 + 0.5) * 255)));
        pixels[index * 4 + 3] = 255;
      }
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, cols, rows, 0, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
    };

    const draw = (time: number) => {
      running = true;
      const dt = lastTime ? Math.min(34, time - lastTime) : 16;
      lastTime = time;
      const decay = 1 - Math.min(0.5, dt / 280);
      let peak = 0;
      for (let index = 0; index < energy.length; index += 1) {
        energy[index] *= decay;
        vx[index] *= decay;
        vy[index] *= decay;
        peak = Math.max(peak, energy[index]);
      }
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      if (peak < 0.03) {
        running = false;
        lastTime = 0;
        return;
      }
      upload();
      gl.useProgram(program);
      gl.uniform2f(resLoc, canvas.width, canvas.height);
      gl.uniform1f(dprLoc, dpr);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      frame = requestAnimationFrame(draw);
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
      if (speed < 0.4) return;
      const steps = Math.max(1, Math.ceil(speed / 18));
      const weight = (0.22 + Math.min(speed, 140) / 160) / steps;
      for (let step = 1; step <= steps; step += 1) {
        const t = step / steps;
        inject(lastX + dx * t, lastY + dy * t, dx / steps, dy / steps, weight);
      }
      lastX = event.clientX;
      lastY = event.clientY;
      if (!running) frame = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      gl.deleteProgram(program);
      gl.deleteTexture(texture);
    };
  }, [reducedMotion]);

  if (reducedMotion) return null;
  return <canvas ref={canvasRef} className={styles.trail} aria-hidden="true" />;
}
