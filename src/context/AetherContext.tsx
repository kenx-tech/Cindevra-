import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  AetherLayerId, 
  PatientRecord, 
  ClinicalProtocol, 
  InventoryCompoundLot, 
  JurisdictionRule, 
  TelemetryPacket,
  DEAVaultRecord,
  Part2ConsentRule,
  AmbientAIScribeData,
  MBCSurveyResponse,
  CPTCategoryIIIBilling
} from '../types/aether';
import { 
  INITIAL_PATIENTS, 
  INITIAL_PROTOCOLS, 
  INITIAL_INVENTORY, 
  INITIAL_JURISDICTIONS,
  INITIAL_DEA_VAULT_RECORDS,
  INITIAL_PART2_CONSENTS,
  INITIAL_AMBIENT_SCRIBE_DATA
} from '../data/mockData';

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  category: 'SOVEREIGNTY' | 'CLINICAL' | 'SECURITY' | 'INVENTORY' | 'REGULATORY';
  blockHash: string;
  prevHash: string;
  zkProofVerified: boolean;
}

interface AetherContextType {
  activeLayer: AetherLayerId;
  setActiveLayer: (layer: AetherLayerId) => void;
  activeSubmodule: string;
  setActiveSubmodule: (sub: string) => void;
  
  patients: PatientRecord[];
  selectedPatient: PatientRecord | null;
  setSelectedPatient: (patient: PatientRecord | null) => void;
  addPatient: (patient: Omit<PatientRecord, 'id' | 'zkIdentityHash'>) => void;
  updatePatientSovereignty: (patientId: string, updates: Partial<PatientRecord['dataSovereignty']>) => void;
  triggerRightToBeForgotten: (patientId: string) => void;
  
  protocols: ClinicalProtocol[];
  selectedProtocol: ClinicalProtocol;
  setSelectedProtocol: (protocol: ClinicalProtocol) => void;
  forkProtocol: (parentProtocolId: string, forkName: string, customDose: number) => void;

  jurisdictions: JurisdictionRule[];
  activeJurisdiction: JurisdictionRule;
  setActiveJurisdiction: (j: JurisdictionRule) => void;

  inventory: InventoryCompoundLot[];
  dispenseCompound: (lotNumber: string, mg: number, actor: string, witness: string, patientPseudonym: string) => boolean;

  // Active Journey Telemetry & Controls
  isLiveJourneyRunning: boolean;
  setIsLiveJourneyRunning: (running: boolean) => void;
  currentJourneyMinute: number;
  setCurrentJourneyMinute: (min: number | ((prev: number) => number)) => void;
  liveTelemetry: TelemetryPacket;
  telemetryHistory: TelemetryPacket[];
  somaticLogs: { time: string; minute: number; author: string; note: string; category: 'Touch' | 'Verbal' | 'Vitals' | 'Phenomenology' | 'Rescue' }[];
  addSomaticLog: (author: string, note: string, category: 'Touch' | 'Verbal' | 'Vitals' | 'Phenomenology' | 'Rescue') => void;
  
  // Ambient Sound Engine & AI Scribe
  ambientAudioActive: boolean;
  toggleAmbientAudio: () => void;
  ambientScribe: AmbientAIScribeData;
  toggleAcousticSeparation: () => void;

  // DEA Perpetual Vault Engine
  deaVaultRecords: DEAVaultRecord[];
  reconcileVaultLot: (lotNumber: string, physicalCountMg: number, witnessQHP2: string) => void;
  logVaultWaste: (lotNumber: string, wastedMg: number, reason: string, witness1: string, witness2: string) => void;

  // 42 CFR Part 2 Consent Engine
  part2Consents: Part2ConsentRule[];
  togglePart2Redaction: (consentId: string) => void;

  // Measurement-Based Care (MBC) & CPT Billing
  addMBCResponse: (patientId: string, response: MBCSurveyResponse) => void;
  generateSuperbill: (patientId: string) => void;

  // REMS Automation
  remsAttestationSubmitted: boolean;
  submitREMSAttestation: (patientPseudonym: string, qhp1: string, qhp2: string) => boolean;

  // Audit Hash Chain
  auditLedger: AuditLogEntry[];
  recordAudit: (action: string, category: AuditLogEntry['category'], actor?: string) => void;

