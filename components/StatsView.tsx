import React from 'react';
import { WaterEntry } from '../types';
import { StatsCard } from './StatsCard';
import { ChartsSection } from './ChartsSection';
import { Droplets, Activity, Calendar, TrendingUp } from 'lucide-react';

interface StatsViewProps {
    stats: {
        todayTotal: number;
        todayPercentage: number;
        weekAvg: number;
        monthTotal: number;
        currentWeekTotal: number;
    };
    entries: WaterEntry[];
    goal: number;
}

export const StatsView: React.FC<StatsViewProps> = ({ stats, entries, goal }) => {
    return (
        <div className="space-y-6">
             {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard 
                title="Today's Intake" 
                value={`${stats.todayTotal.toFixed(2)} L`}
                subValue={`${stats.todayPercentage}% of ${goal}L Goal`}
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
            
            <ChartsSection entries={entries} />
        </div>
    );
};