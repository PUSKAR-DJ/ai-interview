import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";
import { LayoutDashboard, Users, Building, Video, Award, UserCog, LogOut, X, BookOpen } from "lucide-react";
import { getInitials } from "../../../shared/utils/string";

export default function Sidebar({ className = "w-64 hidden md:flex", onMobileClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  const navItems = [
    // Shared (Admin & HR)
    {
      label: "Dashboard",
      path: "/app/dashboard",
      roles: ["admin", "hr"],
      icon: LayoutDashboard
    },
    {
      label: "Candidates",
      path: "/app/candidates",
      roles: ["admin", "hr"],
      icon: Users
    },
    // Admin Only
    {
      label: "Departments",
      path: "/app/admin/departments",
      roles: ["admin"],
      icon: Building
    },
    {
      label: "HR Managers",
      path: "/app/admin/hrs",
      roles: ["admin"],
      icon: UserCog
    },
    {
      label: "Questions",
      path: "/app/questions",
      roles: ["admin", "hr"],
      icon: BookOpen
    },
    // Student Only
    {
      label: "Interview",
      path: "/app/interview",
      roles: ["student"],
      icon: Video
    },
    {
      label: "Result",
      path: "/app/result",
      roles: ["student"],
      icon: Award
    }
  ];

  // Filter items based on user role
  const filteredItems = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <aside className={`bg-slate-900 text-white flex flex-col flex-shrink-0 transition-all ${className}`}>
      {/* Brand */}
      <div className="p-6 font-bold text-xl tracking-wider flex items-center justify-between border-b border-slate-800/50">
        <div className="flex items-center gap-2">
          <span className="text-blue-500">AI</span> INTERVIEW
        </div>
        {onMobileClose && (
          <button onClick={onMobileClose} className="text-slate-400 hover:text-white md:hidden">
            <X className="w-6 h-6" />
          </button>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto mt-6">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            onClick={() => onMobileClose?.()}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive ? "bg-blue-600 text-white shadow-lg shadow-blue-900/20" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium text-sm">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="mt-auto p-4 border-t border-slate-800/50 bg-slate-900/40">
        <div className="px-2 mb-4">
          <div className="min-w-0">
            <p className="text-sm font-bold text-white truncate leading-tight mb-1">
              {user?.name}
            </p>
            <p className="text-[11px] text-slate-400 font-medium truncate capitalize mb-0.5">
              {user?.departmentId?.name || "Unassigned"}
            </p>
            <p className="text-[10px] text-blue-500 font-bold uppercase tracking-wider">
              {user?.role}
            </p>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-bold text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-all border border-slate-700/50 shadow-sm"
        >
          <LogOut className="w-4 h-4" />
          <span>SIGN OUT</span>
        </button>
      </div>
    </aside>
  );
}