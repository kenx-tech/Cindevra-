/**
 * Cindevra 2.0 Trunk Layer — Hardware & Telemetry Data Contracts
 * 
 * Defines the deterministic data architecture for physical sensor integration,
 * real-time autonomic monitoring, pharmacodynamic phase tracking, and safety overlays.
 */

// ==========================================
// 1. CORE COMMON TELEMETRY STREAM CONTRACT
// ==========================================

export type TelemetryDeviceType = 'ecg' | 'continuous_bp' | 'spo2' | 'eeg' | 'other';
export type TelemetryQualityFlag = 'awaiting_data' | 'good' | 'marginal' | 'poor' | 'disconnected' | 'stale';

export interface TelemetryEnvelope<TPayload> {
  stream_id: string;                  // UUID-v4
  device_id: string;                  // Hardware serial number or virtual node ID
  device_type: TelemetryDeviceType;
  patient_journey_id: string;         // e.g. "AE-9941"
  timestamp_utc: string;              // ISO-8601 with millisecond precision
  sequence_number: number;            // Monotonically increasing uint64 per device
  sample_rate_hz: number;
  quality_flag: TelemetryQualityFlag;
  payload: TPayload;
}

// ==========================================
// 2. DEVICE-SPECIFIC PAYLOAD CONTRACTS
// ==========================================

/**
 * 2.1 ECG / Heart Rate & HRV (e.g., Polar H10 or clinical equivalent)
 * Minimum accepted sample rate: 1 Hz for HR, preferred 1000 Hz raw or RR-interval stream.
 */
export interface ECGPayload {
  heart_rate_bpm: number;             // Range: 30 - 220 bpm
  rr_intervals_ms: number[];          // Array of successive R-R peak intervals
  hrv_rmssd_ms: number | null;        // Root Mean Square of Successive Differences
  hrv_sdnn_ms: number | null;         // Standard deviation of NN intervals
  signal_quality: number;             // 0.0 to 1.0 confidence score
}

/**
 * 2.2 Continuous Blood Pressure (e.g., CNAP, Finapres, or Cuff Monitor)
 * Typical cadence: every 1-5 minutes during active journey; higher during ascent/peak.
 */
export interface ContinuousBPPayload {
  systolic_mmhg: number;              // Systolic pressure (mmHg)
  diastolic_mmhg: number;             // Diastolic pressure (mmHg)
  mean_arterial_pressure_mmhg: number | null;
  pulse_pressure_mmhg: number | null;
  measurement_method: 'oscillometric' | 'continuous_noninvasive' | 'invasive';
}

/**
 * 2.3 Pulse Oximetry (SpO₂)
 */
export interface SpO2Payload {
  spo2_percent: number;               // Range: 70 - 100%
  perfusion_index: number | null;     // Optical perfusion index (0.02% - 20%)
  pulse_rate_bpm: number | null;      // Secondary optical confirmation of HR
}

/**
 * 2.4 EEG Band Power (e.g., Muse, OpenBCI Cyton, or Clinical 10-20 system)
 * Preferred: 256 Hz or higher raw, or 1-4 Hz band-power updates.
 */
export interface EEGBandPowerPayload {
  channels: string[];                 // e.g. ["Fp1", "Fp2", "T3", "T4", "Cz"]
  band_power: {
    delta_uV2: number;                // 0.5 - 4 Hz (Deep slow wave / trance state)
    theta_uV2: number;                // 4 - 8 Hz (Hypnagogic / memory retrieval)
    alpha_uV2: number;                // 8 - 12 Hz (Relaxed wakefulness / oceanic calm)
    beta_uV2: number;                 // 12 - 30 Hz (Active cognition / rumination)
    gamma_uV2: number;                // 30 - 100 Hz (Binding / peak insight)
  };
  alpha_theta_ratio: number | null;   // Correlates with ego-softening & boundary dissolution
  artifact_flag: boolean;             // True if ocular or muscular artifact detected
}

// Concrete Typed Envelopes
export type ECGTelemetryPacket = TelemetryEnvelope<ECGPayload>;
export type BPTelemetryPacket = TelemetryEnvelope<ContinuousBPPayload>;
export type SpO2TelemetryPacket = TelemetryEnvelope<SpO2Payload>;
export type EEGTelemetryPacket = TelemetryEnvelope<EEGBandPowerPayload>;

// ==========================================
// 3. DERIVED / SYSTEM-LEVEL CONTRACTS
// ==========================================

export type PharmacodynamicPhase = 
  | 'preparation' 
  | 'ingestion' 
  | 'ascent' 
  | 'oceanic_peak' 
  | 'ego_dissolution' 
  | 'descent' 
  | 'return' 
  | 'integration';

export interface DerivedAutonomicSummary {
  journey_id: string;
  timestamp_utc: string;
  current_phase: PharmacodynamicPhase;
  autonomic_summary: {
    hr_bpm: number | null;
    hrv_rmssd_ms: number | null;
    bp_systolic: number | null;
    bp_diastolic: number | null;
    spo2: number | null;
    alpha_theta_synchrony: number | null;
  };
  safety_flags: {
    hypertensive_spike: boolean;      // Sys >= 165 or Dia >= 100
    hypotensive_event: boolean;       // Sys < 90 or MAP < 65
    desaturation: boolean;            // SpO2 < 92%
    extreme_tachycardia: boolean;     // HR >= 135 bpm sustained > 2 min
    extreme_bradycardia: boolean;     // HR <= 45 bpm
    autonomic_storm: boolean;         // Tachycardia + Hypertensive spike + Low HRV
  };
  stream_quality_score: number;       // 0.0 - 1.0 (weighted data completeness of active sensor streams)
  phase_confidence: number;           // Backward compatible alias
}

// ==========================================
// 4. CONNECTION & LIFECYCLE CONTRACTS
// ==========================================

export interface DeviceRegistration {
  device_id: string;
  device_type: TelemetryDeviceType;
  manufacturer: string;
  model: string;
  firmware_version: string;
  supported_streams: ('hr' | 'rr' | 'bp' | 'spo2' | 'eeg')[];
  connection_method: 'bluetooth_le' | 'wifi' | 'usb' | 'simulated';
  calibration_status: 'calibrated' | 'needs_calibration' | 'unknown';
}

export interface DeviceLifecycleEvent {
  event: 'connected' | 'disconnected' | 'reconnected' | 'battery_low' | 'signal_lost';
  device_id: string;
  timestamp_utc: string;
  battery_percent: number | null;
}
