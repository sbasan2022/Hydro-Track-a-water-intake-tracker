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
