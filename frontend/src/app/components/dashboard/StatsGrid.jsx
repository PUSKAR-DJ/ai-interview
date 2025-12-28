import StatCard from "./StatCard"; // Assuming you have a basic Card component here

export default function StatsGrid({ stats, role }) {
  // Define mappings based on Role
  const adminStats = [
    { label: "Total Candidates", value: stats?.totalCandidates || 0, icon: "👥", color: "blue" },
    { label: "Total HRs", value: stats?.totalHRs || 0, icon: "👔", color: "purple" },
    { label: "Departments", value: stats?.totalDepts || 0, icon: "🏢", color: "orange" },
    { label: "Completed Interviews", value: stats?.completedInterviews || 0, icon: "✅", color: "green" },
  ];

  const hrStats = [
    { label: "Dept. Candidates", value: stats?.totalDeptCandidates || 0, icon: "👥", color: "blue" },
    { label: "Pending Interviews", value: stats?.pendingInterviews || 0, icon: "⏳", color: "orange" },
    { label: "Completed Interviews", value: stats?.completedInterviews || 0, icon: "✅", color: "green" },
  ];

  const items = role === "admin" ? adminStats : hrStats;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item, index) => (
        <StatCard 
          key={index}
          title={item.label}
          value={item.value}
          icon={item.icon}
          color={item.color}
        />
      ))}
    </div>
  );
}