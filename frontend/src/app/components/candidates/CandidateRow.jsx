import { motion } from "framer-motion";

export default function CandidateRow({ candidate }) {
  return (
    <motion.div
      whileHover={{ backgroundColor: "rgba(0,0,0,0.04)" }}
      transition={{ duration: 0.15 }}
      className="flex items-center justify-between px-6 py-4"
    >
      <div>
        <p className="font-medium">{candidate.name}</p>
        <p className="text-sm text-muted">{candidate.role}</p>
      </div>

      <span className="text-sm text-muted">
        {candidate.status}
      </span>
    </motion.div>
  );
}
