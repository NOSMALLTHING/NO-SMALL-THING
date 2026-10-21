import type { ReactNode } from "react";

export function SectionLabel({ children, index, className = "" }: { children: ReactNode; index?: string; className?: string }) {
  return <p className={`eyebrow section-label ${className}`}>
    <span className="accent-cross" aria-hidden="true">+</span>
    {children}
    {index && <span className="section-index">{index}</span>}
  </p>;
}
