import { GlassPanel } from "../../../shared/ui";

export default function OverallResult() {
  return (
    <GlassPanel className="p-8">
      <h2 className="text-lg font-medium mb-2">Overall assessment</h2>

      <p className="text-3xl font-semibold text-accent mb-4">
        Strong match
      </p>

      <p className="text-muted leading-relaxed max-w-2xl">
        The candidate demonstrated solid understanding of core concepts and
        communicated solutions clearly. Performance was consistent across most
        sections.
      </p>
    </GlassPanel>
  );
}
