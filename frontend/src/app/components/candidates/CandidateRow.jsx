export default function CandidateRow({ candidate, onDelete }) {
  const statusColors = {
    "NOT_STARTED": "bg-slate-100 text-slate-600",
    "IN_PROGRESS": "bg-blue-50 text-blue-600",
    "COMPLETED": "bg-green-50 text-green-600"
  };

  return (
    <tr className="hover:bg-slate-50/50 transition-colors">
      <td className="p-4 font-medium text-slate-800">{candidate.name}</td>
      <td className="p-4 text-slate-500">{candidate.email}</td>
      <td className="p-4">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${statusColors[candidate.interviewStatus] || "bg-gray-100"}`}>
          {candidate.interviewStatus.replace("_", " ")}
        </span>
      </td>
      <td className="p-4 text-right">
        <button 
          onClick={onDelete}
          className="text-red-400 hover:text-red-600 p-2 hover:bg-red-50 rounded-lg transition-colors"
          title="Delete Candidate"
        >
          🗑️
        </button>
      </td>
    </tr>
  );
}