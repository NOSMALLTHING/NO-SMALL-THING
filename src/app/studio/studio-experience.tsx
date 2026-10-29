"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import styles from "./studio.module.css";

export function StudioExperience() {
  const experienceRef = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const { scrollYProgress } = useScroll({ target: experienceRef, offset: ["start start", "end end"] });
  const panelY = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);
  const [playing, setPlaying] = useState(false);
  const [unavailable, setUnavailable] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => {
      if (preference.matches) video.pause();
      else void video.play().catch(() => setPlaying(false));
    };
    update();
    preference.addEventListener("change", update);
    return () => preference.removeEventListener("change", update);
  }, []);

  function togglePlayback() {
    const video = videoRef.current;
    if (!video) return;
    if (video.paused) void video.play().catch(() => setPlaying(false));
    else video.pause();
  }

  function showIntroduction() {
    const experience = experienceRef.current;
    if (!experience) return;
    const destination = window.scrollY + experience.getBoundingClientRect().bottom - window.innerHeight;
    if (window.__lenis) window.__lenis.scrollTo(destination, { duration: 1.6 });
    else window.scrollTo({ top: destination, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
    document.getElementById("studio-story-body")?.focus({ preventScroll: true });
  }

  return (
    <article ref={experienceRef} className={styles.experience} aria-labelledby="studio-title">
      <div className={styles.scene}>
      <div className={styles.backdrop} aria-hidden="true">
        <video
          ref={videoRef}
          className={styles.video}
          src="/studio/background.mp4"
          poster="/studio/poster.jpg"
          muted
          loop
          playsInline
          preload="auto"
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onError={() => { setUnavailable(true); setPlaying(false); }}
        />
        <div className={styles.shade} />
      </div>

      <header className={styles.opening}>
        <p className={styles.kicker}>NO SMALL THING <span>/</span> ABOUT US</p>
        <div className={styles.openingBottom}>
          <button className={styles.scrollCue} onClick={showIntroduction} aria-controls="studio-story">
            <span className={styles.scrollLine} aria-hidden="true" />
            SCROLL TO MEET US <span aria-hidden="true">↓</span>
          </button>
          <button className={styles.playback} onClick={togglePlayback} disabled={unavailable} aria-label={playing ? "Pause background video" : "Play background video"}>
            <span aria-hidden="true">{playing ? "Ⅱ" : "▷"}</span>
            {unavailable ? "VIDEO UNAVAILABLE" : playing ? "PAUSE FILM" : "PLAY FILM"}
          </button>
        </div>
      </header>

      <motion.section id="studio-story" className={styles.story} style={{ y: panelY }} aria-labelledby="studio-title">
        <div id="studio-story-body" className={styles.storyBody} tabIndex={0} role="region" aria-label="About us introduction">
          <h1 id="studio-title" className={styles.title}>
            NO SMALL THING IS AN INDEPENDENT CREATIVE TECHNOLOGY STUDIO BUILDING DIGITAL SOLUTIONS ACROSS AI, SOFTWARE, WEB DEVELOPMENT, UI/UX AND <em>IT SERVICES.</em>
          </h1>
        </div>
      </motion.section>
      </div>
    </article>
  );
}
