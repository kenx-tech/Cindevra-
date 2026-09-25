import { 
  PatientRecord, 
  ClinicalProtocol, 
  InventoryCompoundLot, 
  ResearchOutcomeMetric, 
  JurisdictionRule,
  MBCSurveyResponse,
  CPTCategoryIIIBilling,
  Part2ConsentRule,
  DEAVaultRecord,
  AmbientAIScribeData 
} from '../types/aether';

export const INITIAL_DEA_VAULT_RECORDS: DEAVaultRecord[] = [
  {
    lotNumber: 'GMP-PSI-2026-04A',
    compound: 'Synthetic Psilocybin (GMP API)',
    deaSchedule: 'Schedule I',
    form222TrackingNumber: 'DEA-222-OR-2026-9941A',
    physicalVaultBalanceMg: 3875,
    electronicOrderBalanceMg: 3875,
    discrepancyDeltaMg: 0,
    lastReconciliationDate: '2026-09-01 07:45:00',
    custodianQHP1: 'Dr. Julian Mercer, MD (DEA #AM8842109)',
    custodianWitnessQHP2: 'Dr. Elena Vance, PsyD',
    storageVaultId: 'VAULT-ALPHA-SAFE-01 (Biometric + Dual-Key)',
    twoFactorSigned: true,
    wasteLog: [
      {
        timestamp: '2026-08-18 16:30:00',
        wastedMg: 2,
        reason: 'Capsule residue during analytical weight verification',
        disposalMethod: 'Chemical neutralization',
        witness1: 'Dr. Julian Mercer',
        witness2: 'Sarah Chen, LCSW'
      }
    ]
  },
  {
    lotNumber: 'GMP-MDMA-2026-09C',
    compound: 'MDMA Hydrochloride (GMP Pharmaceutical Grade)',
    deaSchedule: 'Schedule I',
    form222TrackingNumber: 'DEA-222-FED-2026-1184C',
    physicalVaultBalanceMg: 8240,
    electronicOrderBalanceMg: 8240,
    discrepancyDeltaMg: 0,
    lastReconciliationDate: '2026-08-18 08:15:00',
    custodianQHP1: 'Dr. Julian Mercer, MD',
    custodianWitnessQHP2: 'Sarah Chen, LCSW',
    storageVaultId: 'VAULT-ALPHA-SAFE-02 (Climate Controlled)',
    twoFactorSigned: true,
    wasteLog: []
  },
  {
    lotNumber: 'KET-USP-2026-88',
    compound: 'Ketamine HCl Injection (50mg/mL USP)',
    deaSchedule: 'Schedule III',
    form222TrackingNumber: 'DEA-INVOICE-OR-7729',
    physicalVaultBalanceMg: 4500,
    electronicOrderBalanceMg: 4500,
    discrepancyDeltaMg: 0,
    lastReconciliationDate: '2026-08-30 18:00:00',
    custodianQHP1: 'Dr. Maya Lin, MD',
    custodianWitnessQHP2: 'Marcus Thorne, LPC',
    storageVaultId: 'VAULT-BETA-SECURE-03',
    twoFactorSigned: true,
    wasteLog: [
      {
        timestamp: '2026-08-25 11:15:00',
        wastedMg: 15,
        reason: 'Unused partial vial volume post-dosing titration',
        disposalMethod: 'Bio-waste protocol',
        witness1: 'Dr. Maya Lin, MD',
        witness2: 'Marcus Thorne, LPC'
      }
    ]
  }
];

export const INITIAL_PART2_CONSENTS: Part2ConsentRule[] = [
  {
    id: 'P2-CONSENT-001',
    permittedRecipient: 'Oregon Health & Science University (OHSU) Health Information Exchange',
    organizationType: 'HIE',
    purposeOfUse: 'Emergency medical care & primary care coordination only',
    redactSUDIdentifiers: true,
    redactPsychiatricNotes: true,
    consentSignedDate: '2026-08-10',
    expirationDate: '2027-08-10',
    status: 'Active Authorized',
    cryptographicSignature: '0x94f0...8821a (ECDSA Secp256k1 Signed by Participant)'
  },
  {
    id: 'P2-CONSENT-002',
    permittedRecipient: 'Availity Insurance Clearinghouse (Out-of-Network Superbill Processing)',
    organizationType: 'Clearinghouse / Billing',
    purposeOfUse: 'Direct claim submission for CPT Category III (0820T/0821T)',
    redactSUDIdentifiers: false, // Disclosed under explicit patient authorization
    redactPsychiatricNotes: true, // Narrative therapy notes strictly withheld
    consentSignedDate: '2026-08-15',
    expirationDate: '2027-02-15',
    status: 'Active Authorized',
    cryptographicSignature: '0x33bc...7710f (ECDSA Secp256k1)'
  },
  {
    id: 'P2-CONSENT-003',
    permittedRecipient: 'Dr. Robert Sterling, MD (Patient Primary Care Physician)',
    organizationType: 'Primary Care Provider',
    purposeOfUse: 'Cardiovascular vitals & medication reconciliation sharing',
    redactSUDIdentifiers: true,
    redactPsychiatricNotes: true,
    consentSignedDate: '2026-08-01',
    expirationDate: '2026-12-31',
    status: 'Active Authorized',
    cryptographicSignature: '0x88ea...1200b (ECDSA Secp256k1)'
  }
];

