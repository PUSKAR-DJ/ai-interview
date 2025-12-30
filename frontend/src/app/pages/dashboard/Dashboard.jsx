import useDashboard from "../../../hooks/useDashboard";
import { useAuth } from "../../../hooks/useAuth";
import AdminDashboard from "../admin/AdminDashboard";
import HRDashboard from "./HRDashboard";
import { Loader2, AlertCircle } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading, error } = useDashboard();

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-primary-500 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 flex items-center gap-3 text-red-500 bg-red-50 rounded-lg">
        <AlertCircle className="w-5 h-5" />
        <p>Failed to load dashboard data. Please refresh.</p>
      </div>
    );
  }

  if (user.role === "admin") {
    return <AdminDashboard stats={data} />;
  }

  if (user.role === "hr") {
    return <HRDashboard stats={data} />;
  }

  return <div>Unknown role</div>;
}