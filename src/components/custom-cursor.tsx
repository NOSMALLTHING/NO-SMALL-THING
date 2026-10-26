"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useReducedMotion } from "motion/react";
import styles from "./custom-cursor.module.css";

interface Ripple {
  id: number;
  x: number;
  y: number;
}

export function CustomCursor() {
  const pathname = usePathname();
  const reducedMotion = useReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const reticleRef = useRef<HTMLDivElement>(null);
  const frameRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);

  const [visible, setVisible] = useState(false);
  const [suppressed, setSuppressed] = useState(false);
  const [interactive, setInteractive] = useState(false);
  const [isProject, setIsProject] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const [isMenuMode, setIsMenuMode] = useState(false);
  const [isMenuItem, setIsMenuItem] = useState(false);
  const [hudText, setHudText] = useState("");
  const [ripples, setRipples] = useState<Ripple[]>([]);

  useEffect(() => {
    // Only initialize on desktop / devices with fine pointer and hover support
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFinePointer) return;

    const root = document.documentElement;
    root.classList.add("custom-cursor-enabled");

    // A modal dialog is painted in the browser's top layer, above the normal
    // document. Promote this cursor only while the Menu is open so it remains
    // visible there without changing the cursor on any other page.
    const menuDialog = document.querySelector<HTMLDialogElement>("#site-menu");
    const syncMenuCursorLayer = () => {
      const cursor = containerRef.current;
      if (!cursor || !menuDialog) return;

      if (menuDialog.open && typeof cursor.showPopover === "function") {
        try {
          cursor.setAttribute("popover", "manual");
          if (!cursor.matches(":popover-open")) cursor.showPopover();
          if (!cursor.matches(":popover-open")) throw new Error("Cursor popover did not enter the top layer.");
          root.classList.add("menu-cursor-top-layer");
          return;
        } catch {
          // The scoped CSS cursor is the fallback when top-layer popovers are unavailable.
          cursor.removeAttribute("popover");
        }
      }

      if (cursor.matches(":popover-open") && typeof cursor.hidePopover === "function") {
        cursor.hidePopover();
      }
      cursor.removeAttribute("popover");
      root.classList.remove("menu-cursor-top-layer");
    };
    const menuObserver = menuDialog ? new MutationObserver(syncMenuCursorLayer) : null;
    menuObserver?.observe(menuDialog!, { attributes: true, attributeFilter: ["open"] });
    syncMenuCursorLayer();

    let mouseX = -100;
    let mouseY = -100;
    let frameX = -100;
    let frameY = -100;
    let textX = -100;
    let textY = -100;
    let prevMouseX = -100;
    let prevMouseY = -100;
    let initialized = false;
    let rafId: number;

    const interactiveSelector = 'a, button, [role="button"], input, textarea, select, [data-cursor-text], [data-cursor-project]';

    const checkBackgroundLight = (x: number, y: number): boolean => {
      // Check data-theme="light" sections
      const lightElements = document.querySelectorAll<HTMLElement>('[data-theme="light"]');
      for (let i = 0; i < lightElements.length; i++) {
        const rect = lightElements[i].getBoundingClientRect();
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
          return true;
        }
      }

      // Check element directly under pointer
      const el = document.elementFromPoint(x, y);
      if (el) {
        if (el.closest('[data-theme="light"], .theme-light')) return true;
        let cur: HTMLElement | null = el as HTMLElement;
        while (cur && cur !== document.body && cur !== document.documentElement) {
          const bg = window.getComputedStyle(cur).backgroundColor;
          if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
            const rgb = bg.match(/\d+/g);
            if (rgb && rgb.length >= 3) {
              const lum = 0.299 * Number(rgb[0]) + 0.587 * Number(rgb[1]) + 0.114 * Number(rgb[2]);
              if (lum > 160) return true;
              if (lum < 100) return false;
            }
          }
          cur = cur.parentElement;
        }
      }
      return false;
    };

    const updateHoverState = (target: Element | null) => {
      if (!target) {
        setInteractive(false);
        setIsProject(false);
        setIsMenuMode(false);
        setIsMenuItem(false);
        setSuppressed(false);
        setHudText("");
        return;
      }

      const menu = target.closest("#site-menu");
      const menuItem = target.closest("#site-menu .menu-item");
      setIsMenuMode(!!menu);
      setIsMenuItem(!!menuItem);

      // Hide cursor over text inputs so native caret is unobstructed
      const isInput = !!target.closest('input, textarea, select, [contenteditable="true"]');
      setSuppressed(isInput);

      const interactiveEl = target.closest(interactiveSelector);
      const isInteractive = !!interactiveEl && !isInput;
      setInteractive(isInteractive);

      // Check if project or study card
      const projectEl = target.closest('[data-cursor-project], [href*="/work/"], .project');
      setIsProject(!!projectEl);

      // Contextual telemetry text
      const customText = target.closest('[data-cursor-text]')?.getAttribute("data-cursor-text");
      if (customText) {
        setHudText(customText);
      } else if (menuItem) {
        const index = menuItem.querySelector(".eyebrow")?.textContent?.trim();
        setHudText(index ? `OPEN / ${index}` : "OPEN");
      } else if (menu) {
        setHudText("INDEX");
      } else if (projectEl) {
        setHudText("SEE STUDY");
      } else if (target.closest(".menu-trigger-bracketed, #menu-title")) {
        setHudText("INDEX");
      } else if (target.closest(".nav-bracket-link")) {
        setHudText("NAVIGATE");
      } else if (target.closest('a[href^="mailto:"], .submit, .cta')) {
        setHudText("TRANSMIT");
      } else {
        setHudText("");
      }
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      mouseX = e.clientX;
      mouseY = e.clientY;

      if (!initialized) {
        frameX = mouseX;
        frameY = mouseY;
        textX = mouseX;
        textY = mouseY;
        prevMouseX = mouseX;
        prevMouseY = mouseY;
        initialized = true;
      }

      setVisible(true);
      updateHoverState(e.target as Element);
      setIsLight(checkBackgroundLight(mouseX, mouseY));
    };

    const onPointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      setIsPressed(true);
    };

    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      setIsPressed(false);

      // Trigger optical ripple shockwave
      const newRipple = { id: Date.now(), x: e.clientX, y: e.clientY };
      setRipples(prev => [...prev.slice(-3), newRipple]);
      setTimeout(() => {
        setRipples(prev => prev.filter(r => r.id !== newRipple.id));
      }, 500);
    };

    const onPointerLeave = () => {
      setVisible(false);
      setInteractive(false);
      setIsMenuMode(false);
      setIsMenuItem(false);
      setIsPressed(false);
      setHudText("");
    };

    // Render loop using requestAnimationFrame
    const tick = () => {
      if (initialized && containerRef.current) {
        // 1. Instant crosshair reticle (0 latency aiming)
        if (reticleRef.current) {
          reticleRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
        }

        // 2. Inertial trailing brackets
        if (frameRef.current) {
          const lerpFactor = reducedMotion ? 1 : 0.18;
          frameX += (mouseX - frameX) * lerpFactor;
          frameY += (mouseY - frameY) * lerpFactor;

          // Velocity tilt & stretch calculation
          const vx = mouseX - prevMouseX;
          const vy = mouseY - prevMouseY;
          prevMouseX = mouseX;
          prevMouseY = mouseY;

          const stretchX = reducedMotion ? 1 : 1 + Math.min(Math.abs(vx) * 0.007, 0.32);
          const stretchY = reducedMotion ? 1 : 1 + Math.min(Math.abs(vy) * 0.007, 0.32);
          const tilt = reducedMotion ? 0 : Math.max(-10, Math.min(10, vx * 0.22));

          frameRef.current.style.transform = `translate3d(${frameX}px, ${frameY}px, 0) translate(-50%, -50%) rotate(${tilt}deg) scale(${stretchX}, ${stretchY})`;
        }

        // 3. Trailing HUD Telemetry badge
        if (badgeRef.current) {
          const textLerp = reducedMotion ? 1 : 0.13;
          textX += (mouseX - textX) * textLerp;
          textY += (mouseY - textY) * textLerp;

          badgeRef.current.style.transform = `translate3d(${textX}px, ${textY}px, 0)`;
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerdown", onPointerDown, { passive: true });
    window.addEventListener("pointerup", onPointerUp, { passive: true });
    document.documentElement.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("blur", onPointerLeave);

    rafId = requestAnimationFrame(tick);

    return () => {
      menuObserver?.disconnect();
      const cursor = containerRef.current;
      if (cursor?.matches(":popover-open") && typeof cursor.hidePopover === "function") {
        cursor.hidePopover();
      }
      cursor?.removeAttribute("popover");
      root.classList.remove("custom-cursor-enabled", "menu-cursor-top-layer");
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointerup", onPointerUp);
      document.documentElement.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("blur", onPointerLeave);
      cancelAnimationFrame(rafId);
    };
  }, [pathname, reducedMotion]);

  return (
    <div
      ref={containerRef}
      className={`${styles.cursorContainer} ${visible ? styles.isVisible : ""} ${
        suppressed ? styles.isSuppressed : ""
      } ${interactive ? styles.isInteractive : ""} ${isProject ? styles.isProject : ""} ${
        isPressed ? styles.isPressed : ""
      } ${isLight ? styles.isLight : ""} ${isMenuMode ? styles.isMenuMode : ""} ${
        isMenuItem ? styles.isMenuItem : ""
      }`}
      aria-hidden="true"
    >
      {/* 1. Instant precision optical reticle */}
      <div ref={reticleRef} className={styles.reticleInner}>
        <span className={styles.centerDot} />
        <span className={styles.crossTickH} />
        <span className={styles.crossTickV} />
      </div>

      {/* 2. Inertial framing brackets with velocity stretch */}
      <div ref={frameRef} className={styles.frameOuter}>
        <span className={`${styles.corner} ${styles.topLeft}`} />
        <span className={`${styles.corner} ${styles.topRight}`} />
        <span className={`${styles.corner} ${styles.bottomLeft}`} />
        <span className={`${styles.corner} ${styles.bottomRight}`} />
      </div>

      {/* 3. Trailing HUD Telemetry Badge */}
      <div ref={badgeRef} className={`${styles.hudBadge} ${hudText ? styles.hudBadgeVisible : ""}`}>
        <span className={styles.hudDot} />
        <span>{hudText}</span>
      </div>

      {/* 4. Click shockwave optical ripples */}
      {ripples.map(ripple => (
        <span
          key={ripple.id}
          className={styles.clickRing}
          style={{ transform: `translate3d(${ripple.x}px, ${ripple.y}px, 0) translate(-50%, -50%)` }}
        />
      ))}
    </div>
  );
}