export const INITIAL_AMBIENT_SCRIBE_DATA: AmbientAIScribeData = {
  acousticSeparationActive: true,
  confidenceScore: 98.6,
  detectedThemes: {
    intentionsExpressed: [
      'Release 10-year weight of parental grief',
      'Remember childhood innocence & core safety in the body',
      'Desire to reconnect with spouse with open heart'
    ],
    defenseMechanismsSurrendered: [
      'Intellectualizing trauma loops dissolved at min 75',
      'Hypervigilant somatic tension in shoulders relaxed at min 110',
      'Need for perfectionism released into spontaneous tears'
    ],
    somaticReleases: [
      'Spontaneous deep diaphragmatic exhales with vocal sighing',
      'Warm tears flowing without verbal constriction',
      'Somatic trembling in hands settling into stillness'
    ],
    touchAnchorEvents: [
      'Requested and received two-handed grounding touch on sternum (Min 82)',
      'Held cedar wood talisman continuously across peak phase (Min 90-180)'
    ],
    mysticalTranscendenceCues: [
      'Verbalized feeling connected to a golden ocean of timeless unconditional love',
      'Reported feeling no separation between self, breath, and sanctuary acoustics'
    ]
  },
  liveTranscriptSnippets: [
    {
      timestamp: '10:45:12 (Min 105)',
      speaker: 'Patient',
      text: 'I can see the room where my father passed away... but the walls are made of light now. It does not hurt to look anymore.',
      clinicalTag: 'Memory Reconsolidation & Affective Reframing'
    },
    {
      timestamp: '10:46:04 (Min 106)',
      speaker: 'Lead Facilitator',
      text: 'Stay right there in that light, Aurora. Breathe into your chest. You are completely safe here with us.',
      clinicalTag: 'Facilitator Somatic Holding & Attunement'
    },
    {
      timestamp: '10:47:30 (Min 107)',
      speaker: 'Co-Therapist',
      text: '[Places hand softly on participant left shoulder anchor; participant visibly sighs in relief]',
      clinicalTag: 'Non-Verbal Safe Touch Anchor Executed'
    },
    {
      timestamp: '10:48:15 (Min 108)',
      speaker: 'Patient',
      text: 'Thank you... I feel like my heart was frozen for fifteen years and it is finally thawing out.',
      clinicalTag: 'Ego Softening & Emotional Catharsis'
    }
  ],
  generatedClinicalDraftNote: {
    templateType: 'Psilocybin Macro-Session (25mg)',
    subjective: 'Participant arrived calm, grounded, and well-prepared with confirmed 12-hour fast and supportive escort in lobby. Reaffirmed intention to release historical grief armor. Ingested 25mg GMP Psilocybin with warm herbal tea in presence of dual QHP care team.',
    objectiveVitalsSummary: 'Baseline BP 118/76, HR 68. Peak session BP 128/82 at min 105, HR 76. SpO2 maintained 99% throughout. EEG Alpha/Theta synchrony peaked at min 110 (86% theta power). Nominal sinus rhythm observed with zero pressor complications.',
    assessment: 'Profound mystical and affective breakthrough experienced. Participant successfully accessed traumatic memory with low fear arousal and high self-compassion. High scores anticipated on Mystical Experience Questionnaire (MEQ-30). Complete surrender of cognitive hypervigilance.',
    planAndIntegrationGoals: 'Schedule 24-hour post-session remote check-in tomorrow at 10:00 AM. In-person Integration Session #1 scheduled in 72 hours to anchor insights. Deploy automated PHQ-9 and GAD-7 surveys on Day 7, Day 30, and Day 90.'
  }
};

export const INITIAL_JURISDICTIONS: JurisdictionRule[] = [
  {
    id: 'OR-M109',
    name: 'Oregon Measure 109 Service Center',
    region: 'United States — Oregon',
    legalStatus: 'Licensed State Framework',
    substancesCovered: ['Psilocybin (Natural/Synthetic)'],
    mandatoryFacilitatorRatio: '1:1 or 2:1 for High Dose',
    auditFrequency: 'Quarterly State OHA Sync',
    reportingRequired: 'Mandatory Adverse Event + Client Ledger',
    complianceHealthScore: 99.4,
  },
  {
    id: 'CO-PROP122',
    name: 'Colorado Natural Medicine Code',
    region: 'United States — Colorado (DORA)',
    legalStatus: 'Licensed State Framework',
    substancesCovered: ['Psilocybin', 'Psilocin', 'DMT', 'Ibogaine (Phase II)'],
    mandatoryFacilitatorRatio: '1:1 Certified Facilitator',
    auditFrequency: 'Continuous Hash Audit',
    reportingRequired: 'Anonymized Clinical Safety Aggregate',
    complianceHealthScore: 98.8,
  },
  {
    id: 'FDA-REMS-MDMA',
    name: 'FDA Special Expanded Access / REMS Protocol',
    region: 'United States — Federal Clinical Sites',
    legalStatus: 'Federal REMS / Fast-Track',
    substancesCovered: ['MDMA Hydrochloride (GMP 99.8%)'],
    mandatoryFacilitatorRatio: '2:1 (Lead Clinician + Assist Co-Therapist)',
    auditFrequency: 'Per Session Real-time Telemetry Sign-off',
    reportingRequired: 'Full 21 CFR Part 11 Electronic Trail',
    complianceHealthScore: 100.0,
  },
  {
    id: 'CH-BAG-SWISS',
    name: 'Swiss Federal Office of Public Health (BAG)',
    region: 'Switzerland (SFPT Compassionate Use)',
    legalStatus: 'Special Access Program',
    substancesCovered: ['LSD', 'Psilocybin', 'MDMA'],
    mandatoryFacilitatorRatio: 'MD Psychiatrist Supervision',
    auditFrequency: 'Semi-Annual BAG Dossier',
    reportingRequired: 'Patient Remission & Safety Logs',
    complianceHealthScore: 99.1,
  },
  {
    id: 'SACRED-EXEMPTION',
    name: 'Sacred Lineage & Reciprocity Framework',
    region: 'Sovereign Indigenous / Religious Freedom Act',
    legalStatus: 'Sacred Indigenous Exemption',
    substancesCovered: ['Ayahuasca (Banisteriopsis + Psychotria)', 'Peyote / San Pedro', 'Sacred Fungi'],
    mandatoryFacilitatorRatio: 'Lineage Holder + Clinical Harm-Reduction Escort',
    auditFrequency: 'Elder Council Sovereign Review',
    reportingRequired: 'Community Sovereignty Affirmation (Zero Extractive IP)',
    complianceHealthScore: 100.0,
  }
];

