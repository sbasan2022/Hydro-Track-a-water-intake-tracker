import { WaterEntry, PlantStats, AutoLogConfig } from '../types';

const STORAGE_KEY = 'hydrotrack_entries';
const GOAL_KEY = 'hydrotrack_goal';
const PLANT_KEY = 'hydrotrack_plant';
const AUTOLOG_KEY = 'hydrotrack_autolog';

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
  localStorage.removeItem(PLANT_KEY);
  // We generally don't clear settings like Goal or AutoLog config on data clear, 
  // but if requested we could. For now, keeping preferences is better UX.
};

export const deleteEntryById = (id: string): WaterEntry[] => {
  const current = getEntries();
  const updated = current.filter(e => e.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
};

export const getDailyGoal = (): number => {
  try {
    const stored = localStorage.getItem(GOAL_KEY);
    return stored ? parseFloat(stored) : 2.5; // Default 2.5L
  } catch {
    return 2.5;
  }
};

export const saveDailyGoal = (goal: number): void => {
  localStorage.setItem(GOAL_KEY, goal.toString());
};

export const getPlantStats = (): PlantStats => {
  try {
    const data = localStorage.getItem(PLANT_KEY);
    return data ? JSON.parse(data) : { height: 1, lastGrowthDate: '' }; 
  } catch {
    return { height: 1, lastGrowthDate: '' };
  }
};

export const savePlantStats = (stats: PlantStats): void => {
  localStorage.setItem(PLANT_KEY, JSON.stringify(stats));
};

export const getAutoLogConfig = (): AutoLogConfig => {
  try {
    const data = localStorage.getItem(AUTOLOG_KEY);
    // Default: 9am to 6pm, disabled
    return data ? JSON.parse(data) : { 
      startTime: '09:00', 
      endTime: '18:00', 
      enabled: false, 
      lastLogTimestamp: 0 
    };
  } catch {
    return { startTime: '09:00', endTime: '18:00', enabled: false, lastLogTimestamp: 0 };
  }
};

export const saveAutoLogConfig = (config: AutoLogConfig): void => {
  localStorage.setItem(AUTOLOG_KEY, JSON.stringify(config));
};
