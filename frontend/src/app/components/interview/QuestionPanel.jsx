import { GlassPanel } from "../../../shared/ui";

export default function QuestionPanel() {
  return (
    <GlassPanel className="p-8">
      <p className="text-sm text-muted mb-3">
        Question
      </p>

      <h2 className="text-xl leading-relaxed">
        Explain how React’s virtual DOM improves performance compared to direct DOM manipulation.
      </h2>

      <div className="mt-6 text-sm text-muted">
        Take your time. You can think aloud.
      </div>
    </GlassPanel>
  );
}
