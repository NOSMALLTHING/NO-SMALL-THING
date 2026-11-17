import { HomeHero } from "@/components/home-hero";
import { ButterServices } from "@/components/butter-services";
import { Demo3Section } from "@/components/demo3-section";
import { ServicesCardDeck } from "@/components/services-card-deck";
import { CreativeMethod } from "@/components/creative-method";
import { ContactSection } from "@/components/contact-section";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <div className="home-over">
        <ButterServices />
        <Demo3Section />
        <ServicesCardDeck />
        <CreativeMethod />
        <ContactSection />
      </div>
    </>
  );
}
