import Image from "next/image";
import horizon from "../../public/brand/mars-horizon.webp";
import { CinematicArtwork } from "./cinematic-artwork";

export function HomeHero() {
  return <>
      <CinematicArtwork>
        <Image
          src={horizon}
          alt="Transcend Everything. A spacecraft approaches the illuminated horizon of Mars. NO SMALL THING. Three minds. One ambition. Beyond boundaries."
          loading="eager"
          fetchPriority="high"
          sizes="(max-width: 767px) 168vw, 100vw"
          className="hero-image"
        />
      </CinematicArtwork>
    <div id="hero-end" className="hero-end" tabIndex={-1} />
  </>;
}
