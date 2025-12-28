import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// allowedRoles: Array of roles allowed to access this route (e.g., ['admin', 'hr'])
export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  // 1. Not Logged In -> Go to Login
  if (!user) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  // 2. Role Check (Security)
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // If Admin tries to access Student page, or Student tries Admin page
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. STUDENT SPECIAL LOGIC: Interview Status Check
  // This logic ensures a student cannot re-enter the interview session
  if (user.role === "student") {
    const isInterviewRoute = location.pathname.includes("/app/interview");
    const isResultRoute = location.pathname.includes("/app/result");

    // If Completed -> MUST go to Result
    if (user.interviewStatus === "COMPLETED" && isInterviewRoute) {
      return <Navigate to="/app/result" replace />;
    }

    // If Not Started/In Progress -> MUST go to Interview (cannot see result yet)
    if (user.interviewStatus !== "COMPLETED" && isResultRoute) {
      return <Navigate to="/app/interview" replace />;
    }
  }

  return children;
}