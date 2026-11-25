'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { 
  MapRecord, 
  MapProject, 
  SystemConfig, 
  AppComplaint,
  AdminUser,
  AdminSession,
  INITIAL_MAPS 
} from '@/data/initialData';
import { 
  getStoredMaps, 
  saveStoredMaps, 
  getStoredConfig, 
  getStoredComplaints, 
  getStoredProjects 
} from '@/lib/storage';
import { 
  getCurrentSession, 
  logoutAdmin, 
  getStoredUsers, 
  registerUser, 
  deleteUser 
} from '@/lib/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminDashboardTab } from '@/components/admin/AdminDashboardTab';
import { AdminDataTableTab } from '@/components/admin/AdminDataTableTab';
import { AdminTabungTab } from '@/components/admin/AdminTabungTab';
import { AdminComplaintsTab } from '@/components/admin/AdminComplaintsTab';
import { MapFormModal } from '@/components/admin/MapFormModal';
import { MapPreviewModal } from '@/components/modal/MapPreviewModal';
import { 
  UserPlus, 
  RefreshCw, 
  AlertTriangle, 
  Trash2, 
  Lock, 
  ShieldCheck, 
  KeyRound 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function AdminPage() {
  const router = useRouter();

  // Authentication State
  const [session, setSession] = useState<AdminSession | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  // Dashboard Data State
  const [activeTab, setActiveTab] = useState<'dashboard' | 'maps' | 'tabung' | 'complaints' | 'settings'>('dashboard');
  const [maps, setMaps] = useState<MapRecord[]>([]);
  const [projects, setProjects] = useState<MapProject[]>([]);
  const [config, setConfig] = useState<SystemConfig | null>(null);
  const [complaints, setComplaints] = useState<AppComplaint[]>([]);
  
  // Modals state
  const [selectedPreviewMap, setSelectedPreviewMap] = useState<MapRecord | null>(null);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingMap, setEditingMap] = useState<MapRecord | null>(null);

  // User Management State
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [newUserName, setNewUserName] = useState('');
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');

  useEffect(() => {
    // 1. Enforce strict authentication check
    const currentSession = getCurrentSession();
    if (!currentSession) {
      router.replace('/admin/login');
      return;
    }

    setSession(currentSession);
    setIsAuthChecking(false);

    // 2. Load stored datasets
    setMaps(getStoredMaps());
    setProjects(getStoredProjects());
    setConfig(getStoredConfig());
    setComplaints(getStoredComplaints());
    setAdminUsers(getStoredUsers());

    // 3. Listen to auth and user update events
    const handleAuthChange = () => {
      const active = getCurrentSession();
      if (!active) {
        router.replace('/admin/login');
      } else {
        setSession(active);
      }
    };

    const handleUsersChange = () => {
      setAdminUsers(getStoredUsers());
    };

    window.addEventListener('bpn_auth_changed', handleAuthChange);
    window.addEventListener('bpn_users_updated', handleUsersChange);

    return () => {
      window.removeEventListener('bpn_auth_changed', handleAuthChange);
      window.removeEventListener('bpn_users_updated', handleUsersChange);
    };
  }, [router]);

  const handleLogout = () => {
    if (confirm('Apakah Anda yakin ingin keluar dari sesi Dashboard Admin?')) {
      logoutAdmin();
      router.replace('/admin/login');
    }
  };

  const handleSaveMap = (record: MapRecord) => {
    let updated: MapRecord[];
    if (editingMap && editingMap.id) {
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
    if (!newUserName.trim() || !newUserEmail.trim()) {
      alert('Nama dan email wajib diisi.');
      return;
    }

    const result = registerUser({
      nama: newUserName.trim(),
      email: newUserEmail.trim(),
      password: newUserPassword.trim() || 'bpnsiak2026'
    });

    if (result.success) {
      alert(`User admin ${newUserName.trim()} berhasil didaftarkan!`);
      setNewUserName('');
      setNewUserEmail('');
      setNewUserPassword('');
      setAdminUsers(getStoredUsers());
    } else {
      alert(result.error || 'Gagal menambahkan user admin.');
    }
  };

  const handleDeleteUser = (userId: string, userName: string) => {
    if (!confirm(`Hapus akun petugas "${userName}" dari sistem?`)) return;
    const result = deleteUser(userId, session?.user.id);
    if (result.success) {
      setAdminUsers(getStoredUsers());
      alert('Akun petugas berhasil dihapus.');
    } else {
      alert(result.error || 'Gagal menghapus user.');
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return 'BP';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  // Loading Screen while authenticating
  if (isAuthChecking || !session) {
    return (
      <div className="h-screen w-screen bg-[#16805C] flex flex-col items-center justify-center p-6 text-white font-sans antialiased">
        <div className="relative w-16 h-16 rounded-2xl bg-white p-2.5 shadow-2xl flex items-center justify-center mb-4">
          <Image
            src="/logos/bpn_base_clean.png"
            alt="Logo BPN"
            width={48}
            height={48}
            className="object-contain"
            priority
          />
        </div>
        <div className="flex items-center gap-2 mb-2">
          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          <span className="text-sm font-bold tracking-tight">Memverifikasi Hak Akses Petugas...</span>
        </div>
        <p className="text-xs text-white/70 font-mono">Keamanan Portal Seksi Pengukuran BPN Siak</p>
      </div>
    );
  }

  if (!config) return null;

  return (
    <div className="h-screen w-screen bg-[#16805C] flex flex-col md:flex-row overflow-hidden font-sans antialiased">
      {/* Sentinel-Style Forest Green Sidebar */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        complaintCount={complaints.length}
        totalMaps={maps.length}
        totalTabung={projects.length}
        currentUser={session.user}
        onLogout={handleLogout}
      />

      {/* Main Content Area */}
      <main className="flex-1 bg-white my-3 mr-3 md:my-4 md:mr-4 lg:my-5 lg:mr-5 rounded-[24px] md:rounded-[36px] flex flex-col h-[calc(100vh-1.5rem)] md:h-[calc(100vh-2rem)] lg:h-[calc(100vh-2.5rem)] overflow-hidden shadow-none border-none">
        {/* Fixed Top Breadcrumb Header (Sticky & Non-scrollable) */}
        <div className="shrink-0 px-6 pt-5 sm:px-8 sm:pt-6 lg:px-10 lg:pt-7 pb-5 border-b border-slate-100 bg-white z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
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
              {activeTab === 'tabung' && 'Inventaris & Manajemen Arsip Tabung (21)'}
              {activeTab === 'complaints' && 'Kotak Masuk Feedback & Masukan Pengguna'}
              {activeTab === 'settings' && 'Pengaturan Sistem & Manajemen User'}
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
            <div className="text-right hidden sm:block">
              <span className="text-xs font-bold text-slate-800 block">{session.user.nama}</span>
              <span className="text-[10px] text-emerald-700 font-medium font-mono">{session.user.email}</span>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-900 font-bold flex items-center justify-center shadow-xs border border-emerald-200 shrink-0">
              {getInitials(session.user.nama)}
            </div>
          </div>
        </div>

        {/* Scrollable Content Body Area */}
        <div className="flex-1 overflow-y-auto px-6 sm:px-8 lg:px-10 py-6">
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

            {activeTab === 'tabung' && (
              <AdminTabungTab
                maps={maps}
                projects={projects}
                onSelectMap={setSelectedPreviewMap}
                onEditMap={(map) => {
                  setEditingMap(map);
                  setIsFormModalOpen(true);
                }}
                onDeleteMap={handleDeleteMap}
                onAddNewToTabung={(tabungNumber, proyekId) => {
                  const proj = projects.find((p) => p.id === proyekId);
                  setEditingMap({
                    id: '',
                    kode: `${tabungNumber}.`,
                    tabungNumber: tabungNumber,
                    kodeTabung: `TABUNG ${tabungNumber}`,
                    proyekId: proyekId,
                    proyekNama: proj ? proj.namaProyek : `Proyek ${proyekId}`,
                    judul: 'Peta Kapling Pendaftaran Tanah',
                    petunjukLembar: '',
                    desa: '',
                    kecamatan: 'Siak Sri Indrapura',
                    ttd: true,
                    skala: '1:1000',
                    tahunArsip: '1994'
                  });
                  setIsFormModalOpen(true);
                }}
                onNavigateToMapsTab={() => {
                  setActiveTab('maps');
                }}
              />
            )}

            {activeTab === 'complaints' && (
              <AdminComplaintsTab
                complaints={complaints}
                onComplaintsUpdate={setComplaints}
              />
            )}

            {activeTab === 'settings' && (
              <div className="flex flex-col gap-6">
                {/* Security Session Badge Banner */}
                <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200/80 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-600 text-white flex items-center justify-center shrink-0">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-emerald-950">
                        Sistem Autentikasi Admin Aktif — Terlindungi
                      </h4>
                      <p className="text-[11px] text-emerald-800">
                        Login sebagai <strong>{session.user.nama}</strong> (Admin) • Sesi terenkripsi di peramban.
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-3 py-1.5 rounded-xl bg-white border border-emerald-300 hover:bg-emerald-100/70 text-emerald-900 text-xs font-bold transition shrink-0 cursor-pointer"
                  >
                    Ganti Akun / Logout
                  </button>
                </div>

                {/* User Management List */}
                <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 shadow-xs flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                        <UserPlus className="w-4 h-4 text-emerald-700" />
                        Daftar Akun Admin BPN
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Kelola akun yang memiliki hak akses untuk masuk ke Dashboard Admin BPN.
                      </p>
                    </div>
                    <span className="text-xs text-slate-500 font-mono bg-white px-3 py-1 rounded-full border border-slate-200">
                      {adminUsers.length} Admin Terdaftar
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-1">
                    {adminUsers.map((u) => {
                      const isCurrentUser = u.id === session.user.id;
                      return (
                        <div
                          key={u.id}
                          className={`p-4 rounded-2xl border ${
                            isCurrentUser ? 'border-emerald-500/80 bg-emerald-50/30' : 'border-slate-200 bg-white'
                          } flex items-center justify-between gap-3 shadow-xs`}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <h4 className="font-bold text-xs text-slate-900 truncate">{u.nama}</h4>
                              {isCurrentUser && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-600 text-white">
                                  Anda
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-slate-500 font-mono truncate">{u.email}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                                Admin
                              </span>
                              {u.password && (
                                <span className="text-[10px] text-slate-400 flex items-center gap-1 font-mono">
                                  <Lock className="w-3 h-3 text-slate-400" />
                                  ••••••••
                                </span>
                              )}
                            </div>
                          </div>

                          {!isCurrentUser && (
                            <button
                              onClick={() => handleDeleteUser(u.id, u.nama)}
                              className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition border border-transparent hover:border-rose-200 shrink-0 cursor-pointer"
                              title="Hapus akun admin ini"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Form Tambah User Baru */}
                  <form onSubmit={handleAddUser} className="mt-2 pt-5 border-t border-slate-200/60 flex flex-col gap-3">
                    <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                      <KeyRound className="w-3.5 h-3.5 text-emerald-700" />
                      <span>Form Pendaftaran Akun Admin Baru</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-end">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Nama Admin</label>
                        <input
                          type="text"
                          required
                          value={newUserName}
                          onChange={(e) => setNewUserName(e.target.value)}
                          placeholder="Nama Lengkap Admin"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email Resmi BPN</label>
                        <input
                          type="email"
                          required
                          value={newUserEmail}
                          onChange={(e) => setNewUserEmail(e.target.value)}
                          placeholder="admin@bpn-siak.go.id"
                          className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-emerald-600"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-600 mb-1">Kata Sandi / Password</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            required
                            value={newUserPassword}
                            onChange={(e) => setNewUserPassword(e.target.value)}
                            placeholder="Minimal 6 karakter"
                            className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-emerald-600"
                          />
                          <button
                            type="submit"
                            className="px-4 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition shrink-0 cursor-pointer"
                          >
                            + Tambah
                          </button>
                        </div>
                      </div>
                    </div>
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
                    className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 text-xs font-bold transition shrink-0 cursor-pointer"
                  >
                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                    Reset Data Bawaan
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        </div>
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
