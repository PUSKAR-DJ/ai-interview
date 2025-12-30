import { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../hooks/useAuth';
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

  // Audio Refs
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerRef = useRef(null);

  // Initial Permission Check and Status Check
  useEffect(() => {
    const checkStatus = async () => {
      try {
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
          setQuestions(qRes.data.questions);
          setDeptName(qRes.data.department);

          // Set Initial Welcome Message
          setMessages([{
            role: 'assistant',
            text: `Hello! I am your AI Interviewer today. I will be asking you questions relevant to your ${qRes.data.department} department. When you are ready, please start the interview.`
          }]);
        }
      } catch (e) {
        console.error("Failed to init interview", e);
        setMessages([{ role: 'assistant', text: "Error loading questions. Please contact HR." }]);
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
    if (!hasPermission) return;
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
      if (questions.length > 0) {
        setTimeout(() => {
          setMessages(prev => [...prev, { role: 'assistant', text: questions[0] }]);
          setCurrentQuestionIndex(1);
        }, 500);
      } else {
        setMessages(prev => [...prev, { role: 'assistant', text: "No questions configured for this department." }]);
      }
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
    <div className="h-[calc(100vh-6rem)] flex flex-col bg-slate-900 rounded-2xl overflow-hidden shadow-2xl ring-1 ring-slate-900/5">
      {/* Header */}
      <header className="p-4 bg-slate-800 border-b border-slate-700 flex justify-between items-center shrink-0">
        <h1 className="font-bold text-xl text-white">AI Interview Session</h1>
        <div className="flex items-center space-x-4">
          {isRecording && (
            <div className="flex items-center text-red-400 animate-pulse font-mono">
              <div className="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
              REQ {formatTime(recordingTime)}
            </div>
          )}
          {isRecording && (
            <button onClick={endInterview} className="bg-red-600/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors border border-red-500/30 text-sm font-medium">
              End Interview
            </button>
          )}
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-slate-900">
        {!isRecording && recordingTime === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-blue-600/20 rounded-full flex items-center justify-center mb-6 text-blue-400">
              <Mic size={40} />
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Start?</h2>
            <div className="space-y-2 text-slate-400 max-w-md mx-auto mb-8">
              <p>• Ensure you are in a quiet environment.</p>
              <p>• Speak clearly into your microphone.</p>
              <p>• Takes approx. 5-10 minutes.</p>
            </div>

            <button onClick={startInterview} className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg shadow-lg shadow-blue-600/30 transition-transform hover:scale-105 flex items-center gap-2">
              <Mic size={20} /> Start Interview
            </button>
          </div>
        )}

        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[80%] p-4 rounded-2xl text-lg leading-relaxed shadow-sm ${msg.role === 'assistant'
              ? 'bg-slate-800 text-slate-200 rounded-tl-none border border-slate-700'
              : 'bg-blue-600 text-white rounded-tr-none'
              }`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Footer Controls */}
      {isRecording && (
        <div className="p-4 bg-slate-800 border-t border-slate-700 shrink-0">
          <div className="max-w-3xl mx-auto flex items-center gap-4">
            <div className="flex-1 bg-slate-900 rounded-full px-6 py-4 text-slate-500 flex items-center justify-between border border-slate-700">
              <span>Listening... (Speak your answer clearly)</span>
              <div className="flex gap-1">
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="w-1.5 h-1.5 bg-blue-500 rounded-full animate-bounce"></span>
              </div>
            </div>

            <button
              onClick={() => {
                if (currentQuestionIndex < questions.length) {
                  setMessages(prev => [...prev, { role: 'user', text: "(Answer Recorded)" }]);
                  setTimeout(() => {
                    setMessages(prev => [...prev, { role: 'assistant', text: questions[currentQuestionIndex] }]);
                    setCurrentQuestionIndex(prev => prev + 1);
                  }, 8000); // Artificial delay to simulate thinking/listening
                } else {
                  setMessages(prev => [...prev, { role: 'assistant', text: "Thank you. That was the last question. You may end the interview now." }]);
                }
              }}
              className="bg-blue-600 p-4 rounded-full hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/50"
              title="Submit Answer"
            >
              <Send size={24} className="text-white" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}