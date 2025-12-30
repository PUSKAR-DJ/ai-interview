import { useState, useEffect } from "react";
import Button from "../../../shared/ui/Button";
import GlassPanel from "../../../shared/ui/GlassPanel";

export default function EditUserModal({ user, onClose, onSave, departments, isHR }) {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        departmentId: "",
        password: "" // Optional
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                departmentId: user.departmentId?._id || user.departmentId || "",
                password: ""
            });
        }
    }, [user]);

    const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        try {
            await onSave(user._id, formData);
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || err.message || "Failed to update user.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <GlassPanel className="w-full max-w-md p-6 bg-white shadow-2xl">
                <h2 className="text-xl font-bold text-slate-800 mb-4">Edit User</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input
                            required
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                        />
                    </div>

                    {/* Only show Department select if departments are provided (Admin mode) */}
                    {departments && !isHR && (
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
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">
                            New Password <span className="text-slate-400 font-normal">(Leave blank to keep current)</span>
                        </label>
                        <input
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full p-2 border rounded-lg"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && <p className="text-red-500 text-sm">{error}</p>}

                    <div className="flex justify-end gap-3 mt-6">
                        <Button variant="ghost" type="button" onClick={onClose}>Cancel</Button>
                        <Button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</Button>
                    </div>
                </form>
            </GlassPanel>
        </div>
    );
}
