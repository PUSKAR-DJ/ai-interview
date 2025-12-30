import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuth } from "../../../hooks/useAuth";
import { getUsers as getAdminUsers, deleteUser, updateUser, getDepartments } from "../../../api/admin.api";
import { getMyCandidates, deleteCandidate, updateCandidate } from "../../../api/hr.api";
import CandidateRow from "./CandidateRow";
import Card from "../../../shared/ui/Card";
import EditUserModal from "../common/EditUserModal"; // Import modal

export default function CandidatesList() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingCandidate, setEditingCandidate] = useState(null);

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      if (user.role === "admin") {
        const [users, depts] = await Promise.all([getAdminUsers("student"), getDepartments()]);
        setCandidates(users);
        setDepartments(depts);
      } else {
        const data = await getMyCandidates();
        setCandidates(data);
      }
    } catch (err) {
      console.error("Failed to fetch candidates", err);
      setError("Failed to load candidates.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this candidate?")) return;
    try {
      if (user.role === "admin") {
        await deleteUser(id);
      } else {
        await deleteCandidate(id);
      }
      setCandidates(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert("Failed to delete candidate");
    }
  };

  const handleEditSave = async (id, data) => {
    let updatedUser = null;
    if (user.role === "admin") {
      const res = await updateUser(id, data);
      updatedUser = res.user;
    } else {
      // HR can only edit name/email/password usually, dept is fixed
      const res = await updateCandidate(id, data);
      updatedUser = res.user;
    }

    // Update local state
    // For admin, if dept changed, we might need to update the populated field manually or refresh
    // If we returned populated user from backend its easy. Assuming basic user object returned.
    // Manually repopulate departmentId for display if it's an ID
    if (updatedUser.departmentId && typeof updatedUser.departmentId === 'string' && departments.length > 0) {
      const d = departments.find(dept => dept._id === updatedUser.departmentId);
      if (d) updatedUser.departmentId = d;
    }

    setCandidates(prev => prev.map(c => c._id === id ? { ...c, ...updatedUser } : c));
  };

  if (loading) return <div className="p-8 text-center text-slate-500">Loading candidates...</div>;
  if (error) return <div className="p-8 text-center text-red-500">{error}</div>;

  return (
    <Card className="overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 border-b border-slate-100 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="p-4">Name</th>
              <th className="p-4">Email</th>
              <th className="p-4">Status</th>
              <th className="p-4">Department</th>
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <motion.tbody
            className="divide-y divide-slate-100"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: { staggerChildren: 0.05 }
              }
            }}
          >
            {candidates.length === 0 ? (
              <tr>
                <td colSpan="5" className="p-12 text-center">
                  <div className="flex flex-col items-center justify-center text-slate-400">
                    <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mb-3">
                      <span className="text-2xl">👥</span>
                    </div>
                    <p className="font-medium text-slate-600">No candidates found</p>
                    <p className="text-sm mt-1">Get started by adding a new candidate.</p>
                  </div>
                </td>
              </tr>
            ) : (
              candidates.map((candidate) => (
                <CandidateRow
                  key={candidate._id}
                  candidate={candidate}
                  onDelete={() => handleDelete(candidate._id)}
                  onEdit={() => setEditingCandidate(candidate)}
                />
              ))
            )}
          </motion.tbody>
        </table>
      </div>

      {editingCandidate && (
        <EditUserModal
          user={editingCandidate}
          departments={departments}
          isHR={user.role === 'hr'}
          onClose={() => setEditingCandidate(null)}
          onSave={handleEditSave}
        />
      )}
    </Card>
  );
}