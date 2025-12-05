import React, { useMemo } from 'react';
import { WaterEntry } from '../types';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';
import { ArrowUpRight } from 'lucide-react';

interface ChartsSectionProps {
  entries: WaterEntry[];
}

export const ChartsSection: React.FC<ChartsSectionProps> = ({ entries }) => {
  
  // Helper to format dates
  const formatDate = (ts: number) => new Date(ts).toISOString().split('T')[0];

  const dailyData = useMemo(() => {
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });
      
      const total = entries
        .filter(e => formatDate(e.timestamp) === dateStr)
        .reduce((acc, curr) => acc + curr.amount, 0);

      days.push({ name: dayLabel, value: total });
    }
    return days;
  }, [entries]);

  const weeklyData = useMemo(() => {
    const weeks = [];
    // Last 4 weeks
    for (let i = 3; i >= 0; i--) {
        const d = new Date();
        d.setDate(d.getDate() - (i * 7));
        const weekEnd = new Date(d); // Current reference point
        const weekStart = new Date(d);
        weekStart.setDate(weekStart.getDate() - 6);

        // Simple label "Oct 10"
        const label = `${weekStart.getDate()}/${weekStart.getMonth() + 1}`;

        let total = 0;
        entries.forEach(e => {
            const entryDate = new Date(e.timestamp);
            // Check if entry is within the 7 day window ending at weekEnd (inclusive)
            // Normalize to start of day for comparison
            const eTime = entryDate.setHours(0,0,0,0);
            const wStart = weekStart.setHours(0,0,0,0);
            const wEnd = weekEnd.setHours(23,59,59,999);
            
            if (eTime >= wStart && eTime <= wEnd) {
                total += e.amount;
            }
        });

        weeks.push({ name: label, value: total });
    }
    return weeks;
  }, [entries]);

  const monthlyData = useMemo(() => {
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthKey = `${d.getFullYear()}-${d.getMonth()}`;
      const label = d.toLocaleDateString('en-US', { month: 'short' });

      const total = entries
        .filter(e => {
          const entryDate = new Date(e.timestamp);
          return `${entryDate.getFullYear()}-${entryDate.getMonth()}` === monthKey;
        })
        .reduce((acc, curr) => acc + curr.amount, 0);

      months.push({ name: label, value: total });
    }
    return months;
  }, [entries]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Daily Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Last 7 Days</h3>
          <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded flex items-center gap-1">
             Daily
          </span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dailyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
              <Tooltip 
                cursor={{fill: '#f0f9ff'}}
                contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
              />
              <Bar dataKey="value" fill="#38bdf8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Monthly Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-slate-800">Last 6 Months</h3>
          <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-1 rounded flex items-center gap-1">
             Monthly
          </span>
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} />
              <Tooltip 
                 contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
              />
              <Line type="monotone" dataKey="value" stroke="#0ea5e9" strokeWidth={3} dot={{r: 4, fill: '#0ea5e9', strokeWidth: 0}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
