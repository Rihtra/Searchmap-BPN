'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapRecord, SystemConfig } from '@/data/initialData';
import { CadastralSketch } from '@/components/ui/CadastralSketch';
import { 
  X, 
  ExternalLink, 
  Printer, 
  MapPin, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  Building2, 
  Calendar,
  Layers,
  Archive
} from 'lucide-react';

interface MapPreviewModalProps {
  map: MapRecord | null;
  onClose: () => void;
  config: SystemConfig;
}

export const MapPreviewModal: React.FC<MapPreviewModalProps> = ({
  map,
  onClose,
  config
}) => {
  if (!map) return null;

  const handlePrint = () => {
    window.print();
  };

  const tabungNum = map.tabungNumber || map.proyekId || parseInt(map.kode.split('.')[0] || '1', 10);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh]"
        >
          {/* Modal Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#FBF9F5]">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded-full bg-[#525B61] text-white text-xs font-mono font-bold tracking-wider shadow-xs">
                KODE: {map.kode}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                Lembar Peta: <strong className="text-slate-800">{map.petunjukLembar}</strong>
              </span>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition"
              title="Tutup Pratinjau"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body: Split View (Interactive Sketch + Metadata Card) */}
          <div className="p-6 overflow-y-auto flex flex-col lg:flex-row gap-6">
            {/* Left: High-Resolution Interactive Cadastral Sketch */}
            <div className="w-full lg:w-3/5 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-[#525B61]" />
                  Pratinjau Gambar Sketsa & Digitasi
                </span>
                <span className="text-[11px] text-slate-400">
                  Gunakan tombol zoom & geser kanvas
                </span>
              </div>

              <div className="w-full h-80 sm:h-96 rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                <CadastralSketch map={map} interactive={true} showControls={true} className="w-full h-full" />
              </div>
            </div>

            {/* Right: Comprehensive Archive Metadata with HUGE TABUNG DISPLAY */}
            <div className="w-full lg:w-2/5 flex flex-col justify-between gap-4">
              <div className="flex flex-col gap-3.5">
                {/* PROMINENT LARGE KODE TABUNG (Requirement 3: di tampilan saat mengklik konten maka kode tabung lebih besar, warna disesuaikan #525B61) */}
                <div className="p-4 rounded-2xl bg-gradient-to-r from-[#242A2E] via-[#3D4449] to-[#525B61] text-white shadow-md border border-[#525B61]/50 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-[#D4D9DB] block flex items-center gap-1">
                      <Archive className="w-3.5 h-3.5" />
                      LOKASI FISIK WARKAH TANAH
                    </span>
                    <span className="text-3xl sm:text-4xl font-black tracking-tight font-mono text-white block mt-0.5 drop-shadow-sm">
                      TABUNG {tabungNum}
                    </span>
                    <span className="text-[11px] text-[#E8ECEE] mt-0.5 block truncate max-w-[200px]">
                      {map.proyekNama}
                    </span>
                  </div>

                  <div className="w-16 h-16 rounded-2xl bg-white/10 border border-white/20 flex flex-col items-center justify-center text-center p-1.5 shrink-0 shadow-inner">
                    <span className="text-[9px] uppercase font-bold text-[#D4D9DB]">NOMOR KODE</span>
                    <span className="text-sm font-extrabold font-mono text-white">{map.kode}</span>
                    <span className="text-[9px] text-[#E8ECEE]">Lbr: {map.petunjukLembar}</span>
                  </div>
                </div>

                {/* Judul & Status Tanda Tangan (Requirement 2: Tanda tangan tetap ada di modal!) */}
                <div>
                  <div className="mb-1.5">
                    {map.ttd ? (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E8ECEE] text-[#2C3236] border border-[#CBD2D6]">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#525B61]" />
                        Disahkan / Bertandatangan
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                        <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                        Belum Bertandatangan
                      </span>
                    )}
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold text-slate-900 leading-snug">
                    {map.judul}
                  </h2>
                </div>

                {/* Details Grid */}
                <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/70 flex flex-col gap-2 text-xs text-slate-700">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-[#525B61] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Proyek Induk</span>
                      <span className="font-semibold text-slate-800">{map.proyekNama}</span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-2 border-t border-slate-200/60">
                    <MapPin className="w-4 h-4 text-[#525B61] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Lokasi Administratif</span>
                      <span className="font-semibold text-slate-800">
                        Desa {map.desa !== '-' ? map.desa : 'Semua Desa'}, Kec. {map.kecamatan}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-2 border-t border-slate-200/60">
                    <FileText className="w-4 h-4 text-[#525B61] shrink-0 mt-0.5" />
                    <div className="w-full flex items-center justify-between">
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Petunjuk Lembar</span>
                        <span className="font-mono font-semibold text-slate-800">{map.petunjukLembar}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Skala Arsip</span>
                        <span className="font-mono font-semibold text-slate-800">{map.skala}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block text-[10px] font-bold uppercase">Tahun</span>
                        <span className="font-mono font-semibold text-slate-800">{map.tahunArsip}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 pt-2 border-t border-slate-200/60">
                    <Calendar className="w-4 h-4 text-[#525B61] shrink-0 mt-0.5" />
                    <div>
                      <span className="text-slate-400 block text-[10px] font-bold uppercase">Penyimpanan Warkah Fisik</span>
                      <span className="text-slate-600">
                        {map.keterangan || `Tersimpan dalam TABUNG ${tabungNum} di Ruang Warkah Kantor Pertanahan Siak`}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-1">
                <a
                  href={config.googleDriveLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-[#525B61] hover:bg-[#3D4449] text-white text-xs font-bold transition shadow-xs"
                >
                  <ExternalLink className="w-4 h-4" />
                  <span>Buka Berkas Peta di Google Drive</span>
                </a>

                <button
                  onClick={handlePrint}
                  className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs font-semibold transition"
                >
                  <Printer className="w-4 h-4 text-slate-500" />
                  <span>Cetak Lembar Disposisi Arsip (Tabung {tabungNum})</span>
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
