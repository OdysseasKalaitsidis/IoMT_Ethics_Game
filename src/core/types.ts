export const Outcome = {
  SURGICAL_FAILURE: 'SURGICAL_FAILURE',
  LOCKOUT_DEATH: 'LOCKOUT_DEATH',
  RANSOMWARE: 'RANSOMWARE',
  OPTIMAL_STABILIZATION: 'OPTIMAL_STABILIZATION',
  PRIVACY_LEAK: 'PRIVACY_LEAK',
  LATENCY_CRITICAL: 'LATENCY_CRITICAL',
  ALGORITHM_FAILURE: 'ALGORITHM_FAILURE' // 0 sampling = no data = patient dies
} as const;

export type Outcome = typeof Outcome[keyof typeof Outcome];

export interface Config {
  encryption: number; // 0-100
  access: number;     // 0-100
  sampling: number;   // 0-100
}

export interface Metrics {
  batteryYears: number;
  securityScore: number;
  accessibilityScore: number;
}

export interface GameState {
  config: Config;
  metrics: Metrics;
  outcome: Outcome | null;
}
