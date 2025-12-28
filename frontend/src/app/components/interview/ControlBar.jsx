import { Button } from "../../../shared/ui";

export default function ControlBar() {
  return (
    <div className="flex justify-between pt-4">
      <Button variant="ghost">
        Skip
      </Button>

      <Button>
        Next question
      </Button>
    </div>
  );
}
