"use client";

import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import styles from "./site-loader.module.css";

const vsSource = `#version 300 es
in vec2 a_position;
out vec2 v_uv;
void main() {
    v_uv = 0.5 * (a_position + 1.0);
    gl_Position = vec4(a_position.xy, 0.0, 1.0);
}`;

const fsIntroSource = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform float u_time;
uniform float u_logo_progress;
uniform float u_full_progress;
uniform float u_hide_progress;
uniform float u_logo_pixel_size;
uniform vec2 u_resolution;
out vec4 FragColor;

float rand(vec2 n) {
    return fract(sin(dot(n, vec2(12.98923445328, 4.137643425614414))) * 43758.54432453);
}

float noise(vec2 p) {
    vec2 ip = floor(p);
    vec2 u = fract(p);
    u = u*u*(3.0-2.0*u);
    float res = mix(
        mix(rand(ip), rand(ip + vec2(1.0, 0.0)), u.x),
        mix(rand(ip + vec2(0.0, 1.0)), rand(ip + vec2(1.0, 1.0)), u.x), u.y);
    return res*res;
}

mat2 rotation2d(float angle) {
    float s = sin(angle);
    float c = cos(angle);
    return mat2(c, -s, s, c);
}

void main() {
    vec2 uv = v_uv;
    vec2 st = uv * 2.0 - 1.0;
    st.x *= u_resolution.x / u_resolution.y;

    float columns = u_resolution.x / (u_logo_pixel_size);
    float rows = u_resolution.y / (u_logo_pixel_size);

    float roundedX = round(st.x * (rows / 2.0)) / (rows / 2.0);
    float roundedY = round(st.y * (rows / 2.0)) / (rows / 2.0);
    vec2 roundedUV = vec2(roundedX, roundedY);

    float noise_val = 0.5 * noise(roundedUV * 2.0 * rotation2d(u_time / 20000.0) * 4.0);
    roundedUV += 0.1 * noise(roundedUV * 3.0 * rotation2d(u_time / 20000.0) * 4.0);

    float logo_opacity = 1.0 - smoothstep(0.0, 1.0, 1.0 - u_logo_progress + noise_val * (1.0 - u_logo_progress));
    float full_opacity = 1.0 - smoothstep(0.0, 1.0, 1.0 - u_full_progress + noise_val * (1.0 - u_full_progress));
    float hide_opacity = 1.0 - smoothstep(0.0, 1.0, 1.0 - u_hide_progress + noise_val * (1.0 - u_hide_progress));

    FragColor = vec4(logo_opacity, full_opacity, hide_opacity, 1.0);
}`;

const fsGridSource = `#version 300 es
precision highp float;
in vec2 v_uv;
uniform float u_show_logo;
uniform float u_pixel_size;
uniform float u_logo_pixel_size;
uniform float u_color_progress;
uniform vec2 u_resolution;
uniform vec3 u_theme;
uniform vec3 u_theme_second;
uniform sampler2D u_input;
out vec4 FragColor;

float checkEqual(float first, float second) {
    float difference = abs(first - second);
    float inverted_number = ceil(1.0 * difference / 20.0);
    return (1.0 - inverted_number);
}

