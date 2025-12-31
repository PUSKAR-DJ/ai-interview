import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Mail, Calendar, MessageSquare, Play, Volume2, Headset } from "lucide-react";
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

const isNoise = (text) => {
    const noisePatterns = [
        /^hello!/i,
        /^welcome/i,
        /^thank you for your time/i,
        /^goodbye/i,
        /^all the best/i,
        /^i will be asking you questions/i
    ];
    return noisePatterns.some(pattern => pattern.test(text.trim()));
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
            // Only consider it a question if it's not a greeting/noise
            if (!isNoise(msg.text)) {
                currentQ = { questionText: msg.text, answerText: '' };
            } else {
                currentQ = null;
            }
        } else if (msg.role === 'user' && currentQ) {
            // Answer to current question
            currentQ.answerText = msg.text;
            qList.push(currentQ); // Push complete pair
            currentQ = null;
        }
    });

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
                <Button variant="ghost" className="pl-0 gap-2 hover:bg-transparent hover:text-blue-600 font-bold text-slate-500" onClick={() => navigate(-1)}>
                    <ArrowLeft className="w-4 h-4" />
                    Back to Candidates
                </Button>
            </motion.div>

            {/* Header Card */}
            <motion.div variants={itemVariants}>
                <GlassPanel className="p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-blue-600 text-white rounded-2xl flex items-center justify-center text-2xl font-black shadow-lg shadow-blue-500/20">
                                {candidateName.charAt(0)}
                            </div>
                            <div className="min-w-0">
                                <h1 className="text-2xl font-black text-slate-800 tracking-tight">{candidateName}</h1>
                                <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-slate-500 mt-1 text-sm font-medium">
                                    <span className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5" /> {candidateEmail}</span>
                                    {data.endTime && (
                                        <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> {new Date(data.endTime).toLocaleDateString()}</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className={`px-4 py-1.5 rounded-xl text-xs font-black border uppercase tracking-widest ${data.status === 'Completed' || data.status === 'COMPLETED' ? 'bg-green-100 text-green-700 border-green-200' :
                            data.status === 'IN_PROGRESS' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                                'bg-slate-100 text-slate-700 border-slate-200'
                            }`}>
                            {data.status?.replace("_", " ")}
                        </div>
                    </div>

                    {/* Audio Player */}
                    {data.audioUrl && (
                        <div className="mt-8 pt-6 border-t border-slate-100">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-200/50">
                                <div className="flex-shrink-0 w-10 h-10 bg-white rounded-xl flex items-center justify-center text-blue-600 shadow-sm">
                                    <Headset className="w-5 h-5" />
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">Interview Recording</p>
                                    <audio
                                        controls
                                        src={data.audioUrl}
                                        className="w-full h-8 opacity-80 hover:opacity-100 transition-opacity"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </GlassPanel>
            </motion.div>

            {/* Transcript */}
            <motion.div variants={itemVariants} className="space-y-6 pt-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
                        <MessageSquare className="w-5 h-5 text-blue-500" />
                        Interview Transcript
                    </h2>
                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Snapshot View</span>
                </div>

                {qList.length === 0 ? (
                    <div className="p-16 text-center text-slate-400 bg-slate-50/50 rounded-3xl border border-dashed border-slate-200">
                        <MessageSquare className="w-12 h-12 mx-auto mb-4 opacity-20" />
                        <p className="font-bold">No transcript data available.</p>
                        <p className="text-sm">The interview might have ended prematurely or contains only noise.</p>
                    </div>
                ) : (
                    <div className="space-y-8">
                        {qList.map((q, index) => (
                            <div key={index} className="space-y-4 group">
                                <div className="flex items-start gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-800 text-white text-xs font-black rounded-lg group-hover:bg-blue-600 transition-colors">
                                        Q{index + 1}
                                    </span>
                                    <div className="space-y-4 flex-1">
                                        <div className="p-4 md:p-5 bg-white rounded-2xl rounded-tl-none border border-slate-100 shadow-sm group-hover:border-blue-100 transition-colors">
                                            <p className="font-bold text-slate-800 text-base md:text-lg leading-relaxed">{q.questionText}</p>
                                        </div>
                                        <div className="p-5 md:p-6 bg-blue-50/50 rounded-2xl rounded-tr-none border border-blue-100/50 border-l-4 border-l-blue-500">
                                            <p className="text-xs font-black text-blue-600 uppercase tracking-widest mb-2 opacity-60">Candidate Response</p>
                                            <p className="text-slate-700 leading-relaxed text-base md:text-lg">
                                                {q.answerText || <span className="italic text-slate-400">Response not captured correctly.</span>}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </motion.div>

        </motion.div>
    );
}
