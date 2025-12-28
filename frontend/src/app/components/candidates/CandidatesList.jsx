import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/useAuth";
import { getUsers as getAdminUsers, deleteUser } from "../../../api/admin.api";
import { getMyCandidates, deleteCandidate } from "../../../api/hr.api";
import CandidateRow from "./CandidateRow"; // Ensure this component exists
import Card from "../../../shared/ui/Card";

export default function CandidatesList() {
  const { user } = useAuth();
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchCandidates = async () => {
    try {
      setLoading(true);
      let data = [];
      
      if (user.role === "admin") {
        // Admin fetches all users with role="student"
        data = await getAdminUsers("student");
      } else {
        // HR fetches only their candidates
        data = await getMyCandidates();
      }
      setCandidates(data);
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
      // Remove from UI immediately
      setCandidates(prev => prev.filter(c => c._id !== id));
    } catch (err) {
      alert("Failed to delete candidate");
    }
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
              <th className="p-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {candidates.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-400">
                  No candidates found. Click "Add Candidate" to start.
                </td>
              </tr>
            ) : (
              candidates.map((candidate) => (
                <CandidateRow 
                  key={candidate._id} 
                  candidate={candidate} 
                  onDelete={() => handleDelete(candidate._id)} 
                />
              ))
            )}
          </tbody>
        </table>
      </div>
    </Card>
  );
}