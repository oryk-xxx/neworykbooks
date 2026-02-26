'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MFAPage() {
    const router = useRouter();
    const [pin, setPin] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/mfa', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ pin }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || 'PIN Validation Failed');
            }

            router.push('/reader'); // Ou para /app, dashboard, etc.
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-[#0a0a0a] border border-neutral-800 rounded-xl shadow-2xl p-8 text-center">
                <h1 className="text-2xl font-light mb-2">Authentication</h1>
                <p className="text-neutral-400 mb-8 text-sm">Enter the 6-digit PIN sent to your email.</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-md mb-6">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <input
                            id="pin"
                            name="pin"
                            type="text"
                            required
                            maxLength={6}
                            minLength={6}
                            placeholder="000000"
                            className="w-full bg-neutral-900 border border-neutral-800 rounded-md p-4 text-center text-3xl tracking-[0.5em] font-mono focus:outline-none focus:border-neutral-500 transition-colors placeholder:text-neutral-700"
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, ''))}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || pin.length !== 6}
                        className="w-full bg-white text-black font-medium p-3 rounded-md hover:bg-neutral-200 transition-colors disabled:opacity-50"
                    >
                        {loading ? 'Verifying...' : 'Verify'}
                    </button>
                </form>
            </div>
        </div>
    );
}