export const INITIAL_PROTOCOLS: ClinicalProtocol[] = [
  {
    id: 'PSIL-TRD-25',
    compound: 'Psilocybin',
    title: 'Psilocybin Macro-Session Protocol (TRD & EOL Distress)',
    version: 'v4.2.0 (MAPS/Hopkins Synthesis)',
    indication: 'Treatment-Resistant Major Depressive Disorder & Existential Anxiety',
    evidenceTier: 'Phase III Multicenter RCT',
    dosingSchedule: {
      macroDoseMg: 25,
      boosterDoseMg: 10,
      boosterWindowMin: 90,
      administrationRoute: 'Oral Capsule',
    },
    timelinePhases: [
      {
        name: 'Phase 0: Sacred Grounding & Ingestion',
        startMin: 0,
        endMin: 30,
        targetState: 'Somatic centering, nervous system down-regulation',
        facilitatorActions: ['Confirm ZK consent & vital baseline', 'Administer 25mg with herbal tea', 'Re-affirm intention and safe touch anchors'],
        musicEnergyLevel: 'Grounding / Silence',
      },
      {
        name: 'Phase 1: Somatic Onset & Ascent',
        startMin: 30,
        endMin: 90,
        targetState: 'Altered sensorium, emotional permeability, transient anxiety',
        facilitatorActions: ['Encourage eyeshades and inward focus', 'Provide hand-on-shoulder grounding if distress spikes', 'Monitor autonomic spikes'],
        musicEnergyLevel: 'Gentle Ascent',
      },
      {
        name: 'Phase 2: Oceanic Peak & Ego Attenuation',
        startMin: 90,
        endMin: 210,
        targetState: 'Mystical unity, unitive awareness, profound cathartic release',
        facilitatorActions: ['Maintain non-interfering vigilant presence', 'Log somatic tremors or emotional releases', 'Evaluate optional 10mg booster if therapeutic plateau at min 90'],
        musicEnergyLevel: 'Oceanic Transcendence',
      },
      {
        name: 'Phase 3: Emotional Re-structuring & Descent',
        startMin: 210,
        endMin: 330,
        targetState: 'Insight synthesis, biographical reconciliation, deep peace',
        facilitatorActions: ['Remove eyeshades when patient initiates', 'Offer warm broth and hydration', 'Begin soft dialogue only if patient initiates'],
        musicEnergyLevel: 'Gentle Re-Entry',
      },
      {
        name: 'Phase 4: Immediate Luminescence & Grounding',
        startMin: 330,
        endMin: 420,
        targetState: 'Cognitive re-orientation, gratitude, neuroplastic openness',
        facilitatorActions: ['Record immediate audio reflection in patient vault', 'Administer vital discharge check', 'Hand off to verified support escort'],
        musicEnergyLevel: 'Luminous Integration',
      }
    ],
    contraindications: [
      { category: 'Absolute', rule: 'Personal or first-degree family history of schizophrenia / psychotic disorder', mechanism: 'Risk of triggering unmanaged latent psychosis' },
      { category: 'Absolute', rule: 'Uncontrolled Hypertension (>160/100 mmHg) or severe cardiac arrhythmia', mechanism: 'Transient 5-HT2A mediated sympathomimetic pressor response' },
      { category: 'Washout Required', rule: 'Current active SSRI / SNRI usage without 2-3 week clinical taper', mechanism: 'Receptor down-regulation diminishes entheogenic therapeutic response' },
      { category: 'Relative', rule: 'Current Lithium or Tramadol medication', mechanism: 'High risk of seizure activity and serotonin toxicity syndrome' }
    ],
    rescueProtocols: [
      {
        trigger: 'Sustained panic or extreme psychological terror > 20 mins resisting grounding',
        step1: 'Verbal de-escalation: low resonant voice, anchor to breath, remove eye-shades, bilateral tactile tap',
        step2: 'Offer calming sublingual herbal or chamomile tincture. Facilitator 2 provides gentle peripheral holding.',
        rescueMedication: 'Sublingual Lorazepam 1.0mg (Only if authorized by lead psychiatrist for autonomic emergency)'
      },
      {
        trigger: 'Hypertensive crisis (Systolic > 180 or Diastolic > 110 mmHg sustained > 15m)',
        step1: 'Position in Fowler posture, slow rhythmic 4-7-8 breathing coaching',
        step2: 'Lead physician alert. Prepare oral fast-acting antihypertensive if symptomatic headache/chest tightness occurs.',
        rescueMedication: 'Oral Captopril 25mg or Clonidine 0.1mg'
      }
    ]
  },
  {
    id: 'MDMA-PTSD-120',
    compound: 'MDMA',
    title: 'MDMA-Assisted Psychotherapy Protocol (Severe & Chronic PTSD)',
    version: 'v5.1.0 (Phase III Multicenter Standards)',
    indication: 'Chronic Severe Treatment-Resistant Post-Traumatic Stress Disorder',
    evidenceTier: 'Phase III Multicenter RCT',
    dosingSchedule: {
      macroDoseMg: 120,
      boosterDoseMg: 60,
      boosterWindowMin: 90,
      administrationRoute: 'Oral Capsule',
    },
    timelinePhases: [
      {
        name: 'Phase 0: Alliance Ingestion & Setting',
        startMin: 0,
        endMin: 45,
        targetState: 'Fear-extinction readiness, therapeutic alliance deepening',
        facilitatorActions: ['Administer 120mg GMP MDMA', 'Review boundaries, safety signals, and non-verbal touch code', 'Co-therapist dual witness logging'],
        musicEnergyLevel: 'Grounding / Silence',
      },
      {
        name: 'Phase 1: Ventral Vagal Opening & Fear Extinction',
        startMin: 45,
        endMin: 120,
        targetState: 'Downregulation of amygdala hyper-reactivity, oxytocinergic prosocial surge',
        facilitatorActions: ['Allow patient to access traumatic biographical memories without hyper-arousal', 'Administer optional 60mg supplemental booster at min 90 if indicated', 'Track sympathetic stability'],
        musicEnergyLevel: 'Gentle Ascent',
      },
      {
        name: 'Phase 2: Somatic Unwinding & Narrative Re-consolidation',
        startMin: 120,
        endMin: 270,
        targetState: 'Somatic trauma release, deep self-compassion, somatic crying/tremoring',
        facilitatorActions: ['Support natural spontaneous somatic unwinding', 'Validate emotional expressions without cognitive interruption', 'Track vital stability every 60 min'],
        musicEnergyLevel: 'Oceanic Transcendence',
      },
      {
        name: 'Phase 3: Integration Landing & Closing Protocol',
        startMin: 270,
        endMin: 420,
        targetState: 'Grounded empowerment, somatic re-organization, post-traumatic growth priming',
        facilitatorActions: ['Co-therapist guided reflection', 'Assess autonomic and psychological stability before release', 'Schedule Day 1 integration call'],
        musicEnergyLevel: 'Luminous Integration',
      }
    ],
    contraindications: [
      { category: 'Absolute', rule: 'Aortic aneurysm, uncontrolled cardiovascular disease, or history of cerebral hemorrhage', mechanism: 'MDMA transiently raises heart rate and mean arterial pressure' },
      { category: 'Absolute', rule: 'Concurrent MAOI (Monoamine Oxidase Inhibitor) usage within 14 days', mechanism: 'Severe fatal Serotonin Syndrome risk' },
      { category: 'Relative', rule: 'Severe hepatic impairment (CYP2D6 poor metabolizers)', mechanism: 'Altered drug clearance and prolonged systemic exposure' }
    ],
    rescueProtocols: [
      {
        trigger: 'Hyperthermia (Core temp > 38.3°C / 101°F)',
        step1: 'Active cooling: cool towels to neck and wrists, electrolyte water replenishment',
        step2: 'Fans, room ambient temperature reduction to 19°C',
        rescueMedication: 'Acetaminophen 1000mg + IV Saline if core temp continues rising'
      }
    ]
  },
  {
    id: '5MEO-EXP-15',
    compound: '5-MeO-DMT',
    title: '5-MeO-DMT Rapid Ego-Dissolution Protocol (Specialized Treatment)',
    version: 'v2.1.0 (Synthetic Mephit / Clinical Research)',
    indication: 'Existential Despair, Rapid Neuroplastic Reset & Treatment-Resistant Depression',
    evidenceTier: 'Observational / Special Access',
    dosingSchedule: {
      macroDoseMg: 12,
      administrationRoute: 'Intramuscular',
    },
    timelinePhases: [
      {
        name: 'Phase 0: Rapid Onset & Void Entry',
        startMin: 0,
        endMin: 3,
        targetState: 'Complete non-dual awareness, instantaneous ego boundary dissolution',
        facilitatorActions: ['Position in reclined supine posture', 'Ensure physical airway safety and somatic cradle', 'Immediate silence'],
        musicEnergyLevel: 'Oceanic Transcendence',
      },
      {
        name: 'Phase 1: Pure Non-Dual Luminosity',
        startMin: 3,
        endMin: 15,
        targetState: 'Total transcendent unity, cessation of narrative ego structure',
        facilitatorActions: ['Maintain unconditional silent anchor', 'Monitor SpO2 and gentle airway position', 'Hold hands if patient seeks physical anchor'],
        musicEnergyLevel: 'Oceanic Transcendence',
      },
      {
        name: 'Phase 2: Return to Form & Somatic Anchoring',
        startMin: 15,
        endMin: 45,
        targetState: 'Rapid re-entry, profound awe, spontaneous tears of release',
        facilitatorActions: ['Provide warm blanket and soft eye contact', 'Re-orient with low gentle voice', 'Encourage deep diaphragmatic breathing'],
        musicEnergyLevel: 'Luminous Integration',
      }
    ],
    contraindications: [
      { category: 'Absolute', rule: 'History of unmanaged cardiac arrhythmias or severe structural heart disease', mechanism: 'Rapid autonomic surge and vagal tone fluctuations' },
      { category: 'Absolute', rule: 'Concomitant MAO-A inhibitors or Ayahuasca vine', mechanism: 'High lethality risk due to MAO-A inhibition interaction' }
    ],
    rescueProtocols: [
      {
        trigger: 'Severe respiratory depression or airway obstruction',
        step1: 'Head tilt-chin lift, continuous pulse oximetry, tactile stimulation',
        step2: 'Supplemental O2 via nasal cannula (2-4 L/min)',
        rescueMedication: 'Medical resuscitation team standby'
      }
    ]
  },
  {
    id: 'IBOG-NEURO-RESET',
    compound: 'Ibogaine',
    title: 'Ibogaine Neuro-Regenerative Opioid Interruption Protocol',
    version: 'v3.0.0 (Cardiac Monitored Clinical Sanctuary)',
    indication: 'Opioid Use Disorder, Severe Neuroadaptation, Chronic Addiction',
    evidenceTier: 'Observational / Special Access',
    dosingSchedule: {
      macroDoseMg: 15, // mg/kg
      administrationRoute: 'Oral Capsule',
    },
    timelinePhases: [
      {
        name: 'Phase 0: Test Dose & Cardiac Telemetry Sync',
        startMin: 0,
        endMin: 120,
        targetState: 'QTc interval stability verification, test tolerance',
        facilitatorActions: ['Continuous 12-lead telemetry monitoring', 'Electrolyte serum status confirmation (Mg2+ / K+)', 'Confirm zero opioid metabolites'],
        musicEnergyLevel: 'Grounding / Silence',
      },
      {
        name: 'Phase 1: The Oneiric Dream State & Biographical Review',
        startMin: 120,
        endMin: 720,
        targetState: 'Lucid dream-like state, neuro-receptor resetting, biographical cinematic processing',
        facilitatorActions: ['Absolute darkness and acoustic stillness (ataxia mitigation)', 'Continuous QTc monitoring every 30m', 'Hydration via IV if nausea occurs'],
        musicEnergyLevel: 'Grounding / Silence',
      },
      {
        name: 'Phase 2: Cognitive Evaluation & GDNF Neurogenesis Surge',
        startMin: 720,
        endMin: 1440,
        targetState: 'Craving eradication, neurotrophin surge (GDNF/BDNF), deep reflection',
        facilitatorActions: ['Transition out of darkness', 'Support gentle movement', 'Initiate somatic nutrition protocol'],
        musicEnergyLevel: 'Luminous Integration',
      }
    ],
    contraindications: [
      { category: 'Absolute', rule: 'Baseline QTc interval > 440ms (males) or > 460ms (females)', mechanism: 'High risk of Torsades de Pointes fatal ventricular tachycardia' },
      { category: 'Absolute', rule: 'Hypokalemia or Hypomagnesemia', mechanism: 'Exacerbates hERG channel blockage and electrical instability' }
    ],
    rescueProtocols: [
      {
        trigger: 'QTc prolongation > 500ms during session',
        step1: 'Immediate IV Magnesium Sulfate 2g infusion over 15 mins',
        step2: 'Lead cardiologist bedside consultation',
        rescueMedication: 'IV Magnesium Sulfate + Defibrillator on standby'
      }
    ]
  },
  {
    id: 'KET-NEURO-IM',
    compound: 'Ketamine',
    title: 'Ketamine Sub-Dissociative Neuroplastic Protocol',
    version: 'v3.5.0 (Clinical Standard)',
    indication: 'Acute Suicidal Ideation & Severe Treatment-Resistant Depression',
    evidenceTier: 'Phase III Multicenter RCT',
    dosingSchedule: {
      macroDoseMg: 0.75, // mg/kg IM
      administrationRoute: 'Intramuscular',
    },
    timelinePhases: [
      {
        name: 'Phase 0: Dissociative Induction',
        startMin: 0,
        endMin: 10,
        targetState: 'NMDA receptor antagonism, sensory decoupling',
        facilitatorActions: ['Administer IM in deltoid', 'Place eyeshades and curated soundscape', 'Monitor blood pressure'],
        musicEnergyLevel: 'Gentle Ascent',
      },
      {
        name: 'Phase 1: Trans-Somatic Dissociation',
        startMin: 10,
        endMin: 50,
        targetState: 'Default Mode Network decoupling, symbolic dreamscapes',
        facilitatorActions: ['Silent holding space', 'Track SpO2 and autonomic ease', 'No unnecessary verbal interruption'],
        musicEnergyLevel: 'Oceanic Transcendence',
      },
      {
        name: 'Phase 2: Rapid Re-association & Neuroplastic Window',
        startMin: 50,
        endMin: 90,
        targetState: 'Synaptic plasticity window opening (mTOR activation)',
        facilitatorActions: ['Guide gentle embodiment journaling', 'Identify new cognitive frameworks', 'Schedule 48-hour neuroplastic integration'],
        musicEnergyLevel: 'Luminous Integration',
      }
    ],
    contraindications: [
      { category: 'Absolute', rule: 'Severe uncontrolled hypertension or recent stroke', mechanism: 'Transient elevation of central arterial blood pressure' }
    ],
    rescueProtocols: [
      {
        trigger: 'Excessive nausea or vestibular disorientation',
        step1: 'Keep patient still in semi-fowler, cool forehead compress',
        step2: 'Offer ginger chew or acupressure P6 point',
        rescueMedication: 'Ondansetron 4mg ODT (oral disintegrating tablet)'
      }
    ]
  }
];

