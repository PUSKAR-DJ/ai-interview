import { NavLink } from "react-router-dom";

const navItems = [
  { label: "Dashboard", to: "/app" },
  { label: "Interviews", to: "/app/interviews" },
  { label: "Candidates", to: "/app/candidates" },
  { label: "Reports", to: "/app/reports" },
  { label: "Settings", to: "/app/settings" },
];

export default function Sidebar() {
  return (
    <aside className="hidden md:flex w-64 flex-col border-r border-black/5 bg-white">
      <div className="h-16 flex items-center px-6 font-semibold">
        Company
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              `block rounded-lg px-3 py-2 text-sm transition
               ${
                 isActive
                   ? "bg-accentSoft text-accent font-medium"
                   : "text-muted hover:bg-black/5"
               }`
            }
          >
            {item.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
