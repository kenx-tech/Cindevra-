import {
  TelemetryEnvelope,
  ECGPayload,
  ContinuousBPPayload,
  SpO2Payload,
  EEGBandPowerPayload,
  ECGTelemetryPacket,
  BPTelemetryPacket,
  SpO2TelemetryPacket,
  EEGTelemetryPacket,
  DerivedAutonomicSummary,
  PharmacodynamicPhase,
  TelemetryQualityFlag,
  TelemetryDeviceType
} from '../types/telemetry';
import {
  ClinicalAlertEpisode,
  AlertLifecycleState,
  AlertEvaluationStatus,
  AlertNumericMetrics,
  AttestationRecord,
  EscalationRecord
} from '../types/alertLifecycle';

export interface DeviceStreamStatus {
  deviceId: string;
  deviceType: TelemetryDeviceType;
  modelName: string;
  quality: TelemetryQualityFlag;
  batteryPercent: number | null;
  latencyMs: number | null;
  lastSampleTime: string | null;
  sampleCount: number;
  isStale: boolean;
  isManuallyDisconnected: boolean;
  connectionMethod: 'bluetooth_le' | 'usb' | 'wifi' | 'simulated';
}

export type TelemetrySubscriber = (
  summary: DerivedAutonomicSummary,
  devices: DeviceStreamStatus[],
  latestPackets: {
    ecg?: ECGTelemetryPacket;
    bp?: BPTelemetryPacket;
    spo2?: SpO2TelemetryPacket;
    eeg?: EEGTelemetryPacket;
  },
  activeAlertEpisodes: ClinicalAlertEpisode[]
) => void;

export type AuditWriter = (action: string, category: 'CLINICAL' | 'CONSENT' | 'LEGAL' | 'SYSTEM', actor?: string) => void;

/**
 * 2.0 Trunk Layer — Telemetry Ingestion & Real-Time Biometric Engine
 * 
 * Strict Clinical Data-Integrity Architecture:
 * - Deterministic alert evaluation with active / inactive / unknown states.
 * - Missing or stale data transitions active alerts to 'signal_unavailable' without false resolution.
 * - Alerts resolve strictly upon valid recovery measurements meeting protocol criteria.
 * - Worsening criteria track typed numeric metrics.
 * - Recurring events generate fresh unacknowledged episode instances with preserved history.
 * - Zero fabricated battery, latency, or placeholder defaults.
 */
export class TelemetryIngestionService {
  private journeyId: string;
  private compound: string;
  private currentPhase: PharmacodynamicPhase = 'ascent';
  private subscribers: Set<TelemetrySubscriber> = new Set();
  private auditWriter?: AuditWriter;

  // Active Device Stream Registry
  private deviceStatuses: Map<string, DeviceStreamStatus> = new Map();
  private seqCounters: Map<string, number> = new Map();

  // Freshness & Stale Timeout monitoring
  private freshnessIntervalId: number | null = null;
  private readonly FRESHNESS_TIMEOUT_MS = {
    ecg: 6000,
    continuous_bp: 25000,
    spo2: 6000,
    eeg: 6000
  };

  // State caches (strictly null when awaiting data or disconnected)
  private latestECG?: ECGTelemetryPacket;
  private latestBP?: BPTelemetryPacket;
  private latestSpO2?: SpO2TelemetryPacket;
  private latestEEG?: EEGTelemetryPacket;

  // Rolling vital history for multi-point clinical smoothing
  private recentHR: number[] = [];
  private recentSystolic: number[] = [];
  private recentDiastolic: number[] = [];
  private recentRMSSD: number[] = [];
  private recentSpO2: number[] = [];

  // Active Alert Episodes Map keyed by alertKey (e.g., 'desaturation', 'hypertensive_spike')
  private activeEpisodes: Map<string, ClinicalAlertEpisode> = new Map();
  private pastResolvedEpisodes: ClinicalAlertEpisode[] = [];

  // Consecutive recovery counter for multi-point stabilization before resolution
  private recoveryStreakCounters: Map<string, number> = new Map();
  // Tracks distinct sample identifier per alert key to ensure only fresh measurements increment recovery
  private lastEvaluatedSamplePerAlert: Map<string, string> = new Map();

  // Simulation state
  private isSimulating: boolean = false;
  private simIntervalId: number | null = null;
  private elapsedSeconds: number = 0;

  constructor(
    journeyId: string = 'AE-9941',
    compound: string = 'Synthetic Psilocybin 25mg',
    auditWriter?: AuditWriter
  ) {
    this.journeyId = journeyId;
    this.compound = compound;
    this.auditWriter = auditWriter;
    this.initDefaultDevices();
    this.startFreshnessMonitor();
  }

  private initDefaultDevices() {
    this.deviceStatuses.set('POLAR-H10-88F4', {
      deviceId: 'POLAR-H10-88F4',
      deviceType: 'ecg',
      modelName: 'Polar H10 ECG Chest Strap',
      quality: 'awaiting_data',
      batteryPercent: null,
      latencyMs: null,
      lastSampleTime: null,
      sampleCount: 0,
      isStale: false,
      isManuallyDisconnected: false,
      connectionMethod: 'simulated'
    });

    this.deviceStatuses.set('CNAP-MONITOR-02', {
      deviceId: 'CNAP-MONITOR-02',
      deviceType: 'continuous_bp',
      modelName: 'CNAP Continuous NIBP 500',
      quality: 'awaiting_data',
      batteryPercent: null,
      latencyMs: null,
      lastSampleTime: null,
      sampleCount: 0,
      isStale: false,
      isManuallyDisconnected: false,
      connectionMethod: 'simulated'
    });

    this.deviceStatuses.set('NONIN-SPO2-01', {
      deviceId: 'NONIN-SPO2-01',
      deviceType: 'spo2',
      modelName: 'Nonin WristOx2 Pulse Oximeter',
      quality: 'awaiting_data',
      batteryPercent: null,
      latencyMs: null,
      lastSampleTime: null,
      sampleCount: 0,
      isStale: false,
      isManuallyDisconnected: false,
      connectionMethod: 'simulated'
    });

    this.deviceStatuses.set('MUSE-S-EEG-77A1', {
      deviceId: 'MUSE-S-EEG-77A1',
      deviceType: 'eeg',
      modelName: 'Muse S Headband (4-ch EEG)',
      quality: 'awaiting_data',
      batteryPercent: null,
      latencyMs: null,
      lastSampleTime: null,
      sampleCount: 0,
      isStale: false,
      isManuallyDisconnected: false,
      connectionMethod: 'simulated'
    });
  }

  public setAuditWriter(writer: AuditWriter) {
    this.auditWriter = writer;
  }

