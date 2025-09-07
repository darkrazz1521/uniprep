// pages/SemesterPage.jsx
import React from "react";
import QuestionBankPage from "./QuestionBankPage.jsx";

export default function SemesterPage({ semester, onNavClick }) {
  // Example subject list (replace with backend data later)
  const subjects = {
    semester1: ["Maths 1", "Physics", "Programming in C"],
    semester2: ["Maths 2", "Electronics", "Data Structures"],
    semester3: ["DBMS", "OOPS", "Computer Networks"],
    semester4: ["Operating Systems", "Theory of Computation"],
    semester5: ["Compiler Design", "AI", "ML"],
    semester6: ["Cloud Computing", "Software Engg"],
    semester7: ["Cybersecurity", "Big Data"],
    semester8: ["Project Work", "Seminar"]
  };

  const currentSubjects = subjects[semester] || [];

  return (
    <section className="page active">
      <h1 className="text-3xl font-bold text-slate-800 text-center mb-6">
        {semester.toUpperCase()} Subjects
      </h1>
      <div className="grid md:grid-cols-3 gap-4">
        {currentSubjects.map((subject, index) => (
          <a
            key={index}
            href="#"
            onClick={(e) => {
              e.preventDefault();
              onNavClick("question-bank", { subject, semester });
            }}
            className="p-4 bg-white shadow rounded-lg hover:shadow-lg hover:-translate-y-1 transition-all border border-sky-100 hover:border-sky-400"
          >
            {subject}
          </a>
        ))}
      </div>
    </section>
  );
}
