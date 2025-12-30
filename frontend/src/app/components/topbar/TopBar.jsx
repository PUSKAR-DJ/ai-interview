import { Menu } from "lucide-react";
import { getInitials } from "../../../shared/utils/string";

export default function TopBar({ title = "Dashboard", onMenuClick, user }) {
  return (
    <header className="h-16 flex items-center justify-between pl-4 md:pl-6 bg-white/70 backdrop-blur-glass sticky top-0 z-30 border-b border-black/5">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="p-1 md:hidden text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-medium text-slate-800">{title}</h1>
      </div>

      <div className="absolute right-4 top-2.5">
        <div className="h-10 w-10 bg-blue-600 text-white flex items-center justify-center text-sm font-bold shadow-lg rounded-full border-2 border-white">
          {getInitials(user?.name)}
        </div>
      </div>
    </header>
  );
}
