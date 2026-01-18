import React, { useEffect, useRef } from 'react';

interface TerminalLogProps {
  logs: string[];
}

export const TerminalLog: React.FC<TerminalLogProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  return (
    <div className="h-full bg-black border-l border-gray-800 p-4 font-mono text-xs overflow-y-auto w-64 hidden xl:block">
      <div className="mb-4 text-gray-500 uppercase tracking-widest border-b border-gray-800 pb-2">
        System Logs
      </div>
      <div className="flex flex-col gap-1">
        {logs.map((log, i) => (
          <div key={i} className="break-words opacity-80">
            <span className="text-gray-600 mr-2">[{new Date().toLocaleTimeString().split(' ')[0]}]</span>
            <span className={log.includes('WARN') ? 'text-neon-yellow' : log.includes('CRITICAL') ? 'text-neon-red' : 'text-neon-green'}>
              {log}
            </span>
          </div>
        ))}
        <div ref={endRef} />
      </div>
    </div>
  );
};
