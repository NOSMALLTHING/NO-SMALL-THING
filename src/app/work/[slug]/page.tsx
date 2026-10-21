import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProject, projects } from "@/lib/projects";
import { pageMetadata } from "@/lib/seo";
import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { TextLink } from "@/components/ui/text-link";
import { ProjectPreview } from "@/components/project-preview";
import styles from "./page.module.css";

export const dynamicParams = false;
export function generateStaticParams() { return projects.map(project => ({ slug: project.slug })); }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const project = getProject((await params).slug);
  if (!project) notFound();
  return pageMetadata(`${project.title}${project.status === "concept" ? " — Concept study" : ""}`, project.summary, `/work/${project.slug}`, project.cover.src.replace(/\.svg$/, "-social.jpg"));
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
  const project = getProject((await params).slug);
  if (!project) notFound();
  const nextProject = projects[(projects.findIndex(item => item.slug === project.slug) + 1) % projects.length];

  return <article className={styles.article}>
    <Container>
      <SectionLabel>{project.status === "concept" ? "CONCEPT PROJECT / SELF-INITIATED" : `CLIENT PROJECT / ${project.client}`}</SectionLabel>
      <h1 className={styles.title}>{project.title}</h1>
      <p className={styles.summary}>{project.summary}</p>
      <div className={`eyebrow ${styles.metadata}`}><span>{project.category}</span><span>{project.year}</span></div>
      {project.disclosure && <p className={styles.disclosure}>{project.disclosure}</p>}
      <ProjectPreview project={project} eager />
      <div className={styles.chapters}>
        <section className={styles.chapter} aria-labelledby="problem-title"><h2 id="problem-title"><span className="eyebrow">01</span>Problem</h2><p>{project.caseStudy.problem}</p></section>
        <section className={styles.chapter} aria-labelledby="solution-title"><h2 id="solution-title"><span className="eyebrow">02</span>Solution</h2><p>{project.caseStudy.solution}</p></section>
        <section className={styles.chapter} aria-labelledby="technology-title"><h2 id="technology-title"><span className="eyebrow">03</span>Technology</h2><div><p className={`eyebrow ${styles.stackLabel}`}>{project.caseStudy.technology.status === "proposed" ? "PROPOSED STACK" : "IMPLEMENTED STACK"}</p><ul className={styles.stack}>{project.caseStudy.technology.stack.map(item => <li key={item}>{item}</li>)}</ul><p>{project.caseStudy.technology.note}</p></div></section>
        <section className={styles.chapter} aria-labelledby="outcome-title"><h2 id="outcome-title"><span className="eyebrow">04</span>Outcome</h2><p>{project.caseStudy.outcome}</p></section>
      </div>
      <div className={styles.navigation}><TextLink href="/work">All selected work</TextLink><TextLink href="/contact">Discuss a project</TextLink></div>
      {projects.length > 1 && <div className={styles.next}><SectionLabel>NEXT STUDY</SectionLabel><TextLink href={`/work/${nextProject.slug}`}>{nextProject.title}</TextLink></div>}
    </Container>
  </article>;
}
