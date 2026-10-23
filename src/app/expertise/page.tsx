import { pageMetadata } from "@/lib/seo";
import { OurServices } from "@/components/our-services";

export const metadata = pageMetadata("Services", "AI solutions, website design and development, UI/UX, custom software and IT services from NO SMALL THING.", "/expertise");

export default function ExpertisePage() {
  return <OurServices standalone />;
}
