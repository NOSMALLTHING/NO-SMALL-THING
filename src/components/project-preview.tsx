import type { Project } from "@/lib/projects";
import styles from "./selected-work.module.css";
import { FluidMedia } from "./fluid-media";
import { SceneReveal } from "./ui/scene-reveal";
import { SpatialSurface } from "./ui/spatial-surface";

export function ProjectPreview({ project, labelId }: { project: Project; eager?: boolean; labelId?: string }) {
  return <SpatialSurface strength={2.5}><SceneReveal><div className={styles.preview}>
    <FluidMedia src={project.cover.src} alt={project.cover.alt} className={styles.image} objectFit="contain" />
    <span id={labelId} className={`eyebrow ${styles.badge}`}>{project.status === "concept" ? "CONCEPT PROJECT" : "CLIENT PROJECT"}</span>
  </div></SceneReveal></SpatialSurface>;
}