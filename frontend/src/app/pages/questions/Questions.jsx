import { useState, useEffect } from "react";
import { Plus, Search, Filter, Edit2, Trash2, ArrowRight, BookOpen, MessageSquare, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../../hooks/useAuth";
import GlassPanel from "../../../shared/ui/GlassPanel";
import Button from "../../../shared/ui/Button";
import QuestionModal from "../../components/questions/QuestionModal";
import { getQuestions, createQuestion, updateQuestion, deleteQuestion } from "../../../api/question.api";
import { getDepartments } from "../../../api/admin.api";

export default function Questions() {
    const { user } = useAuth();
    const [questions, setQuestions] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedDept, setSelectedDept] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState(null);

    useEffect(() => {
        fetchInitialData();
    }, []);

    const fetchInitialData = async () => {
        try {
            setLoading(true);
            const [qRes, dRes] = await Promise.all([
                getQuestions(selectedDept),
                user.role === 'admin' ? getDepartments() : Promise.resolve([])
            ]);
            setQuestions(qRes.data);
            if (user.role === 'admin') setDepartments(dRes);
        } catch (error) {
            console.error("Failed to fetch questions:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            fetchQuestions();
        }, 300);
        return () => clearTimeout(timer);
    }, [selectedDept]);

    const fetchQuestions = async () => {
        try {
            const res = await getQuestions(selectedDept);
            setQuestions(res.data);
        } catch (error) {
            console.error("Fetch error:", error);
        }
    };

    const handleSave = async (data) => {
        if (user.role === 'hr') data.departmentId = user.departmentId?._id || user.departmentId;

        if (editingQuestion) {
            await updateQuestion(editingQuestion._id, data);
        } else {
            await createQuestion(data);
        }
        fetchQuestions();
    };

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this question?")) {
            try {
                await deleteQuestion(id);
                fetchQuestions();
            } catch (error) {
                alert(error.response?.data?.message || "Delete failed");
            }
        }
    };

    const filteredQuestions = questions.filter(q =>
        q.text.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="max-w-7xl mx-auto space-y-10 pb-20">
            {/* Header section */}
            <header className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-2">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tighter uppercase italic flex items-center gap-4">
                        <BookOpen className="w-10 h-10 text-indigo-600" />
                        Question Bank
                    </h1>
                    <p className="text-slate-500 font-medium tracking-tight text-lg">Manage department-specific assessment queries.</p>
                </div>

                <Button
                    onClick={() => { setEditingQuestion(null); setShowModal(true); }}
                    className="bg-indigo-600 hover:bg-indigo-500 py-4 px-8 font-black text-xs uppercase tracking-widest shadow-2xl shadow-indigo-500/20 rounded-2xl"
                >
                    <Plus className="w-5 h-5 mr-2" /> Add Question
                </Button>
            </header>

            {/* Controls */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                <div className="md:col-span-8 relative group">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                    <input
                        type="text"
                        placeholder="Search questions by keywords..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-white/70 border border-slate-200 rounded-2xl pl-14 pr-6 py-4.5 text-slate-800 font-medium placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all backdrop-blur-sm shadow-sm"
                    />
                </div>

                {user.role === 'admin' && (
                    <div className="md:col-span-4 relative group">
                        <Filter className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-indigo-500 transition-colors" />
                        <select
                            value={selectedDept}
                            onChange={(e) => setSelectedDept(e.target.value)}
                            className="w-full bg-white/50 border border-slate-200 rounded-2xl pl-14 pr-10 py-4.5 text-slate-800 font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all appearance-none backdrop-blur-sm shadow-sm"
                        >
                            <option value="">All Departments</option>
                            {departments?.map(dept => (
                                <option key={dept._id} value={dept._id}>{dept.name}</option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* List */}
            {loading ? (
                <div className="p-20 text-center animate-pulse">
                    <div className="w-16 h-16 bg-indigo-500/10 rounded-full mx-auto mb-4 border border-indigo-500/20" />
                    <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Loading Knowledge Base</p>
                </div>
            ) : filteredQuestions.length === 0 ? (
                <div className="py-24 text-center space-y-4 bg-white/40 rounded-[3rem] border border-dashed border-slate-200">
                    <MessageSquare className="w-16 h-16 text-slate-300 mx-auto" />
                    <div className="space-y-1">
                        <h3 className="text-xl font-bold text-slate-400">No questions found</h3>
                        <p className="text-slate-400 text-sm">Start by adding a custom assessment query.</p>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-6">
                    {filteredQuestions.map((q, idx) => (
                        <motion.div
                            key={q._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                        >
                            <GlassPanel className="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 hover:border-indigo-500/20 transition-all group overflow-hidden relative shadow-sm">
                                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity" />

                                <div className="flex-1 space-y-4">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] font-black bg-indigo-600/10 text-indigo-500 px-3 py-1 rounded-lg uppercase tracking-widest border border-indigo-500/10">
                                            {q.departmentId?.name || "Global"}
                                        </span>
                                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-2 border-l border-slate-100">
                                            Added by {q.createdBy?.name || "System"}
                                        </span>
                                    </div>
                                    <p className="text-xl md:text-2xl font-black text-slate-800 tracking-tight leading-tight group-hover:text-indigo-900 transition-colors">
                                        {q.text}
                                    </p>
                                </div>

                                <div className="flex items-center gap-2 self-end md:self-auto">
                                    <button
                                        onClick={() => { setEditingQuestion(q); setShowModal(true); }}
                                        className="p-3 text-slate-400 hover:text-indigo-500 hover:bg-indigo-500/10 rounded-xl transition-all border border-transparent hover:border-indigo-500/20"
                                    >
                                        <Edit2 className="w-5 h-5" />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(q._id)}
                                        className="p-3 text-slate-400 hover:text-red-500 hover:bg-red-500/10 rounded-xl transition-all border border-transparent hover:border-red-500/20"
                                    >
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </div>
                            </GlassPanel>
                        </motion.div>
                    ))}
                </div>
            )}

            {/* Smart Logic Alert */}
            <footer className="pt-10">
                <div className="p-6 bg-indigo-600/5 rounded-3xl border border-indigo-500/10 flex items-start gap-4">
                    <div className="p-2 bg-indigo-600/20 rounded-xl text-indigo-500 border border-indigo-500/20">
                        <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                        <h4 className="font-black text-indigo-500 uppercase tracking-widest text-[10px] mb-1">AI Injection Logic</h4>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-2xl">
                            If a department has fewer than 5 questions, the AI will automatically generate more to ensure a complete 5-10 question assessment. Professional balancing is applied to all sessions.
                        </p>
                    </div>
                </div>
            </footer>

            <QuestionModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                onSave={handleSave}
                question={editingQuestion}
                userRole={user.role}
            />
        </div>
    );
}
