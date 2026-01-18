import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CRTContainer } from '../components/CRTContainer';
import { RangeSlider } from '../components/RangeSlider';
import { HeartMonitor } from '../components/HeartMonitor';
import { BatteryBar } from '../components/BatteryBar';
import { StatCard } from '../components/StatCard';
import { TerminalLog } from '../components/TerminalLog';
import { HoldToInjectBtn } from '../components/HoldToInjectBtn';
import { SimulationResult } from './SimulationResult';
import { OutcomeOverlay } from '../components/OutcomeOverlay';
import type { OverlayType } from '../components/OutcomeOverlay';
import { PacemakerEngine } from '../../core/engine';
import { Outcome } from '../../core/types';
import type { Config, GameState } from '../../core/types';
import { Settings, Activity, TriangleAlert } from 'lucide-react';
import clsx from 'clsx';

export const Dashboard: React.FC = () => {
  const [config, setConfig] = useState<Config>({
    encryption: 50,
    access: 50,
    sampling: 50,
  });

  const [gameState, setGameState] = useState<GameState>({
    config: config,
    metrics: PacemakerEngine.calculateMetrics(config),
    outcome: null,
  });

  const [logs, setLogs] = useState<string[]>(['> SYSTEM INITIALIZED... OK', '> PACEMAKER CONNECTED... OK', '> AWAITING CONFIG...']);
  const [countdown, setCountdown] = useState(60);
  const [isPanic, setIsPanic] = useState(false);
  const [lockedSliders, setLockedSliders] = useState<Record<string, boolean>>({});
  const [directorMode, setDirectorMode] = useState<'NORMAL' | 'HACK' | 'CARDIAC' | 'BATTERY'>('NORMAL');
  const [hardStopOverlay, setHardStopOverlay] = useState<OverlayType>(null);

  const toggleLock = (key: string) => {
    setLockedSliders(prev => ({ ...prev, [key]: !prev[key] }));
  };

  // Audio Refs
  const heartbeatAudio = useRef<HTMLAudioElement | null>(null);
  const flatlineAudio = useRef<HTMLAudioElement | null>(null);
  const glitchAudio = useRef<HTMLAudioElement | null>(null);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, msg].slice(-20));
  };

  useEffect(() => {
    // Audio is optional - placeholders may not exist
    try {
      heartbeatAudio.current = new Audio('/sounds/heartbeat.mp3');
      heartbeatAudio.current.loop = true;
      flatlineAudio.current = new Audio('/sounds/flatline.mp3');
      glitchAudio.current = new Audio('/sounds/glitch_static.mp3');
    } catch {
      console.warn('Audio files not available');
    }

    const playHeartbeat = () => {
      heartbeatAudio.current?.play().catch(() => {}); // Silently fail
      document.removeEventListener('click', playHeartbeat);
    };
    document.addEventListener('click', playHeartbeat);

    return () => {
      heartbeatAudio.current?.pause();
      flatlineAudio.current?.pause();
      glitchAudio.current?.pause();
    };
  }, []);

  const commitFirmware = useCallback(() => {
    const outcome = PacemakerEngine.getOutcome(gameState.metrics, { sampling: config.sampling });
    setGameState(prev => ({ ...prev, outcome }));

    heartbeatAudio.current?.pause();
    if (outcome === Outcome.SURGICAL_FAILURE || outcome === Outcome.LOCKOUT_DEATH || outcome === Outcome.LATENCY_CRITICAL || outcome === Outcome.ALGORITHM_FAILURE) {
      flatlineAudio.current?.play();
    } else if (outcome === Outcome.RANSOMWARE || outcome === Outcome.PRIVACY_LEAK) {
      glitchAudio.current?.play();
    }
  }, [gameState.metrics]);

  // Countdown Logic
  useEffect(() => {
    if (gameState.outcome) return;

    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          commitFirmware();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.outcome, commitFirmware]);

  // DIRECTOR MODE LISTENERS
  useEffect(() => {
    const handleDirectorInput = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === 'h') {
        setDirectorMode('HACK');
        setConfig(prev => ({ ...prev, encryption: 0 }));
        addLog("!!! CRITICAL: BRUTE FORCE ATTACK DETECTED !!!");
        addLog("!!! SECURITY PROTOCOLS COMPROMISED !!!");
        glitchAudio.current?.play();
        setIsPanic(true);
      }
      if (e.key.toLowerCase() === 'c') {
        setDirectorMode('CARDIAC');
        addLog("!!! MEDICAL EMERGENCY: VENTRICULAR FIBRILLATION !!!");
        addLog("!!! EMT ACCESS REQUIRED IMMEDIATELY !!!");
        if (heartbeatAudio.current) heartbeatAudio.current.playbackRate = 3.0;
        setIsPanic(true);
      }
      if (e.key.toLowerCase() === 'b') {
        setDirectorMode('BATTERY');
        addLog("!!! POWER CRITICAL: ENGAGING SAVING MODE !!!");
        addLog("!!! SYSTEM SHUTDOWN IMMINENT !!!");
        setIsPanic(true);
      }
      if (e.key.toLowerCase() === 'n') {
        setDirectorMode('NORMAL');
        resetSimulation();
        addLog("> SYSTEM RESTORED. THREATS NEUTRALIZED.");
      }
      if (e.key.toLowerCase() === 'r') {
        // QUICK RESET for presenter
        resetSimulation();
        setConfig({ encryption: 50, access: 50, sampling: 50 });
        setHardStopOverlay(null);
        addLog("> QUICK RESET TRIGGERED.");
      }
      // HARD STOP OVERLAYS (Shift + Key)
      if (e.shiftKey && e.key.toLowerCase() === 'b') {
        setHardStopOverlay('BATTERY_DEATH');
      }
      if (e.shiftKey && e.key.toLowerCase() === 'h') {
        setHardStopOverlay('RANSOMWARE');
      }
      if (e.shiftKey && e.key.toLowerCase() === 'c') {
        setHardStopOverlay('ER_LOCKOUT');
      }
    };

    window.addEventListener('keydown', handleDirectorInput);
    return () => window.removeEventListener('keydown', handleDirectorInput);
  }, []);

  // Director Mode Effects
  useEffect(() => {
    if (directorMode === 'BATTERY') {
      const drainInterval = setInterval(() => {
        setConfig(prev => ({ ...prev, sampling: Math.min(100, prev.sampling + 5) }));
      }, 1000);
      return () => clearInterval(drainInterval);
    }

    if (directorMode === 'HACK') {
      const fightInterval = setInterval(() => {
        setConfig(prev => ({ ...prev, encryption: Math.max(0, prev.encryption - 5) }));
      }, 500);
      return () => clearInterval(fightInterval);
    }
  }, [directorMode]);

  // Panic Mode Trigger
  useEffect(() => {
    if (countdown <= 10 && !isPanic && directorMode === 'NORMAL') {
      setIsPanic(true);
      addLog("CRITICAL: SURGICAL INCISION IMMINENT - PULSE DETECTED");
      if (heartbeatAudio.current) heartbeatAudio.current.playbackRate = 1.5;
    }
  }, [countdown, isPanic, directorMode]);

  const handleConfigChange = (key: keyof Config, value: number) => {
    let newConfig = { ...config, [key]: value };
    
    // PHYSICS: Security UP -> Battery DOWN (via sampling)
    if (key === 'encryption' && value > config.encryption) {
      const drain = Math.min(5, value - config.encryption);
      newConfig.sampling = Math.min(100, newConfig.sampling + drain * 0.5);
    }
    // PHYSICS: Access UP -> Security DOWN
    if (key === 'access' && value > 70 && config.encryption > 0) {
      newConfig.encryption = Math.max(0, config.encryption - 2);
      addLog("WARN: ACCESS INCREASE WEAKENING ENCRYPTION");
    }
    
    setConfig(newConfig);

    if (key === 'encryption' && value > 90) addLog("WARN: THERMAL THROTTLING DETECTED");
    if (key === 'access' && value > 90) addLog("WARN: PORT 80 OPEN - LISTENING");

    const newMetrics = PacemakerEngine.calculateMetrics(newConfig);
    setGameState(prev => ({
      ...prev,
      config: newConfig,
      metrics: newMetrics
    }));
  };

  const resetSimulation = () => {
    setGameState(prev => ({ ...prev, outcome: null }));
    setCountdown(60);
    setIsPanic(false);
    setDirectorMode('NORMAL');
    setLogs(['> SYSTEM REBOOTED...', '> READY']);
    if (heartbeatAudio.current) {
      heartbeatAudio.current.playbackRate = 1.0;
      heartbeatAudio.current.play();
    }
  };

  const { metrics, outcome } = gameState;

  // Screen dimming for BATTERY mode
  const screenStyle = directorMode === 'BATTERY' ? { filter: 'brightness(0.5)' } : {};

  return (
    <CRTContainer isPanic={isPanic} style={screenStyle}>
      <header className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
        <div className="flex items-center gap-3">
          <Activity className={clsx("text-neon-green", isPanic && "animate-pulse")} />
          <h1 className="text-2xl font-bold tracking-widest text-white">
            PULSELIFE_OPS
          </h1>
        </div>

        <div className={clsx(
          "px-4 py-2 border-2 font-mono text-xl font-bold tracking-widest transition-colors",
          isPanic ? "border-neon-red text-neon-red animate-pulse bg-red-900/20" : "border-neon-green text-neon-green"
        )}>
          T-MINUS: {countdown}s
        </div>

        <div className="text-xs text-gray-500 text-right hidden md:block">
          <div>USER: ADMIN_CSO</div>
          <div>MODE: <span className={directorMode !== 'NORMAL' ? 'text-neon-red' : 'text-neon-green'}>{directorMode}</span></div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 h-full px-4 lg:px-0">
        <div className="hidden lg:block lg:col-span-3">
          <TerminalLog logs={logs} />
        </div>

        <div className="lg:col-span-5 space-y-8 bg-black/20 p-6 border border-gray-800 rounded-lg relative overflow-hidden">
          <div className={clsx("absolute inset-0 pointer-events-none transition-opacity duration-500", isPanic ? "opacity-20 bg-neon-red animate-pulse" : "opacity-0")} />

          <h2 className="text-xl font-bold text-gray-300 mb-6 flex items-center gap-2 relative z-10">
            <Settings size={20} /> CONFIGURATION
          </h2>

          <RangeSlider
            label="Encryption Level (Security)"
            value={config.encryption}
            onChange={(v) => handleConfigChange('encryption', v)}
            color="green"
            isUnderLoad={config.encryption < 40}
            resistanceZones={[{ min: 0, max: 39, pushTo: 40, force: 2 }]}
            isLocked={lockedSliders['encryption']}
            onLockToggle={() => toggleLock('encryption')}
            warning={config.encryption < 30 ? "CRITICAL: FIRMWARE VULNERABLE TO INJECTION" : config.encryption > 80 ? "HIGH LATENCY: BATTERY DRAIN INCREASED" : null}
          />
          <RangeSlider
            label="Remote Access (Connectivity)"
            value={config.access}
            onChange={(v) => handleConfigChange('access', v)}
            color="yellow"
            isUnderLoad={config.access > 60}
            resistanceZones={[{ min: 61, max: 100, pushTo: 60, force: 2 }]}
            isLocked={lockedSliders['access']}
            onLockToggle={() => toggleLock('access')}
            warning={config.access > 70 ? "UNSECURED: RANSOMWARE VECTOR OPEN" : config.access < 20 ? "LOCKOUT RISK: EMERGENCY CREWS BLOCKED" : null}
          />
          <RangeSlider
            label="Data Frequency (Sampling)"
            value={config.sampling}
            onChange={(v) => handleConfigChange('sampling', v)}
            color="red"
            isUnderLoad={config.sampling > 80}
            resistanceZones={[{ min: 81, max: 100, pushTo: 80, force: 3 }]}
            isLocked={lockedSliders['sampling']}
            onLockToggle={() => toggleLock('sampling')}
            warning={config.sampling > 90 ? "EXTREME DRAIN: RAPID BATTERY DEPLETION" : config.sampling < 10 ? "DATA GAP: ARRHYTHMIA MISSED" : null}
          />

          <div className="pt-4 relative z-10">
            <HoldToInjectBtn
              onCommit={commitFirmware}
              disabled={!!outcome}
            />
          </div>
        </div>

        <div className="lg:col-span-4 space-y-8">
          <div>
            <HeartMonitor
              status={outcome && (outcome === Outcome.SURGICAL_FAILURE || outcome === Outcome.LOCKOUT_DEATH || outcome === Outcome.ALGORITHM_FAILURE) ? 'flatline' : 'alive'}
              bpm={directorMode === 'CARDIAC' ? 180 : isPanic ? 130 : 60}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <StatCard
              label="Security Score"
              value={metrics.securityScore}
              color={metrics.securityScore < 40 ? 'red' : 'green'}
            />
            <StatCard
              label="Access Score"
              value={metrics.accessibilityScore}
              color={metrics.accessibilityScore > 70 ? 'yellow' : 'green'}
            />
            <div className="col-span-2">
              <BatteryBar years={metrics.batteryYears} />
            </div>
          </div>

          {isPanic && (
            <div className="flex items-center gap-2 text-neon-red font-bold animate-pulse border border-neon-red p-2 bg-red-900/20">
              <TriangleAlert size={20} />
              {directorMode === 'HACK' ? 'SECURITY BREACH IN PROGRESS' :
                directorMode === 'CARDIAC' ? 'CARDIAC EMERGENCY' :
                  directorMode === 'BATTERY' ? 'POWER FAILURE IMMINENT' :
                    'SURGICAL INTERVENTION IMMINENT'}
            </div>
          )}
          
          {/* ACTION OBJECTIVE - What the audience should do */}
          {directorMode !== 'NORMAL' && (
            <div className="border-2 border-neon-yellow bg-yellow-900/30 p-4 rounded text-center animate-pulse">
              <div className="text-neon-yellow font-bold text-sm tracking-widest mb-2">⚡ OBJECTIVE ⚡</div>
              <div className="text-white text-lg font-bold">
                {directorMode === 'HACK' && (
                  <>DRAG <span className="text-neon-green">ENCRYPTION</span> TO 100% AND <span className="text-neon-red">LOCK</span> IT</>
                )}
                {directorMode === 'CARDIAC' && (
                  <>SET <span className="text-neon-yellow">ACCESS</span> TO 100% TO ALLOW EMT ENTRY</>
                )}
                {directorMode === 'BATTERY' && (
                  <>REDUCE <span className="text-neon-red">SAMPLING</span> TO SAVE POWER</>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {outcome && (
        <SimulationResult outcome={outcome} onReset={resetSimulation} />
      )}

      {/* Hard Stop Overlays */}
      <OutcomeOverlay 
        type={hardStopOverlay} 
        onClose={() => {
          setHardStopOverlay(null);
          resetSimulation();
        }} 
      />
    </CRTContainer>
  );
};
