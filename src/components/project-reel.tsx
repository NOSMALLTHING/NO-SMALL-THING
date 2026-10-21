"use client";

import { useEffect, useRef, useState, type ReactNode, type PointerEvent, type KeyboardEvent } from "react";
import { animate, useReducedMotion } from "motion/react";
import { Arrow } from "./ui/arrow";
import styles from "./project-reel.module.css";

/** Native horizontal scrolling remains available without JS; mouse drag adds a short inertial snap. */
export function ProjectReel({ children, count }: { children: ReactNode; count: number }) {
  const viewport = useRef<HTMLDivElement>(null);
  const drag = useRef<{ id: number; startX: number; startScroll: number; lastX: number; lastTime: number; velocity: number; moved: boolean } | null>(null);
  const animation = useRef<ReturnType<typeof animate> | null>(null);
  const suppressClick = useRef(false);
  const [active, setActive] = useState(0);
  const [dragging, setDragging] = useState(false);
  const [ready, setReady] = useState(false);
  const reduced = useReducedMotion();

  const positions = () => {
    const el = viewport.current;
    if (!el) return [];
    const max = el.scrollWidth - el.clientWidth;
    return Array.from(el.querySelectorAll<HTMLElement>("ol > li")).map(item => Math.min(max, item.offsetLeft));
  };
  const moveTo = (index: number) => {
    const el = viewport.current;
    if (!el) return;
    animation.current?.stop();
    el.removeAttribute("data-dragging");
    setDragging(false);
    el.scrollTo({ left: positions()[Math.max(0, Math.min(count - 1, index))] ?? 0, behavior: reduced ? "instant" : "smooth" });
  };
  useEffect(() => () => { animation.current?.stop(); }, []);
  useEffect(() => {
    if (reduced) {
      animation.current?.stop();
      viewport.current?.removeAttribute("data-dragging");
    }
  }, [reduced]);
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    setReady(true);
    const resize = new ResizeObserver(() => {
      animation.current?.stop();
      el.removeAttribute("data-dragging");
      drag.current = null;
      setDragging(false);
    });
    resize.observe(el);
    return () => resize.disconnect();
  }, []);

  function start(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse" || event.button !== 0) return;
    animation.current?.stop();
    suppressClick.current = false;
    drag.current = { id: event.pointerId, startX: event.clientX, startScroll: event.currentTarget.scrollLeft, lastX: event.clientX, lastTime: event.timeStamp, velocity: 0, moved: false };
  }
  function update(event: PointerEvent<HTMLDivElement>) {
    const state = drag.current;
    if (!state || state.id !== event.pointerId || event.buttons !== 1) return;
    const distance = event.clientX - state.startX;
    if (!state.moved && Math.abs(distance) < 7) return;
    if (!state.moved) {
      state.moved = true;
      suppressClick.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      event.currentTarget.setAttribute("data-dragging", "true");
      setDragging(true);
    }
    event.preventDefault();
    const elapsed = Math.max(1, event.timeStamp - state.lastTime);
    state.velocity = (state.lastX - event.clientX) / elapsed;
    state.lastX = event.clientX;
    state.lastTime = event.timeStamp;
    event.currentTarget.scrollLeft = state.startScroll - distance;
  }
  function finish(event: PointerEvent<HTMLDivElement>, cancelled = false) {
    const state = drag.current;
    if (!state || state.id !== event.pointerId) return;
    drag.current = null;
    const el = event.currentTarget;
    if (el.hasPointerCapture(event.pointerId)) el.releasePointerCapture(event.pointerId);
    setDragging(false);
    if (!state.moved) { el.removeAttribute("data-dragging"); return; }
    const velocity = event.timeStamp - state.lastTime < 100 && !cancelled ? state.velocity : 0;
    const predicted = el.scrollLeft + velocity * 160;
    const stops = positions();
    const target = stops.reduce((nearest, stop) => Math.abs(stop - predicted) < Math.abs(nearest - predicted) ? stop : nearest, stops[0] ?? 0);
    const done = () => { el.removeAttribute("data-dragging"); };
    if (reduced || cancelled) { el.scrollLeft = target; done(); }
    else animation.current = animate(el.scrollLeft, target, { duration: .7, ease: [.16, 1, .3, 1], onUpdate: value => { el.scrollLeft = value; }, onComplete: done });
  }
  function keyboard(event: KeyboardEvent<HTMLDivElement>) {
    if (event.target !== event.currentTarget) return;
    if (["ArrowRight", "ArrowLeft", "Home", "End"].includes(event.key)) {
      event.preventDefault();
      moveTo(event.key === "Home" ? 0 : event.key === "End" ? count - 1 : active + (event.key === "ArrowRight" ? 1 : -1));
    }
  }
  return <div id="project-reel" className={styles.reel}>
    <div className={styles.controls}>
      <p className={`eyebrow ${styles.hint}`}><span aria-hidden="true">↔</span> <span className={styles.mouseHint}>DRAG TO EXPLORE</span><span className={styles.touchHint}>SWIPE TO EXPLORE</span></p>
      <div className={styles.navigation}><span className="eyebrow" aria-live="polite" aria-atomic="true">{String(active + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span><button type="button" aria-label="Previous project" disabled={!ready || active === 0} onClick={() => moveTo(active - 1)}><Arrow direction="down" /></button><button type="button" aria-label="Next project" disabled={!ready || active === count - 1} onClick={() => moveTo(active + 1)}><Arrow /></button></div>
    </div>
    <div ref={viewport} className={styles.viewport} role="region" aria-roledescription="carousel" aria-label="Selected projects" tabIndex={0} data-interacting={dragging || undefined} data-enhanced={ready || undefined}
      onPointerDown={start} onPointerMove={update} onPointerUp={event => finish(event)} onPointerCancel={event => finish(event, true)}
      onPointerLeave={() => { if (drag.current && !drag.current.moved) { drag.current = null; viewport.current?.removeAttribute("data-dragging"); } }}
      onClickCapture={event => { if (suppressClick.current && event.detail > 0) { event.preventDefault(); event.stopPropagation(); suppressClick.current = false; } }}
      onDragStart={event => event.preventDefault()} onKeyDown={keyboard}
      onScroll={() => { const el = viewport.current; if (el) { const stops = positions(); const closest = stops.reduce((best, stop, index) => Math.abs(stop - el.scrollLeft) < Math.abs(stops[best] - el.scrollLeft) ? index : best, 0); setActive(closest); } }}
      onFocusCapture={event => { if (drag.current) return; const item = (event.target as HTMLElement).closest("ol > li"); if (item) { const items = Array.from(viewport.current?.querySelectorAll("ol > li") ?? []); moveTo(items.indexOf(item)); } }}>
      {children}
    </div>
    <noscript><p className={`eyebrow ${styles.fallback}`}>Swipe, use arrow keys, or use the horizontal scrollbar to explore the projects.</p></noscript>
    <div className={styles.progress} aria-hidden="true"><span style={{ transform: `translateX(${active * 100}%)`, width: `${100 / count}%` }} /></div>
  </div>;
}
