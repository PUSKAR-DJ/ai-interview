import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CheckCircle, Calendar, Hash, ArrowRight, LogOut, Loader2, AlertCircle } from "lucide-react";
import { getMyResult } from "../../../api/interview.api";
import GlassPanel from "../../../shared/ui/GlassPanel";
import Button from "../../../shared/ui/Button";

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
};

export default function InterviewResult() {
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

  const handleLogout = () => {
    // Basic logout redirect - in a real app, use useAuth().logout()
    window.location.href = "/auth/login";
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        >
          <Loader2 className="w-8 h-8 text-primary-500" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 p-6">
        <GlassPanel className="p-8 max-w-md w-full text-center space-y-4">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto">
            <AlertCircle className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-semibold text-slate-800">Error Loading Results</h2>
          <p className="text-slate-500">{error}</p>
          <Button onClick={fetchResult} className="w-full justify-center">Try Again</Button>
        </GlassPanel>
      </div>
    );
  }

  if (!result) return null;

  return (
    <div className="min-h-screen bg-slate-50/50 p-6 md:p-12 font-sans">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-3xl mx-auto space-y-8"
      >
        {/* Header Section */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Interview Completed</h1>
            <p className="text-slate-500 text-lg mt-2">Thank you for your time. Your responses have been recorded.</p>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <motion.div variants={itemVariants}>
            <GlassPanel className="p-6 flex items-center space-x-4 h-full" hoverEffect={true}>
              <div className="p-3 bg-blue-50 text-blue-600 rounded-lg">
                <Hash className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Total Questions</p>
                <p className="text-2xl font-bold text-slate-800">{result.questions?.length || 0}</p>
              </div>
            </GlassPanel>
          </motion.div>

          <motion.div variants={itemVariants}>
            <GlassPanel className="p-6 flex items-center space-x-4 h-full" hoverEffect={true}>
              <div className="p-3 bg-purple-50 text-purple-600 rounded-lg">
                <Calendar className="w-6 h-6" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500">Date Completed</p>
                <p className="text-lg font-bold text-slate-800">
                  {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
            </GlassPanel>
          </motion.div>
        </div>

        {/* Transcript Section */}
        <motion.div variants={itemVariants} className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-800">Response Transcript</h2>
            <span className="text-xs font-medium px-2 py-1 bg-slate-100 text-slate-500 rounded">
              View Only
            </span>
          </div>

          <div className="space-y-4">
            {result.questions?.map((q, index) => (
              <GlassPanel key={index} className="overflow-hidden">
                <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-start gap-3">
                  <span className="flex-shrink-0 w-6 h-6 flex items-center justify-center bg-slate-200 text-slate-600 text-xs font-bold rounded-full mt-0.5">
                    {index + 1}
                  </span>
                  <p className="font-medium text-slate-800 leading-relaxed">
                    {q.questionText}
                  </p>
                </div>
                <div className="p-5 bg-white">
                  <p className="text-slate-600 whitespace-pre-wrap leading-relaxed">
                    {q.answerText || <span className="text-slate-400 italic">No answer provided.</span>}
                  </p>
                </div>
              </GlassPanel>
            ))}
          </div>
        </motion.div>

        {/* Footer Actions */}
        <motion.div variants={itemVariants} className="pt-8 flex justify-center">
          <Button
            variant="outline"
            onClick={handleLogout}
            className="flex items-center gap-2"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </Button>
        </motion.div>

      </motion.div>
    </div>
  );
}