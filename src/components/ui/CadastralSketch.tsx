'use client';

import React, { useState } from 'react';
import { ZoomIn, ZoomOut, RotateCcw, Compass, CheckCircle2, AlertCircle } from 'lucide-react';
import { MapRecord } from '@/data/initialData';

interface CadastralSketchProps {
  map: MapRecord;
  interactive?: boolean;
  className?: string;
  showControls?: boolean;
}

export const CadastralSketch: React.FC<CadastralSketchProps> = ({
  map,
  interactive = true,
  className = '',
  showControls = true
}) => {
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });

  // Generate deterministic variations based on map code numbers
  const seed = map.kode.split('.').reduce((acc, part) => acc + parseInt(part || '1', 10), 0);
  const parcelCount = 6 + (seed % 6); // 6 to 11 parcels

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!interactive) return;
    setIsDragging(true);
    setStartPos({ x: e.clientX - pan.x, y: e.clientY - pan.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !interactive) return;
    setPan({
      x: e.clientX - startPos.x,
      y: e.clientY - startPos.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const zoomIn = () => setZoom((prev) => Math.min(prev + 0.25, 2.5));
  const zoomOut = () => setZoom((prev) => Math.max(prev - 0.25, 0.75));
  const resetZoom = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-[#FBF9F3] border border-amber-900/15 select-none shadow-inner ${className}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ cursor: interactive ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
    >
      {/* Interactive Controls Overlay */}
      {showControls && interactive && (
        <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-2.5 py-1.5 rounded-lg border border-amber-900/20 shadow-sm">
          <button
            onClick={zoomIn}
            className="p-1 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded transition"
            title="Perbesar (Zoom In)"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={zoomOut}
            className="p-1 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded transition"
            title="Perkecil (Zoom Out)"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={resetZoom}
            className="p-1 text-slate-700 hover:text-emerald-700 hover:bg-emerald-50 rounded transition"
            title="Reset Tampilan"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
          <span className="text-[11px] font-mono text-slate-500 pl-1 border-l border-slate-200">
            {Math.round(zoom * 100)}%
          </span>
        </div>
      )}

      {/* SVG Cadastral Map Canvas */}
      <div
        className="w-full h-full transition-transform duration-75 origin-center flex items-center justify-center p-2"
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`
        }}
      >
        <svg
          viewBox="0 0 800 550"
          className="w-full h-auto max-h-[500px] drop-shadow-sm font-sans"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id={`grid-${map.id}`} width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#E2DAC9" strokeWidth="0.75" />
              <circle cx="0" cy="0" r="1.5" fill="#B3A894" />
            </pattern>

            {/* Cadastral Lot Hatch */}
            <pattern id={`hatch-${map.id}`} width="10" height="10" patternTransform="rotate(45)" patternUnits="userSpaceOnUse">
              <line x1="0" y1="0" x2="0" y2="10" stroke="#CBD5E1" strokeWidth="0.6" strokeDasharray="2,2" />
            </pattern>

            {/* Official Stamp Filter */}
            <filter id={`stamp-${map.id}`} x="-10%" y="-10%" width="120%" height="120%">
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="3" result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale="2" />
            </filter>
          </defs>

          {/* Paper Background */}
          <rect x="10" y="10" width="780" height="530" fill="#FDFCFA" rx="4" />
          <rect x="25" y="25" width="750" height="500" fill={`url(#grid-${map.id})`} stroke="#4A3E31" strokeWidth="1.8" />
          <rect x="28" y="28" width="744" height="494" fill="none" stroke="#8C7A65" strokeWidth="0.8" strokeDasharray="8,3" />

          {/* Coordinate Ticks */}
          <text x="35" y="20" fontSize="9" fill="#71624F" fontFamily="monospace">0° 42' 10" N</text>
          <text x="380" y="20" fontSize="9" fill="#71624F" fontFamily="monospace">101° 55' 00" E</text>
          <text x="700" y="20" fontSize="9" fill="#71624F" fontFamily="monospace">0° 42' 50" N</text>

          {/* Compass Rose (Arah Mata Angin) */}
          <g transform="translate(710, 80)">
            <circle cx="0" cy="0" r="28" fill="#FFFDF8" stroke="#5A4A38" strokeWidth="1.2" />
            <path d="M 0 -24 L 5 -5 L 24 0 L 5 5 L 0 24 L -5 5 L -24 0 L -5 -5 Z" fill="#D4AF37" stroke="#4A3828" strokeWidth="0.8" />
            <polygon points="0,-24 0,0 5,-5" fill="#525B61" />
            <polygon points="0,-24 0,0 -5,-5" fill="#3D4449" />
            <text x="0" y="-27" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#3D4449">U</text>
            <text x="28" y="4" textAnchor="start" fontSize="9" fill="#5A4A38">T</text>
            <text x="0" y="34" textAnchor="middle" fontSize="9" fill="#5A4A38">S</text>
            <text x="-28" y="4" textAnchor="end" fontSize="9" fill="#5A4A38">B</text>
          </g>

          {/* Surrounding Roads & Features */}
          {/* Main Road (Jalan Poros) */}
          <path
            d="M 50 180 Q 200 170 420 190 T 730 180"
            fill="none"
            stroke="#C4B5A5"
            strokeWidth="22"
            strokeLinecap="round"
          />
          <path
            d="M 50 180 Q 200 170 420 190 T 730 180"
            fill="none"
            stroke="#8A7662"
            strokeWidth="1.2"
            strokeDasharray="6,4"
          />
          <text x="180" y="174" fontSize="10" fill="#5A4532" fontWeight="600">JALAN POROS UTAMA DESA</text>

          {/* Secondary Road */}
          <path
            d="M 320 185 L 330 460"
            fill="none"
            stroke="#D6C7B7"
            strokeWidth="14"
            strokeLinecap="round"
          />
          <text x="340" y="320" fontSize="9" fill="#6B5643" transform="rotate(88 340 320)">JALAN PRODUKSI / LORONG</text>

          {/* Waterway / Canal (Parit Primer) */}
          <path
            d="M 60 470 Q 260 460 500 480 T 740 465"
            fill="none"
            stroke="#93C5FD"
            strokeWidth="6"
            strokeOpacity="0.75"
          />
          <text x="520" y="468" fontSize="9" fill="#1E40AF" fontStyle="italic">Saluran Drainase Primer</text>

          {/* Cadastral Parcels (Kapling-Kapling Bidang Tanah) */}
          <g transform="translate(60, 205)">
            {/* Parcel Block A1 */}
            <polygon
              points="0,0 120,5 115,110 0,105"
              fill={`url(#hatch-${map.id})`}
              stroke="#2E7D32"
              strokeWidth="1.6"
            />
            <rect x="35" y="35" width="50" height="35" rx="3" fill="#FFFFFF" fillOpacity="0.85" stroke="#2E7D32" strokeWidth="0.8" />
            <text x="60" y="50" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1B5E20">KAPLING 01</text>
            <text x="60" y="63" textAnchor="middle" fontSize="8.5" fill="#4B5563">20.000 m²</text>

            {/* Parcel Block A2 */}
            <polygon
              points="120,5 240,12 235,115 115,110"
              fill="#F4FBF7"
              stroke="#2E7D32"
              strokeWidth="1.6"
            />
            <rect x="155" y="40" width="50" height="35" rx="3" fill="#FFFFFF" fillOpacity="0.85" stroke="#2E7D32" strokeWidth="0.8" />
            <text x="180" y="55" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#1B5E20">KAPLING 02</text>
            <text x="180" y="68" textAnchor="middle" fontSize="8.5" fill="#4B5563">19.850 m²</text>

            {/* Parcel Block B1 (Target Map Highlight) */}
            <polygon
              points="285,15 410,22 405,120 280,118"
              fill="#E8ECEE"
              stroke="#525B61"
              strokeWidth="2.2"
            />
            <circle cx="345" cy="65" r="28" fill="#525B61" fillOpacity="0.1" />
            <rect x="315" y="45" width="65" height="42" rx="4" fill="#FFFFFF" stroke="#525B61" strokeWidth="1.2" />
            <text x="347" y="60" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#2C3236">BIDANG ARSIP</text>
            <text x="347" y="73" textAnchor="middle" fontSize="12" fontWeight="800" fill="#3D4449">NO. {map.petunjukLembar || '01'}</text>
            <text x="347" y="83" textAnchor="middle" fontSize="8" fill="#525B61">KODE: {map.kode}</text>

            {/* Parcel Block B2 */}
            <polygon
              points="410,22 530,28 525,125 405,120"
              fill="#FBFDFB"
              stroke="#2E7D32"
              strokeWidth="1.6"
            />
            <text x="465" y="70" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#374151">KAPLING 04</text>
            <text x="465" y="82" textAnchor="middle" fontSize="8.5" fill="#6B7280">20.120 m²</text>

            {/* Lower Parcels Row */}
            <polygon
              points="0,115 115,120 110,225 0,220"
              fill="#FFFDF8"
              stroke="#2E7D32"
              strokeWidth="1.4"
            />
            <text x="55" y="170" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#4B5563">KAPLING 05</text>
            <text x="55" y="182" textAnchor="middle" fontSize="8" fill="#6B7280">Pekarangan</text>

            <polygon
              points="115,120 235,125 230,230 110,225"
              fill="#FFFDF8"
              stroke="#2E7D32"
              strokeWidth="1.4"
            />
            <text x="172" y="170" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#4B5563">KAPLING 06</text>
            <text x="172" y="182" textAnchor="middle" fontSize="8" fill="#6B7280">Lahan Pangan</text>
          </g>

          {/* Boundary Marker Pegs (Patok Batas BPN) */}
          <g fill="#DC2626" stroke="#991B1B" strokeWidth="0.8">
            <circle cx="60" cy="205" r="3.5" />
            <circle cx="180" cy="210" r="3.5" />
            <circle cx="300" cy="217" r="3.5" />
            <circle cx="345" cy="220" r="4.5" fill="#EF4444" stroke="#7F1D1D" strokeWidth="1.5" />
            <circle cx="470" cy="227" r="3.5" />
            <circle cx="590" cy="233" r="3.5" />
            <text x="352" y="218" fontSize="8" fontWeight="bold" fill="#DC2626">BPN-043</text>
          </g>

          {/* OFFICIAL TITLE BLOCK (Kartush Peta BPN Siak) */}
          <g transform="translate(480, 270)">
            <rect x="0" y="0" width="280" height="235" fill="#FFFDF8" stroke="#3E3022" strokeWidth="1.6" rx="3" />
            <rect x="4" y="4" width="272" height="227" fill="none" stroke="#685542" strokeWidth="0.8" />

            {/* Header Instansi */}
            <rect x="4" y="4" width="272" height="34" fill="#3D4449" />
            <text x="140" y="18" textAnchor="middle" fontSize="9.5" fontWeight="bold" fill="#FFFFFF">KEMENTERIAN AGRARIA DAN TATA RUANG / BPN</text>
            <text x="140" y="30" textAnchor="middle" fontSize="8.5" fill="#E8ECEE">KANTOR PERTANAHAN KABUPATEN SIAK</text>

            {/* Judul Peta */}
            <text x="14" y="52" fontSize="8" fill="#6B7280" fontWeight="600">NAMA / JUDUL PETA:</text>
            <text x="14" y="65" fontSize="9.5" fontWeight="bold" fill="#111827">
              {map.judul.length > 36 ? map.judul.substring(0, 36) + '...' : map.judul}
            </text>

            {/* Proyek Induk */}
            <text x="14" y="80" fontSize="8" fill="#6B7280" fontWeight="600">PROYEK ASAL:</text>
            <text x="14" y="92" fontSize="8.5" fill="#1F2937">
              {map.proyekNama.length > 40 ? map.proyekNama.substring(0, 40) + '...' : map.proyekNama}
            </text>

            <line x1="8" y1="100" x2="272" y2="100" stroke="#E5E7EB" strokeWidth="1" />

            {/* Data Grid: Kode, Lembar, Skala */}
            <text x="14" y="115" fontSize="8" fill="#6B7280">NOMOR KODE:</text>
            <text x="90" y="115" fontSize="9.5" fontWeight="bold" fill="#525B61">{map.kode}</text>

            <text x="150" y="115" fontSize="8" fill="#6B7280">LEMBAR:</text>
            <text x="210" y="115" fontSize="9" fontWeight="bold" fill="#1F2937">{map.petunjukLembar || '-'}</text>

            <text x="14" y="132" fontSize="8" fill="#6B7280">LOKASI DESA:</text>
            <text x="90" y="132" fontSize="8.5" fontWeight="600" fill="#1F2937">
              {map.desa.length > 24 ? map.desa.substring(0, 24) + '..' : map.desa}
            </text>

            <text x="14" y="147" fontSize="8" fill="#6B7280">KECAMATAN:</text>
            <text x="90" y="147" fontSize="8.5" fontWeight="600" fill="#1F2937">{map.kecamatan}</text>

            <text x="14" y="162" fontSize="8" fill="#6B7280">SKALA PETA:</text>
            <text x="90" y="162" fontSize="8.5" fontFamily="monospace" fill="#1F2937">{map.skala || '1:1000'}</text>

            <text x="150" y="162" fontSize="8" fill="#6B7280">TAHUN:</text>
            <text x="210" y="162" fontSize="8.5" fill="#1F2937">{map.tahunArsip || '1992'}</text>

            {/* Graphic Scale Bar */}
            <g transform="translate(14, 178)">
              <rect x="0" y="0" width="25" height="4" fill="#111827" />
              <rect x="25" y="0" width="25" height="4" fill="#FFFFFF" stroke="#111827" strokeWidth="0.8" />
              <rect x="50" y="0" width="25" height="4" fill="#111827" />
              <rect x="75" y="0" width="25" height="4" fill="#FFFFFF" stroke="#111827" strokeWidth="0.8" />
              <text x="0" y="11" fontSize="6.5" fill="#4B5563">0</text>
              <text x="48" y="11" fontSize="6.5" fill="#4B5563">50m</text>
              <text x="95" y="11" fontSize="6.5" fill="#4B5563">100m</text>
            </g>

            {/* Stamp & Verification Section */}
            <line x1="8" y1="195" x2="272" y2="195" stroke="#E5E7EB" strokeWidth="1" />
            {map.ttd ? (
              <g transform="translate(140, 214)">
                <rect x="-65" y="-12" width="130" height="20" rx="3" fill="#E8ECEE" stroke="#525B61" strokeWidth="1" />
                <text x="0" y="2" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#2C3236">
                  ✓ DISAHKAN & BERTANDATANGAN
                </text>
              </g>
            ) : (
              <g transform="translate(140, 214)">
                <rect x="-65" y="-12" width="130" height="20" rx="3" fill="#FEF3C7" stroke="#D97706" strokeWidth="1" />
                <text x="0" y="2" textAnchor="middle" fontSize="8" fontWeight="bold" fill="#B45309">
                  ⚠ BELUM BERTANDATANGAN
                </text>
              </g>
            )}
          </g>
        </svg>
      </div>

      {/* Footer Meta Badge in Component */}
      <div className="absolute bottom-2 left-2 z-10 flex items-center gap-2 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-300 text-[11px] shadow-xs">
        <span className="font-semibold text-[#2C3236]">Sketsa Kadastral Asli</span>
        <span className="text-slate-300">|</span>
        <span className="text-slate-600 font-mono">Lembar: {map.petunjukLembar || '-'}</span>
        <span className="text-slate-300">|</span>
        {map.ttd ? (
          <span className="flex items-center gap-1 text-[#525B61] font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> Sah BPN
          </span>
        ) : (
          <span className="flex items-center gap-1 text-amber-700 font-medium">
            <AlertCircle className="w-3.5 h-3.5" /> Tanpa TTD
          </span>
        )}
      </div>
    </div>
  );
};
