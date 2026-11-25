// src/lib/storage.ts
import { 
  MapRecord, 
  MapProject, 
  SystemConfig, 
  AppComplaint, 
  INITIAL_MAPS, 
  INITIAL_PROJECTS, 
  INITIAL_CONFIG, 
  INITIAL_COMPLAINTS 
} from '@/data/initialData';

const KEYS = {
  MAPS: 'bpn_maps_data_v1',
  CONFIG: 'bpn_config_data_v1',
  COMPLAINTS: 'bpn_complaints_data_v1',
  PROJECTS: 'bpn_projects_data_v1'
};

export const getStoredMaps = (): MapRecord[] => {
  if (typeof window === 'undefined') return INITIAL_MAPS;
  try {
    const item = localStorage.getItem(KEYS.MAPS);
    if (!item) {
      localStorage.setItem(KEYS.MAPS, JSON.stringify(INITIAL_MAPS));
      return INITIAL_MAPS;
    }
    const parsed: MapRecord[] = JSON.parse(item);
    return parsed.map((m) => {
      const tabung = m.tabungNumber || m.proyekId || parseInt(m.kode.split('.')[0] || '1', 10);
      const cleanKecamatan = /sa[ui]\s*apit/i.test(m.kecamatan) ? 'Sei Apit' : m.kecamatan;
      const cleanDesa = /sa[ui]\s*rawa/i.test(m.desa) ? 'Sei Rawa/Mengkapan' : m.desa;
      return {
        ...m,
        tabungNumber: tabung,
        kodeTabung: m.kodeTabung || `TABUNG ${tabung}`,
        kecamatan: cleanKecamatan,
        desa: cleanDesa
      };
    });
  } catch (err) {
    console.error('Failed reading maps from storage', err);
    return INITIAL_MAPS;
  }
};

export const saveStoredMaps = (maps: MapRecord[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.MAPS, JSON.stringify(maps));
    window.dispatchEvent(new Event('bpn_maps_updated'));
  } catch (err) {
    console.error('Failed saving maps to storage', err);
  }
};

export const getStoredConfig = (): SystemConfig => {
  if (typeof window === 'undefined') return INITIAL_CONFIG;
  try {
    const item = localStorage.getItem(KEYS.CONFIG);
    if (!item) {
      localStorage.setItem(KEYS.CONFIG, JSON.stringify(INITIAL_CONFIG));
      return INITIAL_CONFIG;
    }
    return JSON.parse(item);
  } catch (err) {
    console.error('Failed reading config from storage', err);
    return INITIAL_CONFIG;
  }
};

export const saveStoredConfig = (config: SystemConfig): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.CONFIG, JSON.stringify(config));
    window.dispatchEvent(new Event('bpn_config_updated'));
  } catch (err) {
    console.error('Failed saving config to storage', err);
  }
};

export const getStoredComplaints = (): AppComplaint[] => {
  if (typeof window === 'undefined') return INITIAL_COMPLAINTS;
  try {
    const item = localStorage.getItem(KEYS.COMPLAINTS);
    if (!item) {
      localStorage.setItem(KEYS.COMPLAINTS, JSON.stringify(INITIAL_COMPLAINTS));
      return INITIAL_COMPLAINTS;
    }
    return JSON.parse(item);
  } catch (err) {
    console.error('Failed reading complaints from storage', err);
    return INITIAL_COMPLAINTS;
  }
};

export const saveStoredComplaints = (complaints: AppComplaint[]): void => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(KEYS.COMPLAINTS, JSON.stringify(complaints));
    window.dispatchEvent(new Event('bpn_complaints_updated'));
  } catch (err) {
    console.error('Failed saving complaints to storage', err);
  }
};

export const getStoredProjects = (): MapProject[] => {
  if (typeof window === 'undefined') return INITIAL_PROJECTS;
  try {
    const item = localStorage.getItem(KEYS.PROJECTS);
    if (!item) {
      localStorage.setItem(KEYS.PROJECTS, JSON.stringify(INITIAL_PROJECTS));
      return INITIAL_PROJECTS;
    }
    return JSON.parse(item);
  } catch (err) {
    console.error('Failed reading projects from storage', err);
    return INITIAL_PROJECTS;
  }
};
