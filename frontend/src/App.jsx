import { Routes, Route } from "react-router-dom";
import React, { useState, useEffect } from "react";
// HIGHLIGHT: Import motion
// eslint-disable-next-line no-unused-vars
import { motion, AnimatePresence } from "framer-motion";

import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import SemesterPage from "./pages/SemesterPage.jsx";
import QuestionBankPage from "./pages/QuestionBankPage.jsx";
import AdminPage from "./pages/AdminPage.jsx";


// --- Reusable SVG Icon Components ---
const LogoIcon = () => (
    <svg
        className="h-8 w-8 text-sky-500"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth="1.5"
        stroke="currentColor"
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 006 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
    </svg>
);

// HIGHLIGHT: Wrap HamburgerIcon in motion.button for animation
const HamburgerIcon = ({ isMobileMenuOpen, onClick }) => (
    <motion.button
        onClick={onClick}
        initial={{ rotate: 0 }}
        animate={{ rotate: isMobileMenuOpen ? 90 : 0 }}
        transition={{ duration: 0.2 }}
        className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
    >
        <svg
            className="block h-6 w-6"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
        >
            {/* Animate path d change for Hamburger/X-icon feel (optional, but professional) */}
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d={isMobileMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-4 6h4"}
            />
        </svg>
    </motion.button>
);


// --- Custom Hook for Animations (Removed as Framer Motion is used) ---
// const useIntersectionObserver = (options) => { ... };

// --- Header ---
const Header = ({ onNavClick, user, currentPage, handleLogout }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const NavLink = ({ page, children }) => (
        // HIGHLIGHT: Use motion.a for hover/tap effects
        <motion.a
            href="#"
            className={`transition-colors duration-300 px-3 py-2 rounded-md text-sm font-medium ${currentPage === page
                ? "active-nav text-sky-500 bg-sky-50/50"
                : "text-slate-600 hover:text-sky-500 hover:bg-slate-50"
                }`}
            onClick={(e) => {
                e.preventDefault();
                onNavClick(page);
                setIsMobileMenuOpen(false);
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
        >
            {children}
        </motion.a>
    );

    return (
        <header className="bg-white/90 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-200 shadow-sm">
            <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Logo */}
                    <a
                        href="#"
                        className="flex-shrink-0 flex items-center gap-2"
                        onClick={(e) => {
                            e.preventDefault();
                            onNavClick("home");
                        }}
                    >
                        {/* HIGHLIGHT: Wrap LogoIcon in motion.div */}
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        >
                            <LogoIcon />
                        </motion.div>
                        <span className="text-2xl font-bold text-slate-800">UniPrep</span>
                    </a>

                    {/* Desktop Nav */}
                    <div className="hidden md:flex md:items-center md:space-x-4">
                        {user?.role === "admin" ? (
                            <NavLink page="admin">Admin</NavLink>
                        ) : (
                            <>
                                <NavLink page="home">Home</NavLink>
                                <NavLink page="semesters">Semesters</NavLink>
                                <NavLink page="about">About</NavLink>
                            </>
                        )}
                    </div>

                    {/* Desktop Auth */}
                    <div className="hidden md:flex items-center gap-2">
                        {user ? (
                            <>
                                {user?.role !== "admin" && (
                                    <NavLink page="dashboard">Dashboard</NavLink>
                                )}
                                {/* HIGHLIGHT: Use motion.button for Logout */}
                                <motion.button
                                    onClick={handleLogout}
                                    className="px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 bg-red-500 hover:bg-red-600 transition-all duration-300"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Logout
                                </motion.button>
                            </>
                        ) : (
                            <>
                                <NavLink page="login">Login</NavLink>
                                {/* HIGHLIGHT: Use motion.a for Register */}
                                <motion.a
                                    href="#"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        onNavClick("register");
                                    }}
                                    className="px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-300 gradient-btn"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Register
                                </motion.a>
                            </>
                        )}
                    </div>

                    {/* Mobile Menu Button - Now uses the updated component */}
                    <div className="md:hidden flex items-center">
                        <HamburgerIcon
                            isMobileMenuOpen={isMobileMenuOpen}
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        />
                    </div>
                </div>

                {/* Mobile Menu */}
                {/* HIGHLIGHT: Use AnimatePresence and motion.div for slide/fade in mobile menu */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="md:hidden px-2 pt-2 pb-3 space-y-1 sm:px-3 overflow-hidden border-t border-slate-100"
                        >
                            {user?.role === "admin" ? (
                                <>
                                    <NavLink page="admin">Admin</NavLink>
                                    <motion.button // HIGHLIGHT: Use motion.button
                                        onClick={() => {
                                            handleLogout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-red-500 hover:bg-red-600"
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        Logout
                                    </motion.button>
                                </>
                            ) : (
                                <>
                                    <NavLink page="home">Home</NavLink>
                                    <NavLink page="semesters">Semesters</NavLink>
                                    <NavLink page="about">About</NavLink>
                                    {user ? (
                                        <>
                                            <NavLink page="dashboard">Dashboard</NavLink>
                                            <motion.button // HIGHLIGHT: Use motion.button
                                                onClick={() => {
                                                    handleLogout();
                                                    setIsMobileMenuOpen(false);
                                                }}
                                                className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-red-500 hover:bg-red-600"
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                Logout
                                            </motion.button>
                                        </>
                                    ) : (
                                        <>
                                            <NavLink page="login">Login</NavLink>
                                            <NavLink page="register">Register</NavLink>
                                        </>
                                    )}
                                </>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </nav>
        </header>
    );
};

// HIGHLIGHT: Updated FeatureCard to use Framer Motion
const FeatureCard = ({ icon, title, children, index }) => (
    <motion.div
        className="text-center p-6 bg-white rounded-xl shadow-lg border border-slate-100 feature-card hover:shadow-2xl transition-shadow"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
    >
        <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-sky-100 text-sky-500 mx-auto mb-4">
            {icon}
        </div>
        <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
        <p className="mt-2 text-slate-500">{children}</p>
    </motion.div>
);

// --- Page Components ---

const HomePage = ({ onNavClick, semesters }) => {
    // const featuresRef = useIntersectionObserver({ threshold: 0.1 }); // REMOVED
    const semesterVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
    };

    return (
        <section id="home" className="page active relative overflow-hidden">
            {/* Animated floating background (Keep CSS animations) */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div
                    className="absolute top-0 left-1/2 transform -translate-x-1/2 blur-2xl opacity-40 animate-float-slow"
                    style={{
                        width: "600px",
                        height: "600px",
                        background:
                            "radial-gradient(circle at 50% 50%, #0ea5e9 0%, #38bdf8 60%, transparent 100%)",
                    }}
                />
                <div
                    className="absolute bottom-0 right-0 blur-2xl opacity-30 animate-float-fast"
                    style={{
                        width: "400px",
                        height: "400px",
                        background:
                            "radial-gradient(circle at 50% 50%, #f472b6 0%, #fbbf24 70%, transparent 100%)",
                    }}
                />
            </div>
            {/* Hero */}
            <div className="relative z-10 text-center py-20 md:py-28 overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border border-slate-100">
                <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
                <div className="relative">
                    {/* HIGHLIGHT: Use motion.h1 for a professional drop-in effect */}
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                        className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight"
                    >
                        Your Exam{" "}
                        <span className="animated-gradient-text bg-gradient-to-r from-sky-500 via-cyan-400 to-pink-400 text-transparent bg-clip-text">
                            Companion
                        </span>
                    </motion.h1>
                    {/* HIGHLIGHT: Use motion.p */}
                    <motion.p
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.5, delay: 0.3 }}
                        className="mt-4 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto"
                    >
                        Practice End-Term Questions Semester-wise. Master your subjects and
                        ace your exams with our curated question banks.
                    </motion.p>
                    {/* HIGHLIGHT: Use motion.div for button entrance */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="mt-8 flex justify-center gap-4"
                    >
                        <a
                            href="#"
                            onClick={(e) => {
                                e.preventDefault();
                                onNavClick("semesters");
                            }}
                            className="px-8 py-3 font-semibold text-white rounded-lg shadow-lg transition-all duration-300 modern-glow-btn"
                        >
                            Get Started
                        </a>
                    </motion.div>
                </div>
            </div>

            {/* Quick Access */}
            <div className="mt-20">
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">
                    Quick Access to Semesters
                </h2>
                {/* HIGHLIGHT: Use motion.div with staggered list variants */}
                <motion.div
                    variants={semesterVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
                >
                    {semesters.map((sem) => (
                        <motion.a
                            variants={itemVariants} // Apply item variant
                            href="#"
                            key={sem._id}
                            onClick={(e) => {
                                e.preventDefault();
                                onNavClick(`semester-${sem.number}`, { semester: sem });
                            }}
                            className="text-center p-4 bg-gradient-to-br from-white via-sky-50 to-cyan-100 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 font-semibold text-slate-700 border border-sky-100 hover:border-sky-400 hover:bg-gradient-to-br hover:from-sky-100 hover:to-cyan-200"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <span className="block text-lg font-bold text-sky-600 drop-shadow-md">
                                {sem.name}
                            </span>
                        </motion.a>
                    ))}
                </motion.div>
            </div>

            {/* Features Section */}
            <div className="mt-24 py-16 bg-white/90 rounded-2xl shadow-lg border border-slate-100">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-800">Why UniPrep?</h2>
                    <p className="mt-2 text-slate-500">Everything you need, all in one place.</p>
                </div>
                {/* HIGHLIGHT: Removed featuresRef and IntersectionObserver. FeatureCard now handles its own animation based on index/delay. */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                    <FeatureCard
                        title="Comprehensive Bank"
                        index={0} // Passed as index for staggered delay
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-sky-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                                />
                            </svg>
                        }
                    >
                        From 1st to 8th semester, find questions for every CSE subject.
                    </FeatureCard>
                    <FeatureCard
                        title="Realistic Practice"
                        index={1} // Passed as index for staggered delay
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-pink-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
                                />
                            </svg>
                        }
                    >
                        Take timed mock tests that mirror the real end-term exam format.
                    </FeatureCard>
                    <FeatureCard
                        title="Track Your Progress"
                        index={2} // Passed as index for staggered delay
                        icon={
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-8 w-8 text-yellow-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth="2"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
                                />
                            </svg>
                        }
                    >
                        Analyze your performance and identify weak topics with our smart
                        dashboard.
                    </FeatureCard>
                </div>
            </div>

            {/* Custom CSS for animations and effects */}
            <style>{`
/* Existing CSS styles remain unchanged */
.animated-gradient-text {
    background-size: 200% 200%;
    animation: gradient-move 3s ease-in-out infinite;
}
@keyframes gradient-move {
    0% { background-position: 0% 50%; }
    50% { background-position: 100% 50%; }
    100% { background-position: 0% 50%; }
}
.modern-glow-btn {
    background-image: linear-gradient(90deg, #0ea5e9 0%, #38bdf8 50%, #f472b6 100%);
    box-shadow: 0 0 20px 0 rgba(56,189,248,0.25), 0 2px 8px 0 rgba(2,132,199,0.10);
    border: none;
    position: relative;
    overflow: hidden;
}
.modern-glow-btn::after {
    content: '';
    position: absolute;
    left: 0; top: 0; right: 0; bottom: 0;
    opacity: 0.2;
    background: radial-gradient(circle, #38bdf8 0%, #f472b6 100%);
    z-index: 0;
    pointer-events: none;
    transition: opacity 0.3s;
}
.modern-glow-btn:hover {
    box-shadow: 0 0 40px 0 rgba(56,189,248,0.35), 0 8px 24px 0 rgba(2,132,199,0.15);
    transform: translateY(-2px) scale(1.03);
}
.modern-glow-btn:active {
    transform: scale(0.98);
}
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

/* REMOVED: .page and .animate-in CSS since Framer Motion handles these */
body { font-family: 'Inter', sans-serif; background-color: #f7faff; }
.active-nav { color: #0284c7; font-weight: 600; }
.gradient-btn { background-image: linear-gradient(to right, #0ea5e9, #0284c7); transition: all 0.3s ease; }
.gradient-btn:hover { box-shadow: 0 10px 20px -10px rgba(2, 132, 199, 0.6); transform: translateY(-2px); }
.bookmark-btn.bookmarked svg { fill: #f59e0b; color: #f59e0b; }
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #e0f2fe; }
::-webkit-scrollbar-thumb { background: #7dd3fc; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #0ea5e9; }
.bg-grid-slate-200 { background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(226 232 240 / 1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e"); }

`}</style>
        </section>
    );
};

const SemestersPage = ({ onNavClick, semesters }) => {
    const semesterVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05,
            },
        },
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.3 } },
    };

    return (
        <section className="page active">
            {/* HIGHLIGHT: Use motion.div for title entrance */}
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="text-center mb-12"
            >
                <h1 className="text-4xl font-bold text-slate-800">Select a Semester</h1>
                <p className="mt-2 text-slate-500">
                    Choose your semester to view the subjects.
                </p>
            </motion.div>
            {/* HIGHLIGHT: Use motion.div with staggered list variants */}
            <motion.div
                variants={semesterVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4"
            >
                {semesters.map((sem) => (
                    <motion.a
                        variants={itemVariants} // Apply item variant
                        href="#"
                        key={sem._id}
                        onClick={(e) => {
                            e.preventDefault();
                            onNavClick(`semester-${sem.number}`, { semester: sem });
                        }}
                        className="text-center p-4 bg-gradient-to-br from-white via-sky-50 to-cyan-100 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 font-semibold text-slate-700 border border-sky-100 hover:border-sky-400 hover:bg-gradient-to-br hover:from-sky-100 hover:to-cyan-200"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="block text-lg font-bold text-sky-600 drop-shadow-md">
                            {sem.name}
                        </span>
                    </motion.a>
                ))}
            </motion.div>
        </section>
    );
};

