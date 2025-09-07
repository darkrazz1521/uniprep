import React, { useState, useEffect, useRef } from 'react';
import LoginPage from './pages/LoginPage.jsx';
import RegisterPage from './pages/RegisterPage.jsx';
import SemesterPage from './pages/SemesterPage.jsx';
import QuestionBankPage from './pages/QuestionBankPage.jsx';
import AdminPage from './pages/AdminPage.jsx';

// --- Reusable SVG Icon Components ---
const LogoIcon = () => (
    <svg className="h-8 w-8 text-sky-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 006 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
    </svg>
);
const HamburgerIcon = () => (
    <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-4 6h4" />
    </svg>
);
const TimerIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);
const TestCompleteIcon = () => (
    <svg className="w-24 h-24 text-emerald-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
);

// --- Data ---

// --- Custom Hook for Animations ---
const useIntersectionObserver = (options) => {
    const containerRef = useRef(null);
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, options);
        const container = containerRef.current;
        if (container) {
            Array.from(container.children).forEach(child => observer.observe(child));
        }
        return () => {
            if (container) {
                Array.from(container.children).forEach(child => observer.unobserve(child));
            }
        };
    }, [containerRef, options]);
    return containerRef;
};


// --- Page Components ---

const Header = ({ onNavClick, user, currentPage, handleLogout }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const NavLink = ({ page, children }) => (
    <a
      href="#"
      className={`transition-colors duration-300 ${
        currentPage === page
          ? "active-nav text-sky-500"
          : "text-slate-600 hover:text-sky-500"
      }`}
      onClick={(e) => {
        e.preventDefault();
        onNavClick(page);
        setIsMobileMenuOpen(false);
      }}
    >
      {children}
    </a>
  );

  return (
    <header className="bg-white/90 backdrop-blur-lg sticky top-0 z-50 border-b border-slate-200 shadow-sm">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <a
            href="#"
            className="flex-shrink-0 flex items-center gap-2"
            onClick={(e) => {
              e.preventDefault();
              onNavClick("home");
            }}
          >
            <LogoIcon />
            <span className="text-2xl font-bold text-slate-800">UniPrep</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden md:flex md:items-center md:space-x-8">
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

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                {user?.role !== "admin" && (
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavClick("dashboard");
                    }}
                    className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-300"
                  >
                    Dashboard
                  </a>
                )}
                <button
                  onClick={handleLogout}
                  className="px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 bg-red-500 hover:bg-red-600 transition-all duration-300"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavClick("login");
                  }}
                  className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors duration-300"
                >
                  Login
                </a>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    onNavClick("register");
                  }}
                  className="px-4 py-2 text-sm font-medium text-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 transition-all duration-300 gradient-btn"
                >
                  Register
                </a>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-500 hover:text-slate-700 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-sky-500"
            >
              <HamburgerIcon />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {user?.role === "admin" ? (
                <>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onNavClick("admin");
                      setIsMobileMenuOpen(false);
                    }}
                    className={`block px-3 py-2 rounded-md text-base font-medium ${
                      currentPage === "admin"
                        ? "text-sky-500 bg-slate-100"
                        : "text-slate-700"
                    } hover:text-sky-500 hover:bg-slate-100`}
                  >
                    Admin
                  </a>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-red-500 hover:bg-red-600"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <NavLink page="home">Home</NavLink>
                  <NavLink page="semesters">Semesters</NavLink>
                  <NavLink page="about">About</NavLink>

                  {user ? (
                    <>
                      <NavLink page="dashboard">Dashboard</NavLink>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-white bg-red-500 hover:bg-red-600"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <NavLink page="login">Login</NavLink>
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          onNavClick("register");
                          setIsMobileMenuOpen(false);
                        }}
                        className="block px-3 py-2 rounded-md text-base font-medium text-white bg-sky-500 hover:bg-sky-600"
                      >
                        Register
                      </a>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};


const FeatureCard = ({ icon, title, children, delay }) => (
    <div className="text-center p-6 feature-card" style={{ animationDelay: delay }}>
        <div className="flex items-center justify-center h-16 w-16 rounded-2xl bg-sky-100 text-sky-500 mx-auto mb-4">{icon}</div>
        <h3 className="text-xl font-semibold text-slate-800">{title}</h3>
        <p className="mt-2 text-slate-500">{children}</p>
    </div>
);

const semesterNames = [
    { key: 'semester1', label: 'Semester 1' },
    { key: 'semester2', label: 'Semester 2' },
    { key: 'semester3', label: 'Semester 3' },
    { key: 'semester4', label: 'Semester 4' },
    { key: 'semester5', label: 'Semester 5' },
    { key: 'semester6', label: 'Semester 6' },
    { key: 'semester7', label: 'Semester 7' },
    { key: 'semester8', label: 'Semester 8' }
];

// --- Page Components ---

