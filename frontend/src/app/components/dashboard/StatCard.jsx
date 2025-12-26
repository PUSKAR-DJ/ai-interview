import GlassPanel from "../../../shared/ui/GlassPanel";

export default function StatCard({ label, value }) {
  return (
    <div className="rounded-xl border border-black/5 bg-white/70 backdrop-blur-glass shadow-glass p-6">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-2 text-3xl font-semibold">{value}</p>
    </div>
  );
}
