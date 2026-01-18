import React, { useEffect } from 'react';
import { motion } from 'framer-motion';

export type OverlayType = 'BATTERY_DEATH' | 'RANSOMWARE' | 'ER_LOCKOUT' | null;

interface OutcomeOverlayProps {
  type: OverlayType;
  onClose: () => void;
}

const OVERLAY_DATA = {
  BATTERY_DEATH: {
    bg: 'bg-black',
    textColor: 'text-white',
    header: 'SYSTEM TERMINATED',
    body: 'You prioritized Security. The CPU drained the battery. The patient died on the operating table.',
    animation: 'fade'
  },
  RANSOMWARE: {
    bg: 'bg-red-600',
    textColor: 'text-black',
    header: 'YOU HAVE BEEN HACKED',
    body: 'You prioritized Accessibility. A hacker found the open port. Patient is now a hostage.',
    animation: 'glitch'
  },
  ER_LOCKOUT: {
    bg: 'bg-gray-800',
    textColor: 'text-white',
    header: 'ACCESS DENIED',
    body: 'You prioritized Privacy. The ER doctor was locked out. The patient died waiting for the password.',
    animation: 'flatline'
  }
};

export const OutcomeOverlay: React.FC<OutcomeOverlayProps> = ({ type, onClose }) => {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  if (!type) return null;

  const data = OVERLAY_DATA[type];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center ${data.bg} ${data.textColor}`}
    >
      {/* Glitch animation for RANSOMWARE */}
      {data.animation === 'glitch' && (
        <motion.div
          className="absolute inset-0 bg-red-500 mix-blend-overlay"
          animate={{ opacity: [0, 0.5, 0, 0.8, 0] }}
          transition={{ duration: 0.2, repeat: Infinity }}
        />
      )}

      {/* Flatline animation for ER_LOCKOUT */}
      {data.animation === 'flatline' && (
        <div className="absolute top-1/2 left-0 w-full h-1 bg-neon-red" />
      )}

      <motion.div
        initial={{ scale: 0.8, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ delay: 0.2, type: 'spring' }}
        className="text-center max-w-2xl px-8"
      >
        <h1 className="text-6xl font-bold font-mono tracking-widest mb-8 uppercase">
          {data.header}
        </h1>
        <p className="text-2xl font-mono leading-relaxed opacity-90">
          {data.body}
        </p>

        <div className="mt-16 text-sm opacity-50 tracking-widest">
          PRESS ESC TO RESET
        </div>
      </motion.div>
    </motion.div>
  );
};
