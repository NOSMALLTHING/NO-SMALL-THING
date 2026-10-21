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
  const dialogRef = useRef<HTMLDialogElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const reducedMotion = useReducedMotion();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open) {
      dialog.showModal();
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => { document.body.style.overflow = previousOverflow; };
    }
    if (dialog.open) {
      dialog.close();
      triggerRef.current?.focus();
    }
  }, [open]);

  return <>
    <header className={`site-header${isHome ? " is-cinematic" : ""}`}>
      <Container className="header-inner">
        <Link href="/" className="brand-name" aria-label="NO SMALL THING — Home">
          <BrandLogo className="header-logo" variant="wordmark" sizes="(max-width: 767px) 180px, 240px" eager />
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          {navigation.map(item => <Link key={item.href} href={item.href} className={`nav-link ${isActive(item.href) ? "is-active" : ""}`} aria-current={isActive(item.href) ? "page" : undefined}>
            {item.label}
          </Link>)}
        </nav>
        <button type="button" ref={triggerRef} className="menu-trigger eyebrow" aria-haspopup="dialog" aria-expanded={open} aria-controls="site-menu" onClick={() => setOpen(true)}>
          MENU <span className="menu-icon" aria-hidden="true"><span /><span /></span>
        </button>
      </Container>
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
