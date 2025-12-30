import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { createUser as createAdminUser, getDepartments } from "../../../api/admin.api";
import { createCandidate as createHRCandidate } from "../../../api/hr.api";
import Button from "../../../shared/ui/Button";
import GlassPanel from "../../../shared/ui/GlassPanel";
import { X, User, Mail, Lock, Building } from "lucide-react";

const createCandidateApi = async (role, data) => {
  if (role === "admin") {
    return createAdminUser({ ...data, role: "student" });
  } else {
    return createHRCandidate(data);
  }
};

export default function AddCandidateModal({ isOpen, onClose, onSuccess }) {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    departmentId: "",
  });
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isOpen && user.role === "admin") {
      getDepartments()
        .then(setDepartments)
        .catch((err) => console.error("Failed to load departments", err));
    }
  }, [isOpen, user.role]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await createCandidateApi(user.role, formData);
      onSuccess();
      onClose();
      setFormData({ name: "", email: "", password: "", departmentId: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create candidate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
      <GlassPanel className="w-full max-w-md p-0 overflow-hidden shadow-2xl ring-1 ring-black/5">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-white/50">
          <h2 className="text-xl font-bold text-slate-800">New Candidate</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm font-medium flex items-center gap-2">
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1 ml-1">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1 ml-1">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="email"
                  required
                  placeholder="john@example.com"
                  className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1 ml-1">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>
            </div>

            {user.role === "admin" && (
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1 ml-1">Department</label>
                <div className="relative">
                  <Building className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <select
                    required
                    className="w-full pl-9 p-2.5 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium text-slate-700 appearance-none"
                    value={formData.departmentId}
                    onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  >
                    <option value="">Select Department</option>
                    {departments.map((dept) => (
                      <option key={dept._id} value={dept._id}>
                        {dept.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            <div className="flex gap-3 mt-8 pt-2">
              <Button type="button" variant="ghost" onClick={onClose} className="flex-1">
                Cancel
              </Button>
              <Button type="submit" disabled={loading} className="flex-1">
                {loading ? "Creating..." : "Create Candidate"}
              </Button>
            </div>
          </form>
        </div>
      </GlassPanel>
    </div>
  );
}