const HomePage = ({ onNavClick }) => {
    const featuresRef = useIntersectionObserver({ threshold: 0.1 });
    return (
        <section id="home" className="page active relative overflow-hidden">
            {/* Animated floating background */}
            <div className="absolute inset-0 pointer-events-none z-0">
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 blur-2xl opacity-40 animate-float-slow"
                    style={{
                        width: '600px',
                        height: '600px',
                        background: 'radial-gradient(circle at 50% 50%, #0ea5e9 0%, #38bdf8 60%, transparent 100%)'
                    }}
                />
                <div className="absolute bottom-0 right-0 blur-2xl opacity-30 animate-float-fast"
                    style={{
                        width: '400px',
                        height: '400px',
                        background: 'radial-gradient(circle at 50% 50%, #f472b6 0%, #fbbf24 70%, transparent 100%)'
                    }}
                />
            </div>
            <div className="relative z-10 text-center py-20 md:py-28 overflow-hidden rounded-3xl bg-white/80 backdrop-blur-xl shadow-xl border border-slate-100">
                <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(to_bottom,white,transparent)]"></div>
                <div className="relative">
                    <h1 className="text-4xl md:text-6xl font-extrabold text-slate-900 leading-tight">
                        Your Exam{' '}
                        <span className="animated-gradient-text bg-gradient-to-r from-sky-500 via-cyan-400 to-pink-400 text-transparent bg-clip-text">
                            Companion
                        </span>
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-slate-600 max-w-3xl mx-auto">
                        Practice End-Term Questions Semester-wise. Master your subjects and ace your exams with our curated question banks.
                    </p>
                    <div className="mt-8 flex justify-center gap-4">
                        <a
                            href="#"
                            onClick={(e) => { e.preventDefault(); onNavClick('semesters'); }}
                            className="px-8 py-3 font-semibold text-white rounded-lg shadow-lg transition-all duration-300 modern-glow-btn"
                        >
                            Get Started
                        </a>
                    </div>
                </div>
            </div>
            <div className="mt-20">
                <h2 className="text-2xl font-bold text-center text-slate-800 mb-8">Quick Access to Semesters</h2>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                    {semesterNames.map((sem, index) => (
                        <a
                            href="#"
                            key={sem.key}
                            onClick={(e) => { e.preventDefault(); onNavClick(sem.key); }}
                            className="text-center p-4 bg-gradient-to-br from-white via-sky-50 to-cyan-100 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 font-semibold text-slate-700 border border-sky-100 hover:border-sky-400 hover:bg-gradient-to-br hover:from-sky-100 hover:to-cyan-200"
                            style={{ animationDelay: `${index * 60}ms` }}
                        >
                            <span className="block text-lg font-bold text-sky-600 drop-shadow-md">{sem.label}</span>
                        </a>
                    ))}
                </div>
            </div>
            <div className="mt-24 py-16 bg-white/90 rounded-2xl shadow-lg border border-slate-100">
                <div className="text-center mb-12">
                    <h2 className="text-3xl font-bold text-slate-800">Why UniPrep?</h2>
                    <p className="mt-2 text-slate-500">Everything you need, all in one place.</p>
                </div>
                <div ref={featuresRef} className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto px-4">
                    <FeatureCard title="Comprehensive Bank" delay="0s" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-sky-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" /></svg>}>
                        From 1st to 8th semester, find questions for every CSE subject.
                    </FeatureCard>
                    <FeatureCard title="Realistic Practice" delay="0.2s" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>}>
                        Take timed mock tests that mirror the real end-term exam format.
                    </FeatureCard>
                    <FeatureCard title="Track Your Progress" delay="0.4s" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2"><path strokeLinecap="round" strokeLinejoin="round" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>}>
                        Analyze your performance and identify weak topics with our smart dashboard.
                    </FeatureCard>
                </div>
            </div>
            {/* Custom CSS for animations and effects */}
            <style>{`
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
            `}</style>
        </section>
    );
};

const SemestersPage = ({ onNavClick }) => {
    return (
        <section className="page active">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-slate-800">Select a Semester</h1>
                <p className="mt-2 text-slate-500">Choose your semester to view the subjects.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {semesterNames.map((sem, index) => (
                    <a
                        href="#"
                        key={sem.key}
                        onClick={(e) => { e.preventDefault(); onNavClick(sem.key); }}
                        className="text-center p-4 bg-gradient-to-br from-white via-sky-50 to-cyan-100 rounded-lg shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 font-semibold text-slate-700 border border-sky-100 hover:border-sky-400 hover:bg-gradient-to-br hover:from-sky-100 hover:to-cyan-200"
                        style={{ animationDelay: `${index * 60}ms` }}
                    >
                        <span className="block text-lg font-bold text-sky-600 drop-shadow-md">{sem.label}</span>
                    </a>
                ))}
            </div>
        </section>
    );
};

