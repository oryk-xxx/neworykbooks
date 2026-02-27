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
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="w-full max-w-lg oryk-surface p-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="mb-10 text-center">
                    <h1 className="text-2xl font-medium tracking-[0.4em] uppercase text-white mb-2">ØRYK</h1>
                    <p className="text-[10px] tracking-oryk text-text-meta uppercase">Criação de Identidade</p>
                </div>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] uppercase tracking-oryk p-4 rounded-xl mb-8 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-[9px] uppercase tracking-[0.2em] text-text-meta font-medium ml-1" htmlFor="username">
                                Username
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
                            <label className="text-[9px] uppercase tracking-[0.2em] text-text-meta font-medium ml-1" htmlFor="email">
                                Email
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
                            <label className="text-[9px] uppercase tracking-[0.2em] text-text-meta font-medium ml-1" htmlFor="password">
                                Senha
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
                            <label className="text-[9px] uppercase tracking-[0.2em] text-text-meta font-medium ml-1" htmlFor="confirmPassword">
                                Confirmar Senha
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
                            className="oryk-button-accent w-full py-4 text-[11px] uppercase tracking-[0.2em] font-semibold"
                        >
                            {loading ? 'Processando Registro...' : 'Finalizar Cadastro →'}
                        </button>
                    </div>
                </form>

                <div className="mt-10 pt-8 border-t border-white/[0.03] text-center">
                    <p className="text-[10px] tracking-oryk text-text-meta uppercase">
                        Já possui uma conta?{' '}
                        <Link href="/login" className="text-white hover:text-accent transition-colors">
                            Entrar no Sistema
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
