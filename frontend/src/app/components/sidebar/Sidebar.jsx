import { NavLink } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth";

export default function Sidebar() {
  const { user } = useAuth();

  const navItems = [
    // Shared (Admin & HR)
    { 
      label: "Dashboard", 
      path: "/app/dashboard", 
      roles: ["admin", "hr"],
      icon: "📊" 
    },
    { 
      label: "Candidates", 
      path: "/app/candidates", 
      roles: ["admin", "hr"],
      icon: "users" 
    },
    // Admin Only
    { 
      label: "Departments", 
      path: "/app/admin/departments", 
      roles: ["admin"],
      icon: "building" 
    },
    // Student Only
    {
      label: "Interview",
      path: "/app/interview",
      roles: ["student"],
      icon: "video"
    },
    {
      label: "Result",
      path: "/app/result",
      roles: ["student"],
      icon: "award"
    }
  ];

  // Filter items based on user role
  const filteredItems = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
      <div className="p-6 font-bold text-xl tracking-wider">AI INTERVIEW</div>
      <nav className="flex-1 px-4 space-y-2">
        {filteredItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                isActive ? "bg-blue-600 text-white" : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
      {/* User Mini Profile */}
      <div className="p-4 bg-slate-800">
        <p className="text-sm font-medium text-white">{user?.name}</p>
        <p className="text-xs text-slate-400 capitalize">{user?.role}</p>
      </div>
    </aside>
  );
}