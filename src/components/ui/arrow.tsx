import type { SVGProps } from "react";

export function Arrow({ direction = "up-right", ...props }: SVGProps<SVGSVGElement> & { direction?: "up-right" | "right" | "down" }) {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" {...props}>
      <g transform={direction === "down" ? "rotate(135 12 12)" : direction === "right" ? "rotate(45 12 12)" : undefined}>
        <path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.25" />
      </g>
    </svg>
  );
}
