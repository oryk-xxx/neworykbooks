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
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="w-full max-w-md oryk-surface p-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="mb-10">
                    <h1 className="text-2xl font-medium tracking-[0.4em] uppercase text-white mb-2">Recuperação</h1>
                    <p className="text-[10px] tracking-oryk text-text-meta uppercase">Redefinição de Chave</p>
                </div>

                <p className="text-[11px] tracking-oryk text-white/60 uppercase mb-8 leading-relaxed">
                    Enviaremos um link de autenticação para o seu endereço de email.
                </p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] uppercase tracking-oryk p-4 rounded-xl mb-8">
                        {error}
                    </div>
                )}

                {success && (
                    <div className="bg-accent/10 border border-accent/20 text-accent text-[11px] uppercase tracking-oryk p-4 rounded-xl mb-8">
                        {success}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6 text-left">
                    <div className="space-y-2">
                        <label className="text-[9px] uppercase tracking-[0.2em] text-text-meta font-medium ml-1" htmlFor="email">
                            Endereço de Email
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
                            className="oryk-button-accent w-full py-4 text-[11px] uppercase tracking-[0.2em] font-semibold"
                        >
                            {loading ? 'Processando...' : 'Solicitar Link →'}
                        </button>
                    </div>
                </form>

                <div className="mt-10 pt-8 border-t border-white/[0.03]">
                    <p className="text-[10px] tracking-oryk text-text-meta uppercase">
                        Lembrou sua chave?{' '}
                        <Link href="/login" className="text-white hover:text-accent transition-colors">
                            Voltar ao Início
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
