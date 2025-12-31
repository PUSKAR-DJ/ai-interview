import { useState } from "react";
import { motion } from "framer-motion";
import { pageTransition } from "../../../shared/motion/animations";
import CandidatesHeader from "../../components/candidates/CandidatesHeader";
import CandidatesList from "../../components/candidates/CandidatesList";
import AddCandidateModal from "../../components/candidates/AddCandidateModal"; // Import the modal

export default function Candidates() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0); // Simple trick to force list refresh

  const handleSuccess = () => {
    setRefreshKey(prev => prev + 1); // Increment to trigger re-fetch in list
  };

  return (
    <motion.div {...pageTransition} className="space-y-8">
      {/* Pass handler to Header */}
      <CandidatesHeader onAdd={() => setIsModalOpen(true)} />

      {/* Pass refreshKey to List so it knows when to update */}
      <CandidatesList key={refreshKey} />

      {/* The Modal */}
      <AddCandidateModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={handleSuccess}
      />
    </motion.div>
  );
}