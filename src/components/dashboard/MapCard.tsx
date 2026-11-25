'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MapRecord } from '@/data/initialData';
import { CadastralSketch } from '@/components/ui/CadastralSketch';
import { MapPin, Building2, Eye } from 'lucide-react';

interface MapCardProps {
  map: MapRecord;
  onSelect: (map: MapRecord) => void;
}

export const MapCard: React.FC<MapCardProps> = ({ map, onSelect }) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      whileHover={{ y: -3, transition: { duration: 0.15 } }}
      onClick={() => onSelect(map)}
      className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-md hover:border-[#16805C] transition-all cursor-pointer overflow-hidden"
    >
      {/* 1. GAMBAR (Sketsa Peta / Digitasi Peta) */}
      <div className="relative h-44 w-full bg-[#FAF8F5] overflow-hidden border-b border-slate-100">
        <CadastralSketch
          map={map}
          interactive={false}
          showControls={false}
          className="w-full h-full transform group-hover:scale-105 transition-transform duration-300"
        />

        {/* Hover Eye Overlay */}
        <div className="absolute inset-0 bg-[#2C3236]/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white text-[#2C3236] text-xs font-semibold shadow-md">
            <Eye className="w-3.5 h-3.5 text-[#16805C]" />
            Buka Sketsa & Detail
          </span>
        </div>
      </div>

      {/* Content Section: HANYA Menampilkan Judul, Proyek Induk, dan Lokasi */}
      <div className="p-4 flex flex-col justify-between flex-1">
        <div>
          {/* 2. JUDUL */}
          <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-[#16805C] transition-colors line-clamp-2">
            {map.judul}
          </h3>

          {/* 3. PROYEK INDUK (Tanpa scroll, truncate rapi) */}
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-600 font-medium overflow-hidden">
            <Building2 className="w-3.5 h-3.5 text-[#16805C] shrink-0" />
            <span className="truncate">{map.proyekNama}</span>
          </div>
        </div>

        {/* 4. LOKASI (Desa & Kecamatan) */}
        <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-1.5 text-xs text-slate-600">
          <MapPin className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#16805C] shrink-0 transition-colors" />
          <span className="truncate font-medium">
            {map.desa !== '-' ? map.desa : 'Semua Desa'}, Kec. {map.kecamatan}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

