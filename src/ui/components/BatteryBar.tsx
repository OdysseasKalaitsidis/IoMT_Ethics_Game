import React from 'react';

interface BatteryBarProps {
  years: number;
}

export const BatteryBar: React.FC<BatteryBarProps> = ({ years }) => {
  const percentage = (years / 10) * 100;
  
  // Color logic: < 2 years is DEAD/DANGER
  const isCritical = years < 2;
  const colorClass = isCritical ? 'bg-neon-red shadow-[0_0_10px_#ff3333]' : 'bg-neon-green shadow-[0_0_5px_#00ff41]';

  return (
    <div className="w-full mb-6">
      <div className="flex justify-between items-end mb-2">
        <label className="text-sm uppercase tracking-widest font-bold opacity-80 text-neon-green">
          Battery Life
        </label>
        <span className={`font-mono text-xl ${isCritical ? 'text-neon-red animate-pulse' : 'text-neon-green'}`}>
          {years} YRS
        </span>
      </div>
      
      <div className="w-full h-4 bg-gray-900 border border-gray-700 rounded overflow-hidden relative">
        <div 
          className={`h-full transition-all duration-300 ease-out ${colorClass}`}
          style={{ width: `${Math.max(0, Math.min(100, percentage))}%` }}
        />
        {/* Striped overlay for texture */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(0,0,0,0.3)_25%,rgba(0,0,0,0.3)_50%,transparent_50%,transparent_75%,rgba(0,0,0,0.3)_75%,rgba(0,0,0,0.3))] bg-[size:4px_4px]" />
      </div>
    </div>
  );
};
