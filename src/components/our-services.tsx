"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import styles from "./our-services.module.css";

const services = [
  {
    number: "01",
    shortName: "01 // AI SERVICES & SOLUTIONS",
    title: "AI Services & Solutions",
    description:
      "AI integration, intelligent automation and workflow optimization. Purposeful AI solutions that support the way your business works.",
  },
  {
    number: "02",
    shortName: "02 // WEBSITE DESIGN & DEV",
    title: "Website Design & Development",
    description:
      "Custom business websites, thoughtfully designed and responsively built. From a new digital presence to optimizing an existing website.",
  },
  {
    number: "03",
    shortName: "03 // UI/UX DESIGN",
    title: "UI/UX Design",
    description:
      "Intuitive interfaces, considered user journeys and clear interactions. Digital product design that puts people first.",
  },
  {
    number: "04",
    shortName: "04 // SOFTWARE DEVELOPMENT",
    title: "Software Development",
    description:
      "Custom software, web applications and business systems. Practical internal tools shaped around your team’s needs.",
  },
  {
    number: "05",
    shortName: "05 // IT SERVICES & SOLUTIONS",
    title: "IT Services & Digital Solutions",
    description:
      "Technology consulting, system integration and technical support. Connected digital solutions for your everyday business challenges.",
  },
] as const;

export function OurServices({ standalone = false }: { standalone?: boolean }) {
  const [activeService, setActiveService] = useState(0);
  const [mouseOffset, setMouseOffset] = useState({ x: 0, y: 0 });
  const sectionRef = useRef<HTMLElement>(null);
  const Heading = standalone ? "h1" : "h2";

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      const rect = section.getBoundingClientRect();
      const normX = (e.clientX - rect.left) / rect.width - 0.5;
      const normY = (e.clientY - rect.top) / rect.height - 0.5;
      setMouseOffset({
        x: normX * 18,
        y: normY * 14,
      });
    };

    const handlePointerLeave = () => {
      setMouseOffset({ x: 0, y: 0 });
    };

    section.addEventListener("pointermove", handlePointerMove, { passive: true });
    section.addEventListener("pointerleave", handlePointerLeave, { passive: true });

    return () => {
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerleave", handlePointerLeave);
    };
  }, []);

  const current = services[activeService];

  return (
    <section
      ref={sectionRef}
      id="services"
      data-theme="light"
      className={styles.section}
      aria-labelledby="services-title"
    >
      {/* 1. Organic Fluid Lava Lamp Moving Background */}
      <div className={styles.lavaLamp} aria-hidden="true">
        <div className={styles.lavaBg}>
          <div className={styles.blob} />
          <div className={styles.blob} />
          <div className={styles.blob} />
          <div className={styles.blob} />
          <div className={styles.blob} />
        </div>
      </div>

      {/* 2. Structured Layout */}
      <div className={styles.contentLayer}>
        {/* Top: Upper-Right Narrative Lead */}
        <div className={styles.topSection}>
          <div className={styles.narrativeBlock}>
            <span className={styles.narrativeLead}>
              At NO SMALL THING, every project is guided by three minds with one shared ambition.
            </span>
            <span className={styles.narrativeBody}>
              We partner with forward-thinking businesses, founders, and teams to build purposeful digital solutions across AI, custom software, UI/UX, and web development. Combining strategic foresight with hands-on technical craftsmanship.
            </span>
            <span className={styles.narrativeKicker}>
              From AI integration and software engineering to bespoke websites and digital systems.
            </span>
          </div>
        </div>

        {/* Middle: Full-bleed Horizontal Service Links Strip */}
        <nav className={styles.linksStrip} aria-label="Core services list">
          {services.map((item, index) => {
            const isSelected = index === activeService;
            return (
              <button
                key={item.number}
                type="button"
                className={`${styles.stripItem} ${isSelected ? styles.isActive : ""}`}
                onClick={() => setActiveService(index)}
                onMouseEnter={() => setActiveService(index)}
                aria-pressed={isSelected}
              >
                <span className={`${styles.stripBracket} ${styles.bracketLeft}`} aria-hidden="true">[</span>
                <span>{item.shortName}</span>
                <span className={`${styles.stripBracket} ${styles.bracketRight}`} aria-hidden="true">]</span>
              </button>
            );
          })}
        </nav>

        {/* Bottom: Left Floating Media Box + Right Massive Typographic Headline */}
        <div className={styles.bottomSection}>
          {/* Left: Floating Video Box with Optical Reticle */}
          <div
            className={styles.mediaFloatBox}
            style={{
              transform: `translate3d(${mouseOffset.x}px, ${mouseOffset.y}px, 0)`,
            }}
          >
            <div className={styles.mediaFrame}>
              <video
                className={styles.mediaVideo}
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                src="https://s3.amazonaws.com/webflow-prod-assets/69f205b0a0439779a1d746f7/6a023cc07c5866c024c8055a_Hero_section_About_Us_01.mp4"
                aria-hidden="true"
              />

              {/* Optical Reticle Crosshair */}
              <div className={styles.mediaReticle} aria-hidden="true">
                <span className={styles.reticleTickH} />
                <span className={styles.reticleTickV} />
                <span className={styles.reticleDot} />
              </div>

              {/* Active Service Badge */}
              <div className={styles.serviceBadge}>
                <div className={styles.badgeHeader}>
                  <span>SERVICE // {current.number}</span>
                  <span>ACTIVE</span>
                </div>
                <div className={styles.badgeText}>{current.description}</div>
              </div>
            </div>
          </div>

          {/* Right: Massive Typography Poster Headline */}
          <div className={styles.rightHeadlineCol}>
            <Heading id="services-title" className={styles.headline} aria-label="WHAT WE DO.">
              <span className={styles.regMark} aria-hidden="true">®</span>
              WHAT WE DO.<br />
              PURPOSEFUL DIGITAL<br />
              EXPERIENCES &amp; AI<br />
              <span className={styles.serifWord}>SOLUTIONS </span>BEYOND<br />
              BOUNDARIES
            </Heading>

            {/* Bottom Contact / Philosophy Statement */}
            <div className={styles.bottomEnd}>
              <Link href="/contact" className={styles.contactBracketLink}>
                <span className={`${styles.stripBracket} ${styles.bracketLeft}`} aria-hidden="true">[</span>
                <span>CONTACT US</span>
                <span className={`${styles.stripBracket} ${styles.bracketRight}`} aria-hidden="true">]</span>
              </Link>
              <p className={styles.endParagraph}>
                <span className={styles.dash}>— </span>
                Because purposeful digital products aren&apos;t just built with code, but shaped around the way people work and think.{" "}
                <span className={styles.endHighlight}>From idea to execution</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
