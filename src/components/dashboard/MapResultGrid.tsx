'use client';

import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { MapRecord } from '@/data/initialData';
import { MapCard } from './MapCard';
import { SearchX, RotateCcw } from 'lucide-react';

interface MapResultGridProps {
  maps: MapRecord[];
  onSelectMap: (map: MapRecord) => void;
  onResetFilter: () => void;
}

export const MapResultGrid: React.FC<MapResultGridProps> = ({
  maps,
  onSelectMap,
  onResetFilter
}) => {
  if (maps.length === 0) {
    return (
      <div className="w-full py-16 flex flex-col items-center justify-center text-center bg-white rounded-2xl border border-dashed border-slate-300 p-8 my-6">
        <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
          <SearchX className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-bold text-slate-800">Tidak ada peta yang sesuai</h3>
        <p className="text-sm text-slate-500 max-w-md mt-1">
          Coba periksa kembali kata kunci pencarian Anda, ganti pilihan kecamatan, atau ubah filter tanda tangan.
        </p>
        <button
          onClick={onResetFilter}
          className="mt-5 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Reset Semua Filter
        </button>
      </div>
    );
  }

  return (
    <div className="w-full my-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        <AnimatePresence mode="popLayout">
          {maps.map((map) => (
            <MapCard key={map.id} map={map} onSelect={onSelectMap} />
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
};
