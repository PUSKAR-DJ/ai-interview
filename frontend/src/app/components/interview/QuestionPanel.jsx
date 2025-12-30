import GlassPanel from "../../../shared/ui/GlassPanel";

export default function QuestionPanel({ question, onAnswer }) {
  if (!question) return null;

  return (
    <GlassPanel className="p-8 min-h-[400px] flex flex-col">
      <p className="text-sm text-slate-400 mb-4 font-semibold tracking-wide uppercase">
        Question
      </p>

      <h2 className="text-2xl leading-relaxed text-slate-800 font-medium mb-8">
        {question.questionText}
      </h2>

      <div className="flex-1">
        <textarea
          className="w-full h-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none resize-none text-slate-700 leading-relaxed"
          placeholder="Type your answer here..."
          value={question.answerText || ""}
          onChange={(e) => onAnswer(e.target.value)}
        />
      </div>

      <div className="mt-4 text-xs text-slate-400 text-right">
        {question.answerText?.length || 0} characters
      </div>
    </GlassPanel>
  );
}