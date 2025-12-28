import { useState, useEffect } from "react";
import { getDepartments, createDepartment, deleteDepartment } from "../../../api/admin.api";
import Button from "../../../shared/ui/Button";
import Card from "../../../shared/ui/Card";

export default function Departments() {
  const [departments, setDepartments] = useState([]);
  const [newDept, setNewDept] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data);
    } catch (err) {
      console.error("Failed to load departments", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!newDept.trim()) return;
    try {
      await createDepartment(newDept);
      setNewDept("");
      fetchDepartments(); // Refresh list
    } catch (err) {
      setError("Failed to create department. Name might be duplicate.");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure? This might affect users in this department.")) return;
    try {
      await deleteDepartment(id);
      fetchDepartments();
    } catch (err) {
      alert("Failed to delete department");
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Manage Departments</h1>
      
      {/* Add Department Form */}
      <Card className="p-6">
        <form onSubmit={handleAdd} className="flex gap-4 items-end">
          <div className="flex-1">
            <label className="block text-sm font-medium text-slate-700 mb-1">New Department Name</label>
            <input
              type="text"
              className="w-full p-2 border border-slate-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Engineering, Sales, HR..."
              value={newDept}
              onChange={(e) => setNewDept(e.target.value)}
            />
          </div>
          <Button type="submit" disabled={!newDept.trim()}>
            + Add Department
          </Button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </Card>

      {/* Departments List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <p>Loading...</p>
        ) : departments.length === 0 ? (
          <p className="text-slate-500">No departments found.</p>
        ) : (
          departments.map((dept) => (
            <Card key={dept._id} className="p-4 flex justify-between items-center hover:shadow-md transition-shadow">
              <span className="font-semibold text-slate-700">{dept.name}</span>
              <button 
                onClick={() => handleDelete(dept._id)}
                className="text-red-500 hover:bg-red-50 p-2 rounded-full text-sm"
              >
                🗑️
              </button>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}