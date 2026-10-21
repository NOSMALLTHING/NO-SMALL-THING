"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "motion/react";

/** Static, readable SSR. Only enhance after hydration and never override OS preferences. */
export function useCinematicMotion(desktopOnly = false) {
  const reduced = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [desktop, setDesktop] = useState(false);
  useEffect(() => {
    const query = window.matchMedia("(min-width: 1024px)");
    const update = () => setDesktop(query.matches);
    update();
    setReady(true);
    query.addEventListener("change", update);
    return () => query.removeEventListener("change", update);
  }, []);
  return ready && !reduced && (!desktopOnly || desktop);
}