const AboutPage = ({ onNavClick }) => (
    <section className="page active">
        {/* HIGHLIGHT: Use motion.div for the main content block entrance */}
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="bg-white rounded-xl shadow-sm p-8 md:p-12 max-w-4xl mx-auto"
        >
            <h1 className="text-4xl font-bold text-center text-slate-800">
                About UniPrep
            </h1>
            <p className="mt-6 text-slate-600 text-lg leading-relaxed">
                UniPrep is a dedicated platform designed to help Computer Science and
                Engineering (CSE) students excel in their end-term examinations. Our
                mission is to provide a comprehensive, easy-to-use resource for
                practicing questions that are formatted just like the real exams.
            </p>
            <p className="mt-4 text-slate-600 text-lg leading-relaxed">
                We believe that consistent practice is the key to success. That's why
                we've meticulously organized question banks from the 1st to the 8th
                semester, covering all core CSE subjects. Whether you're just starting
                your engineering journey or are in your final year, UniPrep is your
                ultimate exam companion.
            </p>
            <div className="mt-8 text-center">
                <a
                    href="#"
                    onClick={(e) => {
                        e.preventDefault();
                        onNavClick("home");
                    }}
                    className="px-8 py-3 font-semibold text-white rounded-lg shadow-lg gradient-btn"
                >
                    Start Practicing
                </a>
            </div>
        </motion.div>
    </section>
);

