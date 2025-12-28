import { Outlet, useLocation, Navigate } from "react-router-dom";
import Sidebar from "../components/sidebar/Sidebar";
import TopBar from "../components/topbar/TopBar";
import { useAuth } from "../../hooks/useAuth"; // Import the hook

function getTitle(pathname) {
  if (pathname.includes("interviews")) return "Interviews";
  if (pathname.includes("candidates")) return "Candidates";
  if (pathname.includes("reports")) return "Reports";
  if (pathname.includes("settings")) return "Settings";
  return "Dashboard";
}

export default function AppLayout() {
  const { user, loading } = useAuth(); // Get auth state
  const location = useLocation();
  const isFocusMode = location.pathname.startsWith("/app/interviews/");
  const title = getTitle(location.pathname);

  // 1. Show loading spinner while checking auth
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  // 2. Security Check: If not logged in, redirect to login immediately
  // This prevents the Sidebar from rendering with a null user
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* NORMAL APP MODE */}
      {!isFocusMode && (
        <div className="flex min-h-screen">
          <Sidebar />

          <div className="flex-1 flex flex-col">
            <TopBar title={title} />
            <main className="flex-1 p-6">
              <Outlet />
            </main>
          </div>
        </div>
      )}

      {/* FOCUS MODE */}
      {isFocusMode && (
        <main className="min-h-screen flex items-center justify-center px-4 focus-bg">
          <Outlet />
        </main>
      )}
    </div>
  );
}