  /**
   * Resets session context cleanly, preventing any telemetry cross-contamination
   * across different patients or journeys.
   */
  public setJourneyContext(journeyId: string, compound: string, phase: PharmacodynamicPhase) {
    if (this.journeyId !== journeyId) {
      if (this.auditWriter) {
        this.auditWriter(`Switching journey context from ${this.journeyId} to ${journeyId}. Purging all cached packets and alert episodes.`, 'SYSTEM');
      }
      this.journeyId = journeyId;
      this.compound = compound;
      this.currentPhase = phase;
      this.resetAllTelemetryBuffers();
    } else {
      this.compound = compound;
      this.currentPhase = phase;
      this.evaluateAndBroadcast();
    }
  }

  public setPhase(phase: PharmacodynamicPhase) {
    this.currentPhase = phase;
    this.evaluateAndBroadcast();
  }

  public setElapsedSeconds(seconds: number) {
    this.elapsedSeconds = seconds;
  }

  public resetAllTelemetryBuffers() {
    this.latestECG = undefined;
    this.latestBP = undefined;
    this.latestSpO2 = undefined;
    this.latestEEG = undefined;

    this.recentHR = [];
    this.recentSystolic = [];
    this.recentDiastolic = [];
    this.recentRMSSD = [];
    this.recentSpO2 = [];
    this.activeEpisodes.clear();
    this.pastResolvedEpisodes = [];
    this.recoveryStreakCounters.clear();
    this.lastEvaluatedSamplePerAlert.clear();
    this.seqCounters.clear();

    // Reset device statuses to awaiting_data
    for (const dev of this.deviceStatuses.values()) {
      dev.quality = 'awaiting_data';
      dev.batteryPercent = null;
      dev.latencyMs = null;
      dev.lastSampleTime = null;
      dev.sampleCount = 0;
      dev.isStale = false;
      dev.isManuallyDisconnected = false;
    }

    this.evaluateAndBroadcast();
  }

  public getActiveEpisodesList(): ClinicalAlertEpisode[] {
    return Array.from(this.activeEpisodes.values());
  }

  public getPastResolvedEpisodesList(): ClinicalAlertEpisode[] {
    return [...this.pastResolvedEpisodes];
  }

  public getEpisodeById(episodeId: string): ClinicalAlertEpisode | undefined {
    for (const ep of this.activeEpisodes.values()) {
      if (ep.episodeId === episodeId) return ep;
    }
    return this.pastResolvedEpisodes.find(ep => ep.episodeId === episodeId);
  }

  // ==========================================
  // INGESTION PIPELINE WITH STRICT VALIDATION
  // ==========================================

  public ingestECG(packet: ECGTelemetryPacket): boolean {
    if (!this.validatePacket(packet)) return false;

    this.updateDeviceStatus(packet.device_id, packet.quality_flag, packet.timestamp_utc);
    this.latestECG = packet;
    this.recentHR.push(packet.payload.heart_rate_bpm);
    if (packet.payload.hrv_rmssd_ms !== null) {
      this.recentRMSSD.push(packet.payload.hrv_rmssd_ms);
    }
    if (this.recentHR.length > 30) this.recentHR.shift();
    if (this.recentRMSSD.length > 30) this.recentRMSSD.shift();

    this.evaluateAndBroadcast();
    return true;
  }

  public ingestBP(packet: BPTelemetryPacket): boolean {
    if (!this.validatePacket(packet)) return false;

    this.updateDeviceStatus(packet.device_id, packet.quality_flag, packet.timestamp_utc);
    this.latestBP = packet;
    this.recentSystolic.push(packet.payload.systolic_mmhg);
    this.recentDiastolic.push(packet.payload.diastolic_mmhg);
    if (this.recentSystolic.length > 20) this.recentSystolic.shift();
    if (this.recentDiastolic.length > 20) this.recentDiastolic.shift();

    this.evaluateAndBroadcast();
    return true;
  }

  public ingestSpO2(packet: SpO2TelemetryPacket): boolean {
    if (!this.validatePacket(packet)) return false;

    this.updateDeviceStatus(packet.device_id, packet.quality_flag, packet.timestamp_utc);
    this.latestSpO2 = packet;
    this.recentSpO2.push(packet.payload.spo2_percent);
    if (this.recentSpO2.length > 20) this.recentSpO2.shift();

    this.evaluateAndBroadcast();
    return true;
  }

  public ingestEEG(packet: EEGTelemetryPacket): boolean {
    if (!this.validatePacket(packet)) return false;

    this.updateDeviceStatus(packet.device_id, packet.quality_flag, packet.timestamp_utc);
    this.latestEEG = packet;

    this.evaluateAndBroadcast();
    return true;
  }

  private validatePacket<T>(packet: TelemetryEnvelope<T>): boolean {
    // Journey ID strict verification
    if (packet.patient_journey_id !== this.journeyId) {
      console.warn(`[TelemetryIngestionService] Packet rejected: journey ID mismatch (Expected: ${this.journeyId}, Received: ${packet.patient_journey_id})`);
      if (this.auditWriter) {
        this.auditWriter(`REJECTED PACKET: Journey ID mismatch for stream ${packet.stream_id} (${packet.patient_journey_id} vs active ${this.journeyId})`, 'SYSTEM');
      }
      return false;
    }

    // Sequence number verification
    const lastSeq = this.seqCounters.get(packet.device_id) || 0;
    if (packet.sequence_number < lastSeq) {
      console.warn(`[TelemetryIngestionService] Out of order sequence packet detected on ${packet.device_id}: ${packet.sequence_number} <= ${lastSeq}`);
    }
    this.seqCounters.set(packet.device_id, packet.sequence_number);

    return true;
  }

  private updateDeviceStatus(deviceId: string, quality: TelemetryQualityFlag, timestampUtc: string) {
    const status = this.deviceStatuses.get(deviceId);
    if (status) {
      if (status.isManuallyDisconnected) {
        // Device is under persistent manual disconnection artifact until explicitly cleared
        return;
      }
      status.quality = quality;
      status.lastSampleTime = timestampUtc;
      status.sampleCount += 1;
      status.isStale = false;
      status.connectionMethod = this.isSimulating ? 'simulated' : 'bluetooth_le';
      
      // Calculate realistic latency from payload timestamp if available, otherwise null
      const now = Date.now();
      const sampleTime = new Date(timestampUtc).getTime();
      const diff = now - sampleTime;
      status.latencyMs = (diff >= 0 && diff < 10000) ? diff : null;
      
      // Battery is preserved as reported by telemetry packet metadata, never fabricated with fallback defaults
      // (status.batteryPercent remains null if not reported)
    }
  }

  // ==========================================
  // STALE DATA MONITORING & FRESHNESS
  // ==========================================

  private startFreshnessMonitor() {
    if (this.freshnessIntervalId) return;
    this.freshnessIntervalId = window.setInterval(() => {
      this.checkDataFreshness();
    }, 1000);
  }

  private checkDataFreshness() {
    const now = Date.now();
    let stateChanged = false;

    for (const [, dev] of this.deviceStatuses.entries()) {
      if (!dev.lastSampleTime || dev.quality === 'awaiting_data' || dev.isManuallyDisconnected) {
        continue;
      }

      const lastSampleMs = new Date(dev.lastSampleTime).getTime();
      const ageMs = now - lastSampleMs;
      const timeout = this.FRESHNESS_TIMEOUT_MS[dev.deviceType as keyof typeof this.FRESHNESS_TIMEOUT_MS] || 8000;

      if (ageMs > timeout && !dev.isStale) {
        dev.isStale = true;
        dev.quality = 'stale';
        stateChanged = true;
      }
    }

    if (stateChanged) {
      this.evaluateAndBroadcast();
    }
  }

