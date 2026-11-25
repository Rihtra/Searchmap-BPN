'use client';

import React, { useState, useMemo } from 'react';
import { MapRecord, MapProject } from '@/data/initialData';
import { 
  Archive, 
  Search, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  Plus, 
  Eye, 
  Edit3, 
  Trash2, 
  Download, 
  MapPin, 
  Layers, 
  ArrowRight,
  ExternalLink,
  X,
  FolderOpen
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdminTabungTabProps {
  maps: MapRecord[];
  projects: MapProject[];
  onSelectMap: (map: MapRecord) => void;
  onEditMap: (map: MapRecord) => void;
  onDeleteMap: (mapId: string) => void;
  onAddNewToTabung: (tabungNumber: number, proyekId: number) => void;
  onNavigateToMapsTab: (proyekId: number) => void;
}

export const AdminTabungTab: React.FC<AdminTabungTabProps> = ({
  maps,
  projects,
  onSelectMap,
  onEditMap,
  onDeleteMap,
  onAddNewToTabung,
  onNavigateToMapsTab
}) => {
  const [search, setSearch] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedDetailTabung, setSelectedDetailTabung] = useState<number | null>(null);

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
      let signedCount = 0;

      mapsInTabung.forEach((m) => {
        if (m.desa && m.desa !== '-') desaSet.add(m.desa);
        if (m.kecamatan && m.kecamatan !== '-') {
          const kec = /sa[ui]\s*apit/i.test(m.kecamatan) ? 'Sei Apit' : m.kecamatan;
          kecSet.add(kec);
        }
        if (m.ttd) signedCount++;
      });

      return {
        tabungNumber,
        kodeTabung: `TABUNG ${tabungNumber}`,
        proyek: proj,
        count: mapsInTabung.length,
        signedCount,
        maps: mapsInTabung,
        desaList: Array.from(desaSet),
        kecList: Array.from(kecSet),
        kodeMin: mapsInTabung.length > 0 ? mapsInTabung[0].kode : `${tabungNumber}.01`,
        kodeMax: mapsInTabung.length > 0 ? mapsInTabung[mapsInTabung.length - 1].kode : `${tabungNumber}.01`
      };
    });
  }, [projects, maps]);

  // Filtered Tabung list
  const filteredTabung = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return tabungData;

    return tabungData.filter((t) => {
      const matchNum = t.tabungNumber.toString() === q || `tabung ${t.tabungNumber}`.toLowerCase().includes(q);
      const matchProyek = t.proyek.namaProyek.toLowerCase().includes(q);
      const matchDesa = t.desaList.some((d) => d.toLowerCase().includes(q));
      const matchKec = t.kecList.some((k) => k.toLowerCase().includes(q));
      const matchKode = t.maps.some((m) => m.kode.toLowerCase().includes(q) || m.judul.toLowerCase().includes(q));

      return matchNum || matchProyek || matchDesa || matchKec || matchKode;
    });
  }, [tabungData, search]);

  // Tabung selected for modal detail view
  const activeDetailData = useMemo(() => {
    if (selectedDetailTabung === null) return null;
    return tabungData.find((t) => t.tabungNumber === selectedDetailTabung) || null;
  }, [tabungData, selectedDetailTabung]);

  // Export CSV
  const handleExportCsv = () => {
    const headers = ['No Tabung,Kode Tabung,Nama Proyek,Jumlah Peta,Rentang Kode,Desa,Kecamatan'];
    const rows = tabungData.map((t) =>
      `"${t.tabungNumber}","${t.kodeTabung}","${t.proyek.namaProyek}","${t.count}","${t.kodeMin} - ${t.kodeMax}","${t.desaList.join('; ')}","${t.kecList.join('; ')}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inventaris_tabung_bpn_siak.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* ── Top Header & Stats ────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
            <Archive className="w-6 h-6 text-[#16805C]" />
            Inventaris & Manajemen Arsip Tabung (21 Tabung)
          </h2>
          <p className="text-xs text-slate-500 mt-1">
            Data klasifikasi tabung fisik warkah peta di Ruang Arsip Seksi Pengukuran Kantor Pertanahan Siak
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition cursor-pointer"
            title="Download CSV Rekap Tabung"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Ekspor CSV</span>
          </button>
        </div>
      </div>

      {/* ── Metrics Summary Cards ─────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Tabung Fisik</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{projects.length} Tabung</div>
          <div className="text-[10px] text-emerald-700 font-medium mt-0.5">Semua tabung terdaftar aktif</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Total Berkas Peta</div>
          <div className="text-2xl font-black text-slate-900 mt-1">{maps.length} Warkah</div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">Tersimpan dalam tabung</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Rata-Rata Isi</div>
          <div className="text-2xl font-black text-slate-900 mt-1">
            {(maps.length / Math.max(projects.length, 1)).toFixed(1)} <span className="text-xs font-normal text-slate-500">berkas</span>
          </div>
          <div className="text-[10px] text-slate-500 font-medium mt-0.5">Kepadatan per tabung</div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 shadow-2xs">
          <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">Status Tanda Tangan</div>
          <div className="text-2xl font-black text-emerald-800 mt-1">
            {maps.filter((m) => m.ttd).length} <span className="text-xs font-normal text-slate-500">/ {maps.length} TTD</span>
          </div>
          <div className="text-[10px] text-emerald-700 font-medium mt-0.5">
            {Math.round((maps.filter((m) => m.ttd).length / Math.max(maps.length, 1)) * 100)}% Berkas sah
          </div>
        </div>
      </div>

      {/* ── Search & View Mode Bar ────────────────────────── */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nomor tabung, nama proyek, desa, atau kode warkah..."
            className="w-full text-xs pl-9 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white focus:bg-white focus:outline-none focus:border-[#16805C] focus:ring-2 focus:ring-[#16805C]/10 transition"
          />
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <span className="text-xs text-slate-500 font-medium hidden sm:inline">
            Menampilkan {filteredTabung.length} dari {projects.length} Tabung
          </span>

          <div className="flex items-center p-1 rounded-xl bg-slate-100 border border-slate-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === 'grid' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Grid Kartu
            </button>
            <button
              onClick={() => setViewMode('table')}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition cursor-pointer ${
                viewMode === 'table' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500 hover:text-slate-900'
              }`}
            >
              Tabel Rekap
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabung Content Display ────────────────────────── */}
      {viewMode === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTabung.map((t) => (
            <div
              key={t.tabungNumber}
              className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
            >
              <div>
                {/* Header Badge & Count */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-xl text-xs font-black bg-[#16805C] text-white tracking-wide shadow-xs">
                      TABUNG {t.tabungNumber}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      ID #{t.proyek.id}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200/80">
                    {t.count} Peta
                  </span>
                </div>

                {/* Proyek Name */}
                <h3 className="font-extrabold text-sm text-slate-900 leading-snug line-clamp-2 group-hover:text-emerald-900 transition">
                  {t.proyek.namaProyek}
                </h3>

                {/* Code Range */}
                <div className="mt-3 p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-500 font-medium">Rentang Kode:</span>
                  <span className="font-mono font-bold text-slate-800">
                    {t.count > 0 ? `${t.kodeMin} — ${t.kodeMax}` : 'Belum Ada Berkas'}
                  </span>
                </div>

                {/* Locations */}
                <div className="mt-3 flex flex-col gap-1 text-[11px] text-slate-600">
                  <div className="flex items-start gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0 mt-0.5" />
                    <span className="truncate">
                      <strong>Desa:</strong> {t.desaList.length > 0 ? t.desaList.join(', ') : '-'}
                    </span>
                  </div>
                  <div className="flex items-start gap-1.5 truncate pl-5 text-slate-500">
                    <span className="truncate">
                      <strong>Kec:</strong> {t.kecList.length > 0 ? t.kecList.join(', ') : '-'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom Actions */}
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                <button
                  onClick={() => setSelectedDetailTabung(t.tabungNumber)}
                  className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-emerald-50 hover:bg-emerald-100/80 text-emerald-900 text-xs font-bold transition cursor-pointer"
                >
                  <FolderOpen className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Lihat {t.count} Berkas</span>
                </button>

                <button
                  onClick={() => onAddNewToTabung(t.tabungNumber, t.proyek.id)}
                  className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer"
                  title={`Tambah Berkas Peta Baru ke Tabung ${t.tabungNumber}`}
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Table View */
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF8F5] border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4 w-14">No</th>
                  <th className="py-3 px-4">Kode Tabung</th>
                  <th className="py-3 px-4">Nama Proyek Induk</th>
                  <th className="py-3 px-4 text-center">Jumlah Peta</th>
                  <th className="py-3 px-4">Rentang Kode</th>
                  <th className="py-3 px-4">Desa / Kecamatan</th>
                  <th className="py-3 px-4 text-center">Aksi Pengelolaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredTabung.map((t) => (
                  <tr key={t.tabungNumber} className="hover:bg-slate-50/80 transition">
                    <td className="py-3.5 px-4 font-mono font-bold text-slate-500">{t.tabungNumber}</td>
                    <td className="py-3.5 px-4">
                      <span className="px-2.5 py-1 rounded-lg text-[11px] font-black bg-[#16805C] text-white">
                        TABUNG {t.tabungNumber}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs">{t.proyek.namaProyek}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800">
                        {t.count} Berkas
                      </span>
                    </td>
                    <td className="py-3.5 px-4 font-mono text-slate-700">
                      {t.count > 0 ? `${t.kodeMin} - ${t.kodeMax}` : '-'}
                    </td>
                    <td className="py-3.5 px-4 text-[11px] text-slate-600 max-w-xs truncate">
                      {t.desaList.join(', ')} ({t.kecList.join(', ')})
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-1.5">
                        <button
                          onClick={() => setSelectedDetailTabung(t.tabungNumber)}
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Detail</span>
                        </button>
                        <button
                          onClick={() => onAddNewToTabung(t.tabungNumber, t.proyek.id)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                          title="Tambah Peta ke Tabung Ini"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Detail Drawer / Modal for Selected Tabung ────── */}
      <AnimatePresence>
        {activeDetailData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedDetailTabung(null)}
              className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-[#FAF8F5]">
                <div className="flex items-center gap-3">
                  <span className="px-3.5 py-1.5 rounded-xl text-sm font-black bg-[#16805C] text-white tracking-wide shadow-xs">
                    TABUNG {activeDetailData.tabungNumber}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                      {activeDetailData.proyek.namaProyek}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      Berisi {activeDetailData.count} Berkas Warkah Peta Fisik ({activeDetailData.signedCount} Bertandatangan)
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedDetailTabung(null)}
                  className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-full transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Modal Body: Map Table */}
              <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
                  <div className="text-xs text-slate-600">
                    <strong>Lokasi:</strong> {activeDetailData.desaList.join(', ')} • Kec. {activeDetailData.kecList.join(', ')}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        onAddNewToTabung(activeDetailData.tabungNumber, activeDetailData.proyek.id);
                        setSelectedDetailTabung(null);
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#16805C] hover:bg-[#11694A] text-white text-xs font-bold transition shadow-xs cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Tambah Peta ke Tabung {activeDetailData.tabungNumber}</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigateToMapsTab(activeDetailData.proyek.id);
                        setSelectedDetailTabung(null);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition cursor-pointer"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>Buka di Master Data Peta</span>
                    </button>
                  </div>
                </div>

                {activeDetailData.maps.length === 0 ? (
                  <div className="py-12 text-center text-slate-400">
                    <Archive className="w-10 h-10 mx-auto mb-2 text-slate-300" />
                    <p className="font-semibold text-sm">Belum ada peta yang dimasukkan ke Tabung ini.</p>
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200 overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-[#FAF8F5] border-b border-slate-200 text-[11px] font-bold text-slate-600 uppercase">
                        <tr>
                          <th className="py-2.5 px-3">Kode</th>
                          <th className="py-2.5 px-3">Judul Peta</th>
                          <th className="py-2.5 px-3">Lembar</th>
                          <th className="py-2.5 px-3">Desa</th>
                          <th className="py-2.5 px-3 text-center">Status TTD</th>
                          <th className="py-2.5 px-3 text-center">Aksi</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {activeDetailData.maps.map((m) => (
                          <tr key={m.id} className="hover:bg-slate-50/80">
                            <td className="py-2.5 px-3 font-mono font-bold text-emerald-800">{m.kode}</td>
                            <td className="py-2.5 px-3 font-semibold text-slate-900 max-w-xs truncate">{m.judul}</td>
                            <td className="py-2.5 px-3 font-mono text-slate-600">{m.petunjukLembar}</td>
                            <td className="py-2.5 px-3 text-slate-600">{m.desa}</td>
                            <td className="py-2.5 px-3 text-center">
                              {m.ttd ? (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  TTD Sah
                                </span>
                              ) : (
                                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800">
                                  Draf
                                </span>
                              )}
                            </td>
                            <td className="py-2.5 px-3 text-center">
                              <div className="flex items-center justify-center gap-1">
                                <button
                                  onClick={() => onSelectMap(m)}
                                  className="p-1.5 text-slate-500 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                                  title="Pratinjau Sketsa Peta"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => {
                                    onEditMap(m);
                                    setSelectedDetailTabung(null);
                                  }}
                                  className="p-1.5 text-slate-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition cursor-pointer"
                                  title="Edit Data Peta"
                                >
                                  <Edit3 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => onDeleteMap(m.id)}
                                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition cursor-pointer"
                                  title="Hapus Data Peta"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
