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
                throw new Error(data?.error || 'PIN Validation Failed');
            }

            router.push('/reader');
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
            <div className="w-full max-w-sm oryk-surface p-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <div className="mb-10">
                    <h1 className="text-2xl font-medium tracking-[0.4em] uppercase text-white mb-2">Segurança</h1>
                    <p className="text-[10px] tracking-oryk text-text-meta uppercase">Verificação de Identidade</p>
                </div>

                <p className="text-[11px] tracking-oryk text-white/60 uppercase mb-8 leading-relaxed">
                    Insira o código de 8 dígitos enviado ao seu endereço de email.
                </p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] uppercase tracking-oryk p-4 rounded-xl mb-8">
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
                            className="w-full bg-surface-primary border border-white/[0.08] rounded-2xl p-6 text-center text-3xl tracking-[0.4em] font-mono focus:outline-none focus:border-accent/40 focus:ring-1 focus:ring-accent/40 transition-all placeholder:text-white/5"
                            value={pin}
                            onChange={(e) => setPin(e.target.value.replace(/[^0-9]/g, '').slice(0, 8))}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading || pin.length !== 8}
                        className="oryk-button-accent w-full py-4 text-[11px] uppercase tracking-[0.2em] font-semibold"
                    >
                        {loading ? 'Validando...' : 'Confirmar Acesso →'}
                    </button>
                </form>

                <div className="mt-10 pt-8 border-t border-white/[0.03]">
                    <p className="text-[9px] tracking-oryk text-text-meta uppercase">
                        Não recebeu o código? Verifique sua caixa de spam ou aguarde alguns instantes.
                    </p>
                </div>
            </div>
        </div>
    );
}
