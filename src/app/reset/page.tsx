'use client';

import React, { useState } from 'react';
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

            let data: any = {};
            try {
                data = await res.json();
            } catch (e) { }

            if (!res.ok) {
                throw new Error(data?.error || 'Erro ao alterar a senha');
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
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-8">
            <div className="w-full max-w-md oryk-surface p-10 relative overflow-hidden">
                <div className="mb-10 text-center">
                    <h1 className="text-header mb-2 text-primary">Redefinir.Segurança</h1>
                    <p className="font-mono text-[9px] tracking-oryk text-text-meta uppercase">Módulo: Protocolo.Segurança.RS</p>
                </div>

                {success && (
                    <div className="bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase tracking-oryk p-4 rounded mb-8 text-center ring-1 ring-primary/20">
                        {success} Redirecionando...
                    </div>
                )}

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] uppercase tracking-oryk p-4 rounded mb-8 text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-label" htmlFor="password">
                            Novo.Hash.Segurança
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
                            Confirmar.Hash
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

                    <div className="pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="oryk-button-accent w-full py-4 text-[10px] uppercase tracking-[0.2em]"
                        >
                            {loading ? 'PROCESSANDO...' : 'ATUALIZAR HASH →'}
                        </button>
                    </div>
                </form>

                <div className="mt-10 pt-8 border-t border-white/[0.06] text-center">
                    <p className="text-[9px] tracking-oryk text-text-meta uppercase">
                        Abortar Protocolo?{' '}
                        <Link href="/login" className="text-white hover:text-primary transition-colors">
                            Retornar.Login
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