const AboutPage = ({ onNavClick }) => (
    <section className="page active"><div className="bg-white rounded-xl shadow-sm p-8 md:p-12 max-w-4xl mx-auto"><h1 className="text-4xl font-bold text-center text-slate-800">About UniPrep</h1><p className="mt-6 text-slate-600 text-lg leading-relaxed">UniPrep is a dedicated platform designed to help Computer Science and Engineering (CSE) students excel in their end-term examinations. Our mission is to provide a comprehensive, easy-to-use resource for practicing questions that are formatted just like the real exams.</p><p className="mt-4 text-slate-600 text-lg leading-relaxed">We believe that consistent practice is the key to success. That's why we've meticulously organized question banks from the 1st to the 8th semester, covering all core CSE subjects. Whether you're just starting your engineering journey or are in your final year, UniPrep is your ultimate exam companion.</p><div className="mt-8 text-center"><a href="#" onClick={(e) => { e.preventDefault(); onNavClick('home'); }} className="px-8 py-3 font-semibold text-white rounded-lg shadow-lg gradient-btn">Start Practicing</a></div></div></section>
);



const DashboardPage = () => { return <section className="page active"><div className="text-center p-12 bg-white rounded-lg shadow-sm"><h1 className="text-3xl font-bold">Dashboard</h1><p className="mt-2 text-slate-500">This page is under construction.</p></div></section> }
const PracticeTestPage = () => { return <section className="page active"><div className="text-center p-12 bg-white rounded-lg shadow-sm"><h1 className="text-3xl font-bold">Practice Test</h1><p className="mt-2 text-slate-500">This page is under construction.</p></div></section> }

// --- Main App Component ---

export default function App() {
    const [currentPage, setCurrentPage] = useState('home');
    const [pageContext, setPageContext] = useState({});
    const [user, setUser] = useState(null); // Holds selected subject/semester

    // Inside App component
const handleLogout = () => {
    setUser(null);
    setCurrentPage('home');
};
    

    const handleNavClick = (page, context = {}) => {
        window.scrollTo(0, 0);
        if (page === 'question-bank' && context.subject) {
            setPageContext({ subject: context.subject, semester: context.semester });
        }
        setCurrentPage(page);
    };

     
    const handleLoginSuccess = (loggedInUser) => {
  setUser(loggedInUser);

  if (loggedInUser.role === "admin") {
    setCurrentPage("admin");
  } else {
    setCurrentPage("dashboard"); // better than 'home' for normal users
  }
};


    const renderPage = () => {
  switch (currentPage) {
    case 'home': return <HomePage onNavClick={handleNavClick} />;
    case 'semesters': return <SemestersPage onNavClick={handleNavClick} />;
    case 'question-bank':
      return (
        <QuestionBankPage
          subject={pageContext.subject}
          semester={pageContext.semester}
          onNavClick={handleNavClick}
        />
      );
    case 'about': return <AboutPage onNavClick={handleNavClick} />;
    case 'dashboard': return <DashboardPage />;
    case 'practice-test': return <PracticeTestPage />;
    case 'login': 
      return <LoginPage onNavClick={handleNavClick} onLoginSuccess={handleLoginSuccess} />;
    case 'register': return <RegisterPage onNavClick={handleNavClick} />;
    case 'admin': 
      return user?.role === "admin" ? <AdminPage /> : <HomePage onNavClick={handleNavClick} />; 
    
    // ✅ New dynamic semester route
    case 'semester1':
    case 'semester2':
    case 'semester3':
    case 'semester4':
    case 'semester5':
    case 'semester6':
    case 'semester7':
    case 'semester8':
      return <SemesterPage semester={currentPage} onNavClick={handleNavClick} />;
    
    default: return <HomePage onNavClick={handleNavClick} />;
  }
};



    return (
        <>
            <style>{`
                body { font-family: 'Inter', sans-serif; background-color: #f7faff; }
                .active-nav { color: #0284c7; font-weight: 600; }
                .gradient-btn { background-image: linear-gradient(to right, #0ea5e9, #0284c7); transition: all 0.3s ease; }
                .gradient-btn:hover { box-shadow: 0 10px 20px -10px rgba(2, 132, 199, 0.6); transform: translateY(-2px); }
                .bookmark-btn.bookmarked svg { fill: #f59e0b; color: #f59e0b; }
                ::-webkit-scrollbar { width: 8px; } ::-webkit-scrollbar-track { background: #e0f2fe; } ::-webkit-scrollbar-thumb { background: #7dd3fc; border-radius: 10px; } ::-webkit-scrollbar-thumb:hover { background: #0ea5e9; }
                .page { animation: fadeIn 0.5s ease-in-out; }
                @keyframes fadeIn { from { opacity: 0; transform: translateY(15px); } to { opacity: 1; transform: translateY(0); } }
                .animate-in { opacity: 0; transform: translateY(20px); animation: fadeIn 0.5s forwards; }
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
                    {renderPage()}
                </main>
            </div>
        </>
    );
}
                

    