  // ==========================================
  // AUTONOMIC EVALUATION & DETERMINISTIC ALERTS
  // ==========================================

  public evaluateAndBroadcast() {
    // Check channel validities strictly based on hardware state and freshness
    const ecgDev = this.deviceStatuses.get('POLAR-H10-88F4');
    const bpDev = this.deviceStatuses.get('CNAP-MONITOR-02');
    const spo2Dev = this.deviceStatuses.get('NONIN-SPO2-01');
    const eegDev = this.deviceStatuses.get('MUSE-S-EEG-77A1');

    const ecgValid = ecgDev && ecgDev.quality === 'good' && !ecgDev.isStale && !ecgDev.isManuallyDisconnected;
    const bpValid = bpDev && (bpDev.quality === 'good' || bpDev.quality === 'marginal') && !bpDev.isStale && !bpDev.isManuallyDisconnected;
    const spo2Valid = spo2Dev && spo2Dev.quality === 'good' && !spo2Dev.isStale && !spo2Dev.isManuallyDisconnected;
    const eegValid = eegDev && eegDev.quality === 'good' && !eegDev.isStale && !eegDev.isManuallyDisconnected;

    const hr = (ecgValid && this.latestECG) ? Number(this.latestECG.payload.heart_rate_bpm) : null;
    const rmssd = (ecgValid && this.latestECG) ? Number(this.latestECG.payload.hrv_rmssd_ms) : null;
    const sys = (bpValid && this.latestBP) ? Number(this.latestBP.payload.systolic_mmhg) : null;
    const dia = (bpValid && this.latestBP) ? Number(this.latestBP.payload.diastolic_mmhg) : null;
    const map = (sys !== null && dia !== null) ? Math.round((sys + 2 * dia) / 3) : null;
    const spo2 = (spo2Valid && this.latestSpO2) ? Number(this.latestSpO2.payload.spo2_percent) : null;
    const alphaTheta = (eegValid && this.latestEEG) ? Number(this.latestEEG.payload.alpha_theta_ratio) : null;

    // Evaluate each biometric condition deterministically into active / inactive / unknown states
    this.evaluateAlertLifecycles({
      ecgValid: Boolean(ecgValid),
      bpValid: Boolean(bpValid),
      spo2Valid: Boolean(spo2Valid),
      hr,
      rmssd,
      sys,
      dia,
      map,
      spo2
    });

    // Safety Alert Boolean Flags (for backward-compatible UI derived summaries)
    const hypertensiveSpike = sys !== null && dia !== null && (sys >= 165 || dia >= 100);
    const hypotensiveEvent = sys !== null && dia !== null && (sys < 90 || (map !== null && map < 65));
    const desaturation = spo2 !== null && spo2 < 92;
    const extremeTachycardia = hr !== null && hr >= 135;
    const extremeBradycardia = hr !== null && hr <= 45;
    const autonomicStorm = (
      hr !== null && hr >= 115 &&
      sys !== null && sys >= 155 &&
      rmssd !== null && rmssd <= 25
    );

    // Compute Hardware Stream Quality Score (Weighted across active biometric channels)
    let scoreTotal = 0;
    let weightTotal = 0;

    const devArray = Array.from(this.deviceStatuses.values());
    for (const dev of devArray) {
      const weight = dev.deviceType === 'ecg' ? 35 : dev.deviceType === 'continuous_bp' ? 30 : dev.deviceType === 'spo2' ? 20 : 15;
      weightTotal += weight;

      if (dev.quality === 'good' && !dev.isStale && !dev.isManuallyDisconnected) {
        scoreTotal += weight;
      } else if (dev.quality === 'marginal' && !dev.isStale) {
        scoreTotal += weight * 0.7;
      } else if (dev.quality === 'poor' && !dev.isStale) {
        scoreTotal += weight * 0.3;
      }
    }

    const streamQualityScore = weightTotal > 0 ? Number((scoreTotal / weightTotal).toFixed(2)) : 0;

    const summary: DerivedAutonomicSummary = {
      journey_id: this.journeyId,
      timestamp_utc: new Date().toISOString(),
      current_phase: this.currentPhase,
      autonomic_summary: {
        hr_bpm: hr,
        hrv_rmssd_ms: rmssd,
        bp_systolic: sys,
        bp_diastolic: dia,
        spo2: spo2,
        alpha_theta_synchrony: alphaTheta
      },
      safety_flags: {
        hypertensive_spike: hypertensiveSpike,
        hypotensive_event: hypotensiveEvent,
        desaturation: desaturation,
        extreme_tachycardia: extremeTachycardia,
        extreme_bradycardia: extremeBradycardia,
        autonomic_storm: autonomicStorm
      },
      stream_quality_score: streamQualityScore,
      phase_confidence: streamQualityScore
    };

    // Notify all subscribers
    const packets = {
      ecg: ecgValid ? this.latestECG : undefined,
      bp: bpValid ? this.latestBP : undefined,
      spo2: spo2Valid ? this.latestSpO2 : undefined,
      eeg: eegValid ? this.latestEEG : undefined
    };

    const activeEpisodesList = Array.from(this.activeEpisodes.values());
    this.subscribers.forEach((cb) => cb(summary, devArray, packets, activeEpisodesList));
  }

