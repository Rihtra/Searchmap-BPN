// src/lib/auth.ts
import { AdminUser, AdminSession, INITIAL_ADMIN_USERS } from '@/data/initialData';

const AUTH_KEYS = {
  USERS: 'bpn_admin_users_v3',
  SESSION: 'bpn_admin_session_v3'
};

export const getStoredUsers = (): AdminUser[] => {
  if (typeof window === 'undefined') return INITIAL_ADMIN_USERS;
  try {
    const item = localStorage.getItem(AUTH_KEYS.USERS);
    if (!item) {
      localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(INITIAL_ADMIN_USERS));
      return INITIAL_ADMIN_USERS;
    }
    const parsed: AdminUser[] = JSON.parse(item);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(INITIAL_ADMIN_USERS));
      return INITIAL_ADMIN_USERS;
    }
    return parsed;
  } catch (err) {
    console.error('Failed reading admin users from storage', err);
    return INITIAL_ADMIN_USERS;
  }
};

export const saveStoredUsers = (users: AdminUser[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(users));
    window.dispatchEvent(new Event('bpn_users_updated'));
  } catch (err) {
    console.error('Failed saving admin users to storage', err);
  }
};

export const getCurrentSession = (): AdminSession | null => {
  if (typeof window === 'undefined') return null;
  try {
    const item = localStorage.getItem(AUTH_KEYS.SESSION);
    if (!item) return null;
    const session: AdminSession = JSON.parse(item);
    if (!session || !session.user || !session.user.id) return null;
    return session;
  } catch (err) {
    console.error('Failed reading admin session from storage', err);
    return null;
  }
};

export const loginAdmin = (
  emailInput: string,
  passwordInput: string
): { success: boolean; error?: string; session?: AdminSession } => {
  if (typeof window === 'undefined') {
    return { success: false, error: 'Lingkungan klien tidak tersedia.' };
  }

  const cleanEmail = emailInput.trim().toLowerCase();
  const cleanPassword = passwordInput.trim();

  if (!cleanEmail || !cleanPassword) {
    return { success: false, error: 'Email dan kata sandi wajib diisi.' };
  }

  const users = getStoredUsers();
  const foundUser = users.find((u) => u.email.trim().toLowerCase() === cleanEmail);

  if (!foundUser) {
    return {
      success: false,
      error: 'Akun Admin dengan email tersebut tidak terdaftar di sistem BPN.'
    };
  }

  if (foundUser.password !== cleanPassword) {
    return {
      success: false,
      error: 'Kata sandi / password salah. Silakan periksa kembali.'
    };
  }

  // Update last login
  const now = new Date().toISOString();
  const updatedUsers = users.map((u) =>
    u.id === foundUser.id ? { ...u, lastLogin: now } : u
  );
  saveStoredUsers(updatedUsers);

  // Generate session
  const session: AdminSession = {
    user: {
      id: foundUser.id,
      nama: foundUser.nama,
      email: foundUser.email,
      role: 'Admin'
    },
    token: `bpn-token-${foundUser.id}-${Date.now()}`,
    loginTime: now
  };

  try {
    localStorage.setItem(AUTH_KEYS.SESSION, JSON.stringify(session));
    window.dispatchEvent(new Event('bpn_auth_changed'));
  } catch (err) {
    console.error('Failed saving session to storage', err);
  }

  return { success: true, session };
};

export const logoutAdmin = (): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(AUTH_KEYS.SESSION);
    window.dispatchEvent(new Event('bpn_auth_changed'));
  } catch (err) {
    console.error('Failed removing session from storage', err);
  }
};

export const registerUser = (
  userData: {
    nama: string;
    email: string;
    password?: string;
  }
): { success: boolean; error?: string; user?: AdminUser } => {
  const cleanEmail = userData.email.trim().toLowerCase();
  const cleanNama = userData.nama.trim();
  const cleanPassword = (userData.password || 'bpnsiak2026').trim();

  if (!cleanEmail || !cleanNama) {
    return { success: false, error: 'Nama dan email wajib diisi.' };
  }

  if (cleanPassword.length < 6) {
    return { success: false, error: 'Kata sandi minimal 6 karakter.' };
  }

  const users = getStoredUsers();
  const exists = users.some((u) => u.email.trim().toLowerCase() === cleanEmail);
  if (exists) {
    return { success: false, error: 'Email tersebut sudah terdaftar pada akun Admin lain.' };
  }

  const newUser: AdminUser = {
    id: `usr-${Date.now()}`,
    nama: cleanNama,
    email: cleanEmail,
    password: cleanPassword,
    role: 'Admin',
    createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
  };

  const updated = [...users, newUser];
  saveStoredUsers(updated);

  return { success: true, user: newUser };
};

export const deleteUser = (
  userId: string,
  currentUserId?: string
): { success: boolean; error?: string } => {
  if (currentUserId && userId === currentUserId) {
    return { success: false, error: 'Anda tidak dapat menghapus akun Admin yang sedang aktif digunakan.' };
  }

  const users = getStoredUsers();
  const userToDelete = users.find((u) => u.id === userId);
  if (!userToDelete) {
    return { success: false, error: 'User Admin tidak ditemukan.' };
  }

  // Prevent deleting the last remaining Admin
  if (users.length <= 1) {
    return {
      success: false,
      error: 'Tidak dapat menghapus akun Admin terakhir dari sistem.'
    };
  }

  const updated = users.filter((u) => u.id !== userId);
  saveStoredUsers(updated);
  return { success: true };
};

export const updateUserPassword = (
  userId: string,
  newPass: string
): { success: boolean; error?: string } => {
  const cleanPass = newPass.trim();
  if (cleanPass.length < 6) {
    return { success: false, error: 'Kata sandi minimal 6 karakter.' };
  }

  const users = getStoredUsers();
  const updated = users.map((u) => (u.id === userId ? { ...u, password: cleanPass } : u));
  saveStoredUsers(updated);
  return { success: true };
};