float drawLLLogo(vec2 rect, float opacity, float full, float inverted) {
    float x = round((mod(rect.x - 0.125, 1.0) - 0.125) * 4.0);
    float y = round((mod(rect.y + 0.25, 1.0) - 0.125) * 4.0);
    float divider = (7.0 + 9.0 * full);
    float progress = 1.0 / divider;
    float inverted_offset = 16.0 * inverted;
    float offset = 0.0;
    float output_opacity = 0.0;

    float block_1 = step(1.0 - opacity, progress * (abs(inverted_offset - 0.0) + offset));
    float block_2 = step(1.0 - opacity, progress * (abs(inverted_offset - 1.0) + offset));
    float block_3 = step(1.0 - opacity, progress * (abs(inverted_offset - 2.0) + offset));
    float block_4 = step(1.0 - opacity, progress * (abs(inverted_offset - 3.0) + offset));
    float block_5 = step(1.0 - opacity, progress * (abs(inverted_offset - 4.0) + offset));
    float block_6 = step(1.0 - opacity, progress * (abs(inverted_offset - 5.0) + offset));
    float block_7 = step(1.0 - opacity, progress * (abs(inverted_offset - 6.0) + offset));

    float block_8  = full * step(1.0 - opacity, progress * (abs(inverted_offset - 7.0) + offset));
    float block_9  = full * step(1.0 - opacity, progress * (abs(inverted_offset - 8.0) + offset));
    float block_10 = full * step(1.0 - opacity, progress * (abs(inverted_offset - 9.0) + offset));
    float block_11 = full * step(1.0 - opacity, progress * (abs(inverted_offset - 10.0) + offset));
    float block_12 = full * step(1.0 - opacity, progress * (abs(inverted_offset - 11.0) + offset));
    float block_13 = full * step(1.0 - opacity, progress * (abs(inverted_offset - 12.0) + offset));
    float block_14 = full * step(1.0 - opacity, progress * (abs(inverted_offset - 13.0) + offset));
    float block_15 = full * step(1.0 - opacity, progress * (abs(inverted_offset - 14.0) + offset));
    float block_16 = full * step(1.0 - opacity, progress * (abs(inverted_offset - 15.0) + offset));

    output_opacity += block_1 * checkEqual(0.0, x) * checkEqual(3.0, y);
    output_opacity += block_2 * checkEqual(2.0, x) * checkEqual(1.0, y);
    output_opacity += block_3 * checkEqual(0.0, x) * checkEqual(1.0, y);
    output_opacity += block_4 * checkEqual(3.0, x) * checkEqual(0.0, y);
    output_opacity += block_5 * checkEqual(2.0, x) * checkEqual(2.0, y);
    output_opacity += block_6 * checkEqual(1.0, x) * checkEqual(0.0, y);
    output_opacity += block_7 * checkEqual(0.0, x) * checkEqual(2.0, y);

    output_opacity += block_8 * checkEqual(3.0, x) * checkEqual(2.0, y);
    output_opacity += block_9 * checkEqual(1.0, x) * checkEqual(3.0, y);
    output_opacity += block_10 * checkEqual(3.0, x) * checkEqual(3.0, y);
    output_opacity += block_11 * checkEqual(1.0, x) * checkEqual(1.0, y);
    output_opacity += block_12 * checkEqual(0.0, x) * checkEqual(0.0, y);
    output_opacity += block_13 * checkEqual(3.0, x) * checkEqual(1.0, y);
    output_opacity += block_14 * checkEqual(1.0, x) * checkEqual(2.0, y);
    output_opacity += block_15 * checkEqual(2.0, x) * checkEqual(0.0, y);
    output_opacity += block_16 * checkEqual(2.0, x) * checkEqual(3.0, y);

    return min(1.0, output_opacity) * ceil(opacity);
}

