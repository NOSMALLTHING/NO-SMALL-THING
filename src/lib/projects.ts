export type Project = {
  slug: string;
  title: string;
  category: string;
  year: number;
  summary: string;
  cover: { src: string; alt: string };
  caseStudy: {
    problem: string;
    solution: string;
    technology: { status: "proposed" | "implemented"; stack: readonly string[]; note: string };
    outcome: string;
  };
} & (
  | { status: "concept"; disclosure: string; client?: never }
  | { status: "client"; client: string; disclosure?: string }
);

/** Self-initiated visual studies only. Replace records and artwork with verified work. */
export const projects: readonly Project[] = [
  {
    slug: "orbit",
    title: "Orbit",
    status: "concept",
    disclosure: "Self-initiated interface study. Not a client commission or a live AI product.",
    category: "AI / Digital Product Design",
    year: 2026,
    summary: "A clearer perspective on everyday workflows.",
    cover: {
      src: "/work/orbit.svg",
      alt: "Orbit concept interface: a dark workflow canvas connecting a request, an AI-assisted draft and human review. Original illustrative mockup, not a live product.",
    },
    caseStudy: {
      problem: "How might a team understand an AI-assisted workflow without losing sight of the decisions that need human judgment? This self-initiated brief explores clarity, ownership and review in an imagined workspace.",
      solution: "A deliberately quiet canvas maps a request through an AI-assisted draft to a human review step. Clear stage labels and a restrained hierarchy keep the proposed flow understandable at a glance.",
      technology: {
        status: "proposed",
        stack: ["React", "TypeScript", "Next.js", "AI API integration"],
        note: "A suggested implementation direction. The displayed interface is a static visual study; automation and AI integration have not been implemented.",
      },
      outcome: "An original interface direction and workflow visualization. The study establishes a starting point for a future interactive prototype and usability research; it does not represent a deployed system or measured business results.",
    },
  },
  {
    slug: "form-and-field",
    title: "Form & Field",
    status: "concept",
    disclosure: "Self-initiated website study for an imagined journal. Not a client commission or an operating publication.",
    category: "Website / Editorial Design",
    year: 2026,
    summary: "An editorial space for a slower perspective.",
    cover: {
      src: "/work/form-and-field.svg",
      alt: "Form & Field concept website: oversized editorial lettering, a warm paper palette and an original abstract landscape illustration for an imagined journal.",
    },
    caseStudy: {
      problem: "How might a digital journal give stories room to breathe? The imagined brief asks for a reading experience that balances expressive art direction with clear navigation and legible content.",
      solution: "Large editorial type, a warm paper palette and an original landscape illustration establish the visual direction. A simple story hierarchy gives the concept a calm and approachable rhythm.",
      technology: {
        status: "proposed",
        stack: ["Next.js", "TypeScript", "CSS", "Content management system"],
        note: "A proposed stack for a future content-led website. This visual exploration does not include a live publication, CMS integration or a tested production website.",
      },
      outcome: "A website art-direction study and an original editorial composition. Further work would include responsive page templates, accessibility checks and reader testing before implementation.",
    },
  },
];

export function getProject(slug: string) {
  return projects.find(project => project.slug === slug);
}
