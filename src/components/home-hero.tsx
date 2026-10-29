import Link from "next/link";
import { IBM_Plex_Mono, Inter_Tight } from "next/font/google";
import styles from "./home-hero.module.css";

const display = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "700"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

export function HomeHero() {
  return (
    <section className={styles.hero} data-theme="light" aria-labelledby="home-title">
      <img className={styles.media} src="/hero/opening.jpg" alt="" />
      <div className={styles.shade} aria-hidden="true" />

      <Link href="/contact" className={`${styles.contact} ${mono.className}`}>
        GET IN TOUCH
      </Link>

      <div className={styles.copy}>
        <p className={`${styles.kicker} ${mono.className}`}>[ WE ARE NO SMALL THING ]</p>
        <h1 id="home-title" className={`${styles.title} ${display.className}`}>
          WE BUILD
          <br />
          WEBSITES, SYSTEMS
          <br />
          AND THE AI.
        </h1>
      </div>

      <p className={`${styles.aside} ${display.className}`}>
        Not a pitch deck and not a hand-off. Three people in Kuala Lumpur take it from the first sketch to the thing that actually runs.
      </p>

      <div className={`${styles.meta} ${mono.className}`}>
        <span>KUALA LUMPUR</span>
      </div>

      <div id="hero-end" className="hero-end" tabIndex={-1} />
    </section>
  );
}
