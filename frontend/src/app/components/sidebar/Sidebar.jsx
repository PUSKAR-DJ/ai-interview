import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../../hooks/useAuth"; 

export default function Sidebar() {
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
      icon: "📊" 
    },
    { 
      label: "Candidates", 
      path: "/app/candidates", 
      roles: ["admin", "hr"],
      icon: "👥" 
    },
    // Admin Only
    { 
      label: "Departments", 
      path: "/app/admin/departments", 
      roles: ["admin"],
      icon: "🏢" 
    },
    // Student Only
    {
      label: "Interview",
      path: "/app/interview",
      roles: ["student"],
      icon: "🎥"
    },
    {
      label: "Result",
      path: "/app/result",
      roles: ["student"],
      icon: "🏆"
    }
  ];

  // Filter items based on user role
  const filteredItems = navItems.filter(item => item.roles.includes(user?.role));

  return (
    <aside className="w-64 bg-slate-900 text-white flex-shrink-0 hidden md:flex flex-col">
      {/* Brand */}
      <div className="p-6 font-bold text-xl tracking-wider flex items-center gap-2">
        <span className="text-blue-500">AI</span> INTERVIEW
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
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

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <p className="text-sm font-medium text-white truncate max-w-[120px]" title={user?.name}>
              {user?.name}
            </p>
            <p className="text-xs text-slate-500 capitalize">{user?.role}</p>
          </div>
          <div className="h-8 w-8 rounded-full bg-blue-500 flex items-center justify-center text-xs font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
        </div>
        
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-red-400 bg-red-400/10 hover:bg-red-400/20 rounded-lg transition-colors"
        >
          <span>🚪</span> Sign Out
        </button>
      </div>
    </aside>
  );
}