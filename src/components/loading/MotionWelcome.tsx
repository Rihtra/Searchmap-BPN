'use client';

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { ArrowRight, Compass, Sparkles } from 'lucide-react';

interface MotionWelcomeProps {
  onFinish: () => void;
  autoDismissMs?: number;
}

export const MotionWelcome: React.FC<MotionWelcomeProps> = ({
  onFinish,
  autoDismissMs = 3200
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const startTime = Date.now();
    const interval = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const currentProgress = Math.min(Math.round((elapsed / (autoDismissMs - 300)) * 100), 100);
      setProgress(currentProgress);

      if (elapsed >= autoDismissMs) {
        clearInterval(interval);
        onFinish();
      }
    }, 40);

    return () => clearInterval(interval);
  }, [autoDismissMs, onFinish]);

  const welcomeWords = "Selamat Datang di Pencarian Peta Lama BPN".split(" ");

  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ y: -1000, opacity: 0, transition: { duration: 0.85, ease: [0.76, 0, 0.24, 1] } }}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between bg-gradient-to-b from-[#181B1D] via-[#24282B] to-[#111314] text-white p-6 sm:p-12 overflow-hidden select-none"
    >
      {/* Background Animated Subtle Cadastral Grid */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="welcome-grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="#9AA3A8" strokeWidth="0.7" />
              <circle cx="0" cy="0" r="1.5" fill="#525B61" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#welcome-grid)" />
        </svg>
      </div>

      {/* Ambient Radial Glow in #525B61 */}
      <motion.div
        animate={{
          scale: [1, 1.25, 1],
          opacity: [0.35, 0.6, 0.35]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[550px] bg-[#525B61]/30 rounded-full blur-[120px] pointer-events-none"
      />

      {/* Top Tag & Skip Button */}
      <div className="w-full max-w-4xl flex items-center justify-between z-10 pt-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#2C3236]/90 border border-[#525B61]/40 text-[#D4D9DB] text-xs font-medium tracking-wide shadow-lg backdrop-blur-md"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#CBD2D6] animate-pulse" />
          <span>KANTOR PERTANAHAN KABUPATEN SIAK</span>
        </motion.div>

        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          onClick={onFinish}
          className="group flex items-center gap-2 text-xs font-semibold text-slate-300 hover:text-white px-4 py-1.5 rounded-full bg-white/5 hover:bg-[#525B61]/40 border border-white/10 hover:border-[#525B61]/50 transition-all duration-300 backdrop-blur-md"
        >
          <span>Langsung Masuk</span>
          <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
        </motion.button>
      </div>

      {/* Center Hero: Animated Welcome Text */}
      <div className="flex flex-col items-center text-center max-w-3xl z-10 my-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-2 text-[#CBD2D6] font-mono text-xs uppercase tracking-widest mb-4 bg-[#2C3236]/60 px-3 py-1 rounded-md border border-[#525B61]/40"
        >
          <Compass className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '8s' }} />
          <span>Sistem Temu Balik Arsip Peta Spasial</span>
        </motion.div>

        {/* Staggered Title Words */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight flex flex-wrap justify-center gap-x-3 gap-y-2">
          {welcomeWords.map((word, idx) => (
            <motion.span
              key={idx}
              initial={{ opacity: 0, y: 30, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: 0.7,
                delay: 0.15 + idx * 0.1,
                ease: [0.2, 0.65, 0.3, 0.9]
              }}
              className={
                word === "Peta" || word === "Lama" || word === "BPN"
                  ? "text-transparent bg-clip-text bg-gradient-to-r from-slate-200 via-white to-[#D4D9DB] drop-shadow-[0_4px_16px_rgba(82,91,97,0.5)]"
                  : "text-white"
              }
            >
              {word}
            </motion.span>
          ))}
        </h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="mt-5 text-sm sm:text-base text-slate-300 max-w-xl font-normal leading-relaxed"
        >
          Pencarian digital peta pendaftaran, peta kapling transmigrasi PIR, gambar situasi khusus, dan gambar ukur sejarah tanah instansi BPN.
        </motion.p>

        {/* Progress Bar */}
        <div className="w-64 sm:w-80 mt-8">
          <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono mb-2">
            <span>MEMUAT ARSIP SPASIAL...</span>
            <span>{progress}%</span>
          </div>
          <div className="h-1.5 w-full bg-[#24282B] rounded-full overflow-hidden border border-slate-700/60 p-[1px]">
            <motion.div
              className="h-full bg-gradient-to-r from-[#525B61] via-[#7B878E] to-[#D4D9DB] rounded-full"
              style={{ width: `${progress}%` }}
              transition={{ ease: "linear" }}
            />
          </div>
        </div>
      </div>

      {/* Bottom Section: Animated BPN Logo */}
      <div className="flex flex-col items-center z-10 pb-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.7, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.4, type: "spring", stiffness: 120 }}
          className="relative flex items-center justify-center"
        >
          {/* Animated Concentric Radar Pulse Rings in Slate #525B61 */}
          <motion.div
            animate={{
              scale: [1, 1.8, 2.2],
              opacity: [0.8, 0.3, 0]
            }}
            transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut" }}
            className="absolute w-24 h-24 rounded-full border border-[#525B61]/60 pointer-events-none"
          />
          <motion.div
            animate={{
              scale: [1, 1.5, 1.9],
              opacity: [0.6, 0.2, 0]
            }}
            transition={{ duration: 2.6, delay: 0.8, repeat: Infinity, ease: "easeOut" }}
            className="absolute w-24 h-24 rounded-full border border-[#8C98A0]/40 pointer-events-none"
          />

          {/* Rotating Cadastral Reticle */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="absolute w-28 h-28 rounded-full border border-dashed border-[#525B61]/50 pointer-events-none"
          />

          {/* Logo Container with Glow & Float Animation */}
          <motion.div
            animate={{
              y: [-4, 4, -4],
              filter: [
                'drop-shadow(0 0 15px rgba(82, 91, 97, 0.5))',
                'drop-shadow(0 0 25px rgba(82, 91, 97, 0.8))',
                'drop-shadow(0 0 15px rgba(82, 91, 97, 0.5))'
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            className="relative w-20 h-20 sm:w-24 sm:h-24 p-2 rounded-2xl bg-gradient-to-b from-white/15 to-white/5 border border-[#525B61]/60 backdrop-blur-xl flex items-center justify-center shadow-2xl"
          >
            <Image
              src="/logos/bpn_base_clean.png"
              alt="Logo BPN"
              width={80}
              height={80}
              className="object-contain filter drop-shadow-md"
              priority
            />
          </motion.div>
        </motion.div>

        {/* Logo Caption */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
          className="text-xs text-slate-300 mt-3 font-medium tracking-wide flex items-center gap-1.5"
        >
          <span>Kementerian Agraria dan Tata Ruang / Badan Pertanahan Nasional</span>
        </motion.p>
      </div>
    </motion.div>
  );
};
