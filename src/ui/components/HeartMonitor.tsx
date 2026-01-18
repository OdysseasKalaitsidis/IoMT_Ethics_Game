import React from 'react';
import { motion } from 'framer-motion';

interface HeartMonitorProps {
  status: 'alive' | 'flatline';
  bpm?: number;
}

export const HeartMonitor: React.FC<HeartMonitorProps> = ({ status, bpm = 60 }) => {
  // A complex "medical" looking ECG path
  // P-wave, QRS complex, T-wave
  const ecgPath = "M0,50 L20,50 L30,40 L40,50 L50,50 L60,10 L70,90 L80,50 L100,50 L120,30 L140,50 L160,50";
  const flatlinePath = "M0,50 L200,50";

  // Calculate duration based on BPM (60 BPM = 1s, 120 BPM = 0.5s)
  const duration = 60 / bpm;

  return (
    <div className="relative w-full h-[120px] bg-black border border-gray-800 rounded-lg overflow-hidden flex items-center justify-center mb-8 shadow-[0_0_15px_rgba(0,0,0,0.8)] inset-shadow">
      {/* Grid Background - Reduced Opacity as requested */}
      <div className="absolute inset-0 opacity-10 bg-[linear-gradient(90deg,transparent_95%,#00ff41_100%),linear-gradient(180deg,transparent_95%,#00ff41_100%)] bg-[size:20px_20px]" />
      
      <svg viewBox="0 0 200 100" className="w-full h-full preserve-3d">
        <motion.path
          d={status === 'alive' ? ecgPath : flatlinePath}
          fill="none"
          stroke={status === 'alive' ? "#00ff41" : "#ff3333"} // Neon green for alive, red for flatline
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ 
            pathLength: [0, 1, 0], // Draw and undraw
            opacity: [0, 1, 0],
            x: status === 'alive' ? [-50, 0] : 0 
          }}
          transition={{
            duration: status === 'alive' ? duration : 4, // Dynamic speed
            repeat: status === 'alive' ? Infinity : 0,
            ease: "linear"
          }}
        />
        
        {/* Leading dot for the "writer" */}
         {status === 'alive' && ( 
           <motion.circle 
             r="2" 
             cy="50"
             fill="#ffff00"
             animate={{ cx: [0, 200] }}
             transition={{ duration: duration, repeat: Infinity, ease: "linear" }}
             className="opacity-80"
           />
         )}
      </svg>

      {/* BPM Text Overlay */}
      <div className="absolute top-2 right-4 font-mono text-sm opacity-70">
        BPM: <span className={status === 'alive' ? "text-neon-green animate-pulse" : "text-neon-red"}>
          {status === 'alive' ? Math.round(bpm) : "0"}
        </span>
      </div>
    </div>
  );
};