  // Modals & Overlays
  showManifesto: boolean;
  setShowManifesto: (show: boolean) => void;
  showCreatorBio: boolean;
  setShowCreatorBio: (show: boolean) => void;
  emergencyLockdown: boolean;
  toggleEmergencyLockdown: () => void;
}

const AetherContext = createContext<AetherContextType | undefined>(undefined);

// Helper to generate mock SHA-256-style cryptographic hashes
const makeHash = (str: string) => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = ((hash << 5) - hash) + str.charCodeAt(i);
    hash |= 0;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return `0x${hex}${Date.now().toString(16).slice(-6)}8842af91c7e`;
};

export const AetherProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeLayer, setActiveLayer] = useState<AetherLayerId>('tree');
  const [activeSubmodule, setActiveSubmodule] = useState<string>('all');
  
  const [patients, setPatients] = useState<PatientRecord[]>(INITIAL_PATIENTS);
  const [selectedPatient, setSelectedPatient] = useState<PatientRecord | null>(INITIAL_PATIENTS[0]);
  
  const [protocols, setProtocols] = useState<ClinicalProtocol[]>(INITIAL_PROTOCOLS);
  const [selectedProtocol, setSelectedProtocol] = useState<ClinicalProtocol>(INITIAL_PROTOCOLS[0]);

  const [jurisdictions] = useState<JurisdictionRule[]>(INITIAL_JURISDICTIONS);
  const [activeJurisdiction, setActiveJurisdiction] = useState<JurisdictionRule>(INITIAL_JURISDICTIONS[0]);

  const [inventory, setInventory] = useState<InventoryCompoundLot[]>(INITIAL_INVENTORY);
  const [deaVaultRecords, setDeaVaultRecords] = useState<DEAVaultRecord[]>(INITIAL_DEA_VAULT_RECORDS);
  const [part2Consents, setPart2Consents] = useState<Part2ConsentRule[]>(INITIAL_PART2_CONSENTS);
  const [ambientScribe, setAmbientScribe] = useState<AmbientAIScribeData>(INITIAL_AMBIENT_SCRIBE_DATA);
  const [remsAttestationSubmitted, setRemsAttestationSubmitted] = useState<boolean>(false);

  const [showManifesto, setShowManifesto] = useState<boolean>(false);
  const [showCreatorBio, setShowCreatorBio] = useState<boolean>(false);
  const [emergencyLockdown, setEmergencyLockdown] = useState<boolean>(false);

  // Toggle Ambient AI Scribe Acoustic Separation
  const toggleAcousticSeparation = () => {
    setAmbientScribe(prev => ({
      ...prev,
      acousticSeparationActive: !prev.acousticSeparationActive
    }));
    recordAudit(`Ambient AI Scribe acoustic separation toggled`, 'CLINICAL', 'Acoustic AI Filter');
  };

  // DEA Perpetual Vault Reconciliation
  const reconcileVaultLot = (lotNumber: string, physicalCountMg: number, witnessQHP2: string) => {
    setDeaVaultRecords(prev => prev.map(rec => {
      if (rec.lotNumber === lotNumber) {
        const delta = physicalCountMg - rec.electronicOrderBalanceMg;
        return {
          ...rec,
          physicalVaultBalanceMg: physicalCountMg,
          discrepancyDeltaMg: delta,
          lastReconciliationDate: new Date().toISOString().replace('T', ' ').slice(0, 19),
          custodianWitnessQHP2: witnessQHP2,
          twoFactorSigned: true
        };
      }
      return rec;
    }));
    recordAudit(`DEA Perpetual Vault Lot ${lotNumber} dual-reconciled: Physical count ${physicalCountMg}mg (Witness: ${witnessQHP2})`, 'INVENTORY', 'Dr. Julian Mercer, MD');
  };

  // DEA Waste Logging
  const logVaultWaste = (lotNumber: string, wastedMg: number, reason: string, witness1: string, witness2: string) => {
    setDeaVaultRecords(prev => prev.map(rec => {
      if (rec.lotNumber === lotNumber) {
        return {
          ...rec,
          physicalVaultBalanceMg: rec.physicalVaultBalanceMg - wastedMg,
          electronicOrderBalanceMg: rec.electronicOrderBalanceMg - wastedMg,
          wasteLog: [
            ...rec.wasteLog,
            {
              timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
              wastedMg,
              reason,
              disposalMethod: 'DEA Form 41 Protocol (Chemical Neutralization)',
              witness1,
              witness2
            }
          ]
        };
      }
      return rec;
    }));
    recordAudit(`DEA Form 41 Waste Recorded: ${wastedMg}mg from ${lotNumber} destroyed (${reason}). Witnessed by ${witness1} & ${witness2}`, 'INVENTORY', witness1);
  };

  // 42 CFR Part 2 Consent Redaction Toggle
  const togglePart2Redaction = (consentId: string) => {
    setPart2Consents(prev => prev.map(c => {
      if (c.id === consentId) {
        return {
          ...c,
          redactPsychiatricNotes: !c.redactPsychiatricNotes
        };
      }
      return c;
    }));
    recordAudit(`42 CFR Part 2 redaction policy updated for consent rule ${consentId}`, 'SOVEREIGNTY', 'Privacy Officer');
  };

  // Add Measurement-Based Care (MBC) Survey
  const addMBCResponse = (patientId: string, response: MBCSurveyResponse) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          mbcSurveys: [...(p.mbcSurveys || []), response]
        };
      }
      return p;
    }));
    recordAudit(`MBC Outcome Battery Logged for ${patientId}: ${response.title} [Score: ${response.score}/${response.maxScore}]`, 'CLINICAL');
  };

  // Superbill CPT Generation
  const generateSuperbill = (patientId: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId && p.billingProfile) {
        return {
          ...p,
          billingProfile: {
            ...p.billingProfile,
            superbillGenerated: true,
            superbillId: `SB-2026-${Math.floor(1000 + Math.random() * 9000)}-SUPER`
          }
        };
      }
      return p;
    }));
    recordAudit(`CPT Category III Superbill (0820T / +0821T) generated and cryptographically stamped for patient ${patientId}`, 'REGULATORY', 'Billing Compliance');
  };

  // Submit REMS Attestation
  const submitREMSAttestation = (patientPseudonym: string, qhp1: string, qhp2: string): boolean => {
    setRemsAttestationSubmitted(true);
    recordAudit(`FDA REMS Safe Delivery Attestation cryptographically certified for ${patientPseudonym} (Lead QHP: ${qhp1}, Co-QHP: ${qhp2})`, 'REGULATORY', qhp1);
    return true;
  };

  // Live Journey State
  const [isLiveJourneyRunning, setIsLiveJourneyRunning] = useState<boolean>(true);
  const [currentJourneyMinute, setCurrentJourneyMinute] = useState<number>(142); // deep in oceanic peak phase
  
  const [telemetryHistory, setTelemetryHistory] = useState<TelemetryPacket[]>([]);
  const [liveTelemetry, setLiveTelemetry] = useState<TelemetryPacket>({
    timestamp: new Date().toLocaleTimeString(),
    elapsedMinutes: 142,
    heartRate: 76,
    hrv: 64,
    bloodPressureSys: 122,
    bloodPressureDia: 78,
    oxygenSat: 99,
    skinConductance: 3.2,
    eegAlphaPower: 78,
    eegThetaPower: 86,
    autonomicState: 'Oceanic Boundary Dissolution',
    somaticIntensity: 8.5,
  });

  const [somaticLogs, setSomaticLogs] = useState<{
    time: string;
    minute: number;
    author: string;
    note: string;
    category: 'Touch' | 'Verbal' | 'Vitals' | 'Phenomenology' | 'Rescue';
  }[]>([
    {
      time: '09:00',
      minute: 0,
      author: 'Dr. Elena Vance',
      note: 'Oral administration of 25mg GMP Psilocybin with warm ceremonial cedar tea. Patient grounded, intention reaffirmed.',
      category: 'Verbal'
    },
    {
      time: '09:35',
      minute: 35,
      author: 'Marcus Thorne, LPC',
      note: 'Initial somatic ascent tremors noted in feet/hands. Applied gentle weighted blanket. Eyeshades securely donned.',
      category: 'Touch'
    },
    {
      time: '10:45',
      minute: 105,
      author: 'Dr. Elena Vance',
      note: 'Deep cathartic emotional release. Spontaneous crying with smiles of relief. Autonomic tone shifted to profound parasympathetic surrender.',
      category: 'Phenomenology'
    },
    {
      time: '11:22',
      minute: 142,
      author: 'Marcus Thorne, LPC',
      note: 'Patient reached out hand for anchor. Held hand with gentle stillness for 4 minutes until steady breath returned.',
      category: 'Touch'
    }
  ]);

  // Audit Hash Chain
  const [auditLedger, setAuditLedger] = useState<AuditLogEntry[]>([
    {
      id: 'LOG-001',
      timestamp: '2026-09-01 07:30:11',
      actor: 'System Root Kernel',
      action: 'Zero-Knowledge Security Root Initialized with 256-bit Elliptic Curve Keys',
      category: 'SECURITY',
      blockHash: '0x8891ac3710bf4a',
      prevHash: '0x00000000000000',
      zkProofVerified: true,
    },
    {
      id: 'LOG-002',
      timestamp: '2026-09-01 07:45:00',
      actor: 'Dr. Elena Vance',
      action: 'Dispensed 25mg Psilocybin Lot GMP-PSI-2026-04A for Patient AE-9941 (Dual-Witnessed)',
      category: 'INVENTORY',
      blockHash: '0x9923be8812af11',
      prevHash: '0x8891ac3710bf4a',
      zkProofVerified: true,
    },
    {
      id: 'LOG-003',
      timestamp: '2026-09-01 08:00:22',
      actor: 'Patient AE-9941 Self-Custody',
      action: 'ZK-Consent Vault Signed: Entheogen Administration & Differential Privacy (ε=0.25)',
      category: 'SOVEREIGNTY',
      blockHash: '0xaa14cf9923b022',
      prevHash: '0x9923be8812af11',
      zkProofVerified: true,
    }
  ]);

  const recordAudit = (action: string, category: AuditLogEntry['category'], actor = 'Lead Clinician') => {
    const prev = auditLedger[auditLedger.length - 1];
    const prevHash = prev ? prev.blockHash : '0x00000000';
    const blockHash = makeHash(action + Date.now());
    const newEntry: AuditLogEntry = {
      id: `LOG-${(auditLedger.length + 1).toString().padStart(3, '0')}`,
      timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
      actor,
      action,
      category,
      blockHash,
      prevHash,
      zkProofVerified: true,
    };
    setAuditLedger(prev => [newEntry, ...prev]);
  };

  const addPatient = (newP: Omit<PatientRecord, 'id' | 'zkIdentityHash'>) => {
    const id = `PT-${Math.floor(1000 + Math.random() * 9000)}-${newP.pseudonym.toUpperCase().slice(0, 4)}`;
    const zkIdentityHash = makeHash(id + newP.pseudonym);
    const created: PatientRecord = {
      ...newP,
      id,
      zkIdentityHash,
    };
    setPatients(prev => [created, ...prev]);
    recordAudit(`Patient Sovereign Intake registered: ${created.pseudonym} (ZK Identity Sealed)`, 'SOVEREIGNTY');
  };

  const updatePatientSovereignty = (patientId: string, updates: Partial<PatientRecord['dataSovereignty']>) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          dataSovereignty: {
            ...p.dataSovereignty,
            ...updates,
            auditLogCount: p.dataSovereignty.auditLogCount + 1,
          }
        };
      }
      return p;
    }));
    recordAudit(`Patient ${patientId} sovereignty permissions updated`, 'SOVEREIGNTY');
  };

  const triggerRightToBeForgotten = (patientId: string) => {
    setPatients(prev => prev.map(p => {
      if (p.id === patientId) {
        return {
          ...p,
          pseudonym: 'ANONYMIZED_SHREDDED_SUBJECT',
          intention: '[CRYPTOGRAPHICALLY SHREDDED - EPHEMERAL KEYS PURGED]',
          somaticAnchors: ['[PURGED]'],
          dataSovereignty: {
            ...p.dataSovereignty,
            rightToBeForgottenRequested: true,
            encryptedKeyHolder: 'Patient Self-Custody',
            researchContributionOptIn: false,
          }
        };
      }
      return p;
    }));
    recordAudit(`Right-to-Be-Forgotten triggered for ${patientId}. Ephemeral decryption key destroyed via zero-knowledge shredder.`, 'SOVEREIGNTY', 'Sovereignty Engine');
  };

  const forkProtocol = (parentProtocolId: string, forkName: string, customDose: number) => {
    const parent = protocols.find(p => p.id === parentProtocolId);
    if (!parent) return;
    const forked: ClinicalProtocol = {
      ...parent,
      id: `FORK-${Date.now().toString(36).toUpperCase()}`,
      title: `${forkName} (Forked from ${parent.title})`,
      version: 'v1.0.0-CustomFork',
      dosingSchedule: {
        ...parent.dosingSchedule,
        macroDoseMg: customDose,
      }
    };
    setProtocols(prev => [forked, ...prev]);
    recordAudit(`Protocol Fork Created: "${forkName}" with ${customDose}mg macro dose`, 'CLINICAL');
  };

  const dispenseCompound = (lotNumber: string, mg: number, actor: string, witness: string, patientPseudonym: string): boolean => {
    let success = false;
    setInventory(prev => prev.map(lot => {
      if (lot.lotNumber === lotNumber) {
        if (lot.remainingQuantityMg >= mg) {
          success = true;
          return {
            ...lot,
            remainingQuantityMg: lot.remainingQuantityMg - mg,
            chainOfCustodyLedger: [
              ...lot.chainOfCustodyLedger,
              {
                timestamp: new Date().toISOString().replace('T', ' ').slice(0, 19),
                actor,
                action: `Dispensed ${mg}mg for ${patientPseudonym}`,
                witnessName: witness,
                deltaMg: -mg,
              }
            ]
          };
        }
      }
      return lot;
    }));

    if (success) {
      recordAudit(`Dispensed ${mg}mg from Lot ${lotNumber} for ${patientPseudonym} (Witnessed by ${witness})`, 'INVENTORY', actor);
    }
    return success;
  };

  const addSomaticLog = (author: string, note: string, category: 'Touch' | 'Verbal' | 'Vitals' | 'Phenomenology' | 'Rescue') => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setSomaticLogs(prev => [
      ...prev,
      {
        time: timeStr,
        minute: currentJourneyMinute,
        author,
        note,
        category,
      }
    ]);
    recordAudit(`Journey Somatic Event logged [${category}]: "${note.slice(0, 45)}..."`, 'CLINICAL', author);
  };

  // Ambient Web Audio Synthesizer (Pure sacred clinical 432Hz sine drone + theta harmonic)
  const [ambientAudioActive, setAmbientAudioActive] = useState<boolean>(false);
  const [audioCtxRef, setAudioCtxRef] = useState<AudioContext | null>(null);
  const [oscillatorsRef, setOscillatorsRef] = useState<{ osc1: OscillatorNode; osc2: OscillatorNode; gain: GainNode } | null>(null);

  const toggleAmbientAudio = () => {
    if (!ambientAudioActive) {
      try {
        const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new AudioCtx();
        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.04, ctx.currentTime); // gentle, soothing volume

        // 432Hz root carrier
        const osc1 = ctx.createOscillator();
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(216, ctx.currentTime); // sub-octave 216Hz for warm grounding

        // Theta brainwave harmonic +6Hz binaural shimmer
        const osc2 = ctx.createOscillator();
        osc2.type = 'sine';
        osc2.frequency.setValueAtTime(222, ctx.currentTime); // 6Hz theta difference

        osc1.connect(gainNode);
        osc2.connect(gainNode);
        gainNode.connect(ctx.destination);

        osc1.start();
        osc2.start();

        setAudioCtxRef(ctx);
        setOscillatorsRef({ osc1, osc2, gain: gainNode });
        setAmbientAudioActive(true);
      } catch {
        // audio context blocked by browser policy until interaction
        setAmbientAudioActive(false);
      }
    } else {
      if (oscillatorsRef && audioCtxRef) {
        try {
          oscillatorsRef.gain.gain.exponentialRampToValueAtTime(0.0001, audioCtxRef.currentTime + 0.8);
          setTimeout(() => {
            oscillatorsRef.osc1.stop();
            oscillatorsRef.osc2.stop();
            audioCtxRef.close();
            setAudioCtxRef(null);
            setOscillatorsRef(null);
          }, 800);
        } catch {
          // ignore cleanup
        }
      }
      setAmbientAudioActive(false);
    }
  };

  // Live Telemetry Simulation Engine
  useEffect(() => {
    if (!isLiveJourneyRunning) return;

    const interval = setInterval(() => {
      setCurrentJourneyMinute(prev => (prev < 420 ? prev + 1 : 0));

      setLiveTelemetry(current => {
        // Natural biological organic drift
        const hrDrift = (Math.random() - 0.48) * 1.8;
        const hrvDrift = (Math.random() - 0.48) * 2.5;
        const scDrift = (Math.random() - 0.49) * 0.15;
        
        const newHr = Math.min(98, Math.max(58, Math.round(current.heartRate + hrDrift)));
        const newHrv = Math.min(95, Math.max(30, Math.round(current.hrv + hrvDrift)));
        const newSc = Number(Math.min(7.5, Math.max(1.2, current.skinConductance + scDrift)).toFixed(2));
        
        let state: TelemetryPacket['autonomicState'] = 'Oceanic Boundary Dissolution';
        if (newHr > 88 && newSc > 4.5) state = 'Sympathetic Activation';
        else if (newHrv > 75) state = 'Parasympathetic Deep Rest';
        else if (newSc > 5.0) state = 'Peak Emotional Release';
        else if (newHrv > 55) state = 'Oceanic Boundary Dissolution';
        else state = 'Vagal Balance';

        const updated: TelemetryPacket = {
          timestamp: new Date().toLocaleTimeString(),
          elapsedMinutes: current.elapsedMinutes + 1,
          heartRate: newHr,
          hrv: newHrv,
          bloodPressureSys: Math.round(118 + (newHr - 70) * 0.3),
          bloodPressureDia: Math.round(76 + (newHr - 70) * 0.15),
          oxygenSat: Math.random() > 0.95 ? 98 : 99,
          skinConductance: newSc,
          eegAlphaPower: Math.round(70 + Math.sin(Date.now() / 3000) * 12),
          eegThetaPower: Math.round(80 + Math.cos(Date.now() / 4000) * 10),
          autonomicState: state,
          somaticIntensity: Number((7.0 + Math.sin(Date.now() / 8000) * 2.2).toFixed(1)),
        };

        setTelemetryHistory(hist => [...hist.slice(-40), updated]);
        return updated;
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [isLiveJourneyRunning]);

  const toggleEmergencyLockdown = () => {
    const nextState = !emergencyLockdown;
    setEmergencyLockdown(nextState);
    if (nextState) {
      recordAudit('CRITICAL: Emergency Sovereign Lockdown Activated — External APIs Suspended', 'SECURITY', 'Security Root');
    } else {
      recordAudit('Emergency Sovereign Lockdown Deactivated — Nominal Operations Restored', 'SECURITY', 'Security Root');
    }
  };

  return (
    <AetherContext.Provider
      value={{
        activeLayer,
        setActiveLayer,
        activeSubmodule,
        setActiveSubmodule,
        patients,
        selectedPatient,
        setSelectedPatient,
        addPatient,
        updatePatientSovereignty,
        triggerRightToBeForgotten,
        protocols,
        selectedProtocol,
        setSelectedProtocol,
        forkProtocol,
        jurisdictions,
        activeJurisdiction,
        setActiveJurisdiction,
        inventory,
        dispenseCompound,
        deaVaultRecords,
        reconcileVaultLot,
        logVaultWaste,
        part2Consents,
        togglePart2Redaction,
        ambientScribe,
        toggleAcousticSeparation,
        addMBCResponse,
        generateSuperbill,
        remsAttestationSubmitted,
        submitREMSAttestation,
        isLiveJourneyRunning,
        setIsLiveJourneyRunning,
        currentJourneyMinute,
        setCurrentJourneyMinute,
        liveTelemetry,
        telemetryHistory,
        somaticLogs,
        addSomaticLog,
        ambientAudioActive,
        toggleAmbientAudio,
        auditLedger,
        recordAudit,
        showManifesto,
        setShowManifesto,
        showCreatorBio,
        setShowCreatorBio,
        emergencyLockdown,
        toggleEmergencyLockdown,
      }}
    >
      {children}
    </AetherContext.Provider>
  );
};

export const useAether = () => {
  const context = useContext(AetherContext);
  if (!context) {
    throw new Error('useCindevra must be used within a CindevraProvider');
  }
  return context;
};

export const useCindevra = useAether;
export const CindevraProvider = AetherProvider;
