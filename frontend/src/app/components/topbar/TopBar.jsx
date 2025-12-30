import { Menu } from "lucide-react";

export default function TopBar({ title = "Dashboard", onMenuClick, user }) {
  return (
    <header className="h-16 flex items-center justify-between px-4 md:px-6 border-b border-black/5 bg-white/70 backdrop-blur-glass sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-1 md:hidden text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium text-slate-800">{title}</h1>
      </div>

      <div className="flex items-center gap-3">
        <span className="text-sm font-medium text-slate-600 hidden sm:block">{user?.name}</span>
        <div className="h-8 w-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold ring-2 ring-white shadow-sm">
          {user?.name?.charAt(0).toUpperCase() || "U"}
        </div>
      </div>
    </header>
  );
}
