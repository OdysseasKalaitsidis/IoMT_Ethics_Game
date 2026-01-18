import { Outcome } from './types';
import type { Config, Metrics } from './types';
import { THRESHOLDS } from './constants';

export class PacemakerEngine {
  static calculateMetrics(config: Config): Metrics {
    // Logic:
    // High Encryption = Low Battery
    // High Sampling = Low Battery
    // High Access = High Accessibility (and risk)
    
    // Base battery is 10 years.
    // Encryption (0-100) reduces it up to 4 years.
    // Sampling (0-100) reduces it up to 4 years.
    
    const encryptionDrain = (config.encryption / 100) * 4;
    const samplingDrain = (config.sampling / 100) * 4;
    let batteryYears = 10 - encryptionDrain - samplingDrain;
    batteryYears = Math.max(0, parseFloat(batteryYears.toFixed(1))); // Ensure no negative

    // Security Score
    // Increases with Encryption
    // Decreases with Access
    const securityScore = Math.min(100, Math.max(0, 
      (config.encryption * 0.7) + ((100 - config.access) * 0.3)
    ));

    // Accessibility Score
    // Increases with Access
    // Decreases with Encryption slightly (harder to use)
    const accessibilityScore = Math.min(100, Math.max(0, 
      (config.access * 0.9) - (config.encryption * 0.1)
    ));

    return {
      batteryYears,
      securityScore: Math.round(securityScore),
      accessibilityScore: Math.round(accessibilityScore)
    };
  }

  static getOutcome(metrics: Metrics, config?: { sampling: number }): Outcome {
    // Zero sampling means no cardiac data - algorithm cannot detect arrhythmias
    if (config && config.sampling === 0) {
      return Outcome.ALGORITHM_FAILURE;
    }

    if (metrics.batteryYears < THRESHOLDS.BATTERY_DEATH) {
      return Outcome.SURGICAL_FAILURE;
    }

    if (metrics.securityScore > THRESHOLDS.LOCKOUT_SECURITY && metrics.accessibilityScore < THRESHOLDS.LOCKOUT_ACCESS) {
        // High security, low access -> Lockout
        return Outcome.LOCKOUT_DEATH;
    }

    // Checking original metric logic: "Ransomware" (Access > 70, Security < 40)
    // Access score roughly follows Access config. Security Score roughly follows Encryption.
    // Let's use the calculated metrics for consistency, or raw config? 
    // The prompt implementation plan said: "Ransomware" (Access > 70, Security < 40).
    // Let's stick to the prompt's condition mapping to our metrics if possible, or use config if it makes more sense.
    // Using Metrics is cleaner for the engine.
    
    // Note: The prompt Logic said: "Lockout Death" (Security > 80, Access < 30).
    // The prompt Logic said: "Ransomware" (Access > 70, Security < 40).
    // I will use the Metrics for these checks.
    
    if (metrics.accessibilityScore > THRESHOLDS.RANSOMWARE_ACCESS && metrics.securityScore < THRESHOLDS.RANSOMWARE_SECURITY) {
        return Outcome.RANSOMWARE;
    }

    // New Granular Outcomes
    
    // 1. PRIVACY LEAK:
    // If Access is high (> 60) AND Security is moderate/low (< 60), but not enough for Ransomware/Lockout
    // Represents "Legal" sharing or vulnerabilities being exploited quietly.
    // Using simple threshold logic:
    if (metrics.accessibilityScore > 60 && metrics.securityScore < 60) {
        return Outcome.PRIVACY_LEAK;
    }

    // 2. LATENCY CRITICAL:
    // If Encryption is very high (> 80), causing processing delay (Simulated).
    // Or if Sampling is too LOW (< 20) causing missed beats contextually? 
    // The prompt scenario said "Encryption too high".
    if (metrics.securityScore > 80 && metrics.accessibilityScore < 50) {
        // High security but low access might also be close to Lockout, 
        // but if it didn't trigger Lockout (Access < 30), it's Latency.
        return Outcome.LATENCY_CRITICAL;
        // Config: Encryption > 80 usually implies Security Score > 50-60.
    }

    // Default Good State
    return Outcome.OPTIMAL_STABILIZATION;
  }
}
