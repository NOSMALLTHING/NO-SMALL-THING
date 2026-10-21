import Link from "next/link";
import { projects } from "@/lib/projects";
import { Container } from "./ui/container";
import { SectionLabel } from "./ui/section-label";
import { Arrow } from "./ui/arrow";
import { ProjectPreview } from "./project-preview";
import { ProjectReel } from "./project-reel";
import { EditorialHeading } from "./ui/editorial-heading";
import styles from "./selected-work.module.css";

export function SelectedWork({ standalone = false }: { standalone?: boolean }) {
  return <section id="selected-work" className={styles.section} aria-labelledby="selected-work-title">
    <Container>
      <SectionLabel>IDEAS, EXPLORED.</SectionLabel>
      <EditorialHeading as={standalone ? "h1" : "h2"} id="selected-work-title" className={styles.heading} lines={["SELECTED WORK."]} />
      <p className={styles.intro}>{projects.every(project => project.status === "concept")
        ? "Self-initiated concept studies. Imagined briefs, original design directions. No client commissions or commercial results are represented."
        : "A considered selection of client work and clearly labelled concept studies."}</p>
      <ProjectReel count={projects.length}><ol className={styles.projects} role="list">
        {projects.map((project, index) => <li key={project.slug} className={styles.project}>
          <Link href={`/work/${project.slug}`} className={styles.projectLink} aria-labelledby={`project-${project.slug}-title project-${project.slug}-action`} aria-describedby={`project-${project.slug}-status project-${project.slug}-summary`}>
            <ProjectPreview project={project} labelId={`project-${project.slug}-status`} />
            <div className={`eyebrow ${styles.metadata}`}><span>{project.category}</span><span>{project.year}</span></div>
            <div className={styles.caption}>
              <h3 id={`project-${project.slug}-title`} className={styles.projectTitle}>{project.title}</h3>
              <span id={`project-${project.slug}-action`} className={styles.view}><span className="eyebrow">VIEW CASE STUDY</span><Arrow /></span>
            </div>
            <p id={`project-${project.slug}-summary`} className={styles.summary}>{project.summary}</p>
          </Link>
          <span className={`eyebrow ${styles.projectIndex}`} aria-hidden="true">{String(index + 1).padStart(2, "0")} / {String(projects.length).padStart(2, "0")}</span>
        </li>)}
      </ol></ProjectReel>
    </Container>
  </section>;
}
