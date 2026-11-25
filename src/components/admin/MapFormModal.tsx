'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, Plus } from 'lucide-react';
import { MapRecord, MapProject } from '@/data/initialData';

interface MapFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (map: MapRecord) => void;
  initialData?: MapRecord | null;
  projects: MapProject[];
}

export const MapFormModal: React.FC<MapFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  projects
}) => {
  const [kode, setKode] = useState('');
  const [judul, setJudul] = useState('');
  const [proyekId, setProyekId] = useState<number>(1);
  const [petunjukLembar, setPetunjukLembar] = useState('');
  const [desa, setDesa] = useState('');
  const [kecamatan, setKecamatan] = useState('Siak Sri Indrapura');
  const [ttd, setTtd] = useState(true);
  const [skala, setSkala] = useState('1:1000');
  const [tahunArsip, setTahunArsip] = useState('1994');

  useEffect(() => {
    if (initialData) {
      setKode(initialData.kode);
      setJudul(initialData.judul);
      setProyekId(initialData.proyekId);
      setPetunjukLembar(initialData.petunjukLembar);
      setDesa(initialData.desa);
      setKecamatan(initialData.kecamatan);
      setTtd(initialData.ttd);
      setSkala(initialData.skala || '1:1000');
      setTahunArsip(initialData.tahunArsip || '1994');
    } else {
      setKode('');
      setJudul('');
      setProyekId(1);
      setPetunjukLembar('');
      setDesa('');
      setKecamatan('Siak Sri Indrapura');
      setTtd(true);
      setSkala('1:1000');
      setTahunArsip('1994');
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!kode.trim() || !judul.trim()) return;

    const selectedProj = projects.find((p) => p.id === proyekId);

    const record: MapRecord = {
      id: initialData ? initialData.id : `map-${Date.now()}`,
      kode: kode.trim(),
      tabungNumber: proyekId,
      kodeTabung: `TABUNG ${proyekId}`,
      proyekId,
      proyekNama: selectedProj ? selectedProj.namaProyek : `Proyek ${proyekId}`,
      judul: judul.trim(),
      petunjukLembar: petunjukLembar.trim() || '-',
      desa: desa.trim() || '-',
      kecamatan: kecamatan.trim() || 'Siak Sri Indrapura',
      ttd,
      skala,
      tahunArsip,
      keterangan: 'Arsip Peta Fisik di Kantor Pertanahan Siak'
    };

    onSave(record);
    onClose();
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

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#FAF8F5]">
            <h3 className="font-bold text-slate-900 text-sm sm:text-base">
              {initialData ? 'Edit Data Peta Arsip' : 'Tambah Data Peta Baru'}
            </h3>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Form Body */}
          <form onSubmit={handleSubmit} className="p-6 overflow-y-auto flex flex-col gap-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nomor Kode Peta <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={kode}
                  onChange={(e) => setKode(e.target.value)}
                  placeholder="Contoh: 1.39 atau 22.01"
                  className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Petunjuk Lembar Peta
                </label>
                <input
                  type="text"
                  value={petunjukLembar}
                  onChange={(e) => setPetunjukLembar(e.target.value)}
                  placeholder="Contoh: 43 atau 47.2-49.215"
                  className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Judul / Nama Peta <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={judul}
                onChange={(e) => setJudul(e.target.value)}
                placeholder="Contoh: Peta Kapling Pendaftaran Tanah PIR ADB"
                className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Proyek Induk
              </label>
              <select
                value={proyekId}
                onChange={(e) => setProyekId(parseInt(e.target.value, 10))}
                className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-600"
              >
                {projects.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.id}. {p.namaProyek}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Desa / Kelurahan
                </label>
                <input
                  type="text"
                  value={desa}
                  onChange={(e) => setDesa(e.target.value)}
                  placeholder="Contoh: Dayun"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kecamatan
                </label>
                <input
                  type="text"
                  value={kecamatan}
                  onChange={(e) => setKecamatan(e.target.value)}
                  placeholder="Contoh: Siak Sri Indrapura"
                  className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Status Tanda Tangan
                </label>
                <select
                  value={ttd ? 'Ya' : 'Tidak'}
                  onChange={(e) => setTtd(e.target.value === 'Ya')}
                  className="w-full text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-600"
                >
                  <option value="Ya">Bertandatangan (Ya)</option>
                  <option value="Tidak">Belum TTD (Tidak)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Skala Peta
                </label>
                <input
                  type="text"
                  value={skala}
                  onChange={(e) => setSkala(e.target.value)}
                  placeholder="1:1000"
                  className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Tahun Arsip
                </label>
                <input
                  type="text"
                  value={tahunArsip}
                  onChange={(e) => setTahunArsip(e.target.value)}
                  placeholder="1994"
                  className="w-full text-xs font-mono px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition"
              >
                Batal
              </button>
              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 text-xs font-bold text-white bg-[#16805C] hover:bg-[#0F5132] rounded-xl transition shadow-xs"
              >
                <Save className="w-3.5 h-3.5" />
                Simpan Data
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
