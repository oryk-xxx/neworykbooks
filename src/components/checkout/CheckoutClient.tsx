"use client";

import React, { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Copy, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface CheckoutClientProps {
    user: any;
    hasAccess: boolean;
    initialPayment?: any;
    price: number;
    originalPrice: number;
}

export default function CheckoutClient({ user, hasAccess, initialPayment, price, originalPrice }: CheckoutClientProps) {
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
            <div className="oryk-surface p-12 text-center animate-in fade-in slide-in-from-bottom-8 duration-1000">
                <p className="mb-8 font-mono text-text-secondary tracking-oryk-wide uppercase text-[9px] opacity-60">
                    Identity.Validation_Required_For_Protocol_Uplink
                </p>
                <Link
                    href="/login?redirectTo=/checkout"
                    className="oryk-button-primary w-full py-4 text-[10px] uppercase tracking-oryk font-medium"
                >
                    AUTH_PROTOCOL_01 →
                </Link>
            </div>
        );
    }

    if (hasAccess || approved) {
        return (
            <div className="oryk-surface p-12 text-center border-primary/20 animate-in fade-in zoom-in duration-700">
                <div className="flex justify-center mb-8">
                    <div className="h-2 w-2 rounded-full bg-primary shadow-[0_0_20px_rgba(43,255,136,0.5)]" />
                </div>
                <h2 className="text-header-sm text-white mb-3">Access.Granted</h2>
                <p className="font-mono text-[9px] text-text-secondary tracking-oryk-wide uppercase mb-12 opacity-60">
                    Lifetime_protocol_active_status: Operational
                </p>
                <Link
                    href="/reader"
                    className="oryk-button-accent w-full py-4 text-[10px] uppercase tracking-oryk font-bold"
                >
                    ENTER_ARCHIVE_GATEWAY →
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
            {!payment ? (
                <div className="oryk-surface p-12 text-center relative overflow-hidden">
                    <h2 className="text-header-sm text-white mb-10">CORE_ENTITY_ACCESS</h2>
                    <div className="flex flex-col items-center justify-center gap-2 mb-12">
                        <div className="flex items-center gap-4">
                            <span className="font-mono text-text-secondary text-[11px] line-through opacity-40 tracking-wider">R$ {originalPrice}</span>
                            <span className="font-mono bg-primary/10 text-primary text-[8px] px-2 py-0.5 rounded tracking-oryk font-bold uppercase">
                                {Math.round((1 - price / originalPrice) * 100)}% DISCOUNT_APPLIED
                            </span>
                        </div>
                        <div className="flex items-center gap-4">
                            <span className="text-header text-white tracking-tighter">R$ {price}</span>
                            <span className="font-mono text-text-secondary text-[9px] uppercase tracking-oryk-wide mt-2 opacity-50">SINGLE_TRANSACTION</span>
                        </div>
                    </div>

                    {error && (
                        <div className="font-mono bg-red-500/10 border border-red-500/20 text-red-400 text-[9px] p-5 rounded-xl mb-8 uppercase tracking-oryk-wide">
                            ERROR: {error}
                        </div>
                    )}

                    <button
                        onClick={handleGeneratePix}
                        disabled={loading}
                        className="w-full oryk-button-accent py-5 text-[10px] font-bold"
                    >
                        {loading ? "PROCESSING_ENCRYPTION..." : "GENERATE_TRANSACTION_KEY →"}
                    </button>

                    <p className="mt-8 font-mono text-[9px] text-text-meta uppercase tracking-[0.4em] leading-relaxed opacity-50">
                        Ativação instantânea após confirmação bancária
                    </p>
                </div>
            ) : (
                <div className="space-y-6">
                    <div className="oryk-surface p-10">
                        <div className="flex flex-col items-center">
                            <div className="mb-12 rounded-2xl bg-white p-6 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.8)] ring-1 ring-white/20">
                                <QRCodeSVG value={payment.qr_code} size={240} level="M" />
                            </div>

                            <div className="w-full space-y-8">
                                <div className="space-y-3">
                                    <label className="font-mono text-[9px] uppercase tracking-oryk-wide text-text-secondary px-1 opacity-50">
                                        Transaction.Key_Direct_Input
                                    </label>
                                    <div className="group relative">
                                        <input
                                            readOnly
                                            value={payment.qr_code}
                                            className="oryk-input pr-16 font-mono text-[11px] truncate bg-primary/[0.02]"
                                        />
                                        <button
                                            onClick={copyToClipboard}
                                            className="absolute right-3 top-1/2 -translate-y-1/2 p-3 text-text-secondary hover:text-primary transition-all duration-300"
                                        >
                                            {copied ? <CheckCircle2 size={18} className="text-primary" /> : <Copy size={18} />}
                                        </button>
                                    </div>
                                </div>

                                <div className="pt-4">
                                    <a
                                        href={payment.ticket_url || "#"}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="w-full h-14 flex items-center justify-center bg-white/[0.03] border border-white/[0.06] rounded-xl font-mono text-[9px] uppercase tracking-oryk-wide hover:bg-white/[0.06] transition-all text-text-secondary hover:text-primary"
                                    >
                                        EXTERNAL_LEDGER_VIEW →
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="oryk-surface p-8 text-center border-primary/10">
                        <div className="flex justify-center mb-6">
                            <div className="h-2 w-2 rounded-full bg-primary animate-pulse shadow-[0_0_15px_#2BFF88]" />
                        </div>
                        <p className="font-mono text-[9px] text-text-secondary tracking-oryk-wide uppercase mb-2 opacity-60">
                            Sync.Pending_Confirmation
                        </p>
                        <p className="font-mono text-[8px] text-text-meta uppercase tracking-oryk opacity-30">
                            Transaction_Detector: Active // Interval: 10s
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}
