import { GlassPanel } from "../../../shared/ui";

export default function SummaryHeader() {
  return (
    <GlassPanel className="p-6 flex justify-between items-center">
      <div>
        <p className="text-sm text-muted">Frontend Developer</p>
        <h1 className="text-xl font-medium">Interview Summary</h1>
      </div>

      <p className="text-sm text-muted">Completed • Today</p>
    </GlassPanel>
  );
}
