import Link from "next/link";
import type { ReactNode } from "react";
import { Arrow } from "./arrow";

export function TextLink({ href, children, className = "", direction = "up-right" }: {
  href: string;
  children: ReactNode;
  className?: string;
  direction?: "up-right" | "right" | "down";
}) {
  return <Link href={href} className={`text-link ${className}`}>
    <span>{children}</span><Arrow direction={direction} />
  </Link>;
}
