import React, { useState, useEffect } from 'react';
import { Save, Trash2, AlertCircle } from 'lucide-react';

interface SettingsProps {
  currentGoal: number;
  onUpdateGoal: (goal: number) => void;
  onClearData: () => void;
}

export const Settings: React.FC<SettingsProps> = ({ currentGoal, onUpdateGoal, onClearData }) => {
  const [goalInput, setGoalInput] = useState(currentGoal.toString());

  // Update local state when prop changes (e.g. initial load)
  useEffect(() => {
    setGoalInput(currentGoal.toString());
  }, [currentGoal]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(goalInput);
    if (val > 0) {
      onUpdateGoal(val);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Preferences</h3>
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-slate-700 mb-1">
              Daily Water Goal (Liters)
            </label>
            <div className="flex gap-2">
              <input
                id="goal"
                type="number"
                step="0.1"
                min="0.5"
                max="20"
                value={goalInput}
                onChange={(e) => setGoalInput(e.target.value)}
                className="flex-1 px-4 py-2 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 outline-none"
              />
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors"
              >
                <Save size={18} />
                Save
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-2">
              Recommended daily intake is usually between 2.0L and 3.0L depending on activity level.
            </p>
          </div>
        </form>
      </div>

      <div className="bg-red-50 rounded-xl shadow-sm border border-red-100 p-6">
        <h3 className="text-lg font-semibold text-red-800 mb-2 flex items-center gap-2">
          <AlertCircle size={20} />
          Danger Zone
        </h3>
        <p className="text-sm text-red-600 mb-4">
          Permanently remove all your tracked water intake history. This action cannot be undone.
        </p>
        <button
          onClick={onClearData}
          className="bg-white border border-red-200 text-red-600 hover:bg-red-600 hover:text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 transition-colors w-full sm:w-auto justify-center"
        >
          <Trash2 size={18} />
          Clear All Data
        </button>
      </div>
    </div>
  );
};