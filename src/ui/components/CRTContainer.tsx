import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

export const CRTContainer: React.FC<{ children: React.ReactNode; isPanic?: boolean; style?: React.CSSProperties }> = ({ children, isPanic = false, style = {} }) => {
  return (
    <div className="relative min-h-screen w-full bg-void overflow-hidden font-mono text-neon-green selection:bg-neon-green selection:text-void" style={style}>
      {/* Vignette */}
      <div className="pointer-events-none absolute inset-0 z-50 bg-[radial-gradient(circle_at_center,_transparent_50%,_rgba(0,0,0,0.6)_100%)]" />
      
      {/* Scanlines */}
      <div className="pointer-events-none absolute inset-0 z-40 bg-scanlines opacity-[0.05]" />

      {/* Dynamic Background Heartbeat/Flicker */}
      <motion.div 
        className={clsx(
          "pointer-events-none absolute inset-0 z-30 mix-blend-overlay",
          isPanic ? "bg-neon-red" : "bg-white"
        )}
        animate={{ opacity: isPanic ? [0.05, 0.15, 0.05] : [0.01, 0.03, 0.01] }}
        transition={{ 
          duration: isPanic ? 0.4 : 1.2, // Fast pulse in panic, slow 'breath' otherwise
          repeat: Infinity,
          ease: "easeInOut" 
        }}
      />

      <div className="relative z-10 container mx-auto p-4 h-full flex flex-col">
        {children}
      </div>
    </div>
  );
};
