import React, { useState, useEffect, useMemo } from 'react';
import { getEntries, saveEntry, clearAllEntries, deleteEntryById } from './services/storageService';
import { WaterEntry } from './types';
import { StatsCard } from './components/StatsCard';
import { IntakeForm } from './components/IntakeForm';
import { ChartsSection } from './components/ChartsSection';
import { HistoryList } from './components/HistoryList';
import { Droplets, Calendar, Activity, TrendingUp, Trash2 } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid'; // Actually, we'll use a simple random string for id to avoid deps if possible, but standard practice suggests uuid. I'll use a simple generator function in the handler to keep it dependency-free as requested by "minimal/handful of files".

// Simple ID generator to avoid external dependency for just this
const generateId = () => Math.random().toString(36).substring(2, 9);

const DAILY_GOAL = 8; // Liters

function App() {
  const [entries, setEntries] = useState<WaterEntry[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setEntries(getEntries());
    setMounted(true);
  }, []);

  const handleAddEntry = (amount: number) => {
    const newEntry: WaterEntry = {
      id: generateId(),
      amount,
      timestamp: Date.now(),
    };
    const updated = saveEntry(newEntry);
    setEntries(updated);
  };

  const handleDeleteEntry = (id: string) => {
    if (window.confirm('Are you sure you want to delete this entry?')) {
      const updated = deleteEntryById(id);
      setEntries(updated);
    }
  };

  const handleClearData = () => {
    if (window.confirm('Are you sure you want to clear ALL data? This cannot be undone.')) {
      clearAllEntries();
      setEntries([]);
    }
  };

  // --- Statistics Calculation ---
  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    // Today's Total
    const todayEntries = entries.filter(e => new Date(e.timestamp).toISOString().split('T')[0] === todayStr);
    const todayTotal = todayEntries.reduce((acc, curr) => acc + curr.amount, 0);
    const todayPercentage = Math.min(Math.round((todayTotal / DAILY_GOAL) * 100), 100);

    // Current Week Total
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday as start
    startOfWeek.setHours(0,0,0,0);
    
    const currentWeekTotal = entries
        .filter(e => e.timestamp >= startOfWeek.getTime())
        .reduce((acc, curr) => acc + curr.amount, 0);

    // This Week's Daily Average (Simple: last 7 days total / 7)
    // Or stricter: Average of days with entries? Prompt says "This week's average daily intake".
    // I'll calculate average over the days that have passed in the current week (Sunday to Now).
    const daysPassedInWeek = now.getDay() + 1; 
    const weekAvg = daysPassedInWeek > 0 ? (currentWeekTotal / daysPassedInWeek) : 0;

    // This Month Total
    const currentMonthStr = `${now.getFullYear()}-${now.getMonth()}`;
    const monthTotal = entries
        .filter(e => {
            const d = new Date(e.timestamp);
            return `${d.getFullYear()}-${d.getMonth()}` === currentMonthStr;
        })
        .reduce((acc, curr) => acc + curr.amount, 0);

    return {
        todayTotal,
        todayPercentage,
        weekAvg,
        monthTotal,
        currentWeekTotal
    };
  }, [entries]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary-500 p-2 rounded-lg text-white">
              <Droplets size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">HydroTrack</h1>
          </div>
          <button 
            onClick={handleClearData}
            className="text-slate-400 hover:text-red-500 text-sm font-medium transition-colors flex items-center gap-1"
          >
            <Trash2 size={16} />
            <span className="hidden sm:inline">Clear Data</span>
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
        {/* Top Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <StatsCard 
            title="Today's Intake" 
            value={`${stats.todayTotal.toFixed(2)} L`}
            subValue={`${stats.todayPercentage}% of 8L Goal`}
            icon={Droplets}
            colorClass="bg-blue-50 text-blue-600"
          />
          <StatsCard 
            title="Week Average" 
            value={`${stats.weekAvg.toFixed(2)} L`}
            subValue="Per day this week"
            icon={Activity}
            colorClass="bg-purple-50 text-purple-600"
          />
          <StatsCard 
            title="Month Total" 
            value={`${stats.monthTotal.toFixed(1)} L`}
            subValue="Current calendar month"
            icon={Calendar}
            colorClass="bg-emerald-50 text-emerald-600"
          />
           <StatsCard 
            title="Week Total" 
            value={`${stats.currentWeekTotal.toFixed(1)} L`}
            subValue="Since Sunday"
            icon={TrendingUp}
            colorClass="bg-orange-50 text-orange-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Input and History */}
          <div className="lg:col-span-1 space-y-6">
            <IntakeForm onAdd={handleAddEntry} />
            <HistoryList entries={entries} onDelete={handleDeleteEntry} />
          </div>

          {/* Right Column: Charts */}
          <div className="lg:col-span-2">
             <ChartsSection entries={entries} />
             
             {/* Progress Bar Component Inline */}
             <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
                <div className="flex justify-between items-end mb-2">
                    <h3 className="font-semibold text-slate-800">Today's Goal Progress</h3>
                    <span className="text-sm font-medium text-slate-500">{stats.todayTotal.toFixed(1)} / {DAILY_GOAL} L</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                    <div 
                        className="bg-primary-500 h-4 rounded-full transition-all duration-500 ease-out relative"
                        style={{ width: `${stats.todayPercentage}%` }}
                    >
                         <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                    </div>
                </div>
                <p className="text-xs text-slate-400 mt-2 text-center">
                    {stats.todayPercentage >= 100 ? "🎉 Goal reached! Great job!" : "Keep drinking! You're doing great."}
                </p>
             </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
