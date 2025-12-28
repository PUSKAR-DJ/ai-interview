import { Button } from "../../../shared/ui";

// Accept onAdd prop
export default function CandidatesHeader({ onAdd }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-medium">Candidates</h1>
        <p className="text-sm text-muted">
          Manage and review all candidates
        </p>
      </div>

      {/* Attach onClick handler */}
      <Button onClick={onAdd}>
        Add candidate
      </Button>
    </div>
  );
}