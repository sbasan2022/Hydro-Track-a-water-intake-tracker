import React from 'react';
import { WaterEntry } from '../types';
import { Clock, Trash2 } from 'lucide-react';

interface HistoryListProps {
  entries: WaterEntry[];
  onDelete: (id: string) => void;
}

export const HistoryList: React.FC<HistoryListProps> = ({ entries, onDelete }) => {
  // Sort by newest first
  const todayStr = new Date().toISOString().split('T')[0];
  
  const todaysEntries = entries
    .filter(e => new Date(e.timestamp).toISOString().split('T')[0] === todayStr)
    .sort((a, b) => b.timestamp - a.timestamp);

  if (todaysEntries.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-8 text-center">
        <div className="bg-slate-50 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
          <Clock className="text-slate-400" size={24} />
        </div>
        <h3 className="text-slate-800 font-medium mb-1">No entries today</h3>
        <p className="text-slate-500 text-sm">Drink some water and log it above!</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50/50">
        <h3 className="font-semibold text-slate-800 flex items-center gap-2">
          <Clock size={18} className="text-slate-500" />
          Today's History
        </h3>
      </div>
      <div className="divide-y divide-slate-100">
        {todaysEntries.map((entry) => (
          <div key={entry.id} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors group">
            <div className="flex items-center gap-4">
              <div className="bg-blue-50 text-blue-600 font-bold px-3 py-1.5 rounded-lg text-sm">
                {entry.amount} L
              </div>
              <span className="text-slate-500 text-sm">
                {new Date(entry.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <button
              onClick={() => onDelete(entry.id)}
              className="text-slate-300 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50 opacity-0 group-hover:opacity-100"
              title="Delete entry"
            >
              <Trash2 size={16} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};
