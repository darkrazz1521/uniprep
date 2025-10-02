import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function SemesterPage({ semester }) {
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


    const handleSubjectClick = (subjectId) => {
  navigate(`/semester/${semester._id}/subject/${subjectId}`);
};


    return (
        <section className="page active relative overflow-hidden min-h-screen">
            {/* Hero-style Boxes Background */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                {/* Base grid layer */}
                <div className="absolute inset-0 bg-grid-slate-200 opacity-30 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
                {/* Layer 2 for depth */}
                <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-300 opacity-20 blur-xl"></div>
                {/* Layer 3 floating slight shift */}
                <div className="absolute top-10 left-10 w-full h-full bg-grid-slate-100 opacity-10 blur-2xl animate-float-slow"></div>
            </div>

            {/* Subjects Grid */}
            <div className="relative z-10 container mx-auto px-6 py-12">
                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-4 border-sky-400 border-t-transparent"></div>
                    </div>
                ) : subjects.length > 0 ? (
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {subjects.map((subject) => (
                            <div
                                key={subject._id}
                                onClick={() => handleSubjectClick(subject._id)}
                                className="cursor-pointer p-6 bg-white/80 backdrop-blur-xl rounded-2xl shadow-lg border border-slate-100 hover:shadow-xl transform hover:-translate-y-2 transition-all duration-300 ease-in-out"
                            >
                                <h2 className="text-xl font-semibold text-sky-600 mb-2">{subject.name}</h2>
                                <p className="text-sm text-gray-500 font-mono">Code: {subject.code}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-lg text-gray-500">
                        No subjects found for this semester.
                    </div>
                )}
            </div>

            {/* Floating Animation CSS */}
            <style>{`
        @keyframes float-slow {
          0% { transform: translateY(0) translateX(0); }
          50% { transform: translateY(15px) translateX(10px); }
          100% { transform: translateY(0) translateX(0); }
        }
        .animate-float-slow { animation: float-slow 12s ease-in-out infinite; }
      `}</style>
        </section>
    );
}