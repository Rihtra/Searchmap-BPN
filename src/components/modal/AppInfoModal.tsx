'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Info, ShieldCheck, Map, Landmark } from 'lucide-react';
import { SystemConfig } from '@/data/initialData';

interface AppInfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: SystemConfig;
}

export const AppInfoModal: React.FC<AppInfoModalProps> = ({ isOpen, onClose, config }) => {
  if (!isOpen) return null;

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
              <div className="w-8 h-8 rounded-xl bg-[#E8ECEE] text-[#525B61] flex items-center justify-center">
                <Info className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Informasi Aplikasi</h3>
                <p className="text-[11px] text-slate-500">Sistem Temu Balik Peta Lama BPN</p>
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
          <div className="p-6 overflow-y-auto flex flex-col gap-4 text-xs text-slate-600 leading-relaxed">
            <div className="p-3.5 rounded-2xl bg-[#E8ECEE]/60 border border-[#CBD2D6] flex items-start gap-3">
              <Landmark className="w-5 h-5 text-[#525B61] shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-[#2C3236] text-xs">{config.instansiNama}</h4>
                <p className="text-[11px] text-slate-600 mt-0.5">{config.alamatKantor}</p>
              </div>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-1.5">
                <Map className="w-4 h-4 text-[#525B61]" />
                Latar Belakang Digitalisasi
              </h4>
              <p>
                Aplikasi ini dikembangkan untuk memudahkan petugas pertanahan, surveyor berlisensi, dan masyarakat dalam menelusuri warkah bersejarah peta pendaftaran tanah, peta transmigrasi PIR-ADB Sei Buatan, peta kapling Inti Indosawit, gambar situasi khusus perusahaan, dan gambar ukur desa di Kabupaten Siak.
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200">
              <h5 className="font-bold text-slate-800 text-xs mb-1">Pemberitahuan Warkah Fisik</h5>
              <p className="text-[11px] text-slate-600">
                {config.informasiArsip}
              </p>
            </div>

            <div>
              <h4 className="font-bold text-slate-800 text-sm mb-1.5 flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#525B61]" />
                Validitas & Status Tanda Tangan
              </h4>
              <p>
                Status <strong>Bertandatangan</strong> menandakan bahwa peta warkah fisik telah dibubuhi tanda tangan pengesahan Kepala Seksi Pengukuran / Juru Ukur resmi BPN. Peta dengan status <strong>Belum TTD</strong> merupakan draf kerja teknik yang tetap dapat dirujuk sebagai dasar rekonstruksi batas bidang tanah.
              </p>
            </div>

            <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
              <span>Versi Sistem: 2.5.0</span>
              <span>Hubungi: {config.kontakAdmin}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
