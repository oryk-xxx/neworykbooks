'use client';

import React, { useState } from 'react';
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

            let data: any = {};
            try {
                data = await res.json();
            } catch (e) { }

            if (!res.ok) {
                throw new Error(data?.error || 'Erro ao processar');
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
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-8 text-center">
            <div className="w-full max-w-md oryk-surface p-10 relative overflow-hidden">
                <div className="mb-10 text-center">
                    <h1 className="text-header mb-2 text-primary">Protocol.Recovery</h1>
                    <p className="font-mono text-[9px] tracking-oryk text-text-meta uppercase">Module: Security.Protocol.F2</p>
                </div>

                <p className="font-mono text-[10px] tracking-oryk text-text-secondary uppercase mb-8 leading-relaxed opacity-70">
                    Transmission of authentication link to registered uplink.
                </p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] uppercase tracking-oryk p-4 rounded mb-8">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase tracking-oryk p-4 rounded mb-8">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                    <div className="space-y-2">
                        <label className="text-label" htmlFor="email">
                            Uplink.Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            placeholder="seu@email.com"
                            className="oryk-input"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="oryk-button-accent w-full py-4 text-[10px] uppercase tracking-[0.2em]"
                        >
                            {loading ? 'PROCESSING...' : 'REQUEST UPLINK →'}
                        </button>
                    </div>
                </form>

                <div className="mt-10 pt-8 border-t border-white/[0.06]">
                    <p className="text-[9px] tracking-oryk text-text-meta uppercase">
                        Credential found?{' '}
                        <Link href="/login" className="text-white hover:text-primary transition-colors">
                            Return.Frontier
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
