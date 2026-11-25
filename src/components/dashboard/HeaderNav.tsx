'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Layers, RefreshCw, Archive, Search } from 'lucide-react';

interface HeaderNavProps {
  onReplayAnimation?: () => void;
  totalMaps?: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ onReplayAnimation, totalMaps = 118 }) => {
  const pathname = usePathname();

  const handleReload = () => {
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-[#F7F6F2]/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Lockup */}
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative w-10 h-10 rounded-xl bg-white p-1 border border-slate-300 shadow-xs flex items-center justify-center overflow-hidden">
            <Image
              src="/logos/bpn_base_clean.png"
              alt="Logo BPN"
              width={34}
              height={34}
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight group-hover:text-[#525B61] transition">
                Pencarian Peta BPN
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8ECEE] text-[#525B61] border border-[#CBD2D6]">
                Kabupaten Siak
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Seksi Pengukuran & Pemetaan Kadastral
            </p>
          </div>
        </Link>

        {/* Center Navigation Tabs: [Pencarian] vs [Daftar Tabung] */}
        <div className="hidden md:flex items-center gap-1.5 p-1 rounded-xl bg-slate-200/70 border border-slate-300/60 text-xs font-semibold">
          <Link
            href="/"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
              pathname === '/'
                ? 'bg-white text-[#525B61] shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Search className="w-3.5 h-3.5" />
            <span>Pencarian Peta</span>
          </Link>

          <Link
            href="/tabung"
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
              pathname === '/tabung'
                ? 'bg-white text-[#525B61] shadow-xs font-bold'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Archive className="w-3.5 h-3.5 text-[#525B61]" />
            <span>Arsip Tabung (21)</span>
          </Link>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Counter */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-600 shadow-xs">
            <Layers className="w-3.5 h-3.5 text-[#525B61]" />
            <span className="font-medium">{totalMaps} Berkas Peta</span>
          </div>

          {/* Requirement 3: Tombol Animasi Ganti Reload */}
          <button
            onClick={handleReload}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white hover:bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold transition shadow-xs hover:border-[#525B61] hover:text-[#525B61]"
            title="Muat ulang halaman dan data"
          >
            <RefreshCw className="w-3.5 h-3.5 text-[#525B61]" />
            <span>Reload</span>
          </button>
        </div>
      </div>

      {/* Mobile Submenu for Tabs */}
      <div className="flex md:hidden items-center justify-center gap-2 mt-2 pt-2 border-t border-slate-200/60 text-xs font-semibold">
        <Link
          href="/"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg ${
            pathname === '/' ? 'bg-[#525B61] text-white' : 'text-slate-600'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Pencarian</span>
        </Link>
        <Link
          href="/tabung"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg ${
            pathname === '/tabung' ? 'bg-[#525B61] text-white' : 'text-slate-600'
          }`}
        >
          <Archive className="w-3.5 h-3.5" />
          <span>Arsip Tabung</span>
        </Link>
      </div>
    </header>
  );
};
