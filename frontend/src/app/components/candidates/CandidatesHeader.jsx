import Button from "../../../shared/ui/Button";
import { UserPlus } from "lucide-react";

export default function CandidatesHeader({ onAdd }) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Candidates</h1>
        <p className="text-slate-500 text-sm mt-1">
          Manage and review all candidates
        </p>
      </div>

      <Button onClick={onAdd} className="flex items-center gap-2">
        <UserPlus className="w-4 h-4" />
        Add Candidate
      </Button>
    </div>
  );
}