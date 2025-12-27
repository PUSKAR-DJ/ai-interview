import { Button } from "../../../shared/ui";

export default function CandidatesHeader() {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-xl font-medium">Candidates</h1>
        <p className="text-sm text-muted">
          Manage and review all candidates
        </p>
      </div>

      <Button>
        Add candidate
      </Button>
    </div>
  );
}
