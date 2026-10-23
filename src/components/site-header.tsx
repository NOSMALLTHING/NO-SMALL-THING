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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

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
    <header className={`site-header${isHome ? " is-cinematic" : ""}${scrolled ? " is-scrolled" : ""}`}>
      <div className="header-bar">
        <Link href="/" className="brand-name" aria-label="NO SMALL THING — Home">
          <BrandLogo className="header-logo" variant="wordmark" sizes="(max-width: 767px) 130px, 170px" eager />
        </Link>
        <div className="header-right">
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
