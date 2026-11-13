"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useReducedMotion, motion } from "motion/react";
import { navigation, site } from "@/lib/site";
import { Container } from "./ui/container";
import { Arrow } from "./ui/arrow";
import { BrandLogo } from "./brand-logo";

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const isActive = (href: string) => pathname === href || pathname.startsWith(`${href}/`);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const detectLightAtLogo = () => {
      setScrolled(window.scrollY > 15);

      const logoEl = logoRef.current;
      if (!logoEl) return;

      const rect = logoEl.getBoundingClientRect();
      const sampleX = Math.round(rect.left + rect.width / 2);
      const sampleY = Math.round(rect.top + rect.height / 2);

      if (sampleX <= 0 || sampleY <= 0 || sampleX >= window.innerWidth || sampleY >= window.innerHeight) {
        return;
      }

      // Sample elements under the exact center of the logo
      const stack = document.elementsFromPoint(sampleX, sampleY);
      let foundLight = false;

      for (let i = 0; i < stack.length; i++) {
        const el = stack[i];
        if (el.closest(".site-header, dialog, #site-menu, [class*='telemetry-preloader'], [class*='overlay']")) continue;

        const cs = window.getComputedStyle(el);
        if (parseFloat(cs.opacity) === 0 || cs.visibility === "hidden") continue;

        // Check explicit theme markers
        const themedEl = el.closest<HTMLElement>("[data-theme], [data-topbar-theme]");
        if (themedEl) {
          const theme = themedEl.getAttribute("data-topbar-theme") || themedEl.getAttribute("data-theme");
          if (theme === "light") {
            foundLight = true;
            break;
          }
          if (theme === "dark") {
            foundLight = false;
            break;
          }
        }

        // Hero videos or shade overlays are dark
        if (el.tagName === "VIDEO" || el.closest("video, [class*='videoItem'], [class*='shade']")) {
          foundLight = false;
          break;
        }

        // Check computed background color
        const bg = cs.backgroundColor;
        if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
          const rgb = bg.match(/[\d.]+/g);
          if (rgb && rgb.length >= 3) {
            const alpha = rgb.length >= 4 ? parseFloat(rgb[3]) : 1;
            if (alpha >= 0.35) {
              // Standard perceptual luminance formula
              const lum = (0.2126 * Number(rgb[0]) + 0.7152 * Number(rgb[1]) + 0.0722 * Number(rgb[2])) / 255;
              foundLight = lum > 0.52;
              break;
            }
          }
        }
      }

      setIsLight(foundLight);
    };

    let rafId = 0;
    const scheduleUpdate = () => {
      if (rafId) return;
      rafId = requestAnimationFrame(() => {
        rafId = 0;
        detectLightAtLogo();
      });
    };

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate, { passive: true });
    window.addEventListener("nst-intro-complete", scheduleUpdate);

    // Attach to Lenis whenever ready
    const attachLenis = () => {
      if (window.__lenis) {
        window.__lenis.on("scroll", scheduleUpdate);
        return true;
      }
      return false;
    };

    let checkLenisTimer: NodeJS.Timeout | null = null;
    if (!attachLenis()) {
      checkLenisTimer = setInterval(() => {
        if (attachLenis() && checkLenisTimer) clearInterval(checkLenisTimer);
      }, 100);
      setTimeout(() => {
        if (checkLenisTimer) clearInterval(checkLenisTimer);
      }, 3000);
    }

    detectLightAtLogo();
    const t1 = setTimeout(detectLightAtLogo, 60);
    const t2 = setTimeout(detectLightAtLogo, 200);
    const t3 = setTimeout(detectLightAtLogo, 600);

    return () => {
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("nst-intro-complete", scheduleUpdate);
      if (checkLenisTimer) clearInterval(checkLenisTimer);
      if (window.__lenis) {
        window.__lenis.off("scroll", scheduleUpdate);
      }
      if (rafId) cancelAnimationFrame(rafId);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [pathname]);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
      window.__lenis?.stop();
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
        window.__lenis?.start();
      };
    }
    if (dialog.open) {
      dialog.close();
      window.__lenis?.start();
      triggerRef.current?.focus();
    }
  }, [open]);

  return <>
    <header className={`site-header${isHome ? " is-cinematic is-home" : ""}${scrolled ? " is-scrolled" : ""}${isLight ? " is-light" : ""}`}>
      <div className={`header-bar${isHome ? " header-bar--home" : ""}`}>
        {/* ── Left: Logo ── */}
        <Link
          href="/"
          ref={logoRef}
          className="brand-name"
          aria-label="NO SMALL THING — Home"
          onClick={(event) => {
            if (reducedMotion) return;
            if (isHome) event.preventDefault();
            window.dispatchEvent(new CustomEvent("nst-intro-replay"));
          }}
        >
          <span className="header-logo-text">NO SMALL THING</span>
        </Link>

        {/* ── Centre: MENU pill (home only) ── */}
        {isHome ? (
          <button
            type="button"
            ref={triggerRef}
            className="pill menu menu-pill"
            aria-haspopup="dialog"
            aria-expanded={open}
            aria-controls="site-menu"
            onClick={() => setOpen(true)}
          >
            <span>Menu</span>
            <svg
              className="menu-dot"
              viewBox="0 0 4.3163 11.5104"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="2.15816" cy="2.15814" r="2.15814" fill="currentColor" />
              <circle cx="2.15816" cy="9.35228" r="2.15814" fill="currentColor" />
            </svg>
            <svg
              className="menu-dot"
              viewBox="0 0 4.3163 11.5104"
              fill="none"
              aria-hidden="true"
            >
              <circle cx="2.15816" cy="2.15814" r="2.15814" fill="currentColor" />
              <circle cx="2.15816" cy="9.35228" r="2.15814" fill="currentColor" />
            </svg>
          </button>
        ) : null}

        {/* ── Right: US + FIND US pills (home) | desktop-nav + MENU (other pages) ── */}
        <div className={`header-right${isHome ? " actions" : ""}`}>
          {isHome ? (
            <>
              <Link href="/about" className="round-pill" aria-label="About us">
                US
              </Link>
              <Link href="/contact" className="brief-pill" aria-label="Find us">
                FIND US
              </Link>
            </>
          ) : (
            <>
              <nav className="desktop-nav" aria-label="Main navigation">
                {navigation.map(item => {
                  const active = isActive(item.href);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`nav-bracket-link ${active ? "is-active" : ""}`}
                      aria-current={active ? "page" : undefined}
                    >
                      <span className="bracket-mark bracket-left" aria-hidden="true">[</span>
                      <span className="bracket-label">{item.label}</span>
                      <span className="bracket-mark bracket-right" aria-hidden="true">]</span>
                    </Link>
                  );
                })}
              </nav>
              <button
                type="button"
                ref={triggerRef}
                className="menu-trigger-bracketed"
                aria-haspopup="dialog"
                aria-expanded={open}
                aria-controls="site-menu"
                onClick={() => setOpen(true)}
              >
                <span className="bracket-mark bracket-left" aria-hidden="true">[</span>
                <span className="bracket-label">MENU</span>
                <span className="bracket-mark bracket-right" aria-hidden="true">]</span>
              </button>
            </>
          )}
        </div>
      </div>
      <noscript><nav className="no-script-nav" aria-label="Navigation without JavaScript">{navigation.map(item => <Link key={item.href} href={item.href}>{item.label}</Link>)}</nav></noscript>
    </header>
    <dialog id="site-menu" className="site-menu" ref={dialogRef} aria-labelledby="menu-title" onCancel={() => setOpen(false)} onClose={() => setOpen(false)}>
      <Container className="menu-layout">
        <div className="menu-top"><p id="menu-title" className="eyebrow">NO SMALL THING / INDEX</p><button type="button" className="menu-close eyebrow" onClick={() => setOpen(false)} autoFocus>CLOSE <span aria-hidden="true">×</span></button></div>
        <motion.div className="menu-main" initial={false} animate={{ y: open && !reducedMotion ? [10, 0] : 0 }} transition={{ duration: .45 }}>
          <nav aria-label="Expanded navigation" key={open ? "open" : "closed"}>
            {navigation.map(item => <Link key={item.href} href={item.href} className="menu-item" onClick={() => setOpen(false)} aria-current={isActive(item.href) ? "page" : undefined}>
              <span className="eyebrow">{item.index}</span><span>{item.label}</span><Arrow />
            </Link>)}
          </nav>
          <div className="menu-brand"><BrandLogo sizes="(max-width: 767px) 160px, 320px" /><p className="eyebrow">{site.tagline}</p></div>
        </motion.div>
        <p className="menu-bottom eyebrow">THREE MINDS. ONE AMBITION. BEYOND BOUNDARIES.</p>
      </Container>
    </dialog>
  </>;
}
