'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, CheckCircle2, MessageSquare } from 'lucide-react';
import { AppComplaint } from '@/data/initialData';
import { getStoredComplaints, saveStoredComplaints } from '@/lib/storage';

interface ComplaintModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ComplaintModal: React.FC<ComplaintModalProps> = ({ isOpen, onClose }) => {
  const [nama, setNama] = useState('');
  const [kontak, setKontak] = useState('');
  const [keluhan, setKeluhan] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nama.trim() || !keluhan.trim()) return;

    const newComplaint: AppComplaint = {
      id: `comp-${Date.now()}`,
      nama: nama.trim(),
      kontak: kontak.trim() || '-',
      keluhan: keluhan.trim(),
      tanggal: new Date().toISOString().replace('T', ' ').substring(0, 16),
      status: 'Menunggu'
    };

    const currentComplaints = getStoredComplaints();
    saveStoredComplaints([newComplaint, ...currentComplaints]);

    setIsSuccess(true);
    setTimeout(() => {
      setIsSuccess(false);
      setNama('');
      setKontak('');
      setKeluhan('');
      onClose();
    }, 1800);
  };

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

        {/* Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#FAF8F5]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#E8ECEE] text-[#16805C] flex items-center justify-center">
                <MessageSquare className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">Keluhan & Saran Aplikasi</h3>
                <p className="text-[11px] text-slate-500">Layanan pengaduan arsip & sistem pencarian peta</p>
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
          <div className="p-6">
            {isSuccess ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="py-8 flex flex-col items-center justify-center text-center"
              >
                <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-900">Keluhan Berhasil Terkirim!</h4>
                <p className="text-xs text-slate-500 mt-1 max-w-xs">
                  Terima kasih atas masukan Anda. Tim Seksi Pengukuran dan Pemetaan BPN Siak akan menindaklanjuti.
                </p>
              </motion.div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nama Lengkap <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={nama}
                    onChange={(e) => setNama(e.target.value)}
                    placeholder="Contoh: Budi Santoso"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Nomor WhatsApp / Email
                  </label>
                  <input
                    type="text"
                    value={kontak}
                    onChange={(e) => setKontak(e.target.value)}
                    placeholder="Contoh: 0812-xxxx-xxxx atau email"
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Isi Keluhan atau Pertanyaan <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={keluhan}
                    onChange={(e) => setKeluhan(e.target.value)}
                    placeholder="Tuliskan keluhan Anda (misal: lembar peta tidak jelas, nomor kode tidak ditemukan, permohonan warkah fisik, dsb)..."
                    className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end gap-2">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#16805C] hover:bg-[#3D4449] rounded-xl transition shadow-xs"
                  >
                    <Send className="w-3.5 h-3.5" />
                    Kirim Keluhan
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

