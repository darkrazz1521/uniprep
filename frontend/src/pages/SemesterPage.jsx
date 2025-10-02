import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";


export default function SemesterPage({ semester, onNavClick }) {
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubjects = async () => {
            try {
                const res = await fetch(`http://localhost:5000/api/subjects/semester/${semester._id}`);
                if (!res.ok) throw new Error("Failed to fetch subjects");
                const data = await res.json();
                setSubjects(data);
            } catch (error) {
                console.error("Error fetching subjects:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubjects();
    }, [semester]);

    const handleSubjectClick = (subject) => {
        if (onNavClick) {
            onNavClick("question-bank", { subject, semester });
        } else {
            navigate(`/semester/${semester._id}/subject/${subject._id}`);
        }
    };

    // Animation variants for cards
    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: { delay: i * 0.07 }
        })
    };

    return (
        <section className="page active relative overflow-hidden min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50">
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
            <main className="relative z-10 max-w-6xl mx-auto px-4 py-12">
                <Motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="mb-12 text-center"
                >
                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-800 mb-2 drop-shadow-sm">
                        {semester.name}
                    </h1>
                    <p className="text-lg text-slate-500">
                        Select a subject to view its question bank.
                    </p>
                </Motion.div>
                <div className="relative z-10">
                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-400 border-t-transparent"></div>
                        </div>
                    ) : subjects.length > 0 ? (
                        <Motion.div
                            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8"
                            initial="hidden"
                            animate="visible"
                            variants={{
                                hidden: {},
                                visible: { transition: { staggerChildren: 0.08 } }
                            }}
                        >
                            {subjects.map((subject, i) => (
                                <Motion.div
                                    key={subject._id}
                                    onClick={() => handleSubjectClick(subject)}
                                    className="cursor-pointer group bg-white/90 rounded-2xl shadow-lg border border-sky-100 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ease-in-out flex flex-col items-center p-8 relative overflow-hidden"
                                    custom={i}
                                    variants={cardVariants}
                                    whileHover={{ scale: 1.045 }}
                                    whileTap={{ scale: 0.97 }}
                                >
                                    <div className="flex items-center justify-center w-16 h-16 rounded-full bg-sky-100 mb-4 shadow-inner">
                                        <svg className="w-8 h-8 text-sky-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6l4 2" />
                                            <circle cx="12" cy="12" r="10" />
                                        </svg>
                                    </div>
                                    <h2 className="text-xl font-bold text-sky-700 mb-1 text-center">{subject.name}</h2>
                                    <p className="text-sm text-slate-500 font-mono mb-2 text-center">Code: {subject.code}</p>
                                    <span className="inline-block mt-2 px-3 py-1 rounded-full bg-sky-50 text-sky-500 text-xs font-semibold tracking-wide group-hover:bg-sky-100 transition">
                                        View Questions
                                    </span>
                                    <div className="absolute inset-0 rounded-2xl pointer-events-none group-hover:ring-2 group-hover:ring-sky-300 transition"></div>
                                </Motion.div>
                            ))}
                        </Motion.div>
                    ) : (
                        <div className="text-center text-lg text-gray-500">
                            No subjects found for this semester.
                        </div>
                    )}
                </div>
            </main>
            {/* Floating Animation CSS */}
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
        </section>
    );
}