import { useNavigate } from "react-router-dom";
import Button from "../../shared/ui/Button";

export default function Unauthorized() {
  const navigate = useNavigate();
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 text-center p-4">
      <div className="text-6xl mb-4">🚫</div>
      <h1 className="text-3xl font-bold text-slate-800 mb-2">Access Denied</h1>
      <p className="text-slate-500 mb-8 max-w-md">
        You do not have permission to view this page. If you believe this is an error, please contact your administrator.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => navigate(-1)} variant="outline">
          Go Back
        </Button>
        <Button onClick={() => navigate("/auth/login")}>
          Login
        </Button>
      </div>
    </div>
  );
}