export const INITIAL_PATIENTS: PatientRecord[] = [
  {
    id: 'PT-9941-AURORA',
    pseudonym: 'Aurora (AE-9941)',
    zkIdentityHash: '0x7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069',
    age: 38,
    indication: 'Severe Treatment-Resistant Major Depressive Disorder (Failed 4 Pharmacotherapies)',
    assignedProtocolId: 'PSIL-TRD-25',
    status: 'Active-Journey',
    prepSessionsCompleted: 3,
    prepSessionsTarget: 3,
    integrationSessionsCompleted: 0,
    integrationSessionsTarget: 4,
    jurisdiction: 'OR-M109',
    dataSovereignty: {
      encryptedKeyHolder: 'Patient Self-Custody',
      researchContributionOptIn: true,
      differentialPrivacyEpsilon: 0.25,
      rightToBeForgottenRequested: false,
      auditLogCount: 24,
    },
    contraindicationsChecked: true,
    biometricBaseline: {
      restingHR: 68,
      baselineHRV: 58,
      systolicBP: 118,
      diastolicBP: 76,
      qtcIntervalMs: 395,
    },
    intention: 'To surrender the heavy armor of past grief and remember the fundamental innocence of my being.',
    somaticAnchors: ['Hand placed over sternum / heart center', 'Deep exhale with audible hum', 'Touch of cedar wood talisman'],
    meq30Score: undefined,
    phq9Baseline: 22, // Severe
    phq9Current: 19,
    journeyDate: '2026-09-01 (Active Now)',
    coTherapists: ['Dr. Elena Vance, PsyD', 'Marcus Thorne, LPC (Co-Facilitator)'],
    mbcSurveys: [
      {
        surveyType: 'PHQ-9',
        title: 'Patient Health Questionnaire-9 (Depression Severity)',
        timepoint: 'Baseline (Pre)',
        score: 22,
        maxScore: 27,
        severityLabel: 'Severe Major Depression',
        completionDate: '2026-08-28',
        flaggedAlert: true,
        alertReason: 'Score >= 20 requires mandatory co-therapist dual monitoring protocol',
        itemScores: [
          { question: 'Little interest or pleasure in doing things', score: 3 },
          { question: 'Feeling down, depressed, or hopeless', score: 3 },
          { question: 'Trouble falling or staying asleep', score: 2 },
          { question: 'Feeling tired or having little energy', score: 3 },
          { question: 'Poor appetite or overeating', score: 2 },
          { question: 'Feeling bad about yourself or failure', score: 3 },
          { question: 'Trouble concentrating on things', score: 3 },
          { question: 'Moving or speaking slowly / fidgety', score: 2 },
          { question: 'Thoughts that you would be better off dead', score: 1 }
        ]
      },
      {
        surveyType: 'GAD-7',
        title: 'Generalized Anxiety Disorder-7',
        timepoint: 'Baseline (Pre)',
        score: 16,
        maxScore: 21,
        severityLabel: 'Severe Anxiety',
        completionDate: '2026-08-28',
        flaggedAlert: false,
        itemScores: [
          { question: 'Feeling nervous, anxious, or on edge', score: 3 },
          { question: 'Not being able to stop or control worrying', score: 3 },
          { question: 'Worrying too much about different things', score: 2 },
          { question: 'Trouble relaxing', score: 3 },
          { question: 'Being so restless that it is hard to sit still', score: 2 },
          { question: 'Becoming easily annoyed or irritable', score: 2 },
          { question: 'Feeling afraid as if something awful might happen', score: 1 }
        ]
      },
      {
        surveyType: 'Altered-States-Readiness',
        title: 'Altered States Psychological Safety & Readiness Battery',
        timepoint: 'Baseline (Pre)',
        score: 92,
        maxScore: 100,
        severityLabel: 'Optimal Therapeutic Readiness (High Psychological Surrender Capacity)',
        completionDate: '2026-08-30',
        flaggedAlert: false,
        itemScores: [
          { question: 'Willingness to experience challenging emotional material', score: 5 },
          { question: 'Trust in clinical facilitators and sanctuary container', score: 5 },
          { question: 'Clarity of therapeutic intention and somatic grounding', score: 5 }
        ]
      }
    ],
    billingProfile: {
      encounterId: 'ENC-2026-0901-AURORA',
      primaryQHP: {
        name: 'Dr. Elena Vance, PsyD (Clinical Lead)',
        npi: '1982736450',
        code: '0820T',
        hoursLogged: 6,
        unitRate: 225,
        totalBilled: 1350
      },
      secondaryQHP: {
        name: 'Marcus Thorne, LPC (Co-Therapist)',
        npi: '1475829103',
        code: '+0821T',
        hoursLogged: 6,
        unitRate: 175,
        totalBilled: 1050
      },
      clinicalStaff: {
        name: 'Sanctuary RN Escort',
        code: '+0822T',
        hoursLogged: 2,
        unitRate: 95,
        totalBilled: 190
      },
      hcpcsCodes: ['G2082 (Psilocybin Macro Dosing & 6-Hour Continuous Monitoring)'],
      packageSubscription: {
        packageName: 'Sovereign Neuro-Regeneration Protocol (1 Intake + 3 Prep + 2 Dosing + 4 Integration)',
        totalCost: 3800,
        feeSplit: {
          leadQHPPercent: 55,
          coTherapistPercent: 30,
          sanctuaryFacilityPercent: 15
        }
      },
      superbillGenerated: true,
      superbillId: 'SB-2026-9941-OR',
      icd10Codes: ['F33.2 Major Depressive Disorder, Recurrent, Severe Without Psychotic Features', 'Z71.89 Other Specified Counseling']
    },
    part2Consents: INITIAL_PART2_CONSENTS
  },
  {
    id: 'PT-8812-ORION',
    pseudonym: 'Orion (AE-8812)',
    zkIdentityHash: '0x3a4b9c81e9f0293847561029384756abcdef9876543210fedcba0123456789ab',
    age: 44,
    indication: 'Combat-Related Chronic Complex PTSD (12 Years Treatment-Resistant)',
    assignedProtocolId: 'MDMA-PTSD-120',
    status: 'Integration',
    prepSessionsCompleted: 3,
    prepSessionsTarget: 3,
    integrationSessionsCompleted: 2,
    integrationSessionsTarget: 4,
    jurisdiction: 'FDA-REMS-MDMA',
    dataSovereignty: {
      encryptedKeyHolder: 'Dual-Key Proxy',
      researchContributionOptIn: true,
      differentialPrivacyEpsilon: 0.1,
      rightToBeForgottenRequested: false,
      auditLogCount: 42,
    },
    contraindicationsChecked: true,
    biometricBaseline: {
      restingHR: 74,
      baselineHRV: 42,
      systolicBP: 124,
      diastolicBP: 80,
      qtcIntervalMs: 410,
    },
    intention: 'To safely look upon the memory of Fallujah without burning alive, and reclaim safety in my own body.',
    somaticAnchors: ['Grounding feet flat on wool rug', 'Holding heavy lap blanket', 'Breath counting 1-4'],
    meq30Score: 88,
    phq9Baseline: 24,
    phq9Current: 6, // In Remission
    caps5Baseline: 68, // Severe PTSD
    caps5Current: 14, // Clinical Remission threshold <20
    journeyDate: '2026-08-18',
    coTherapists: ['Dr. Julian Mercer, MD', 'Sarah Chen, LCSW'],
    mbcSurveys: [
      {
        surveyType: 'PCL-5',
        title: 'PTSD Checklist for DSM-5 (PCL-5)',
        timepoint: 'Baseline (Pre)',
        score: 68,
        maxScore: 80,
        severityLabel: 'Severe Chronic PTSD',
        completionDate: '2026-08-10',
        flaggedAlert: true,
        alertReason: 'PCL-5 > 50 indicates acute trauma re-trigger sensitivity',
        itemScores: []
      },
      {
        surveyType: 'PCL-5',
        title: 'PTSD Checklist for DSM-5 (PCL-5)',
        timepoint: '7-Day Post',
        score: 22,
        maxScore: 80,
        severityLabel: 'Mild Residual Symptoms',
        completionDate: '2026-08-25',
        flaggedAlert: false,
        itemScores: []
      },
      {
        surveyType: 'PCL-5',
        title: 'PTSD Checklist for DSM-5 (PCL-5)',
        timepoint: '30-Day Post',
        score: 14,
        maxScore: 80,
        severityLabel: 'Complete Clinical Remission (Score < 20)',
        completionDate: '2026-09-01',
        flaggedAlert: false,
        itemScores: []
      },
      {
        surveyType: 'MEQ-30',
        title: 'Mystical Experience Questionnaire-30',
        timepoint: '24h Post-Dose',
        score: 88,
        maxScore: 100,
        severityLabel: 'Complete Mystical Experience Confirmed (>60 Criteria Met)',
        completionDate: '2026-08-19',
        flaggedAlert: false,
        itemScores: []
      }
    ],
    billingProfile: {
      encounterId: 'ENC-2026-0818-ORION',
      primaryQHP: {
        name: 'Dr. Julian Mercer, MD',
        npi: '1293847560',
        code: '0820T',
        hoursLogged: 8,
        unitRate: 225,
        totalBilled: 1800
      },
      secondaryQHP: {
        name: 'Sarah Chen, LCSW',
        npi: '1839201928',
        code: '+0821T',
        hoursLogged: 8,
        unitRate: 175,
        totalBilled: 1400
      },
      hcpcsCodes: ['G2083 (MDMA Assisted Psychotherapy 8-Hour Protocol)'],
      packageSubscription: {
        packageName: 'Complex Trauma Neuro-Regeneration Series',
        totalCost: 4200,
        feeSplit: {
          leadQHPPercent: 55,
          coTherapistPercent: 30,
          sanctuaryFacilityPercent: 15
        }
      },
      superbillGenerated: true,
      superbillId: 'SB-2026-8812-REMS',
      icd10Codes: ['F43.10 Post-Traumatic Stress Disorder, Chronic', 'F33.1 Major Depressive Disorder']
    },
    part2Consents: INITIAL_PART2_CONSENTS
  },
  {
    id: 'PT-7703-LYRA',
    pseudonym: 'Lyra (AE-7703)',
    zkIdentityHash: '0x992211aabbccddeeff00112233445566778899aabbccddeeff00112233445566',
    age: 52,
    indication: 'End-of-Life Existential Distress (Ovarian Carcinoma Stage IV)',
    assignedProtocolId: 'PSIL-TRD-25',
    status: 'Long-Term-Flourishing',
    prepSessionsCompleted: 3,
    prepSessionsTarget: 3,
    integrationSessionsCompleted: 4,
    integrationSessionsTarget: 4,
    jurisdiction: 'CO-PROP122',
    dataSovereignty: {
      encryptedKeyHolder: 'Patient Self-Custody',
      researchContributionOptIn: true,
      differentialPrivacyEpsilon: 0.5,
      rightToBeForgottenRequested: false,
      auditLogCount: 56,
    },
    contraindicationsChecked: true,
    biometricBaseline: {
      restingHR: 72,
      baselineHRV: 50,
      systolicBP: 120,
      diastolicBP: 78,
      qtcIntervalMs: 402,
    },
    intention: 'To touch the timeless space beyond illness and make peace with my family and my departure.',
    somaticAnchors: ['Holding lavender stone', 'Breathe into spine'],
    meq30Score: 96,
    phq9Baseline: 21,
    phq9Current: 4,
    journeyDate: '2026-06-12',
    coTherapists: ['Dr. Maya Lin, Palliative MD', 'David Solis, MDiv (Spiritual Care)'],
    mbcSurveys: [
      {
        surveyType: 'PHQ-9',
        title: 'Patient Health Questionnaire-9',
        timepoint: '90-Day Post',
        score: 4,
        maxScore: 27,
        severityLabel: 'Normal / Minimal Distress (Long-Term Remission)',
        completionDate: '2026-08-30',
        flaggedAlert: false,
        itemScores: []
      }
    ]
  },
  {
    id: 'PT-6632-SOL',
    pseudonym: 'Sol (AE-6632)',
    zkIdentityHash: '0xfe01ab34cd56ef78901234567890abcdef1234567890abcdef1234567890abcd',
    age: 29,
    indication: 'Severe Generalized Anxiety & Obsessive Rumination',
    assignedProtocolId: 'KET-NEURO-IM',
    status: 'Prep-Phase',
    prepSessionsCompleted: 2,
    prepSessionsTarget: 3,
    integrationSessionsCompleted: 0,
    integrationSessionsTarget: 3,
    jurisdiction: 'OR-M109',
    dataSovereignty: {
      encryptedKeyHolder: 'Patient Self-Custody',
      researchContributionOptIn: false,
      differentialPrivacyEpsilon: 0.0,
      rightToBeForgottenRequested: false,
      auditLogCount: 11,
    },
    contraindicationsChecked: true,
    biometricBaseline: {
      restingHR: 82,
      baselineHRV: 36,
      systolicBP: 126,
      diastolicBP: 82,
      qtcIntervalMs: 388,
    },
    intention: 'To untangle my compulsive thought loops and experience silence in my mind.',
    somaticAnchors: ['Gentle jaw relaxation', 'Weighted eye pillow'],
    phq9Baseline: 18,
    phq9Current: 17,
    journeyDate: '2026-09-08 (Scheduled)',
    coTherapists: ['Maya Lin, MD', 'Marcus Thorne, LPC']
  }
];

