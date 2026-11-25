'use client';

import React, { useState, useMemo } from 'react';
import { 
  MapRecord, 
  MapProject 
} from '@/data/initialData';
import { 
  Search, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  CheckCircle2, 
  AlertCircle, 
  ChevronLeft, 
  ChevronRight,
  Filter,
  Download
} from 'lucide-react';

interface AdminDataTableTabProps {
  maps: MapRecord[];
  projects: MapProject[];
  onAddNew: () => void;
  onEdit: (map: MapRecord) => void;
  onDelete: (mapId: string) => void;
  onSelectMap: (map: MapRecord) => void;
}

export const AdminDataTableTab: React.FC<AdminDataTableTabProps> = ({
  maps,
  projects,
  onAddNew,
  onEdit,
  onDelete,
  onSelectMap
}) => {
  const [search, setSearch] = useState('');
  const [selectedProyek, setSelectedProyek] = useState<number | null>(null);
  const [selectedTtd, setSelectedTtd] = useState<string>('Semua');
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  // Filter Logic
  const filteredMaps = useMemo(() => {
    return maps.filter((map) => {
      const matchSearch =
        search.trim() === '' ||
        map.kode.toLowerCase().includes(search.toLowerCase()) ||
        map.judul.toLowerCase().includes(search.toLowerCase()) ||
        map.petunjukLembar.toLowerCase().includes(search.toLowerCase()) ||
        map.desa.toLowerCase().includes(search.toLowerCase()) ||
        map.kecamatan.toLowerCase().includes(search.toLowerCase());

      const matchProyek = selectedProyek === null || map.proyekId === selectedProyek;
      const matchTtd =
        selectedTtd === 'Semua' ||
        (selectedTtd === 'Ya' && map.ttd) ||
        (selectedTtd === 'Tidak' && !map.ttd);

      return matchSearch && matchProyek && matchTtd;
    });
  }, [maps, search, selectedProyek, selectedTtd]);

  // Pagination
  const totalPages = Math.ceil(filteredMaps.length / pageSize) || 1;
  const paginatedMaps = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredMaps.slice(start, start + pageSize);
  }, [filteredMaps, currentPage, pageSize]);

  // Export to CSV
  const handleExportCsv = () => {
    const headers = ['No,Kode,Judul,Petunjuk Lembar,Desa,Kecamatan,TTD,Proyek'];
    const rows = filteredMaps.map((m, idx) =>
      `"${idx + 1}","${m.kode}","${m.judul}","${m.petunjukLembar}","${m.desa}","${m.kecamatan}","${m.ttd ? 'Ya' : 'Tidak'}","${m.proyekNama}"`
    );
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `data_peta_bpn_export.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="flex flex-col gap-4">
      {/* Top Action Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Master Data Arsip Peta (CRUD Table)
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar lengkap 118 warkah peta pendaftaran, kapling transmigrasi, dan gambar situasi khusus
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCsv}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 transition shadow-xs"
            title="Ekspor ke format CSV"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Ekspor CSV</span>
          </button>

          <button
            onClick={onAddNew}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#16805C] hover:bg-[#0F5132] text-white text-xs font-bold transition shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>+ Tambah Peta Baru</span>
          </button>
        </div>
      </div>

      {/* Search & Filter Bar (Matching Gambar 4 Wireframe) */}
      <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Cari kode, judul, desa, kecamatan..."
            className="w-full text-xs pl-9 pr-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/10"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
          {/* Proyek Filter */}
          <select
            value={selectedProyek !== null ? selectedProyek : ''}
            onChange={(e) => {
              setSelectedProyek(e.target.value ? parseInt(e.target.value, 10) : null);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-600"
          >
            <option value="">Semua Proyek (21)</option>
            {projects.map((p) => (
              <option key={p.id} value={p.id}>
                {p.id}. {p.namaProyek}
              </option>
            ))}
          </select>

          {/* TTD Filter */}
          <select
            value={selectedTtd}
            onChange={(e) => {
              setSelectedTtd(e.target.value);
              setCurrentPage(1);
            }}
            className="text-xs bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-slate-700 focus:outline-none focus:border-emerald-600"
          >
            <option value="Semua">Status TTD: Semua</option>
            <option value="Ya">Bertandatangan (Ya)</option>
            <option value="Tidak">Belum TTD (Tidak)</option>
          </select>

          <span className="text-xs text-slate-400 font-mono pl-1">
            {filteredMaps.length} total
          </span>
        </div>
      </div>

      {/* Main Data Table (Gambar 4 Wireframe) */}
      <div className="rounded-2xl bg-white border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700">
            <thead className="bg-[#FAF8F5] text-slate-600 font-bold border-b border-slate-200/80 uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3.5 px-4 w-12 text-center">No</th>
                <th className="py-3.5 px-4 w-24">Kode</th>
                <th className="py-3.5 px-4 min-w-[200px]">Judul / Nama Peta</th>
                <th className="py-3.5 px-4 w-28">Lembar</th>
                <th className="py-3.5 px-4">Desa</th>
                <th className="py-3.5 px-4">Kecamatan</th>
                <th className="py-3.5 px-4 w-28 text-center">TTD</th>
                <th className="py-3.5 px-4 w-28 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedMaps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400">
                    Tidak ada arsip peta yang cocok dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                paginatedMaps.map((map, idx) => (
                  <tr
                    key={map.id}
                    className="hover:bg-slate-50/80 transition-colors group"
                  >
                    <td className="py-3 px-4 text-center font-mono text-slate-400">
                      {(currentPage - 1) * pageSize + idx + 1}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-emerald-800">
                      {map.kode}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-semibold text-slate-900 group-hover:text-emerald-700 transition">
                        {map.judul}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate max-w-xs">
                        {map.proyekNama}
                      </div>
                    </td>
                    <td className="py-3 px-4 font-mono text-slate-600">
                      {map.petunjukLembar}
                    </td>
                    <td className="py-3 px-4 font-medium text-slate-800">
                      {map.desa}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {map.kecamatan}
                    </td>
                    <td className="py-3 px-4 text-center">
                      {map.ttd ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          Ya
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-100 text-amber-900">
                          <AlertCircle className="w-3 h-3 text-amber-600" />
                          Tidak
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onSelectMap(map)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-emerald-700 transition"
                          title="Lihat Pratinjau Sketsa"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onEdit(map)}
                          className="p-1.5 hover:bg-slate-100 rounded-lg text-slate-500 hover:text-blue-700 transition"
                          title="Edit Metadata Peta"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onDelete(map.id)}
                          className="p-1.5 hover:bg-red-50 rounded-lg text-slate-400 hover:text-red-600 transition"
                          title="Hapus Data"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Bar */}
        <div className="p-3.5 border-t border-slate-100 bg-[#FAF8F5] flex items-center justify-between text-xs text-slate-500">
          <div>
            Menampilkan{' '}
            <strong className="text-slate-800">
              {filteredMaps.length > 0 ? (currentPage - 1) * pageSize + 1 : 0}
            </strong>{' '}
            -{' '}
            <strong className="text-slate-800">
              {Math.min(currentPage * pageSize, filteredMaps.length)}
            </strong>{' '}
            dari <strong className="text-slate-800">{filteredMaps.length}</strong> peta
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-mono text-xs">
              Halaman {currentPage} / {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-white transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
