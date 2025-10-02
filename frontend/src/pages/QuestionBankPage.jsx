import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import QuestionBankHeader from "./QuestionBankHeader.jsx";
import PracticeModal from "./PracticeModal.jsx";
import QuizView from "./QuizView.jsx";
// HIGHLIGHT: Import motion
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";


// --- HELPER FUNCTION ---
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};

// --- MAIN COMPONENT ---
export default function QuestionBankPage({ subject: subjectProp }) {
  // --- STATE MANAGEMENT ---
  const [currentSubject, setCurrentSubject] = useState(null);
  const [allQuestions, setAllQuestions] = useState([]);
  const [availableUnits, setAvailableUnits] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Quiz states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizSettings, setQuizSettings] = useState({ count: 5, difficulty: 'any', unit: 'All' });
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  // --- DATA FETCHING ---

  // Fetch questions whenever the subject prop changes
  useEffect(() => {
    console.log("DEBUG subjectProp:", subjectProp);
    if (!subjectProp) {
      setLoading(false);
      setError("No subject information provided.");
      return;
    }

    setCurrentSubject(subjectProp);

    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        // FIX: Use correct backend route for fetching questions of a subject
        const response = await fetch(`http://localhost:5000/api/questions/subject/${subjectProp._id}`);

        if (!response.ok) throw new Error("Failed to fetch questions");
        const data = await response.json();

        // Extract unique unit numbers
const units = [...new Set(data.map((q) => q.unitNo))].sort((a,b) => a - b);
setAvailableUnits(units);

      setAllQuestions(data);
      

      resetQuiz();
    } catch (err) {
      setError("Could not fetch questions. " + err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchQuestions();
}, [subjectProp]);

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setQuizSettings(prev => ({ ...prev, [name]: name === 'count' ? parseInt(value) : value }));
  };

  const startPracticeQuiz = (e) => {
    e.preventDefault();
    setIsModalOpen(false);

    let filteredQuestions = allQuestions;

    if (quizSettings.unit !== 'All') {
      filteredQuestions = filteredQuestions.filter(q => q.topic === quizSettings.unit);
    }

    if (quizSettings.difficulty !== 'any') {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === quizSettings.difficulty);
    }

    const selectedQuestions = shuffleArray(filteredQuestions).slice(0, quizSettings.count);

    if (selectedQuestions.length === 0) {
      // Use a custom message box instead of alert()
      // For simplicity, this is just a comment. A real implementation would involve a state variable for a modal.
      console.log("No questions found for the selected filters. Please try a different combination.");
      return;
    }

    setPracticeQuestions(selectedQuestions);
    setIsQuizActive(true);
  };

  const selectAnswer = (questionId, optionText) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: optionText }));
  };

  const goToNextQuestion = () => {
    if (currentQuestionIndex < practiceQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    }
  };

  const goToPrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
    }
  };

  const submitQuiz = () => {
    setShowResults(true);
  };

  const resetQuiz = () => {
    setIsModalOpen(false);
    setIsQuizActive(false);
    setShowResults(false);
    setPracticeQuestions([]);
    setCurrentQuestionIndex(0);
    setUserAnswers({});
    setQuizSettings({ count: 5, difficulty: 'any', unit: 'All' });
  };

  // --- Animation Variants ---
  // Remove unused fadeInUp and cardPop

  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen text-slate-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-sky-500 border-t-transparent mr-3"></div>
        Loading...
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="flex items-center justify-center min-h-screen text-red-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <p>Error: {error}</p>
      </motion.div>
    );
  }

  // --- MAIN RENDER ---
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-pink-50 min-h-screen font-sans text-slate-800 relative overflow-x-hidden">
      {/* Animated floating background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div
          className="absolute top-0 left-1/2 transform -translate-x-1/2 blur-2xl opacity-30 animate-float-slow"
          style={{
            width: "600px",
            height: "600px",
            background:
              "radial-gradient(circle at 50% 50%, #0ea5e9 0%, #38bdf8 60%, transparent 100%)",
          }}
        />
        <div
          className="absolute bottom-0 right-0 blur-2xl opacity-20 animate-float-fast"
          style={{
            width: "400px",
            height: "400px",
            background:
              "radial-gradient(circle at 50% 50%, #f472b6 0%, #fbbf24 70%, transparent 100%)",
          }}
        />
      </div>
      <main className="relative z-10 p-4 sm:p-6 md:p-8">
        <div className="max-w-5xl mx-auto">
          <AnimatePresence mode="wait">
            {isQuizActive ? (
              <QuizView
                key={showResults ? "results" : "quiz"}
                showResults={showResults}
                practiceQuestions={practiceQuestions}
                currentQuestionIndex={currentQuestionIndex}
                userAnswers={userAnswers}
                selectAnswer={selectAnswer}
                goToPrevQuestion={goToPrevQuestion}
                goToNextQuestion={goToNextQuestion}
                submitQuiz={submitQuiz}
                resetQuiz={resetQuiz}
              />
            ) : (
              <QuestionBankHeader
                key="main"
                currentSubject={currentSubject}
                allQuestions={allQuestions}
                availableUnits={availableUnits}
                setQuizSettings={setQuizSettings}
                setPracticeQuestions={setPracticeQuestions}
                setIsQuizActive={setIsQuizActive}
                setIsModalOpen={setIsModalOpen}
                quizSettings={quizSettings}
              />
            )}
          </AnimatePresence>
        </div>
      </main>
      <PracticeModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStart={startPracticeQuiz}
        quizSettings={quizSettings}
        handleSettingsChange={handleSettingsChange}
        availableUnits={availableUnits}
        allQuestions={allQuestions}
      />
      {/* Custom CSS for floating background */}
      <style>{`
        @keyframes float-slow {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(30px) scale(1.05); }
          100% { transform: translateY(0) scale(1); }
        }
        @keyframes float-fast {
          0% { transform: translateY(0) scale(1); }
          50% { transform: translateY(-20px) scale(1.03); }
          100% { transform: translateY(0) scale(1); }
        }
        .animate-float-slow { animation: float-slow 8s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 5s ease-in-out infinite; }
      `}</style>
    </div>
  );
}