export const INITIAL_INVENTORY: InventoryCompoundLot[] = [
  {
    lotNumber: 'GMP-PSI-2026-04A',
    compound: 'Synthetic Psilocybin (GMP API)',
    gmpManufacturer: 'Usona Institute / Cerilliant High-Purity Labs',
    batchPurityPercent: 99.82,
    totalQuantityMg: 5000,
    remainingQuantityMg: 3875,
    expiryDate: '2028-12-31',
    storageTempCelsius: -20.4,
    deaScheduleTier: 'Schedule I (Clinical Research Exemption #CR-882)',
    chainOfCustodyLedger: [
      {
        timestamp: '2026-08-15 09:14:00',
        actor: 'Dr. Julian Mercer (Vault Custodian)',
        action: 'Lot Ingestion & Analytical Certificate Verification',
        witnessName: 'Dr. Elena Vance',
        deltaMg: 5000,
      },
      {
        timestamp: '2026-08-18 08:30:12',
        actor: 'Dr. Julian Mercer',
        action: 'Dispensed 25mg for Patient AE-8812 Protocol',
        witnessName: 'Sarah Chen, LCSW',
        deltaMg: -25,
      },
      {
        timestamp: '2026-09-01 07:45:00',
        actor: 'Dr. Elena Vance',
        action: 'Dispensed 25mg for Patient AE-9941 (Aurora)',
        witnessName: 'Marcus Thorne, LPC',
        deltaMg: -25,
      }
    ]
  },
  {
    lotNumber: 'GMP-MDMA-2026-09C',
    compound: 'MDMA Hydrochloride (GMP Pharmaceutical Grade)',
    gmpManufacturer: 'Lycos Therapeutics / Dalton Pharma Services',
    batchPurityPercent: 99.91,
    totalQuantityMg: 10000,
    remainingQuantityMg: 8240,
    expiryDate: '2029-06-30',
    storageTempCelsius: 20.1,
    deaScheduleTier: 'Schedule I (FDA IND #134,882 Special Access)',
    chainOfCustodyLedger: [
      {
        timestamp: '2026-07-10 14:00:00',
        actor: 'Dr. Julian Mercer',
        action: 'Analytical Batch Registration & Vault Lock Ingestion',
        witnessName: 'Dr. Maya Lin',
        deltaMg: 10000,
      },
      {
        timestamp: '2026-08-18 08:15:00',
        actor: 'Dr. Julian Mercer',
        action: 'Dispensed 120mg Initial + 60mg Booster for AE-8812',
        witnessName: 'Sarah Chen, LCSW',
        deltaMg: -180,
      }
    ]
  },
  {
    lotNumber: 'SYN-5MEO-2026-01',
    compound: '5-MeO-DMT Freebase (Synthetically Pure)',
    gmpManufacturer: 'Beckley Psytech / Cayman Chemical Research',
    batchPurityPercent: 99.74,
    totalQuantityMg: 1200,
    remainingQuantityMg: 1140,
    expiryDate: '2027-11-30',
    storageTempCelsius: -80.0,
    deaScheduleTier: 'Special Access Protocol Tier',
    chainOfCustodyLedger: [
      {
        timestamp: '2026-06-01 11:20:00',
        actor: 'Dr. Elena Vance',
        action: 'Cryo-Vault Ingestion & Spectrometry Confirmation',
        witnessName: 'Dr. Julian Mercer',
        deltaMg: 1200,
      }
    ]
  }
];

