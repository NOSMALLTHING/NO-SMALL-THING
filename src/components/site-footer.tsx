import Link from "next/link";
import { Container } from "./ui/container";
import { site } from "@/lib/site";
import { contactDetails } from "@/lib/contact";
import { BrandLogo } from "./brand-logo";
import { Arrow } from "./ui/arrow";
import styles from "./site-footer.module.css";

export function SiteFooter() {
  return <footer className={styles.footer}><Container>
    <div className={styles.main}>
      <div className={styles.identity}><Link href="/" className={styles.logo} aria-label="NO SMALL THING — Home"><BrandLogo variant="wordmark" sizes="280px" /></Link><p>{site.tagline}</p></div>
      <div className={styles.column}><h2>START A CONVERSATION</h2><a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a><Link href="/contact">Prepare an enquiry <Arrow /></Link></div>
      <div className={styles.column}><h2>FIND US ELSEWHERE</h2><div className={styles.socials}>{contactDetails.socials.map(social => <a key={social.label} href={social.href} target="_blank" rel="noopener noreferrer">{social.label}<Arrow /></a>)}</div></div>
    </div>
    <div className={styles.bottom}><p className="eyebrow">© {new Date().getUTCFullYear()} {site.name}</p><nav className={styles.footerNav} aria-label="Footer navigation"><Link href="/work" className="eyebrow">WORK</Link><Link href="/expertise" className="eyebrow">SERVICES</Link><Link href="/studio" className="eyebrow">ABOUT</Link><Link href="/#approach" className="eyebrow">OUR APPROACH</Link></nav><Link href="#top" className="eyebrow">BACK TO TOP <span aria-hidden="true">↑</span></Link></div>
  </Container></footer>;
}
