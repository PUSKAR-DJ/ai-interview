import { Outlet, useLocation } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import TopBar from "../components/topbar/TopBar";

function getTitle(pathname) {
  if (pathname.includes("interviews")) return "Interviews";
  if (pathname.includes("candidates")) return "Candidates";
  if (pathname.includes("reports")) return "Reports";
  if (pathname.includes("settings")) return "Settings";
  return "Dashboard";
}

export default function AppLayout() {
  const location = useLocation();
  const title = getTitle(location.pathname);

  return (
    <div className="min-h-screen flex bg-bg">
      <Sidebar />

      <div className="flex-1 flex flex-col">
        <TopBar title={title} />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
