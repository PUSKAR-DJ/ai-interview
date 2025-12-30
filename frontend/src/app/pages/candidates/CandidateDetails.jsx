import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, User, Mail, Calendar, Clock, MessageSquare } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { getCandidateHistory } from "../../../api/interview.api";
import GlassPanel from "../../../shared/ui/GlassPanel";
import Button from "../../../shared/ui/Button";

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 }
};

export default function CandidateDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                // role is "admin" or "hr" or "student"
                // API expects prefix "admin" or "hr"
                const prefix = user.role;
                const res = await getCandidateHistory(prefix, id);
                setData(res.data);
            } catch (err) {
                console.error("Failed to fetch history:", err);
                setError("Could not load interview details.");
            } finally {
                setLoading(false);
            }
        };
        if (id && user) fetchData();
    }, [id, user]);

    if (loading) return <div className="p-8 text-center text-slate-500">Loading details...</div>;
    if (error) return <div className="p-8 text-center text-red-500">{error}</div>;
    if (!data) return <div className="p-8 text-center text-slate-500">No data found.</div>;

    const candidate = data?.candidateId || data?.candidate;
    const transcript = data?.transcript || [];

    // Map linear transcript to Q/A pairs for display
    const qList = [];
    let currentQ = null;

    transcript.forEach(msg => {
        if (msg.role === 'assistant') {
            // New question found
            if (currentQ) qList.push(currentQ); // Push previous
            currentQ = { questionText: msg.text, answerText: '' };
        } else if (msg.role === 'user' && currentQ) {
            // Answer to current question
            currentQ.answerText = msg.text;
            qList.push(currentQ); // Push complete pair
            currentQ = null;
        }
    });
    // Push unresolved last question if any
    if (currentQ) qList.push(currentQ);

    const candidateName = candidate?.name || "Unknown Candidate";
    const candidateEmail = candidate?.email || "No email";

    return (
        <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="max-w-4xl mx-auto space-y-6 pb-12"
        >
            {/* Back Button */}
            <motion.div variants={itemVariants}>
                <Button variant="ghost" className="pl-0 gap-2 hover:bg-transparent hover:text-blue-600" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4" />
                    Back to Candidates
                </Button>
            </motion.div>

            {/* Header Card */}
            <motion.div variants={itemVariants}>
                <GlassPanel className="p-4 md:p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 md:gap-6">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl md:text-2xl font-bold flex-shrink-0">
                            {candidateName.charAt(0)}
                        </div>
                        <div className="min-w-0">
                            <h1 className="text-xl md:text-2xl font-bold text-slate-800 truncate">{candidateName}</h1>
                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-slate-500 mt-0.5 text-xs md:text-sm">
                                <span className="flex items-center gap-1 truncate"><Mail className="w-3 h-3 flex-shrink-0" /> {candidateEmail}</span>
                                {data.endTime && (
                                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3 flex-shrink-0" /> {new Date(data.endTime).toLocaleDateString()}</span>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className={`px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold border self-start md:self-auto uppercase tracking-wide ${data.status === 'Completed' || data.status === 'COMPLETED' ? 'bg-green-50 text-green-700 border-green-100' :
                        data.status === 'IN_PROGRESS' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                            'bg-slate-50 text-slate-700 border-slate-100'
                        }`}>
                        {data.status?.replace("_", " ")}
                    </div>
                </GlassPanel>
            </motion.div>

            {/* Transcript */}
            <motion.div variants={itemVariants} className="space-y-4">
                <h2 className="text-xl font-semibold text-slate-800 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-slate-400" />
                    Interview Transcript
                </h2>

                {qList.length === 0 ? (
                    <div className="p-12 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                        No questions recorded for this session.
                    </div>
                ) : (
                    <div className="space-y-6">
                        {qList.map((q, index) => (
                            <GlassPanel key={index} className="overflow-hidden">
                                <div className="bg-slate-50/80 p-4 border-b border-slate-100 flex gap-3">
                                    <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-slate-200 text-slate-600 text-xs font-bold rounded-full mt-0.5">
                                        Q{index + 1}
                                    </span>
                                    <span className="font-medium text-slate-800">{q.questionText}</span>
                                </div>
                                <div className="p-5">
                                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">
                                        {q.answerText || <span className="italic text-slate-400">No answer provided.</span>}
                                    </p>
                                </div>
                            </GlassPanel>
                        ))}
                    </div>
                )}
            </motion.div>

        </motion.div>
    );
}
