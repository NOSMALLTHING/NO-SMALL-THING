import Image from "next/image";
import type { Project } from "@/lib/projects";
import styles from "./selected-work.module.css";
import { SceneReveal } from "./ui/scene-reveal";
import { SpatialSurface } from "./ui/spatial-surface";

export function ProjectPreview({ project, eager = false, labelId }: { project: Project; eager?: boolean; labelId?: string }) {
  return <SpatialSurface strength={2.5}><SceneReveal><div className={styles.preview}>
    <Image src={project.cover.src} alt={project.cover.alt} width={1600} height={1000} sizes="(max-width: 767px) 100vw, 88vw" loading={eager ? "eager" : "lazy"} className={styles.image} />
    <span id={labelId} className={`eyebrow ${styles.badge}`}>{project.status === "concept" ? "CONCEPT PROJECT" : "CLIENT PROJECT"}</span>
  </div></SceneReveal></SpatialSurface>;
}