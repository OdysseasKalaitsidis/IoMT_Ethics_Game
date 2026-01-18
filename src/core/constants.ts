import { Outcome } from './types';

export const OUTCOME_DETAILS = {
  [Outcome.SURGICAL_FAILURE]: {
    title: "SURGICAL FAILURE",
    description: "Battery depleted. Patient died on the table during re-operation.",
    code: "ERR_BAT",
    color: "text-neon-red"
  },
  [Outcome.LOCKOUT_DEATH]: {
    title: "EMERGENCY LOCKOUT",
    description: "First Responders locked out. Patient stabilization failed.",
    code: "ERR_AUTH",
    color: "text-neon-red"
  },
  [Outcome.RANSOMWARE]: {
    title: "SYSTEM COMPROMISED",
    description: "Device hacked. Ransomware deployed. Bitcoins demanded.",
    code: "ERR_HACK",
    color: "text-neon-yellow"
  },
  [Outcome.OPTIMAL_STABILIZATION]: {
    title: "VITAL STABILIZATION",
    description: "Firmware updated. Patient stable. Security nominal.",
    code: "SYS_OK",
    color: "text-neon-green"
  },
  [Outcome.PRIVACY_LEAK]: {
    title: "DATA HARVESTED",
    description: "Patient lived, but biometrics were scraped by 3rd parties.",
    code: "WARN_LEAK",
    color: "text-orange-500" // Distinct from neon-yellow/red
  },
  [Outcome.LATENCY_CRITICAL]: {
    title: "PACING LATENCY",
    description: "Encryption overhead caused missed beats. Chronic arrhythmia.",
    code: "ERR_LAG",
    color: "text-neon-red"
  },
  [Outcome.ALGORITHM_FAILURE]: {
    title: "ALGORITHM FAILURE",
    description: "Zero data sampling. Pacemaker blind to arrhythmia. Patient died.",
    code: "ERR_NOSIG",
    color: "text-neon-red"
  }
};

export const THRESHOLDS = {
  BATTERY_DEATH: 2.0, // Years
  LOCKOUT_SECURITY: 80,
  LOCKOUT_ACCESS: 30,
  RANSOMWARE_ACCESS: 70,
  RANSOMWARE_SECURITY: 40,
};
