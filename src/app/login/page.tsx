'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchParams.get('ok') === 'created') {
      setSuccessMsg('Account created successfully. Please log in.');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
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
        throw new Error(data?.error || 'Invalid credentials');
      }

      if (data.redirectTo) {
        router.push(data.redirectTo);
      } else {
        router.push('/mfa');
      }
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
    <div className="w-full max-w-md oryk-surface p-10 animate-in fade-in slide-in-from-bottom-8 duration-1000">
      <div className="mb-10 text-center">
        <h1 className="text-2xl font-medium tracking-[0.4em] uppercase text-white mb-2">ØRYK</h1>
        <p className="text-[10px] tracking-oryk text-text-meta uppercase">Painel de Acesso</p>
      </div>

      {successMsg && (
        <div className="bg-accent/10 border border-accent/20 text-accent text-[11px] uppercase tracking-oryk p-4 rounded-xl mb-8">
          {successMsg}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] uppercase tracking-oryk p-4 rounded-xl mb-8">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[9px] uppercase tracking-[0.2em] text-text-meta font-medium ml-1" htmlFor="identifier">
            Credencial (Email ou Username)
          </label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            required
            placeholder="identidade@oryk.systems"
            className="oryk-input"
            value={formData.identifier}
            onChange={handleChange}
          />
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between ml-1">
            <label className="text-[9px] uppercase tracking-[0.2em] text-text-meta font-medium" htmlFor="password">
              Chave de Acesso
            </label>
            <Link href="/forgot" className="text-[9px] uppercase tracking-oryk text-accent/50 hover:text-accent transition-colors">
              Esqueceu a chave?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="oryk-input"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={loading}
            className="oryk-button-accent w-full py-4 text-[11px] uppercase tracking-[0.2em] font-semibold"
          >
            {loading ? 'Validando...' : 'Iniciar Sessão →'}
          </button>
        </div>
      </form>

      <div className="mt-10 pt-8 border-t border-white/[0.03] text-center">
        <p className="text-[10px] tracking-oryk text-text-meta uppercase">
          Ainda não possui acesso?{' '}
          <Link href="/register" className="text-white hover:text-accent transition-colors">
            Registrar-se
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-[10px] uppercase tracking-[0.4em] text-accent animate-pulse">Estabelecendo conexão...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
