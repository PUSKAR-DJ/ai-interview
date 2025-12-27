import { motion } from "framer-motion";
import { pageTransition } from "../../../shared/motion/animations";
import SummaryHeader from "../../components/interview-summary/SummaryHeader";
import OverallResult from "../../components/interview-summary/OverallResult";
import SectionFeedback from "../../components/interview-summary/SectionFeedback";
import SummaryActions from "../../components/interview-summary/SummaryActions";

export default function InterviewSummary() {
  return (
    <motion.div {...pageTransition} className="w-full max-w-4xl mx-auto space-y-8 py-10">
      <SummaryHeader />
      <OverallResult />
      <SectionFeedback />
      <SummaryActions />
    </motion.div>
  );
}
