import { HomeHero } from "@/components/home-hero";
import { OurServices } from "@/components/our-services";
import { SelectedWork } from "@/components/selected-work";
import { OurApproach } from "@/components/our-approach";
import { AboutUs } from "@/components/about-us";
import { ContactSection } from "@/components/contact-section";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <OurServices />
      <SelectedWork />
      <OurApproach />
      <AboutUs />
      <ContactSection />
    </>
  );
}
