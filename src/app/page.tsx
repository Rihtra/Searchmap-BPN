'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
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
import { MotionWelcome } from '@/components/loading/MotionWelcome';
import { HeaderNav } from '@/components/dashboard/HeaderNav';
import { SearchHero } from '@/components/dashboard/SearchHero';
import { MapResultGrid } from '@/components/dashboard/MapResultGrid';
import { FooterDock } from '@/components/dashboard/FooterDock';
import { MapPreviewModal } from '@/components/modal/MapPreviewModal';
import { ComplaintModal } from '@/components/modal/ComplaintModal';
import { AppInfoModal } from '@/components/modal/AppInfoModal';
import { UserGuideModal } from '@/components/modal/UserGuideModal';
import { Search, Eye, Archive, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [showLoading, setShowLoading] = useState(true);
  const [maps, setMaps] = useState<MapRecord[]>([]);
  const [projects, setProjects] = useState<MapProject[]>([]);
  const [config, setConfig] = useState<SystemConfig | null>(null);

  // Search & Filters (Clean, without TTD & without Proyek dropdown)
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedKecamatan, setSelectedKecamatan] = useState('Semua');

  // Requirement 1: Bagian dashboard awal TIDAK menampilkan apapun, dan ada tombol tampil semua
  const [showAll, setShowAll] = useState(false);

  // Modals
  const [selectedMap, setSelectedMap] = useState<MapRecord | null>(null);
  const [isComplaintOpen, setIsComplaintOpen] = useState(false);
  const [isInfoOpen, setIsInfoOpen] = useState(false);
  const [isGuideOpen, setIsGuideOpen] = useState(false);

  useEffect(() => {
    setMaps(getStoredMaps());
    setProjects(getStoredProjects());
    setConfig(getStoredConfig());

    const handleMapsUpdate = () => setMaps(getStoredMaps());
    const handleConfigUpdate = () => setConfig(getStoredConfig());

    window.addEventListener('bpn_maps_updated', handleMapsUpdate);
    window.addEventListener('bpn_config_updated', handleConfigUpdate);

    return () => {
      window.removeEventListener('bpn_maps_updated', handleMapsUpdate);
      window.removeEventListener('bpn_config_updated', handleConfigUpdate);
    };
  }, []);

  // Requirement 6: Hapus sau apit / sai apit dan ganti dengan sei apit
  const kecamatanList = useMemo(() => {
    const list = new Set<string>();
    maps.forEach((m) => {
      let kec = m.kecamatan;
      if (!kec || kec === '-') return;
      if (/sa[ui]\s*apit/i.test(kec)) {
        kec = 'Sei Apit';
      }
      const parts = kec.split(' dan ');
      parts.forEach((p) => {
        const trimmed = p.trim();
        if (/sa[ui]\s*apit/i.test(trimmed)) {
          list.add('Sei Apit');
        } else {
          list.add(trimmed);
        }
      });
    });
    return Array.from(list).sort();
  }, [maps]);

  // Filtered Results
  const filteredMaps = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return maps.filter((m) => {
      const kec = /sa[ui]\s*apit/i.test(m.kecamatan) ? 'Sei Apit' : m.kecamatan;
      const matchesSearch =
        !query ||
        m.kode.toLowerCase().includes(query) ||
        m.judul.toLowerCase().includes(query) ||
        m.petunjukLembar.toLowerCase().includes(query) ||
        m.desa.toLowerCase().includes(query) ||
        kec.toLowerCase().includes(query) ||
        m.proyekNama.toLowerCase().includes(query) ||
        (m.kodeTabung && m.kodeTabung.toLowerCase().includes(query));

      const matchesKecamatan =
        selectedKecamatan === 'Semua' ||
        kec.toLowerCase().includes(selectedKecamatan.toLowerCase());

      return matchesSearch && matchesKecamatan;
    });
  }, [maps, searchQuery, selectedKecamatan]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedKecamatan('Semua');
    setShowAll(false);
  };

  const isFilterActive = searchQuery.trim() !== '' || selectedKecamatan !== 'Semua';
  const shouldShowResults = showAll || isFilterActive;

  if (!config) return null;

  return (
    <div className="min-h-screen bg-[#F7F6F2] text-slate-800 flex flex-col font-sans">
      {/* 1. Motion Welcome Loading Screen */}
      <AnimatePresence>
        {showLoading && (
          <MotionWelcome onFinish={() => setShowLoading(false)} autoDismissMs={2800} />
        )}
      </AnimatePresence>

      {/* Main App Content (Portal Admin removed from header) */}
      <HeaderNav
        totalMaps={maps.length}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-8 flex flex-col">
        {/* Search Hero with Pills & Instant Query (Clean without TTD & Proyek scroll) */}
        <SearchHero
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedKecamatan={selectedKecamatan}
          onKecamatanChange={setSelectedKecamatan}
          kecamatanList={kecamatanList}
          totalResults={filteredMaps.length}
          showAll={showAll}
          onToggleShowAll={() => setShowAll((prev) => !prev)}
        />

        {/* Dynamic Display Area: Empty State vs Search Results */}
        <div className="flex-1">
          {shouldShowResults ? (
            /* Search Results Grid (Cards with Image, Judul, Proyek Induk, Lokasi) */
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-slate-500">
                  Menampilkan {filteredMaps.length} arsip warkah peta
                </span>
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-[#16805C] hover:text-[#2C3236] font-semibold"
                >
                  Bersihkan Pencarian
                </button>
              </div>

              <MapResultGrid
                maps={filteredMaps}
                onSelectMap={(map) => setSelectedMap(map)}
                onResetFilter={handleResetFilters}
              />
            </div>
          ) : (
            /* Requirement 1: Bagian dashboard awal tidak menampilkan apapun + Tombol Tampil Semua */
            <div className="my-12 py-16 px-6 rounded-3xl bg-white border border-slate-200/80 shadow-xs flex flex-col items-center justify-center text-center max-w-2xl mx-auto">
              <div className="w-16 h-16 rounded-2xl bg-[#E8ECEE] text-[#16805C] flex items-center justify-center mb-4 shadow-inner">
                <Search className="w-8 h-8 text-[#16805C]" />
              </div>

              <h3 className="text-xl font-bold text-slate-900">
                Sistem Siap Melakukan Pencarian
              </h3>
              <p className="text-xs sm:text-sm text-slate-500 max-w-md mt-2 leading-relaxed">
                Ketik nomor kode (contoh: <span className="font-mono text-[#16805C] font-semibold">1.08</span>, <span className="font-mono text-[#16805C] font-semibold">2.15</span>), nama desa, atau nama proyek pada kolom di atas, atau klik tombol di bawah untuk menampilkan seluruh inventaris peta.
              </p>

              {/* Action Buttons in Initial State */}
              <div className="mt-6 flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => setShowAll(true)}
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-[#16805C] hover:bg-[#3D4449] text-white text-xs sm:text-sm font-bold transition shadow-xs hover:shadow"
                >
                  <Eye className="w-4 h-4" />
                  <span>Tampilkan Semua Peta (118 Berkas)</span>
                </button>

                <Link
                  href="/tabung"
                  className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs sm:text-sm font-semibold transition"
                >
                  <Archive className="w-4 h-4 text-[#16805C]" />
                  <span>Jelajahi Berdasarkan Tabung (21 Tabung)</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {/* Quick Suggestion Pills */}
              <div className="mt-8 pt-6 border-t border-slate-100 w-full flex flex-col items-center">
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
                  Pencarian Cepat Populer:
                </span>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {['PIR ADB Sei Buatan', 'Dayun', 'Sikemang', 'Tuah Indrapura', '1.08', '2.01', '13.01'].map((tag) => (
                    <button
                      key={tag}
                      onClick={() => setSearchQuery(tag)}
                      className="px-2.5 py-1 rounded-lg bg-slate-50 hover:bg-[#E8ECEE] hover:text-[#16805C] text-slate-600 text-xs border border-slate-200 transition"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Action Dock (Gambar 3 Wireframe) */}
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

