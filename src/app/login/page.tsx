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
      setSuccessMsg('Conta criada com sucesso. Por favor, autentique-se.');
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
        throw new Error(data?.error || 'Credenciais inválidas');
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
    <div className="w-full max-w-md oryk-surface p-10 relative overflow-hidden">
      <div className="mb-10 text-center">
        <h1 className="text-header mb-2 text-primary">Autenticação.Sistema</h1>
        <p className="font-mono text-[9px] tracking-oryk text-text-meta uppercase">Módulo: Protocolo.Segurança.A8</p>
      </div>

      {successMsg && (
        <div className="bg-primary/10 border border-primary/20 text-primary text-[10px] uppercase tracking-oryk p-4 rounded mb-8">
          {successMsg}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-[10px] uppercase tracking-oryk p-4 rounded mb-8">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="text-label" htmlFor="identifier">
            ID.Credencial
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
          <div className="flex items-center justify-between">
            <label className="text-label" htmlFor="password">
              Chave.Acesso
            </label>
            <Link href="/forgot" className="text-[9px] uppercase tracking-oryk text-primary/40 hover:text-primary transition-colors">
              Recuperar?
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
            className="oryk-button-accent w-full py-4 text-[10px] uppercase tracking-[0.2em]"
          >
            {loading ? 'PROCESSANDO...' : 'INICIALIZAR SESSÃO →'}
          </button>
        </div>
      </form>

      <div className="mt-10 pt-8 border-t border-white/[0.06] text-center">
        <p className="text-[9px] tracking-oryk text-text-meta uppercase">
          Não autorizado?{' '}
          <Link href="/register" className="text-white hover:text-primary transition-colors">
            Registrar.Identidade
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center p-8">
      <Suspense fallback={<div className="font-mono text-[10px] uppercase tracking-[0.4em] text-primary animate-pulse">Estabelecendo Conexão...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
