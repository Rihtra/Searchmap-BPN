'use client';

import React from 'react';
import { MessageSquare, Info, HelpCircle } from 'lucide-react';

interface FooterDockProps {
  onOpenComplaint: () => void;
  onOpenInfo: () => void;
  onOpenGuide: () => void;
}

export const FooterDock: React.FC<FooterDockProps> = ({
  onOpenComplaint,
  onOpenInfo,
  onOpenGuide
}) => {
  return (
    <footer className="w-full mt-12 mb-6 flex flex-col items-center gap-4">
      {/* 3 Buttons Dock (Matching Gambar 3 Wireframe: [Keluhan] [Informasi app] [Cara penggunaan]) */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 p-1.5 rounded-2xl bg-white border border-slate-200 shadow-xs">
        <button
          onClick={onOpenComplaint}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#525B61] hover:bg-[#E8ECEE] transition"
        >
          <MessageSquare className="w-4 h-4 text-[#525B61]" />
          <span>Keluhan</span>
        </button>

        <span className="text-slate-200">|</span>

        <button
          onClick={onOpenInfo}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#525B61] hover:bg-[#E8ECEE] transition"
        >
          <Info className="w-4 h-4 text-[#525B61]" />
          <span>Informasi app</span>
        </button>

        <span className="text-slate-200">|</span>

        <button
          onClick={onOpenGuide}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-slate-700 hover:text-[#525B61] hover:bg-[#E8ECEE] transition"
        >
          <HelpCircle className="w-4 h-4 text-[#525B61]" />
          <span>Cara penggunaan</span>
        </button>
      </div>

      {/* Copyright Notice */}
      <div className="text-center text-[11px] text-slate-400 font-medium">
        <p>© Kantor Pertanahan ATR/BPN Kabupaten Siak — Sistem Temu Balik Arsip Peta Spasial</p>
      </div>
    </footer>
  );
};