void main() {
    vec2 uv = v_uv;
    float logo_columns = u_resolution.x / (u_logo_pixel_size);
    float logo_rows = u_resolution.y / (u_logo_pixel_size);

    float hide_columns = u_resolution.x / (u_pixel_size);
    float hide_rows = u_resolution.y / (u_pixel_size);
    vec2 hide_uv_resolution = vec2(uv.x * hide_columns, uv.y * hide_rows);

    vec4 tex = texture(u_input, uv);

    vec2 gh;
    gh.x = 1.0 - step((0.5 * u_logo_pixel_size / u_resolution.x), abs(uv.x - 0.5));
    gh.y = 1.0 - step((0.5 * u_logo_pixel_size / u_resolution.y), abs(uv.y - 0.5));
    gh = vec2(gh.x * gh.y);

    vec2 st = vec2((uv.x - 0.5 + 0.5 * (u_logo_pixel_size / u_resolution.x)) * logo_columns + 0.125,
                   (uv.y - 0.5 + 0.5 * (u_logo_pixel_size / u_resolution.y)) * logo_rows - 0.25);

    float logo = drawLLLogo(st, gh.x * u_show_logo, 0.0, 0.0);
    float logo_all = drawLLLogo(st, tex.r, 0.0, 0.0);
    float logo_full = drawLLLogo(st, tex.g, 1.0, 0.0);
    float opacity = min(1.0, logo + logo_all + logo_full);

    float hide = drawLLLogo(hide_uv_resolution, tex.b, 1.0, 0.0);
    opacity = max(0.0, opacity - hide);

    vec3 theme = mix(u_theme, u_theme_second, u_color_progress) / 255.0;

    FragColor = vec4(theme * opacity, opacity);
}`;

function createShader(gl: WebGL2RenderingContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) return null;
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error(gl.getShaderInfoLog(shader));
    gl.deleteShader(shader);
    return null;
  }
  return shader;
}

function createProgram(
  gl: WebGL2RenderingContext,
  vs: WebGLShader,
  fs: WebGLShader
) {
  const p = gl.createProgram();
  if (!p) return null;
  gl.attachShader(p, vs);
  gl.attachShader(p, fs);
  gl.linkProgram(p);
  return p;
}

export function SiteLoader() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const counterWrapRef = useRef<HTMLSpanElement | null>(null);
  const counterTextRef = useRef<HTMLSpanElement | null>(null);

  const isRunningRef = useRef(false);
  const masterTimelineRef = useRef<gsap.core.Timeline | null>(null);
  const countTweenRef = useRef<gsap.core.Tween | null>(null);
  const tickerActiveRef = useRef(false);

  const glRef = useRef<WebGL2RenderingContext | null>(null);
  const progIntroRef = useRef<WebGLProgram | null>(null);
  const progGridRef = useRef<WebGLProgram | null>(null);
  const quadBufferRef = useRef<WebGLBuffer | null>(null);
  const fboRef = useRef<WebGLFramebuffer | null>(null);
  const fboTextureRef = useRef<WebGLTexture | null>(null);

  const stateRef = useRef({
    showLogo: 0,
    logoGridSize: 160,
    logoProgress: 0,
    colorProgress: 0,
    fullProgress: 0,
    hideProgress: 0,
    themePrimary: [249.0, 244.0, 235.0],
    themeSecondary: [26.0, 28.0, 28.0],
  });

  const clearCanvas = useCallback(() => {
    const gl = glRef.current;
    const canvas = canvasRef.current;
    if (!gl || !canvas) return;
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(0.0, 0.0, 0.0, 0.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }, []);

  const renderWebGLFrame = useCallback((time: number) => {
    const gl = glRef.current;
    const canvas = canvasRef.current;
    const progIntro = progIntroRef.current;
    const progGrid = progGridRef.current;
    const fbo = fboRef.current;
    const fboTexture = fboTextureRef.current;
    const quadBuffer = quadBufferRef.current;
    if (!gl || !canvas || !progIntro || !progGrid || !fboTexture || !quadBuffer) return;

    const state = stateRef.current;

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);

    // Pass 1: Render to FBO (Zi)
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
    gl.useProgram(progIntro);

    gl.uniform1f(gl.getUniformLocation(progIntro, "u_time"), time);
    gl.uniform1f(gl.getUniformLocation(progIntro, "u_logo_progress"), state.logoProgress);
    gl.uniform1f(gl.getUniformLocation(progIntro, "u_full_progress"), state.fullProgress);
    gl.uniform1f(gl.getUniformLocation(progIntro, "u_hide_progress"), state.hideProgress);
    gl.uniform1f(gl.getUniformLocation(progIntro, "u_logo_pixel_size"), state.logoGridSize);
    gl.uniform2f(gl.getUniformLocation(progIntro, "u_resolution"), canvas.width, canvas.height);

    const posLoc1 = gl.getAttribLocation(progIntro, "a_position");
    gl.enableVertexAttribArray(posLoc1);
    gl.vertexAttribPointer(posLoc1, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);

    // Pass 2: From FBO to screen (Qi)
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.useProgram(progGrid);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, fboTexture);
    gl.uniform1i(gl.getUniformLocation(progGrid, "u_input"), 0);

    gl.uniform1f(gl.getUniformLocation(progGrid, "u_show_logo"), state.showLogo);
    gl.uniform1f(gl.getUniformLocation(progGrid, "u_pixel_size"), 16.0);
    gl.uniform1f(gl.getUniformLocation(progGrid, "u_logo_pixel_size"), state.logoGridSize);
    gl.uniform1f(gl.getUniformLocation(progGrid, "u_color_progress"), state.colorProgress);
    gl.uniform2f(gl.getUniformLocation(progGrid, "u_resolution"), canvas.width, canvas.height);
    gl.uniform3f(
      gl.getUniformLocation(progGrid, "u_theme"),
      state.themePrimary[0],
      state.themePrimary[1],
      state.themePrimary[2]
    );
    gl.uniform3f(
      gl.getUniformLocation(progGrid, "u_theme_second"),
      state.themeSecondary[0],
      state.themeSecondary[1],
      state.themeSecondary[2]
    );

    const posLoc2 = gl.getAttribLocation(progGrid, "a_position");
    gl.enableVertexAttribArray(posLoc2);
    gl.vertexAttribPointer(posLoc2, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
  }, []);

  const runGSAPTicker = useCallback(
    (time: number) => {
      if (!tickerActiveRef.current) return;
      renderWebGLFrame(time * 1000);
    },
    [renderWebGLFrame]
  );

  const startPhase2 = useCallback(() => {
    const overlay = overlayRef.current;
    const counterWrap = counterWrapRef.current;
    const canvas = canvasRef.current;
    if (!overlay || !counterWrap || !canvas) return;

    setTimeout(() => {
      if (overlay) overlay.style.background = "transparent";
    }, 200);

    tickerActiveRef.current = true;
    gsap.ticker.add(runGSAPTicker);

    const masterTimeline = gsap.timeline({
      onComplete: () => {
        if (overlay) {
          overlay.classList.add(styles.isHidden);
        }
        if (canvas) {
          canvas.style.display = "none";
        }
        tickerActiveRef.current = false;
        gsap.ticker.remove(runGSAPTicker);
        clearCanvas();

        document.body.classList.remove("is-loading");
        document.body.classList.add("is-loaded");
        document.body.style.overflow = "";
        isRunningRef.current = false;

        // Notify Hero and other components to start entry sequence
        window.dispatchEvent(new CustomEvent("nst-loader-complete"));
      },
    });
    masterTimelineRef.current = masterTimeline;

    masterTimeline.to(
      counterWrap,
      {
        yPercent: -100,
        clipPath: "inset(100% 0% 0%)",
        ease: "power4.in",
        duration: 0.45,
      },
      0
    );

    masterTimeline.to(
      stateRef.current,
      {
        showLogo: 1,
        ease: "none",
        duration: 0.35,
      },
      0
    );

    masterTimeline.to(
      stateRef.current,
      {
        logoGridSize: 16,
        ease: "power3.in",
        duration: 3.75,
      },
      0
    );

    masterTimeline.to(
      stateRef.current,
      {
        logoProgress: 1,
        ease: "power3.in",
        duration: 2.75,
      },
      0
    );

    masterTimeline.to(
      stateRef.current,
      {
        colorProgress: 1,
        ease: "power4.inOut",
        duration: 4.25,
      },
      0
    );

    masterTimeline.to(
      stateRef.current,
      {
        fullProgress: 1,
        ease: "power4.in",
        duration: 3.25,
      },
      0.5
    );

    masterTimeline.to(
      stateRef.current,
      {
        hideProgress: 1,
        ease: "power4.in",
        duration: 1.45,
      },
      2.35
    );

    masterTimeline.to(
      overlay,
      {
        opacity: 0,
        pointerEvents: "none",
        ease: "power4.out",
        duration: 0.65,
      },
      0
    );
  }, [clearCanvas, runGSAPTicker]);

  const startFullSequence = useCallback(() => {
    if (masterTimelineRef.current) masterTimelineRef.current.kill();
    if (countTweenRef.current) countTweenRef.current.kill();
    tickerActiveRef.current = false;
    gsap.ticker.remove(runGSAPTicker);
    clearCanvas();

    stateRef.current = {
      showLogo: 0,
      logoGridSize: 160,
      logoProgress: 0,
      colorProgress: 0,
      fullProgress: 0,
      hideProgress: 0,
      themePrimary: [249.0, 244.0, 235.0],
      themeSecondary: [26.0, 28.0, 28.0],
    };

    const overlay = overlayRef.current;
    const canvas = canvasRef.current;
    const counterWrap = counterWrapRef.current;
    const counterText = counterTextRef.current;

    if (overlay) {
      overlay.style.background = "#000000";
      overlay.style.opacity = "1";
      overlay.style.pointerEvents = "auto";
      overlay.classList.remove(styles.isHidden);
    }
    if (canvas) {
      canvas.style.display = "block";
    }
    if (counterWrap) {
      gsap.set(counterWrap, { yPercent: 0, clipPath: "inset(0% 0% 0% 0%)" });
    }
    if (counterText) {
      counterText.innerText = "0";
    }

    document.body.classList.add("is-loading");
    document.body.classList.remove("is-loaded");
    document.body.style.overflow = "hidden";
    isRunningRef.current = true;

    window.dispatchEvent(new CustomEvent("nst-loader-start"));

    // Phase 1 Counting (0% -> 100%)
    const countObj = { val: 0 };
    countTweenRef.current = gsap.to(countObj, {
      val: 100,
      duration: 1.8,
      ease: "power1.inOut",
      onUpdate: () => {
        if (counterTextRef.current) {
          counterTextRef.current.innerText = String(Math.floor(countObj.val));
        }
      },
      onComplete: () => {
        if (counterTextRef.current) {
          counterTextRef.current.innerText = "100";
        }
        startPhase2();
      },
    });
  }, [clearCanvas, runGSAPTicker, startPhase2]);

  // Init WebGL 2.0
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let gl: WebGL2RenderingContext | null = null;
    try {
      gl = canvas.getContext("webgl2", { alpha: true });
    } catch {
      gl = null;
    }

    if (!gl) {
      console.warn("WebGL 2.0 not supported on this browser.");
      window.dispatchEvent(new CustomEvent("nst-loader-complete"));
      return;
    }
    glRef.current = gl;

    const vs = createShader(gl, gl.VERTEX_SHADER, vsSource);
    const fsIntro = createShader(gl, gl.FRAGMENT_SHADER, fsIntroSource);
    const fsGrid = createShader(gl, gl.FRAGMENT_SHADER, fsGridSource);
    if (!vs || !fsIntro || !fsGrid) return;

    const progIntro = createProgram(gl, vs, fsIntro);
    const progGrid = createProgram(gl, vs, fsGrid);
    if (!progIntro || !progGrid) return;
    progIntroRef.current = progIntro;
    progGridRef.current = progGrid;

    const quadBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, quadBuffer);
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array([-1, -1, 1, -1, -1, 1, -1, 1, 1, -1, 1, 1]),
      gl.STATIC_DRAW
    );
    quadBufferRef.current = quadBuffer;

    const resizeFBO = (w: number, h: number) => {
      if (fboTextureRef.current) gl.deleteTexture(fboTextureRef.current);
      if (fboRef.current) gl.deleteFramebuffer(fboRef.current);

      const fboTexture = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, fboTexture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        w,
        h,
        0,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        null
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
      fboTextureRef.current = fboTexture;

      const fbo = gl.createFramebuffer();
      gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);
      gl.framebufferTexture2D(
        gl.FRAMEBUFFER,
        gl.COLOR_ATTACHMENT0,
        gl.TEXTURE_2D,
        fboTexture,
        0
      );
      gl.bindFramebuffer(gl.FRAMEBUFFER, null);
      fboRef.current = fbo;
    };

    const handleResize = () => {
      if (!canvas || !gl) return;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
      resizeFBO(canvas.width, canvas.height);
    };

    window.addEventListener("resize", handleResize);
    handleResize();

    // Check if seen in this session or prefers-reduced-motion
    const isHome = typeof window !== "undefined" ? window.location.pathname === "/" : true;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (isHome && !reduced) {
      startFullSequence();
    } else {
      document.body.classList.remove("is-loading");
      document.body.classList.add("is-loaded");
      document.body.style.overflow = "";
      window.dispatchEvent(new CustomEvent("nst-loader-complete"));
    }

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "r" || e.key === "R") {
        startFullSequence();
      }
    };
    const handleReplayEvent = () => {
      startFullSequence();
    };
    window.addEventListener("keydown", handleKey);
    window.addEventListener("nst-loader-replay", handleReplayEvent);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", handleKey);
      window.removeEventListener("nst-loader-replay", handleReplayEvent);
      if (masterTimelineRef.current) masterTimelineRef.current.kill();
      if (countTweenRef.current) countTweenRef.current.kill();
      tickerActiveRef.current = false;
      gsap.ticker.remove(runGSAPTicker);
      document.body.style.overflow = "";
      document.body.classList.remove("is-loading");
      document.body.classList.add("is-loaded");
    };
  }, [clearCanvas, runGSAPTicker, startFullSequence]);

  return (
    <>
      <canvas id="webgl-canvas" ref={canvasRef} className={styles.webglCanvas} />
      <div
        id="loader-overlay"
        ref={overlayRef}
        className={styles.loaderOverlay}
      >
        <div className={styles.containerContainer}>
          <span className={styles.counterWrap} ref={counterWrapRef}>
            <span className={styles.counter} ref={counterTextRef}>
              0
            </span>
            %
          </span>
        </div>
      </div>
    </>
  );
}
