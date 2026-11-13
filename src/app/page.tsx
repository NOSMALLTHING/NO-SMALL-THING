import { HomeHero } from "@/components/home-hero";
import { OurServices } from "@/components/our-services";
import { ServicesCardDeck } from "@/components/services-card-deck";
import { CreativeMethod } from "@/components/creative-method";
import { ContactSection } from "@/components/contact-section";

export default function HomePage() {
  return (
    <>
      <HomeHero />
      <div className="home-over">
        <OurServices />
        <ServicesCardDeck />
        <CreativeMethod />
        <ContactSection />
      </div>
    </>
  );
}
