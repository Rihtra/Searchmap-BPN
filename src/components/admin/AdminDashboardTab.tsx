'use client';

import React, { useState } from 'react';
import { 
  MapRecord, 
  SystemConfig, 
  MapProject 
} from '@/data/initialData';
import { CadastralSketch } from '@/components/ui/CadastralSketch';
import { 
  Layers, 
  ExternalLink, 
  Save, 
  CheckCircle2, 
  Info, 
  Link as LinkIcon, 
  FolderKanban, 
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { saveStoredConfig } from '@/lib/storage';

interface AdminDashboardTabProps {
  maps: MapRecord[];
  projects: MapProject[];
  config: SystemConfig;
  onConfigUpdate: (newConfig: SystemConfig) => void;
  onSelectMap: (map: MapRecord) => void;
}

export const AdminDashboardTab: React.FC<AdminDashboardTabProps> = ({
  maps,
  projects,
  config,
  onConfigUpdate,
  onSelectMap
}) => {
  const [driveLink, setDriveLink] = useState(config.googleDriveLink);
  const [infoText, setInfoText] = useState(config.informasiArsip);
  const [isSaved, setIsSaved] = useState(false);

  // Statistics
  const totalMaps = maps.length;
  const verifiedTtd = maps.filter((m) => m.ttd).length;
  const unverifiedTtd = totalMaps - verifiedTtd;
  const percentageVerified = totalMaps > 0 ? Math.round((verifiedTtd / totalMaps) * 100) : 0;

  // Recent 3 maps for Image preview section (Gambar 4 Wireframe)
  const recentMaps = maps.slice(0, 3);

  const handleSaveConfig = () => {
    const updated = {
      ...config,
      googleDriveLink: driveLink,
      informasiArsip: infoText
    };
    saveStoredConfig(updated);
    onConfigUpdate(updated);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-slate-800 tracking-tight">
            Ringkasan Berkas Spasial & Sinkronisasi Drive
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Statistik validitas tanda tangan, kapasitas arsip warkah, dan integrasi Google Drive
          </p>
        </div>

        {isSaved && (
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Perubahan Tersimpan!</span>
          </div>
        )}
      </div>

      {/* KPI Stats Row (Matching Wireframe Gambar 4: Jumlah Semua Peta + Extras) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card: Jumlah Semua Peta */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Jumlah Semua Peta
            </span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 block">
              {totalMaps}
            </span>
            <span className="text-[11px] text-emerald-700 font-medium mt-1 inline-flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Terdata Lengkap
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        {/* Card: Proyek Aktif */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Total Proyek
            </span>
            <span className="text-3xl font-extrabold text-slate-900 mt-1 block">
              {projects.length}
            </span>
            <span className="text-[11px] text-slate-500 font-medium mt-1 block">
              PIR, Transmigrasi, HGU
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center">
            <FolderKanban className="w-6 h-6" />
          </div>
        </div>

        {/* Card: Peta Bertandatangan */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Sudah Bertanda Tangan
            </span>
            <span className="text-3xl font-extrabold text-emerald-700 mt-1 block">
              {verifiedTtd}
            </span>
            <span className="text-[11px] text-slate-500 font-medium mt-1 block">
              {percentageVerified}% Terverifikasi Sah
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
            <FileCheck2 className="w-6 h-6" />
          </div>
        </div>

        {/* Card: Peta Tanpa TTD */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Belum Tanda Tangan
            </span>
            <span className="text-3xl font-extrabold text-amber-700 mt-1 block">
              {unverifiedTtd}
            </span>
            <span className="text-[11px] text-amber-600 font-medium mt-1 block">
              Perlu Verifikasi Fisik
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Middle Row (Matching Wireframe Gambar 4: Link Derive Data & Informasi) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* Card 2: Link Drive Data */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <LinkIcon className="w-4 h-4 text-emerald-700" />
                Link Drive Data (Google Drive Arsip)
              </h3>
              <a
                href={driveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs font-semibold text-emerald-700 hover:text-emerald-900 flex items-center gap-1 hover:underline"
              >
                <span>Buka Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>

            <p className="text-xs text-slate-500 mb-3">
              Tautan penyimpanan cloud berkas scan asli peta warkah BPN beresolusi tinggi.
            </p>

            <input
              type="text"
              value={driveLink}
              onChange={(e) => setDriveLink(e.target.value)}
              placeholder="https://drive.google.com/drive/folders/..."
              className="w-full text-xs font-mono px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10"
            />
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">Sinkron otomatis ke modal preview publik</span>
            <button
              onClick={handleSaveConfig}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition"
            >
              <Save className="w-3.5 h-3.5" />
              Simpan Link
            </button>
          </div>
        </div>

        {/* Card 3: Informasi */}
        <div className="p-5 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <Info className="w-4 h-4 text-emerald-700" />
                Catatan Informasi & Pengumuman Arsip
              </h3>
            </div>

            <p className="text-xs text-slate-500 mb-2">
              Pengumuman resmi untuk petugas ukur atau pengunjung publik terkait prosedur temu warkah fisik.
            </p>

            <textarea
              rows={3}
              value={infoText}
              onChange={(e) => setInfoText(e.target.value)}
              placeholder="Masukkan informasi pelayanan arsip..."
              className="w-full text-xs px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10 resize-none"
            />
          </div>

          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-end">
            <button
              onClick={handleSaveConfig}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-900 text-white text-xs font-semibold transition"
            >
              <Save className="w-3.5 h-3.5" />
              Simpan Informasi
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Section (Matching Wireframe Gambar 4: 3 Image cards previewing maps) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
            <Layers className="w-4 h-4 text-emerald-700" />
            Pratinjau Gambar Sketsa Peta Terkini (Image Preview Grid)
          </h3>
          <span className="text-xs text-slate-500">
            Menampilkan sampel sketsa warkah tanah
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {recentMaps.map((map) => (
            <div
              key={map.id}
              onClick={() => onSelectMap(map)}
              className="group cursor-pointer rounded-2xl bg-white border border-slate-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col"
            >
              <div className="h-44 bg-[#FAF8F5] overflow-hidden border-b border-slate-100">
                <CadastralSketch
                  map={map}
                  interactive={false}
                  showControls={false}
                  className="w-full h-full transform group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-3.5 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-mono font-bold text-[10px]">
                      {map.kode}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono">
                      Lembar: {map.petunjukLembar}
                    </span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1 group-hover:text-emerald-700 transition">
                    {map.judul}
                  </h4>
                  <p className="text-[11px] text-slate-500 truncate mt-0.5">
                    {map.desa}, {map.kecamatan}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
