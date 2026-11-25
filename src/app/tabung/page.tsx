'use client';

import React, { useState, useEffect, useMemo } from 'react';
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
            <div className="flex items-center gap-2 text-xs text-[#525B61] font-semibold mb-1">
              <Archive className="w-4 h-4 text-[#525B61]" />
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
              className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl bg-white border border-slate-300 focus:outline-none focus:border-[#525B61] focus:ring-2 focus:ring-[#525B61]/15"
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

            {/* Tabung Header Banner in Slate Gradient */}
            <div className="p-6 rounded-3xl bg-gradient-to-r from-[#242A2E] via-[#3D4449] to-[#525B61] text-white shadow-md border border-[#525B61]/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <span className="text-xs uppercase font-mono tracking-widest text-[#D4D9DB] font-bold block">
                  BERKAS WARKAH KADASTRAL
                </span>
                <h2 className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white mt-1">
                  TABUNG {selectedTabungDetail.tabungNumber}
                </h2>
                <p className="text-sm text-[#E8ECEE] font-medium mt-1">
                  {selectedTabungDetail.proyek.namaProyek}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="px-3 py-1 rounded-full bg-white/15 backdrop-blur-xs font-mono font-bold">
                    Rentang Kode: {selectedTabungDetail.kodeMin} - {selectedTabungDetail.kodeMax}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-[#E8ECEE] text-[#2C3236] font-bold">
                    {selectedTabungDetail.count} Gulungan Peta
                  </span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/10 border border-white/20 text-xs flex flex-col gap-1.5 min-w-[220px]">
                <span className="font-bold text-[#D4D9DB] text-[11px] uppercase">Cakupan Wilayah</span>
                <div className="text-white text-xs font-medium">
                  {selectedTabungDetail.desaList.length > 0 ? selectedTabungDetail.desaList.join(', ') : 'Wilayah Kabupaten Siak'}
                </div>
                <div className="text-[#D4D9DB] text-[11px]">
                  Kec. {selectedTabungDetail.kecList.join(', ')}
                </div>
              </div>
            </div>

            {/* List of Maps Inside This Tabung */}
            <div>
              <h3 className="text-base font-bold text-slate-900 mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#525B61]" />
                Daftar Gulungan Peta di dalam Tabung {selectedTabungDetail.tabungNumber} ({selectedTabungDetail.count} Peta)
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedTabungDetail.maps.map((map) => (
                  <div
                    key={map.id}
                    onClick={() => setSelectedMap(map)}
                    className="group cursor-pointer p-4 rounded-2xl bg-white border border-slate-200/90 hover:border-[#525B61] shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="px-2.5 py-0.5 rounded-full bg-[#E8ECEE] text-[#2C3236] font-mono font-bold text-xs">
                          Kode: {map.kode}
                        </span>
                        <span className="text-[11px] font-mono text-slate-500">
                          Lbr: {map.petunjukLembar}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-900 text-sm group-hover:text-[#525B61] transition line-clamp-2">
                        {map.judul}
                      </h4>
                    </div>

                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                      <span className="flex items-center gap-1 truncate max-w-[180px]">
                        <MapPin className="w-3.5 h-3.5 text-[#525B61] shrink-0" />
                        {map.desa !== '-' ? map.desa : 'Semua Desa'}
                      </span>
                      {map.ttd ? (
                        <span className="text-[10px] text-[#2C3236] font-semibold flex items-center gap-1 bg-[#E8ECEE] px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3 h-3 text-[#525B61]" /> TTD
                        </span>
                      ) : (
                        <span className="text-[10px] text-amber-700 font-semibold flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full">
                          <AlertCircle className="w-3 h-3" /> Tanpa TTD
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* View: 21 Tabung Grid Cards */
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredTabung.map((t) => (
                <div
                  key={t.tabungNumber}
                  onClick={() => setActiveTabung(t.tabungNumber)}
                  className="group cursor-pointer p-5 rounded-3xl bg-white border border-slate-200/90 hover:border-[#525B61] shadow-xs hover:shadow-md transition-all flex flex-col justify-between relative overflow-hidden"
                >
                  {/* Decorative Background Accent in #525B61 */}
                  <div className="absolute -right-4 -bottom-4 w-28 h-28 bg-[#525B61]/5 rounded-full blur-xl pointer-events-none group-hover:bg-[#525B61]/10 transition-colors" />

                  <div>
                    {/* Header: Tabung Number & Canister Icon */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2.5">
                        <div className="w-11 h-11 rounded-2xl bg-[#525B61] text-white flex flex-col items-center justify-center font-mono font-black shadow-xs">
                          <Archive className="w-5 h-5 text-[#E8ECEE]" />
                        </div>
                        <div>
                          <span className="text-xl font-black font-mono text-slate-900 block group-hover:text-[#525B61] transition">
                            TABUNG {t.tabungNumber}
                          </span>
                          <span className="text-[10px] font-mono text-slate-400 block">
                            Kode: {t.tabungNumber}.xx
                          </span>
                        </div>
                      </div>

                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#E8ECEE] text-[#2C3236] border border-[#CBD2D6]">
                        {t.count} Peta
                      </span>
                    </div>

                    {/* Proyek Name */}
                    <h3 className="font-bold text-slate-900 text-sm line-clamp-2 leading-snug group-hover:text-[#525B61] transition">
                      {t.proyek.namaProyek}
                    </h3>

                    {/* Rentang Kode */}
                    <div className="mt-2 text-xs font-mono text-slate-500 flex items-center gap-1.5">
                      <span className="text-slate-400">Rentang:</span>
                      <strong className="text-slate-700 font-semibold">{t.kodeMin}</strong>
                      <span>s/d</span>
                      <strong className="text-slate-700 font-semibold">{t.kodeMax}</strong>
                    </div>
                  </div>

                  {/* Bottom: Lokasi & Action */}
                  <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between text-xs">
                    <div className="flex items-center gap-1 text-slate-500 truncate max-w-[180px]">
                      <MapPin className="w-3.5 h-3.5 text-[#525B61] shrink-0" />
                      <span className="truncate">
                        {t.kecList.length > 0 ? t.kecList.join(', ') : 'Siak'}
                      </span>
                    </div>

                    <span className="flex items-center gap-1 font-semibold text-[#525B61] group-hover:translate-x-1 transition-transform">
                      Buka Isi Tabung
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
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
