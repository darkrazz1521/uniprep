import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, BookOpen } from 'lucide-react';

// --- MOCK DATABASE ---
// This would be replaced by API calls in a real application
const mockDB = {
  subjects: [
    { id: 'cs101', name: 'Introduction to C++' },
    { id: 'ma101', name: 'Calculus I' },
    { id: 'phy101', name: 'Fundamentals of Physics' },
  ],
  questions: [
    { id: 1, subjectId: 'cs101', text: 'What is a constructor in C++?', options: ['A function that is called automatically when an object is created', 'A function to delete an object', 'A special variable', 'A type of loop'], correctAnswer: 'A function that is called automatically when an object is created', difficulty: 'Easy', unit: 'OOP Concepts' },
    { id: 2, subjectId: 'cs101', text: 'Which of the following is not a type of inheritance in C++?', options: ['Single', 'Multiple', 'Hierarchical', 'Sequential'], correctAnswer: 'Sequential', difficulty: 'Medium', unit: 'OOP Concepts' },
    { id: 3, subjectId: 'cs101', text: 'What does STL stand for in C++?', options: ['Standard Template Library', 'Static Type Language', 'Simple Task List', 'Standard Type Library'], correctAnswer: 'Standard Template Library', difficulty: 'Easy', unit: 'STL' },
    { id: 4, subjectId: 'cs101', text: 'Polymorphism is achieved through...?', options: ['Function Overloading', 'Virtual Functions', 'Operator Overloading', 'All of the above'], correctAnswer: 'All of the above', difficulty: 'Hard', unit: 'OOP Concepts' },
    { id: 5, subjectId: 'ma101', text: 'What is the derivative of x^2?', options: ['2x', 'x', 'x/2', '2'], correctAnswer: '2x', difficulty: 'Easy', unit: 'Derivatives' },
    { id: 6, subjectId: 'ma101', text: 'What is the integral of 1/x dx?', options: ['ln|x| + C', 'x^2 + C', '1 + C', '-1/x^2 + C'], correctAnswer: 'ln|x| + C', difficulty: 'Medium', unit: 'Integrals' },
    { id: 7, subjectId: 'phy101', text: "What is Newton's second law of motion?", options: ['F = ma', 'E = mc^2', 'PV = nRT', 'V = IR'], correctAnswer: 'F = ma', difficulty: 'Easy', unit: 'Mechanics' },
    { id: 8, subjectId: 'phy101', text: 'What is the unit of electric current?', options: ['Ampere', 'Volt', 'Ohm', 'Watt'], correctAnswer: 'Ampere', difficulty: 'Easy', unit: 'Electromagnetism' },
    { id: 9, subjectId: 'cs101', text: 'How do you declare a pointer in C++?', options: ['int *p;', 'int &p;', 'ptr p;', 'pointer<int> p;'], correctAnswer: 'int *p;', difficulty: 'Medium', unit: 'Pointers & Memory' },
    { id: 10, subjectId: 'ma101', text: 'What is the value of sin(90 degrees)?', options: ['1', '0', '-1', '0.5'], correctAnswer: '1', difficulty: 'Easy', unit: 'Trigonometry' },
  ],
};

// --- HELPER FUNCTION ---
const shuffleArray = (array) => {
  return [...array].sort(() => Math.random() - 0.5);
};


