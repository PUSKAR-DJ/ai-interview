import { useState, useEffect } from "react";
import { startInterview, submitInterview } from "../api/interview.api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./useAuth"; // Import useAuth

export function useInterview() {
  const { refreshUser } = useAuth(); // Get the refresh function
  const [interview, setInterview] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initSession = async () => {
      try {
        setLoading(true);
        const response = await startInterview();
        const data = response.data;
        setInterview(data);
        setQuestions(data.questions || []);
      } catch (err) {
        console.error("Failed to start interview:", err);
        setError("Could not initialize interview session.");
      } finally {
        setLoading(false);
      }
    };

    initSession();
  }, []);

  const handleAnswerChange = (val) => {
    const updated = [...questions];
    updated[currentIndex] = { ...updated[currentIndex], answerText: val };
    setQuestions(updated);
  };

  const nextQuestion = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex(prev => prev + 1);
  };

  const prevQuestion = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const finishInterview = async () => {
    if (!window.confirm("Are you sure you want to submit your interview?")) return;
    
    setSubmitting(true);
    try {
      await submitInterview({ questions });
      
      // FIX: Refresh the user profile so the app knows we are COMPLETED
      await refreshUser(); 
      
      navigate("/app/result");
    } catch (err) {
      alert("Failed to submit. Please try again.");
      setSubmitting(false);
    }
  };

  return {
    questions,
    currentQuestion: questions[currentIndex],
    currentIndex,
    totalQuestions: questions.length,
    handleAnswerChange,
    nextQuestion,
    prevQuestion,
    finishInterview,
    loading,
    submitting,
    error
  };
}