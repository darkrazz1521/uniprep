import React from "react";
import { BookOpen } from "lucide-react";
// HIGHLIGHT: Import motion
// eslint-disable-next-line no-unused-vars
import { motion } from "framer-motion";


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

export default function QuestionBankHeader({
  currentSubject,
  allQuestions,
  availableUnits,
  setQuizSettings,
  setPracticeQuestions,
  setIsQuizActive,
  setIsModalOpen,
}) {
  const shuffleArray = (array) => [...array].sort(() => Math.random() - 0.5);

  return (
    <motion.div
      key="main"
      initial="hidden"
      animate="visible"
      exit="hidden"
      variants={fadeInUp}
    >
      <motion.div
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-10"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 flex items-center gap-3">
            {currentSubject?.name ? (
              <BookOpen size={36} className="text-sky-500" />
            ) : null}
            {currentSubject?.name || "Loading Subject..."}
          </h1>
          <p className="text-slate-500 mt-1">
            Total of {allQuestions.length} questions available.
          </p>
        </div>
        <motion.button
          onClick={() => setIsModalOpen(true)}
          className="w-full sm:w-auto bg-sky-600 text-white font-bold py-3 px-6 rounded-xl shadow-lg hover:bg-sky-700 transition-transform hover:scale-105 active:scale-100 focus:outline-none focus:ring-4 focus:ring-sky-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Start Practicing
        </motion.button>
      </motion.div>
      <motion.div
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-6 mt-10"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.06 }
          }
        }}
      >
        {availableUnits.map((unit, i) => (
          <motion.div
            key={unit}
            onClick={() => {
              setQuizSettings((prev) => ({ ...prev, unit: unit }));
              setPracticeQuestions(
                shuffleArray(
                  allQuestions.filter((q) => q.unitNo === unit)
                )
              );
              setIsQuizActive(true);
            }}
            className="cursor-pointer bg-white/90 rounded-2xl shadow-md border border-sky-100 p-6 flex items-center justify-center text-lg font-bold text-sky-600 hover:bg-sky-50 hover:scale-105 transition-transform"
            custom={i}
            initial="hidden"
            animate="visible"
            variants={cardPop}
            whileHover={{ scale: 1.07, boxShadow: "0 8px 32px 0 rgba(56,189,248,0.15)" }}
            whileTap={{ scale: 0.97 }}
          >
            Unit {unit}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
