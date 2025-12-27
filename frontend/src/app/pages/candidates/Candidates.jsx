import { motion } from "framer-motion";
import { pageTransition } from "../../../shared/motion/animations";
import CandidatesHeader from "../../components/candidates/CandidatesHeader";
import CandidatesList from "../../components/candidates/CandidatesList";

export default function Candidates() {
  return (
    <motion.div {...pageTransition} className="space-y-8">
      <CandidatesHeader />
      <CandidatesList />
    </motion.div>
  );
}
