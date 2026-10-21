import Link from "next/link";
import { Container } from "./ui/container";
import { SectionLabel } from "./ui/section-label";
import { Arrow } from "./ui/arrow";
import { ServiceScene } from "./service-scene";
import styles from "./our-services.module.css";

const services = [
  {
    number: "01",
    title: "AI Services & Solutions",
    description: "AI integration, intelligent automation and workflow optimization. Purposeful AI solutions that support the way your business works.",
  },
  {
    number: "02",
    title: "Website Design & Development",
    description: "Custom business websites, thoughtfully designed and responsively built. From a new digital presence to optimizing an existing website.",
  },
  {
    number: "03",
    title: "UI/UX Design",
    description: "Intuitive interfaces, considered user journeys and clear interactions. Digital product design that puts people first.",
  },
  {
    number: "04",
    title: "Software Development",
    description: "Custom software, web applications and business systems. Practical internal tools shaped around your team’s needs.",
  },
  {
    number: "05",
    title: "IT Services & Digital Solutions",
    description: "Technology consulting, system integration and technical support. Connected digital solutions for your everyday business challenges.",
  },
] as const;

export function OurServices({ standalone = false }: { standalone?: boolean }) {
  const Heading = standalone ? "h1" : "h2";
  return (
    <section id="services" className={styles.section} aria-labelledby="services-title">
      <Container className={styles.layout}>
        <div className={styles.headingColumn}>
        <div className={styles.kicker}>
          <SectionLabel>OUR SERVICES</SectionLabel>
          <span className={`eyebrow ${styles.range}`} aria-hidden="true">01 — 05</span>
        </div>
        <Heading id="services-title" className={styles.title}>WHAT WE DO.</Heading>
        </div>

        <ol className={styles.list} role="list">
          {services.map(service => (
            <ServiceScene key={service.number}>
              <Link href="/contact" className={styles.row} aria-labelledby={`service-${service.number}-title service-${service.number}-action`} aria-describedby={`service-${service.number}-description`}>
                <span className={styles.number} aria-hidden="true">{service.number}</span>
                <h3 id={`service-${service.number}-title`} className={styles.serviceTitle}>{service.title}</h3>
                <div className={styles.detail}>
                  <p id={`service-${service.number}-description`}>{service.description}</p>
                  <span id={`service-${service.number}-action`} className={styles.action}>Let’s talk</span>
                </div>
                <Arrow className={styles.arrow} />
              </Link>
            </ServiceScene>
          ))}
        </ol>
      </Container>
    </section>
  );
}
