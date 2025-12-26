const activities = [
  {
    title: "Interview completed",
    meta: "Frontend Developer • 10 minutes ago",
  },
  {
    title: "New interview scheduled",
    meta: "Backend Developer • 1 hour ago",
  },
  {
    title: "Candidate added",
    meta: "UI Designer • Today",
  },
];

export default function ActivityList() {
  return (
    <section className="rounded-xl border border-black/5 bg-white/70 backdrop-blur-glass shadow-glass">
      <div className="px-6 py-4 border-b border-black/5">
        <h2 className="text-lg font-medium">Recent activity</h2>
      </div>

      <ul className="divide-y divide-black/5">
        {activities.map((item, index) => (
          <li key={index} className="px-6 py-4">
            <p className="font-medium">{item.title}</p>
            <p className="text-sm text-muted mt-1">{item.meta}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