const DashboardPage = () => {
    return (
        <section className="page active">
            <motion.div // HIGHLIGHT: Use motion.div for page content entrance
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center p-12 bg-white rounded-lg shadow-sm"
            >
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="mt-2 text-slate-500">This page is under construction.</p>
            </motion.div>
        </section>
    );
};

const PracticeTestPage = () => {
    return (
        <section className="page active">
            <motion.div // HIGHLIGHT: Use motion.div for page content entrance
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                className="text-center p-12 bg-white rounded-lg shadow-sm"
            >
                <h1 className="text-3xl font-bold">Practice Test</h1>
                <p className="mt-2 text-slate-500">This page is under construction.</p>
            </motion.div>
        </section>
    );
};

// --- Main App Component ---
export default function App() {
    const [currentPage, setCurrentPage] = useState(
        localStorage.getItem("currentPage") || "home"
    );
    const [pageContext, setPageContext] = useState(
        (() => {
            try {
                return JSON.parse(localStorage.getItem("pageContext")) || {};
            } catch {
                return {};
            }
        })()
    );

    const [user, setUser] = useState(null);
    const [semesters, setSemesters] = useState([]);

    // Fetch semesters on component mount
    useEffect(() => {
        const fetchSemesters = async () => {
            try {
                let res = await fetch("http://localhost:5000/api/semesters");
                if (!res.ok) {
                    // fallback if /api/semesters is not available
                    res = await fetch("http://localhost:5000/api/admin/semesters");
                }
                if (!res.ok) throw new Error("Failed to fetch semesters");
                const data = await res.json();
                setSemesters(data);
            } catch (err) {
                console.error("Error fetching semesters:", err);
                setSemesters([]);
            }
        };
        fetchSemesters();
    }, []);

    const handleLogout = () => {
        setUser(null);
        setCurrentPage("home");
        setPageContext({});
        localStorage.removeItem("currentPage");
        localStorage.removeItem("pageContext");
    };


    const handleNavClick = (page, context = {}) => {
        window.scrollTo(0, 0);
        setCurrentPage(page);
        setPageContext(context);
        localStorage.setItem("currentPage", page);
        localStorage.setItem("pageContext", JSON.stringify(context));
    };


    const handleLoginSuccess = (loggedInUser) => {
        setUser(loggedInUser);
        setCurrentPage(loggedInUser.role === "admin" ? "admin" : "dashboard");
    };

    const renderPage = () => {
        switch (currentPage) {
            case "home":
                return <HomePage onNavClick={handleNavClick} semesters={semesters} />;
            case "semesters":
                return (
                    <SemestersPage onNavClick={handleNavClick} semesters={semesters} />
                );
            case "question-bank":
                return (
                    <QuestionBankPage subject={pageContext.subject} semester={pageContext.semester} />


                );
            case "about":
                return <AboutPage onNavClick={handleNavClick} />;
            case "dashboard":
                return <DashboardPage />;
            case "practice-test":
                return <PracticeTestPage />;
            case "login":
                return (
                    <LoginPage
                        onNavClick={handleNavClick}
                        onLoginSuccess={handleLoginSuccess}
                    />
                );
            case "register":
                return <RegisterPage onNavClick={handleNavClick} />;
            case "admin":
                return user?.role === "admin" ? (
                    <AdminPage />
                ) : (
                    <HomePage onNavClick={handleNavClick} semesters={semesters} />
                );
            default:
                // Dynamic semester pages based on the fetched data
                if (currentPage.startsWith("semester-")) {
                    const semNumber = currentPage.split("-")[1];
                    const sem =
                        semesters.find((s) => String(s.number) === semNumber) || pageContext.semester;
                    if (sem) {
                        return <SemesterPage semester={sem} onNavClick={handleNavClick} />;
                    }
                }

                return <HomePage onNavClick={handleNavClick} semesters={semesters} />;
        }
    };

    return (
        <>
            <style>{`
/* HIGHLIGHT: Removed the old fadeIn CSS animation since Framer Motion handles it */
body { font-family: 'Inter', sans-serif; background-color: #f7faff; }
.active-nav { color: #0284c7; font-weight: 600; }
.gradient-btn { background-image: linear-gradient(to right, #0ea5e9, #0284c7); transition: all 0.3s ease; }
.gradient-btn:hover { box-shadow: 0 10px 20px -10px rgba(2, 132, 199, 0.6); transform: translateY(-2px); }
.bookmark-btn.bookmarked svg { fill: #f59e0b; color: #f59e0b; }
::-webkit-scrollbar { width: 8px; }
::-webkit-scrollbar-track { background: #e0f2fe; }
::-webkit-scrollbar-thumb { background: #7dd3fc; border-radius: 10px; }
::-webkit-scrollbar-thumb:hover { background: #0ea5e9; }
.bg-grid-slate-200 { background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32' width='32' height='32' fill='none' stroke='rgb(226 232 240 / 1)'%3e%3cpath d='M0 .5H31.5V32'/%3e%3c/svg%3e"); }
`}</style>
            <div className="antialiased text-slate-800">
                <Header
                    onNavClick={handleNavClick}
                    user={user}
                    handleLogout={handleLogout}
                    currentPage={currentPage}
                />

                <main className="container mx-auto p-4 sm:p-6 lg:p-8">
                    {/* HIGHLIGHT: Use AnimatePresence for page-to-page transitions */}
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentPage} // Key is essential for AnimatePresence to detect a change
                            initial={{ opacity: 0, y: 15 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -15 }}
                            transition={{ duration: 0.4 }}
                            className="relative" // Added relative for page positioning during transition
                        >
                            {renderPage()}
                        </motion.div>
                    </AnimatePresence>
                </main>
            </div>
        </>
    );
}