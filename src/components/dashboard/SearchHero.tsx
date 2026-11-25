'use client';

import React from 'react';
import { Search, X, MapPin, Eye, EyeOff } from 'lucide-react';

interface SearchHeroProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
  selectedKecamatan: string;
  onKecamatanChange: (kec: string) => void;
  kecamatanList: string[];
  totalResults: number;
  showAll: boolean;
  onToggleShowAll: () => void;
}

export const SearchHero: React.FC<SearchHeroProps> = ({
  searchQuery,
  onSearchChange,
  selectedKecamatan,
  onKecamatanChange,
  kecamatanList,
  totalResults,
  showAll,
  onToggleShowAll
}) => {
  return (
    <div className="w-full pt-6 pb-4">
      {/* Title & Greeting Banner */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Pencarian Arsip Peta Lama
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Cari warkah tanah bersejarah, kapling PIR, peta dasar teknik, dan gambar ukur instansi ATR/BPN
          </p>
        </div>

        {/* Tombol Tampil Semua */}
        <button
          onClick={onToggleShowAll}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition shadow-xs shrink-0 self-start sm:self-auto ${
            showAll && !searchQuery.trim()
              ? 'bg-slate-800 text-white hover:bg-slate-900'
              : 'bg-[#16805C] text-white hover:bg-[#3D4449]'
          }`}
        >
          {showAll && !searchQuery.trim() ? (
            <>
              <EyeOff className="w-4 h-4" />
              <span>Sembunyikan Daftar</span>
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              <span>Tampil Semua (118 Peta)</span>
            </>
          )}
        </button>
      </div>

      {/* Main Search Input Bar */}
      <div className="relative w-full shadow-xs rounded-2xl bg-white border border-slate-300 focus-within:border-[#16805C] focus-within:ring-4 focus-within:ring-[#16805C]/15 transition-all">
        <div className="flex items-center px-4 py-3 sm:py-3.5 gap-3">
          <Search className="w-5 h-5 text-[#16805C] shrink-0" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Ketik nomor kode (contoh: 1.01), nama peta, lembar, desa, atau kecamatan..."
            className="w-full bg-transparent text-sm sm:text-base text-slate-900 placeholder:text-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="p-1 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition"
              title="Hapus pencarian"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <div className="hidden sm:flex items-center gap-1.5 pl-3 border-l border-slate-200 text-xs font-medium text-[#16805C] bg-[#E8ECEE] px-2.5 py-1 rounded-lg">
            <span>{totalResults}</span>
            <span className="text-slate-500">ditemukan</span>
          </div>
        </div>
      </div>

      {/* Filter Kecamatan Bar (Clean, no status tanda tangan and no proyek scroll dropdown) */}
      <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
        <span className="text-xs font-semibold text-slate-500 flex items-center gap-1 shrink-0 pl-1">
          <MapPin className="w-3.5 h-3.5 text-[#16805C]" />
          Kecamatan:
        </span>

        <button
          onClick={() => onKecamatanChange('Semua')}
          className={`px-3 py-1 rounded-full text-xs font-medium transition shrink-0 ${
            selectedKecamatan === 'Semua'
              ? 'bg-[#16805C] text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          Semua Wilayah
        </button>

        {kecamatanList.map((kec) => (
          <button
            key={kec}
            onClick={() => onKecamatanChange(kec)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition shrink-0 ${
              selectedKecamatan === kec
                ? 'bg-[#16805C] text-white shadow-xs'
                : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            {kec}
          </button>
        ))}
      </div>
    </div>
  );
};

