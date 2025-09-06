import React from 'react';

const subjects = [
    { code: 'MTH174', name: 'ENGINEERING MATHEMATICS' },
    { code: 'CSE111', name: 'ORIENTATION TO COMPUTING-I' },
    { code: 'CHE110', name: 'ENVIRONMENTAL STUDIES' },
    { code: 'INT108', name: 'PYTHON PROGRAMMING' },
    { code: 'CSE326', name: 'INTERNET PROGRAMMING LABORATORY' }
];

export default function Semester2Page({ onNavClick }) {
    return (
        <section className="page active">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-800">Semester 2 Subjects</h1>
                <p className="mt-2 text-slate-500">Explore your subjects for Semester 2.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {subjects.map((subject, index) => (
                    <div key={subject.code} className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg cursor-pointer transition-all duration-300 flex flex-col items-center justify-center text-center animate-in" style={{ animationDelay: `${index * 50}ms` }}>
                        <div className="h-16 w-16 mb-4 rounded-full bg-sky-100 flex items-center justify-center">
                            <span className="text-2xl font-bold text-sky-600">{subject.code}</span>
                        </div>
                        <h3 className="text-xl font-bold text-slate-800">{subject.name}</h3>
                    </div>
                ))}
            </div>
            <div className="mt-8 text-center">
                <button onClick={() => onNavClick('home')} className="px-6 py-2 font-semibold text-white rounded-lg shadow-lg gradient-btn">Back to Home</button>
            </div>
        </section>
    );
}
