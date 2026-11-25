'use client';

import React from 'react';
import { AppComplaint } from '@/data/initialData';
import { 
  MessageSquare, 
  Trash2, 
  Phone, 
  Calendar,
  User
} from 'lucide-react';
import { saveStoredComplaints } from '@/lib/storage';

interface AdminComplaintsTabProps {
  complaints: AppComplaint[];
  onComplaintsUpdate: (updated: AppComplaint[]) => void;
}

export const AdminComplaintsTab: React.FC<AdminComplaintsTabProps> = ({
  complaints,
  onComplaintsUpdate
}) => {
  const handleDelete = (id: string) => {
    if (!confirm('Hapus pesan feedback ini?')) return;
    const updated = complaints.filter((c) => c.id !== id);
    saveStoredComplaints(updated);
    onComplaintsUpdate(updated);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Kotak Masuk Feedback & Masukan Pengguna
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Daftar feedback, saran, dan aspirasi yang dikirimkan pengguna melalui portal pencarian peta.
          </p>
        </div>
        <div className="self-start sm:self-auto px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold">
          {complaints.length} Feedback Diterima
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {complaints.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-sm">Belum ada feedback yang masuk</p>
            <p className="text-xs text-slate-400 mt-1">
              Feedback dari pengguna akan otomatis muncul di sini saat dikirimkan.
            </p>
          </div>
        ) : (
          complaints.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4 hover:border-slate-300 transition"
            >
              <div className="flex flex-col gap-2.5 flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <div className="flex items-center gap-1.5 font-bold text-slate-900 text-sm">
                    <User className="w-3.5 h-3.5 text-emerald-700" />
                    <span>{c.nama}</span>
                  </div>
                  <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono bg-slate-100 px-2.5 py-0.5 rounded-lg">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {c.kontak}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3 text-slate-400" />
                    {c.tanggal}
                  </span>
                </div>

                <div className="text-xs text-slate-700 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed break-words">
                  {c.keluhan}
                </div>
              </div>

              <div className="flex items-center self-end sm:self-start shrink-0">
                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition border border-transparent hover:border-rose-200 cursor-pointer"
                  title="Hapus Feedback Ini"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
