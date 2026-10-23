"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import styles from "./production-service-about.module.css";

const VIDEO_SRC = "https://s3.amazonaws.com/webflow-prod-assets/69f205b0a0439779a1d746f7/6a023cc07c5866c024c8055a_Hero_section_About_Us_01.mp4";

export function ProductionServiceAbout({ standalone = false }: { standalone?: boolean }) {
  const sectionRef = useRef<HTMLElement>(null);
  const videoWrapRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const HeadingTag = standalone ? "h1" : "h2";

  useEffect(() => {
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFinePointer) return;

    const section = sectionRef.current;
    const videoWrap = videoWrapRef.current;
    if (!section || !videoWrap) return;

    let targetX = -1;
    let targetY = -1;
    let currentX = -1;
    let currentY = -1;
    let prevX = -1;
    let tilt = 0;
    let animId: number;
    let active = false;

    const handlePointerMove = (e: PointerEvent) => {
      const rect = section.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      active = true;
      setIsHovered(true);
    };

    const handlePointerLeave = () => {
      active = false;
      setIsHovered(false);
    };

    const updatePosition = () => {
      if (active && targetX >= 0 && targetY >= 0) {
        if (currentX < 0) {
          currentX = targetX;
          currentY = targetY;
        } else {
          currentX += (targetX - currentX) * 0.09;
          currentY += (targetY - currentY) * 0.09;
        }

        const deltaX = currentX - (prevX < 0 ? currentX : prevX);
        prevX = currentX;
        tilt += (deltaX * 0.35 - tilt) * 0.12;

        videoWrap.style.left = `${currentX}px`;
        videoWrap.style.top = `${currentY}px`;
        videoWrap.style.transform = `translate(-50%, -50%) rotate(${tilt.toFixed(2)}deg) scale(1.02)`;
        videoWrap.style.transition = "none";
      } else {
        // Return to anchor resting position on the left
        videoWrap.style.left = "10%";
        videoWrap.style.top = "56%";
        videoWrap.style.transform = "translate(0, -50%) rotate(0deg) scale(1)";
        videoWrap.style.transition = "all 600ms cubic-bezier(0.16, 1, 0.3, 1)";
        currentX = -1;
        currentY = -1;
        prevX = -1;
        tilt = 0;
      }

      animId = requestAnimationFrame(updatePosition);
    };

    section.addEventListener("pointermove", handlePointerMove, { passive: true });
    section.addEventListener("pointerleave", handlePointerLeave, { passive: true });
    animId = requestAnimationFrame(updatePosition);

    return () => {
      section.removeEventListener("pointermove", handlePointerMove);
      section.removeEventListener("pointerleave", handlePointerLeave);
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <section ref={sectionRef} id="services" className={styles.section} aria-label="Studio overview and production services">
      {/* 1. Fluid Lava Lamp Animated Background */}
      <div className={styles.lavaLamp} aria-hidden="true">
        <div className={styles.lavaBg}>
          <div className={`${styles.blob} ${styles.blob1}`} />
          <div className={`${styles.blob} ${styles.blob2}`} />
          <div className={`${styles.blob} ${styles.blob3}`} />
          <div className={`${styles.blob} ${styles.blob4}`} />
          <div className={`${styles.blob} ${styles.blob5}`} />

          <div className={styles.gridOverlay}>
            <div className={styles.gridCol} />
            <div className={styles.gridCol} />
            <div className={styles.gridCol} />
          </div>
        </div>
      </div>

      {/* 2. Top Area: Editorial Narrative Paragraph */}
      <div className={styles.topArea}>
        <p className={styles.narrativeParagraph}>
          <span className={styles.paragraphLead}>
            At PSP Production, every project is guided by senior executive producers with decades of international experience.
          </span>
          <span className={styles.paragraphBody}>
            We partner with agencies, brands, and filmmakers to deliver seamless, high-end productions across Portugal and Spain, combining strategic oversight with hands-on execution. From locations and casting to logistics and on-set coordination
          </span>
          <span className={styles.paragraphHighlight}>
            From locations and casting to logistics and on-set coordination
          </span>
        </p>
      </div>

      {/* 3. Full-bleed Social Ribbon with Bracket Micro-interactions */}
      <div className={styles.socialRibbon} role="navigation" aria-label="Social media channels">
        <a
          href="https://x.com/ProdPortugal"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
        >
          <span className={styles.bracketMark}>[</span>
          <span> X/TWITTER </span>
          <span className={styles.bracketMark}>]</span>
        </a>
        <a
          href="https://www.facebook.com/ProductionPortugalSpain/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
        >
          <span className={styles.bracketMark}>[</span>
          <span> FACEBOOK </span>
          <span className={styles.bracketMark}>]</span>
        </a>
        <a
          href="https://www.instagram.com/productionportugal/"
          target="_blank"
          rel="noopener noreferrer"
          className={styles.socialLink}
        >
          <span className={styles.bracketMark}>[</span>
          <span> INSTAGRAM </span>
          <span className={styles.bracketMark}>]</span>
        </a>
      </div>

      {/* 4. Interactive Floating & Cursor Video */}
      <div ref={videoWrapRef} className={styles.cursorVideo} aria-hidden="true">
        <video
          className={styles.videoElement}
          muted
          loop
          autoPlay
          playsInline
          preload="metadata"
          src={VIDEO_SRC}
        />
      </div>

      {/* 5. Bottom Section: Huge Typography & Contact */}
      <div className={styles.bottomPart}>
        <HeadingTag className={styles.bigHeading}>
          <strong className={styles.regMark}>®</strong>WE’RE A LEADING
          <br />
          PREMIUM FULL-SCALE
          <br />
          PRODUCTION SERVICE
          <br />
          <span className={styles.headingItalic}>PARTNER </span>IN PORTUGAL
          <br />
          AND SPAIN
        </HeadingTag>

        <div className={styles.bottomEnd}>
          <Link href="/contact" className={styles.contactLink}>
            <span className={styles.bracketMark}>[</span>
            <span> CONTACT US </span>
            <span className={styles.bracketMark}>]</span>
          </Link>
          <p className={styles.endParagraph}>
            <span>— </span>Because when filmmakers feel truly looked after, not just in production terms, but as people, they come back.{" "}
            <span className={styles.endItalic}>Again and again</span>.
          </p>
        </div>
      </div>
    </section>
  );
}
