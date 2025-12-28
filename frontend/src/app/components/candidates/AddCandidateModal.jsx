import { useState, useEffect } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { createUser as createAdminUser, getDepartments } from "../../../api/admin.api";
import { createCandidate as createHRCandidate } from "../../../api/hr.api"; // We'll assume this exists or map it
import Button from "../../../shared/ui/Button";

// Helper to handle API differences
const createCandidateApi = async (role, data) => {
  if (role === "admin") {
    // Admin creates a 'student' user assigned to a specific department
    return createAdminUser({ ...data, role: "student" });
  } else {
    // HR creates a student (dept is auto-assigned by backend)
    // If you haven't created hr.api.js yet, you can import this from a generic api file
    // For now, assuming standard structure:
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

  // Fetch departments only if Admin
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
      onSuccess(); // Trigger refresh in parent
      onClose();
      setFormData({ name: "", email: "", password: "", departmentId: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Failed to create candidate");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Add New Candidate</h2>
        
        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
            <input
              type="text"
              required
              className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {/* Only show Department dropdown for Admins */}
          {user.role === "admin" && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Assign Department</label>
              <select
                required
                className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                value={formData.departmentId}
                onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
              >
                <option value="">Select a Department</option>
                {departments.map((dept) => (
                  <option key={dept._id} value={dept._id}>
                    {dept.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="flex gap-3 mt-6">
            <Button type="button" variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={loading} className="flex-1">
              {loading ? "Creating..." : "Create Candidate"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}