import React, { useState, useEffect, useMemo, useRef } from 'react';
import { 
  getEntries, saveEntry, clearAllEntries, deleteEntryById, 
  getDailyGoal, saveDailyGoal, getPlantStats, savePlantStats,
  getAutoLogConfig, saveAutoLogConfig 
} from './services/storageService';
import { WaterEntry, PlantStats, AutoLogConfig } from './types';
import { Dashboard } from './components/Dashboard';
import { StatsView } from './components/StatsView';
import { Settings } from './components/Settings';
import { ChatBot } from './components/ChatBot';
import { Droplets, LayoutDashboard, BarChart2, Settings as SettingsIcon, MessageCircle } from 'lucide-react';

// Simple ID generator
const generateId = () => Math.random().toString(36).substring(2, 9);

type ViewState = 'dashboard' | 'stats' | 'settings' | 'chat';

function App() {
  const [entries, setEntries] = useState<WaterEntry[]>([]);
  const [plantStats, setPlantStats] = useState<PlantStats>({ height: 1, lastGrowthDate: '' });
  const [autoLogConfig, setAutoLogConfig] = useState<AutoLogConfig>({ 
    startTime: '09:00', endTime: '18:00', enabled: false, lastLogTimestamp: 0 
  });
  
  const [justGrew, setJustGrew] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [currentView, setCurrentView] = useState<ViewState>('dashboard');
  const [dailyGoal, setDailyGoal] = useState<number>(2.5);

  useEffect(() => {
    setEntries(getEntries());
    setDailyGoal(getDailyGoal());
    setPlantStats(getPlantStats());
    setAutoLogConfig(getAutoLogConfig());
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

  const handleUpdateAutoLog = (newConfig: AutoLogConfig) => {
    setAutoLogConfig(newConfig);
    saveAutoLogConfig(newConfig);
  };

  // --- Auto-Logging Logic ---
  useEffect(() => {
    if (!mounted || !autoLogConfig.enabled) return;

    const checkAutoLog = () => {
      const now = new Date();
      const currentH = now.getHours();
      const currentM = now.getMinutes();
      const currentTotalM = currentH * 60 + currentM;

      const [startH, startM] = autoLogConfig.startTime.split(':').map(Number);
      const startTotalM = startH * 60 + startM;

      const [endH, endM] = autoLogConfig.endTime.split(':').map(Number);
      const endTotalM = endH * 60 + endM;

      // Check if within time window
      if (currentTotalM >= startTotalM && currentTotalM <= endTotalM) {
        const lastLogDate = new Date(autoLogConfig.lastLogTimestamp);
        const isSameDay = lastLogDate.getDate() === now.getDate() && 
                          lastLogDate.getMonth() === now.getMonth() && 
                          lastLogDate.getFullYear() === now.getFullYear();

        const oneHour = 3600000; // ms
        
        let shouldLog = false;

        // If never logged today, or if last log was over an hour ago
        if (!isSameDay) {
          shouldLog = true;
        } else if ((now.getTime() - autoLogConfig.lastLogTimestamp) >= oneHour) {
          shouldLog = true;
        }

        if (shouldLog) {
          // Add 200ml (0.2L)
          handleAddEntry(0.2);
          
          // Update timestamp
          const updatedConfig = { ...autoLogConfig, lastLogTimestamp: now.getTime() };
          setAutoLogConfig(updatedConfig);
          saveAutoLogConfig(updatedConfig);
        }
      }
    };

    // Check immediately and then every minute
    checkAutoLog();
    const intervalId = setInterval(checkAutoLog, 60000);

    return () => clearInterval(intervalId);
  }, [mounted, autoLogConfig]);

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
      setPlantStats({ height: 1, lastGrowthDate: '' });
      alert('Data cleared successfully.');
    }
  };

  const handleUpdateGoal = (newGoal: number) => {
    setDailyGoal(newGoal);
    saveDailyGoal(newGoal);
    alert('Goal updated successfully!');
  };

  // --- Statistics Calculation ---
  const stats = useMemo(() => {
    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    
    // Today's Total
    const todayEntries = entries.filter(e => new Date(e.timestamp).toISOString().split('T')[0] === todayStr);
    const todayTotal = todayEntries.reduce((acc, curr) => acc + curr.amount, 0);
    const todayPercentage = Math.round((todayTotal / dailyGoal) * 100);

    // Current Week Total
    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay()); // Sunday as start
    startOfWeek.setHours(0,0,0,0);
    
    const currentWeekTotal = entries
        .filter(e => e.timestamp >= startOfWeek.getTime())
        .reduce((acc, curr) => acc + curr.amount, 0);

    // This Week's Daily Average
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
  }, [entries, dailyGoal]);

  // --- Plant Growth Logic ---
  useEffect(() => {
    if (!mounted) return;

    const todayStr = new Date().toISOString().split('T')[0];
    const isGoalMet = stats.todayTotal >= dailyGoal;
    const alreadyGrewToday = plantStats.lastGrowthDate === todayStr;

    if (isGoalMet && !alreadyGrewToday) {
      const newStats = {
        height: plantStats.height + 1,
        lastGrowthDate: todayStr
      };
      savePlantStats(newStats);
      setPlantStats(newStats);
      setJustGrew(true);
      
      // Reset animation flag after a few seconds
      setTimeout(() => setJustGrew(false), 3500);
    }
  }, [stats.todayTotal, dailyGoal, plantStats.lastGrowthDate, mounted]);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="bg-primary-500 p-2 rounded-lg text-white">
              <Droplets size={20} />
            </div>
            <h1 className="text-xl font-bold text-slate-800 tracking-tight">HydroTrack</h1>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden sm:flex gap-1">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${currentView === 'dashboard' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <LayoutDashboard size={18} />
              Dashboard
            </button>
            <button 
              onClick={() => setCurrentView('stats')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${currentView === 'stats' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <BarChart2 size={18} />
              Stats
            </button>
            <button 
              onClick={() => setCurrentView('chat')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${currentView === 'chat' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <MessageCircle size={18} />
              AI Chat
            </button>
            <button 
              onClick={() => setCurrentView('settings')}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${currentView === 'settings' ? 'bg-primary-50 text-primary-600' : 'text-slate-600 hover:bg-slate-50'}`}
            >
              <SettingsIcon size={18} />
              Settings
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-8">
        {currentView === 'dashboard' && (
          <Dashboard 
            stats={stats} 
            entries={entries} 
            onAdd={handleAddEntry} 
            onDelete={handleDeleteEntry}
            goal={dailyGoal}
            plantStats={plantStats}
            justGrew={justGrew}
            autoLogConfig={autoLogConfig}
            onUpdateAutoLog={handleUpdateAutoLog}
          />
        )}
        {currentView === 'stats' && (
          <StatsView 
            stats={stats} 
            entries={entries}
            goal={dailyGoal}
          />
        )}
        {currentView === 'chat' && (
          <ChatBot />
        )}
        {currentView === 'settings' && (
          <Settings 
            currentGoal={dailyGoal}
            onUpdateGoal={handleUpdateGoal}
            onClearData={handleClearData}
          />
        )}
      </main>

      {/* Mobile Navigation Bar (Fixed Bottom) */}
      <nav className="sm:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 pb-safe z-30">
        <div className="flex justify-around items-center h-16">
           <button 
              onClick={() => setCurrentView('dashboard')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === 'dashboard' ? 'text-primary-600' : 'text-slate-400'}`}
            >
              <LayoutDashboard size={20} />
              <span className="text-[10px] font-medium">Dashboard</span>
            </button>
            <button 
              onClick={() => setCurrentView('stats')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === 'stats' ? 'text-primary-600' : 'text-slate-400'}`}
            >
              <BarChart2 size={20} />
              <span className="text-[10px] font-medium">Stats</span>
            </button>
            <button 
              onClick={() => setCurrentView('chat')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === 'chat' ? 'text-primary-600' : 'text-slate-400'}`}
            >
              <MessageCircle size={20} />
              <span className="text-[10px] font-medium">AI Chat</span>
            </button>
            <button 
              onClick={() => setCurrentView('settings')}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${currentView === 'settings' ? 'text-primary-600' : 'text-slate-400'}`}
            >
              <SettingsIcon size={20} />
              <span className="text-[10px] font-medium">Settings</span>
            </button>
        </div>
      </nav>
    </div>
  );
}

export default App;