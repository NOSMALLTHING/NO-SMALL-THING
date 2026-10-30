"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { IBM_Plex_Mono, Inter_Tight } from "next/font/google";
import styles from "./home-hero.module.css";

const display = Inter_Tight({
  subsets: ["latin"],
  weight: ["500", "800"],
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

function pad(value: number) {
  return String(value).padStart(2, "0");
}

function HeroClock() {
  const [time, setTime] = useState("00 : 00 : 00");

  useEffect(() => {
    const tick = () => {
      const now = new Date();
      setTime(`${pad(now.getHours())} : ${pad(now.getMinutes())} : ${pad(now.getSeconds())}`);
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <span className={styles.clock} aria-label="Current local time">
      [ <span className={styles.dot} aria-hidden="true" /> {time} ]
    </span>
  );
}

const HERO_VIDEOS = [
  { id: "video-1", src: "/hero/video_1.mp4", startTime: 0 },
  { id: "video-2", src: "/hero/video_2.mp4", startTime: 0 },
  { id: "video-3", src: "/hero/video_3.mp4", startTime: 0 },
];

export function HomeHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);
  const isTransitioningRef = useRef(false);

  useEffect(() => {
    const firstVideo = videoRefs.current[0];
    if (firstVideo) {
      firstVideo.currentTime = HERO_VIDEOS[0].startTime;
      firstVideo.play().catch(() => {});
    }
  }, []);

  const advanceVideo = (fromIndex: number) => {
    if (isTransitioningRef.current) return;
    isTransitioningRef.current = true;

    const nextIndex = (fromIndex + 1) % HERO_VIDEOS.length;
    const nextVideo = videoRefs.current[nextIndex];

    if (nextVideo) {
      nextVideo.currentTime = HERO_VIDEOS[nextIndex].startTime;
      nextVideo.play().catch(() => {});
    }

    setCurrentIndex(nextIndex);

    window.setTimeout(() => {
      isTransitioningRef.current = false;
      videoRefs.current.forEach((video, idx) => {
        if (idx !== nextIndex && video && !video.paused) {
          video.pause();
        }
      });
    }, 1000);
  };

  const handleTimeUpdate = (index: number) => {
    if (index !== currentIndex || isTransitioningRef.current) return;
    const video = videoRefs.current[index];
    if (!video || !video.duration) return;

    const remaining = video.duration - video.currentTime;
    if (remaining <= 0.75 && remaining > 0) {
      advanceVideo(index);
    }
  };

  const handleEnded = (index: number) => {
    if (index === currentIndex) {
      advanceVideo(index);
    }
  };

  useEffect(() => {
    const handleVisibility = () => {
      const activeVideo = videoRefs.current[currentIndex];
      if (!activeVideo) return;
      if (document.hidden) {
        activeVideo.pause();
      } else {
        activeVideo.play().catch(() => {});
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    return () => document.removeEventListener("visibilitychange", handleVisibility);
  }, [currentIndex]);

  return (
    <section className={styles.hero} data-theme="dark" aria-labelledby="home-title">
      <div className={styles.mediaWrap}>
        <picture>
          <source srcSet="/hero/poster.webp" type="image/webp" />
          <img
            src="/hero/poster.jpg"
            alt=""
            className={styles.posterFallback}
            loading="eager"
            decoding="async"
          />
        </picture>
        {HERO_VIDEOS.map((item, idx) => (
          <video
            key={item.id}
            ref={(el) => {
              videoRefs.current[idx] = el;
            }}
            src={item.src}
            className={`${styles.videoItem} ${idx === currentIndex ? styles.videoActive : ""}`}
            muted
            playsInline
            autoPlay={idx === 0}
            preload={idx === 0 ? "auto" : "metadata"}
            onTimeUpdate={() => handleTimeUpdate(idx)}
            onEnded={() => handleEnded(idx)}
            aria-hidden="true"
          />
        ))}
      </div>
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
        <span>3+ DIGITAL FREAKS</span>
        <span>KUALA LUMPUR BASED</span>
        <HeroClock />
      </div>

      <div id="hero-end" className="hero-end" tabIndex={-1} />
    </section>
  );
}
