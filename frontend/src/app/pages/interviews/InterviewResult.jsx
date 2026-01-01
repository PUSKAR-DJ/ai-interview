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
  Headset,
  Volume2
} from "lucide-react";
import { getMyResult } from "../../../api/interview.api";
import { useAuth } from "../../../hooks/useAuth";
import { useNavigate } from "react-router-dom";
import GlassPanel from "../../../shared/ui/GlassPanel";
import Button from "../../../shared/ui/Button";

const isNoise = (text) => {
  const noisePatterns = [
    /^hello!/i,
    /^welcome/i,
    /^thank you for your time/i,
    /^goodbye/i,
    /^all the best/i,
    /^i will be asking you questions/i,
    /^excellent\. i have all the information/i
  ];
  return noisePatterns.some(pattern => pattern.test(text.trim()));
};

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
    setLoading(true);
    setError(null);
    getMyResult()
      .then((res) => {
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
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-950">
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.2, 1] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="mb-8 p-4 bg-blue-500/10 rounded-full"
        >
          <Loader2 className="w-12 h-12 text-blue-500" />
        </motion.div>
        <p className="text-slate-400 font-black uppercase tracking-[0.3em] text-xs">Generating your report</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 p-6 font-sans">
        <GlassPanel className="p-8 max-w-md w-full text-center space-y-6 bg-slate-900 border-white/5 shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center mx-auto ring-1 ring-red-500/20">
            <AlertCircle className="w-8 h-8" />
          </div>
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white tracking-tight">Report Error</h2>
            <p className="text-slate-500 text-sm leading-relaxed">{error}</p>
          </div>
          <Button onClick={fetchResult} className="w-full justify-center bg-blue-600 hover:bg-blue-500 py-4 font-bold rounded-xl shadow-lg shadow-blue-500/20">Retry Connection</Button>
        </GlassPanel>
      </div>
    );
  }

  if (!result) return null;

  // Process transcript into Q/A pairs
  const transcriptPairs = [];
  const rawTranscript = result.transcript || [];

  let currentQ = null;
  rawTranscript.forEach(msg => {
    if (msg.role === 'assistant') {
      if (!isNoise(msg.text)) {
        currentQ = { question: msg.text, answer: '' };
      } else {
        currentQ = null;
      }
    } else if (msg.role === 'user' && currentQ) {
      currentQ.answer = msg.text;
      transcriptPairs.push(currentQ);
      currentQ = null;
    }
  });

  // Fallbacks for missing data
  const score = result.aiScore ?? 0;
  const feedback = result.feedback || "Your interview performance has been logged and is under review by our recruitment team.";

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-4 md:p-12 font-sans selection:bg-blue-500/30">
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        {/* Success Header */}
        <div className="relative overflow-hidden p-8 md:p-14 rounded-[2.5rem] bg-gradient-to-br from-blue-600/10 via-slate-900 to-indigo-600/10 border border-white/5 text-center space-y-6 shadow-2xl">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/5 rounded-full blur-[100px] -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-[100px] -ml-32 -mb-32"></div>

          <div className="relative inline-flex mb-2">
            <div className="w-20 h-20 bg-blue-600 text-white rounded-[1.5rem] flex items-center justify-center mx-auto shadow-2xl shadow-blue-500/40 ring-4 ring-blue-500/10 rotate-3 transition-transform hover:rotate-0">
              <Trophy className="w-10 h-10" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-slate-900 flex items-center justify-center">
              <CheckCircle className="w-4 h-4 text-white" />
            </div>
          </div>

          <div className="relative space-y-2">
            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase italic">Interview Report</h1>
            <p className="text-slate-300 text-base md:text-lg max-w-xl mx-auto font-medium">Session analysis completed. Your performance metrics and verified transcript are ready below.</p>
          </div>

          {/* Audio Player for Students */}
          {result.audioUrl && (
            <div className="relative mt-10 p-4 md:p-6 bg-white/5 rounded-[2rem] border border-white/5 backdrop-blur-xl">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-400 border border-blue-500/20">
                  <Headset className="w-7 h-7" />
                </div>
                <div className="flex-1 w-full text-left">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em]">Audio Playback</span>
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Secure Cloudinary Stream</span>
                  </div>
                  <audio src={result.audioUrl} controls className="w-full h-10 rounded-full opacity-60 hover:opacity-100 transition-opacity invert hue-rotate-180 brightness-150" />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Score & Insights Section */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Main Score Card */}
          <div className="md:col-span-8">
            <GlassPanel className="p-8 md:p-10 h-full bg-slate-900/40 border-white/5 rounded-[2rem] flex flex-col">
              <div className="flex items-center gap-3 text-indigo-400 font-black uppercase tracking-[0.2em] text-[10px] mb-8">
                <Star className="w-4 h-4" /> Performance Rating
              </div>

              <div className="flex items-baseline gap-4 mb-10">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="text-8xl md:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-indigo-300 to-indigo-500 leading-none"
                >
                  {score}
                </motion.span>
                <div className="space-y-1">
                  <span className="text-3xl text-slate-500 font-extrabold block">/ 100</span>
                  <span className="text-[10px] font-black text-green-400 uppercase tracking-widest bg-green-500/10 px-2 py-0.5 rounded">AI Verified</span>
                </div>
              </div>

              <div className="w-full bg-slate-800/50 rounded-full h-4 mb-12 overflow-hidden border border-white/5 shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${score}%` }}
                  transition={{ duration: 1.5, ease: "circOut", delay: 0.5 }}
                  className="bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 h-full rounded-full shadow-[0_0_20px_rgba(59,130,246,0.3)]"
                ></motion.div>
              </div>

              <div className="mt-auto p-6 bg-white/5 rounded-2xl border border-white/10">
                <h3 className="text-lg font-black text-white flex items-center gap-3 mb-4 uppercase tracking-tight">
                  <MessageSquare className="w-5 h-5 text-indigo-400" /> Professional Feedback
                </h3>
                <p className="text-slate-100 leading-relaxed italic text-lg shadow-sm">
                  "{feedback}"
                </p>
              </div>
            </GlassPanel>
          </div>

          {/* Details Sidebar Card */}
          <div className="md:col-span-4 space-y-6">
            <GlassPanel className="p-8 bg-slate-900/60 border-white/5 rounded-[2rem] space-y-8" hoverEffect={false}>
              <div className="flex items-center gap-5 group">
                <div className="p-4 bg-indigo-500/20 text-indigo-300 rounded-2xl border border-indigo-500/20 group-hover:scale-110 transition-transform">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Time Finished</p>
                  <p className="font-black text-white text-lg tracking-tight">{new Date(result.endTime || result.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</p>
                </div>
              </div>

              <div className="flex items-center gap-5 group">
                <div className="p-4 bg-indigo-500/20 text-indigo-300 rounded-2xl border border-indigo-500/20 group-hover:scale-110 transition-transform">
                  <Hash className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Total Topics</p>
                  <p className="font-black text-white text-lg tracking-tight">{transcriptPairs.length} Discussion Points</p>
                </div>
              </div>

              <div className="pt-6 border-t border-white/10">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-4">Verification Status</p>
                <div className="flex items-center gap-3 px-4 py-3 bg-green-500/20 text-green-300 rounded-2xl border border-green-500/20">
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                  <span className="text-xs font-black uppercase tracking-widest">Report Validated</span>
                </div>
              </div>
            </GlassPanel>

            <Button onClick={() => window.print()} variant="outline" className="w-full border-white/20 bg-white/5 hover:bg-white/10 text-slate-100 py-6 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all">
              Export PDF Transcript
            </Button>
          </div>
        </div>

        {/* Detailed Transcript */}
        <div className="space-y-8 pt-12">
          <div className="flex items-end justify-between border-b border-white/5 pb-6">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">Interaction Log</h2>
            <div className="flex items-center gap-2 text-slate-500 text-[10px] font-black uppercase tracking-widest">
              <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div> AI Transcribed
            </div>
          </div>

          <div className="space-y-10">
            {transcriptPairs.length > 0 ? (
              transcriptPairs.map((pair, index) => (
                <div key={index} className="space-y-6 group">
                  <div className="flex items-start gap-6">
                    <span className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-slate-900 border border-white/5 text-slate-500 text-xs font-black rounded-xl group-hover:bg-blue-600 group-hover:text-white group-hover:border-blue-500 transition-all duration-300">
                      {(index + 1).toString().padStart(2, '0')}
                    </span>
                    <div className="space-y-4 flex-1">
                      <div className="p-6 bg-slate-900 border border-white/10 rounded-[1.5rem] rounded-tl-none shadow-2xl">
                        <p className="font-black text-indigo-400/60 text-[10px] tracking-widest uppercase mb-2">Analytical Query</p>
                        <p className="font-black text-white text-lg md:text-xl tracking-tight leading-tight">{pair.question}</p>
                      </div>
                      <div className="p-8 bg-blue-600/5 rounded-[1.5rem] rounded-tr-none border border-blue-500/10 border-l-4 border-l-blue-600">
                        <div className="flex items-center gap-2 mb-4">
                          <span className="text-[10px] font-black text-blue-500 uppercase tracking-[0.3em]">Candidate Voice Transcription</span>
                        </div>
                        <p className="text-slate-200 text-lg md:text-xl leading-relaxed font-medium">
                          {(pair.answer && pair.answer !== "[[CANDIDATE_RESPONSE]]" && pair.answer !== "Response Recorded" && pair.answer !== "(Response Recorded)")
                            ? pair.answer
                            : <span className="text-slate-600 italic font-normal">No audio detected or transcription failed.</span>}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center p-20 bg-slate-900/20 rounded-[2.5rem] border border-dashed border-white/10">
                <MessageSquare className="w-16 h-16 text-slate-800 mx-auto mb-6" />
                <p className="text-slate-500 font-bold text-lg mb-2 tracking-tight">Transcription Unavailable</p>
                <p className="text-slate-600 text-sm max-w-xs mx-auto">This interview may have ended before data could be synchronized.</p>
              </div>
            )}
          </div>
        </div>

        {/* Sign Out Section with better styling */}
        <div className="pt-24 pb-12">
          <GlassPanel className="p-10 text-center space-y-8 bg-gradient-to-t from-slate-900 to-slate-900/40 border-white/5 rounded-[2.5rem]">
            <div className="space-y-2">
              <h3 className="text-2xl font-black text-white tracking-tight uppercase tracking-tighter italic">Session Finalized</h3>
              <p className="text-slate-500 text-sm max-w-md mx-auto leading-relaxed">Your results have been securely hashed and stored. You may now safely sign out of the platform.</p>
            </div>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-center">
              <Button
                onClick={handleLogout}
                className="w-full sm:w-auto px-10 bg-white text-slate-950 hover:bg-slate-200 py-4 font-black text-xs uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-white/5"
              >
                <LogOut className="w-4 h-4 mr-2" /> Secure Sign Out
              </Button>
            </div>

            <div className="pt-8 border-t border-white/10">
              <p className="text-slate-500 text-[9px] font-bold uppercase tracking-[0.5em]">System ID: {result._id?.substring(0, 8)} • AI Engine: Gemini 2.5 Flash</p>
            </div>
          </GlassPanel>
        </div>
      </motion.div>
    </div>
  );
}