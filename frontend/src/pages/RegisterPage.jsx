import React, { useState } from 'react';

export default function RegisterPage({ onNavClick }) {
    const [form, setForm] = useState({ name: '', email: '', password: '' });
    const [loading, setLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [error, setError] = useState('');
    const [showOtpModal, setShowOtpModal] = useState(false);

    const handleChange = e => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleRegister = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(form)
            });
            const data = await res.json();
            if (res.ok) {
                setShowOtpModal(true);
            } else {
                setError(data.message || 'Registration failed');
            }
        } catch {
            setError('Network error');
        }
        setLoading(false);
    };

    const handleVerifyOtp = async e => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const res = await fetch('http://localhost:5000/api/auth/verify-otp', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: form.email, otp })
            });
            const data = await res.json();
            if (res.ok) {
                setShowOtpModal(false);
                onNavClick('home');
            } else {
                setError(data.message || 'OTP verification failed');
            }
        } catch {
            setError('Network error');
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-sky-50 via-white to-cyan-100 font-sans">
            <div className="w-full max-w-md p-8 rounded-2xl shadow-xl border border-sky-100 bg-white">
                <h2 className="text-3xl font-bold text-sky-700 mb-6 text-center">Register</h2>
                <form className="space-y-6" onSubmit={handleRegister}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={form.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-sky-200 bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-sky-200 bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 rounded-lg border border-sky-200 bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                    />
                    {error && !showOtpModal && <div className="text-red-600 text-sm text-center">{error}</div>}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 rounded-lg text-white bg-sky-600 hover:bg-sky-700 font-semibold transition"
                    >
                        {loading ? 'Submitting...' : 'Register'}
                    </button>
                </form>
            </div>
            {showOtpModal && (
                <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
                    <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-sm">
                        <h3 className="text-xl font-bold text-sky-700 mb-4 text-center">Enter OTP</h3>
                        <p className="text-center text-gray-600 mb-4">An OTP has been sent to {form.email}.</p>
                        <form onSubmit={handleVerifyOtp} className="space-y-4">
                            <input
                                type="text"
                                placeholder="Enter OTP"
                                value={otp}
                                onChange={e => setOtp(e.target.value)}
                                required
                                className="w-full px-4 py-3 rounded-lg border border-sky-200 bg-sky-50 focus:outline-none focus:ring-2 focus:ring-sky-500"
                            />
                            {error && <div className="text-red-600 text-sm text-center">{error}</div>}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-3 px-4 rounded-lg text-white bg-sky-600 hover:bg-sky-700 font-semibold transition"
                            >
                                {loading ? 'Verifying...' : 'Verify OTP'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

