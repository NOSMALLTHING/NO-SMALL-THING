import Image from "next/image";
import monogram from "../../public/brand/monogram.png";
import wordmark from "../../public/brand/wordmark-white.png";

/** Supplied transparent artwork, always shown in its original proportions. */
export function BrandLogo({ className = "", sizes = "180px", eager = false, variant = "monogram" }: { className?: string; sizes?: string; eager?: boolean; variant?: "monogram" | "wordmark" }) {
  const isWordmark = variant === "wordmark";
  return <picture className="brand-picture"><source type="image/webp" srcSet={isWordmark ? "/brand/wordmark-440.webp 440w, /brand/wordmark-880.webp 880w" : "/brand/monogram-384.webp 384w, /brand/monogram-768.webp 768w"} sizes={sizes} /><Image src={isWordmark ? wordmark : monogram} alt="NO SMALL THING" draggable={false} className={`brand-logo ${className}`} sizes={sizes} loading={eager ? "eager" : "lazy"} /></picture>;
}
