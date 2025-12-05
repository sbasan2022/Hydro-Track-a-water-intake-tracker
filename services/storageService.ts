import { WaterEntry } from '../types';

const STORAGE_KEY = 'hydrotrack_entries';

export const getEntries = (): WaterEntry[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error("Failed to load entries", error);
    return [];
  }
};

export const saveEntry = (entry: WaterEntry): WaterEntry[] => {
  const current = getEntries();
  const updated = [...current, entry];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const clearAllEntries = (): void => {
  localStorage.removeItem(STORAGE_KEY);
};

export const deleteEntryById = (id: string): WaterEntry[] => {
  const current = getEntries();
  const updated = current.filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};