// --- MAIN COMPONENT ---
// Changed to QuestionBankPage and accepting props as you defined
export default function QuestionBankPage({ subject: subjectName }) {
  // --- STATE MANAGEMENT ---
  const [currentSubjectId, setCurrentSubjectId] = useState('cs101');
  const [subjectInfo, setSubjectInfo] = useState({});
  const [allQuestions, setAllQuestions] = useState([]);
  const [availableUnits, setAvailableUnits] = useState([]);
  const [visibleAnswers, setVisibleAnswers] = useState({});
  
  // Quiz states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quizSettings, setQuizSettings] = useState({ count: 5, difficulty: 'Any', unit: 'All' });
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);

  // --- DATA FETCHING & DERIVED STATE ---
  useEffect(() => {
    // If a subject name prop is passed, find its ID and set it as the current subject
    if (subjectName) {
      const foundSubject = mockDB.subjects.find(s => s.name === subjectName);
      if (foundSubject) {
        setCurrentSubjectId(foundSubject.id);
      }
    }
  }, [subjectName]);

  useEffect(() => {
    // This effect runs whenever the currentSubjectId changes
    const subject = mockDB.subjects.find(s => s.id === currentSubjectId);
    const questions = mockDB.questions.filter(q => q.subjectId === currentSubjectId);
    const units = [...new Set(questions.map(q => q.unit))];
    
    setSubjectInfo(subject);
    setAllQuestions(questions);
    setAvailableUnits(units);

    resetQuiz();
  }, [currentSubjectId]);

  // --- HANDLER FUNCTIONS ---
  const toggleAnswer = (questionId) => {
    setVisibleAnswers(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const handleSettingsChange = (e) => {
    const { name, value } = e.target;
    setQuizSettings(prev => ({ ...prev, [name]: name === 'count' ? parseInt(value) : value }));
  };
  
  const startPracticeQuiz = (e) => {
    e.preventDefault();
    setIsModalOpen(false);

    let filteredQuestions = allQuestions;

    if (quizSettings.unit !== 'All') {
      filteredQuestions = filteredQuestions.filter(q => q.unit === quizSettings.unit);
    }
    
    if (quizSettings.difficulty !== 'Any') {
      filteredQuestions = filteredQuestions.filter(q => q.difficulty === quizSettings.difficulty);
    }
    
    const selectedQuestions = shuffleArray(filteredQuestions).slice(0, quizSettings.count);
    
    if (selectedQuestions.length === 0) {
        alert("No questions found for the selected filters. Please try a different combination.");
        return;
    }
      
    setPracticeQuestions(selectedQuestions);
    setIsQuizActive(true);
  };
  
  const selectAnswer = (questionId, answer) => {
      setUserAnswers(prev => ({...prev, [questionId]: answer}));
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
      setQuizSettings({ count: 5, difficulty: 'Any', unit: 'All' });
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
              <option value="All">All Units (Mix-up)</option>
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
              <option value="Any">Any Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
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
                    {currentQuestion.options.map((option, index) => {
                        const isSelected = userAnswers[currentQuestion.id] === option;
                        return (
                            <button 
                                key={index}
                                onClick={() => selectAnswer(currentQuestion.id, option)}
                                className={`w-full text-left p-4 rounded-lg border-2 transition-transform duration-200 ease-in-out hover:scale-[1.02] ${isSelected ? 'bg-blue-500 border-blue-600 text-white shadow-lg' : 'bg-gray-50 border-gray-200 hover:bg-blue-100 hover:border-blue-300'}`}
                            >
                                {option}
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
        return userAnswers[q.id] === q.correctAnswer ? acc + 1 : acc;
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
                        const userAnswer = userAnswers[q.id];
                        const isCorrect = userAnswer === q.correctAnswer;
                        return (
                          <div key={q.id} className="bg-white p-6 rounded-xl shadow-md border">
                              <p className="font-semibold text-gray-800 mb-3">Q{index + 1}: {q.text}</p>
                              <p className={`flex items-center gap-2 p-3 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                  {isCorrect ? <CheckCircle size={20}/> : <XCircle size={20}/>}
                                  Your answer: <span className="font-bold">{userAnswer || "Not answered"}</span>
                              </p>
                              {!isCorrect && (
                                  <p className="flex items-center gap-2 p-3 rounded-lg bg-gray-100 text-gray-800 mt-2">
                                      <CheckCircle className="text-green-600" size={20}/>
                                      Correct answer: <span className="font-bold">{q.correctAnswer}</span>
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

  // --- Main Render for the Component ---
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
                      {subjectInfo?.name ? <BookOpen size={36} className="text-blue-500" /> : null}
                      {subjectInfo?.name || 'Loading Subject...'}
                    </h1>
                    <p className="text-gray-500 mt-1">Total of {allQuestions.length} questions available.</p>
                </div>
                <button onClick={() => setIsModalOpen(true)} className="w-full sm:w-auto bg-blue-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-blue-700 transition-transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-4 focus:ring-blue-300">
                  Start Practicing
                </button>
              </div>

              {/* Question List */}
              <div className="space-y-4">
                {allQuestions.map((q, index) => (
                  <div key={q.id} className="bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
                    <div className="p-6">
                      <div className="flex justify-between items-start gap-4">
                        <p className="text-base sm:text-lg text-gray-700 font-medium flex-1">
                          <span className="font-bold text-blue-600">Q{index + 1}:</span> {q.text}
                        </p>
                        <div className="flex flex-col items-end gap-2">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${q.difficulty === 'Easy' ? 'bg-green-100 text-green-800' : q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>{q.difficulty}</span>
                            <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">{q.unit}</span>
                        </div>
                      </div>
                      <div className="mt-4 space-y-2 text-gray-600">
                        {q.options.map((opt, i) => (
                          <div key={i} className="flex items-center">
                            <span className="font-mono text-sm mr-2 text-gray-500">{String.fromCharCode(65 + i)}:</span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="bg-gray-50 px-6 py-3">
                      {visibleAnswers[q.id] ? (
                        <div className="flex justify-between items-center">
                          <p className="text-green-700 font-semibold">Correct Answer: {q.correctAnswer}</p>
                          <button onClick={() => toggleAnswer(q.id)} className="text-sm font-medium text-blue-600 hover:underline">Hide Answer</button>
                        </div>
                      ) : (
                        <button onClick={() => toggleAnswer(q.id)} className="text-sm font-medium text-blue-600 hover:underline">Show Answer</button>
                      )}
                    </div>
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

