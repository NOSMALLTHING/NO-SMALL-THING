import { HomeHero } from "@/components/home-hero";
import { ButterServices } from "@/components/butter-services";
import { ServicesCardDeck } from "@/components/services-card-deck";
import { CreativeMethod } from "@/components/creative-method";
import { ContactSection } from "@/components/contact-section";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <div className="home-over">
        <ButterServices />
        <ServicesCardDeck />
        <CreativeMethod />
        <ContactSection />
      </div>
    </>
  );
}