  /**
   * Deterministic Alert Lifecycle Manager
   * 
   * States evaluated:
   * - active: Criteria exceeded on valid live packet -> opens or updates episode.
   * - unknown: Signal dropped, stale, or lead off -> transitions existing episode to 'signal_unavailable' (NEVER resolves).
   * - inactive: Valid live packets confirm values in safe range -> increments stabilization streak and resolves strictly upon sustained recovery.
   */
  private evaluateAlertLifecycles(ctx: {
    ecgValid: boolean;
    bpValid: boolean;
    spo2Valid: boolean;
    hr: number | null;
    rmssd: number | null;
    sys: number | null;
    dia: number | null;
    map: number | null;
    spo2: number | null;
  }) {
    const now = new Date().toISOString();

    // Prepare unique sample identifiers per device channel to strictly verify fresh measurements
    const spo2SampleId = (ctx.spo2Valid && this.latestSpO2) ? `${this.latestSpO2.sequence_number}_${this.latestSpO2.timestamp_utc}` : undefined;
    const bpSampleId = (ctx.bpValid && this.latestBP) ? `${this.latestBP.sequence_number}_${this.latestBP.timestamp_utc}` : undefined;
    const ecgSampleId = (ctx.ecgValid && this.latestECG) ? `${this.latestECG.sequence_number}_${this.latestECG.timestamp_utc}` : undefined;
    const stormSampleId = (ctx.ecgValid && ctx.bpValid && this.latestECG && this.latestBP) 
      ? `${this.latestECG.sequence_number}_${this.latestBP.sequence_number}_${this.latestECG.timestamp_utc}`
      : undefined;

    // 1. OXYGEN DESATURATION (SpO2 < 92%)
    let spo2Status: AlertEvaluationStatus = 'unknown';
    if (ctx.spo2Valid && ctx.spo2 !== null) {
      spo2Status = ctx.spo2 < 92 ? 'active' : 'inactive';
    }
    this.processSingleAlertLifecycle({
      alertKey: 'desaturation',
      status: spo2Status,
      title: 'Oxygen Desaturation (SpO₂ < 92%)',
      category: 'OXYGENATION',
      severity: 'CRITICAL',
      associatedDeviceId: 'NONIN-SPO2-01',
      sampleIdentifier: spo2SampleId,
      sequenceNumber: this.latestSpO2?.sequence_number,
      currentMetrics: { spo2_percent: ctx.spo2 },
      currentDisplayValue: ctx.spo2 !== null ? `${ctx.spo2}% SpO₂` : '--% SpO₂',
      thresholdDesc: 'SpO₂ < 92% (Airway/Ventilation Protocol Threshold)',
      recommendedActions: [
        'Check participant airway posture (head/neck alignment)',
        'Prompt intentional diaphragmatic respiration',
        'Verify pulse oximeter probe seating and perfusion index',
        'Prepare supplemental O2 (2-4 L/min) if desaturation persists'
      ],
      worseningCheck: (prev, curr) => {
        if (prev.spo2_percent !== undefined && curr.spo2_percent !== undefined && prev.spo2_percent !== null && curr.spo2_percent !== null) {
          return curr.spo2_percent <= prev.spo2_percent - 2; // Worsening if drops 2% further
        }
        return false;
      },
      requiredRecoveryTicks: 3,
      timestamp: now
    });

    // 2. HIGH BLOOD PRESSURE — PROTOCOL THRESHOLD (Sys >= 165 or Dia >= 100)
    let bpHighStatus: AlertEvaluationStatus = 'unknown';
    if (ctx.bpValid && ctx.sys !== null && ctx.dia !== null) {
      bpHighStatus = (ctx.sys >= 165 || ctx.dia >= 100) ? 'active' : 'inactive';
    }
    this.processSingleAlertLifecycle({
      alertKey: 'hypertensive_spike',
      status: bpHighStatus,
      title: 'High Blood Pressure — Protocol Threshold Exceeded (≥165/100 mmHg)',
      category: 'BLOOD_PRESSURE',
      severity: 'CRITICAL',
      associatedDeviceId: 'CNAP-MONITOR-02',
      sampleIdentifier: bpSampleId,
      sequenceNumber: this.latestBP?.sequence_number,
      currentMetrics: { bp_systolic: ctx.sys, bp_diastolic: ctx.dia, map_mmhg: ctx.map },
      currentDisplayValue: ctx.sys !== null && ctx.dia !== null ? `${ctx.sys}/${ctx.dia} mmHg` : '--/-- mmHg',
      thresholdDesc: 'Systolic ≥ 165 or Diastolic ≥ 100 mmHg (Protocol Intervention Threshold)',
      recommendedActions: [
        'Pause session dialogue and assess somatic panic vs physical movement',
        'Verify cuff fit/placement and repeat measurement',
        'Consider physician consultation if sustained >10 minutes'
      ],
      worseningCheck: (prev, curr) => {
        const prevSys = prev.bp_systolic ?? 0;
        const currSys = curr.bp_systolic ?? 0;
        const prevDia = prev.bp_diastolic ?? 0;
        const currDia = curr.bp_diastolic ?? 0;
        return (currSys >= prevSys + 8) || (currDia >= prevDia + 6);
      },
      requiredRecoveryTicks: 2,
      timestamp: now
    });

    // 3. HYPOTENSIVE EVENT (Sys < 90 or MAP < 65)
    let bpLowStatus: AlertEvaluationStatus = 'unknown';
    if (ctx.bpValid && ctx.sys !== null && ctx.dia !== null && ctx.map !== null) {
      bpLowStatus = (ctx.sys < 90 || ctx.map < 65) ? 'active' : 'inactive';
    }
    this.processSingleAlertLifecycle({
      alertKey: 'hypotensive_event',
      status: bpLowStatus,
      title: 'Hypotensive Event Detected (MAP < 65 mmHg)',
      category: 'BLOOD_PRESSURE',
      severity: 'HIGH',
      associatedDeviceId: 'CNAP-MONITOR-02',
      sampleIdentifier: bpSampleId,
      sequenceNumber: this.latestBP?.sequence_number,
      currentMetrics: { bp_systolic: ctx.sys, bp_diastolic: ctx.dia, map_mmhg: ctx.map },
      currentDisplayValue: ctx.sys !== null && ctx.dia !== null ? `${ctx.sys}/${ctx.dia} mmHg (MAP ${ctx.map})` : '--/--',
      thresholdDesc: 'Systolic < 90 mmHg or Mean Arterial Pressure < 65 mmHg',
      recommendedActions: [
        'Elevate participant legs (Trendelenburg position)',
        'Offer oral electrolyte hydration if fully oriented and conscious',
        'Assess for vasovagal episode triggers'
      ],
      worseningCheck: (prev, curr) => {
        const prevMap = prev.map_mmhg ?? 65;
        const currMap = curr.map_mmhg ?? 65;
        return currMap <= prevMap - 5;
      },
      requiredRecoveryTicks: 2,
      timestamp: now
    });

    // 4. AUTONOMIC STORM (Tachycardia + Elevated BP + Sympathetic Surge)
    let stormStatus: AlertEvaluationStatus = 'unknown';
    if (ctx.ecgValid && ctx.bpValid && ctx.hr !== null && ctx.sys !== null && ctx.rmssd !== null) {
      stormStatus = (ctx.hr >= 115 && ctx.sys >= 155 && ctx.rmssd <= 25) ? 'active' : 'inactive';
    }
    this.processSingleAlertLifecycle({
      alertKey: 'autonomic_storm',
      status: stormStatus,
      title: 'Acute Autonomic Surge (Sympathetic Hyperarousal)',
      category: 'AUTONOMIC_STORM',
      severity: 'CRITICAL',
      associatedDeviceId: 'POLAR-H10-88F4',
      sampleIdentifier: stormSampleId,
      sequenceNumber: this.latestECG?.sequence_number,
      currentMetrics: { hr_bpm: ctx.hr, bp_systolic: ctx.sys, hrv_rmssd_ms: ctx.rmssd },
      currentDisplayValue: ctx.hr !== null && ctx.sys !== null && ctx.rmssd !== null ? `HR ${ctx.hr} bpm, Sys ${ctx.sys} mmHg, RMSSD ${ctx.rmssd} ms` : '--',
      thresholdDesc: 'HR ≥ 115 bpm + Systolic ≥ 155 mmHg + HRV RMSSD ≤ 25 ms',
      recommendedActions: [
        'Engage 1:1 somatic hand anchor over sternum with verbal consent',
        'Shift acoustic sanctuary soundscape to 432 Hz grounding sine drone',
        'Guide 4-7-8 diaphragmatic pacing'
      ],
      worseningCheck: (prev, curr) => {
        const prevHR = prev.hr_bpm ?? 0;
        const currHR = curr.hr_bpm ?? 0;
        return currHR >= prevHR + 10;
      },
      requiredRecoveryTicks: 2,
      timestamp: now
    });

    // 5. EXTREME TACHYCARDIA (HR >= 135 bpm)
    let tachyStatus: AlertEvaluationStatus = 'unknown';
    if (ctx.ecgValid && ctx.hr !== null) {
      tachyStatus = ctx.hr >= 135 ? 'active' : 'inactive';
    }
    this.processSingleAlertLifecycle({
      alertKey: 'extreme_tachycardia',
      status: tachyStatus,
      title: 'Extreme Tachycardia — Protocol Threshold (≥135 bpm)',
      category: 'HEART_RATE',
      severity: 'HIGH',
      associatedDeviceId: 'POLAR-H10-88F4',
      sampleIdentifier: ecgSampleId,
      sequenceNumber: this.latestECG?.sequence_number,
      currentMetrics: { hr_bpm: ctx.hr },
      currentDisplayValue: ctx.hr !== null ? `${ctx.hr} bpm` : '-- bpm',
      thresholdDesc: 'Heart Rate ≥ 135 bpm sustained',
      recommendedActions: [
        'Differentiate somatic panic from physical restlessness',
        'Apply vagal stimulation (cool compress to forehead)',
        'Continuous rhythm check for supraventricular ectopic beats'
      ],
      worseningCheck: (prev, curr) => {
        const prevHR = prev.hr_bpm ?? 0;
        const currHR = curr.hr_bpm ?? 0;
        return currHR >= prevHR + 8;
      },
      requiredRecoveryTicks: 3,
      timestamp: now
    });

    // 6. EXTREME BRADYCARDIA (HR <= 45 bpm)
    let bradyStatus: AlertEvaluationStatus = 'unknown';
    if (ctx.ecgValid && ctx.hr !== null) {
      bradyStatus = ctx.hr <= 45 ? 'active' : 'inactive';
    }
    this.processSingleAlertLifecycle({
      alertKey: 'extreme_bradycardia',
      status: bradyStatus,
      title: 'Extreme Bradycardia — Protocol Threshold (≤45 bpm)',
      category: 'HEART_RATE',
      severity: 'HIGH',
      associatedDeviceId: 'POLAR-H10-88F4',
      sampleIdentifier: ecgSampleId,
      sequenceNumber: this.latestECG?.sequence_number,
      currentMetrics: { hr_bpm: ctx.hr },
      currentDisplayValue: ctx.hr !== null ? `${ctx.hr} bpm` : '-- bpm',
      thresholdDesc: 'Heart Rate ≤ 45 bpm',
      recommendedActions: [
        'Assess participant responsiveness and perfusion',
        'Verify ECG electrode adhesion and chest strap contact',
        'Escalate to medical team if participant is symptomatic'
      ],
      worseningCheck: (prev, curr) => {
        const prevHR = prev.hr_bpm ?? 45;
        const currHR = curr.hr_bpm ?? 45;
        return currHR <= prevHR - 4;
      },
      requiredRecoveryTicks: 3,
      timestamp: now
    });
  }

