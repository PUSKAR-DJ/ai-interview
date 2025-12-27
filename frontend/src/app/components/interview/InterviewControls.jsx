import { Button } from "../../../shared/ui";
import { useNavigate } from "react-router-dom";

export default function InterviewControls() {
  const navigate = useNavigate();

  return (
    <div className="w-full max-w-3xl flex justify-between">
      <Button variant="ghost">
        Previous
      </Button>

      <Button onClick={() => navigate("summary")}>
        Finish interview
      </Button>
    </div>
  );
}
