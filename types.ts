export interface WaterEntry {
  id: string;
  amount: number; // in Liters
  timestamp: number;
}

export interface DailyStats {
  date: string; // ISO date string YYYY-MM-DD
  total: number;
}

export interface WeeklyStats {
  weekLabel: string;
  total: number;
}

export interface MonthlyStats {
  monthLabel: string;
  total: number;
}

export interface PlantStats {
  height: number; // in cm
  lastGrowthDate: string; // YYYY-MM-DD
}

export interface AutoLogConfig {
  startTime: string; // "HH:MM"
  endTime: string; // "HH:MM"
  enabled: boolean;
  lastLogTimestamp: number;
}
