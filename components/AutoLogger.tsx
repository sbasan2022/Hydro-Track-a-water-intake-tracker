import React from 'react';
import { Clock, Zap, Power, AlertCircle } from 'lucide-react';
import { AutoLogConfig } from '../types';

interface AutoLoggerProps {
  config: AutoLogConfig;
  onUpdateConfig: (newConfig: AutoLogConfig) => void;
}

export const AutoLogger: React.FC<AutoLoggerProps> = ({ config, onUpdateConfig }) => {
  
  const handleToggle = () => {
    onUpdateConfig({ ...config, enabled: !config.enabled });
  };

  const handleChange = (field: keyof AutoLogConfig, value: string) => {
    onUpdateConfig({ ...config, [field]: value });
  };

  const getStatusMessage = () => {
    if (!config.enabled) return "Auto-logger is paused.";
    
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    
    const [startH, startM] = config.startTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    
    const [endH, endM] = config.endTime.split(':').map(Number);
    const endMinutes = endH * 60 + endM;

    if (currentMinutes < startMinutes) return `Starts at ${config.startTime}`;
    if (currentMinutes > endMinutes) return "Done for the day.";
    
    // Calculate time since last log
    if (config.lastLogTimestamp > 0) {
        const diff = Date.now() - config.lastLogTimestamp;
        const oneHour = 3600000;
        if (diff < oneHour) {
            const minutesLeft = Math.ceil((oneHour - diff) / 60000);
            return `Next 200ml in ~${minutesLeft} mins`;
        }
    }
    
    return "Running...";
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          <Zap className="text-amber-500 fill-amber-500" size={20} />
          Auto Hydration
        </h2>
        <button
            onClick={handleToggle}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 ${
                config.enabled ? 'bg-primary-600' : 'bg-slate-200'
            }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition transition-transform ${
                    config.enabled ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
              <Clock size={12} /> Start Time
            </label>
            <input
              type="time"
              value={config.startTime}
              onChange={(e) => handleChange('startTime', e.target.value)}
              disabled={config.enabled}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-700 focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1 flex items-center gap-1">
              <Power size={12} /> End Time
            </label>
            <input
              type="time"
              value={config.endTime}
              onChange={(e) => handleChange('endTime', e.target.value)}
              disabled={config.enabled}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-slate-700 focus:ring-2 focus:ring-primary-500 outline-none disabled:bg-slate-50 disabled:text-slate-400"
            />
          </div>
        </div>

        <div className={`p-3 rounded-lg flex items-center gap-3 text-sm ${config.enabled ? 'bg-primary-50 text-primary-700 border border-primary-100' : 'bg-slate-50 text-slate-500 border border-slate-100'}`}>
            <AlertCircle size={18} />
            <div className="flex-1">
                <p className="font-medium">{getStatusMessage()}</p>
                {config.enabled && <p className="text-xs opacity-80">Automatically adding 200ml every hour.</p>}
            </div>
        </div>
        
        {!config.enabled && (
             <p className="text-xs text-slate-400 text-center">Enable to start measuring hourly.</p>
        )}
      </div>
    </div>
  );
};