  private processSingleAlertLifecycle(params: {
    alertKey: string;
    status: AlertEvaluationStatus;
    title: string;
    category: ClinicalAlertEpisode['category'];
    severity: ClinicalAlertEpisode['severity'];
    associatedDeviceId: string;
    sampleIdentifier?: string;
    sequenceNumber?: number;
    currentMetrics: AlertNumericMetrics;
    currentDisplayValue: string;
    thresholdDesc: string;
    recommendedActions: string[];
    worseningCheck: (prev: AlertNumericMetrics, curr: AlertNumericMetrics) => boolean;
    requiredRecoveryTicks: number;
    timestamp: string;
  }) {
    const existing = this.activeEpisodes.get(params.alertKey);

    if (params.status === 'active') {
      // Reset recovery streak counter and record active sample identifier
      this.recoveryStreakCounters.set(params.alertKey, 0);
      if (params.sampleIdentifier) {
        this.lastEvaluatedSamplePerAlert.set(params.alertKey, params.sampleIdentifier);
      }

      if (!existing) {
        // CREATE BRAND NEW EPISODE
        const newEpisode: ClinicalAlertEpisode = {
          episodeId: crypto.randomUUID(),
          alertKey: params.alertKey,
          journeyId: this.journeyId,
          title: params.title,
          category: params.category,
          severity: params.severity,
          state: 'active_unacknowledged',
          initialTriggerBaseline: { ...params.currentMetrics },
          triggerMetrics: { ...params.currentMetrics },
          latestMetrics: { ...params.currentMetrics },
          triggerDisplayValue: params.currentDisplayValue,
          latestDisplayValue: params.currentDisplayValue,
          attestationHistory: [],
          escalationHistory: [],
          firstTriggeredAt: params.timestamp,
          lastEvaluatedAt: params.timestamp,
          associatedDeviceId: params.associatedDeviceId,
          lastEvaluatedSampleTimestamp: params.sampleIdentifier,
          lastEvaluatedSequenceNumber: params.sequenceNumber,
          protocolThresholdDescription: params.thresholdDesc,
          recommendedActions: params.recommendedActions
        };
        this.activeEpisodes.set(params.alertKey, newEpisode);

        if (this.auditWriter) {
          this.auditWriter(
            `NEW CLINICAL ALERT EPISODE [${newEpisode.episodeId}]: ${params.title} triggered at ${params.currentDisplayValue} for participant ${this.journeyId}`,
            'CLINICAL'
          );
        }
      } else {
        // EXISTING EPISODE UPDATE
        existing.lastEvaluatedAt = params.timestamp;
        existing.latestMetrics = { ...params.currentMetrics };
        existing.latestDisplayValue = params.currentDisplayValue;
        existing.lastEvaluatedSampleTimestamp = params.sampleIdentifier;
        existing.lastEvaluatedSequenceNumber = params.sequenceNumber;

        if (existing.state === 'signal_unavailable') {
          // Re-established signal while condition is still active -> restore previous state (or unacknowledged)
          existing.state = existing.acknowledgedAt ? 'acknowledged_ongoing' : 'active_unacknowledged';
          if (this.auditWriter) {
            this.auditWriter(
              `SIGNAL RESTORED: Alert [${params.title}] telemetry re-established. Current state: ${existing.state} (${params.currentDisplayValue})`,
              'CLINICAL'
            );
          }
        }

        // Check worsening escalation if previously acknowledged
        if (existing.state === 'acknowledged_ongoing' && existing.acknowledgedMetrics) {
          const isWorse = params.worseningCheck(existing.acknowledgedMetrics, params.currentMetrics);
          if (isWorse) {
            existing.state = 'worsening_escalation';
            const reason = `Worsened from attested baseline (${existing.acknowledgedDisplayValue}) to ${params.currentDisplayValue}`;
            existing.escalationHistory.push({
              escalationId: crypto.randomUUID(),
              escalatedAt: params.timestamp,
              metrics: { ...params.currentMetrics },
              displayValue: params.currentDisplayValue,
              reason
            });

            if (this.auditWriter) {
              this.auditWriter(
                `ALERT ESCALATION: ${params.title} worsened to ${params.currentDisplayValue} after acknowledgment (${existing.acknowledgedDisplayValue})`,
                'CLINICAL'
              );
            }
          }
        }
      }
    } else if (params.status === 'unknown') {
      // SIGNAL LOSS / DISCONNECT / STALE -> PRESERVE ALERT IN 'signal_unavailable' STATE (DO NOT RESOLVE)
      if (existing && existing.state !== 'signal_unavailable') {
        existing.state = 'signal_unavailable';
        existing.lastEvaluatedAt = params.timestamp;
        if (this.auditWriter) {
          this.auditWriter(
            `SIGNAL UNAVAILABLE: Telemetry dropped for active alert [${params.title}]. Alert preserved in unresolved status.`,
            'SYSTEM'
          );
        }
      }
    } else if (params.status === 'inactive') {
      // VALID RECOVERY MEASUREMENT
      if (existing) {
        // Enforce distinct fresh measurements: repeated evaluations of one cached normal packet must NOT count as consecutive recovery samples
        const lastEvaluated = this.lastEvaluatedSamplePerAlert.get(params.alertKey);
        const isDuplicateCachedPacket = Boolean(params.sampleIdentifier && params.sampleIdentifier === lastEvaluated);

        if (!isDuplicateCachedPacket) {
          // Fresh distinct normal packet arrived!
          if (params.sampleIdentifier) {
            this.lastEvaluatedSamplePerAlert.set(params.alertKey, params.sampleIdentifier);
          }

          const streak = (this.recoveryStreakCounters.get(params.alertKey) || 0) + 1;
          this.recoveryStreakCounters.set(params.alertKey, streak);

          if (streak >= params.requiredRecoveryTicks) {
            // Sustained recovery confirmed over distinct fresh samples -> resolve episode and archive
            existing.state = 'resolved';
            existing.resolvedAt = params.timestamp;
            existing.lastEvaluatedAt = params.timestamp;
            existing.latestDisplayValue = params.currentDisplayValue;
            existing.latestMetrics = { ...params.currentMetrics };

            this.pastResolvedEpisodes.push({ ...existing });
            this.activeEpisodes.delete(params.alertKey);
            this.recoveryStreakCounters.delete(params.alertKey);
            this.lastEvaluatedSamplePerAlert.delete(params.alertKey);

            if (this.auditWriter) {
              this.auditWriter(
                `ALERT RESOLVED: ${params.title} normalized to ${params.currentDisplayValue} after ${streak} consecutive distinct valid readings.`,
                'CLINICAL'
              );
            }
          }
        }
      }
    }
  }

