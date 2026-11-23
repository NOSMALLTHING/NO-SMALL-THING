"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function Demo8Section({ standalone = false }: { standalone?: boolean }) {
  const HeadingTag = standalone ? "h1" : "h2";
  const rootRef = useRef<HTMLDivElement>(null);
  const glCanvasRef = useRef<HTMLCanvasElement>(null);
  const paintCanvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const glCanvas = glCanvasRef.current;
    const paintCanvas = paintCanvasRef.current;
    if (!root || !glCanvas || !paintCanvas) return;
    const canvasGl = glCanvas;
    const canvasPaint = paintCanvas;

    gsap.registerPlugin(ScrollTrigger);

    if (typeof window !== "undefined" && window.__lenis) {
      window.__lenis.resize();
    }

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const isMobileQuery = window.matchMedia("(max-width: 900px)");

    // ==========================================
    // 1. Text Split Line Entrance Animation
    // ==========================================
    root.querySelectorAll<HTMLElement>(".ln").forEach((f) => {
      const e = f.parentElement;
      if (e) f.style.setProperty("--i", String([...e.children].indexOf(f)));
    });

    const splitEls = root.querySelectorAll<HTMLElement>("[data-split]");
    const splitTriggers: ScrollTrigger[] = [];

    splitEls.forEach((el) => {
      splitTriggers.push(
        ScrollTrigger.create({
          trigger: el,
          start: "top 84%",
          once: true,
          onEnter: () => el.classList.add("is-in"),
        })
      );
    });

    // ==========================================
    // 2. Counters Animation for Grid 9
    // ==========================================
    const countEls = root.querySelectorAll<HTMLElement>("[data-count]");
    const countTriggers: ScrollTrigger[] = [];

    countEls.forEach((el) => {
      const target = +el.dataset.count!;
      const pre = el.dataset.pre || "";
      const suf = el.dataset.suf || "";
      const renderVal = (v: number) => {
        el.innerHTML = `${pre ? `<span class="u">${pre}</span>` : ""}${v}${suf ? `<span class="u">${suf}</span>` : ""}`;
      };

      if (!prefersReducedMotion) {
        renderVal(0);
        countTriggers.push(
          ScrollTrigger.create({
            trigger: el,
            start: "top 88%",
            once: true,
            onEnter: () => {
              gsap.to(
                { v: 0 },
                {
                  v: target,
                  duration: 1.8,
                  ease: "power3.out",
                  onUpdate() {
                    renderVal(Math.round(this.targets()[0].v));
                  },
                }
              );
            },
          })
        );
      }
    });

    // ==========================================
    // 3. WebGL 3D Particle Morphing System
    // ==========================================
    let isDisposed = false;
    let animFrameId = 0;
    let animFrameRunning = false;
    let isIntersecting = false;

    const V = isMobileQuery.matches ? 3000 : 16000;
    const dpr = Math.min(window.devicePixelRatio || 1, isMobileQuery.matches ? 1 : 1.75);

    let renderer: THREE.WebGLRenderer | null = null;
    try {
      renderer = new THREE.WebGLRenderer({
        canvas: glCanvas,
        antialias: !isMobileQuery.matches,
        alpha: true,
        powerPreference: "high-performance",
      });
      renderer.setClearColor(0, 0);
      renderer.outputColorSpace = THREE.SRGBColorSpace;
      renderer.toneMapping = THREE.NeutralToneMapping;
      renderer.setPixelRatio(dpr);
    } catch {
      renderer = null;
    }

    const scene = new THREE.Scene();
    let viewportHeight = window.innerHeight;
    const camera = new THREE.PerspectiveCamera(30, window.innerWidth / viewportHeight, 0.1, 100);
    camera.position.set(0, 0, 20);

    const WORLD_H = 2 * Math.tan(THREE.MathUtils.degToRad(15)) * 20;

    scene.add(new THREE.HemisphereLight("#ffffff", "#dfe6da", 1.4));
    const dirLight = new THREE.DirectionalLight("#fff4e6", 2.4);
    dirLight.position.set(-4, 5, 7);
    scene.add(dirLight);

    const colorHelpers = {
      g1: new THREE.Color("#2F6B51"),
      g2: new THREE.Color("#5E8F70"),
      ink: new THREE.Color("#123D2E"),
      gold: new THREE.Color("#D9A04E"),
      amber: new THREE.Color("#C9772F"),
      orange: new THREE.Color("#E8832E"),
      light: new THREE.Color("#F6C27A"),
      cream: new THREE.Color("#FFF3DE"),
      af: (f: THREE.Color, e: THREE.Color) => f.clone().lerp(e, Math.random()),
    };

    function generateTextMesh(text: string) {
      const c = document.createElement("canvas");
      c.width = 2400;
      c.height = 520;
      const ctx = c.getContext("2d", { willReadFrequently: true });
      if (!ctx) return { P: new Float32Array(V * 3), C: new Float32Array(V * 3), S: new Float32Array(V).fill(0.95), box: [7.5, 3.2] };

      ctx.fillStyle = "#fff";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `500 400px "Neue Haas Display", "Inter", "Helvetica Neue", Arial, sans-serif`;
      ctx.fillText(text, 2400 / 2, 520 / 2);

      const imgData = ctx.getImageData(0, 0, 2400, 520).data;
      const points: [number, number][] = [];
      let minX = 2400, maxX = 0, minY = 520, maxY = 0;

      for (let y = 0; y < 520; y += 2) {
        for (let x = 0; x < 2400; x += 2) {
          if (imgData[(y * 2400 + x) * 4 + 3] > 128) {
            points.push([x, y]);
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (points.length === 0) {
        points.push([1200, 260]);
        minX = 1100; maxX = 1300; minY = 200; maxY = 320;
      }

      const F = Math.min(2.9 / (maxY - minY + 2), 7.2 / (maxX - minX + 2));
      const cx = (minX + maxX) / 2;
      const cy = (minY + maxY) / 2;

      const P = new Float32Array(V * 3);
      const C = new Float32Array(V * 3);
      const S = new Float32Array(V).fill(0.95);

      for (let g = 0; g < V; g++) {
        const [px, py] = points[(Math.random() * points.length) | 0];
        P[g * 3] = (px + Math.random() * 2 - cx) * F;
        P[g * 3 + 1] = (cy - py - Math.random() * 2) * F;
        P[g * 3 + 2] = (Math.random() - 0.5) * 0.36;

        const col = Math.random() < 0.84
          ? colorHelpers.af(colorHelpers.ink, colorHelpers.g1)
          : colorHelpers.gold;
        C[g * 3] = col.r;
        C[g * 3 + 1] = col.g;
        C[g * 3 + 2] = col.b;
      }

      return { P, C, S, box: [7.5, 3.2] };
    }

    let shapes: ReturnType<typeof generateTextMesh>[] = [];

    const geom = new THREE.BufferGeometry();
    const sf = new THREE.BufferAttribute(new Float32Array(V * 3), 3);
    const _f = new THREE.BufferAttribute(new Float32Array(V * 3), 3);
    const Lf = new THREE.BufferAttribute(new Float32Array(V * 3), 3);
    const Vf = new THREE.BufferAttribute(new Float32Array(V * 3), 3);
    const Pe = new THREE.BufferAttribute(new Float32Array(V * 4), 4);
    for (let f = 0; f < V; f++) {
      Pe.array.set([Math.random(), Math.random(), (f % 10 < 8 ? (Math.floor(f / 10) * 8 + (f % 10)) % 6 : 6), Math.random()], f * 4);
    }
    const Bf = new THREE.BufferAttribute(new Float32Array(V).fill(1), 1);
    const kf = new THREE.BufferAttribute(new Float32Array(V).fill(1), 1);

    geom.setAttribute("position", sf);
    geom.setAttribute("aFrom", sf);
    geom.setAttribute("aTo", _f);
    geom.setAttribute("aCFrom", Lf);
    geom.setAttribute("aCTo", Vf);
    geom.setAttribute("aRnd", Pe);
    geom.setAttribute("aSFrom", Bf);
    geom.setAttribute("aSTo", kf);

    const uniforms = {
      uMix: { value: 0 },
      uTime: { value: 0 },
      uScale: { value: 1000 },
      uSwirl: { value: 0.5 },
      uHi: { value: -1 },
      uHiAmt: { value: 0 },
      uSize: { value: 0.046 },
      uShrink: { value: 0 },
      uVis: { value: 1 },
      uGS: { value: 1 },
      uMR: { value: 0.75 },
      uMaxPx: { value: isMobileQuery.matches ? 40 : 72 },
      uSpl: { value: 0 },
      uSplG: { value: -9 },
      uSplA: { value: 0 },
      uSplW: { value: 0 },
      uRotA: { value: 0 },
      uRotB: { value: 0 },
      uLine: { value: 0 },
      uGelKeep: { value: 0 },
      uMouse: { value: new THREE.Vector3(99, 99, 0) },
      uDim: { value: new THREE.Color("#CFDACF") },
    };

    const Ft = `
      attribute vec3 aFrom, aTo, aCFrom, aCTo; attribute vec4 aRnd; attribute float aSFrom, aSTo;
      uniform float uMix, uTime, uScale, uSwirl, uHi, uHiAmt, uSize, uShrink, uVis, uGS, uMR, uMaxPx, uSpl, uSplG, uSplA, uSplW, uRotA, uRotB, uLine, uGelKeep;
      uniform vec3 uMouse, uDim;
      varying vec3 vCol;
      void main(){
        float m = clamp((uMix - aRnd.x * 0.32) / 0.68, 0.0, 1.0); m = m * m * (3.0 - 2.0 * m);
        vec3 p = mix(aFrom, aTo, m);
        float tr = sin(m * 3.14159);
        vec3 wob = vec3(sin(aRnd.w * 6.2831 + uTime * 0.6), cos(aRnd.w * 4.13 + uTime * 0.5), sin(aRnd.w * 3.37 - uTime * 0.55));
        p += wob * (0.02 + tr * uSwirl * (0.5 + aRnd.y));
        vec2 dm = p.xy - uMouse.xy; float dd = length(dm);
        float push = smoothstep(uMR, 0.0, dd) * (1.0 - tr);
        p.xy += dm / (dd + 1e-4) * push * uMR * 0.55; p.z += push * uMR * 0.35;
        vCol = mix(aCFrom, aCTo, m);
        vec4 mv = modelViewMatrix * vec4(p, 1.0);
        gl_PointSize = clamp(uSize * uGS * mix(aSFrom, aSTo, m) * (0.6 + aRnd.y * 0.8) * uVis * uScale / -mv.z, 0.0, uMaxPx);
        gl_Position = projectionMatrix * mv;
        if (gl_PointSize < 0.5) gl_Position = vec4(2.0, 2.0, 2.0, 1.0);
      }
    `;

    const At = `
      varying vec3 vCol;
      void main(){
        vec2 q = gl_PointCoord * 2.0 - 1.0; float r2 = dot(q, q); if (r2 > 1.0) discard;
        vec3 n = vec3(q.x, -q.y, sqrt(1.0 - r2));
        vec3 L = normalize(vec3(-0.35, 0.6, 0.72));
        float dif = max(dot(n, L), 0.0);
        float spec = pow(max(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0)), 0.0), 34.0);
        float rim = pow(1.0 - n.z, 2.2);
        vec3 c = vCol * (0.5 + 0.64 * dif) + spec * 0.5 + rim * vCol * 0.18;
        gl_FragColor = vec4(c, smoothstep(1.0, 0.8, r2));
        #include <colorspace_fragment>
      }
    `;

    const mat = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: Ft,
      fragmentShader: At,
      transparent: true,
      depthWrite: false,
      alphaToCoverage: !isMobileQuery.matches,
    });

    const pointsMesh = new THREE.Points(geom, mat);
    pointsMesh.frustumCulled = false;

    const particleGroup = new THREE.Group();
    particleGroup.matrixAutoUpdate = false;
    particleGroup.add(pointsMesh);
    scene.add(particleGroup);

    const matIf = new THREE.Matrix4();
    const matEe = new THREE.Matrix4();
    const matKt = new THREE.Matrix4();
    const vecIt = new THREE.Vector3();
    function Ot() {
      const f = particleGroup.position;
      const e = Math.hypot(f.x, f.y);
      matIf.compose(vecIt, particleGroup.quaternion, particleGroup.scale);
      if (e > 0.001) {
        const t = Math.cos(Math.atan(e / (camera.position.z - f.z))) - 1;
        const o = f.x / e;
        const n = f.y / e;
        matEe.set(
          1 + t * o * o, t * o * n, 0, 0,
          t * o * n, 1 + t * n * n, 0, 0,
          0, 0, 1, 0,
          0, 0, 0, 1
        );
        matIf.premultiply(matEe);
      }
      particleGroup.matrix.copy(matIf.premultiply(matKt.makeTranslation(f.x, f.y, f.z)));
      particleGroup.matrixWorldNeedsUpdate = true;
    }

    let lastKey = "";
    function U0(f: number, e: number) {
      if (!shapes.length) return;
      const key = `${f}>${e}`;
      if (key !== lastKey) {
        lastKey = key;
        sf.array.set(shapes[f].P);
        _f.array.set(shapes[e].P);
        Lf.array.set(shapes[f].C);
        Vf.array.set(shapes[e].C);
        Bf.array.set(shapes[f].S);
        kf.array.set(shapes[e].S);
        sf.needsUpdate = true;
        _f.needsUpdate = true;
        Lf.needsUpdate = true;
        Vf.needsUpdate = true;
        Bf.needsUpdate = true;
        kf.needsUpdate = true;
      }
    }

    function resizeGl() {
      const w = window.innerWidth;
      const h = window.innerHeight;
      viewportHeight = h;
      if (renderer) renderer.setSize(w, h, false);
      canvasGl.style.width = `${w}px`;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      uniforms.uScale.value = (h * dpr * 0.5) / Math.tan(THREE.MathUtils.degToRad(15));
    }

    resizeGl();

    // ==========================================
    // 4. Watercolor Bloom Canvas 2D
    // ==========================================
    const paintCtx = canvasPaint.getContext("2d", { alpha: true });
    const i0 = (f: number, e = 0, t = 1) => Math.min(t, Math.max(e, f));
    const I = (f: number, e: number, t: number) => f + (e - f) * t;
    const j = (f: number, e: number, t: number) => i0((f - e) / (t - e));
    const J = (f: number) => f * f * (3 - 2 * f);
    const bf = (f: number) => (f < 0.5 ? 4 * f * f * f : 1 - Math.pow(-2 * f + 2, 3) / 2);
    const k0 = (f: number) => {
      const e = Math.sin(f * 127.1) * 43758.5453;
      return e - Math.floor(e);
    };

    function drawWatercolorBlob(ctx: CanvasRenderingContext2D, cx: number, cy: number, radius: number, p: number) {
      const s = radius * p ** 1.6;
      const i = 0.16 * (1 - p) ** 1.3;
      if (s < 0.5) return;

      const d = k0(1) * 6.3;
      const v = k0(2) * 6.3;
      const m = k0(3) * 6.3;
      const getR = (ang: number) =>
        s * (1 + i * (0.55 * Math.sin(3 * ang + d + 2.4 * p) + 0.3 * Math.sin(5 * ang + v - 1.7 * p) + 0.15 * Math.sin(8 * ang + m + 3.1 * p)));

      ctx.beginPath();
      const numPts = window.innerWidth <= 900 ? 24 : 96;
      const getPoint = (idx: number): [number, number] => {
        const a = (idx / numPts) * Math.PI * 2;
        const rad = getR(a);
        return [cx + Math.cos(a) * rad, cy + Math.sin(a) * rad];
      };

      let [x0, y0] = getPoint(0);
      let [x1, y1] = getPoint(1);
      ctx.moveTo((x0 + x1) / 2, (y0 + y1) / 2);

      for (let h = 1; h <= numPts; h++) {
        [x0, y0] = getPoint(h);
        [x1, y1] = getPoint(h + 1);
        ctx.quadraticCurveTo(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      }
      ctx.fill();

      // Satellite ink droplets
      for (let h = 0; h < 7; h++) {
        const M = d + h * 0.898 + k0(11 + h) * 0.6;
        const g = radius * (0.14 + 0.5 * k0(21 + h));
        const l = (5 + 15 * k0(31 + h)) * Math.min(1, window.innerWidth / 1100 + 0.35);
        const curR = getR(M);
        if (curR >= g - l * 0.2) continue;
        const cP = J(Math.min(1, Math.max(0, (curR - g * 0.45) / (g * 0.35))));
        if (cP <= 0) continue;
        ctx.beginPath();
        ctx.arc(cx + Math.cos(M) * g, cy + Math.sin(M) * g, l * cP, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function resizePaint() {
      canvasPaint.width = window.innerWidth;
      canvasPaint.height = window.innerHeight;
      canvasPaint.style.width = `${window.innerWidth}px`;
      canvasPaint.style.height = `${window.innerHeight}px`;
    }

    resizePaint();

    // ==========================================
    // 5. Mouse Interaction
    // ==========================================
    const B = {
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      cx: window.innerWidth / 2,
      cy: window.innerHeight / 2,
      nx: 0,
      ny: 0,
      sx: 0,
      sy: 0,
      in: false,
    };
    const mouse = { x: 0, y: 0, isHover: false };
    const raycaster = new THREE.Raycaster();
    const planeZ = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const mouseVec2 = new THREE.Vector2();
    const hitVec = new THREE.Vector3();
    const invMat = new THREE.Matrix4();

    const onPointerMove = (e: PointerEvent) => {
      B.x = e.clientX;
      B.y = e.clientY;
      B.nx = (e.clientX / window.innerWidth) * 2 - 1;
      B.ny = (e.clientY / (viewportHeight || window.innerHeight)) * 2 - 1;
      B.in = true;
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.isHover = true;
    };
    const onPointerLeave = () => {
      B.in = false;
      mouse.isHover = false;
    };

    window.addEventListener("pointerdown", onPointerMove, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("pointerup", onPointerLeave);
    window.addEventListener("pointercancel", onPointerLeave);

    // ==========================================
    // 6. Intersection Observer
    // ==========================================
    const initRect = root.getBoundingClientRect();
    isIntersecting = initRect.bottom > -300 && initRect.top < window.innerHeight + 300;
    if (isIntersecting) {
      glCanvas.classList.add("is-active");
      paintCanvas.classList.add("is-active");
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          isIntersecting = entry.isIntersecting;
          if (isIntersecting) {
            glCanvas.classList.add("is-active");
            paintCanvas.classList.add("is-active");
            startLoop();
          } else {
            glCanvas.classList.remove("is-active");
            paintCanvas.classList.remove("is-active");
            stopLoop();
            if (renderer) renderer.clear();
            if (paintCtx) paintCtx.clearRect(0, 0, paintCanvas.width, paintCanvas.height);
          }
        }
      },
      { rootMargin: "300px 0px 300px 0px", threshold: 0 }
    );

    io.observe(root);

    // ==========================================
    // 7. Initialize Shapes after Font Ready
    // ==========================================
    const startTime = performance.now();
    let lastTime = startTime;

    // Generate immediate shapes so 3D scene starts without blank delay
    const s0 = generateTextMesh("49%");
    const s1 = generateTextMesh("8X");
    const s2 = generateTextMesh("$80K+");
    shapes = [s0, s1, s2];
    U0(0, 0);

    // Re-sample mesh with verified Neue Haas Display font
    if (typeof document !== "undefined" && document.fonts) {
      Promise.all([
        document.fonts.load('500 400px "Neue Haas Display"'),
        document.fonts.load('400 400px "Neue Haas Display"'),
      ])
        .then(() => {
          if (isDisposed) return;
          shapes = [
            generateTextMesh("49%"),
            generateTextMesh("8X"),
            generateTextMesh("$80K+"),
          ];
          lastKey = "";
        })
        .catch(() => { });
    }

    // ==========================================
    // 8. Main RAF Loop (Matches Demo8 appca85.js)
    // ==========================================
    const articles = [...root.querySelectorAll<HTMLElement>(".rs")];
    const slotNum = root.querySelector<HTMLElement>("#slotNum");
    const miniSlots = articles.map((a) => a.querySelector<HTMLElement>(".slot--mini"));
    const gridEl = root.querySelector<HTMLElement>("#grid");

    // Math & projection helpers directly ported from Demo8 (appca85.js)
    const z0 = (f: DOMRect) =>
      i0(
        (Math.min(f.bottom, viewportHeight) - Math.max(f.top, 0)) /
        Math.max(1, Math.min(f.height, viewportHeight))
      );

    const ke = (f: DOMRect, e: THREE.Vector3) => {
      const t = WORLD_H / viewportHeight;
      return (
        e.set(
          (f.left + f.width / 2 - window.innerWidth / 2) * t,
          -(f.top + f.height / 2 - viewportHeight / 2) * t,
          0
        ),
        e
      );
    };

    const Ie = (f: DOMRect, box: [number, number] | number[]) => {
      const t = WORLD_H / viewportHeight;
      return Math.min((f.width * t) / (box[0] || 1), (f.height * t) / (box[1] || 1));
    };

    const ut = new THREE.Vector3();
    const dt = new THREE.Vector3();
    const le = new THREE.Vector3();
    const ptEuler = new THREE.Euler(0, 0, 0, "XYZ");
    let wasRendered = true;
    let paintShown = false;
    let paintSettled = false;
    let glIdle = false;
    let lastPaintP = -1;

    // Cache E0 layout configuration across frames to prevent GC frame drops
    let cachedE0: { shape: number; t: HTMLElement; m: HTMLElement | null; inset: number }[] = [];
    let lastIsMobile: boolean | null = null;
    function getE0(isMobile: boolean) {
      if (isMobile === lastIsMobile && cachedE0.length) return cachedE0;
      lastIsMobile = isMobile;
      cachedE0 = articles.map((el, idx) => ({
        shape: idx,
        t: (isMobile ? miniSlots[idx] : slotNum) || el,
        m: isMobile ? null : el,
        inset: isMobile ? 0 : 0.28,
      }));
      return cachedE0;
    }

    function startLoop() {
      if (animFrameRunning || isDisposed) return;
      animFrameRunning = true;
      lastTime = performance.now();
      animFrameId = requestAnimationFrame(renderLoop);
    }

    function stopLoop() {
      if (!animFrameRunning) return;
      animFrameRunning = false;
      cancelAnimationFrame(animFrameId);
    }

    function renderLoop() {
      if (isDisposed || !isIntersecting) {
        animFrameRunning = false;
        return;
      }
      animFrameId = requestAnimationFrame(renderLoop);

      if (!shapes.length) return;

      const now = performance.now();
      const elapsed = (now - startTime) / 1000;
      const frameDt = Math.min(0.05, (now - lastTime) / 1000);
      lastTime = now;
      const decay = (factor: number) => 1 - Math.pow(1 - factor, frameDt * 60);

      B.cx += (B.x - B.cx) * decay(0.18);
      B.cy += (B.y - B.cy) * decay(0.18);
      B.sx += (B.nx - B.sx) * decay(0.05);
      B.sy += (B.ny - B.sy) * decay(0.05);
      const isMobile = isMobileQuery.matches;

      // Address-bar show/hide changes innerHeight while the stories stay put.
      // Rescaling the camera against that makes the particles jump, so phones keep the layout height.
      if (!isMobile) {
        const curH = window.innerHeight;
        if (Math.abs(curH - viewportHeight) > 1) {
          viewportHeight = curH;
          camera.aspect = window.innerWidth / curH;
          camera.updateProjectionMatrix();
          uniforms.uScale.value = (curH * dpr * 0.5) / Math.tan(THREE.MathUtils.degToRad(15));
        }
      }

      // ----------------------------------------------------
      // A. Particle Morphing & Positioning based on scroll
      // ----------------------------------------------------
      const i = viewportHeight * 0.5;

      // On mobile, Demo8 tracks .slot--mini inside each .rs card with m: null, inset: 0
      // On desktop, Demo8 tracks sticky #slotNum with m: card, inset: 0.28
      const E0 = getE0(isMobile);

      const d = E0.length;
      const v = E0.map((A) => A.t.getBoundingClientRect());
      const m = E0.map((A, q) => {
        const K = A.m ? A.m.getBoundingClientRect() : v[q];
        const Mf = (A.inset ?? 0) * K.height;
        const Sf = (A.inset ?? 0) * K.height;
        const ge = K.top + Mf;
        return [ge, Math.max(ge, K.bottom - Sf)];
      });

      let y = 0;
      for (let A = 0; A < d; A++) {
        if (m[A][0] <= i) y = A;
      }

      let w = 0;
      if (m[y][0] <= i && i > m[y][1] && y < d - 1) {
        w = i0((i - m[y][1]) / Math.max(1, m[y + 1][0] - m[y][1]));
      }

      const F = Math.min(d - 1, y + 1);
      const _ = E0[y];
      const L = E0[F];
      const T = _.shape;
      const h = L.shape;
      const M = T === h && _.t !== L.t;
      const g = M ? (w < 0.5 ? 0 : 1) : bf(w);
      const l = T === h ? 0 : J(j(w, 0.06, 0.94));
      const S = shapes[T];
      const C = shapes[h];

      if (T === h) {
        U0(T, T);
      } else {
        U0(T, h);
      }

      uniforms.uMix.value = l;
      uniforms.uTime.value = elapsed;

      ke(v[y], ut);
      ke(v[F], dt);
      le.copy(ut).lerp(dt, g);

      const P = I(Ie(v[y], S.box), Ie(v[F], C.box), g);
      particleGroup.position.copy(le);
      particleGroup.scale.setScalar(P);
      uniforms.uGS.value = P;

      // 3D tilt & gentle organic sway (ported from Demo8 appca85.js)
      const sway = Math.sin(elapsed * 0.35) * 0.08;
      const tiltX = B.sy * 0.16;
      const tiltY = B.sx * 0.28 + sway;
      ptEuler.set(tiltX, tiltY, 0, "XYZ");
      particleGroup.quaternion.setFromEuler(ptEuler);
      Ot();

      const k = M
        ? (w < 0.5 ? z0(v[y]) * (1 - J(j(w, 0.1, 0.5))) : z0(v[F]) * J(j(w, 0.5, 0.9)))
        : Math.max(
          z0(v[y]) * (1 - g * 0.999),
          z0(v[F]) * g,
          T === h ? z0(v[F]) * g : 0
        );

      uniforms.uVis.value = J(j(k, 0, 0.45)) * (isMobile || T === h ? 1 : 1 - 0.55 * Math.sin(Math.PI * w));

      // Cursor repel force
      if (B.in) {
        mouseVec2.set(
          (B.cx / window.innerWidth) * 2 - 1,
          -(B.cy / viewportHeight) * 2 + 1
        );
        raycaster.setFromCamera(mouseVec2, camera);
        if (raycaster.ray.intersectPlane(planeZ, hitVec)) {
          invMat.copy(particleGroup.matrixWorld).invert();
          hitVec.applyMatrix4(invMat);
          uniforms.uMouse.value.copy(hitVec);
        }
        uniforms.uMR.value += (0.75 - uniforms.uMR.value) * decay(0.1);
      } else {
        uniforms.uMR.value += (0 - uniforms.uMR.value) * decay(0.1);
      }

      const particlesVisible = uniforms.uVis.value >= 0.005;
      if (!particlesVisible) {
        if (wasRendered && renderer) {
          renderer.clear();
          wasRendered = false;
        }
      } else {
        wasRendered = true;
        if (renderer) renderer.render(scene, camera);
      }
      if (isMobile) {
        const nextIdle = glIdle ? uniforms.uVis.value < 0.02 : !particlesVisible;
        if (nextIdle !== glIdle) {
          glIdle = nextIdle;
          root?.classList.toggle("is-gl-idle", glIdle);
        }
      }

      // ----------------------------------------------------
      // B. Watercolor Paint Bloom Canvas Transition
      // ----------------------------------------------------
      if (gridEl && paintCtx) {
        const gRect = gridEl.getBoundingClientRect();
        const d = gRect.top;
        const p = Math.min(1, Math.max(0, (viewportHeight * 0.95 - d) / (viewportHeight * 0.45)));

        const isWet = prefersReducedMotion ? d < viewportHeight * 0.75 : p >= 0.8;
        if (gridEl.classList.contains("is-wet") !== isWet) {
          gridEl.classList.toggle("is-wet", isWet);
        }

        const clipTop = Math.max(0, d);
        const clipBottom = Math.min(viewportHeight, gRect.bottom);
        const clipHeight = clipBottom - clipTop;
        const paintCoversGrid = p > 0 && clipHeight > 0 && d < viewportHeight && gRect.bottom > 0;

        if (isMobile && p >= 1) {
          if (!paintSettled) {
            paintCtx.clearRect(0, 0, canvasPaint.width, canvasPaint.height);
            paintShown = false;
            paintSettled = true;
            lastPaintP = 1;
            root?.classList.add("is-paint-settled");
          }
        } else if (paintCoversGrid && (!isMobile || Math.abs(p - lastPaintP) > 0.025)) {
          if (paintSettled) {
            paintSettled = false;
            lastPaintP = -1;
            root?.classList.remove("is-paint-settled");
          }
          lastPaintP = p;
          paintShown = true;
          paintCtx.clearRect(0, 0, canvasPaint.width, canvasPaint.height);
          paintCtx.save();
          paintCtx.beginPath();
          paintCtx.rect(0, clipTop, canvasPaint.width, clipHeight);
          paintCtx.clip();

          if (p >= 1) {
            paintCtx.fillStyle = "#163F35";
            paintCtx.fillRect(0, clipTop, canvasPaint.width, clipHeight);
          } else {
            paintCtx.fillStyle = "#FFFFFF";
            paintCtx.fillRect(0, clipTop, canvasPaint.width, clipHeight);
            paintCtx.fillStyle = "#163F35";
            drawWatercolorBlob(
              paintCtx,
              canvasPaint.width / 2,
              Math.max(0, d + Math.min(viewportHeight * 0.3, gRect.height * 0.5)),
              Math.hypot(canvasPaint.width / 2, viewportHeight) * 1.04,
              p
            );
          }
          paintCtx.restore();
        } else if (paintShown) {
          paintCtx.clearRect(0, 0, canvasPaint.width, canvasPaint.height);
          paintShown = false;
        }
      }
    }

    if (isIntersecting) {
      startLoop();
    }

    // ==========================================
    // 9. Resize Listener
    // ==========================================
    let lastW = window.innerWidth;
    let lastH = window.innerHeight;

    const onResize = () => {
      const curW = window.innerWidth;
      const curH = window.innerHeight;
      const widthChanged = Math.abs(curW - lastW) > 2;
      const isMobile = isMobileQuery.matches;
      // Address-bar show and hide only changes the height. Rebuilding the canvases then makes the particles flash.
      if (isMobile && !widthChanged) return;

      lastW = curW;
      lastH = curH;
      resizeGl();
      resizePaint();

      cachedE0 = [];
      if (typeof window !== "undefined" && window.__lenis) {
        window.__lenis.resize();
      }
    };
    window.addEventListener("resize", onResize, { passive: true });

    // ==========================================
    // 10. Cleanup
    // ==========================================
    return () => {
      isDisposed = true;
      stopLoop();
      io.disconnect();
      window.removeEventListener("resize", onResize);
      window.removeEventListener("pointerdown", onPointerMove);
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("pointerup", onPointerLeave);
      window.removeEventListener("pointercancel", onPointerLeave);

      splitTriggers.forEach((st) => st.kill());
      countTriggers.forEach((st) => st.kill());

      geom.dispose();
      mat.dispose();
      if (renderer) renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={rootRef}
      className="demo8-root"
      data-section="demo8"
      data-theme="light"
      data-topbar-theme="light"
    >
      <canvas ref={paintCanvasRef} id="paint" className="paint" aria-hidden="true" />
      <canvas ref={glCanvasRef} id="gl" className="gl" aria-hidden="true" />

      <div className="demo8-main">
        {/* ============================================================ 04 RESULTS */}
        <section className="results sec" id="results" data-theme="light">
          <header className="sec__head wrap">
            <p className="tag">RESULTS</p>
            <p className="tag">Why you need a website that works</p>
            <p className="tag tag--r">Where others failed, we delivered</p>
          </header>

          <HeadingTag className="display wrap" data-split>
            <span className="ln" style={{ ["--i" as any]: 0 }}>
              <span className="ln__in">Not just easier to find.</span>
            </span>{" "}
            <span className="ln" style={{ ["--i" as any]: 1 }}>
              <span className="ln__in">
                <em>Easier to trust.</em>
              </span>
            </span>
          </HeadingTag>

          <div className="nums wrap">
            <div className="nums__stick">
              <div className="slot slot--num" id="slotNum" aria-hidden="true" />
            </div>
            <div className="nums__list">
              <article className="rs" data-k="0">
                <div className="slot slot--mini" aria-hidden="true" />
                <p className="tag">Recognition · gain daily</p>
                <h3 className="rs__t">
                  <b>46%</b> People Judged the company by how its website looked
                </h3>
                <p className="body">
                  Stanford asked 2,684 people. The look of a site, and proof a real company stands
                  behind it, decided whether the business seemed credible.
                </p>
                <ul className="rs__rows">
                  <li>
                    <b>+12%</b>
                    <span>Online sales, year over year</span>
                  </li>
                  <li>
                    <b>+82%</b>
                    <span>Faster growth than retail overall</span>
                  </li>
                  <li>
                    <b>5x</b>
                    <span>Popularity n trust of Own-site sales versus a marketplace</span>
                  </li>
                </ul>
              </article>

              <article className="rs" data-k="1">
                <div className="slot slot--mini" aria-hidden="true" />
                <p className="tag">Google SEO</p>
                <h3 className="rs__t">
                  <b>10X</b> more likely to be clicked
                </h3>
                <p className="body">
                  Backlinko looked at 4 million Google results. The first organic result is
                  about ten times more likely to be clicked than the result in tenth place.
                </p>
                <ul className="rs__rows">
                  <li>
                    <b>+27.6%</b>
                    <span>Clicks on the first organic result</span>
                  </li>
                  <li>
                    <b>+32%</b>
                    <span>More clicks, one position higher</span>
                  </li>
                  <li>
                    <b>Page 1</b>
                    <span>Where the clicks actually land</span>
                  </li>
                </ul>
              </article>

              <article className="rs" data-k="2">
                <div className="slot slot--mini" aria-hidden="true" />
                <p className="tag">TikTok Shop · weekly GMV</p>
                <h3 className="rs__t">
                  <b>$1K → $80K+</b> per week, in ten weeks
                </h3>
                <p className="body">
                  Several agencies had tried and stalled. With affiliate outreach, creator
                  activation and GMV Max running in coordination, we had the shop scaling within
                  60 days.
                </p>
                <ul className="rs__rows">
                  <li>
                    <b>28K+</b>
                    <span>Orders in the first five months</span>
                  </li>
                  <li>
                    <b>26K+</b>
                    <span>Net new customers</span>
                  </li>
                  <li>
                    <b>350+</b>
                    <span>Daily orders, at a lower CAC than all other paid channels</span>
                  </li>
                </ul>
                <a
                  className="btn rs__cta"
                  href="#site-footer"
                >
                  <span>Get results like these</span>
                  <span className="sr-only"> (scroll to footer)</span>
                  <i aria-hidden="true">↗</i>
                </a>
              </article>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
