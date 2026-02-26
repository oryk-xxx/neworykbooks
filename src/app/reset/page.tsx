'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ResetPasswordPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/reset', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao alterar a senha');
            }

            setSuccess('Senha alterada com sucesso!');
            setTimeout(() => router.push('/login'), 2000);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-[#0a0a0a] border border-neutral-800 rounded-xl shadow-2xl p-8">
                <h1 className="text-2xl font-light mb-2">Reset Password</h1>
                <p className="text-neutral-400 mb-8 text-sm">Enter your new secure password.</p>

                {success && (
                    <div className="bg-green-500/10 border border-green-500/50 text-green-500 text-sm p-3 rounded-md mb-6">
                        {success} Redirecionando...
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-md mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs text-neutral-500 mb-1" htmlFor="password">NEW PASSWORD</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            minLength={8}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-md p-3 text-sm focus:outline-none focus:border-neutral-500 transition-colors"
                            value={formData.password}
                            onChange={handleChange}
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-neutral-500 mb-1" htmlFor="confirmPassword">CONFIRM NEW PASSWORD</label>
                        <input
                            id="confirmPassword"
                            name="confirmPassword"
                            type="password"
                            required
                            minLength={8}
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-md p-3 text-sm focus:outline-none focus:border-neutral-500 transition-colors"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-white text-black font-medium p-3 rounded-md mt-6 hover:bg-neutral-200 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Updating...' : 'Update Password'}
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
