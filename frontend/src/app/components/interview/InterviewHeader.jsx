import { GlassPanel } from "../../../shared/ui";

export default function InterviewHeader() {
  return (
    <GlassPanel className="w-full max-w-3xl px-6 py-4 flex items-center justify-between">
      <div>
        <p className="text-sm text-muted">Frontend Developer</p>
        <h2 className="font-medium">Technical Interview</h2>
      </div>

      <div className="text-right">
        <p className="text-sm text-muted">Time remaining</p>
        <p className="font-semibold">24:30</p>
      </div>
    </GlassPanel>
  );
}
