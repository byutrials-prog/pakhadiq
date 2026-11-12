'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Lock, Mail, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#f7f5ef]" />}>
      <AdminLoginForm />
    </Suspense>
  );
}

function AdminLoginForm() {
  const searchParams = useSearchParams();
  const isUnauthorized = searchParams.get('error') === 'unauthorized';
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(
    isUnauthorized ? 'Akun ini belum memiliki akses admin. Hubungi pemilik toko untuk mengaktifkannya.' : null,
  );

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setErrorMessage(error.message || 'Email atau password salah');
        return;
      }

      router.push('/admin/dashboard');
      router.refresh();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : 'Login gagal. Coba lagi.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4 font-sans">
      <div className="w-full max-w-sm bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="text-center mb-6">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-700 rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold text-slate-900">Login Admin Toko</h1>
          <p className="text-xs text-slate-500 mt-1">
            Masuk untuk mengelola katalog & data profil toko
          </p>
        </div>

        {errorMessage && (
          <div className="mb-4 text-xs bg-red-50 text-red-600 p-3 rounded-xl border border-red-200">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@tokoumkm.com"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-2.5 rounded-xl text-sm flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-sm"
          >
            {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
            {isLoading ? 'Memverifikasi...' : 'Masuk Dashboard'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/" className="text-xs text-slate-500 hover:text-emerald-700">
            &larr; Kembali ke Katalog Toko
          </Link>
        </div>
        {isUnauthorized && (
          <form action="/auth/signout" method="POST" className="mt-3 text-center">
            <button type="submit" className="text-xs font-semibold text-emerald-900 underline underline-offset-4">
              Keluar dari akun ini
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
