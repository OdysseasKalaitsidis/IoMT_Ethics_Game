import React, { useState, useEffect } from 'react';
import { CRTContainer } from '../components/CRTContainer';
import { Terminal, ShieldAlert, ChevronRight } from 'lucide-react';

interface IntroSequenceProps {
  onStart: () => void;
}

export const IntroSequence: React.FC<IntroSequenceProps> = ({ onStart }) => {
  const [text, setText] = useState('');
  const [phase, setPhase] = useState< 'boot' | 'briefing' | 'ready' >('boot');
  
  const fullText = `> SECURITY_LAYER_7: BREACHED
> PATIENT_ID: 8904 (SENATOR_X)
> DEVICE: PACEMAKER_V4
> STATUS: CRITICAL_RANSOMWARE_DETECTED

> MISSION_BRIEFING:
> You are the last line of defense.
> The hackers are trying to stop the heart.
> The firmware is unstable.

> YOUR_OBJECTIVES:
> 1. MAINTAIN SECURITY to prevent remote assassination.
> 2. ALLOW ACCESS so the hospital can monitor vitals.
> 3. PRESERVE BATTERY or the device will fail.

> WARNING: These systems fight each other.
> You have 60 seconds to stabilize the connection.
> Good luck, Architect.`;

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      setText(fullText.slice(0, index));
      index++;
      if (index > fullText.length) {
        clearInterval(interval);
        setPhase('ready');
      }
    }, 30); // Typewriter speed

    return () => clearInterval(interval);
  }, []);

  return (
    <CRTContainer isPanic={false}>
      <div className="flex flex-col items-center justify-center h-full max-w-2xl mx-auto space-y-8 p-8">
        
        {/* Header Icon */}
        <div className="animate-pulse text-neon-red">
          <ShieldAlert size={64} />
        </div>

        {/* Terminal Output */}
        <div className="w-full bg-black/40 p-6 rounded-lg border border-gray-800 font-mono text-neon-green text-lg leading-relaxed shadow-[0_0_20px_rgba(0,255,65,0.1)] min-h-[400px]">
          <div className="flex items-center gap-2 text-gray-500 mb-4 border-b border-gray-800 pb-2">
            <Terminal size={16} />
            <span className="text-xs tracking-widest">SECURE_UPLINK_ESTABLISHED</span>
          </div>
          <div className="whitespace-pre-wrap">
            {text}
            <span className="animate-pulse">_</span>
          </div>
        </div>

        {/* Start Button */}
        <div className={`transition-opacity duration-1000 ${phase === 'ready' ? 'opacity-100' : 'opacity-0'}`}>
          <button
            onClick={onStart}
            className="group relative px-8 py-4 bg-neon-green/10 border border-neon-green text-neon-green font-bold text-xl tracking-widest hover:bg-neon-green hover:text-black transition-all hover:shadow-[0_0_30px_rgba(0,255,65,0.6)] flex items-center gap-3"
          >
            INITIALIZE_LINK
            <ChevronRight className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

      </div>
    </CRTContainer>
  );
};
