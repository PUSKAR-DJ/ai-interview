export default function GlassPanel({ children, className = "" }) {
  return (
    <div
      className={`rounded-xl border border-black/5 bg-white/70 backdrop-blur-glass shadow-glass ${className}`}
    >
      {children}
    </div>
  );
}
