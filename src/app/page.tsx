import { HomeHero } from "@/components/home-hero";
import { HomeStage } from "@/components/home-stage";
import { OurApproach } from "@/components/our-approach";
import { ContactSection } from "@/components/contact-section";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <div className="home-over">
        <HomeStage />
        <OurApproach />
        <ContactSection />
      </div>
    </>
  );
}
