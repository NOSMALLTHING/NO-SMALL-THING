// @ts-nocheck
"use client";

/**
 * Holographic reflection shimmer on [data-holo] elements.
 * Responds to pointer movements over stickers.
 */
export function initHolo(root: HTMLElement): () => void {
  if (typeof window === "undefined") return () => {};

  const holoEls = [...root.querySelectorAll<HTMLElement>("[data-holo]")].map((el) => {
    const svg = el.querySelector("svg");
    if (!svg) return null;
    const viewBoxAttr = svg.getAttribute("viewBox");
    if (!viewBoxAttr) return null;
    const [, , w, h] = viewBoxAttr.split(" ").map(Number);
    return {
      el,
      w,
      h,
      foil: el.querySelector("[data-foil]"),
      shine: el.querySelector("[data-shine]"),
      x: 0.5,
      y: 0.5,
      visible: false,
    };
  }).filter(Boolean);

  if (!holoEls.length) return () => {};

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const hoverNone = window.matchMedia("(hover: none)").matches;
  const pointerPos = { x: -1, y: -1, active: false };

  const onPointerMove = (evt: PointerEvent) => {
    if (evt.pointerType === "mouse") {
      pointerPos.x = evt.clientX;
      pointerPos.y = evt.clientY;
      pointerPos.active = true;
    }
  };
  window.addEventListener("pointermove", onPointerMove, { passive: true });

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const match = holoEls.find((item) => item.el === entry.target);
      if (match) match.visible = entry.isIntersecting;
    });
  });
  holoEls.forEach((item) => observer.observe(item.el));

  let animFrameId: number;
  const step = (time: number) => {
    for (const item of holoEls) {
      if (!item.visible || !item.foil || !item.shine) continue;
      const rect = item.el.getBoundingClientRect();
      let targetX: number, targetY: number;

      if (pointerPos.active && !hoverNone) {
        targetX = Math.min(1.5, Math.max(-0.5, (pointerPos.x - rect.left) / rect.width));
        targetY = Math.min(1.5, Math.max(-0.5, (pointerPos.y - rect.top) / rect.height));
      } else {
        targetX = 0.5 + Math.sin(time / 1600 + rect.left / 200) * 0.6;
        targetY = 0.5 + Math.cos(time / 2100 + rect.top / 200) * 0.6;
      }

      item.x += (targetX - item.x) * 0.08;
      item.y += (targetY - item.y) * 0.08;

      const s = (item.x - 0.5) * item.w * 0.9;
      const c = (item.y - 0.5) * item.h * 0.9;

      item.foil.setAttribute("x1", String(-s));
      item.foil.setAttribute("y1", String(-c));
      item.foil.setAttribute("x2", String(item.w * 0.6 - s));
      item.foil.setAttribute("y2", String(item.h * 0.6 - c));

      item.shine.setAttribute("cx", String(item.x * item.w));
      item.shine.setAttribute("cy", String(item.y * item.h));
    }
    animFrameId = requestAnimationFrame(step);
  };

  if (!prefersReduced) {
    animFrameId = requestAnimationFrame(step);
  }

  return () => {
    window.removeEventListener("pointermove", onPointerMove);
    observer.disconnect();
    if (animFrameId) cancelAnimationFrame(animFrameId);
  };
}

/**
 * Text auto-fit scaler for [data-fit-text] headlines (e.g. SAY HELLO).
 */
