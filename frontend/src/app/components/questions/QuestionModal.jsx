import { useState, useEffect } from "react";
import { X, Save, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "../../../shared/ui/Button";
import GlassPanel from "../../../shared/ui/GlassPanel";
import { getDepartments } from "../../../api/admin.api";

export default function QuestionModal({ isOpen, onClose, onSave, question = null, userRole }) {
    const [text, setText] = useState("");
    const [departmentId, setDepartmentId] = useState("");
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (question) {
            setText(question.text);
            setDepartmentId(question.departmentId?._id || question.departmentId);
        } else {
            setText("");
            setDepartmentId("");
        }
    }, [question, isOpen]);

    useEffect(() => {
        if (isOpen && userRole === 'admin') {
            getDepartments().then(res => setDepartments(res));
        }
    }, [isOpen, userRole]);

    const handleSave = async (e) => {
        e.preventDefault();
        if (!text.trim()) return setError("Question text is required");
        if (userRole === 'admin' && !departmentId) return setError("Please select a department");

        try {
            setLoading(true);
            setError("");
            await onSave({ text, departmentId });
            onClose();
        } catch (err) {
            setError(err.response?.data?.message || "Failed to save question");
        } finally {
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    className="relative w-full max-w-lg overflow-hidden"
                >
                    <GlassPanel className="p-0 overflow-hidden shadow-2xl border-slate-200 ring-1 ring-black/5 bg-white/95">
                        <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                            <h2 className="text-xl font-black text-slate-800 tracking-tight uppercase italic">
                                {question ? "Edit Question" : "New Question"}
                            </h2>
                            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-800 transition-colors">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSave} className="p-8 space-y-6">
                            {error && (
                                <div className="flex items-center gap-3 p-4 bg-red-500/5 border border-red-500/10 text-red-500 text-sm font-bold rounded-xl animate-shake">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    {error}
                                </div>
                            )}

                            {userRole === 'admin' && (
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Target Department</label>
                                    <select
                                        value={departmentId}
                                        onChange={(e) => setDepartmentId(e.target.value)}
                                        className="w-full bg-slate-50/50 border border-slate-200 rounded-xl px-4 py-3.5 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                                    >
                                        <option value="" disabled className="bg-white italic">Select Department</option>
                                        {departments?.map(dept => (
                                            <option key={dept._id} value={dept._id} className="bg-white text-slate-800">
                                                {dept.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Question Text</label>
                                <textarea
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="e.g., Explain the difference between REST and GraphQL..."
                                    rows={4}
                                    className="w-full bg-slate-50/50 border border-slate-200 rounded-2xl px-5 py-4 text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all resize-none leading-relaxed"
                                />
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button
                                    type="button"
                                    onClick={onClose}
                                    variant="ghost"
                                    className="flex-1 py-4 font-black text-xs uppercase tracking-widest text-slate-400 hover:text-slate-800 hover:bg-slate-100"
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    loading={loading}
                                    className="flex-1 py-4 font-black text-xs uppercase tracking-widest bg-indigo-600 hover:bg-indigo-500 shadow-xl shadow-indigo-500/20"
                                >
                                    <Save className="w-4 h-4 mr-2" />
                                    {question ? "Update Question" : "Add Question"}
                                </Button>
                            </div>
                        </form>
                    </GlassPanel>
                </motion.div>
            </div>
        </AnimatePresence>
    );
}
