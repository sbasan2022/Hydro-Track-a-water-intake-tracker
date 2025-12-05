import React, { useEffect, useState } from 'react';
import { PlantStats } from '../types';
import { Sprout, CloudRain } from 'lucide-react';

interface PlantGardenProps {
  stats: PlantStats;
  justGrew: boolean;
}

export const PlantGarden: React.FC<PlantGardenProps> = ({ stats, justGrew }) => {
  const [isWatering, setIsWatering] = useState(false);

  useEffect(() => {
    if (justGrew) {
      setIsWatering(true);
      const timer = setTimeout(() => setIsWatering(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [justGrew]);

  // Visual scaling logic
  // Base height 50px, adds 5px per cm, capped visually at container height
  const visualHeight = Math.min(200, 40 + (stats.height * 5));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 p-6 relative overflow-hidden min-h-[300px] flex flex-col justify-between">
       {/* Background Decoration */}
       <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-sky-50 to-white -z-10"></div>
       
       <div className="flex justify-between items-start z-10">
         <div>
            <h3 className="font-semibold text-slate-800 flex items-center gap-2">
                <Sprout className="text-green-500" size={20} />
                My Garden
            </h3>
            <p className="text-sm text-slate-500">Tree Height: <span className="font-bold text-slate-800">{stats.height} cm</span></p>
         </div>
         <div className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium">
             +1cm / day goal met
         </div>
       </div>

       {/* Animation Overlay - Watering Can */}
       {isWatering && (
           <div className="absolute top-10 right-10 animate-pulse z-20">
               <CloudRain size={48} className="text-blue-400 drop-shadow-lg" />
               <div className="flex justify-center gap-2 mt-2">
                   <div className="w-1 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                   <div className="w-1 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                   <div className="w-1 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
               </div>
           </div>
       )}

       {/* The Plant Visualization */}
       <div className="flex-1 flex items-end justify-center relative mt-4">
           {/* Pot */}
           <div className="w-24 h-20 bg-amber-700 relative z-10 rounded-b-lg shadow-md flex items-center justify-center">
                <div className="w-28 h-4 bg-amber-800 absolute -top-2 rounded-sm shadow-sm"></div>
                <div className="text-white/20 text-xs font-bold">HydroTrack</div>
           </div>

           {/* Stem */}
           <div 
             className="w-4 bg-green-600 absolute bottom-16 transition-all duration-1000 ease-in-out origin-bottom"
             style={{ height: `${visualHeight}px` }}
           >
               {/* Leaves generated based on height */}
               {Array.from({ length: Math.floor(stats.height / 3) }).map((_, i) => (
                   <React.Fragment key={i}>
                       <div className="absolute w-8 h-8 bg-green-500 rounded-tr-[20px] rounded-bl-[20px] -left-8" style={{ bottom: `${(i + 1) * 30}px`, transform: 'rotate(-10deg)' }}></div>
                       <div className="absolute w-8 h-8 bg-green-500 rounded-tl-[20px] rounded-br-[20px] -right-8" style={{ bottom: `${(i + 1) * 30 + 15}px`, transform: 'rotate(10deg)' }}></div>
                   </React.Fragment>
               ))}
               
               {/* Top Flower/Crown if high enough */}
               {stats.height > 10 && (
                   <div className="absolute -top-12 -left-6 w-16 h-16 bg-pink-400 rounded-full opacity-90 blur-[1px] flex items-center justify-center animate-pulse">
                        <div className="w-8 h-8 bg-yellow-300 rounded-full"></div>
                   </div>
               )}
           </div>
       </div>
       
       {justGrew && (
           <div className="absolute bottom-4 left-0 right-0 text-center text-green-600 font-bold animate-bounce">
               Tree grew +1cm!
           </div>
       )}
    </div>
  );
};