export function initFitText(root: HTMLElement): () => void {
  if (typeof window === "undefined") return () => {};

  const els = root.querySelectorAll<HTMLElement>("[data-fit-text]");
  if (!els.length) return () => {};

  const fit = (el: HTMLElement) => {
    el.classList.add("fit-measuring");
    const clientW = el.clientWidth;
    const range = document.createRange();
    range.selectNodeContents(el);
    const rectW = range.getBoundingClientRect().width;
    if (!clientW || !rectW) {
      el.classList.remove("fit-measuring");
      return;
    }
    const currentFs = parseFloat(getComputedStyle(el).fontSize);
    el.classList.remove("fit-measuring");
    el.style.fontSize = `${(currentFs * clientW) / rectW}px`;
    el.classList.add("fitted");
  };

  const ro = new ResizeObserver((entries) => {
    entries.forEach((e) => fit(e.target as HTMLElement));
  });

  const fontFamilies = [
    ...new Set(
      [...els].map((e) => getComputedStyle(e).fontFamily.split(",")[0].replace(/"/g, "").trim())
    ),
  ];

  if (document.fonts && document.fonts.load) {
    Promise.all(fontFamilies.map((f) => document.fonts.load(`900 100px "${f}"`))).finally(() => {
      document.fonts.ready.then(() => {
        els.forEach((el) => {
          fit(el);
          ro.observe(el);
        });
      });
    });
  } else {
    els.forEach((el) => {
      fit(el);
      ro.observe(el);
    });
  }

  const fallbackTimer = setTimeout(() => {
    els.forEach((e) => e.classList.add("fitted"));
  }, 2500);

  const onResize = () => els.forEach(fit);
  window.addEventListener("resize", onResize, { passive: true });

  return () => {
    clearTimeout(fallbackTimer);
    ro.disconnect();
    window.removeEventListener("resize", onResize);
  };
}

/**
 * Variable-font weight interactive hover for [data-weight-hover].
 * Dynamically updates font-variation-settings 'wght' based on mouse distance from each glyph.
 */
export function initWeightHover(root: HTMLElement): () => void {
  if (typeof window === "undefined") return () => {};

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReduced) return () => {};

  const els = root.querySelectorAll<HTMLElement>("[data-weight-hover]");
  if (!els.length) return () => {};

  const cleanups: (() => void)[] = [];

  els.forEach((elNode) => {
    const e = elNode as HTMLElement;
    const restWeight = Number(e.dataset.weightRest ?? 900);
    const nearWeight = Number(e.dataset.weightNear ?? 200);
    const radius = Number(e.dataset.radius ?? 400);

    const lines: string[] = [""];
    e.childNodes.forEach((child) => {
      if (child.nodeName === "BR") lines.push("");
      else lines[lines.length - 1] += child.textContent ?? "";
    });
    lines.forEach((l, idx) => (lines[idx] = l.trim()));
    e.setAttribute("aria-label", lines.join(" "));
    e.textContent = "";

    const spansData: { span: HTMLSpanElement; weight: number; line: number }[] = [];
    lines.forEach((lineText, lineIdx) => {
      if (lineIdx > 0) e.appendChild(document.createElement("br"));
      for (const ch of lineText) {
        const span = document.createElement("span");
        span.textContent = ch;
        span.setAttribute("aria-hidden", "true");
        span.style.fontVariationSettings = `"wght" ${restWeight}`;
        e.appendChild(span);
        spansData.push({ span, weight: restWeight, line: lineIdx });
      }
    });

    const centers: { x: number; y: number }[] = [];
    const measureCenters = () => {
      e.classList.add("fit-measuring");
      const prevTransforms = spansData.map((d) => d.span.style.transform);
      spansData.forEach((d) => (d.span.style.transform = ""));
      const rect = e.getBoundingClientRect();
      spansData.forEach((d, idx) => {
        const sRect = d.span.getBoundingClientRect();
        centers[idx] = {
          x: sRect.left + sRect.width / 2 - rect.left,
          y: sRect.top + sRect.height / 2 - rect.top,
        };
      });
      spansData.forEach((d, idx) => (d.span.style.transform = prevTransforms[idx]));
      e.classList.remove("fit-measuring");
    };

    const weightPoints = [nearWeight, (nearWeight + restWeight) / 2, restWeight];
    let sampleWidths: number[][] = [];
    let fontScale = 1;

    const updateCharLayout = () => {
      const fs = parseFloat(getComputedStyle(e).fontSize);
      sampleWidths = weightPoints.map((w) => {
        spansData.forEach((d) => (d.span.style.fontVariationSettings = `"wght" ${w}`));
        return spansData.map((d) => d.span.getBoundingClientRect().width / fs);
      });
      const baseWidths = sampleWidths[weightPoints.length - 1];
      spansData.forEach((d, idx) => {
        d.span.style.fontVariationSettings = `"wght" ${d.weight.toFixed(1)}`;
        d.span.style.display = "inline-block";
        d.span.style.textAlign = "center";
        d.span.style.width = `${baseWidths[idx]}em`;
      });
      measureCenters();
      positionChars();
    };

    const interpolateWidth = (charIdx: number, w: number) => {
      for (let i = 1; i < weightPoints.length; i++) {
        if (w <= weightPoints[i] || i === weightPoints.length - 1) {
          const ratio = (w - weightPoints[i - 1]) / (weightPoints[i] - weightPoints[i - 1]);
          return (
            sampleWidths[i - 1][charIdx] +
            (sampleWidths[i][charIdx] - sampleWidths[i - 1][charIdx]) * ratio
          );
        }
      }
      return sampleWidths[weightPoints.length - 1][charIdx];
    };

    const positionChars = () => {
      if (!sampleWidths.length) return;
      fontScale = parseFloat(getComputedStyle(e).fontSize);
      const lastSample = sampleWidths[weightPoints.length - 1];
      for (let line = 0; line < lines.length; line++) {
        const lineIndices = spansData
          .map((d, idx) => (d.line === line ? idx : -1))
          .filter((idx) => idx >= 0);
        const baseTotal = lineIndices.reduce((sum, idx) => sum + lastSample[idx], 0);
        const currentTotal = lineIndices.reduce(
          (sum, idx) => sum + interpolateWidth(idx, spansData[idx].weight),
          0
        );
        let runningBase = 0;
        let runningCurr = (baseTotal - currentTotal) / 2;
        for (const idx of lineIndices) {
          const baseW = lastSample[idx];
          const currW = interpolateWidth(idx, spansData[idx].weight);
          const shift = runningCurr + currW / 2 - (runningBase + baseW / 2);
          spansData[idx].span.style.transform =
            Math.abs(shift) < 1e-4 ? "" : `translateX(${(shift * fontScale).toFixed(2)}px)`;
          runningBase += baseW;
          runningCurr += currW;
        }
      }
    };

    measureCenters();
    const ro = new ResizeObserver(() => {
      measureCenters();
      positionChars();
    });
    ro.observe(e);

    const fontName = getComputedStyle(e).fontFamily.split(",")[0].replace(/"/g, "").trim();
    if (document.fonts && document.fonts.load) {
      document.fonts.load(`900 100px "${fontName}"`).finally(() => {
        document.fonts.ready.then(updateCharLayout);
      });
    }

    const mousePos = { x: -9999, y: -9999 };
    let isTicking = false;
    let animId: number | null = null;

    const tick = () => {
      let needsMore = false;
      const rect = e.getBoundingClientRect();
      for (const [idx, d] of spansData.entries()) {
        const center = centers[idx];
        if (!center) continue;
        const dist = Math.hypot(
          mousePos.x - (rect.left + center.x),
          mousePos.y - (rect.top + center.y)
        );
        const norm = Math.max(0, 1 - dist / radius);
        const smooth = norm * norm * (3 - 2 * norm);
        const targetW = restWeight + (nearWeight - restWeight) * smooth;
        d.weight += (targetW - d.weight) * 0.1;
        if (Math.abs(targetW - d.weight) > 0.5) needsMore = true;
        d.span.style.fontVariationSettings = `"wght" ${d.weight.toFixed(1)}`;
      }
      positionChars();
      isTicking = needsMore;
      if (needsMore) animId = requestAnimationFrame(tick);
    };

    const requestTick = () => {
      if (!isTicking) {
        isTicking = true;
        animId = requestAnimationFrame(tick);
      }
    };

    const onPointerMove = (evt: PointerEvent) => {
      if (evt.pointerType === "mouse") {
        mousePos.x = evt.clientX;
        mousePos.y = evt.clientY;
        requestTick();
      }
    };
    const onPointerLeave = () => {
      mousePos.x = -9999;
      mousePos.y = -9999;
      requestTick();
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    document.addEventListener("pointerleave", onPointerLeave, { passive: true });

    cleanups.push(() => {
      ro.disconnect();
      window.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerleave", onPointerLeave);
      if (animId) cancelAnimationFrame(animId);
    });
  });

  return () => cleanups.forEach((c) => c());
}

/**
 * Local time updater for [data-ar-time].
 */
export function initTime(root: HTMLElement): () => void {
  if (typeof window === "undefined") return () => {};

  const timeEls = root.querySelectorAll<HTMLElement>("[data-ar-time]");
  if (!timeEls.length) return () => {};

  const fmt = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
    timeZone: "Asia/Kuala_Lumpur",
  });

  const update = () => {
    const formatted = fmt.format(new Date());
    timeEls.forEach((el) => (el.textContent = formatted));
  };

  update();
  const timer = setInterval(update, 1000);

  return () => clearInterval(timer);
}

/**
 * Smooth scroll to top for [data-to-top].
 */
export function initToTop(root: HTMLElement): () => void {
  if (typeof window === "undefined") return () => {};

  const toTopEls = root.querySelectorAll<HTMLElement>("[data-to-top]");
  const onClick = (e: MouseEvent) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  toTopEls.forEach((el) => el.addEventListener("click", onClick));
  return () => toTopEls.forEach((el) => el.removeEventListener("click", onClick));
}
