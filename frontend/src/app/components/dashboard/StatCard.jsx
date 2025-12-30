import GlassPanel from "../../../shared/ui/GlassPanel";

export default function StatCard({ title, value, icon, color }) {
  const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    purple: "bg-purple-50 text-purple-600",
    orange: "bg-orange-50 text-orange-600",
    green: "bg-green-50 text-green-600"
  };

  const themeClass = colorMap[color] || "bg-slate-50 text-slate-600";

  return (
    <GlassPanel className="p-6 flex items-center justify-between hover:scale-[1.02] transition-transform duration-200">
      <div>
        <p className="text-sm font-medium text-slate-500">{title}</p>
        <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
      </div>
      <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl ${themeClass}`}>
        {icon}
      </div>
    </GlassPanel>
  );
}
