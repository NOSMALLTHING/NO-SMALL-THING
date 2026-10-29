import { HomeHero } from "@/components/home-hero";
import { OurServices } from "@/components/our-services";
import { SelectedWork } from "@/components/selected-work";
import { OurApproach } from "@/components/our-approach";
import { ContactSection } from "@/components/contact-section";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <div className="home-over">
        <OurServices />
        <SelectedWork />
        <OurApproach />
        <ContactSection />
      </div>
    </>
  );
}
