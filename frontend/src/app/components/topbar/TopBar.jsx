export default function TopBar({ title = "Dashboard" }) {
  return (
    <header className="h-16 flex items-center justify-between px-6 border-b border-black/5 bg-white/70 backdrop-blur-glass">
      <h1 className="text-lg font-medium">{title}</h1>

      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-black/10" />
      </div>
    </header>
  );
}
