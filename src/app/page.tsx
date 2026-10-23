import { HomeHero } from "@/components/home-hero";
import { BrandIntroduction } from "@/components/brand-introduction";
import { ProductionServiceAbout } from "@/components/production-service-about";
import { SelectedWork } from "@/components/selected-work";
import { OurApproach } from "@/components/our-approach";
import { AboutUs } from "@/components/about-us";
import { ContactSection } from "@/components/contact-section";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <BrandIntroduction />
      <ProductionServiceAbout />
      <SelectedWork />
      <OurApproach />
      <AboutUs />
      <ContactSection />
    </>
  );
}
