import { pageMetadata } from "@/lib/seo";
import { ProductionServiceAbout } from "@/components/production-service-about";

export const metadata = pageMetadata("Services", "Premium full-scale production service partner in Portugal and Spain.", "/expertise");

export default function ExpertisePage() {
  return <ProductionServiceAbout standalone />;
}
