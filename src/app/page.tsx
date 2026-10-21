import { HomeHero } from "@/components/home-hero";
import { BrandIntroduction } from "@/components/brand-introduction";
import { OurServices } from "@/components/our-services";
import { SelectedWork } from "@/components/selected-work";
import { OurApproach } from "@/components/our-approach";
import { AboutUs } from "@/components/about-us";
import { ContactSection } from "@/components/contact-section";

export default function HomePage() {
  return <><HomeHero /><BrandIntroduction /><OurServices /><SelectedWork /><OurApproach /><AboutUs /><ContactSection /></>;
}
