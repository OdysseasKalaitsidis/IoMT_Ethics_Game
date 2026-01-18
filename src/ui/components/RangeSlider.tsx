import { Lock, Unlock } from 'lucide-react';
import React, { useEffect, useState } from 'react';

export interface ResistanceZone {
  min: number;
  max: number;
  pushTo: number; // The value it pushes towards (e.g., safe zone)
  force: number;  // How fast it pushes (1-5)
}

interface RangeSliderProps {
  label: string;
  value: number;
  min?: number;
  max?: number;
  onChange: (value: number) => void;
  color?: 'green' | 'red' | 'yellow';
  isUnderLoad?: boolean;
  resistanceZones?: ResistanceZone[];
  isLocked?: boolean;
  onLockToggle?: () => void;
  warning?: string | null;
}

export const RangeSlider: React.FC<RangeSliderProps> = ({ 
  label, 
  value, 
  min = 0, 
  max = 100, 
  onChange,
  color = 'green',
  isUnderLoad = false,
  resistanceZones = [],
  isLocked = false,
  onLockToggle,
  warning
}) => {
  const [isDragging, setIsDragging] = useState(false);

  // Physics Loop: Apply resistance when not dragging and not locked
  useEffect(() => {
    if (isDragging || isLocked || resistanceZones.length === 0) return;

    const interval = setInterval(() => {
      let newValue = value;
      let affected = false;

      resistanceZones.forEach(zone => {
        if (value >= zone.min && value <= zone.max) {
          // Push value towards target
          if (value < zone.pushTo) {
             newValue = Math.min(zone.pushTo, value + zone.force);
          } else if (value > zone.pushTo) {
             newValue = Math.max(zone.pushTo, value - zone.force);
          }
          affected = true;
        }
      });

      if (affected && newValue !== value) {
        onChange(newValue);
      }
    }, 100); // Physics tick rate

    return () => clearInterval(interval);
  }, [value, isDragging, isLocked, resistanceZones, onChange]);

  const getAccentColor = () => {
    // If under load (physics fighting back), glow RED and shake
    if (isUnderLoad) return 'text-neon-red accent-neon-red drop-shadow-[0_0_8px_rgba(255,0,0,0.8)]';

    switch (color) {
      case 'red': return 'text-neon-red accent-neon-red';
      case 'yellow': return 'text-neon-yellow accent-neon-yellow';
      case 'green': default: return 'text-neon-green accent-neon-green';
    }
  };

  return (
    <div className={`flex flex-col gap-2 w-full mb-6 group transition-all duration-200 ${isUnderLoad ? 'animate-shake-custom' : ''} ${isLocked ? 'opacity-70 grayscale-[0.5]' : ''}`}>
      <div className="flex justify-between items-end">
        <label className={`text-sm uppercase tracking-widest font-bold opacity-80 group-hover:opacity-100 transition-opacity flex items-center gap-2 ${getAccentColor().split(' ')[0]}`}>
          {label}
          {onLockToggle && isUnderLoad && (
            <button 
              onClick={onLockToggle}
              className={`p-1 rounded hover:bg-white/10 transition-colors ${isLocked ? 'text-neon-red' : 'text-gray-400 animate-pulse'}`}
              title={isLocked ? "UNLOCK TO ADJUST" : "LOCK TO STABILIZE"}
            >
              {isLocked ? <Lock size={14} /> : <Unlock size={14} />}
            </button>
          )}
        </label>
        <span className="font-mono text-xl">{Math.round(value)}%</span>
      </div>
      
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        onMouseDown={() => setIsDragging(true)}
        onMouseUp={() => setIsDragging(false)}
        onTouchStart={() => setIsDragging(true)}
        onTouchEnd={() => setIsDragging(false)}
        disabled={isLocked}
        className={`w-full h-2 bg-gray-900 rounded-lg appearance-none cursor-pointer border border-gray-800 hover:border-gray-600 focus:outline-none focus:ring-1 focus:ring-offset-0 ${getAccentColor()} disabled:cursor-not-allowed`}
        style={{
          background: `linear-gradient(to right, currentColor ${value}%, #111 ${value}%)`
        }}
      />
      
      <div className="flex justify-between text-[10px] text-gray-500 font-mono">
        <span>MIN</span>
        {isLocked && <span className="text-neon-red font-bold tracking-wider animate-pulse">LOCKED OVERRIDE ACTIVE</span>}
        <span>MAX</span>
      </div>
      
      {/* Impact Warning */}
      {warning && (
        <div className="text-[10px] font-mono text-neon-red mt-1 animate-pulse tracking-wide uppercase border-l-2 border-neon-red pl-2">
            ⚠ {warning}
        </div>
      )}
    </div>
  );
};
