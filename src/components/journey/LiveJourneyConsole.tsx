import React, { useState, useEffect, useMemo } from 'react';
import { 
  Activity, 
  Heart, 
  Brain, 
  Volume2, 
  ShieldAlert, 
  Flame, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Send, 
  Sparkles, 
  Music, 
  UserCheck, 
  Lock, 
  Play, 
  Pause,
  RotateCcw,
  Fingerprint,
  Radio,
  Sliders,
  Check,
  RefreshCw,
  AlertOctagon,
  HelpCircle
} from 'lucide-react';
import { useAether } from '../../context/AetherContext';
import { TelemetryIngestionService, DeviceStreamStatus } from '../../services/telemetryAdapter';
import { DerivedAutonomicSummary, PharmacodynamicPhase, ECGTelemetryPacket, BPTelemetryPacket, SpO2TelemetryPacket, EEGTelemetryPacket } from '../../types/telemetry';
import { ClinicalAlertEpisode } from '../../types/alertLifecycle';
import { HardwareStatusBar } from './HardwareStatusBar';
import { RapidRescueModal } from './RapidRescueModal';
import { AcceptancePassModal } from './AcceptancePassModal';

export const LiveJourneyConsole: React.FC = () => {
  const { 
    selectedPatient, 
    selectedProtocol, 
    currentJourneyMinute,
    setCurrentJourneyMinute,
    isLiveJourneyRunning,
    setIsLiveJourneyRunning,
    somaticLogs,
    addSomaticLog,
    recordAudit
  } = useAether();

  const patient = selectedPatient || {
    id: 'AE-9941',
    pseudonym: 'Aurora (AE-9941)',
    age: 38,
    indication: 'Severe Treatment-Resistant Major Depressive Disorder',
    intention: 'To surrender the heavy armor of past grief and remember the fundamental innocence of my being.',
    assignedProtocolId: 'PSIL-TRD-25',
    somaticAnchors: ['Hand placed over sternum / heart center', 'Deep exhale with audible hum']
  };

  // Find active protocol timeline phase
  const activeTimelinePhase = selectedProtocol.timelinePhases.find(
    p => currentJourneyMinute >= p.startMin && currentJourneyMinute < p.endMin
  ) || selectedProtocol.timelinePhases[selectedProtocol.timelinePhases.length - 1];

  // Map protocol timeline name to typed PharmacodynamicPhase
  const mappedPhase: PharmacodynamicPhase = useMemo(() => {
    const name = activeTimelinePhase?.name?.toLowerCase() || '';
    if (name.includes('prep') || name.includes('intake')) return 'preparation';
    if (name.includes('ingest') || name.includes('admin')) return 'ingestion';
    if (name.includes('ascent') || name.includes('onset')) return 'ascent';
    if (name.includes('peak') || name.includes('plateau')) return 'oceanic_peak';
    if (name.includes('dissol') || name.includes('transcend')) return 'ego_dissolution';
    if (name.includes('descent') || name.includes('re-entry')) return 'descent';
    if (name.includes('return')) return 'return';
    return 'integration';
  }, [activeTimelinePhase]);

  // Telemetry Engine Singleton State
  const [telemetryService] = useState<TelemetryIngestionService>(() => {
    return new TelemetryIngestionService(patient.pseudonym || patient.id, selectedProtocol.compound, recordAudit);
  });

  const [devicesList, setDevicesList] = useState<DeviceStreamStatus[]>([]);
  const [isSimulating, setIsSimulating] = useState<boolean>(false);
  const [derivedSummary, setDerivedSummary] = useState<DerivedAutonomicSummary | null>(null);
  const [latestECG, setLatestECG] = useState<ECGTelemetryPacket | undefined>(undefined);
  const [latestBP, setLatestBP] = useState<BPTelemetryPacket | undefined>(undefined);
  const [latestSpO2, setLatestSpO2] = useState<SpO2TelemetryPacket | undefined>(undefined);
  const [latestEEG, setLatestEEG] = useState<EEGTelemetryPacket | undefined>(undefined);
  
  // Typed active alert episodes list
  const [activeAlertEpisodes, setActiveAlertEpisodes] = useState<ClinicalAlertEpisode[]>([]);

  // Somatic logger inputs
  const [newLogNote, setNewLogNote] = useState('');
  const [newLogCategory, setNewLogCategory] = useState<'Touch' | 'Verbal' | 'Vitals' | 'Phenomenology' | 'Rescue'>('Phenomenology');
  
  // Rapid Rescue Clinical Dialog State
  const [isRescueModalOpen, setIsRescueModalOpen] = useState(false);
  const [selectedRescueEpisode, setSelectedRescueEpisode] = useState<ClinicalAlertEpisode | null>(null);
  
  // 6-Pass Acceptance Verification Modal State
  const [isAcceptanceModalOpen, setIsAcceptanceModalOpen] = useState(false);

  // Synchronize Telemetry Service context when patient or protocol changes
  useEffect(() => {
    telemetryService.setAuditWriter(recordAudit);
    telemetryService.setJourneyContext(patient.pseudonym || patient.id, selectedProtocol.compound, mappedPhase);

    const unsubscribe = telemetryService.subscribe((summary, devices, packets, alertEpisodes) => {
      setDerivedSummary(summary);
      setDevicesList(devices);
      setLatestECG(packets.ecg);
      setLatestBP(packets.bp);
      setLatestSpO2(packets.spo2);
      setLatestEEG(packets.eeg);
      setActiveAlertEpisodes(alertEpisodes);
    });

    return () => {
      unsubscribe();
    };
  }, [telemetryService, patient.pseudonym, patient.id, selectedProtocol.compound, mappedPhase, recordAudit]);

  // Keep simulation running or paused according to isLiveJourneyRunning
  useEffect(() => {
    if (isLiveJourneyRunning && !telemetryService.getIsSimulating()) {
      telemetryService.startSimulation(1.0);
      setIsSimulating(true);
    } else if (!isLiveJourneyRunning && telemetryService.getIsSimulating()) {
      telemetryService.stopSimulation();
      setIsSimulating(false);
    }
  }, [isLiveJourneyRunning, telemetryService]);

  const handleToggleSimulation = () => {
    if (isSimulating) {
      telemetryService.stopSimulation();
      setIsSimulating(false);
      setIsLiveJourneyRunning(false);
    } else {
      telemetryService.startSimulation(1.0);
      setIsSimulating(true);
      setIsLiveJourneyRunning(true);
    }
  };

  const handleResetBuffers = () => {
    telemetryService.resetAllTelemetryBuffers();
    recordAudit(`Telemetry buffers cleared for ${patient.pseudonym}. State: Awaiting fresh signals.`, 'SYSTEM');
  };

  const handleAddLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLogNote.trim()) return;
    addSomaticLog('Dr. Elena Vance (Lead Facilitator)', newLogNote, newLogCategory);
    setNewLogNote('');
  };

  const handleAcknowledgeAlert = (episodeId: string) => {
    telemetryService.acknowledgeAlertEpisode(episodeId, 'Dr. Elena Vance, Lead Facilitator');
  };

  const handleReAttestVitals = (episodeId: string) => {
    telemetryService.reAttestVitalsSnapshot(episodeId, 'Dr. Elena Vance, Lead Facilitator');
  };

  const handleOpenRescueModal = (episode?: ClinicalAlertEpisode | null) => {
    setSelectedRescueEpisode(episode || null);
    setIsRescueModalOpen(true);
  };

  const handleConfirmRescue = (actionNotes: string, episodeId?: string) => {
    recordAudit(actionNotes, 'CLINICAL', 'Dr. Elena Vance');
    addSomaticLog('Dr. Elena Vance', actionNotes, 'Rescue');
    if (episodeId) {
      telemetryService.acknowledgeAlertEpisode(episodeId, 'Dr. Elena Vance');
    }
  };

  // Safe reading extractors
  const vitals = derivedSummary?.autonomic_summary;
  const hrDisplay = vitals?.hr_bpm !== null && vitals?.hr_bpm !== undefined ? `${vitals.hr_bpm}` : '--';
  const rmssdDisplay = vitals?.hrv_rmssd_ms !== null && vitals?.hrv_rmssd_ms !== undefined ? `${vitals.hrv_rmssd_ms}` : '--';
  const bpDisplay = (vitals?.bp_systolic !== null && vitals?.bp_diastolic !== null && vitals?.bp_systolic !== undefined)
    ? `${vitals.bp_systolic}/${vitals.bp_diastolic}`
    : '--/--';
  const spo2Display = vitals?.spo2 !== null && vitals?.spo2 !== undefined ? `${vitals.spo2}%` : '--';
  const thetaDisplay = latestEEG?.payload.band_power.theta_uV2 
    ? `${Math.round(latestEEG.payload.band_power.theta_uV2)} μV²`
    : (vitals?.alpha_theta_synchrony !== null && vitals?.alpha_theta_synchrony !== undefined)
    ? `α/θ: ${vitals.alpha_theta_synchrony.toFixed(2)}`
    : '--';

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      
      {/* 2.0 Hardware Stream Status Bar */}
      <HardwareStatusBar
        devices={devicesList}
        isSimulating={isSimulating}
        onToggleSimulation={handleToggleSimulation}
        onResetBuffers={handleResetBuffers}
        onInjectArtifact={(type) => telemetryService.injectArtifact(type)}
        onReconnectDevice={(deviceId) => telemetryService.reconnectDevice(deviceId)}
        streamQualityScore={derivedSummary?.stream_quality_score ?? 0}
        onOpenAcceptanceSuite={() => setIsAcceptanceModalOpen(true)}
      />

      {/* Dynamic Safety Alert Banners (Rendered per active clinical episode) */}
      {activeAlertEpisodes.length > 0 && (
        <div className="space-y-3">
          {activeAlertEpisodes.map((episode) => {
            const isUnacknowledged = episode.state === 'active_unacknowledged';
            const isAcknowledged = episode.state === 'acknowledged_ongoing';
            const isWorsening = episode.state === 'worsening_escalation';
            const isSignalUnavailable = episode.state === 'signal_unavailable';

            return (
              <div 
                key={episode.episodeId}
                className={`p-4 rounded-2xl border-2 transition-all shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4 ${
                  isWorsening
                    ? 'bg-rose-950/90 border-rose-500 text-rose-100 animate-pulse'
                    : isSignalUnavailable
                    ? 'bg-amber-950/30 border-amber-500/50 text-amber-200'
                    : isAcknowledged
                    ? 'bg-[#15221F] border-[#93C5B5]/60 text-emerald-100'
                    : 'bg-rose-950/80 border-rose-500 text-rose-200 animate-pulse'
                }`}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2.5 rounded-xl border shrink-0 ${
                    isWorsening
                      ? 'bg-rose-500/30 text-rose-300 border-rose-500'
                      : isSignalUnavailable
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : isAcknowledged 
                      ? 'bg-[#15221F] text-[#93C5B5] border-[#93C5B5]/40' 
                      : 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                  }`}>
                    {isSignalUnavailable ? <HelpCircle className="w-6 h-6" /> : <AlertOctagon className="w-6 h-6" />}
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center flex-wrap gap-2">
                      <span className="font-mono font-bold text-xs uppercase tracking-wider text-white">
                        {episode.title}
                      </span>
                      
                      {/* Lifecycle Status Pill */}
                      {isUnacknowledged && (
                        <span className="px-2 py-0.5 rounded bg-rose-500/30 text-rose-300 border border-rose-500/50 font-mono text-[10px] font-bold animate-pulse">
                          ACTIVE UNACKNOWLEDGED
                        </span>
                      )}
                      {isAcknowledged && (
                        <span className="px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-mono text-[10px] font-bold">
                          ✓ ACKNOWLEDGED ONGOING ({episode.acknowledgedDisplayValue})
                        </span>
                      )}
                      {isWorsening && (
                        <span className="px-2 py-0.5 rounded bg-rose-600 text-white font-mono text-[10px] font-bold animate-bounce">
                          ⚠ CRITICAL WORSENING DETECTED
                        </span>
                      )}
                      {isSignalUnavailable && (
                        <span className="px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-mono text-[10px] font-bold">
                          SIGNAL UNAVAILABLE (EVENT PRESERVED)
                        </span>
                      )}
                    </div>

                    <div className="text-xs text-[#E8EDEA]/90 font-mono">
                      Current Value: <strong className="text-white">{episode.latestDisplayValue}</strong> • Triggered at: {episode.triggerDisplayValue} • Threshold: {episode.protocolThresholdDescription}
                    </div>

                    <div className="text-[10px] text-[#E8EDEA]/60 font-sans flex items-center gap-2">
                      <span>Episode ID: {episode.episodeId.slice(0, 8)}...</span>
                      <span>•</span>
                      <span>Device: {episode.associatedDeviceId}</span>
                      <span>•</span>
                      <span>Preserved in 21 CFR Part 11 SHA-256 ledger</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end md:self-auto flex-wrap">
                  {/* Acknowledge Button */}
                  {isUnacknowledged && (
                    <button
                      type="button"
                      onClick={() => handleAcknowledgeAlert(episode.episodeId)}
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono text-[#E8EDEA] font-semibold transition-colors"
                    >
                      Acknowledge Alert
                    </button>
                  )}

                  {/* Re-Attest Vitals Button (For ongoing acknowledged alerts) */}
                  {isAcknowledged && (
                    <button
                      type="button"
                      onClick={() => handleReAttestVitals(episode.episodeId)}
                      title="Update acknowledged vitals baseline to latest readings"
                      className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-mono text-[#93C5B5] font-semibold transition-colors flex items-center gap-1.5"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Re-Attest Snapshot</span>
                    </button>
                  )}

                  {/* Open Rapid Rescue Modal */}
                  <button
                    type="button"
                    onClick={() => handleOpenRescueModal(episode)}
                    className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-mono font-bold text-xs shadow-lg transition-colors flex items-center gap-1.5"
                  >
                    <ShieldAlert className="w-4 h-4" />
                    <span>Open Clinical Orders & Rescue</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Cockpit Top Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-6 rounded-2xl bg-[#141B16] border border-[#93C5B5]/40 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-3 w-3">
              <span className={`animate-ping absolute inline-flex h-full w-full rounded-full ${isSimulating ? 'bg-amber-400' : 'bg-[#A8C69F]'} opacity-75`}></span>
              <span className={`relative inline-flex rounded-full h-3 w-3 ${isSimulating ? 'bg-amber-400' : 'bg-[#A8C69F]'}`}></span>
            </span>
            <span className="font-mono text-xs text-[#93C5B5] font-bold uppercase tracking-wider">
              Active Sanctuary Telemetry Cockpit
            </span>
            <span className="text-xs font-mono text-[#E8EDEA]/40">| Session #01</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#E8EDEA] flex items-center gap-3 tracking-tight">
            <span>Participant: {patient.pseudonym}</span>
            <span className="text-xs font-mono font-normal px-2.5 py-1 rounded-lg bg-[#15221F] text-[#93C5B5] border border-[#93C5B5]/40 font-sans">
              {selectedProtocol.compound} {selectedProtocol.dosingSchedule.macroDoseMg}mg
            </span>
          </h1>
          <p className="text-xs text-[#E8EDEA]/70 font-light max-w-2xl font-sans">
            Intention: <em className="text-[#E8EDEA]">"{patient.intention}"</em>
          </p>
        </div>

        {/* Timeline Controls */}
        <div className="flex items-center gap-3 self-start lg:self-auto bg-[#0D120E] p-2 rounded-xl border border-[#E8EDEA]/10">
          <button
            onClick={handleToggleSimulation}
            className={`p-2 rounded-lg font-mono text-xs flex items-center gap-1.5 transition-all ${
              isSimulating 
                ? 'bg-[#15221F] text-[#93C5B5] border border-[#93C5B5]/40' 
                : 'bg-[#2A2318] text-[#C8B195] border border-[#C8B195]/40'
            }`}
          >
            {isSimulating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            <span>{isSimulating ? 'Simulating PK/PD' : 'Stream Paused'}</span>
          </button>

          <div className="px-3 py-1 font-mono text-center">
            <div className="text-[10px] text-[#E8EDEA]/40">ELAPSED TIME</div>
            <div className="text-base font-bold text-[#A8C69F]">
              {Math.floor(currentJourneyMinute / 60)}h {(currentJourneyMinute % 60).toString().padStart(2, '0')}m
            </div>
          </div>

          <button
            onClick={() => {
              setCurrentJourneyMinute(0);
              telemetryService.setElapsedSeconds(0);
            }}
            className="p-2 text-[#E8EDEA]/50 hover:text-[#E8EDEA] rounded-lg hover:bg-[#141B16] transition-colors"
            title="Reset Timeline to Ingestion"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Real-time Biological Telemetry Grid (Guaranteed No Plausible Defaults) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        
        {/* Heart Rate */}
        <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-4 space-y-2 relative overflow-hidden">
          <div className="flex items-center justify-between text-[#E8EDEA]/60 text-xs">
            <span>Heart Rate</span>
            <Heart className={`w-4 h-4 text-rose-400 ${vitals?.hr_bpm ? 'animate-pulse' : 'opacity-40'}`} />
          </div>
          <div className="text-2xl font-serif font-bold text-[#E8EDEA] font-mono">
            {hrDisplay} {vitals?.hr_bpm !== null && vitals?.hr_bpm !== undefined && <span className="text-xs font-normal text-[#E8EDEA]/50 font-sans">bpm</span>}
          </div>
          <div className="text-[10px] font-mono">
            {vitals?.hr_bpm === null || vitals?.hr_bpm === undefined ? (
              <span className="text-[#E8EDEA]/40 italic">Awaiting ECG signal...</span>
            ) : vitals.hr_bpm >= 135 ? (
              <span className="text-rose-400 font-bold">Severe Tachycardia</span>
            ) : vitals.hr_bpm <= 45 ? (
              <span className="text-blue-400 font-bold">Extreme Bradycardia</span>
            ) : (
              <span className="text-[#A8C69F] flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#A8C69F]"></span> Sinus Rhythm Verified
              </span>
            )}
          </div>
        </div>

        {/* HRV RMSSD */}
        <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-[#E8EDEA]/60 text-xs">
            <span>HRV (RMSSD)</span>
            <Activity className="w-4 h-4 text-[#93C5B5]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#E8EDEA] font-mono">
            {rmssdDisplay} {vitals?.hrv_rmssd_ms !== null && vitals?.hrv_rmssd_ms !== undefined && <span className="text-xs font-normal text-[#E8EDEA]/50 font-sans">ms</span>}
          </div>
          <div className="text-[10px] font-mono">
            {vitals?.hrv_rmssd_ms === null || vitals?.hrv_rmssd_ms === undefined ? (
              <span className="text-[#E8EDEA]/40 italic">No RR intervals</span>
            ) : vitals.hrv_rmssd_ms <= 25 ? (
              <span className="text-amber-400 font-bold">Sympathetic Surge</span>
            ) : (
              <span className="text-[#93C5B5]">Vagal Tone High</span>
            )}
          </div>
        </div>

        {/* Blood Pressure */}
        <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-[#E8EDEA]/60 text-xs">
            <span>Arterial BP</span>
            <Activity className="w-4 h-4 text-[#C8B195]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#E8EDEA] font-mono">
            {bpDisplay} {vitals?.bp_systolic !== null && vitals?.bp_diastolic !== null && vitals?.bp_systolic !== undefined && <span className="text-xs font-normal text-[#E8EDEA]/50 font-sans">mmHg</span>}
          </div>
          <div className="text-[10px] font-mono">
            {vitals?.bp_systolic === null || vitals?.bp_systolic === undefined ? (
              <span className="text-[#E8EDEA]/40 italic">Awaiting NIBP pulse...</span>
            ) : (vitals.bp_systolic >= 165 || (vitals.bp_diastolic !== null && vitals.bp_diastolic >= 100)) ? (
              <span className="text-rose-400 font-bold">Protocol Limit (≥165/100)</span>
            ) : vitals.bp_systolic < 90 ? (
              <span className="text-amber-400 font-bold">Hypotensive Event</span>
            ) : (
              <span className="text-[#C8B195]">Normotensive</span>
            )}
          </div>
        </div>

        {/* SpO2 */}
        <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-[#E8EDEA]/60 text-xs">
            <span>Oxygen Sat</span>
            <Activity className="w-4 h-4 text-[#93C5B5]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#E8EDEA] font-mono">
            {spo2Display}
          </div>
          <div className="text-[10px] font-mono">
            {vitals?.spo2 === null || vitals?.spo2 === undefined ? (
              <span className="text-[#E8EDEA]/40 italic">Awaiting probe...</span>
            ) : vitals.spo2 < 92 ? (
              <span className="text-rose-400 font-bold">Desaturation Alert</span>
            ) : (
              <span className="text-[#93C5B5]">Airway Clear</span>
            )}
          </div>
        </div>

        {/* EEG Alpha / Theta */}
        <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-[#E8EDEA]/60 text-xs">
            <span>Theta / α Synchrony</span>
            <Brain className="w-4 h-4 text-[#D4B8E5]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#E8EDEA] font-mono">
            {thetaDisplay}
          </div>
          <div className="text-[10px] font-mono">
            {vitals?.alpha_theta_synchrony === null || vitals?.alpha_theta_synchrony === undefined ? (
              <span className="text-[#E8EDEA]/40 italic">Awaiting 4-ch EEG</span>
            ) : vitals.alpha_theta_synchrony <= 1.15 ? (
              <span className="text-[#D4B8E5] font-bold">Ego-Boundary Dissolution</span>
            ) : (
              <span className="text-[#D4B8E5]">Relaxed Wakefulness</span>
            )}
          </div>
        </div>

        {/* Stream Quality */}
        <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-4 space-y-2">
          <div className="flex items-center justify-between text-[#E8EDEA]/60 text-xs">
            <span>Channel Health</span>
            <Sparkles className="w-4 h-4 text-[#A8C69F]" />
          </div>
          <div className="text-2xl font-serif font-bold text-[#E8EDEA] font-mono">
            {Math.round((derivedSummary?.stream_quality_score ?? 0) * 100)}%
          </div>
          <div className="text-[10px] font-mono text-[#E8EDEA]/50">
            {isSimulating ? 'PK/PD Simulated' : 'Hardware Stream'}
          </div>
        </div>

      </div>

      {/* Main Center Console: Phase Progression + Facilitator Guidance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Active Phase & Facilitator Guidance Overlay (2 Cols) */}
        <div className="lg:col-span-2 bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E8EDEA]/10 pb-4">
            <div>
              <span className="text-xs font-mono text-[#93C5B5] uppercase">
                Current Journey Phase (Min {activeTimelinePhase.startMin} - {activeTimelinePhase.endMin})
              </span>
              <h2 className="text-xl font-serif font-bold text-[#E8EDEA] mt-1">
                {activeTimelinePhase.name}
              </h2>
              <p className="text-xs text-[#E8EDEA]/70 font-sans">
                Phenomenological Space: <strong className="text-[#A8C69F]">{activeTimelinePhase.targetState}</strong>
              </p>
            </div>

            <div className="flex items-center gap-2 bg-[#0D120E] px-3 py-1.5 rounded-xl border border-[#E8EDEA]/10 text-xs font-mono text-[#93C5B5]">
              <Music className="w-4 h-4" />
              <span>Acoustic Energy: {activeTimelinePhase.musicEnergyLevel}</span>
            </div>
          </div>

          {/* Facilitator Protocol Actions */}
          <div className="space-y-3 font-sans">
            <h3 className="text-xs font-mono uppercase text-[#E8EDEA]/60 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-[#A8C69F]" /> Active Facilitator Clinical Guidance:
            </h3>
            <div className="space-y-2">
              {activeTimelinePhase.facilitatorActions.map((act, i) => (
                <div key={i} className="p-3.5 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-xs text-[#E8EDEA]/80 flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-[#15221F] text-[#93C5B5] border border-[#93C5B5]/40 flex items-center justify-center font-mono text-[10px] shrink-0">
                    {i + 1}
                  </span>
                  <span>{act}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Grounding & Somatic Anchors */}
          <div className="pt-2 border-t border-[#E8EDEA]/10 space-y-2 text-xs font-sans">
            <div className="font-mono text-[#E8EDEA]/60">Participant Somatic Anchors:</div>
            <div className="flex flex-wrap gap-2">
              {patient.somaticAnchors.map((anchor, idx) => (
                <span key={idx} className="px-3 py-1.5 rounded-lg bg-[#15221F] border border-[#93C5B5]/40 text-[#93C5B5] font-mono text-[11px]">
                  • {anchor}
                </span>
              ))}
            </div>
          </div>

          {/* Rescue Trigger Button */}
          <div className="pt-2 flex justify-end">
            <button
              onClick={() => handleOpenRescueModal(null)}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/80 text-rose-200 text-xs font-semibold transition-all font-sans"
            >
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>Open Standing Orders & Rescue Console</span>
            </button>
          </div>
        </div>

        {/* Real-time Somatic Event Logger (1 Col) */}
        <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-base text-[#E8EDEA]">Somatic Event Stream</h3>
              <span className="text-[10px] font-mono text-[#E8EDEA]/50">{somaticLogs.length} events logged</span>
            </div>

            {/* Log Stream List */}
            <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
              {somaticLogs.map((log, i) => (
                <div key={i} className="p-3 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-xs space-y-1">
                  <div className="flex items-center justify-between text-[10px] font-mono">
                    <span className="text-[#A8C69F] font-bold">{log.time} (Min {log.minute})</span>
                    <span className="px-2 py-0.5 rounded bg-[#15221F] border border-[#93C5B5]/30 text-[#93C5B5]">
                      {log.category}
                    </span>
                  </div>
                  <p className="text-[#E8EDEA]/80 leading-normal text-[11px] font-sans">{log.note}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Add New Somatic Observation Form */}
          <form onSubmit={handleAddLog} className="space-y-2 pt-3 border-t border-[#E8EDEA]/10 font-sans">
            <div className="flex gap-2">
              <select
                value={newLogCategory}
                onChange={(e) => setNewLogCategory(e.target.value as any)}
                className="bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-2.5 py-1.5 text-[11px] text-[#E8EDEA] focus:outline-none focus:border-[#93C5B5]"
              >
                <option value="Phenomenology">Phenomenology</option>
                <option value="Touch">Safe Touch Code</option>
                <option value="Verbal">Verbal Grounding</option>
                <option value="Vitals">Vitals Spike</option>
                <option value="Rescue">Rescue Action</option>
              </select>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Log somatic cue, tears, touch anchor..."
                value={newLogNote}
                onChange={(e) => setNewLogNote(e.target.value)}
                className="flex-1 bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-xs text-[#E8EDEA] focus:outline-none focus:border-[#93C5B5]"
              />
              <button
                type="submit"
                className="p-2 rounded-xl bg-[#A8C69F] hover:bg-[#b8d6af] text-[#0A0D0B] font-bold transition-all shadow"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </form>

        </div>

      </div>

      {/* Rapid Rescue Clinical Harm-Reduction Modal */}
      <RapidRescueModal
        isOpen={isRescueModalOpen}
        onClose={() => setIsRescueModalOpen(false)}
        patientName={patient.pseudonym}
        patientId={patient.id}
        compound={selectedProtocol.compound}
        triggerEpisode={selectedRescueEpisode}
        onConfirmRescue={handleConfirmRescue}
      />

      {/* 6-Pass Acceptance Verification Modal */}
      <AcceptancePassModal
        isOpen={isAcceptanceModalOpen}
        onClose={() => setIsAcceptanceModalOpen(false)}
      />

    </div>
  );
};
