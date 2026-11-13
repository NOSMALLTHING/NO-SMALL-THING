import { SelectedWorkIndex } from "./selected-work-index";

export function SelectedWork({
  standalone = false,
  immediateHeading = false,
}: {
  standalone?: boolean;
  immediateHeading?: boolean;
}) {
  return <SelectedWorkIndex />;
}
