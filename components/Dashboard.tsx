import React from 'react';
import { WaterEntry } from '../types';
import { IntakeForm } from './IntakeForm';
import { HistoryList } from './HistoryList';

interface DashboardProps {
  stats: {
    todayTotal: number;
    todayPercentage: number;
  };
  entries: WaterEntry[];
  onAdd: (amount: number) => void;
  onDelete: (id: string) => void;
  goal: number;
}

export const Dashboard: React.FC<DashboardProps> = ({ stats, entries, onAdd, onDelete, goal }) => {
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
            
            <p className="text-sm text-slate-400 mt-4 text-center">
                {stats.todayPercentage >= 100 
                  ? "🎉 You've reached your goal! Amazing work!" 
                  : `You need ${(goal - stats.todayTotal).toFixed(2)}L more to reach your goal.`}
            </p>
        </div>

        <IntakeForm onAdd={onAdd} />
      </div>

      {/* Right Column: History */}
      <div className="lg:col-span-1">
        <HistoryList entries={entries} onDelete={onDelete} />
      </div>
    </div>
  );
};