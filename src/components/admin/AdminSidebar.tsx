'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Map,
  Archive,
  MessageSquare,
  Settings,
  LogOut,
  Database,
  ChevronRight
} from 'lucide-react';

interface AdminSidebarProps {
  activeTab: 'dashboard' | 'maps' | 'tabung' | 'complaints' | 'settings';
  setActiveTab: (tab: 'dashboard' | 'maps' | 'tabung' | 'complaints' | 'settings') => void;
  complaintCount: number;
  totalMaps: number;
  totalTabung?: number;
  currentUser?: {
    nama: string;
    email: string;
    role: string;
  };
  onLogout?: () => void;
}

export const AdminSidebar: React.FC<AdminSidebarProps> = ({
  activeTab,
  setActiveTab,
  complaintCount,
  totalMaps,
  totalTabung = 21,
  currentUser,
  onLogout
}) => {
  const getInitials = (name?: string) => {
    if (!name) return 'BP';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };
  const navItems = [
    {
      key: 'dashboard' as const,
      label: 'Dashboard',
      icon: LayoutDashboard,
      badge: null
    },
    {
      key: 'maps' as const,
      label: 'Data Peta',
      icon: Map,
      badge: (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/20 text-white group-data-active:bg-[#16805C]/10 group-data-active:text-[#16805C]">
          {totalMaps}
        </span>
      )
    },
    {
      key: 'tabung' as const,
      label: 'Data Tabung',
      icon: Archive,
      badge: (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/20 text-white group-data-active:bg-[#16805C]/10 group-data-active:text-[#16805C]">
          {totalTabung}
        </span>
      )
    },
    {
      key: 'complaints' as const,
      label: 'Feedback Masuk',
      icon: MessageSquare,
      badge: complaintCount > 0 ? (
        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-200 text-emerald-950">
          {complaintCount}
        </span>
      ) : null
    },
    {
      key: 'settings' as const,
      label: 'Pengaturan & User',
      icon: Settings,
      badge: null
    }
  ];

  return (
    /*
     * Sidebar: edge-to-edge, sticky to top, full screen height, no outer rounding.
     * No padding on the right (pr-0) so the active white tab bleeds flush into
     * the white main content panel — zero gap, zero shadow, zero seam.
     */
    <aside className="w-60 lg:w-64 bg-[#16805C] text-white flex flex-col justify-between shrink-0 select-none
                      pt-5 pb-5 pl-4 pr-0 h-screen sticky top-0 overflow-y-auto overflow-x-hidden z-20">
      <div className="flex flex-col h-full">
        {/* ── Brand Header ─────────────────────────────────── */}
        <div className="flex items-center gap-3 pb-5 pr-4 border-b border-white/15 mb-5">
          <div className="w-9 h-9 rounded-xl bg-white p-1 flex items-center justify-center shadow-sm shrink-0">
            <Image
              src="/logos/bpn_base_clean.png"
              alt="Logo BPN"
              width={28}
              height={28}
              className="object-contain"
            />
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight leading-tight text-white">
              BPN SIAK ADMIN
            </h1>
            <p className="text-[10px] text-white/60 font-medium">Sistem Arsip & Peta</p>
          </div>
        </div>

        {/* ── User Profile Badge ───────────────────────────── */}
        <div className="mb-5 mr-4 p-3 rounded-2xl bg-white/10 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-emerald-300 text-emerald-950 font-black flex items-center justify-center text-[11px] shrink-0">
            {getInitials(currentUser?.nama)}
          </div>
          <div className="truncate">
            <span className="text-xs font-bold block text-white truncate">
              {currentUser?.nama || 'Petugas Arsip BPN'}
            </span>
            <span className="text-[10px] text-white/70 flex items-center gap-1 font-medium truncate">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse shrink-0" />
              {currentUser?.role || 'Admin'}
            </span>
          </div>
        </div>

        {/* ── Navigation ────────────────────────────────────── */}
        <nav className="flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = activeTab === item.key;
            const Icon = item.icon;

            return (
              <div key={item.key} className="relative w-full">
                {/* ── Animated fillet curves (Framer motion layoutId) ── */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      layoutId="sidebarActiveIndicator"
                      className="absolute inset-0 w-full h-full z-10 pointer-events-none"
                      initial={false}
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 36,
                        mass: 0.75
                      }}
                    >
                      {/* White pill background — fills flush right to match content panel */}
                      <div className="absolute inset-0 bg-white rounded-l-full" />

                      {/* Top concave fillet: transitions sidebar green → white tab */}
                      <div className="hidden md:block absolute -top-5 right-0 w-5 h-5 overflow-hidden pointer-events-none">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M20 0 V20 H0 C11 20 20 11 20 0 Z" fill="#FFFFFF" />
                        </svg>
                      </div>

                      {/* Bottom concave fillet: transitions sidebar green → white tab */}
                      <div className="hidden md:block absolute -bottom-5 right-0 w-5 h-5 overflow-hidden pointer-events-none">
                        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                          <path d="M20 20 V0 H0 C11 0 20 9 20 20 Z" fill="#FFFFFF" />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* ── Tab button ─────────────────────────────── */}
                <button
                  onClick={() => setActiveTab(item.key)}
                  className={[
                    'relative z-20 w-full flex items-center justify-between py-3 pl-4 pr-5 text-xs font-semibold',
                    'outline-none focus-visible:ring-2 focus-visible:ring-white/40 select-none',
                    'transition-colors duration-150',
                    isActive
                      ? 'text-[#16805C] rounded-l-full'
                      : 'text-white/80 hover:text-white hover:bg-white/10 mr-4 rounded-xl'
                  ].join(' ')}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      className={[
                        'w-4 h-4 shrink-0 transition-colors',
                        isActive ? 'text-[#16805C]' : 'text-white/60'
                      ].join(' ')}
                    />
                    <span className="truncate">{item.label}</span>
                  </div>
                  {/* Badge: invert colour for active tab */}
                  {item.key === 'maps' && (
                    <span className={[
                      'px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold',
                      isActive ? 'bg-[#16805C]/10 text-[#16805C]' : 'bg-white/20 text-white'
                    ].join(' ')}>
                      {totalMaps}
                    </span>
                  )}
                  {item.key === 'tabung' && (
                    <span className={[
                      'px-1.5 py-0.5 rounded-full text-[10px] font-mono font-bold',
                      isActive ? 'bg-[#16805C]/10 text-[#16805C]' : 'bg-white/20 text-white'
                    ].join(' ')}>
                      {totalTabung}
                    </span>
                  )}
                  {item.key === 'complaints' && complaintCount > 0 && (
                    <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400 text-slate-900">
                      {complaintCount}
                    </span>
                  )}
                </button>
              </div>
            );
          })}
        </nav>

        {/* ── Bottom: Back to public & Logout ────────────────────────── */}
        <div className="pt-4 pr-4 border-t border-white/15 flex flex-col gap-2 mt-4">
          <div className="p-2.5 rounded-xl bg-black/15 text-[10px] text-white/70">
            <p className="font-bold text-white mb-0.5">Sesi Masuk Terverifikasi</p>
            <p className="leading-tight truncate">
              {currentUser?.email || 'admin.pemetaan@bpn-siak.go.id'}
            </p>
          </div>
          <Link
            href="/"
            className="flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition"
          >
            <span>Lihat Portal Publik</span>
          </Link>
          <button
            onClick={onLogout}
            type="button"
            className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl bg-rose-500/25 hover:bg-rose-500/35 text-rose-100 hover:text-white text-xs font-bold transition border border-rose-400/20 cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-300" />
            <span>Keluar Akun (Logout)</span>
          </button>
        </div>
      </div>
    </aside>
  );
};
