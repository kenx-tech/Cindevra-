export type CindevraLayerId = 'root' | 'trunk' | 'branch' | 'canopy' | 'mycorrhizal' | 'tree' | 'live-journey';
export type AetherLayerId = CindevraLayerId;

// --- MEASUREMENT-BASED CARE (MBC) ---
export interface MBCSurveyResponse {
  surveyType: 'PHQ-9' | 'GAD-7' | 'PCL-5' | 'Altered-States-Readiness' | 'MEQ-30' | 'EDI' | 'AAQ-2';
  title: string;
  timepoint: 'Baseline (Pre)' | '24h Post-Dose' | '7-Day Post' | '30-Day Post' | '90-Day Post';
  score: number;
  maxScore: number;
  severityLabel: string;
  completionDate: string;
  flaggedAlert: boolean;
  alertReason?: string;
  itemScores: { question: string; score: number }[];
}

// --- CPT CATEGORY III & FINANCIAL ARCHITECTURE ---
export interface CPTCategoryIIIBilling {
  encounterId: string;
  primaryQHP: {
    name: string;
    npi: string;
    code: '0820T';
    hoursLogged: number;
    unitRate: number; // e.g. $225 / 60-min increment
    totalBilled: number;
  };
  secondaryQHP?: {
    name: string;
    npi: string;
    code: '+0821T';
    hoursLogged: number;
    unitRate: number; // e.g. $175 / 60-min increment
    totalBilled: number;
  };
  clinicalStaff?: {
    name: string;
    code: '+0822T';
    hoursLogged: number;
    unitRate: number; // e.g. $95 / 60-min increment
    totalBilled: number;
  };
  hcpcsCodes: string[]; // e.g. ["G2082 (Spravato 56mg + 2hr Obs)"]
  packageSubscription: {
    packageName: string; // e.g. "Full Neuro-Regeneration Protocol (1 Intake + 3 Prep + 2 Dosing + 4 Integration)"
    totalCost: number; // e.g. $3,800
    feeSplit: {
      leadQHPPercent: number; // 55%
      coTherapistPercent: number; // 30%
      sanctuaryFacilityPercent: number; // 15%
    };
  };
  superbillGenerated: boolean;
  superbillId?: string;
  icd10Codes: string[]; // e.g. ["F33.2 Major Depressive Disorder, Recurrent, Severe", "F43.10 Post-Traumatic Stress Disorder"]
}

// --- 42 CFR PART 2 GRANULAR CONSENT TREE ---
export interface Part2ConsentRule {
  id: string;
  permittedRecipient: string; // e.g. "Oregon Health & Science University HIE", "Dr. Robert Sterling (Primary Care)"
  organizationType: 'HIE' | 'Primary Care Provider' | 'Clearinghouse / Billing' | 'Research Consortium' | 'Emergency Dept';
  purposeOfUse: string;
  redactSUDIdentifiers: boolean; // Auto-strips Substance Use & Psychedelic codes if true
  redactPsychiatricNotes: boolean;
  consentSignedDate: string;
  expirationDate: string;
  status: 'Active Authorized' | 'Revoked by Patient' | 'Expired';
  cryptographicSignature: string;
}

// --- DEA CONTROLLED SUBSTANCE PERPETUAL VAULT ---
export interface DEAVaultRecord {
  lotNumber: string;
  compound: string;
  deaSchedule: 'Schedule I' | 'Schedule II' | 'Schedule III';
  form222TrackingNumber: string;
  physicalVaultBalanceMg: number;
  electronicOrderBalanceMg: number;
  discrepancyDeltaMg: number; // 0 is perfect reconciliation
  lastReconciliationDate: string;
  custodianQHP1: string;
  custodianWitnessQHP2: string;
  storageVaultId: string;
  twoFactorSigned: boolean;
  wasteLog: {
    timestamp: string;
    wastedMg: number;
    reason: string;
    disposalMethod: 'Chemical neutralization' | 'Incineration transfer' | 'Bio-waste protocol';
    witness1: string;
    witness2: string;
  }[];
}

// --- AMBIENT AI CLINICAL SCRIBE ---
export interface AmbientAIScribeData {
  acousticSeparationActive: boolean; // Filters 432Hz ambient soundscape vs voice
  confidenceScore: number; // e.g. 98.4%
  detectedThemes: {
    intentionsExpressed: string[];
    defenseMechanismsSurrendered: string[];
    somaticReleases: string[];
    touchAnchorEvents: string[];
    mysticalTranscendenceCues: string[];
  };
  liveTranscriptSnippets: {
    timestamp: string;
    speaker: 'Patient' | 'Lead Facilitator' | 'Co-Therapist' | 'Ambient Soundtrack';
    text: string;
    clinicalTag?: string;
  }[];
  generatedClinicalDraftNote: {
    templateType: 'Ketamine-Assisted Psychotherapy (KAP)' | 'Psilocybin Macro-Session (25mg)' | 'Spravato (Esketamine) Observation' | 'MDMA PTSD Protocol';
    subjective: string;
    objectiveVitalsSummary: string;
    assessment: string;
    planAndIntegrationGoals: string;
  };
}

