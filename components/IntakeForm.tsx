import React, { useState } from 'react';
import { Plus, Droplets } from 'lucide-react';

interface IntakeFormProps {
  onAdd: (amount: number) => void;
}

export const IntakeForm: React.FC<IntakeFormProps> = ({ onAdd }) => {
  const [amount, setAmount] = useState<string>('0.25');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (val > 0) {
      onAdd(val);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 mb-6">
      <h2 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
        <Droplets className="text-primary-500" size={20} />
        Log Water Intake
      </h2>
      <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 items-end">
        <div className="w-full">
          <label htmlFor="amount" className="block text-sm font-medium text-slate-600 mb-1">
            Amount (Liters)
          </label>
          <div className="relative">
            <input
              id="amount"
              type="number"
              step="0.05"
              min="0.05"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all text-lg"
              placeholder="0.5"
              required
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-medium">L</span>
          </div>
        </div>
        
        <div className="flex gap-2 w-full sm:w-auto">
          {[0.25, 0.5, 1.0].map((preset) => (
             <button
               key={preset}
               type="button"
               onClick={() => setAmount(preset.toString())}
               className={`px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
                 parseFloat(amount) === preset 
                 ? 'bg-primary-50 border-primary-200 text-primary-700' 
                 : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
               }`}
             >
               {preset}L
             </button>
          ))}
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto bg-primary-600 hover:bg-primary-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-2 transition-colors shadow-sm focus:ring-4 focus:ring-primary-100"
        >
          <Plus size={20} />
          Add
        </button>
      </form>
    </div>
  );
};
