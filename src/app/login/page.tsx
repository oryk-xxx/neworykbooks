'use client';

import { useState, useEffect, Suspense } from 'react';
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
    <div className="w-full max-w-md bg-[#0a0a0a] border border-neutral-800 rounded-xl shadow-2xl p-8">
      <h1 className="text-3xl font-light mb-2">Login</h1>
      <p className="text-neutral-400 mb-8 text-sm">Acesse o seu painel ØRYK</p>

      {successMsg && (
        <div className="bg-green-500/10 border border-green-500/50 text-green-500 text-sm p-3 rounded-md mb-6">
          {successMsg}
        </div>
      )}

      {error && (
        <div className="bg-red-500/10 border border-red-500/50 text-red-500 text-sm p-3 rounded-md mb-6">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs text-neutral-500 mb-1" htmlFor="identifier">EMAIL OR USERNAME</label>
          <input
            id="identifier"
            name="identifier"
            type="text"
            required
            className="w-full bg-neutral-900 border border-neutral-800 rounded-md p-3 text-sm focus:outline-none focus:border-neutral-500 transition-colors"
            value={formData.identifier}
            onChange={handleChange}
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs text-neutral-500" htmlFor="password">PASSWORD</label>
            <Link href="/forgot" className="text-xs text-neutral-400 hover:text-white transition-colors">
              Forgot password?
            </Link>
          </div>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="w-full bg-neutral-900 border border-neutral-800 rounded-md p-3 text-sm focus:outline-none focus:border-neutral-500 transition-colors"
            value={formData.password}
            onChange={handleChange}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-medium p-3 rounded-md mt-6 hover:bg-neutral-200 transition-colors disabled:opacity-50"
        >
          {loading ? 'Authenticating...' : 'Sign In'}
        </button>
      </form>

      <p className="text-neutral-500 text-sm mt-6 text-center">
        Don't have an account?{' '}
        <Link href="/register" className="text-white hover:underline">
          Register here
        </Link>
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Suspense fallback={<div className="text-neutral-500 text-sm animate-pulse">Loading login form...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