  // ==========================================
  // OPERATOR ALERT ACKNOWLEDGMENT & RE-ATTESTATION
  // ==========================================

  public acknowledgeAlertEpisode(episodeId: string, operatorName: string = 'Dr. Elena Vance, Lead Facilitator') {
    for (const episode of this.activeEpisodes.values()) {
      if (episode.episodeId === episodeId) {
        const now = new Date().toISOString();
        episode.state = 'acknowledged_ongoing';
        episode.acknowledgedBy = operatorName;
        episode.acknowledgedAt = now;
        episode.acknowledgedMetrics = { ...episode.latestMetrics };
        episode.acknowledgedDisplayValue = episode.latestDisplayValue;
        episode.lastEvaluatedAt = now;

        // Append to immutable attestation history
        episode.attestationHistory = episode.attestationHistory || [];
        const attestationRecord: AttestationRecord = {
          attestationId: crypto.randomUUID(),
          attestedAt: now,
          attestedBy: operatorName,
          metricsSnapshot: { ...episode.latestMetrics },
          displayValueSnapshot: episode.latestDisplayValue,
          type: 'initial_acknowledgment',
          note: `Initial operator acknowledgment at ${episode.latestDisplayValue}`
        };
        episode.attestationHistory.push(attestationRecord);

        if (this.auditWriter) {
          this.auditWriter(
            `Facilitator Attestation: Alert Episode [${episodeId}] (${episode.title}) acknowledged at ${episode.latestDisplayValue} by ${operatorName}. Telemetry preserved without mutation.`,
            'CLINICAL',
            operatorName
          );
        }
        this.evaluateAndBroadcast();
        return true;
      }
    }
    return false;
  }

  /**
   * Re-Attest Vitals Snapshot:
   * Appends the new baseline snapshot while retaining original trigger, prior attestations,
   * and escalation history. Repeated acknowledgment does not hide cumulative deterioration.
   */
  public reAttestVitalsSnapshot(episodeId: string, operatorName: string = 'Dr. Elena Vance, Lead Facilitator') {
    for (const episode of this.activeEpisodes.values()) {
      if (episode.episodeId === episodeId) {
        const now = new Date().toISOString();
        
        // Append new snapshot to immutable attestation history before updating baseline pointer
        episode.attestationHistory = episode.attestationHistory || [];
        const attestationRecord: AttestationRecord = {
          attestationId: crypto.randomUUID(),
          attestedAt: now,
          attestedBy: operatorName,
          metricsSnapshot: { ...episode.latestMetrics },
          displayValueSnapshot: episode.latestDisplayValue,
          type: 're_attestation',
          note: `Re-attested vitals baseline snapshot at ${episode.latestDisplayValue}`
        };
        episode.attestationHistory.push(attestationRecord);

        // Update current acknowledged baseline
        episode.acknowledgedMetrics = { ...episode.latestMetrics };
        episode.acknowledgedDisplayValue = episode.latestDisplayValue;
        episode.acknowledgedAt = now;
        episode.acknowledgedBy = operatorName;
        episode.lastEvaluatedAt = now;

        if (episode.state === 'worsening_escalation') {
          episode.state = 'acknowledged_ongoing';
        }

        if (this.auditWriter) {
          this.auditWriter(
            `Facilitator Re-Attestation: Alert Episode [${episodeId}] baseline updated to ${episode.latestDisplayValue} by ${operatorName} (Attestation #${episode.attestationHistory.length}).`,
            'CLINICAL',
            operatorName
          );
        }
        this.evaluateAndBroadcast();
        return true;
      }
    }
    return false;
  }

  public disconnectDevice(deviceId: string) {
    const dev = this.deviceStatuses.get(deviceId);
    if (dev) {
      dev.isManuallyDisconnected = true;
      dev.quality = 'poor';
      dev.isStale = false;
      if (this.auditWriter) {
        this.auditWriter(`Device ${deviceId} (${dev.modelName}) manual lead disconnect simulated.`, 'SYSTEM');
      }
      this.evaluateAndBroadcast();
    }
  }