export const RESEARCH_OUTCOMES: ResearchOutcomeMetric[] = [
  {
    condition: 'Treatment-Resistant Depression (Psilocybin 25mg)',
    sampleSize: 142,
    baselineScore: 22.4, // PHQ-9
    post1MonthScore: 6.8,
    post6MonthScore: 7.2,
    remissionRatePercent: 71.8,
    mysticalExperienceCorrelation: 0.84,
    neuroplasticityMarkerBDNFDelta: '+142% serum BDNF at 72h post-session'
  },
  {
    condition: 'Chronic Complex PTSD (MDMA 120mg+60mg)',
    sampleSize: 188,
    baselineScore: 67.2, // CAPS-5
    post1MonthScore: 18.4,
    post6MonthScore: 15.9,
    remissionRatePercent: 78.4,
    mysticalExperienceCorrelation: 0.76,
    neuroplasticityMarkerBDNFDelta: '+94% fear-extinction retention index'
  },
  {
    condition: 'End-of-Life Existential Anxiety (Psilocybin 25mg)',
    sampleSize: 64,
    baselineScore: 4.8, // 1-5 scale death anxiety
    post1MonthScore: 1.6,
    post6MonthScore: 1.4,
    remissionRatePercent: 86.2,
    mysticalExperienceCorrelation: 0.91,
    neuroplasticityMarkerBDNFDelta: 'Profound death-acceptance sustained >12mo'
  },
  {
    condition: 'Severe Opioid Dependence (Ibogaine Protocol)',
    sampleSize: 52,
    baselineScore: 32.5, // SOWS withdrawal score
    post1MonthScore: 2.1,
    post6MonthScore: 4.3,
    remissionRatePercent: 68.0,
    mysticalExperienceCorrelation: 0.88,
    neuroplasticityMarkerBDNFDelta: 'Immediate dopamine D2 receptor resensitization'
  }
];
