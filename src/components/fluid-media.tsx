"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const FLOW_W = 128;
const FLOW_H = 72;
const vx = new Float32Array(FLOW_W * FLOW_H);
const vy = new Float32Array(FLOW_W * FLOW_H);
const flowPixels = new Uint8Array(FLOW_W * FLOW_H * 4);

let users = 0;
let frame = 0;
let lastX = 0;
let lastY = 0;
let hasLast = false;
const draws = new Set<() => void>();

function splat(x: number, y: number, dx: number, dy: number, amount: number) {
  const cx = (x / window.innerWidth) * (FLOW_W - 1);
  const cy = (1 - y / window.innerHeight) * (FLOW_H - 1);
  const radius = 8;
  for (let j = -radius; j <= radius; j++) {
    for (let i = -radius; i <= radius; i++) {
      const px = Math.round(cx + i);
      const py = Math.round(cy + j);
      if (px < 0 || py < 0 || px >= FLOW_W || py >= FLOW_H) continue;
      const falloff = Math.exp(-(i * i + j * j) / (radius * radius * 0.42));
      const index = py * FLOW_W + px;
      vx[index] = Math.max(-16, Math.min(16, vx[index] + dx * falloff * amount));
      vy[index] = Math.max(-16, Math.min(16, vy[index] - dy * falloff * amount));
    }
  }
}

function onPointerMove(event: PointerEvent) {
  if (event.pointerType === "touch") return;
  const x = event.clientX;
  const y = event.clientY;
  if (!hasLast) {
    lastX = x;
    lastY = y;
    hasLast = true;
    return;
  }
  const dx = x - lastX;
  const dy = y - lastY;
  const distance = Math.hypot(dx, dy);
  const steps = Math.max(1, Math.ceil(distance / 10));
  for (let step = 1; step <= steps; step++) {
    const t = step / steps;
    splat(lastX + dx * t, lastY + dy * t, dx, dy, t === 1 ? 0.42 : 0.16);
  }
  lastX = x;
  lastY = y;
}

function tick() {
  for (let index = 0; index < vx.length; index++) {
    vx[index] *= 0.965;
    vy[index] *= 0.965;
    flowPixels[index * 4] = Math.max(0, Math.min(255, 128 + vx[index] * 7));
    flowPixels[index * 4 + 1] = Math.max(0, Math.min(255, 128 + vy[index] * 7));
    flowPixels[index * 4 + 2] = 0;
    flowPixels[index * 4 + 3] = 255;
  }
  draws.forEach(draw => draw());
  frame = requestAnimationFrame(tick);
}

function retain(draw: () => void) {
  draws.add(draw);
  users += 1;
  if (users === 1) {
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    frame = requestAnimationFrame(tick);
  }
  return () => {
    draws.delete(draw);
    users -= 1;
    if (users === 0) {
      window.removeEventListener("pointermove", onPointerMove);
      cancelAnimationFrame(frame);
      vx.fill(0);
      vy.fill(0);
      hasLast = false;
    }
  };
}

const VERT = `#version 300 es
layout(location = 0) in vec2 a_pos;
out vec2 v_uv;
void main() {
  v_uv = a_pos * 0.5 + 0.5;
  gl_Position = vec4(a_pos, 0.0, 1.0);
}`;

