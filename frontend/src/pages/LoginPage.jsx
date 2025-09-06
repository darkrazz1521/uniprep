import React from 'react';

export default function LoginPage({ onNavClick }) {
    return (
        <section className="page active flex items-center justify-center min-h-[60vh]">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-slate-100">
                <h1 className="text-3xl font-bold text-center text-sky-600 mb-6">Login to UniPrep</h1>
                <form className="space-y-5">
                    <div>
                        <label className="block text-slate-700 font-medium mb-1">Email</label>
                        <input type="email" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-400 outline-none" placeholder="Enter your email" />
                    </div>
                    <div>
                        <label className="block text-slate-700 font-medium mb-1">Password</label>
                        <input type="password" className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-400 outline-none" placeholder="Enter your password" />
                    </div>
                    <button type="submit" className="w-full px-4 py-2 font-semibold text-white rounded-lg shadow-lg gradient-btn mt-2">Login</button>
                </form>
                <div className="mt-6 text-center text-slate-500 text-sm">
                    Don't have an account?{' '}
                    <a href="#" className="text-sky-600 font-semibold hover:underline" onClick={e => { e.preventDefault(); onNavClick('register'); }}>Register</a>
                </div>
            </div>
        </section>
    );
}
