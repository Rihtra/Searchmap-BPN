'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Layers, Archive, Search } from 'lucide-react';

interface HeaderNavProps {
  totalMaps?: number;
}

export const HeaderNav: React.FC<HeaderNavProps> = ({ totalMaps = 118 }) => {
  const pathname = usePathname();

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
              <span className="font-extrabold text-slate-900 text-sm sm:text-base tracking-tight group-hover:text-[#16805C] transition">
                Pencarian Peta BPN
              </span>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-[#E8ECEE] text-[#16805C] border border-[#CBD2D6]">
                Kabupaten Siak
              </span>
            </div>
            <p className="text-[11px] text-slate-500 hidden sm:block">
              Seksi Pengukuran & Pemetaan Kadastral
            </p>
          </div>
        </Link>

        {/* Center Navigation Tabs: animated with Framer Motion layoutId */}
        <div className="hidden md:flex items-center gap-1 p-1 rounded-xl bg-slate-200/70 border border-slate-300/60 text-xs font-semibold relative">
          {[
            { href: '/', icon: Search, label: 'Pencarian Peta' },
            { href: '/tabung', icon: Archive, label: 'Arsip Tabung (21)' }
          ].map(({ href, icon: Icon, label }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className="relative flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg z-10 transition-colors duration-200"
                style={{ color: isActive ? '#16805C' : '#475569' }}
              >
                {isActive && (
                  <motion.div
                    layoutId="headerActiveTab"
                    className="absolute inset-0 bg-white rounded-lg shadow-xs"
                    transition={{ type: 'spring', stiffness: 500, damping: 40, mass: 0.6 }}
                  />
                )}
                <Icon className="w-3.5 h-3.5 relative z-10" />
                <span className={`relative z-10 ${isActive ? 'font-bold' : 'font-semibold'}`}>{label}</span>
              </Link>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Quick Counter */}
          <div className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-xs text-slate-600 shadow-xs">
            <Layers className="w-3.5 h-3.5 text-[#16805C]" />
            <span className="font-medium">{totalMaps} Berkas Peta</span>
          </div>
        </div>
      </div>

      {/* Mobile Submenu for Tabs */}
      <div className="flex md:hidden items-center justify-center gap-2 mt-2 pt-2 border-t border-slate-200/60 text-xs font-semibold">
        <Link
          href="/"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg ${
            pathname === '/' ? 'bg-[#16805C] text-white' : 'text-slate-600'
          }`}
        >
          <Search className="w-3.5 h-3.5" />
          <span>Pencarian</span>
        </Link>
        <Link
          href="/tabung"
          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg ${
            pathname === '/tabung' ? 'bg-[#16805C] text-white' : 'text-slate-600'
          }`}
        >
          <Archive className="w-3.5 h-3.5" />
          <span>Arsip Tabung</span>
        </Link>
      </div>
    </header>
  );
};