  public reconnectDevice(deviceId: string) {
    const dev = this.deviceStatuses.get(deviceId);
    if (dev) {
      dev.isManuallyDisconnected = false;
      // Strictly set to awaiting_data so it requires a fresh valid packet before returning to good
      dev.quality = 'awaiting_data';
      dev.isStale = false;
      dev.lastSampleTime = null;
      if (this.auditWriter) {
        this.auditWriter(`Device ${deviceId} (${dev.modelName}) manual reconnection initiated. Awaiting fresh valid packet.`, 'SYSTEM');
      }
      this.evaluateAndBroadcast();
    }
  }

  // ==========================================
  // SIMULATION ADAPTER (EXPLICIT PROTOCOL STREAM)
  // ==========================================

  public startSimulation(timeMultiplier: number = 1.0) {
    if (this.isSimulating) return;
    this.isSimulating = true;

    for (const dev of this.deviceStatuses.values()) {
      dev.connectionMethod = 'simulated';
    }

    if (this.auditWriter) {
      this.auditWriter(
        `Simulation Protocol Stream started for ${this.journeyId} (${this.compound}). Mode: Synthetic Pharmacokinetic Curve.`,
        'SYSTEM'
      );
    }

    // Immediately generate initial valid ticks
    this.generateSimulatedTick();

    this.simIntervalId = window.setInterval(() => {
      this.elapsedSeconds += 1 * timeMultiplier;
      this.generateSimulatedTick();
    }, 1000);
  }

  public stopSimulation() {
    if (!this.isSimulating) return;
    this.isSimulating = false;
    if (this.simIntervalId !== null) {
      clearInterval(this.simIntervalId);
      this.simIntervalId = null;
    }
    if (this.auditWriter) {
      this.auditWriter(`Simulation Protocol Stream paused for ${this.journeyId}.`, 'SYSTEM');
    }
  }

  public getIsSimulating(): boolean {
    return this.isSimulating;
  }

  public injectArtifact(type: 'hypertensive_spike' | 'panic_tachycardia' | 'desaturation' | 'hypotensive_event' | 'extreme_bradycardia' | 'signal_drop') {
    const timestamp = new Date().toISOString();

    if (type === 'hypertensive_spike') {
      this.ingestBP({
        stream_id: crypto.randomUUID(),
        device_id: 'CNAP-MONITOR-02',
        device_type: 'continuous_bp',
        patient_journey_id: this.journeyId,
        timestamp_utc: timestamp,
        sequence_number: this.getNextSeq('CNAP-MONITOR-02'),
        sample_rate_hz: 1,
        quality_flag: 'good',
        payload: {
          systolic_mmhg: 174,
          diastolic_mmhg: 106,
          mean_arterial_pressure_mmhg: 128,
          pulse_pressure_mmhg: 68,
          measurement_method: 'continuous_noninvasive'
        }
      });
      if (this.auditWriter) {
        this.auditWriter(`CRITICAL BIOMETRIC ALERT: Hypertensive Protocol Threshold Spike injected: 174/106 mmHg`, 'CLINICAL');
      }
    } else if (type === 'hypotensive_event') {
      this.ingestBP({
        stream_id: crypto.randomUUID(),
        device_id: 'CNAP-MONITOR-02',
        device_type: 'continuous_bp',
        patient_journey_id: this.journeyId,
        timestamp_utc: timestamp,
        sequence_number: this.getNextSeq('CNAP-MONITOR-02'),
        sample_rate_hz: 1,
        quality_flag: 'good',
        payload: {
          systolic_mmhg: 84,
          diastolic_mmhg: 52,
          mean_arterial_pressure_mmhg: 62,
          pulse_pressure_mmhg: 32,
          measurement_method: 'continuous_noninvasive'
        }
      });
      if (this.auditWriter) {
        this.auditWriter(`CRITICAL BIOMETRIC ALERT: Hypotensive Event injected: 84/52 mmHg (MAP 62 mmHg)`, 'CLINICAL');
      }
    } else if (type === 'panic_tachycardia') {
      this.ingestECG({
        stream_id: crypto.randomUUID(),
        device_id: 'POLAR-H10-88F4',
        device_type: 'ecg',
        patient_journey_id: this.journeyId,
        timestamp_utc: timestamp,
        sequence_number: this.getNextSeq('POLAR-H10-88F4'),
        sample_rate_hz: 1,
        quality_flag: 'good',
        payload: {
          heart_rate_bpm: 144,
          rr_intervals_ms: [416, 412, 418],
          hrv_rmssd_ms: 16,
          hrv_sdnn_ms: 20,
          signal_quality: 0.98
        }
      });
      if (this.auditWriter) {
        this.auditWriter(`CRITICAL BIOMETRIC ALERT: Autonomic Surge / Severe Tachycardia injected: 144 bpm (RMSSD 16ms)`, 'CLINICAL');
      }
    } else if (type === 'extreme_bradycardia') {
      this.ingestECG({
        stream_id: crypto.randomUUID(),
        device_id: 'POLAR-H10-88F4',
        device_type: 'ecg',
        patient_journey_id: this.journeyId,
        timestamp_utc: timestamp,
        sequence_number: this.getNextSeq('POLAR-H10-88F4'),
        sample_rate_hz: 1,
        quality_flag: 'good',
        payload: {
          heart_rate_bpm: 42,
          rr_intervals_ms: [1428, 1432],
          hrv_rmssd_ms: 78,
          hrv_sdnn_ms: 84,
          signal_quality: 0.97
        }
      });
      if (this.auditWriter) {
        this.auditWriter(`CRITICAL BIOMETRIC ALERT: Extreme Bradycardia injected: 42 bpm`, 'CLINICAL');
      }
    } else if (type === 'desaturation') {
      this.ingestSpO2({
        stream_id: crypto.randomUUID(),
        device_id: 'NONIN-SPO2-01',
        device_type: 'spo2',
        patient_journey_id: this.journeyId,
        timestamp_utc: timestamp,
        sequence_number: this.getNextSeq('NONIN-SPO2-01'),
        sample_rate_hz: 1,
        quality_flag: 'good',
        payload: {
          spo2_percent: 88,
          perfusion_index: 1.8,
          pulse_rate_bpm: 110
        }
      });
      if (this.auditWriter) {
        this.auditWriter(`CRITICAL BIOMETRIC ALERT: Hypoxemic Desaturation injected: 88% SpO2`, 'CLINICAL');
      }
    } else if (type === 'signal_drop') {
      // Disconnect SpO2 or EEG based on what has an active alert or default to SpO2
      const spo2Episode = this.activeEpisodes.get('desaturation');
      const targetDevId = spo2Episode ? 'NONIN-SPO2-01' : 'MUSE-S-EEG-77A1';
      const dev = this.deviceStatuses.get(targetDevId);
      if (dev) {
        dev.quality = 'disconnected';
        dev.isManuallyDisconnected = true;
      }
      this.evaluateAndBroadcast();
      if (this.auditWriter) {
        this.auditWriter(`HARDWARE ALERT: ${targetDevId} Telemetry signal dropped (Lead Disconnected). Persists until operator re-seat.`, 'SYSTEM');
      }
    }
  }

