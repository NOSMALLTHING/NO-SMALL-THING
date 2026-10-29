import Image from "next/image";
import spaceship from "../../public/brand/spaceship.webp";
import { CinematicArtwork } from "./cinematic-artwork";
import { HeroAtmosphere } from "./hero-atmosphere";
import { MarsGlobe } from "./mars-globe";
import styles from "./hero-poster.module.css";

export function HomeHero() {
  return (
    <>
      <CinematicArtwork>
        {/* 1. 3D WebGL Mars Sphere Rolling Forward */}
        <MarsGlobe />

        {/* 2. Cinematic Atmospheric Horizon Lighting */}
        <HeroAtmosphere />

        {/* 3. Foreground Hovering Spaceship (Cruising forward above Mars) */}
        <div className={styles.spaceshipContainer} aria-hidden="true">
          <Image
            src={spaceship}
            alt="Spacecraft cruising over the Mars horizon"
            width={326}
            height={260}
            priority
            className={styles.spaceshipImage}
          />
        </div>

        {/* 4. Native Sharp Typography & Central Vertical Glowing Laser Beam */}
        <div className={styles.heroContainer}>
          <header className={styles.topRow}>
            <span className={styles.brandLabel}>NO SMALL THING</span>
            <div className={styles.ambitionBlock}>
              <span>THREE MINDS.</span>
              <span>ONE AMBITION.</span>
              <span>BEYOND BOUNDARIES.</span>
            </div>
          </header>

          <div className={styles.headlineContainer} aria-hidden="true">
            <span className={styles.headlineWord}>TRANSCEND</span>
            <div className={styles.laserBeam}>
              <div className={styles.laserDot} />
            </div>
            <span className={styles.headlineWord}>EVERYTHING</span>
          </div>
        </div>
      </CinematicArtwork>
      <div id="hero-end" className="hero-end" tabIndex={-1} />
    </>
  );
}
