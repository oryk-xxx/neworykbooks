'use client';

import React, { useState } from 'react';
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

            let data: any = {};
            try {
                data = await res.json();
            } catch (e) { }

            if (!res.ok) {
                throw new Error(data?.error || 'Validação do PIN falhou');
            }

            router.push('/reader');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-8">
            <div className="w-full max-w-sm oryk-surface p-10 text-center relative overflow-hidden">
                <div className="mb-10">
                    <h1 className="text-header mb-2 text-primary">Verificar.Identidade</h1>
                    <p className="font-mono text-[9px] tracking-oryk text-text-meta uppercase">Módulo: Segurança.MFA.V3</p>
                </div>

                <p className="font-mono text-[10px] tracking-oryk text-text-secondary uppercase mb-8 leading-relaxed opacity-70">
                    Digite a sequência temporal de 8 dígitos transmitida para seu canal.
                </p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] uppercase tracking-oryk p-4 rounded mb-8">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div>
                        <input
                            id="pin"
                            name="pin"
                            type="text"
                            required
                            maxLength={8}
                            minLength={8}
                            placeholder="00000000"
                            className="oryk-input text-center text-3xl tracking-[0.4em] p-6"
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 8))}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || pin.length !== 8}
                        className="oryk-button-accent w-full py-4 text-[10px] uppercase tracking-[0.2em]"
                    >
                        {loading ? 'VALIDANDO SEQUÊNCIA...' : 'CONFIRMAR ACESSO →'}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-white/[0.06]">
                    <p className="text-[9px] tracking-oryk text-text-meta uppercase opacity-50">
                        Tempo esgotado? Verifique os filtros de spam do seu canal ou aguarde o reenvio.
                    </p>
                </div>
            </div>
        </div>
    );
}