  private generateSimulatedTick() {
    const timestamp = new Date().toISOString();

    // Map compound & phase to target physiological values
    let targetHR = 68;
    let targetRMSSD = 58;
    let targetSys = 118;
    let targetDia = 76;
    let alphaThetaRatio = 1.65;

    switch (this.currentPhase) {
      case 'preparation':
      case 'ingestion':
        targetHR = 70;
        targetRMSSD = 55;
        targetSys = 118;
        targetDia = 76;
        alphaThetaRatio = 1.70;
        break;
      case 'ascent':
        targetHR = 82;
        targetRMSSD = 38;
        targetSys = 130;
        targetDia = 84;
        alphaThetaRatio = 1.45;
        break;
      case 'oceanic_peak':
        targetHR = 88;
        targetRMSSD = 34;
        targetSys = 136;
        targetDia = 86;
        alphaThetaRatio = 1.25;
        break;
      case 'ego_dissolution':
        targetHR = 78;
        targetRMSSD = 42;
        targetSys = 126;
        targetDia = 80;
        alphaThetaRatio = 1.08;
        break;
      case 'descent':
        targetHR = 72;
        targetRMSSD = 50;
        targetSys = 120;
        targetDia = 78;
        alphaThetaRatio = 1.52;
        break;
      case 'return':
      case 'integration':
        targetHR = 66;
        targetRMSSD = 64;
        targetSys = 116;
        targetDia = 74;
        alphaThetaRatio = 1.85;
        break;
    }

    // Natural respiratory sinus arrhythmia
    const sinusJitter = Math.sin(this.elapsedSeconds * 0.25) * 2.5 + (Math.random() * 1.5 - 0.75);
    const liveHR = Math.round(targetHR + sinusJitter);
    const liveRMSSD = Math.round(targetRMSSD + Math.cos(this.elapsedSeconds * 0.2) * 3);
    const liveSys = Math.round(targetSys + (Math.random() * 2 - 1));
    const liveDia = Math.round(targetDia + (Math.random() * 1.5 - 0.75));
    const liveSpO2 = 98 + Math.round(Math.random() * 1);

    // 1. ECG Stream Tick
    const ecgDev = this.deviceStatuses.get('POLAR-H10-88F4');
    if (ecgDev && !ecgDev.isManuallyDisconnected) {
      this.ingestECG({
        stream_id: crypto.randomUUID(),
        device_id: 'POLAR-H10-88F4',
        device_type: 'ecg',
        patient_journey_id: this.journeyId,
        timestamp_utc: timestamp,
        sequence_number: this.getNextSeq('POLAR-H10-88F4'),
        sample_rate_hz: 1,
        quality_flag: 'good',
        payload: {
          heart_rate_bpm: liveHR,
          rr_intervals_ms: [Math.round(60000 / liveHR)],
          hrv_rmssd_ms: liveRMSSD,
          hrv_sdnn_ms: Math.round(liveRMSSD * 1.22),
          signal_quality: 0.99
        }
      });
    }

    // 2. BP Stream Tick (Every 3 seconds for continuous NIBP simulation)
    const bpDev = this.deviceStatuses.get('CNAP-MONITOR-02');
    if (bpDev && !bpDev.isManuallyDisconnected && this.elapsedSeconds % 3 === 0) {
      this.ingestBP({
        stream_id: crypto.randomUUID(),
        device_id: 'CNAP-MONITOR-02',
        device_type: 'continuous_bp',
        patient_journey_id: this.journeyId,
        timestamp_utc: timestamp,
        sequence_number: this.getNextSeq('CNAP-MONITOR-02'),
        sample_rate_hz: 0.33,
        quality_flag: 'good',
        payload: {
          systolic_mmhg: liveSys,
          diastolic_mmhg: liveDia,
          mean_arterial_pressure_mmhg: Math.round((liveSys + 2 * liveDia) / 3),
          pulse_pressure_mmhg: liveSys - liveDia,
          measurement_method: 'continuous_noninvasive'
        }
      });
    }

    // 3. SpO2 Stream Tick
    const spo2Dev = this.deviceStatuses.get('NONIN-SPO2-01');
    if (spo2Dev && !spo2Dev.isManuallyDisconnected) {
      this.ingestSpO2({
        stream_id: crypto.randomUUID(),
        device_id: 'NONIN-SPO2-01',
        device_type: 'spo2',
        patient_journey_id: this.journeyId,
        timestamp_utc: timestamp,
        sequence_number: this.getNextSeq('NONIN-SPO2-01'),
        sample_rate_hz: 1,
        quality_flag: 'good',
        payload: {
          spo2_percent: liveSpO2,
          perfusion_index: 4.8,
          pulse_rate_bpm: liveHR
        }
      });
    }

    // 4. EEG Stream Tick (Honors persistent disconnects)
    const eegDev = this.deviceStatuses.get('MUSE-S-EEG-77A1');
    if (eegDev && !eegDev.isManuallyDisconnected) {
      const isPeakDissolution = this.currentPhase === 'ego_dissolution' || this.currentPhase === 'oceanic_peak';
      this.ingestEEG({
        stream_id: crypto.randomUUID(),
        device_id: 'MUSE-S-EEG-77A1',
        device_type: 'eeg',
        patient_journey_id: this.journeyId,
        timestamp_utc: timestamp,
        sequence_number: this.getNextSeq('MUSE-S-EEG-77A1'),
        sample_rate_hz: 4,
        quality_flag: 'good',
        payload: {
          channels: ['Fp1', 'Fp2', 'TP9', 'TP10'],
          band_power: {
            delta_uV2: 14.0,
            theta_uV2: isPeakDissolution ? 29.2 : 12.4,
            alpha_uV2: isPeakDissolution ? 33.8 : 20.8,
            beta_uV2: isPeakDissolution ? 8.2 : 16.0,
            gamma_uV2: isPeakDissolution ? 6.4 : 3.6
          },
          alpha_theta_ratio: alphaThetaRatio,
          artifact_flag: false
        }
      });
    }
  }

  private getNextSeq(deviceId: string): number {
    const cur = (this.seqCounters.get(deviceId) || 0) + 1;
    this.seqCounters.set(deviceId, cur);
    return cur;
  }

  // ==========================================
  // SUBSCRIPTION MANAGEMENT
  // ==========================================

  public subscribe(cb: TelemetrySubscriber): () => void {
    this.subscribers.add(cb);
    this.evaluateAndBroadcast();
    return () => {
      this.subscribers.delete(cb);
    };
  }

  public destroy() {
    this.stopSimulation();
    if (this.freshnessIntervalId) {
      clearInterval(this.freshnessIntervalId);
      this.freshnessIntervalId = null;
    }
    this.subscribers.clear();
  }
}
