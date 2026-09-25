/**
 * Cindevra 2.0 — Clinical Alert Lifecycle & Standing Orders Architecture
 * 
 * Strict clinical state modeling:
 * - Differentiates active, acknowledged, worsening escalation, resolved, and signal_unavailable states.
 * - Enforces episode IDs for atomic tracking across patient sessions.
 * - Stores raw numeric metrics alongside formatted strings for mathematically rigorous worsening detection.
 * - Grounds standing orders with explicit statuses: selected, ordered, administered.
 */

export type AlertLifecycleState = 
  | 'active_unacknowledged' 
  | 'acknowledged_ongoing' 
  | 'worsening_escalation' 
  | 'signal_unavailable'
  | 'resolved';

export type AlertEvaluationStatus = 'active' | 'inactive' | 'unknown';

export interface AlertNumericMetrics {
  hr_bpm?: number | null;
  bp_systolic?: number | null;
  bp_diastolic?: number | null;
  map_mmhg?: number | null;
  spo2_percent?: number | null;
  hrv_rmssd_ms?: number | null;
}

export interface StandingOrderTemplate {
  orderId: string;
  compoundSuitability: string[]; // e.g. ['Psilocybin', 'MDMA', 'Ketamine', 'All']
  applicableAlertCategories: string[];
  medicationName: string;
  dosageRoute: string;
  indication: string;
  contraindications: string[];
  protocolThresholdNote: string;
}

export type MedicationInterventionStatus = 'none' | 'selected' | 'ordered' | 'administered';

export interface AttestationRecord {
  attestationId: string;
  attestedAt: string;
  attestedBy: string;
  metricsSnapshot: AlertNumericMetrics;
  displayValueSnapshot: string;
  type: 'initial_acknowledgment' | 're_attestation';
  note?: string;
}

export interface EscalationRecord {
  escalationId: string;
  escalatedAt: string;
  metrics: AlertNumericMetrics;
  displayValue: string;
  reason: string;
}

export interface ClinicalAlertEpisode {
  episodeId: string;                 // UUID-v4 per distinct incident
  alertKey: string;                  // e.g. "desaturation", "hypertensive_spike"
  journeyId: string;                 // e.g. "AE-9941"
  title: string;
  category: 'BLOOD_PRESSURE' | 'HEART_RATE' | 'OXYGENATION' | 'AUTONOMIC_STORM' | 'SIGNAL_INTEGRITY';
  severity: 'CRITICAL' | 'HIGH' | 'MODERATE' | 'ADVISORY';
  state: AlertLifecycleState;
  
  // Numerical snapshots for deterministic clinical evaluation
  initialTriggerBaseline: AlertNumericMetrics; // Immutable initial trigger values
  triggerMetrics: AlertNumericMetrics;
  latestMetrics: AlertNumericMetrics;
  acknowledgedMetrics?: AlertNumericMetrics; // Most recent attested baseline
  
  // Human readable representation
  triggerDisplayValue: string;
  latestDisplayValue: string;
  acknowledgedDisplayValue?: string;
  
  // Immutable Audit Histories
  attestationHistory: AttestationRecord[];
  escalationHistory: EscalationRecord[];

  // Attestation & Timestamps
  firstTriggeredAt: string;
  acknowledgedAt?: string;
  acknowledgedBy?: string;
  lastEvaluatedAt: string;
  resolvedAt?: string;
  
  // Signal integrity & fresh sample tracking
  associatedDeviceId: string;
  lastEvaluatedSampleTimestamp?: string;
  lastEvaluatedSequenceNumber?: number;
  
  // Clinical protocol guidance
  protocolThresholdDescription: string;
  recommendedActions: string[];
}
