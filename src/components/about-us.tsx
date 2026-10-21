import Image from "next/image";
import { aboutContent } from "@/lib/about";
import { Container, Grid } from "./ui/container";
import { SectionLabel } from "./ui/section-label";
import { BrandLogo } from "./brand-logo";
import styles from "./about-us.module.css";
import { SceneReveal } from "./ui/scene-reveal";
import { SpatialSurface } from "./ui/spatial-surface";
import { EditorialHeading } from "./ui/editorial-heading";
import { ReadingReveal } from "./ui/reading-reveal";

export function AboutUs({ standalone = false }: { standalone?: boolean }) {
  const { introduction, belief, purpose, teamPhoto } = aboutContent;

  return <section id="about" className={styles.section} aria-labelledby="about-title">
    <Container>
      <SectionLabel>ABOUT US</SectionLabel>
      <EditorialHeading as={standalone ? "h1" : "h2"} id="about-title" className={styles.title} lines={["THREE MINDS.", "ONE AMBITION."]} />
      <Grid className={styles.story}>
        <figure className={styles.artwork}>
          <SpatialSurface strength={9}><SceneReveal><BrandLogo sizes="(max-width: 767px) 80vw, 460px" /></SceneReveal></SpatialSurface>
          <figcaption className={`eyebrow ${styles.caption}`}>NO SMALL THING / A SHARED BEGINNING</figcaption>
        </figure>
        <div className={styles.narrative}>
          <ReadingReveal className={styles.introduction} text={introduction} />
          <div className={styles.belief}><p>{belief}</p><p>{purpose}</p></div>
        </div>
      </Grid>
      {teamPhoto && <figure className={styles.teamPhoto}>
        <Image src={teamPhoto.src} alt={teamPhoto.alt} width={teamPhoto.width} height={teamPhoto.height} sizes="(max-width: 767px) 100vw, 88vw" />
        <figcaption className={`eyebrow ${styles.caption}`}>{teamPhoto.caption}</figcaption>
      </figure>}
    </Container>
  </section>;
}
