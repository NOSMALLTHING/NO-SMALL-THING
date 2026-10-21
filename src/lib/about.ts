export type TeamPhoto = {
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
};

export const aboutContent: {
  introduction: string;
  belief: string;
  purpose: string;
  teamPhoto: TeamPhoto | null;
} = {
  introduction: "We’re three young founders, brought together by a shared passion for technology, creativity and solving problems.",
  belief: "We believe a small beginning can hold limitless possibility.",
  purpose: "Through IT services and thoughtful digital solutions, we want to create real value for people and businesses.",
  // Reserved for a genuine, approved team portrait. No stock or invented people.
  teamPhoto: null,
};
