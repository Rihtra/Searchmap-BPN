'use client';

import React from 'react';
import { AppComplaint } from '@/data/initialData';
import { 
  MessageSquare, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Send,
  Phone,
  Calendar
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
  const handleUpdateStatus = (id: string, newStatus: 'Menunggu' | 'Ditindaklanjuti' | 'Selesai') => {
    const updated = complaints.map((c) =>
      c.id === id ? { ...c, status: newStatus } : c
    );
    saveStoredComplaints(updated);
    onComplaintsUpdate(updated);
  };

  const handleDelete = (id: string) => {
    if (!confirm('Hapus pesan keluhan ini?')) return;
    const updated = complaints.filter((c) => c.id !== id);
    saveStoredComplaints(updated);
    onComplaintsUpdate(updated);
  };

  return (
    <div className="flex flex-col gap-4">
      <div>
        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Kotak Masuk Keluhan & Pengaduan Masyarakat
        </h2>
        <p className="text-xs text-slate-500 mt-0.5">
          Daftar aspirasi, pertanyaan warkah, dan keluhan yang dikirimkan melalui tombol footer dashboard publik
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {complaints.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-2xl border border-slate-200 text-slate-400">
            <MessageSquare className="w-8 h-8 mx-auto mb-2 text-slate-300" />
            <p className="font-semibold text-sm">Belum ada keluhan masuk</p>
          </div>
        ) : (
          complaints.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-start justify-between gap-4"
            >
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-slate-900 text-sm">{c.nama}</h3>
                  <span className="flex items-center gap-1 text-[11px] text-slate-500 font-mono">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {c.kontak}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-400">
                    <Calendar className="w-3 h-3" />
                    {c.tanggal}
                  </span>
                </div>

                <p className="text-xs text-slate-700 bg-slate-50 p-3 rounded-xl border border-slate-100">
                  {c.keluhan}
                </p>
              </div>

              <div className="flex items-center sm:flex-col items-end gap-2 shrink-0">
                <select
                  value={c.status}
                  onChange={(e) =>
                    handleUpdateStatus(c.id, e.target.value as 'Menunggu' | 'Ditindaklanjuti' | 'Selesai')
                  }
                  className={`text-xs font-semibold px-2.5 py-1.5 rounded-xl border focus:outline-none ${
                    c.status === 'Selesai'
                      ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                      : c.status === 'Ditindaklanjuti'
                      ? 'bg-blue-50 text-blue-800 border-blue-300'
                      : 'bg-amber-50 text-amber-900 border-amber-300'
                  }`}
                >
                  <option value="Menunggu">Menunggu</option>
                  <option value="Ditindaklanjuti">Ditindaklanjuti</option>
                  <option value="Selesai">Selesai</option>
                </select>

                <button
                  onClick={() => handleDelete(c.id)}
                  className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
                  title="Hapus Pesan"
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
