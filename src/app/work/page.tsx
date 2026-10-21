import { pageMetadata } from "@/lib/seo";
import { SelectedWork } from "@/components/selected-work";

export const metadata = pageMetadata("Selected Work", "Explore original, clearly labelled concept studies in AI interfaces and editorial website design by NO SMALL THING.", "/work");

export default function WorkPage() {
  return <SelectedWork standalone />;
}