export interface PatientRecord {
  id: string;
  pseudonym: string; // e.g. "AE-8842-AURORA"
  zkIdentityHash: string;
  age: number;
  indication: string; // e.g., "Treatment-Resistant Major Depressive Disorder", "Complex PTSD"
  assignedProtocolId: string;
  status: 'Referral' | 'ZK-Screening' | 'Prep-Phase' | 'Active-Journey' | 'Integration' | 'Long-Term-Flourishing';
  prepSessionsCompleted: number;
  prepSessionsTarget: number;
  integrationSessionsCompleted: number;
  integrationSessionsTarget: number;
  jurisdiction: string; // "OR-M109", "CO-Prop122", "FDA-ExpandedAccess", "CH-BAG-Swiss"
  dataSovereignty: {
    encryptedKeyHolder: 'Patient Self-Custody' | 'Dual-Key Proxy' | 'Emergency Medical Custody';
    researchContributionOptIn: boolean;
    differentialPrivacyEpsilon: number; // e.g. 0.5
    rightToBeForgottenRequested: boolean;
    auditLogCount: number;
  };
  contraindicationsChecked: boolean;
  biometricBaseline: {
    restingHR: number;
    baselineHRV: number;
    systolicBP: number;
    diastolicBP: number;
    qtcIntervalMs: number;
  };
  intention: string;
  somaticAnchors: string[];
  meq30Score?: number; // Mystical Experience Questionnaire (0-100)
  phq9Baseline: number;
  phq9Current: number;
  caps5Baseline?: number; // PTSD scale
  caps5Current?: number;
  journeyDate?: string;
  coTherapists: string[];
  
  // Enterprise extensions
  mbcSurveys?: MBCSurveyResponse[];
  billingProfile?: CPTCategoryIIIBilling;
  part2Consents?: Part2ConsentRule[];
}

export interface ClinicalProtocol {
  id: string;
  compound: 'Psilocybin' | 'MDMA' | '5-MeO-DMT' | 'Ibogaine' | 'Ketamine' | 'DMT Infusion';
  title: string;
  version: string;
  indication: string;
  evidenceTier: 'Phase III Multicenter RCT' | 'FDA Breakthrough Fast-Track' | 'State Clinical Code' | 'Observational / Special Access';
  dosingSchedule: {
    macroDoseMg: number;
    boosterDoseMg?: number;
    boosterWindowMin?: number;
    administrationRoute: 'Oral Capsule' | 'Oral Liquid' | 'Sublingual' | 'Intramuscular' | 'Intravenous Infusion';
  };
  timelinePhases: {
    name: string;
    startMin: number;
    endMin: number;
    targetState: string;
    facilitatorActions: string[];
    musicEnergyLevel: 'Grounding / Silence' | 'Gentle Ascent' | 'Peak Symphony' | 'Oceanic Transcendence' | 'Gentle Re-Entry' | 'Luminous Integration';
  }[];
  contraindications: {
    category: 'Absolute' | 'Relative' | 'Washout Required';
    rule: string;
    mechanism: string;
  }[];
  rescueProtocols: {
    trigger: string;
    step1: string;
    step2: string;
    rescueMedication?: string;
  }[];
}

export interface TelemetryPacket {
  timestamp: string;
  elapsedMinutes: number;
  heartRate: number; // bpm
  hrv: number; // ms RMSSD
  bloodPressureSys: number;
  bloodPressureDia: number;
  oxygenSat: number; // %
  skinConductance: number; // microsiemens
  eegAlphaPower: number; // %
  eegThetaPower: number; // %
  autonomicState: 'Sympathetic Activation' | 'Parasympathetic Deep Rest' | 'Vagal Balance' | 'Peak Emotional Release' | 'Oceanic Boundary Dissolution';
  somaticIntensity: number; // 1-10 scale
}

export interface InventoryCompoundLot {
  lotNumber: string;
  compound: string;
  gmpManufacturer: string;
  batchPurityPercent: number;
  totalQuantityMg: number;
  remainingQuantityMg: number;
  expiryDate: string;
  storageTempCelsius: number;
  deaScheduleTier: string;
  chainOfCustodyLedger: {
    timestamp: string;
    actor: string;
    action: string;
    witnessName: string;
    deltaMg: number;
  }[];
}

export interface ResearchOutcomeMetric {
  condition: string;
  sampleSize: number;
  baselineScore: number;
  post1MonthScore: number;
  post6MonthScore: number;
  remissionRatePercent: number;
  mysticalExperienceCorrelation: number; // 0 to 1
  neuroplasticityMarkerBDNFDelta: string;
}

export interface JurisdictionRule {
  id: string;
  name: string;
  region: string;
  legalStatus: 'Licensed State Framework' | 'Federal REMS / Fast-Track' | 'Special Access Program' | 'Sacred Indigenous Exemption';
  substancesCovered: string[];
  mandatoryFacilitatorRatio: string;
  auditFrequency: string;
  reportingRequired: string;
  complianceHealthScore: number; // 0-100
}
