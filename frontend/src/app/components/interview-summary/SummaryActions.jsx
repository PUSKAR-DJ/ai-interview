import { Button } from "../../../shared/ui";

export default function SummaryActions() {
  return (
    <div className="flex justify-end gap-4 pt-6">
      <Button variant="secondary">
        Download report
      </Button>

      <Button>
        Back to interviews
      </Button>
    </div>
  );
}
