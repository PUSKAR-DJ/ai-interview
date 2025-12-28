import useDashboard from "../../../hooks/useDashboard"; // We created this earlier
import { useAuth } from "../../../hooks/useAuth";
import StatsGrid from "../../components/dashboard/StatsGrid";
import ActivityList from "../../components/dashboard/ActivityList";

export default function Dashboard() {
  const { user } = useAuth();
  const { data, loading, error } = useDashboard();

  if (loading) return <div className="p-8">Loading stats...</div>;
  if (error) return <div className="p-8 text-red-500">Failed to load dashboard data.</div>;

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800">
          {user.role === "admin" ? "Global Overview" : `${user.departmentId?.name || 'Department'} Overview`}
        </h1>
        <p className="text-slate-500">
          {user.role === "admin" 
            ? "System-wide metrics and activities" 
            : "Track candidates and interviews for your department"}
        </p>
      </div>

      {/* Stats Grid - Automatically adapts because 'data' structure matches keys */}
      {/* Admin sees: totalCandidates, totalHRs, totalDepts */}
      {/* HR sees: totalDeptCandidates, pendingInterviews, completedInterviews */}
      <StatsGrid stats={data} role={user.role} />

      {/* Recent Activity / Charts could go here */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
           <h3 className="font-semibold mb-4">Recent Actions</h3>
           <ActivityList role={user.role} /> 
        </div>
      </div>
    </div>
  );
}