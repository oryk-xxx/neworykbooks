'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        username: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            let data: any = {};
            try {
                data = await res.json();
            } catch (e) { }

            if (!res.ok) {
                throw new Error(data.error || 'Erro ao registrar');
            }

            router.push('/login?ok=created');
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
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-8">
            <div className="w-full max-w-2xl oryk-surface p-10 relative overflow-hidden">
                <div className="mb-10 text-center">
                    <h1 className="text-header mb-2 text-primary">Identity.Creation</h1>
                    <p className="font-mono text-[9px] tracking-oryk text-text-meta uppercase">Module: Security.Protocol.R1</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] uppercase tracking-oryk p-4 rounded mb-8 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-label" htmlFor="username">
                                Username.Token
                            </label>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                required
                                pattern="[a-zA-Z0-9_]{3,20}"
                                title="3-20 caracteres (letras, números, underscore)"
                                placeholder="nomedeusuario"
                                className="oryk-input"
                                value={formData.username}
                                onChange={handleChange}
                            />
                        </div>
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
                                value={formData.email}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-label" htmlFor="password">
                                Security.Hash
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                required
                                minLength={8}
                                placeholder="••••••••"
                                className="oryk-input"
                                value={formData.password}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-label" htmlFor="confirmPassword">
                                Confirm.Hash
                            </label>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                required
                                minLength={8}
                                placeholder="••••••••"
                                className="oryk-input"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="oryk-button-accent w-full py-4 text-[10px] uppercase tracking-[0.2em]"
                        >
                            {loading ? 'PROCESSING REGISTRATION...' : 'FINALIZE IDENTITY →'}
                        </button>
                    </div>
                </form>

                <div className="mt-10 pt-8 border-t border-white/[0.06] text-center">
                    <p className="text-[9px] tracking-oryk text-text-meta uppercase">
                        Already have access?{' '}
                        <Link href="/login" className="text-white hover:text-primary transition-colors">
                            Authenticate.Terminal
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
