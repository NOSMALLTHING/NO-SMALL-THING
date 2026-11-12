import type { ReactNode, SVGProps } from "react";
import type { SelectedWorkIcon } from "@/lib/selected-work-list";

function Icon({ children, ...props }: SVGProps<SVGSVGElement> & { children: ReactNode }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}>
      {children}
    </svg>
  );
}

const paths: Record<SelectedWorkIcon, ReactNode> = {
  banknote: (
    <>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <circle cx="12" cy="12" r="2.2" />
      <path d="M6 10v.01M18 14v.01" />
    </>
  ),
  workflow: (
    <>
      <rect x="3" y="3" width="6" height="6" rx="1" />
      <rect x="15" y="15" width="6" height="6" rx="1" />
      <path d="M6 9v3a3 3 0 0 0 3 3h6" />
      <path d="M15 12V9a3 3 0 0 0-3-3H9" />
    </>
  ),
  editorial: (
    <>
      <path d="M4 5h12a3 3 0 0 1 3 3v11H7a3 3 0 0 0-3 3z" />
      <path d="M7 5v14" />
      <path d="M10 9h6M10 13h6" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3 3 8l9 5 9-5-9-5z" />
      <path d="M3 12l9 5 9-5" />
      <path d="M3 16l9 5 9-5" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="6" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
};

export function SelectedWorkIconMark({ name }: { name: SelectedWorkIcon }) {
  return <Icon>{paths[name]}</Icon>;
}
