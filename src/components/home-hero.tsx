"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import localFont from "next/font/local";
import gsap from "gsap";
import styles from "./home-hero.module.css";

const display = localFont({
  src: "../fonts/SuisseBPIntl-Bold.otf",
  weight: "800",
  display: "swap",
  adjustFontFallback: false,
});

const mono = localFont({
  src: "../fonts/SometypeMono-Variable.ttf",
  weight: "400 700",
  display: "swap",
  adjustFontFallback: false,
});

function pad(value: number) {
  return String(value).padStart(2, "0");
}

class MonoTextReveal {
  element: HTMLElement;
  animationTarget: HTMLElement | null;
  chars: string[];
  charLength: number;
  varMap: Map<string, string>;
  originalText: string;
  length: number;
  duration: number;
  shownChars: number;
  swappedChars: number;
  randomizedText: string;
  tl: gsap.core.Timeline | null;

  constructor(element: HTMLElement, target: HTMLElement | null, duration = 0.45) {
    this.element = element;
    this.animationTarget = target || element;
    this.chars = ["#", "#", "#", "#", "#", "$", "*", "@", "(", "0", "%", "1", ">"];
    this.charLength = this.chars.length;
    this.varMap = new Map([
      [" ", " "],
      ["[", "["],
      ["]", "]"],
    ]);
    const extracted = (this.animationTarget?.textContent || "").trim();
    this.originalText = extracted.length > 0 ? extracted : "[ We are no small thing ]";
    this.length = this.originalText.length;
    this.duration = duration;
    this.shownChars = 0;
    this.swappedChars = 0;
    this.randomizedText = "";
    this.tl = null;
    this.randomize();
  }

  randomize() {
    this.randomizedText = "";
    for (let i = 0; i < this.length; i++) {
      const char = this.originalText[i];
      this.randomizedText +=
        this.varMap.get(char) ?? this.chars[Math.floor(Math.random() * this.charLength)];
    }
  }

  updateDisplay() {
    let str = "";
    for (let i = 0; i < this.length; i++) {
      if (i < this.swappedChars) {
        str += this.originalText[i];
      } else if (i < this.shownChars) {
        str += this.randomizedText[i];
      } else {
        break;
      }
    }
    if (this.animationTarget) {
      this.animationTarget.textContent = str;
    }
  }

  showCharLoop(obj: { value: number }) {
    const current = Math.floor(obj.value);
    if (current > this.shownChars) {
      this.shownChars = Math.min(this.length, current);
      for (let i = this.swappedChars; i < this.shownChars; i++) {
        const char = this.originalText[i];
        if (this.varMap.has(char)) continue;
        if (Math.random() < 0.25) {
          const randChar = this.chars[Math.floor(Math.random() * this.charLength)];
          this.randomizedText =
            this.randomizedText.slice(0, i) + randChar + this.randomizedText.slice(i + 1);
        }
      }
      this.updateDisplay();
    }
  }

  replaceCharLoop(obj: { value: number }) {
    const current = Math.floor(obj.value);
    if (current > this.swappedChars) {
      this.swappedChars = Math.min(this.length, current);
      this.updateDisplay();
    }
  }

  play() {
    if (this.tl) this.tl.kill();
    this.randomize();
    this.shownChars = 0;
    this.swappedChars = 0;
    this.element.classList.add(styles.kickerActive);

    const t = (this.duration ?? 0.25) + this.length * 0.005;
    this.tl = gsap.timeline({
      onComplete: () => {
        this.shownChars = this.length;
        this.swappedChars = this.length;
        if (this.animationTarget) {
          this.animationTarget.textContent = this.originalText;
        }
      },
    });

    const n = { value: 0 };
    this.tl.to(
      n,
      {
        value: this.length,
        ease: "power2.out",
        duration: t,
        onUpdate: () => {
          this.showCharLoop(n);
        },
      },
      0
    );

    const r = { value: 0 };
    this.tl.to(
      r,
      {
        value: this.length,
        ease: "power2.out",
        duration: t,
        onUpdate: () => {
          this.replaceCharLoop(r);
        },
      },
      0.2
    );
  }

  reset() {
    if (this.tl) this.tl.kill();
    this.shownChars = 0;
    this.swappedChars = 0;
    this.element.classList.remove(styles.kickerActive);
    if (this.animationTarget) {
      this.animationTarget.textContent = "";
    }
  }

  destroy() {
    if (this.tl) {
      this.tl.kill();
      this.tl = null;
    }
    if (this.animationTarget) {
      this.animationTarget.textContent = this.originalText;
    }
  }
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
  const transitionTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (transitionTimeoutRef.current !== null) {
        clearTimeout(transitionTimeoutRef.current);
      }
      videoRefs.current.forEach((video) => {
        if (video && !video.paused) {
          video.pause();
        }
      });
    };
  }, []);

  const kickerRef = useRef<HTMLParagraphElement>(null);
  const targetRef = useRef<HTMLSpanElement>(null);
  const monoRevealRef = useRef<MonoTextReveal | null>(null);
  const titleLinesRef = useRef<(HTMLSpanElement | null)[]>([]);

  const playHeroEntrance = useCallback(() => {
    // 1. Text decode on [ WE ARE NO SMALL THING ]
    const timer = setTimeout(() => {
      if (monoRevealRef.current) {
        monoRevealRef.current.play();
      }
    }, 150);

    // 2. Ensure title lines display normally without blocking or flash
    const lines = titleLinesRef.current.filter(Boolean);
    if (lines.length) {
      gsap.set(lines, { yPercent: 0, clipPath: "none" });
    }

    return () => {
      clearTimeout(timer);
      if (monoRevealRef.current) {
        monoRevealRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (kickerRef.current) {
      monoRevealRef.current = new MonoTextReveal(kickerRef.current, targetRef.current, 0.45);
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduced) {
      const lines = titleLinesRef.current.filter(Boolean);
      if (lines.length) {
        gsap.set(lines, { yPercent: 0, clipPath: "none" });
      }
      return () => {
        monoRevealRef.current?.destroy();
      };
    }

    return playHeroEntrance();
  }, [playHeroEntrance]);

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

    if (transitionTimeoutRef.current !== null) {
      clearTimeout(transitionTimeoutRef.current);
    }
    transitionTimeoutRef.current = setTimeout(() => {
      transitionTimeoutRef.current = null;
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
    <section className={`${styles.hero} home-hero`} data-theme="dark" aria-labelledby="home-title">
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

      <div className={styles.copy}>
        <p className={styles.kicker} ref={kickerRef}>
          <span className="js-animation-target" ref={targetRef}>
            [ We are no small thing ]
          </span>
        </p>
        <h1 id="home-title" className={`${styles.title} ${display.className}`}>
          <span className={styles.lineMask}>
            <span
              className={styles.lineInner}
              ref={(el) => {
                titleLinesRef.current[0] = el;
              }}
            >
              WE BUILD
            </span>
          </span>
          <br />
          <span className={styles.lineMask}>
            <span
              className={styles.lineInner}
              ref={(el) => {
                titleLinesRef.current[1] = el;
              }}
            >
              WEBSITES, SYSTEMS
            </span>
          </span>
          <br />
          <span className={styles.lineMask}>
            <span
              className={styles.lineInner}
              ref={(el) => {
                titleLinesRef.current[2] = el;
              }}
            >
              AND THE AI.
            </span>
          </span>
        </h1>
      </div>

      <p className={`${styles.aside} ${mono.className}`}>
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
