'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, HelpCircle, Search, Compass, Eye, Download } from 'lucide-react';

interface UserGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UserGuideModal: React.FC<UserGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const steps = [
    {
      num: '01',
      icon: Search,
      title: 'Ketik Kata Kunci pada Kolom Pencarian',
      desc: 'Masukkan nomor kode arsip (misal "1.01", "2.15"), nama proyek ("PIR ADB"), nama desa ("Dayun", "Pangkalan Pisang"), atau petunjuk lembar peta.'
    },
    {
      num: '02',
      icon: Compass,
      title: 'Gunakan Filter Wilayah Kecamatan',
      desc: 'Saring hasil pencarian berdasarkan kecamatan untuk mempersempit warkah tanah yang sedang Anda cari.'
    },
    {
      num: '03',
      icon: Eye,
      title: 'Buka Pratinjau Sketsa Kadastral & Tabung',
      desc: 'Klik pada kartu peta untuk membuka penampil sketsa interaktif. Anda dapat melihat Nomor TABUNG fisik penyimpanan dalam ukuran besar, memperbesar kanvas, dan memeriksa tanda tangan.'
    },
    {
      num: '04',
      icon: Download,
      title: 'Akses Berkas Digital di Google Drive',
      desc: 'Gunakan tombol "Buka Berkas Peta di Google Drive" untuk mengunduh pindaian resolusi tinggi atau berkas CAD/GIS jika tersedia.'
    }
  ];

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[85vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#FAF8F5]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#E8ECEE] text-[#16805C] flex items-center justify-center">
                <HelpCircle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Cara Penggunaan</h3>
                <p className="text-[11px] text-slate-500">Panduan mudah mencari & membaca peta BPN</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Body */}
          <div className="p-6 overflow-y-auto flex flex-col gap-4">
            <div className="flex flex-col gap-3">
              {steps.map((st) => {
                const IconComponent = st.icon;
                return (
                  <div
                    key={st.num}
                    className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-slate-50/80 border border-slate-200/70"
                  >
                    <div className="w-8 h-8 rounded-xl bg-[#16805C] text-white font-mono font-bold text-xs flex items-center justify-center shrink-0">
                      {st.num}
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs sm:text-sm flex items-center gap-1.5">
                        <IconComponent className="w-3.5 h-3.5 text-[#16805C]" />
                        {st.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                        {st.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Kode & Tabung Penjelasan */}
            <div className="p-4 rounded-2xl bg-slate-100 border border-slate-200 text-xs text-slate-800">
              <h5 className="font-bold mb-1 flex items-center gap-1.5 text-[#2C3236]">
                Format Penomoran Kode Peta & Nomor Tabung
              </h5>
              <p className="text-[11px] leading-relaxed text-slate-600">
                Contoh <strong>1.08</strong>: Angka <strong>1</strong> menunjukkan bahwa warkah disimpan pada <strong>TABUNG 1</strong> (Proyek PIR SUS SEI BUATAN), sedangkan <strong>08</strong> menunjukkan nomor urut lembar peta di dalam tabung tersebut.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

