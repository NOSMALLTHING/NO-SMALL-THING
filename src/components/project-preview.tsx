import Image from "next/image";
import type { Project } from "@/lib/projects";
import { SceneReveal } from "./ui/scene-reveal";
import { SpatialSurface } from "./ui/spatial-surface";

export function ProjectPreview({
  project,
  eager = false,
  labelId,
}: {
  project: Project;
  eager?: boolean;
  labelId?: string;
}) {
  return (
    <SpatialSurface strength={2.5}>
      <SceneReveal>
        <div style={{ position: "relative", width: "100%", borderRadius: "16px", overflow: "hidden", margin: "2rem 0" }}>
          <Image
            src={project.cover.src}
            alt={project.cover.alt}
            width={1600}
            height={1000}
            sizes="(max-width: 767px) 100vw, 88vw"
            loading={eager ? "eager" : "lazy"}
            style={{ width: "100%", height: "auto", display: "block" }}
          />
          <span
            id={labelId}
            className="eyebrow"
            style={{
              position: "absolute",
              top: "1rem",
              right: "1rem",
              background: "rgba(8, 8, 10, 0.75)",
              backdropFilter: "blur(8px)",
              padding: "0.4rem 0.8rem",
              borderRadius: "999px",
              color: "#fbfbfb",
            }}
          >
            {project.status === "concept" ? "CONCEPT PROJECT" : "CLIENT PROJECT"}
          </span>
        </div>
      </SceneReveal>
    </SpatialSurface>
  );
}
