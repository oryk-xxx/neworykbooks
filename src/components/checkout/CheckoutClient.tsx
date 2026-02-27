"use client";

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface CheckoutClientProps {
    user: any;
    hasAccess: boolean;
    initialPayment?: any;
}

export default function CheckoutClient({ user, hasAccess, initialPayment }: CheckoutClientProps) {
    const [payment, setPayment] = useState(initialPayment);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [copied, setCopied] = useState(false);
    const [approved, setApproved] = useState(false);

    // Poll for status if we have a pending payment
    useEffect(() => {
        if (!payment || payment.status === "approved" || approved) return;

        const interval = setInterval(async () => {
            try {
                const res = await fetch(`/api/payment/status?id=${payment.id}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.status === "approved") {
                        setApproved(true);
                        setPayment((prev: any) => ({ ...prev, status: "approved" }));
                        clearInterval(interval);
                    }
                }
            } catch (err) {
                console.error("Error polling payment status:", err);
            }
        }, 10000);

        return () => clearInterval(interval);
    }, [payment, approved]);

    const handleGeneratePix = async () => {
        setLoading(true);
        setError("");
        try {
            const res = await fetch("/api/payment/create", { method: "POST" });
            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Falha ao gerar PIX");
            setPayment(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const copyToClipboard = () => {
        if (!payment?.qr_code) return;
        navigator.clipboard.writeText(payment.qr_code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    if (!user) {
        return (
            <div className="oryk-surface p-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <p className="mb-6 text-text-secondary tracking-oryk uppercase text-[11px]">
                    Identificação necessária para transação.
                </p>
                <Link
                    href="/login?redirectTo=/checkout"
                    className="oryk-button-primary w-full py-4 text-[10px] uppercase tracking-[0.2em] font-medium"
                >
                    Autenticar-se →
                </Link>
            </div>
        );
    }

    if (hasAccess || approved) {
        return (
            <div className="oryk-surface p-10 text-center border-accent/20 animate-in fade-in zoom-in duration-700">
                <div className="flex justify-center mb-6">
                    <div className="h-2 w-2 rounded-full bg-accent shadow-[0_0_15px_rgba(43,255,136,0.6)]" />
                </div>
                <h2 className="text-xl font-medium tracking-[0.3em] uppercase mb-2">Acesso Liberado</h2>
                <p className="text-[10px] text-text-secondary tracking-oryk uppercase mb-10">
                    Sua licença vitalícia está ativa
                </p>
                <Link
                    href="/reader"
                    className="oryk-button-accent w-full py-4 text-[10px] uppercase tracking-[0.2em] font-semibold"
                >
                    Entrar na Biblioteca
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {!payment ? (
                <div className="oryk-surface p-10 text-center">
                    <h2 className="text-xl font-medium tracking-[0.3em] uppercase mb-8">Licença Vitalícia</h2>
                    <div className="flex items-center justify-center gap-3 mb-10">
                        <span className="text-5xl font-medium text-white tracking-tighter">R$ 7</span>
                        <span className="text-text-secondary text-[10px] uppercase tracking-oryk mt-2">pagamento único</span>
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] p-4 rounded-xl mb-6 uppercase tracking-oryk">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handleGeneratePix}
                        disabled={loading}
                        className="w-full oryk-button-accent py-5 text-[11px] uppercase tracking-[0.2em] font-bold"
                    >
                        {loading ? "Processando..." : "Gerar Código PIX →"}
                    </button>

                    <p className="mt-8 text-[9px] text-text-meta uppercase tracking-[0.2em] leading-relaxed opacity-50">
                        Ativação instantânea após confirmação bancária
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="oryk-surface p-8">
                        <div className="flex flex-col items-center">
                            <div className="mb-10 rounded-3xl bg-white p-5 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)] ring-1 ring-white/10">
                                <QRCodeSVG value={payment.qr_code} size={220} level="M" />
                            </div>

                            <div className="w-full space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[9px] uppercase tracking-[0.2em] text-text-meta px-1 font-medium">
                                        PIX Copia e Cola
                                    </label>
                                    <div className="group relative">
                                        <input
                                            readOnly
                                            value={payment.qr_code}
                                            className="oryk-input pr-14 text-[11px] font-mono truncate border-white/[0.08] bg-black/40"
                                        />
                                        <button
                                            onClick={copyToClipboard}
                                            className="absolute right-2 top-1/2 -translate-y-1/2 p-2.5 text-text-secondary hover:text-accent transition-all duration-300"
                                        >
                                            {copied ? <CheckCircle2 size={18} className="text-accent" /> : <Copy size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <a
                                        href={payment.ticket_url || "#"}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full h-14 flex items-center justify-center bg-white/[0.03] border border-white/[0.08] rounded-2xl text-[10px] uppercase tracking-[0.2em] hover:bg-white/[0.06] transition-all"
                                    >
                                        Ver detalhes no Mercado Pago
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="oryk-surface p-6 text-center border-accent/10">
                        <div className="flex justify-center mb-4">
                            <div className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse shadow-[0_0_10px_#2BFF88]" />
                        </div>
                        <p className="text-[10px] text-text-secondary tracking-[0.2em] uppercase mb-1">
                            Aguardando confirmação
                        </p>
                        <p className="text-[9px] text-text-meta uppercase tracking-oryk opacity-60">
                            Detector de pagamento ativo • 10s
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
