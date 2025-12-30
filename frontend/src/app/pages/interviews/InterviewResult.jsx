import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  CheckCircle,
  Calendar,
  Hash,
  LogOut,
  Loader2,
  AlertCircle,
  Star,
  MessageSquare,
  Trophy,
  ArrowRight
} from "lucide-react";
import { getMyResult } from "../../../api/interview.api";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import GlassPanel from "../../../shared/ui/GlassPanel";
import Button from "../../../shared/ui/Button";

export default function InterviewResult() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResult();
  }, []);

  const fetchResult = () => {
    console.log("Fetching result...");
    setLoading(true);
    setError(null);
    getMyResult()
      .then((res) => {
        console.log("Result received:", res.data);
        setResult(res.data);
      })
      .catch((err) => {
        console.error("Failed to fetch result:", err);
        setError("Could not load your interview results.");
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const handleLogout = async () => {
    await logout();
    navigate("/auth/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="mb-4"
        >
          <Loader2 className="w-10 h-10 text-blue-500" />
        </motion.div>
        <p className="text-slate-400 font-medium font-sans">Generating your report...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-900 p-6">
        <GlassPanel className="p-8 max-w-md w-full text-center space-y-4 bg-slate-800/50 border-white/5">
          <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold text-white">Report Not Found</h2>
          <p className="text-slate-400 text-sm">{error}</p>
          <Button onClick={fetchResult} className="w-full justify-center bg-blue-600 hover:bg-blue-500">Retry Loading</Button>
        </GlassPanel>
      </div>
    );
  }

  if (!result) return null;

  // Process transcript into Q/A pairs
  const transcriptPairs = [];
  const rawTranscript = result.transcript || [];
  for (let i = 0; i < rawTranscript.length; i++) {
    if (rawTranscript[i]?.role === 'assistant') {
      transcriptPairs.push({
        question: rawTranscript[i].text,
        answer: (rawTranscript[i + 1]?.role === 'user') ? rawTranscript[i + 1].text : "No response recorded."
      });
    }
  }

  // Fallbacks for missing data
  const score = result.aiScore ?? 0;
  const feedback = result.feedback || "Your interview performance has been logged and is under review by our recruitment team.";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-10 font-sans selection:bg-blue-500/30">
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto space-y-8"
      >
        {/* Success Header */}
        <div className="relative overflow-hidden p-8 md:p-12 rounded-[2rem] bg-gradient-to-br from-blue-600/20 to-indigo-600/20 border border-white/10 text-center space-y-4">
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div className="w-16 h-16 bg-blue-500 text-white rounded-full flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/20 ring-4 ring-blue-500/20">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-white tracking-tight">Interview Finished!</h1>
            <p className="text-slate-400 text-lg md:text-xl mt-2 max-w-xl mx-auto">You've successfully completed the assessment. Here is your AI-generated performance breakdown.</p>
          </div>
        </div>

        {/* Score & Insights Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Score Card */}
          <div className="md:col-span-2">
            <GlassPanel className="p-8 h-full bg-slate-900/40 border-white/5 flex flex-col items-center md:items-start text-center md:text-left">
              <div className="flex items-center gap-3 text-blue-400 font-bold uppercase tracking-widest text-xs mb-4">
                <Star className="w-4 h-4" /> AI Evaluation Score
              </div>
              <div className="flex items-baseline gap-2 mb-6">
                <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">{score}</span>
                <span className="text-2xl text-slate-600 font-bold">/ 100</span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-3 mb-8 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full shadow-[0_0_15px_rgba(59,130,246,0.5)]"
                ></motion.div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <MessageSquare className="w-5 h-5 text-indigo-400" /> Key Feedback
                </h3>
                <p className="text-slate-400 leading-relaxed italic text-lg">
                  "{feedback}"
                </p>
              </div>
            </GlassPanel>
          </div>

          {/* Details Sidebar Card */}
          <div className="space-y-6">
            <GlassPanel className="p-6 bg-slate-900/40 border-white/5 space-y-6" hoverEffect={false}>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-500/10 text-blue-400 rounded-xl">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Completed On</p>
                  <p className="font-bold text-white">{new Date(result.endTime || result.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl">
                  <Hash className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-500 font-bold uppercase">Questions Slated</p>
                  <p className="font-bold text-white">{transcriptPairs.length} Topics</p>
                </div>
              </div>

              <div className="pt-4 border-t border-white/5">
                <h4 className="text-xs text-slate-500 font-bold uppercase mb-3">Status</h4>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-500/10 text-green-400 rounded-full text-xs font-bold">
                  <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div> Fully Processed
                </div>
              </div>
            </GlassPanel>

            <Button onClick={() => window.print()} variant="outline" className="w-full border-white/10 text-slate-400 hover:text-white hover:bg-white/5 py-4">
              Download Full Report
            </Button>
          </div>
        </div>

        {/* Detailed Transcript */}
        <div className="space-y-6 pt-10">
          <div className="flex items-baseline justify-between border-b border-white/5 pb-4">
            <h2 className="text-2xl font-black text-white">Interview Transcript</h2>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Snapshot View</span>
          </div>

          <div className="space-y-6">
            {transcriptPairs.length > 0 ? (
              transcriptPairs.map((pair, index) => (
                <div key={index} className="space-y-4 group">
                  <div className="flex items-start gap-4">
                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-slate-800 text-slate-400 text-xs font-black rounded-lg group-hover:bg-blue-600 group-hover:text-white transition-colors">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <div className="space-y-4 flex-1">
                      <div className="p-5 bg-slate-900/60 rounded-2xl rounded-tl-none border border-white/5 shadow-inner">
                        <p className="font-bold text-slate-200 text-lg leading-relaxed">{pair.question}</p>
                      </div>
                      <div className="p-6 bg-blue-600/10 rounded-2xl rounded-tr-none border border-blue-500/20 border-l-4 border-l-blue-500/50">
                        <p className="text-slate-400 italic">Your Response:</p>
                        <p className="text-slate-200 mt-2 leading-relaxed text-lg">{pair.answer}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-12 bg-slate-900/20 rounded-2xl border border-dashed border-white/10">
                <p className="text-slate-500">No transcript data available for this session.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-20 pb-10 text-center space-y-6 border-t border-white/5">
          <div className="max-w-md mx-auto p-8 rounded-2xl bg-slate-900/40 border border-white/5">
            <h3 className="text-xl font-bold text-white mb-2">What's Next?</h3>
            <p className="text-slate-400 text-sm mb-6">Our recruitment team will review your full AI analysis. You will be contacted via email if you progress to the next round.</p>
            <Button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-slate-700 text-white py-4 font-bold"
            >
              <LogOut className="w-5 h-5" />
              Secure Sign Out
            </Button>
          </div>
          <p className="text-slate-600 text-xs uppercase tracking-widest font-bold">Generated by AI INTERVIEW PLATFORM</p>
        </div>
      </motion.div>
    </div>
  );
}