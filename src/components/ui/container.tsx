import type { HTMLAttributes } from "react";

export function Container({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`container ${className}`} {...props} />;
}

export function Grid({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`editorial-grid ${className}`} {...props} />;
}
