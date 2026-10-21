import { Container, Grid } from "./ui/container";
import { SectionLabel } from "./ui/section-label";
import { TextLink } from "./ui/text-link";
import { Reveal } from "./ui/reveal";

export type PageShellProps = {
  index: string;
  title: string;
  lines: [string, string];
  description: string;
  subline: string;
};

/** Shared composition only; each route gains its own sections in later phases. */
export function PageShell({ index, title, lines, description, subline }: PageShellProps) {
  return <section className="route-shell"><Container>
    <SectionLabel index={index}>{title}</SectionLabel>
    <Reveal><h1 className="type-display route-title">{lines[0]}<br /><span className="muted-text">{lines[1]}</span></h1></Reveal>
    <Grid className="route-bottom"><p className="route-statement">{description}</p><div className="route-summary"><p>{subline}</p><TextLink href="/">Back to the beginning</TextLink></div></Grid>
  </Container></section>;
}
