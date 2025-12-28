import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth"; // Using the hook wrapper
import Button from "../../shared/ui/Button";

export default function Login() {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // 1. Execute Login
      // NOTE: Ensure your AuthContext's login function returns the user object!
      const user = await login(formData);

      // 2. Check if user was trying to access a specific page before being redirected to login
      const from = location.state?.from?.pathname;
      if (from) {
        navigate(from, { replace: true });
        return;
      }

      // 3. Main Role-Based Redirection Logic
      if (user.role === "admin" || user.role === "hr") {
        navigate("/app/dashboard");
      } 
      else if (user.role === "student") {
        // The Critical Logic: Check interview status
        if (user.interviewStatus === "COMPLETED") {
          navigate("/app/result");
        } else {
          navigate("/app/interview");
        }
      }
      else {
        // Fallback
        navigate("/app");
      }

    } catch (err) {
      console.error("Login Failed:", err);
      // Extract error message from backend response if available
      const msg = err.response?.data?.error || err.response?.data?.message || "Invalid email or password";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-slate-100">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Welcome Back</h1>
          <p className="text-slate-500 mt-2">Sign in to access the interview portal</p>
        </div>

        {error && (
          <div className="p-4 mb-6 text-sm text-red-700 bg-red-50 rounded-lg border border-red-100 flex items-center gap-2">
            <span className="text-xl">⚠️</span>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
            <input
              type="email"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="you@company.com"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <input
              type="password"
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />
          </div>

          <Button 
            type="submit" 
            variant="primary" 
            className="w-full py-3 mt-2 text-lg font-medium shadow-lg shadow-blue-500/30"
            disabled={loading}
          >
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-400">
          <p>Don't have an account? Contact your HR administrator.</p>
        </div>
      </div>
    </div>
  );
}