import React from "react";
import { ChevronLeft, ChevronRight, CheckCircle, XCircle, BookOpen } from "lucide-react";
// HIGHLIGHT: Import motion
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";

export default function QuizView({
  showResults,
  practiceQuestions,
  currentQuestionIndex,
  userAnswers,
  selectAnswer,
  goToPrevQuestion,
  goToNextQuestion,
  submitQuiz,
  resetQuiz
}) {
  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };
  const cardPop = {
    hidden: { opacity: 0, scale: 0.97 },
    visible: i => ({
      opacity: 1,
      scale: 1,
      transition: { delay: i * 0.06, type: "spring", stiffness: 120, damping: 16 }
    })
  };

  if (!showResults) {
    const currentQuestion = practiceQuestions[currentQuestionIndex];
    if (!currentQuestion) return null;
    return (
      <motion.div
        className="w-full max-w-3xl mx-auto mt-10"
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={fadeInUp}
      >
        <motion.div
          className="bg-white/95 p-8 rounded-3xl shadow-xl border border-sky-100 relative"
          initial={{ scale: 0.97, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              <BookOpen size={22} className="text-sky-500" /> Practice Quiz
            </h2>
            <span className="text-xs font-semibold text-sky-600 bg-sky-50 px-3 py-1 rounded-full">
              Q {currentQuestionIndex + 1} / {practiceQuestions.length}
            </span>
          </div>
          <motion.div
            className="mb-6"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-lg text-slate-700 font-semibold">{currentQuestion.text}</p>
          </motion.div>
          <div className="space-y-3 mt-6">
            {currentQuestion.options.map((option, i) => {
              const isSelected = userAnswers[currentQuestion._id] === option.text;
              return (
                <motion.button
                  key={option._id}
                  onClick={() => selectAnswer(currentQuestion._id, option.text)}
                  className={`w-full text-left p-4 rounded-xl border-2 font-medium transition-all duration-200
                    ${isSelected
                      ? 'bg-sky-500 border-sky-600 text-white shadow-lg'
                      : 'bg-slate-50 border-slate-200 hover:bg-sky-50 hover:border-sky-300'}
                  `}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  custom={i}
                  initial="hidden"
                  animate="visible"
                  variants={cardPop}
                >
                  {option.text}
                </motion.button>
              );
            })}
          </div>
        </motion.div>
        <div className="flex justify-between mt-8">
          <motion.button
            onClick={goToPrevQuestion}
            disabled={currentQuestionIndex === 0}
            className="flex items-center gap-2 px-6 py-3 rounded-lg text-white bg-slate-400 hover:bg-slate-500 disabled:bg-slate-200 transition font-semibold shadow-md"
            whileTap={{ scale: 0.97 }}
          >
            <ChevronLeft size={20} /> Prev
          </motion.button>
          {currentQuestionIndex === practiceQuestions.length - 1 ? (
            <motion.button
              onClick={submitQuiz}
              className="px-6 py-3 rounded-lg text-white bg-green-500 hover:bg-green-600 transition font-semibold shadow-md"
              whileTap={{ scale: 0.97 }}
            >
              Submit Quiz
            </motion.button>
          ) : (
            <motion.button
              onClick={goToNextQuestion}
              className="flex items-center gap-2 px-6 py-3 rounded-lg text-white bg-sky-600 hover:bg-sky-700 transition font-semibold shadow-md"
              whileTap={{ scale: 0.97 }}
            >
              Next <ChevronRight size={20} />
            </motion.button>
          )}
        </div>
      </motion.div>
    );
  }

  // Results View
  const score = practiceQuestions.reduce((acc, q) => {
    const correctAnswer = q.options.find(opt => opt.isCorrect)?.text;
    return userAnswers[q._id] === correctAnswer ? acc + 1 : acc;
  }, 0);
  const percentage = practiceQuestions.length > 0 ? ((score / practiceQuestions.length) * 100).toFixed(1) : 0;

  return (
    <motion.div
      className="w-full max-w-3xl mx-auto mt-10"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={fadeInUp}
    >
      <motion.div
        className="bg-white/95 p-8 rounded-3xl shadow-xl text-center border border-sky-100"
        initial={{ scale: 0.97, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <h2 className="text-3xl font-bold text-slate-800 mb-2">Quiz Completed!</h2>
        <p className="text-lg text-slate-600 mb-6">You scored</p>
        <motion.div
          className={`w-32 h-32 rounded-full mx-auto flex items-center justify-center text-4xl font-bold text-white mb-6 ${percentage >= 50 ? 'bg-green-500' : 'bg-red-500'}`}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 180, damping: 12 }}
        >
          {percentage}%
        </motion.div>
        <p className="text-xl font-semibold">{score} out of {practiceQuestions.length} correct</p>
      </motion.div>
      <motion.div
        className="mt-8"
        initial="hidden"
        animate="visible"
        variants={fadeInUp}
      >
        <h3 className="text-2xl font-bold text-slate-800 mb-4">Review Your Answers</h3>
        <div className="space-y-4">
          {practiceQuestions.map((q, index) => {
            const userAnswer = userAnswers[q._id];
            const correctAnswer = q.options.find(opt => opt.isCorrect)?.text;
            const isCorrect = userAnswer === correctAnswer;
            return (
              <motion.div
                key={q._id}
                className="bg-white p-6 rounded-xl shadow-md border"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.04 }}
              >
                <p className="font-semibold text-slate-800 mb-3">Q{index + 1}: {q.text}</p>
                <p className={`flex items-center gap-2 p-3 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                  {isCorrect ? <CheckCircle size={20} /> : <XCircle size={20} />}
                  Your answer: <span className="font-bold">{userAnswer || "Not answered"}</span>
                </p>
                {!isCorrect && (
                  <p className="flex items-center gap-2 p-3 rounded-lg bg-slate-100 text-slate-800 mt-2">
                    <CheckCircle className="text-green-600" size={20} />
                    Correct answer: <span className="font-bold">{correctAnswer}</span>
                  </p>
                )}
              </motion.div>
            );
          })}
        </div>
      </motion.div>
      <div className="text-center mt-10">
        <motion.button
          onClick={resetQuiz}
          className="px-8 py-3 rounded-lg text-white bg-sky-600 hover:bg-sky-700 transition font-semibold shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Try Again
        </motion.button>
      </div>
    </motion.div>
  );
}
