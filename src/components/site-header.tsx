"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState, useCallback } from "react";
import { useReducedMotion } from "motion/react";
import { navigation } from "@/lib/site";
import { MobileBrandTransition } from "./mobile/mobile-brand-transition";

const clamp = (value: number, min: number, max: number) => Math.min(max, Math.max(min, value));

export function SiteHeader() {
  const pathname = usePathname();
  const isHome = pathname === "/";
  const [menuOpen, setMenuOpen] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isLight, setIsLight] = useState(false);
  const [lang, setLang] = useState<"CH" | "EN">("CH");

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "CH" ? "EN" : "CH"));
  }, []);

  const triggerRef = useRef<HTMLButtonElement>(null);
  const logoRef = useRef<HTMLAnchorElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const drawerRef = useRef<HTMLElement>(null);
  const closeBtnRef = useRef<HTMLButtonElement>(null);
  const hideTimerRef = useRef<NodeJS.Timeout | null>(null);
  const reducedMotion = useReducedMotion();

  // ── Sync FLIP geometry from Menu button to Drawer ──
  const syncMenuGeometry = useCallback(() => {
    const overlay = overlayRef.current;
    const drawer = drawerRef.current;
    const button = triggerRef.current;
    if (!overlay || !drawer || !button) return;

    const buttonRect = button.getBoundingClientRect();
    const drawerStyles = window.getComputedStyle(drawer);
    const drawerPaddingLeft = Number.parseFloat(drawerStyles.paddingLeft) || 0;
    const drawerWidth = drawer.offsetWidth;
    const drawerHeight = drawer.offsetHeight;
    const drawerTop = Number.parseFloat(drawerStyles.top) || 0;
    const centeredMobileReveal = window.matchMedia("(max-width: 900px)").matches;
    const drawerLeft = buttonRect.left - drawerPaddingLeft;

    const offsetX = centeredMobileReveal ? 0 : buttonRect.left - drawerLeft;
    const offsetY = centeredMobileReveal ? 0 : buttonRect.top - drawerTop;
    const scaleX = clamp(buttonRect.width / Math.max(drawerWidth, 1), 0.04, 1);
    const scaleY = clamp(buttonRect.height / Math.max(drawerHeight, 1), 0.04, 1);

    overlay.style.setProperty("--menu-anchor-left", `${buttonRect.left}px`);
    overlay.style.setProperty("--menu-anchor-top", `${drawerTop}px`);
    overlay.style.setProperty("--menu-anchor-center-x", `${buttonRect.left + buttonRect.width / 2}px`);
    overlay.style.setProperty("--menu-anchor-center-y", `${buttonRect.top + buttonRect.height / 2}px`);
    overlay.style.setProperty("--menu-origin-x", `${offsetX}px`);
    overlay.style.setProperty("--menu-origin-y", `${offsetY}px`);
    overlay.style.setProperty("--menu-origin-scale-x", scaleX.toFixed(4));
    overlay.style.setProperty("--menu-origin-scale-y", scaleY.toFixed(4));
  }, []);

  const openMenu = useCallback(() => {
    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    const overlay = overlayRef.current;
    if (overlay) overlay.hidden = false;
    setMenuVisible(true);
    window.__lenis?.stop();

    syncMenuGeometry();
    requestAnimationFrame(() => {
      syncMenuGeometry();
      requestAnimationFrame(() => {
        document.body.classList.add("menu-open");
        setMenuOpen(true);
        closeBtnRef.current?.focus({ preventScroll: true });
      });
    });
  }, [syncMenuGeometry]);

  const closeMenu = useCallback(() => {
    document.body.classList.remove("menu-open");
    setMenuOpen(false);
    triggerRef.current?.focus({ preventScroll: true });

    if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    hideTimerRef.current = setTimeout(() => {
      setMenuVisible(false);
      window.__lenis?.start();
    }, 780);
  }, []);

  // ── Sync geometry on mount and window resize ──
  useEffect(() => {
    syncMenuGeometry();
    const t = setTimeout(syncMenuGeometry, 100);
    const handleResize = () => {
      syncMenuGeometry();
    };
    window.addEventListener("resize", handleResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", handleResize);
    };
  }, [syncMenuGeometry]);

  // ── Keyboard & outside listeners ──
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && menuOpen) {
        closeMenu();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen, closeMenu]);

  // Cleanup on unmount or route change
  useEffect(() => {
    return () => {
      document.body.classList.remove("menu-open");
      window.__lenis?.start();
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, [pathname]);

  // ── Smart Background Detection at Logo ──
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

      const stack = document.elementsFromPoint(sampleX, sampleY);
      let foundLight = false;

      for (let i = 0; i < stack.length; i++) {
        const el = stack[i];
        if (el.closest(".site-header, .menu-overlay, dialog, #site-menu, [class*='telemetry-preloader'], [class*='overlay']")) continue;

        const cs = window.getComputedStyle(el);
        if (parseFloat(cs.opacity) === 0 || cs.visibility === "hidden") continue;

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

        if (el.tagName === "VIDEO" || el.closest("video, [class*='videoItem'], [class*='shade']")) {
          foundLight = false;
          break;
        }

        const bg = cs.backgroundColor;
        if (bg && bg !== "transparent" && bg !== "rgba(0, 0, 0, 0)") {
          const rgb = bg.match(/[\d.]+/g);
          if (rgb && rgb.length >= 3) {
            const alpha = rgb.length >= 4 ? parseFloat(rgb[3]) : 1;
            if (alpha >= 0.35) {
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

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href.startsWith("/#") && isHome) {
      e.preventDefault();
      const hash = href.slice(1);
      const target = document.querySelector(hash);
      closeMenu();
      window.__lenis?.start();
      if (target) {
        setTimeout(() => {
          if (window.__lenis) {
            window.__lenis.scrollTo(target as HTMLElement, { offset: 0, duration: 1.2 });
          } else {
            target.scrollIntoView({ behavior: "smooth" });
          }
        }, 80);
      }
    } else {
      closeMenu();
    }
  };

  return (
    <>
      <header
        className={`site-header${isHome ? " is-cinematic is-home" : ""}${
          scrolled ? " is-scrolled" : ""
        }${isLight ? " is-light" : ""}`}
      >
        <div className="header-bar">
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

          {/* ── Centre: MENU pill ── */}
          <button
            type="button"
            ref={triggerRef}
            className="pill menu menu-pill"
            aria-haspopup="dialog"
            aria-expanded={menuOpen}
            aria-controls="menuOverlay"
            onClick={openMenu}
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

          {/* ── Right: Language switcher (CH/EN) + FIND US pills ── */}
          <div className="header-right actions">
            <button
              type="button"
              className="round-pill"
              aria-label="Switch language (CH/EN)"
              onClick={toggleLang}
            >
              {lang}
            </button>
            <Link href="/contact" className="brief-pill" aria-label="Find us">
              FIND US
            </Link>
          </div>
        </div>
        {isHome ? <MobileBrandTransition isLight={isLight} /> : null}
        <noscript>
          <nav className="no-script-nav" aria-label="Navigation without JavaScript">
            {navigation.map((item) => (
              <Link key={item.href} href={item.href}>
                {item.label}
              </Link>
            ))}
          </nav>
        </noscript>

        {/* ── Emblematica-style Animated Menu Overlay ── */}
        <div
          className="menu-overlay"
          id="menuOverlay"
          ref={overlayRef}
          hidden={!menuVisible}
          aria-hidden={!menuOpen}
        >
          <div
            className="menu-backdrop"
            data-menu-close=""
            onClick={closeMenu}
            aria-hidden="true"
          />

          <img
            className="menu-parrot"
            src="/brand/menu-parrot.webp"
            alt=""
            aria-hidden="true"
          />

          <button
            className="menu-close"
            id="menuClose"
            ref={closeBtnRef}
            type="button"
            aria-label="Close menu"
            onClick={closeMenu}
          >
            <span className="menu-close-label-desktop">Close</span>
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

          <aside className="menu-drawer" ref={drawerRef} aria-label="Main menu">
            <nav className="menu-primary" aria-label="Main navigation">
              <Link href="/#services" onClick={(e) => handleNavClick(e, "/#services")}>
                <span className="menu-primary-line">Web&amp;Digital</span>
              </Link>
              <Link href="/#method" onClick={(e) => handleNavClick(e, "/#method")}>
                <span className="menu-primary-line">
                  Branding&amp;
                  <br />
                  Design
                </span>
              </Link>
              <Link href="/studio" onClick={() => closeMenu()}>
                <span className="menu-primary-line">Who We Are</span>
              </Link>
              <Link href="/#what-we-do-best" onClick={(e) => handleNavClick(e, "/#what-we-do-best")}>
                <span className="menu-primary-line">Projects</span>
              </Link>
              <Link
                href="/#contact"
                className="menu-primary-accent"
                onClick={(e) => handleNavClick(e, "/#contact")}
              >
                <span className="menu-primary-line">Book A Call</span>
              </Link>
            </nav>

            <div className="menu-footer">
              <div className="menu-footer-links">
                <a href="mailto:nosmallthing.limited@gmail.com">nosmallthing.limited@gmail.com</a>
                <a
                  href="https://www.linkedin.com/in/no-small-thing-987899445/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
                <a
                  href="https://www.instagram.com/nosmallthing.limited/?hl=en"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Instagram
                </a>
                <a
                  href="https://github.com/NOSMALLTHING"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  GitHub
                </a>
              </div>
            </div>
          </aside>
        </div>
      </header>
    </>
  );
}
