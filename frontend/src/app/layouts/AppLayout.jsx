import { useState } from "react";
import { Outlet, useLocation, Navigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import Sidebar from "../components/sidebar/Sidebar";
import TopBar from "../components/topbar/TopBar";
import { useAuth } from "../../hooks/useAuth";
import { pageTransition } from "../../shared/motion/animations";

function getTitle(pathname) {
  if (pathname.includes("interviews")) return "Interviews";
  if (pathname.includes("candidates")) return "Candidates";
  if (pathname.includes("reports")) return "Reports";
  if (pathname.includes("settings")) return "Settings";
  if (pathname.includes("admin")) return "Admin Portal";
  return "Dashboard";
}

export default function AppLayout() {
  const { user, loading } = useAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isFocusMode = location.pathname.startsWith("/app/interviews/") ||
    location.pathname.startsWith("/app/interview");
  // Fixed check to catch "/app/interview" too if needed

  const title = getTitle(location.pathname);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-slate-50 text-slate-500">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50/30 font-sans text-slate-900">
      {/* NORMAL APP MODE */}
      {!isFocusMode && (
        <div className="flex h-screen overflow-hidden">
          {/* Desktop Sidebar */}
          <Sidebar className="hidden md:flex" />

          {/* Mobile Sidebar Overlay */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-50 flex md:hidden">
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={() => setMobileMenuOpen(false)}
              />
              <Sidebar
                className="relative flex w-72 h-full shadow-2xl animate-in slide-in-from-left duration-300"
                onMobileClose={() => setMobileMenuOpen(false)}
              />
            </div>
          )}

          <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
            <TopBar
              title={title}
              onMenuClick={() => setMobileMenuOpen(true)}
              user={user}
            />
            <main className="flex-1 overflow-y-auto p-4 md:p-6 scroll-smooth">
              <AnimatePresence mode="wait">
                <motion.div
                  key={location.pathname}
                  {...pageTransition}
                  className="h-full"
                >
                  <Outlet />
                </motion.div>
              </AnimatePresence>
            </main>
          </div>
        </div>
      )}

      {/* FOCUS MODE (No Shell) */}
      {isFocusMode && (
        <main className="min-h-screen bg-white">
          <Outlet />
        </main>
      )}
    </div>
  );
}