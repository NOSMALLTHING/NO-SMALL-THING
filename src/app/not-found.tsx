import { Container } from "@/components/ui/container";
import { SectionLabel } from "@/components/ui/section-label";
import { TextLink } from "@/components/ui/text-link";

export default function NotFound() {
  return <Container className="not-found"><SectionLabel>404 / OFF THE MAP</SectionLabel><h1 className="type-heading">New horizons.<br />Wrong coordinates.</h1><TextLink href="/">Back to the studio</TextLink></Container>;
}
