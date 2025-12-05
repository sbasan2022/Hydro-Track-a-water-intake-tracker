import React from 'react';
import { WaterEntry, PlantStats, AutoLogConfig } from '../types';
import { AutoLogger } from './AutoLogger';
import { HistoryList } from './HistoryList';
import { PlantGarden } from './PlantGarden';
import { Trophy, Star } from 'lucide-react';

interface DashboardProps {
  stats: {
    todayTotal: number;
    todayPercentage: number;
  };
  entries: WaterEntry[];
  onAdd: (amount: number) => void;
  onDelete: (id: string) => void;
  goal: number;
  plantStats: PlantStats;
  justGrew: boolean;
  autoLogConfig: AutoLogConfig;
  onUpdateAutoLog: (config: AutoLogConfig) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ 
  stats, 
  entries, 
  onAdd, 
  onDelete, 
  goal, 
  plantStats, 
  justGrew,
  autoLogConfig,
  onUpdateAutoLog
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Input and Stats Summary */}
      <div className="lg:col-span-2 space-y-6">
        {/* Progress Card */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h3 className="font-semibold text-slate-800 text-lg">Today's Progress</h3>
                    <p className="text-sm text-slate-500">Goal: {goal} L</p>
                </div>
                <span className="text-2xl font-bold text-primary-600">{stats.todayTotal.toFixed(2)} L</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-6 overflow-hidden mt-4">
                <div 
                    className="bg-primary-500 h-full rounded-full transition-all duration-1000 ease-out relative flex items-center justify-end px-2"
                    style={{ width: `${Math.min(stats.todayPercentage, 100)}%` }}
                >
                     <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                     {stats.todayPercentage > 15 && (
                        <span className="text-white text-xs font-bold relative z-10">{stats.todayPercentage}%</span>
                     )}
                </div>
            </div>
            {stats.todayPercentage < 15 && <p className="text-right text-xs font-bold text-primary-600 mt-1">{stats.todayPercentage}%</p>}
            
            {stats.todayPercentage >= 100 ? (
                <div className="mt-6 relative overflow-hidden rounded-xl bg-gradient-to-br from-primary-500 to-indigo-600 p-6 text-white shadow-lg transform transition-all duration-500 hover:scale-[1.01]">
                    {/* Decorative background circles */}
                    <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
                    <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-white/10 blur-xl"></div>
                    
                    <div className="relative z-10 flex flex-col items-center justify-center text-center gap-3">
                        <div className="flex items-center justify-center h-12 w-12 rounded-full bg-white/20 backdrop-blur-sm ring-4 ring-white/10">
                            <Trophy className="h-6 w-6 text-yellow-300 fill-current" />
                        </div>
                        <div>
                            <h3 className="text-xl font-bold tracking-tight mb-1">Goal Reached!</h3>
                            <p className="font-medium text-blue-50">You completed the target of the day!</p>
                        </div>
                        <div className="flex gap-1 mt-1">
                             <Star className="w-4 h-4 text-yellow-300 fill-current animate-pulse" style={{ animationDelay: '0ms' }} />
                             <Star className="w-4 h-4 text-yellow-300 fill-current animate-pulse" style={{ animationDelay: '300ms' }} />
                             <Star className="w-4 h-4 text-yellow-300 fill-current animate-pulse" style={{ animationDelay: '600ms' }} />
                        </div>
                    </div>
                </div>
            ) : (
                <p className="text-sm text-slate-400 mt-4 text-center">
                    You need {(goal - stats.todayTotal).toFixed(2)}L more to reach your goal.
                </p>
            )}
        </div>

        {/* Auto Logger Configuration (Replaces Manual Form) */}
        <AutoLogger config={autoLogConfig} onUpdateConfig={onUpdateAutoLog} />
      </div>

      {/* Right Column: History and Garden */}
      <div className="lg:col-span-1 space-y-6">
        <PlantGarden stats={plantStats} justGrew={justGrew} />
        <HistoryList entries={entries} onDelete={onDelete} />
      </div>
    </div>
  );
};
