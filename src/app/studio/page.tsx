import { pageMetadata } from "@/lib/seo";
import { StudioExperience } from "./studio-experience";

export const metadata = pageMetadata("Studio", "Three minds. One ambition. Meet the independent technology and digital studio behind NO SMALL THING.", "/studio");

export default function StudioPage() {
  return <StudioExperience />;
}
