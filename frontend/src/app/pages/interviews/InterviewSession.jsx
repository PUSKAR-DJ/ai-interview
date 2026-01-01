import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
import { motion } from 'framer-motion';
import { Mic, Send, AlertCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../../../api/axios'; // Use our configured axios instance

export default function InterviewSession() {
  const { user, refreshUser } = useAuth();
  const navigate = useNavigate();

  // State
  const [hasPermission, setHasPermission] = useState(false);
  const [permissionError, setPermissionError] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [messages, setMessages] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [deptName, setDeptName] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [isComplete, setIsComplete] = useState(false);

  // Audio Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);
  const chatContainerRef = useRef(null);
  const initializedRef = useRef(false);

  // Autoscroll to bottom when messages change
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // Initial Permission Check and Status Check
  useEffect(() => {
    const checkStatus = async () => {
      if (initializedRef.current) return;
      initializedRef.current = true;

      try {
        setLoadingQuestions(true);
        // 1. Check Previous Interview
        const res = await api.get('/interview/status');
        if (res.data.completed) {
          await refreshUser();
          navigate('/app/result', { replace: true });
          return;
        }

        // 2. Fetch Dynamic AI Questions
        const qRes = await api.get('/interview/questions');
        if (qRes.data) {
          setQuestions(qRes.data.questions || []);
          setDeptName(qRes.data.department);

          // Set Initial Welcome Message ONLY if no messages exist
          setMessages(prev => prev.length === 0 ? [{
            role: 'assistant',
            text: `Hello! I am your AI Interviewer today. I will be asking you questions relevant to your ${qRes.data.department} department. When you are ready, please start the interview.`
          }] : prev);
        }
      } catch (e) {
        console.error("Failed to init interview", e);
        setMessages([{ role: 'assistant', text: "Error loading questions. Please contact HR." }]);
      } finally {
        setLoadingQuestions(false);
      }
    };
    checkStatus();
    checkMicrophonePermission();
    return () => stopTimer();
  }, []);

  const checkMicrophonePermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);
      stream.getTracks().forEach(track => track.stop());
    } catch (err) {
      setPermissionError("Microphone access is denied. Please enable it in browser settings to proceed.");
    }
  };

  const startInterview = async () => {
    if (!hasPermission || loadingQuestions || questions.length === 0) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      startTimer();

      // Initial Question - AI Speaks instantly
      setTimeout(() => {
        setMessages(prev => [...prev, { role: 'assistant', text: questions[0] }]);
        setCurrentQuestionIndex(1);
      }, 500);
    } catch (err) {
      console.error(err);
    }
  };

  const endInterview = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      stopTimer();
      mediaRecorderRef.current.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        await submitInterview(audioBlob);
      };
    }
  };

  const submitInterview = async (audioBlob) => {
    setIsSubmitting(true);
    const formData = new FormData();
    formData.append('audio', audioBlob, 'interview.webm');
    // candidateId is handled by token on backend
    formData.append('messages', JSON.stringify(messages));

    try {
      console.log("Uploading audio...", audioBlob.size);
      await api.post('/interview/submit', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      navigate('/app/result');
    } catch (error) {
      console.error("Upload failed", error);
      alert("Upload Failed: " + (error.response?.data?.message || "Connection Error"));
      setIsSubmitting(false); // Only reset if failed, otherwise redirect happens
    }
  };

  const startTimer = () => {
    timerRef.current = setInterval(() => {
      setRecordingTime(prev => prev + 1);
    }, 1000);
  };

  const stopTimer = () => {
    clearInterval(timerRef.current);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (permissionError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 p-8 rounded-xl text-center max-w-md border border-red-200">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h2 className="text-xl font-bold text-red-700 mb-2">Microphone Access Required</h2>
          <p className="text-red-600">{permissionError}</p>
          <button onClick={checkMicrophonePermission} className="mt-6 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">Retry</button>
        </div>
      </div>
    );
  }

  if (isSubmitting) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
        <h2 className="text-2xl font-bold text-slate-800">Analyzing Interview...</h2>
        <p className="text-slate-500 mt-2">Uploading audio and generating feedback. This may take a minute.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col bg-slate-900 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5 h-[calc(100vh-8rem)] md:h-[calc(100vh-6rem)]">
      {/* Header */}
      <header className="p-4 bg-slate-800/50 backdrop-blur-md border-b border-white/5 flex justify-between items-center shrink-0">
        <div className="flex flex-col">
          <h1 className="font-bold text-lg md:text-xl text-white">AI Interview</h1>
          <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold">{deptName || "Standard Division"}</span>
        </div>
        <div className="flex items-center space-x-2 md:space-x-4">
          {isRecording && (
            <div className="flex items-center text-red-400 animate-pulse font-mono text-sm">
              <div className="w-2 h-2 bg-red-500 rounded-full mr-2"></div>
              {formatTime(recordingTime)}
            </div>
          )}
          {isRecording && (
            <button onClick={endInterview} className="bg-red-600/10 text-red-400 px-3 py-1.5 md:px-4 md:py-2 rounded-lg hover:bg-red-600 hover:text-white transition-all border border-red-500/20 text-xs md:text-sm font-bold uppercase tracking-wide">
              Finish
            </button>
          )}
        </div>
      </header>

      {/* Chat Area */}
      <div ref={chatContainerRef} className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 bg-slate-900 scroll-smooth">
        {!isRecording && recordingTime === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-blue-600/10 rounded-full flex items-center justify-center mb-6 text-blue-500 ring-4 ring-blue-600/5">
              <Mic size={40} />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-4">Start Your Interview</h2>
            <div className="space-y-3 text-slate-400 max-w-sm mx-auto mb-8 text-sm md:text-base">
              <p className="flex items-center gap-2 justify-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Finding a quiet spot recommended</p>
              <p className="flex items-center gap-2 justify-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Speak naturally and clearly</p>
              <p className="flex items-center gap-2 justify-center"><span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span> Best results with headphones</p>
            </div>

            <button
              disabled={loadingQuestions || questions.length === 0}
              onClick={startInterview}
              className={`bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-blue-900/40 transition-all hover:scale-105 flex items-center gap-3 ${(loadingQuestions || questions.length === 0) ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <Mic size={22} /> {loadingQuestions ? "Loading Questions..." : "Start Now"}
            </button>
          </div>
        )}

        {messages.map((msg, idx) => (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={idx}
            className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}
          >
            <div className={`max-w-[85%] md:max-w-[75%] p-4 md:p-5 rounded-2xl text-base md:text-lg leading-relaxed shadow-lg ${msg.role === 'assistant'
              ? 'bg-slate-800/80 text-slate-100 rounded-tl-none border border-white/5'
              : 'bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-tr-none shadow-blue-900/30'
              }`}>
              {msg.text}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer Controls */}
      {isRecording && (
        <div className="p-4 bg-slate-800/50 backdrop-blur-md border-t border-white/5 shrink-0">
          <div className="max-w-3xl mx-auto flex items-center gap-3 md:gap-4">
            <div className="flex-1 bg-slate-900/80 rounded-full px-4 md:px-6 py-3 md:py-4 text-slate-400 flex items-center justify-between border border-white/5 shadow-inner">
              <span className="text-xs md:text-sm truncate mr-2">I am listening to your response...</span>
              <div className="flex gap-1 flex-shrink-0">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
              </div>
            </div>

            <button
              disabled={isComplete}
              onClick={() => {
                if (isComplete) return;

                if (currentQuestionIndex < questions.length) {
                  setMessages(prev => [...prev, { role: 'user', text: "Response Recorded" }]);
                  setTimeout(() => {
                    setMessages(prev => [...prev, { role: 'assistant', text: questions[currentQuestionIndex] }]);
                    setCurrentQuestionIndex(prev => prev + 1);
                  }, 2000);
                } else {
                  setMessages(prev => [...prev, { role: 'user', text: "Response Recorded" }]);
                  setMessages(prev => [...prev, { role: 'assistant', text: "Excellent. I have all the information I need. Please click 'Finish' to submit your interview." }]);
                  setIsComplete(true);
                }
              }}
              className={`bg-gradient-to-r from-blue-600 to-indigo-600 p-4 md:p-5 rounded-full hover:from-blue-500 hover:to-indigo-500 transition-all shadow-xl shadow-blue-900/50 flex-shrink-0 active:scale-95 ${isComplete ? 'opacity-50 cursor-not-allowed grayscale' : ''}`}
              title={isComplete ? "Interview Ended" : "End Answer & Next Question"}
            >
              <Send size={24} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}