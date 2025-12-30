import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { getUsers, createUser, deleteUser, getDepartments, updateUser } from "../../../api/admin.api";
import Button from "../../../shared/ui/Button";
import GlassPanel from "../../../shared/ui/GlassPanel";
import { UserPlus, Trash2, Mail, Building, Edit } from "lucide-react";
import EditUserModal from "../../components/common/EditUserModal";

// Variants
const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
};

export default function HRManager() {
    const [hrs, setHrs] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [usersData, deptsData] = await Promise.all([
                getUsers('hr'),
                getDepartments()
            ]);
            setHrs(usersData);
            setDepartments(deptsData);
        } catch (error) {
            console.error("Failed to load HR data", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to remove this HR manager?")) return;
        try {
            await deleteUser(id);
            setHrs(prev => prev.filter(u => u._id !== id));
        } catch (err) {
            alert("Failed to delete user.");
        }
    };

    const handleEditSave = async (id, data) => {
        const res = await updateUser(id, data);
        // Update local state finding the updated user in response (res.user) or fallback
        const updatedUser = res.user;
        setHrs(prev => prev.map(hr => hr._id === id ? { ...hr, ...updatedUser, departmentId: departments.find(d => d._id === updatedUser.departmentId) || updatedUser.departmentId } : hr));
        // Note: adminController updateUser returns { message, user }. user has departmentId as ID not populated object usually unless we changed it.
        // Actually mongoose update returns the document. If we didn't populate in controller, it's just ID.
        // Quick fix: refresh data is safer, or manual patch.
        // Manual patch: we have dept ID from data.departmentId. Find it in departments array.
        const dept = departments.find(d => d._id === data.departmentId);
        setHrs(prev => prev.map(hr => hr._id === id ? { ...hr, ...data, departmentId: dept } : hr));
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="visible"
            className="space-y-6"
        >
            <motion.div variants={item} className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Manage HR Managers</h1>
                    <p className="text-slate-500">Create and assign HR accounts to departments.</p>
                </div>
                <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
                    <UserPlus className="w-4 h-4" />
                    Add New HR
                </Button>
            </motion.div>

            {loading ? (
                <div className="text-center p-8">Loading...</div>
            ) : (
                <motion.div
                    initial="hidden"
                    animate="visible"
                    variants={item}
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
                >
                    {hrs.map(hr => (
                        <GlassPanel key={hr._id} className="p-5 flex flex-col gap-3 group relative">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-semibold text-slate-800 text-lg">{hr.name}</h3>
                                    <div className="flex items-center gap-2 text-slate-500 text-sm mt-1">
                                        <Mail className="w-3 h-3" />
                                        {hr.email}
                                    </div>
                                </div>
                                <div className="flex gap-1">
                                    <button
                                        onClick={() => setEditingUser(hr)}
                                        className="text-slate-300 hover:text-blue-500 transition-colors p-1"
                                    >
                                        <Edit className="w-4 h-4" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(hr._id)}
                                        className="text-slate-300 hover:text-red-500 transition-colors p-1"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>

                            <div className="pt-3 mt-2 border-t border-slate-100 flex items-center gap-2">
                                <Building className="w-4 h-4 text-purple-500" />
                                <span className="text-sm font-medium text-purple-700 bg-purple-50 px-2 py-1 rounded-md">
                                    {hr.departmentId?.name || "Unassigned"}
                                </span>
                            </div>
                        </GlassPanel>
                    ))}
                    {hrs.length === 0 && (
                        <div className="col-span-full text-center p-8 text-slate-400 italic">No HR managers found.</div>
                    )}
                </motion.div>
            )}

            {isModalOpen && (
                <CreateHRModal
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={() => { setIsModalOpen(false); fetchData(); }}
                    departments={departments}
                />
            )}

            {editingUser && (
                <EditUserModal
                    user={editingUser}
                    departments={departments}
                    onClose={() => setEditingUser(null)}
                    onSave={handleEditSave}
                />
            )}
        </motion.div>
    );
}

function CreateHRModal({ onClose, onSuccess, departments }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        departmentId: departments[0]?._id || ""
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await createUser({ ...formData, role: 'hr' });
            onSuccess();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create user.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <GlassPanel className="w-full max-w-md p-6 bg-white shadow-2xl">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Add HR Manager</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input required name="name" onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="John Doe" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input required type="email" name="email" onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="hr@company.com" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input required type="password" name="password" onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="••••••••" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
                        <select
                            name="departmentId"
                            onChange={handleChange}
                            value={formData.departmentId}
                            className="w-full p-2 border rounded-lg bg-white"
                        >
                            <option value="" disabled>Select Department</option>
                            {departments.map(d => <option key={d._id} value={d._id}>{d.name}</option>)}
                        </select>
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create HR"}</Button>
                    </div>
                </form>
            </GlassPanel>
        </div>
    );
}
