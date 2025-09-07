import React, { useState } from 'react';

export default function LoginPage({ onNavClick, onLoginSuccess }) {   // 🔹 added onLoginSuccess
    const [form, setForm] = useState({ email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleLogin = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                console.log('Login response from server:', data);

                // 🔹 NEW: Call App.jsx handler
                if (data.user) {
                    onLoginSuccess(data.user);  
                } else {
                    setError('Invalid response from server.');
                }
            } else {
                setError(data.message || 'Login failed. Please try again.');
            }
        } catch {
            setError('Network error. Could not connect to the server.');
        }
        setLoading(false);
    };

    return (
        <section className="page active flex items-center justify-center min-h-[60vh]">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md w-full border border-slate-100">
                <h1 className="text-3xl font-bold text-center text-sky-600 mb-6">Login to UniPrep</h1>
                <form className="space-y-5" onSubmit={handleLogin}>
                    <div>
                        <label className="block text-slate-700 font-medium mb-1">Email</label>
                        <input 
                            type="email" 
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-400 outline-none" 
                            placeholder="Enter your email" 
                        />
                    </div>
                    <div>
                        <label className="block text-slate-700 font-medium mb-1">Password</label>
                        <input 
                            type="password" 
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-sky-400 outline-none" 
                            placeholder="Enter your password" 
                        />
                    </div>
                    {error && <div className="text-red-600 text-sm text-center">{error}</div>}
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full px-4 py-2 font-semibold text-white rounded-lg shadow-lg gradient-btn mt-2 disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </form>
                <div className="mt-6 text-center text-slate-500 text-sm">
                    Don't have an account?{' '}
                    <a href="#" className="text-sky-600 font-semibold hover:underline" onClick={e => { e.preventDefault(); onNavClick('register'); }}>Register</a>
                </div>
            </div>
        </section>
    );
}
