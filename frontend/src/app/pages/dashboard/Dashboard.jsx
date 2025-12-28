import useDashboard from "../../../hooks/useDashboard";
import { useAuth } from "../../../hooks/useAuth";
import StatsGrid from "../../components/dashboard/StatsGrid";
// import ActivityList from "../../components/dashboard/ActivityList"; // Uncomment if you implement this later

export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading, error } = useDashboard();

  if (loading) return <div className="p-8 text-slate-500">Loading live stats...</div>;
  if (error) return <div className="p-8 text-red-500">Failed to load dashboard data.</div>;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          {user.role === "admin" ? "System Overview" : "Department Dashboard"}
        </h1>
        <p className="text-slate-500 mt-1">
          {user.role === "admin" 
            ? "Manage your organization's recruitment pipeline" 
            : `Track candidates in ${user.departmentId?.name || "your department"}`}
        </p>
      </div>

      {/* Pass real data to grid */}
      <StatsGrid stats={data} role={user.role} />

      {/* Placeholder for future Charts/Activity */}
      <div className="p-6 bg-white rounded-xl border border-slate-100 shadow-sm">
        <h3 className="font-semibold text-slate-800 mb-4">Quick Actions</h3>
        <p className="text-slate-500 text-sm">
          Navigate to the <strong>Candidates</strong> tab to manage new applicants or view interview results.
        </p>
      </div>
    </div>
  );
}