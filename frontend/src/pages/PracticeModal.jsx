import React from "react";
// HIGHLIGHT: Import motion
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";


export default function PracticeModal({
  isOpen,
  onClose,
  onStart,
  quizSettings,
  handleSettingsChange,
  availableUnits,
  allQuestions
}) {
  const modalAnim = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.25 } },
    exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } }
  };
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50 p-4"
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={modalAnim}
        >
          <motion.div
            className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md"
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 40, opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <h2 className="text-2xl font-bold text-slate-800 mb-6">Practice Settings</h2>
            <form onSubmit={onStart}>
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
                <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg text-gray-700 bg-gray-200 hover:bg-gray-300 transition font-semibold">Cancel</button>
                <button type="submit" className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700 transition font-semibold shadow-md">Start Quiz</button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
