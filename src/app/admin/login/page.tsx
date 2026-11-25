'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Eye, 
  EyeOff, 
  ArrowLeft, 
  AlertCircle, 
  CheckCircle2, 
  KeyRound 
} from 'lucide-react';
import { loginAdmin, getCurrentSession } from '@/lib/auth';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [errorMsg, setErrorMsg] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    // If already logged in, redirect directly to admin dashboard
    const session = getCurrentSession();
    if (session) {
      router.replace('/admin');
    }
  }, [router]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    setTimeout(() => {
      const result = loginAdmin(email, password);
      if (result.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.replace('/admin');
        }, 500);
      } else {
        setErrorMsg(result.error || 'Terjadi kesalahan saat masuk.');
        setIsLoading(false);
      }
    }, 400);
  };

  return (
    <div className="min-h-screen w-full bg-[#16805C] flex flex-col justify-between relative overflow-hidden font-sans text-slate-800 antialiased selection:bg-emerald-300 selection:text-emerald-950">
      {/* Background Subtle Elements */}
      <div className="absolute inset-0 pointer-events-none opacity-10">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-white blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-emerald-200 blur-3xl" />
      </div>

      {/* Top Header */}
      <header className="relative z-10 w-full px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-semibold backdrop-blur-md transition-all border border-white/15"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pencarian Publik</span>
        </Link>
        <div className="flex items-center gap-1.5 text-white/70 text-[11px] font-mono">
          <ShieldCheck className="w-4 h-4 text-emerald-300" />
          <span>PORTAL ADMIN TERPROTEKSI</span>
        </div>
      </header>

      {/* Main Login Card Area */}
      <main className="relative z-10 flex-1 flex items-center justify-center px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md bg-white rounded-3xl shadow-2xl border border-white/40 overflow-hidden flex flex-col"
        >
          {/* Card Brand Header */}
          <div className="bg-[#FAF8F5] border-b border-slate-100 p-6 sm:p-7 text-center flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-white p-2 border border-slate-200/80 shadow-xs flex items-center justify-center mb-3">
              <Image
                src="/logos/bpn_base_clean.png"
                alt="Logo BPN"
                width={42}
                height={42}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Login Administrator BPN
            </h1>
            <p className="text-xs text-slate-500 mt-1 max-w-xs leading-relaxed">
              Kantor Pertanahan ATR/BPN Kabupaten Siak
              <br />
              <span className="text-[11px] text-emerald-800 font-medium">Seksi Pengukuran & Pemetaan Kadastral</span>
            </p>
          </div>

          {/* Form Body */}
          <div className="p-6 sm:p-7 flex flex-col gap-5">
            {/* Error Message */}
            <AnimatePresence>
              {errorMsg && (
                <motion.div
                  initial={{ opacity: 0, height: 0, y: -10 }}
                  animate={{ opacity: 1, height: 'auto', y: 0 }}
                  exit={{ opacity: 0, height: 0, y: -10 }}
                  className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-start gap-2.5"
                >
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div className="leading-snug">{errorMsg}</div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Success Message */}
            <AnimatePresence>
              {isSuccess && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <div className="font-semibold">Login berhasil! Membuka Dashboard Admin...</div>
                </motion.div>
              )}
            </AnimatePresence>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email Input */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email Akun Admin
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama.admin@bpn-siak.go.id"
                    disabled={isLoading || isSuccess}
                    className="w-full text-xs pl-10 pr-4 py-3 rounded-2xl border border-slate-300 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16805C]/20 focus:border-[#16805C] transition font-medium text-slate-800 placeholder:text-slate-400 disabled:opacity-60"
                  />
                </div>
              </div>

              {/* Password Input */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-slate-700">
                    Kata Sandi / Password
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    disabled={isLoading || isSuccess}
                    className="w-full text-xs pl-10 pr-10 py-3 rounded-2xl border border-slate-300 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#16805C]/20 focus:border-[#16805C] transition font-medium text-slate-800 placeholder:text-slate-400 disabled:opacity-60"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    tabIndex={-1}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-slate-400 hover:text-slate-600 transition cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none text-slate-600 font-medium">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded border-slate-300 text-[#16805C] focus:ring-[#16805C]"
                  />
                  <span>Ingat sesi masuk saya</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading || isSuccess}
                className="mt-2 w-full flex items-center justify-center gap-2 py-3 px-4 rounded-2xl bg-[#16805C] hover:bg-[#11694A] active:bg-[#0e563d] text-white text-xs sm:text-sm font-bold shadow-sm hover:shadow transition disabled:opacity-60 select-none cursor-pointer"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Memverifikasi Kredensial...</span>
                  </div>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Masuk ke Dashboard Admin</span>
                  </>
                )}
              </button>
            </form>

            {/* Security Notice Note */}
            <div className="pt-4 border-t border-slate-100 text-center">
              <p className="text-[11px] text-slate-400 leading-relaxed">
                Halaman ini terproteksi. Akses hanya diperuntukkan bagi Administrator resmi Kantor Pertanahan ATR/BPN Kabupaten Siak.
              </p>
            </div>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 w-full text-center py-4 text-[11px] text-white/60">
        <p>© Kantor Pertanahan ATR/BPN Kabupaten Siak — Sistem Informasi Arsip Peta Spasial</p>
      </footer>
    </div>
  );
}
