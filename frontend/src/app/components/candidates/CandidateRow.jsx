import { Trash2, Eye, Edit } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function CandidateRow({ candidate, onDelete, onEdit }) {
  const navigate = useNavigate();
  const statusConfig = {
    "NOT_STARTED": { label: "Not Started", classes: "bg-slate-100 text-slate-600" },
    "IN_PROGRESS": { label: "In Progress", classes: "bg-blue-50 text-blue-600" },
    "COMPLETED": { label: "Completed", classes: "bg-green-50 text-green-600 ring-1 ring-green-600/20" }
  };

  const status = statusConfig[candidate.interviewStatus] || statusConfig["NOT_STARTED"];

  return (
    <motion.tr
      variants={{ hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } }}
      className="border-b border-slate-50 last:border-none hover:bg-slate-50/50 transition-colors group"
    >
      <td className="p-4">
        <div className="font-semibold text-slate-800">{candidate.name}</div>
      </td>
      <td className="p-4 text-slate-500 font-medium">{candidate.email}</td>
      <td className="p-4">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${status.classes}`}>
          {status.label}
        </span>
      </td>
      <td className="p-4 text-slate-500 font-medium">
        {candidate.departmentId?.name || "Unassigned"}
      </td>
      <td className="p-4 text-right">
        <div className="flex justify-end gap-2 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => navigate(`/app/candidates/${candidate._id}`)}
            className="text-slate-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-all"
            title="View Details"
          >
            <Eye className="w-4 h-4" />
          </button>
          <button
            onClick={onEdit}
            className="text-slate-400 hover:text-blue-600 p-2 hover:bg-blue-50 rounded-lg transition-all"
            title="Edit Candidate"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            className="text-slate-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-all"
            title="Delete Candidate"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}