const FRAG = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform sampler2D u_media;
uniform sampler2D u_flow;
uniform vec4 u_rect;
out vec4 outColor;
void main() {
  vec2 viewportUv = u_rect.xy + v_uv * u_rect.zw;
  vec2 flow = texture(u_flow, viewportUv).rg;
  vec2 shift = (flow - 0.5) * 0.2;
  vec2 uv = clamp(v_uv - shift, 0.002, 0.998);
  outColor = texture(u_media, uv);
}`;

function compile(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

export function FluidMedia({
  src,
  alt,
  className,
  video = false,
  poster,
  objectFit = "cover",
}: {
  src: string;
  alt: string;
  className?: string;
  video?: boolean;
  poster?: string;
  objectFit?: "cover" | "contain";
}) {
  const reducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [finePointer, setFinePointer] = useState(false);
  const [glReady, setGlReady] = useState(false);

  useEffect(() => {
    setFinePointer(window.matchMedia("(hover: hover) and (pointer: fine)").matches);
  }, []);

  const distort = finePointer && !reducedMotion;

  useEffect(() => {
    if (!distort) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const gl = canvas.getContext("webgl2", { alpha: true, premultipliedAlpha: true });
    if (!gl) return;
    let alive = true;

    const vertex = compile(gl, gl.VERTEX_SHADER, VERT);
    const fragment = compile(gl, gl.FRAGMENT_SHADER, FRAG);
    if (!vertex || !fragment) return;
    const program = gl.createProgram();
    if (!program) return;
    gl.attachShader(program, vertex);
    gl.attachShader(program, fragment);
    gl.linkProgram(program);
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) return;

    const buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
    gl.useProgram(program);

    const mediaTexture = gl.createTexture();
    const flowTexture = gl.createTexture();
    const uMedia = gl.getUniformLocation(program, "u_media");
    const uFlow = gl.getUniformLocation(program, "u_flow");
    const uRect = gl.getUniformLocation(program, "u_rect");
    let mediaReady = false;
    let failed = false;

    const bindTexture = (texture: WebGLTexture, unit: number) => {
      gl.activeTexture(gl.TEXTURE0 + unit);
      gl.bindTexture(gl.TEXTURE_2D, texture);
    };

    const configure = (texture: WebGLTexture) => {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    };

    if (mediaTexture) configure(mediaTexture);
    if (flowTexture) configure(flowTexture);

    const uploadMedia = (source: TexImageSource) => {
      if (!alive || failed || !mediaTexture) return;
      bindTexture(mediaTexture, 0);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      try {
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, source);
        if (!mediaReady) setGlReady(true);
        mediaReady = true;
      } catch {
        failed = true;
        setGlReady(false);
      }
    };

    let image: HTMLImageElement | null = null;
    if (!video) {
      image = new Image();
      image.decoding = "async";
      image.onload = () => uploadMedia(image!);
      image.src = src;
    }

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const width = Math.max(1, Math.floor(rect.width * dpr));
      const height = Math.max(1, Math.floor(rect.height * dpr));
      if (canvas.width !== width || canvas.height !== height) {
        canvas.width = width;
        canvas.height = height;
      }
    };

    const draw = () => {
      if (failed || !mediaTexture || !flowTexture) return;
      const source = video ? videoRef.current : null;
      if (source && source.readyState >= 2) uploadMedia(source);
      if (!mediaReady) return;
      resize();
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return;
      gl.viewport(0, 0, canvas.width, canvas.height);
      gl.useProgram(program);
      bindTexture(flowTexture, 1);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, false);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, FLOW_W, FLOW_H, 0, gl.RGBA, gl.UNSIGNED_BYTE, flowPixels);
      gl.uniform1i(uMedia, 0);
      gl.uniform1i(uFlow, 1);
      gl.uniform4f(
        uRect,
        rect.left / window.innerWidth,
        1 - rect.bottom / window.innerHeight,
        rect.width / window.innerWidth,
        rect.height / window.innerHeight,
      );
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };

    const release = retain(draw);
    return () => {
      alive = false;
      release();
      image?.removeAttribute("src");
      gl.deleteTexture(mediaTexture);
      gl.deleteTexture(flowTexture);
      gl.deleteProgram(program);
      gl.deleteShader(vertex);
      gl.deleteShader(fragment);
      gl.deleteBuffer(buffer);
    };
  }, [distort, src, video]);

  useEffect(() => {
    if (!video) return;
    videoRef.current?.play().catch(() => {});
  }, [video, src]);

  const mediaStyle = {
    position: "absolute" as const,
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit,
  };

  return (
    <div className={className} style={{ position: "relative" }}>
      {video ? (
        <video
          ref={videoRef}
          style={{ ...mediaStyle, opacity: glReady ? 0 : 1 }}
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster={poster}
          crossOrigin="anonymous"
          src={src}
          aria-hidden={glReady || undefined}
        />
      ) : (
        <img src={src} alt={alt} aria-hidden={glReady || undefined} style={{ ...mediaStyle, opacity: glReady ? 0 : 1 }} />
      )}
      {distort ? (
        <canvas
          ref={canvasRef}
          aria-hidden={!glReady || undefined}
          aria-label={glReady ? alt : undefined}
          role={glReady ? "img" : undefined}
          style={{ ...mediaStyle, opacity: glReady ? 1 : 0, pointerEvents: "none" }}
        />
      ) : null}
    </div>
  );
}
