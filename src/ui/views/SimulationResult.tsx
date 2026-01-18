import React from 'react';
import { motion } from 'framer-motion';
import { Outcome } from '../../core/types';
import { OUTCOME_DETAILS } from '../../core/constants';
import clsx from 'clsx';

interface SimulationResultProps {
  outcome: Outcome;
  onReset: () => void;
}

export const SimulationResult: React.FC<SimulationResultProps> = ({ outcome, onReset }) => {
  const details = OUTCOME_DETAILS[outcome];
  const isRansomware = outcome === Outcome.RANSOMWARE;

  // Glitch animation variants
  const glitchVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    shake: { 
      x: [0, -5, 5, -5, 5, 0], 
      y: [0, 5, -5, 5, -5, 0],
      transition: { repeat: Infinity, duration: 0.2 } 
    }
  };

  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center p-4">
      {/* Background Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className={clsx(
          "absolute inset-0 backdrop-blur-sm",
          isRansomware ? "bg-red-900/40" : "bg-black/80"
        )}
      />

      {/* Content Card */}
      <motion.div 
        initial="hidden"
        animate={isRansomware ? ["visible", "shake"] : "visible"}
        variants={isRansomware ? glitchVariants : {}}
        className={clsx(
          "relative z-50 bg-black border-2 max-w-lg w-full p-8 shadow-2xl text-center",
          isRansomware ? "border-neon-red" : "border-gray-700"
        )}
      >
        <h2 className={clsx("text-4xl font-bold mb-2 tracking-tighter", details.color)}>
          {details.title}
        </h2>
        
        <div className="text-xl mb-6 font-mono border-b border-gray-800 pb-4">
          CODE: {details.code}
        </div>

        <p className="text-lg text-gray-300 mb-8 font-mono leading-relaxed">
          {details.description}
        </p>

        {isRansomware && (
          <div className="absolute inset-0 pointer-events-none opacity-20 bg-[url('https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif')] bg-cover mix-blend-overlay" />
        )}

        <button 
          onClick={onReset}
          className="bg-gray-900 text-white border border-gray-600 px-8 py-3 hover:bg-white hover:text-black transition-all duration-200 font-bold tracking-widest uppercase"
        >
          Reboot System
        </button>
      </motion.div>
    </div>
  );
};
