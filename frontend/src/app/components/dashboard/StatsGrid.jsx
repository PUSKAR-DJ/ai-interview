import StatCard from "./StatCard";

const stats = [
  { label: "Total Interviews", value: "128" },
  { label: "Pending Interviews", value: "12" },
  { label: "Completed Today", value: "5" },
  { label: "Candidates", value: "86" },
];

export default function StatsGrid() {
  return (
    <section className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat) => (
        <StatCard
          key={stat.label}
          label={stat.label}
          value={stat.value}
        />
      ))}
    </section>
  );
}
