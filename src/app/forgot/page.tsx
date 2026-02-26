'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/forgot', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao processar');
            }

            setSuccess(data.message);
            setEmail('');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-[#0a0a0a] border border-neutral-800 rounded-xl shadow-2xl p-8 text-center">
                <h1 className="text-2xl font-light mb-2">Forgot Password</h1>
                <p className="text-neutral-400 mb-8 text-sm">We'll send you a password reset link.</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-md mb-6">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-green-500/10 border border-green-500/50 text-green-500 text-sm p-3 rounded-md mb-6">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                    <div>
                        <label className="block text-xs text-neutral-500 mb-1" htmlFor="email">EMAIL</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-md p-3 text-sm focus:outline-none focus:border-neutral-500 transition-colors"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-medium p-3 rounded-md mt-6 hover:bg-neutral-200 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Sending...' : 'Send Link'}
                    </button>
                </form>

                <p className="text-neutral-500 text-sm mt-6 text-center">
                    <Link href="/login" className="text-white hover:underline">
                        Back to login
                    </Link>
                </p>
            </div>
        </div>
    );
}
