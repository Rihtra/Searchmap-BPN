'use client';

import React, { useState, useEffect } from 'react';
import { 
  MapRecord, 
  MapProject, 
  SystemConfig, 
  AppComplaint,
  INITIAL_MAPS 
} from '@/data/initialData';
import { 
  getStoredMaps, 
  saveStoredMaps, 
  getStoredConfig, 
  saveStoredConfig, 
  getStoredComplaints, 
  getStoredProjects 
} from '@/lib/storage';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminDashboardTab } from '@/components/admin/AdminDashboardTab';
import { AdminDataTableTab } from '@/components/admin/AdminDataTableTab';
import { AdminComplaintsTab } from '@/components/admin/AdminComplaintsTab';
import { MapFormModal } from '@/components/admin/MapFormModal';
import { MapPreviewModal } from '@/components/modal/MapPreviewModal';
import { UserPlus, RefreshCw, AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'maps' | 'complaints' | 'settings'>('dashboard');
  const [maps, setMaps] = useState<MapRecord[]>([]);
  const [projects, setProjects] = useState<MapProject[]>([]);
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [complaints, setComplaints] = useState<AppComplaint[]>([]);
  
  // Modals state
  const [selectedPreviewMap, setSelectedPreviewMap] = useState<MapRecord | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMap, setEditingMap] = useState<MapRecord | null>(null);

  // Settings mock users
  const [adminUsers, setAdminUsers] = useState([
    { id: 'usr-1', nama: 'Petugas Arsip BPN', role: 'Super Admin', email: 'admin.pemetaan@bpn-siak.go.id' },
    { id: 'usr-2', nama: 'Juru Ukur Kadastral', role: 'Operator Ukur', email: 'juru.ukur@bpn-siak.go.id' }
  ]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('Operator Ukur');

  useEffect(() => {
    setMaps(getStoredMaps());
    setProjects(getStoredProjects());
    setConfig(getStoredConfig());
    setComplaints(getStoredComplaints());
  }, []);

  const handleSaveMap = (record: MapRecord) => {
    let updated: MapRecord[];
    if (editingMap) {
      updated = maps.map((m) => (m.id === record.id ? record : m));
    } else {
      updated = [record, ...maps];
    }
    setMaps(updated);
    saveStoredMaps(updated);
  };

  const handleDeleteMap = (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus data arsip peta ini?')) return;
    const updated = maps.filter((m) => m.id !== id);
    setMaps(updated);
    saveStoredMaps(updated);
  };

  const handleResetData = () => {
    if (!confirm('Kembalikan semua data peta ke setelan awal pabrik (118 peta asli)?')) return;
    saveStoredMaps(INITIAL_MAPS);
    setMaps(INITIAL_MAPS);
    alert('Data peta berhasil di-reset ke setelan awal.');
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUserName.trim() || !newUserEmail.trim()) return;
    setAdminUsers([
      ...adminUsers,
      {
        id: `usr-${Date.now()}`,
        nama: newUserName.trim(),
        role: newUserRole,
        email: newUserEmail.trim()
      }
    ]);
    setNewUserName('');
    setNewUserEmail('');
    alert('User petugas baru berhasil ditambahkan!');
  };

  if (!config) return null;

  return (
    <div className="h-screen w-screen bg-[#16805C] flex flex-col md:flex-row overflow-hidden font-sans antialiased">
      {/* Sentinel-Style Forest Green Sidebar (Fixed, Fit to screen height, No outer padding, No outer rounded corners) */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        complaintCount={complaints.filter((c) => c.status === 'Menunggu').length}
        totalMaps={maps.length}
      />

      {/* Main Content Area (White Canvas, Seamlessly connected to the active tab, rounded side corners) */}
      <main className="flex-1 bg-white my-3 mr-3 md:my-4 md:mr-4 lg:my-5 lg:mr-5 rounded-[24px] md:rounded-[36px] p-6 sm:p-8 lg:p-10 overflow-y-auto h-[calc(100vh-1.5rem)] md:h-[calc(100vh-2rem)] lg:h-[calc(100vh-2.5rem)] shadow-none border-none">
          {/* Top Breadcrumb Header (Sentinel Style) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 mb-6 border-b border-slate-100">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold tracking-widest text-emerald-700 uppercase">
                <span>BPN SIAK</span>
                <span className="text-slate-300">/</span>
                <span>SEKSI PENGUKURAN</span>
                <span className="text-slate-300">/</span>
                <span className="text-slate-500">{activeTab.toUpperCase()}</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight mt-1 truncate">
                {activeTab === 'dashboard' && 'Dashboard Pengelolaan Arsip Peta'}
                {activeTab === 'maps' && 'Master Data Arsip Warkah Tanah'}
                {activeTab === 'complaints' && 'Kotak Masuk Pengaduan & Keluhan'}
                {activeTab === 'settings' && 'Pengaturan Sistem & Manajemen User'}
              </h1>
            </div>

            <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
              <div className="text-right hidden sm:block">
                <span className="text-xs font-bold text-slate-800 block">Petugas Arsip BPN</span>
                <span className="text-[10px] text-emerald-700 font-medium font-mono">admin.pemetaan@bpn-siak.go.id</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center shadow-xs border border-emerald-200 shrink-0">
                BP
              </div>
            </div>
          </div>

          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            >
              {activeTab === 'dashboard' && (
                <AdminDashboardTab
                  maps={maps}
                  projects={projects}
                  config={config}
                  onConfigUpdate={setConfig}
                  onSelectMap={setSelectedPreviewMap}
                />
              )}

              {activeTab === 'maps' && (
                <AdminDataTableTab
                  maps={maps}
                  projects={projects}
                  onAddNew={() => {
                    setEditingMap(null);
                    setIsFormModalOpen(true);
                  }}
                  onEdit={(map) => {
                    setEditingMap(map);
                    setIsFormModalOpen(true);
                  }}
                  onDelete={handleDeleteMap}
                  onSelectMap={setSelectedPreviewMap}
                />
              )}

              {activeTab === 'complaints' && (
                <AdminComplaintsTab
                  complaints={complaints}
                  onComplaintsUpdate={setComplaints}
                />
              )}
            </motion.div>
          </AnimatePresence>

          {activeTab === 'settings' && (
            <motion.div
              key="settings"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
              className="flex flex-col gap-6"
            >
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs flex flex-col gap-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <UserPlus className="w-4 h-4 text-emerald-700" />
                    Daftar Petugas Pengelola Arsip
                  </h3>
                  <span className="text-xs text-slate-400 font-mono">
                    {adminUsers.length} Petugas Terdaftar
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {adminUsers.map((u) => (
                    <div
                      key={u.id}
                      className="p-3.5 rounded-2xl border border-slate-200 bg-white flex items-center justify-between shadow-xs"
                    >
                      <div>
                        <h4 className="font-bold text-xs text-slate-900">{u.nama}</h4>
                        <p className="text-[11px] text-slate-500">{u.email}</p>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                        {u.role}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Form Tambah User Baru */}
                <form onSubmit={handleAddUser} className="mt-2 pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row gap-3 items-end">
                  <div className="w-full sm:w-1/3">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nama Petugas</label>
                    <input
                      type="text"
                      required
                      value={newUserName}
                      onChange={(e) => setNewUserName(e.target.value)}
                      placeholder="Nama Lengkap"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div className="w-full sm:w-1/3">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email / NIP</label>
                    <input
                      type="email"
                      required
                      value={newUserEmail}
                      onChange={(e) => setNewUserEmail(e.target.value)}
                      placeholder="petugas@bpn-siak.go.id"
                      className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-emerald-600"
                    />
                  </div>
                  <div className="w-full sm:w-1/4">
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Peran Akses</label>
                    <select
                      value={newUserRole}
                      onChange={(e) => setNewUserRole(e.target.value)}
                      className="w-full text-xs bg-white px-3.5 py-2.5 rounded-xl border border-slate-300 text-slate-700"
                    >
                      <option value="Operator Ukur">Operator Ukur</option>
                      <option value="Verifikator Warkah">Verifikator Warkah</option>
                      <option value="Super Admin">Super Admin</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shrink-0"
                  >
                    + Tambah User
                  </button>
                </form>
              </div>

              {/* Reset Data & Maintenance */}
              <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 text-amber-600" />
                    Reset Basis Data ke 118 Peta Asli
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    Kembalikan dataset peta dan proyek ke data mentah awal Kementerian ATR/BPN Siak jika terjadi kesalahan uji coba.
                  </p>
                </div>

                <button
                  onClick={handleResetData}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 text-xs font-bold transition shrink-0"
                >
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  Reset Data Bawaan
                </button>
              </div>
            </motion.div>
          )}
        </main>

      {/* Modals */}
      <MapFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveMap}
        initialData={editingMap}
        projects={projects}
      />

      <MapPreviewModal
        map={selectedPreviewMap}
        onClose={() => setSelectedPreviewMap(null)}
        config={config}
      />
    </div>
  );
}
