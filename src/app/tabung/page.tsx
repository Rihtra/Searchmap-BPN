'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapRecord, 
  MapProject, 
  SystemConfig 
} from '@/data/initialData';
import { 
  getStoredMaps, 
  getStoredProjects, 
  getStoredConfig 
} from '@/lib/storage';
import { HeaderNav } from '@/components/dashboard/HeaderNav';
import { FooterDock } from '@/components/dashboard/FooterDock';
import { MapPreviewModal } from '@/components/modal/MapPreviewModal';
import { ComplaintModal } from '@/components/modal/ComplaintModal';
import { AppInfoModal } from '@/components/modal/AppInfoModal';
import { UserGuideModal } from '@/components/modal/UserGuideModal';
import { CadastralSketch } from '@/components/ui/CadastralSketch';
import { 
  Archive, 
  Search, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ArrowLeft,
  MapPin
} from 'lucide-react';

export default function TabungPage() {
  const [maps, setMaps] = useState<MapRecord[]>([]);
  const [projects, setProjects] = useState<MapProject[]>([]);
  const [config, setConfig] = useState<SystemConfig | null>(null);

  const [search, setSearch] = useState('');
  const [activeTabung, setActiveTabung] = useState<number | null>(null);
  const [selectedMap, setSelectedMap] = useState<MapRecord | null>(null);

  // Modals for footer dock
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  useEffect(() => {
    setMaps(getStoredMaps());
    setProjects(getStoredProjects());
    setConfig(getStoredConfig());
  }, []);

  // Group maps by Tabung Number (1 to 21)
  const tabungData = useMemo(() => {
    return projects.map((proj) => {
      const tabungNumber = proj.id;
      const mapsInTabung = maps.filter((m) => {
        const tNum = m.tabungNumber || m.proyekId || parseInt(m.kode.split('.')[0] || '1', 10);
        return tNum === tabungNumber;
      });

      // Find unique locations
      const desaSet = new Set<string>();
      const kecSet = new Set<string>();
      mapsInTabung.forEach((m) => {
        if (m.desa && m.desa !== '-') desaSet.add(m.desa);
        if (m.kecamatan && m.kecamatan !== '-') {
          const kec = /sa[ui]\s*apit/i.test(m.kecamatan) ? 'Sei Apit' : m.kecamatan;
          kecSet.add(kec);
        }
      });

      return {
        tabungNumber,
        kodeTabung: `TABUNG ${tabungNumber}`,
        proyek: proj,
        count: mapsInTabung.length,
        maps: mapsInTabung,
        desaList: Array.from(desaSet),
        kecList: Array.from(kecSet),
        kodeMin: mapsInTabung.length > 0 ? mapsInTabung[0].kode : `${tabungNumber}.01`,
        kodeMax: mapsInTabung.length > 0 ? mapsInTabung[mapsInTabung.length - 1].kode : `${tabungNumber}.01`
      };
    });
  }, [projects, maps]);

  // Filtered Tabung list based on search
  const filteredTabung = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tabungData;

    return tabungData.filter((t) => {
      const matchNum = t.tabungNumber.toString() === q || `tabung ${t.tabungNumber}`.includes(q);
      const matchProyek = t.proyek.namaProyek.toLowerCase().includes(q);
      const matchDesa = t.desaList.some((d) => d.toLowerCase().includes(q));
      const matchKec = t.kecList.some((k) => k.toLowerCase().includes(q));
      const matchKode = t.maps.some((m) => m.kode.toLowerCase().includes(q) || m.judul.toLowerCase().includes(q));

      return matchNum || matchProyek || matchDesa || matchKec || matchKode;
    });
  }, [tabungData, search]);

  const selectedTabungDetail = useMemo(() => {
    if (activeTabung === null) return null;
    return tabungData.find((t) => t.tabungNumber === activeTabung) || null;
  }, [tabungData, activeTabung]);

  if (!config) return null;

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-slate-800 flex flex-col font-sans">
      <HeaderNav totalMaps={maps.length} />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 flex flex-col">
        {/* Breadcrumb & Title */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-[#16805C] font-semibold mb-1">
              <Archive className="w-4 h-4 text-[#16805C]" />
              <span>SISTEM PENYIMPANAN FISIK WARKAH</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Data Arsip Tabung Peta (21 Tabung)
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 mt-1">
              Setiap proyek peta disimpan dalam tabung fisik bernomor di Ruang Warkah Kantor Pertanahan Siak.
            </p>
          </div>

          {/* Quick Tabung Search Input */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari Tabung (1-21) atau proyek..."
              className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-300 focus:outline-none focus:border-[#16805C] focus:ring-2 focus:ring-[#16805C]/15"
            />
          </div>
        </div>

        {/* View Mode: Selected Tabung Detail vs Tabung Grid List */}
        {selectedTabungDetail ? (
          /* View: Inside Selected Tabung */
          <div className="flex flex-col gap-5">
            {/* Back Button */}
            <button
              onClick={() => setActiveTabung(null)}
              className="self-start inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-xs font-semibold text-slate-700 transition"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Daftar 21 Tabung</span>
            </button>

            {/* Tabung Header Banner — Simplified: Nomor Tabung besar, jumlah gulungan, judul proyek */}
            <div className="p-6 rounded-3xl bg-gradient-to-br from-[#16805C] to-[#0F5A42] text-white shadow-md border border-[#16805C]/40">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <span className="text-xs uppercase font-mono tracking-widest text-white/60 font-bold block mb-2">
                    BERKAS WARKAH KADASTRAL
                  </span>
                  {/* Nomor Tabung — Besar & Bold */}
                  <div className="flex items-baseline gap-3">
                    <h2 className="text-6xl sm:text-7xl font-black font-mono tracking-tight text-white leading-none">
                      {selectedTabungDetail.tabungNumber}
                    </h2>
                    <div className="flex flex-col">
                      <span className="text-base font-bold text-white/80">TABUNG</span>
                      {/* Jumlah gulungan */}
                      <span className="text-2xl font-black text-emerald-300 font-mono">
                        {selectedTabungDetail.count} <span className="text-sm font-semibold text-white/70">gulungan</span>
                      </span>
                    </div>
                  </div>
                  {/* Judul / Nama Proyek */}
                  <p className="text-sm font-semibold text-white/90 mt-3 max-w-sm">
                    {selectedTabungDetail.proyek.namaProyek}
                  </p>
                </div>

                {/* Kecamatan badge */}
                <div className="shrink-0 px-4 py-2.5 rounded-2xl bg-white/10 border border-white/20 text-xs text-white/80">
                  <span className="block font-bold text-white mb-0.5 text-[11px] uppercase tracking-wide">Wilayah</span>
                  <span>{selectedTabungDetail.kecList.join(', ') || 'Siak'}</span>
                </div>
              </div>
            </div>

            {/* List of Maps Inside This Tabung */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#16805C]" />
                Daftar Gulungan Peta di dalam Tabung {selectedTabungDetail.tabungNumber} ({selectedTabungDetail.count} Peta)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedTabungDetail.maps.map((map, idx) => (
                  <motion.div
                    key={map.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: idx * 0.04, ease: [0.25, 0.1, 0.25, 1] }}
                    onClick={() => setSelectedMap(map)}
                    className="group cursor-pointer rounded-2xl bg-white border border-slate-200/90 hover:border-[#16805C] shadow-xs hover:shadow-md transition-all overflow-hidden flex flex-col"
                  >
                    {/* Gambar Sketsa Peta */}
                    <div className="relative w-full h-36 bg-slate-50 overflow-hidden border-b border-slate-100">
                      <CadastralSketch
                        map={map}
                        className="w-full h-full"
                        interactive={false}
                        showControls={false}
                      />
                      {/* Overlay kode di atas gambar */}
                      <div className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs font-mono font-bold text-[11px] text-slate-800 shadow-xs border border-slate-200">
                        {map.kode}
                      </div>
                      <div className="absolute top-2 right-2 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-xs text-[10px] font-medium text-slate-600">
                        Lbr: {map.petunjukLembar}
                      </div>
                    </div>

                    {/* Info bawah */}
                    <div className="p-3.5 flex flex-col flex-1">
                      <h4 className="font-bold text-slate-900 text-xs group-hover:text-[#16805C] transition line-clamp-2 leading-snug">
                        {map.judul}
                      </h4>

                      <div className="mt-auto pt-3 flex items-center justify-between text-[11px] text-slate-500">
                        <span className="flex items-center gap-1 truncate max-w-[150px]">
                          <MapPin className="w-3 h-3 text-[#16805C] shrink-0" />
                          {map.desa !== '-' ? map.desa : 'Semua Desa'}
                        </span>
                        {map.ttd ? (
                          <span className="flex items-center gap-1 text-[#16805C] font-semibold bg-emerald-50 px-2 py-0.5 rounded-full shrink-0">
                            <CheckCircle2 className="w-3 h-3" /> TTD
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-amber-700 font-semibold bg-amber-50 px-2 py-0.5 rounded-full shrink-0">
                            <AlertCircle className="w-3 h-3" /> Tanpa TTD
                          </span>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* View: 21 Tabung Grid Cards — Simplified: Nomor, Jumlah, Judul */
          <motion.div
            key="tabung-grid"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1] }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTabung.map((t, idx) => (
                <motion.div
                  key={t.tabungNumber}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.25, delay: idx * 0.03, ease: [0.25, 0.1, 0.25, 1] }}
                  onClick={() => setActiveTabung(t.tabungNumber)}
                  className="group cursor-pointer p-5 rounded-2xl bg-white border border-slate-200/90 hover:border-[#16805C] shadow-xs hover:shadow-md transition-all flex items-center gap-4 relative overflow-hidden"
                >
                  {/* Nomor Tabung besar di kiri */}
                  <div className="shrink-0 w-14 h-14 rounded-2xl bg-[#16805C] flex flex-col items-center justify-center text-white shadow-sm group-hover:scale-105 transition-transform">
                    <span className="text-[10px] font-bold text-white/70 uppercase tracking-wide leading-none">No.</span>
                    <span className="text-2xl font-black font-mono leading-none">{t.tabungNumber}</span>
                  </div>

                  {/* Jumlah gulungan + Judul */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-[#16805C] border border-emerald-200">
                        {t.count} gulungan
                      </span>
                    </div>
                    <h3 className="font-bold text-slate-900 text-xs sm:text-sm line-clamp-2 leading-snug group-hover:text-[#16805C] transition">
                      {t.proyek.namaProyek}
                    </h3>
                  </div>

                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[#16805C] group-hover:translate-x-1 transition-all shrink-0" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Footer Dock */}
        <FooterDock
          onOpenComplaint={() => setIsComplaintOpen(true)}
          onOpenInfo={() => setIsInfoOpen(true)}
          onOpenGuide={() => setIsGuideOpen(true)}
        />
      </main>

      {/* Modals */}
      <MapPreviewModal
        map={selectedMap}
        onClose={() => setSelectedMap(null)}
        config={config}
      />

      <ComplaintModal
        isOpen={isComplaintOpen}
        onClose={() => setIsComplaintOpen(false)}
      />

      <AppInfoModal
        isOpen={isInfoOpen}
        onClose={() => setIsInfoOpen(false)}
        config={config}
      />

      <UserGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}

