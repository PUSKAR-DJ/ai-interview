import { GlassPanel } from "../../../shared/ui";

export default function QuestionPanel() {
  return (
    <GlassPanel className="w-full max-w-3xl p-8 my-8">
      <p className="text-sm text-muted mb-2">
        Question 2 of 10
      </p>

      <h1 className="text-xl font-medium leading-relaxed">
        Explain the difference between `useEffect` and `useLayoutEffect` in React.
      </h1>

      <div className="mt-6">
        <textarea
          placeholder="Type your answer here..."
          className="w-full min-h-[180px] rounded-lg border border-black/10 p-4 focus:outline-none focus:ring-2 focus:ring-accent/30"
        />
      </div>
    </GlassPanel>
  );
}
