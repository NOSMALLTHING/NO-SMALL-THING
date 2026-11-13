export type SelectedWorkIcon = "banknote" | "workflow" | "editorial" | "layers" | "search";

export type SelectedWorkItem = {
  id: string;
  title: string;
  category: string;
  icon: SelectedWorkIcon;
  link: string;
  count: string;
  image?: { src: string; alt: string };
  swatch?: string;
};

/** Homepage index. Edit the copy, icon, and link here. */
export const selectedWorkItems: readonly SelectedWorkItem[] = [
  {
    id: "project-1",
    title: "Project 1",
    category: "Foreign exchange trading system",
    icon: "banknote",
    link: "#selected-work",
    count: "01",
    swatch: "#e7d7c4",
  },
  {
    id: "project-2",
    title: "Project 2",
    category: "AI workflow",
    icon: "workflow",
    link: "/work/orbit",
    count: "02",
    image: {
      src: "/work/orbit.svg",
      alt: "Orbit concept interface, a dark workflow canvas.",
    },
  },
  {
    id: "project-3",
    title: "Project 3",
    category: "Editorial website",
    icon: "editorial",
    link: "/work/form-and-field",
    count: "03",
    image: {
      src: "/work/form-and-field.svg",
      alt: "Form and Field editorial concept, warm paper and landscape lettering.",
    },
  },
  {
    id: "project-4",
    title: "Project 4",
    category: "Software systems",
    icon: "layers",
    link: "#selected-work",
    count: "04",
    swatch: "#d9ddd4",
  },
  {
    id: "project-5",
    title: "Project 5",
    category: "Digital product discovery",
    icon: "search",
    link: "#selected-work",
    count: "05",
    swatch: "#e4ddd4",
  },
];
