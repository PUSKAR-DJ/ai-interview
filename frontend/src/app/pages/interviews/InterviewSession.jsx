import InterviewHeader from "../../components/interview/InterviewHeader";
import QuestionPanel from "../../components/interview/QuestionPanel";
import InterviewControls from "../../components/interview/InterviewControls";

export default function InterviewSession() {
  return (
    <div className="w-full max-w-4xl flex flex-col items-center gap-8 py-12">
      <InterviewHeader />
      <QuestionPanel />
      <InterviewControls />
    </div>
  );
}
