"use client";

import styles from "./hero-atmosphere.module.css";

export function HeroAtmosphere() {
  return (
    <div className={styles.atmosphereWrap} aria-hidden="true">
      {/* 1. Low-power CSS Sunrise Glow (No 40px blur filter, hardware compositor friendly) */}
      <div className={styles.planetCorona} />

      {/* 2. Anamorphic Cinema Lens Flare Horizon Line */}
      <div className={styles.lensGlow} />
    </div>
  );
}
