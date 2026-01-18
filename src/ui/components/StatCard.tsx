import React from 'react';
import clsx from 'clsx';

interface StatCardProps {
  label: string;
  value: number;
  type?: 'percent' | 'score';
  color?: 'green' | 'red' | 'yellow';
}

export const StatCard: React.FC<StatCardProps> = ({ 
  label, 
  value, 
  type = 'score', 
  color = 'green' 
}) => {
  const textColor = {
    green: 'text-neon-green',
    red: 'text-neon-red',
    yellow: 'text-neon-yellow',
  }[color];

  const borderColor = {
    green: 'border-neon-green',
    red: 'border-neon-red',
    yellow: 'border-neon-yellow',
  }[color];

  return (
    <div className={clsx(
      "border bg-black/50 p-4 flex flex-col items-center justify-center rounded transition-all duration-300",
      borderColor,
      type === 'score' ? 'border-2' : 'border'
    )}>
      <span className="text-xs uppercase tracking-widest text-gray-400 mb-1">{label}</span>
      <span className={clsx("font-mono text-3xl font-bold", textColor)}>
        {value}{type === 'percent' ? '%' : ''}
      </span>
    </div>
  );
};
