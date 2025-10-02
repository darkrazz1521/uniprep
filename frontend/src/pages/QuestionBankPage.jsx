import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, BookOpen } from 'lucide-react';




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
      const response = await fetch(`http://localhost:5000/api/questions/${subjectProp._id}`);

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

  // --- RENDER LOGIC ---

  const PracticeModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md transform transition-all scale-100 opacity-100">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Practice Settings</h2>
        <form onSubmit={startPracticeQuiz}>
          <div className="mb-5">
            <label htmlFor="unit" className="block text-sm font-medium text-gray-700 mb-2">Unit / Topic</label>
            <select
              id="unit"
              name="unit"
              value={quizSettings.unit}
              onChange={handleSettingsChange}
              className="w-full p-3 bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="All">All Topics (Mix-up)</option>
              {availableUnits.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
          <div className="mb-5">
            <label htmlFor="difficulty" className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
            <select
              id="difficulty"
              name="difficulty"
              value={quizSettings.difficulty}
              onChange={handleSettingsChange}
              className="w-full p-3 bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="any">Any Difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>
          <div className="mb-6">
            <label htmlFor="count" className="block text-sm font-medium text-gray-700 mb-2">Number of Questions</label>
            <select
              id="count"
              name="count"
              value={quizSettings.count}
              onChange={handleSettingsChange}
              className="w-full p-3 bg-gray-100 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value={allQuestions.length}>All ({allQuestions.length})</option>
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <button type="button" onClick={() => setIsModalOpen(false)} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition font-semibold">Cancel</button>
            <button type="submit" className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition font-semibold shadow-md">Start Quiz</button>
          </div>
        </form>
      </div>
    </div>
  );

  const QuizView = () => {
    const currentQuestion = practiceQuestions[currentQuestionIndex];
    if (!currentQuestion) return null; // Defensive check
    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold text-gray-800">Practice Quiz</h2>
            <span className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              Question {currentQuestionIndex + 1} of {practiceQuestions.length}
            </span>
          </div>
          <div className="mb-6">
            <p className="text-lg text-gray-700">{currentQuestion.text}</p>
          </div>
          <div className="space-y-3">
            {currentQuestion.options.map((option) => {
              const isSelected = userAnswers[currentQuestion._id] === option.text;
              return (
                <button
                  key={option._id}
                  onClick={() => selectAnswer(currentQuestion._id, option.text)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-transform duration-200 ease-in-out hover:scale-[1.02] ${isSelected ? 'bg-blue-500 border-blue-600 text-white shadow-lg' : 'bg-gray-50 border-gray-200 hover:bg-blue-100 hover:border-blue-300'}`}
                >
                  {option.text}
                </button>
              );
            })}
          </div>
        </div>
        <div className="flex justify-between mt-8">
          <button
            onClick={goToPrevQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-white bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 transition font-semibold shadow-md">
            <ChevronLeft size={20} /> Prev
          </button>
          {currentQuestionIndex === practiceQuestions.length - 1 ? (
            <button onClick={submitQuiz} className="px-6 py-3 rounded-lg text-white bg-green-600 hover:bg-green-700 transition font-semibold shadow-md">Submit Quiz</button>
          ) : (
            <button
              onClick={goToNextQuestion}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition font-semibold shadow-md">
              Next <ChevronRight size={20} />
            </button>
          )}
        </div>
      </div>
    );
  };

  const ResultsView = () => {
    const score = practiceQuestions.reduce((acc, q) => {
      const correctAnswer = q.options.find(opt => opt.isCorrect)?.text;
      return userAnswers[q._id] === correctAnswer ? acc + 1 : acc;
    }, 0);
    const percentage = practiceQuestions.length > 0 ? ((score / practiceQuestions.length) * 100).toFixed(1) : 0;

    return (
      <div className="w-full max-w-4xl mx-auto mt-8">
        <div className="bg-white p-8 rounded-2xl shadow-xl text-center border border-gray-100">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Quiz Completed!</h2>
          <p className="text-lg text-gray-600 mb-6">You scored</p>
          <div className={`w-40 h-40 rounded-full mx-auto flex items-center justify-center text-4xl font-bold text-white mb-6 ${percentage >= 50 ? 'bg-green-500' : 'bg-red-500'}`}>
            {percentage}%
          </div>
          <p className="text-xl font-semibold">{score} out of {practiceQuestions.length} correct</p>
        </div>

        <div className="mt-8">
          <h3 className="text-2xl font-bold text-gray-800 mb-4">Review Your Answers</h3>
          <div className="space-y-4">
            {practiceQuestions.map((q, index) => {
              const userAnswer = userAnswers[q._id];
              const correctAnswer = q.options.find(opt => opt.isCorrect)?.text;
              const isCorrect = userAnswer === correctAnswer;
              return (
                <div key={q._id} className="bg-white p-6 rounded-xl shadow-md border">
                  <p className="font-semibold text-gray-800 mb-3">Q{index + 1}: {q.text}</p>
                  <p className={`flex items-center gap-2 p-3 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
                    Your answer: <span className="font-bold">{userAnswer || "Not answered"}</span>
                  </p>
                  {!isCorrect && (
                    <p className="flex items-center gap-2 p-3 rounded-lg bg-gray-100 text-gray-800 mt-2">
                      <CheckCircle className="text-green-600" size={20} />
                      Correct answer: <span className="font-bold">{correctAnswer}</span>
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="text-center mt-10">
          <button onClick={resetQuiz} className="px-8 py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition font-semibold shadow-lg">Try Again</button>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        <div className="animate-spin h-8 w-8 rounded-full border-4 border-blue-500 border-t-transparent mr-3"></div>
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <p>Error: {error}</p>
      </div>
    );
  }

  // Main Render for the Component
  // --- MAIN RENDER ---
return (
  <div className="bg-gray-50 min-h-screen font-sans text-gray-800">
    <main className="p-4 sm:p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {isQuizActive ? (
          showResults ? <ResultsView /> : <QuizView />
        ) : (
          <>
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 flex items-center gap-3">
                  {currentSubject?.name ? (
                    <BookOpen size={36} className="text-blue-500" />
                  ) : null}
                  {currentSubject?.name || "Loading Subject..."}
                </h1>
                <p className="text-gray-500 mt-1">
                  Total of {allQuestions.length} questions available.
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(true)}
                className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-blue-700 transition-transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-4 focus:ring-blue-300"
              >
                Start Practicing
              </button>
            </div>

            {/* Unit Grid Section */}
<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 mt-10">
  {availableUnits.map((unit) => (
    <div
      key={unit}
      onClick={() => {
        setQuizSettings({ ...quizSettings, unit: unit });
        setPracticeQuestions(
  shuffleArray(
    allQuestions.filter((q) => q.unitNo === unit)
  )
);

        setIsQuizActive(true);
      }}
      className="cursor-pointer bg-white rounded-2xl shadow-md border border-gray-100 p-6 flex items-center justify-center text-lg font-bold text-blue-600 hover:bg-blue-50 hover:scale-105 transition-transform"
    >
      Unit {unit} {/* you can also show "Unit {index+1}" if you want */}
    </div>
  ))}
</div>

          </>
        )}
      </div>
    </main>

    {isModalOpen && <PracticeModal />}
  </div>
);

}