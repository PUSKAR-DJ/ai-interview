import InterviewHeader from "../../components/interview/InterviewHeader";
import QuestionPanel from "../../components/interview/QuestionPanel";
import ProgressIndicator from "../../components/interview/ProgressIndicator";
import ControlBar from "../../components/interview/ControlBar";

export default function InterviewSession() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <InterviewHeader />

      <QuestionPanel />

      <ProgressIndicator current={3} total={10} />

      <ControlBar />
    </div>
  );
}
