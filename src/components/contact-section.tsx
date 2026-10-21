import { contactDetails } from "@/lib/contact";
import { Container, Grid } from "./ui/container";
import { SectionLabel } from "./ui/section-label";
import { Arrow } from "./ui/arrow";
import { ContactForm } from "./contact-form";
import styles from "./contact-section.module.css";
import { EditorialHeading } from "./ui/editorial-heading";

export function ContactSection({ standalone = false }: { standalone?: boolean }) {
  return <section id="contact" className={styles.section} aria-labelledby="contact-title">
    <Container>
      <SectionLabel className={styles.label}>LET’S TALK</SectionLabel>
      <EditorialHeading as={standalone ? "h1" : "h2"} id="contact-title" className={styles.title} lines={["LET'S MAKE", "SOMETHING MATTER."]} />
      <Grid className={styles.content}>
        <div className={styles.invitation}><p>Have an idea, a challenge, or something worth building? Let&apos;s talk.</p><a href="#enquiry-form" className={styles.cta}>Start a conversation <Arrow direction="down" /></a><div className={styles.direct}><span className="eyebrow">OR EMAIL US DIRECTLY</span><a href={`mailto:${contactDetails.email}`}>{contactDetails.email}</a></div></div>
        <div className={styles.formColumn}><ContactForm /></div>
      </Grid>
    </Container>
  </section>;
}
