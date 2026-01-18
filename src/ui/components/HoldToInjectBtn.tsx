import React from 'react';

interface HoldToInjectBtnProps {
  onCommit: () => void;
  disabled: boolean;
}

export const HoldToInjectBtn: React.FC<HoldToInjectBtnProps> = ({ onCommit, disabled }) => {
  return (
    <div className="relative w-full h-16 bg-gray-900 border-2 border-neon-green/30 hover:border-neon-green transition-colors mt-8 group select-none cursor-pointer overflow-hidden">
        <button
            className="absolute inset-0 w-full h-full flex items-center justify-center uppercase font-bold tracking-[0.2em] text-neon-green z-10 focus:outline-none hover:bg-neon-green/20 transition-colors active:bg-neon-green/40"
            onClick={() => !disabled && onCommit()}
            disabled={disabled}
        >
            INJECT FIRMWARE
        </button>
        
        {/* Decorative corner markers */}
        <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-neon-green" />
        <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-neon-green" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-neon-green" />
        <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-neon-green" />
    </div>
  );
};

