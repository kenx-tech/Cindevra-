import React, { useState } from 'react';
import { 
  Workflow, 
  UserCheck, 
  Calendar, 
  Boxes, 
  Network, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Clock, 
  Thermometer, 
  ShieldCheck, 
  UserPlus, 
  FileText,
  Volume2,
  Lock,
  ArrowRight,
  TrendingDown,
  DollarSign,
  ClipboardCheck,
  Receipt,
  Download,
  Printer,
  Sparkles,
  Layers,
  Scale,
  Activity,
  Flame,
  Key
} from 'lucide-react';
import { useAether } from '../../context/AetherContext';
import { PatientRecord, MBCSurveyResponse } from '../../types/aether';

export const BranchLayer: React.FC = () => {
  const { 
    patients, 
    selectedPatient, 
    setSelectedPatient, 
    inventory, 
    dispenseCompound, 
    deaVaultRecords,
    reconcileVaultLot,
    logVaultWaste,
    addPatient,
    addMBCResponse,
    generateSuperbill,
    remsAttestationSubmitted,
    submitREMSAttestation,
    setActiveLayer 
  } = useAether();

  const [activeTab, setActiveTab] = useState<'orchestration' | 'workbench' | 'inventory' | 'mbc' | 'billing' | 'scheduling' | 'network'>('orchestration');
  
  // Dispensing Form Modal State
  const [dispensingLot, setDispensingLot] = useState<string>(inventory[0]?.lotNumber || '');
  const [dispenseMg, setDispenseMg] = useState<number>(25);
  const [witnessName, setWitnessName] = useState<string>('Sarah Chen, LCSW');
  const [dispenseSuccess, setDispenseSuccess] = useState<boolean | null>(null);

  // Reconciliation Modal State
  const [reconcileLot, setReconcileLot] = useState<string>(deaVaultRecords[0]?.lotNumber || '');
  const [physicalCountMg, setPhysicalCountMg] = useState<number>(3875);
  const [witnessQHP2, setWitnessQHP2] = useState<string>('Dr. Elena Vance, PsyD');
  const [reconcileSuccess, setReconcileSuccess] = useState<boolean>(false);

  // Waste Log Modal State
  const [showWasteModal, setShowWasteModal] = useState<boolean>(false);
  const [wasteLot, setWasteLot] = useState<string>(deaVaultRecords[0]?.lotNumber || '');
  const [wasteMg, setWasteMg] = useState<number>(2);
  const [wasteReason, setWasteReason] = useState<string>('Analytical scale calibration residue');
  const [wasteWitness1, setWasteWitness1] = useState<string>('Dr. Julian Mercer, MD');
  const [wasteWitness2, setWasteWitness2] = useState<string>('Sarah Chen, LCSW');

  // New MBC Survey Modal State
  const [showMBCModal, setShowMBCModal] = useState<boolean>(false);
  const [mbcSurveyType, setMbcSurveyType] = useState<'PHQ-9' | 'GAD-7' | 'PCL-5' | 'MEQ-30'>('PHQ-9');
  const [mbcTimepoint, setMbcTimepoint] = useState<'Baseline (Pre)' | '24h Post-Dose' | '7-Day Post' | '30-Day Post' | '90-Day Post'>('7-Day Post');
  const [mbcScore, setMbcScore] = useState<number>(6);

  // REMS Attestation Form
  const [qhp1Name, setQhp1Name] = useState<string>('Dr. Elena Vance, PsyD (Lead QHP #LF-9921)');
  const [qhp2Name, setQhp2Name] = useState<string>('Marcus Thorne, LPC (Secondary QHP #LF-4412)');
  const [remsCertified, setRemsCertified] = useState<boolean>(remsAttestationSubmitted);

  // New Patient Form
  const [showNewPatientModal, setShowNewPatientModal] = useState(false);
  const [newPseudonym, setNewPseudonym] = useState('');
  const [newIndication, setNewIndication] = useState('Treatment-Resistant Major Depression');
  const [newProtocol, setNewProtocol] = useState('PSIL-TRD-25');
  const [newAge, setNewAge] = useState(35);

  const stages: PatientRecord['status'][] = [
    'Referral', 
    'ZK-Screening', 
    'Prep-Phase', 
    'Active-Journey', 
    'Integration', 
    'Long-Term-Flourishing'
  ];

  const currentPatient = selectedPatient || patients[0];

  const handleDispense = (e: React.FormEvent) => {
    e.preventDefault();
    const success = dispenseCompound(
      dispensingLot, 
      dispenseMg, 
      'Dr. Julian Mercer (Lead Custodian)', 
      witnessName, 
      currentPatient?.pseudonym || 'AE-9941 (Aurora)'
    );
    setDispenseSuccess(success);
    setTimeout(() => setDispenseSuccess(null), 3000);
  };

  const handleReconcile = (e: React.FormEvent) => {
    e.preventDefault();
    reconcileVaultLot(reconcileLot, physicalCountMg, witnessQHP2);
    setReconcileSuccess(true);
    setTimeout(() => setReconcileSuccess(false), 3000);
  };

  const handleLogWaste = (e: React.FormEvent) => {
    e.preventDefault();
    logVaultWaste(wasteLot, wasteMg, wasteReason, wasteWitness1, wasteWitness2);
    setShowWasteModal(false);
  };

  const handleCreatePatient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPseudonym.trim()) return;

    addPatient({
      pseudonym: newPseudonym,
      age: newAge,
      indication: newIndication,
      assignedProtocolId: newProtocol,
      status: 'Referral',
      prepSessionsCompleted: 0,
      prepSessionsTarget: 3,
      integrationSessionsCompleted: 0,
      integrationSessionsTarget: 4,
      jurisdiction: 'OR-M109',
      dataSovereignty: {
        encryptedKeyHolder: 'Patient Self-Custody',
        researchContributionOptIn: true,
        differentialPrivacyEpsilon: 0.25,
        rightToBeForgottenRequested: false,
        auditLogCount: 1,
      },
      contraindicationsChecked: false,
      biometricBaseline: {
        restingHR: 72,
        baselineHRV: 48,
        systolicBP: 120,
        diastolicBP: 80,
        qtcIntervalMs: 400,
      },
      intention: 'To discover peace and heal historical emotional burdens in a safe sovereign space.',
      somaticAnchors: ['Grounding breath in belly', 'Hand on chest'],
      phq9Baseline: 20,
      phq9Current: 20,
      journeyDate: 'Scheduling',
      coTherapists: ['Dr. Elena Vance, PsyD', 'Sarah Chen, LCSW']
    });

    setShowNewPatientModal(false);
    setNewPseudonym('');
  };

  const handleAddMBCSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPatient) return;
    
    let max = 27;
    let label = 'Mild Symptoms';
    let flag = false;
    let alertReason = undefined;

    if (mbcSurveyType === 'PHQ-9') {
      max = 27;
      if (mbcScore >= 20) { label = 'Severe Major Depression'; flag = true; alertReason = 'Score >= 20 requires mandatory co-therapist dual monitoring'; }
      else if (mbcScore >= 15) label = 'Moderately Severe Depression';
      else if (mbcScore >= 10) label = 'Moderate Depression';
      else if (mbcScore >= 5) label = 'Mild Depression';
      else label = 'Minimal / Clinical Remission';
    } else if (mbcSurveyType === 'GAD-7') {
      max = 21;
      if (mbcScore >= 15) { label = 'Severe Anxiety'; flag = true; alertReason = 'Severe anxiety detected'; }
      else if (mbcScore >= 10) label = 'Moderate Anxiety';
      else label = 'Mild / Remission';
    } else if (mbcSurveyType === 'PCL-5') {
      max = 80;
      if (mbcScore >= 50) { label = 'Severe PTSD'; flag = true; alertReason = 'PCL-5 > 50 triggers acute trauma stabilization protocol'; }
      else if (mbcScore < 20) label = 'Complete Clinical Remission (Score < 20)';
      else label = 'Mild / Moderate Residual Symptoms';
    } else if (mbcSurveyType === 'MEQ-30') {
      max = 100;
      if (mbcScore >= 60) label = 'Complete Mystical Experience Confirmed (>60)';
      else label = 'Moderate Peak Experience';
    }

    const response: MBCSurveyResponse = {
      surveyType: mbcSurveyType,
      title: `${mbcSurveyType} Assessment Battery`,
      timepoint: mbcTimepoint,
      score: mbcScore,
      maxScore: max,
      severityLabel: label,
      completionDate: new Date().toISOString().slice(0, 10),
      flaggedAlert: flag,
      alertReason: alertReason,
      itemScores: []
    };

    addMBCResponse(currentPatient.id, response);
    setShowMBCModal(false);
  };

  const handleREMSAttest = (e: React.FormEvent) => {
    e.preventDefault();
    submitREMSAttestation(currentPatient.pseudonym, qhp1Name, qhp2Name);
    setRemsCertified(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Branch Layer Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#141B16] border border-[#93C5B5]/30 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#93C5B5] font-mono text-xs">
            <Workflow className="w-4 h-4" />
            <span>3.0 Branch Layer — Clinical Operations & Enterprise Network</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#E8EDEA] tracking-tight">
            Sanctuary Operations & Clinical Workbench
          </h1>
          <p className="text-xs sm:text-sm text-[#E8EDEA]/70 max-w-2xl font-light">
            Measurement-Based Care (MBC) longitudinal batteries, CPT Category III superbill automation, DEA perpetual vault reconciliation, and dual-QHP REMS protocol sign-offs.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-[#0D120E] p-1.5 rounded-xl border border-[#E8EDEA]/10 self-start md:self-auto overflow-x-auto max-w-full">
          <button
            id="branch-tab-orchestration"
            onClick={() => setActiveTab('orchestration')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'orchestration'
                ? 'bg-[#15221F] border border-[#93C5B5]/40 text-[#93C5B5] shadow'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
            }`}
          >
            3.1 Journey Pipeline
          </button>
          <button
            id="branch-tab-workbench"
            onClick={() => setActiveTab('workbench')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'workbench'
                ? 'bg-[#15221F] border border-[#93C5B5]/40 text-[#93C5B5] shadow'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
            }`}
          >
            3.2 Facilitator Workbench
          </button>
          <button
            id="branch-tab-mbc"
            onClick={() => setActiveTab('mbc')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'mbc'
                ? 'bg-[#15221F] border border-[#93C5B5]/40 text-[#93C5B5] shadow'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
            }`}
          >
            3.3 Measurement-Based Care (MBC)
          </button>
          <button
            id="branch-tab-inventory"
            onClick={() => setActiveTab('inventory')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'inventory'
                ? 'bg-[#15221F] border border-[#93C5B5]/40 text-[#93C5B5] shadow'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
            }`}
          >
            3.4 DEA Perpetual Vault
          </button>
          <button
            id="branch-tab-billing"
            onClick={() => setActiveTab('billing')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'billing'
                ? 'bg-[#15221F] border border-[#93C5B5]/40 text-[#93C5B5] shadow'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
            }`}
          >
            3.5 CPT Superbill Engine
          </button>
          <button
            id="branch-tab-scheduling"
            onClick={() => setActiveTab('scheduling')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'scheduling'
                ? 'bg-[#15221F] border border-[#93C5B5]/40 text-[#93C5B5] shadow'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
            }`}
          >
            3.6 Sanctuary Rooms
          </button>
          <button
            id="branch-tab-network"
            onClick={() => setActiveTab('network')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'network'
                ? 'bg-[#15221F] border border-[#93C5B5]/40 text-[#93C5B5] shadow'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
            }`}
          >
            3.7 Federated Nodes
          </button>
        </div>
      </div>

      {/* TAB 3.1: Patient Journey Orchestration Pipeline */}
      {activeTab === 'orchestration' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#E8EDEA]">6-Stage Sovereign Journey Pipeline</h2>
              <p className="text-xs text-[#E8EDEA]/60 font-sans">
                Real-time cohort tracking across intake, Zero-Knowledge screening, preparation, active macro-dosing, and neuroplastic integration.
              </p>
            </div>
            
            <button
              id="branch-btn-new-patient"
              onClick={() => setShowNewPatientModal(true)}
              className="px-4 py-2 rounded-xl bg-[#93C5B5] hover:bg-[#a6d4c5] text-[#0A0D0B] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md self-start"
            >
              <UserPlus className="w-4 h-4" />
              <span>Intake New Participant</span>
            </button>
          </div>

          {/* Kanban / Pipeline Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
            {stages.map((stage) => {
              const cohort = patients.filter(p => p.status === stage);
              return (
                <div 
                  key={stage}
                  className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-3.5 flex flex-col justify-between min-h-[360px]"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-[#E8EDEA]/10 pb-2.5">
                      <span className="font-mono text-xs font-bold text-[#93C5B5] uppercase tracking-wider">
                        {stage.replace('-', ' ')}
                      </span>
                      <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-[#0D120E] text-[#E8EDEA]/80 border border-[#E8EDEA]/10">
                        {cohort.length}
                      </span>
                    </div>

                    <div className="space-y-2.5">
                      {cohort.map((p) => (
                        <div
                          key={p.id}
                          onClick={() => setSelectedPatient(p)}
                          className={`p-3 rounded-xl border text-left cursor-pointer transition-all ${
                            currentPatient?.id === p.id
                              ? 'bg-[#15221F] border-[#93C5B5] shadow-lg ring-1 ring-[#93C5B5]/30'
                              : 'bg-[#0D120E] border-[#E8EDEA]/10 hover:border-[#93C5B5]/40'
                          }`}
                        >
                          <div className="font-serif font-bold text-xs text-[#E8EDEA] flex items-center justify-between">
                            <span>{p.pseudonym}</span>
                            <span className="text-[9px] font-mono text-[#93C5B5]">{p.assignedProtocolId.slice(0, 4)}</span>
                          </div>
                          <div className="text-[11px] text-[#E8EDEA]/60 truncate font-sans mt-0.5">
                            {p.indication}
                          </div>

                          <div className="mt-2.5 pt-2 border-t border-[#E8EDEA]/5 flex items-center justify-between text-[10px] font-mono text-[#E8EDEA]/50">
                            <span>Prep: {p.prepSessionsCompleted}/{p.prepSessionsTarget}</span>
                            <span className={p.status === 'Active-Journey' ? 'text-[#A8C69F] font-bold animate-pulse' : ''}>
                              {p.status === 'Active-Journey' ? '● IN SANCTUARY' : `Integ: ${p.integrationSessionsCompleted}/${p.integrationSessionsTarget}`}
                            </span>
                          </div>

                          {p.mbcSurveys && p.mbcSurveys.length > 0 && (
                            <div className="mt-1.5 flex items-center gap-1 text-[9px] font-mono text-[#A8C69F]">
                              <CheckCircle2 className="w-3 h-3" />
                              <span>MBC Battery Active ({p.mbcSurveys.length})</span>
                            </div>
                          )}
                        </div>
                      ))}

                      {cohort.length === 0 && (
                        <div className="text-center py-8 text-[11px] text-[#E8EDEA]/40 font-mono">
                          No cohort in stage
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Selected Patient Overview Bar */}
          {currentPatient && (
            <div className="bg-[#141B16] border border-[#93C5B5]/30 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="text-xs font-mono text-[#93C5B5]">Selected Participant File</div>
                <div className="text-lg font-bold text-[#E8EDEA] flex items-center gap-2 font-serif">
                  <span>{currentPatient.pseudonym}</span>
                  <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-[#0D120E] text-[#93C5B5] border border-[#93C5B5]/30">
                    Status: {currentPatient.status}
                  </span>
                  <span className="text-xs font-mono font-normal px-2 py-0.5 rounded bg-[#0D120E] text-[#E8EDEA]/70 border border-[#E8EDEA]/10">
                    Protocol: {currentPatient.assignedProtocolId}
                  </span>
                </div>
                <p className="text-xs text-[#E8EDEA]/70 font-sans">
                  Intention: <em className="text-[#E8EDEA]/90">"{currentPatient.intention}"</em>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setActiveTab('mbc')}
                  className="px-3.5 py-2 rounded-xl bg-[#0D120E] hover:bg-[#15221F] border border-[#E8EDEA]/10 text-xs text-[#E8EDEA] font-medium transition-all"
                >
                  View MBC Psychometrics
                </button>
                <button
                  onClick={() => setActiveTab('billing')}
                  className="px-3.5 py-2 rounded-xl bg-[#0D120E] hover:bg-[#15221F] border border-[#E8EDEA]/10 text-xs text-[#E8EDEA] font-medium transition-all"
                >
                  View CPT Superbill
                </button>
                <button
                  onClick={() => setActiveLayer('live-journey')}
                  className="px-4 py-2 rounded-xl bg-[#A8C69F] hover:bg-[#b8d6af] text-[#0A0D0B] font-bold text-xs flex items-center gap-1.5 shadow-md"
                >
                  <span>Open Active Journey Monitor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

        </div>
      )}

      {/* TAB 3.2: Facilitator Workbench & REMS Sign-Off */}
      {activeTab === 'workbench' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* REMS Protocol Safe Delivery Attestation Card */}
            <div className="bg-[#141B16] border border-[#93C5B5]/40 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#93C5B5]/15 text-[#93C5B5] border border-[#93C5B5]/30">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#E8EDEA]">FDA REMS Safe Delivery Attestation</h3>
                  <p className="text-xs text-[#E8EDEA]/50 font-mono">Mandatory Dual-QHP Real-Time Sign-Off</p>
                </div>
              </div>

              <form onSubmit={handleREMSAttest} className="space-y-3.5 text-xs">
                <div className="p-3 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 space-y-1.5">
                  <div className="text-[#E8EDEA]/60 font-mono text-[11px]">Encounter Target</div>
                  <div className="font-bold text-[#E8EDEA]">{currentPatient.pseudonym} • {currentPatient.assignedProtocolId}</div>
                  <div className="text-[11px] text-[#A8C69F] font-mono">✓ 12-Hour Fasting Verified • Escort Onsite</div>
                </div>

                <div className="space-y-1">
                  <label className="text-[#E8EDEA]/60 font-mono">Lead Qualified Healthcare Professional (QHP 1)</label>
                  <input
                    type="text"
                    value={qhp1Name}
                    onChange={(e) => setQhp1Name(e.target.value)}
                    className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-xs text-[#E8EDEA] focus:outline-none focus:border-[#93C5B5]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#E8EDEA]/60 font-mono">Secondary Qualified Healthcare Professional (QHP 2)</label>
                  <input
                    type="text"
                    value={qhp2Name}
                    onChange={(e) => setQhp2Name(e.target.value)}
                    className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-xs text-[#E8EDEA] focus:outline-none focus:border-[#93C5B5]"
                    required
                  />
                </div>

                <div className="p-3 rounded-xl bg-[#1A261F] border border-[#A8C69F]/40 text-[#A8C69F] text-[11px] font-mono space-y-1">
                  <div className="font-bold">REMS Mandatory Pre-Conditions:</div>
                  <div>• Dual QHP present for full 6-8h active journey duration</div>
                  <div>• Resuscitation & rescue pharmacopeia confirmed bedside</div>
                  <div>• Real-time continuous autonomic telemetry verified</div>
                </div>

                {remsCertified ? (
                  <div className="p-3 rounded-xl bg-[#1A261F] border border-[#A8C69F]/60 text-[#A8C69F] text-xs font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A8C69F]" />
                    <span>REMS Attestation Cryptographically Certified & Sealed</span>
                  </div>
                ) : (
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-[#93C5B5] hover:bg-[#a6d4c5] text-[#0A0D0B] font-bold text-xs transition-all shadow-md"
                  >
                    Authorize & Sign REMS Protocol
                  </button>
                )}
              </form>
            </div>

            {/* Somatic Cue & Safe Touch Tracker */}
            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#A8C69F]/15 text-[#A8C69F] border border-[#A8C69F]/30">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#E8EDEA]">Somatic Touch & Consent Matrix</h3>
                  <p className="text-xs text-[#E8EDEA]/50 font-mono">Real-time Ethical Touch Verification</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[#E8EDEA]/80 font-sans">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10">
                  <span>Hand holding for grounding (Sternum/Shoulder)</span>
                  <span className="text-[#A8C69F] font-mono font-bold">Pre-Authorized</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10">
                  <span>Hand on shoulder / spinal postural support</span>
                  <span className="text-[#A8C69F] font-mono font-bold">Pre-Authorized</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10">
                  <span>Weighted blanket & lavender talisman anchor</span>
                  <span className="text-[#A8C69F] font-mono font-bold">Pre-Authorized</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10">
                  <span>Verbal permission prompt prior to physical touch</span>
                  <span className="text-[#93C5B5] font-mono">Mandatory Policy</span>
                </div>
              </div>

              <p className="text-[11px] text-[#E8EDEA]/60 leading-relaxed font-sans pt-2">
                All physical contacts are recorded with millisecond timestamps in the immutable journey ledger to guarantee absolute participant sovereignty and ethical safety.
              </p>
            </div>

            {/* Session Notes & Ambient AI Scribe Preview */}
            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#D4B8E5]/15 text-[#D4B8E5] border border-[#D4B8E5]/30">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#E8EDEA]">Ambient AI Scribe & Notes</h3>
                  <p className="text-xs text-[#E8EDEA]/50 font-mono">Acoustic Separation & SOAP Note</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-xs text-[#E8EDEA]/80 space-y-2 font-sans">
                <div className="flex items-center justify-between text-[10px] font-mono text-[#93C5B5]">
                  <span>ACOUSTIC FILTER: ACTIVE</span>
                  <span>CONFIDENCE: 98.6%</span>
                </div>
                <div className="text-[11px] text-[#E8EDEA]/90 leading-relaxed">
                  "Participant experiencing profound affective reconciliation with grief armor. Surrendered intellectual defense mechanisms at Min 75."
                </div>
                <div className="text-[10px] font-mono text-[#E8EDEA]/50">
                  Dual-QHP Attestation: Dr. Elena Vance, PsyD • Marcus Thorne, LPC
                </div>
              </div>

              <button
                onClick={() => setActiveLayer('live-journey')}
                className="w-full py-2.5 rounded-xl bg-[#0D120E] hover:bg-[#15221F] border border-[#93C5B5]/40 text-xs text-[#93C5B5] font-medium transition-all flex items-center justify-center gap-1.5"
              >
                <span>Launch Full Telemetry & Ambient Scribe Console</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3.3: Measurement-Based Care (MBC) Longitudinal Outcomes */}
      {activeTab === 'mbc' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#E8EDEA] flex items-center gap-2">
                <span>Measurement-Based Care (MBC) Longitudinal Outcomes</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1A261F] text-[#A8C69F] border border-[#A8C69F]/40">
                  Target: {currentPatient.pseudonym}
                </span>
              </h2>
              <p className="text-xs text-[#E8EDEA]/60 font-sans">
                Automated standardized psychometric batteries administered at Baseline, 24h Post-Dose, 7-Day, 30-Day, and 90-Day post-entheogen session.
              </p>
            </div>

            <button
              onClick={() => setShowMBCModal(true)}
              className="px-4 py-2 rounded-xl bg-[#93C5B5] hover:bg-[#a6d4c5] text-[#0A0D0B] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md self-start"
            >
              <Plus className="w-4 h-4" />
              <span>Log Survey Response</span>
            </button>
          </div>

          {/* Longitudinal Schedule Grid */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
            {[
              { timepoint: 'Baseline (Pre)', label: 'Intake Screening', color: '#93C5B5' },
              { timepoint: '24h Post-Dose', label: 'Acute Integration', color: '#D4B8E5' },
              { timepoint: '7-Day Post', label: 'Neuroplastic Window', color: '#A8C69F' },
              { timepoint: '30-Day Post', label: 'Sub-Acute Anchor', color: '#C8B195' },
              { timepoint: '90-Day Post', label: 'Long-Term Remission', color: '#A8C69F' }
            ].map((slot) => {
              const matchedSurveys = (currentPatient.mbcSurveys || []).filter(s => s.timepoint === slot.timepoint);
              return (
                <div key={slot.timepoint} className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-4 space-y-3">
                  <div className="border-b border-[#E8EDEA]/10 pb-2">
                    <div className="text-[11px] font-mono font-bold text-[#E8EDEA]">{slot.timepoint}</div>
                    <div className="text-[10px] font-sans text-[#E8EDEA]/50">{slot.label}</div>
                  </div>

                  {matchedSurveys.length > 0 ? (
                    <div className="space-y-2">
                      {matchedSurveys.map((survey, i) => (
                        <div key={i} className="p-2.5 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-xs space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-bold text-[#E8EDEA] font-mono">{survey.surveyType}</span>
                            <span className="font-mono text-[#A8C69F] font-bold">{survey.score} / {survey.maxScore}</span>
                          </div>
                          <div className="text-[10px] text-[#E8EDEA]/70">{survey.severityLabel}</div>
                          {survey.flaggedAlert && (
                            <div className="text-[9px] font-mono text-amber-400 bg-amber-950/40 p-1 rounded border border-amber-800">
                              ⚠ Alert: {survey.alertReason}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="py-6 text-center text-[10px] font-mono text-[#E8EDEA]/30">
                      Pending Schedule Trigger
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* MBC Aggregate Insight & Remission Indicators */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-3">
              <div className="text-xs font-mono text-[#93C5B5]">Depression Remission Index (PHQ-9)</div>
              <div className="text-3xl font-serif font-bold text-[#A8C69F] flex items-baseline gap-2">
                <span>{currentPatient.phq9Current}</span>
                <span className="text-xs font-mono text-[#E8EDEA]/50 font-normal">
                  from baseline {currentPatient.phq9Baseline} ({Math.round(((currentPatient.phq9Baseline - currentPatient.phq9Current) / currentPatient.phq9Baseline) * 100)}% reduction)
                </span>
              </div>
              <p className="text-xs text-[#E8EDEA]/70 font-sans leading-relaxed">
                Participant scores demonstrate substantial downward symptom trajectory following the macro-dose session.
              </p>
            </div>

            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-3">
              <div className="text-xs font-mono text-[#D4B8E5]">Mystical Experience Index (MEQ-30)</div>
              <div className="text-3xl font-serif font-bold text-[#D4B8E5] flex items-baseline gap-2">
                <span>{currentPatient.meq30Score || 88} / 100</span>
                <span className="text-xs font-mono text-[#A8C69F] font-normal">Complete Mystical State Met</span>
              </div>
              <p className="text-xs text-[#E8EDEA]/70 font-sans leading-relaxed">
                MEQ-30 criteria &gt;60 correlates strongly with 12-month persistent therapeutic remission in multicenter trials.
              </p>
            </div>

            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-3">
              <div className="text-xs font-mono text-[#C8B195]">Automated Survey Dispatch Engine</div>
              <div className="text-xs font-mono text-[#E8EDEA]/80 space-y-1">
                <div>• Day 7 Automated SMS/Email Link: <span className="text-[#A8C69F]">Armed</span></div>
                <div>• Day 30 Long-Term Checkpoint: <span className="text-[#A8C69F]">Scheduled</span></div>
                <div>• Day 90 Flourishing Assessment: <span className="text-[#A8C69F]">Scheduled</span></div>
              </div>
              <p className="text-[11px] text-[#E8EDEA]/50 font-sans">
                Zero-knowledge encrypted survey responses stream directly into patient self-custody vault.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3.4: DEA Perpetual Vault & Inventory Reconciliation */}
      {activeTab === 'inventory' && (
        <div className="space-y-6">
          
          {/* Top Vault Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-2xl bg-[#141B16] border border-[#93C5B5]/30 space-y-1">
              <div className="text-xs font-mono text-[#93C5B5]">Perpetual DEA Schedule Lots</div>
              <div className="text-2xl font-serif font-bold text-[#E8EDEA]">{deaVaultRecords.length} Active Lots</div>
              <div className="text-[10px] font-mono text-[#A8C69F]">Form 222 Certified</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#141B16] border border-[#A8C69F]/30 space-y-1">
              <div className="text-xs font-mono text-[#A8C69F]">Reconciliation Discrepancy</div>
              <div className="text-2xl font-serif font-bold text-[#A8C69F]">0.0 mg Delta</div>
              <div className="text-[10px] font-mono text-[#A8C69F]">100% Dual-Count Balance</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#141B16] border border-[#C8B195]/30 space-y-1">
              <div className="text-xs font-mono text-[#C8B195]">Vault Dual-Custodians</div>
              <div className="text-base font-bold text-[#E8EDEA] truncate">Dr. Mercer / Dr. Vance</div>
              <div className="text-[10px] font-mono text-[#E8EDEA]/60">Biometric 2FA Required</div>
            </div>

            <div className="p-5 rounded-2xl bg-[#141B16] border border-[#D4B8E5]/30 space-y-1">
              <div className="text-xs font-mono text-[#D4B8E5]">Form 41 Waste Logs</div>
              <div className="text-2xl font-serif font-bold text-[#E8EDEA]">
                {deaVaultRecords.reduce((acc, r) => acc + r.wasteLog.length, 0)} Logged Events
              </div>
              <div className="text-[10px] font-mono text-[#93C5B5]">Witnessed Destruction</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* DEA Perpetual Inventory Records Table */}
            <div className="lg:col-span-2 bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#93C5B5]/15 text-[#93C5B5] border border-[#93C5B5]/30">
                    <Boxes className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-base text-[#E8EDEA]">Perpetual DEA Controlled Vault Ledger</h3>
                    <p className="text-xs text-[#E8EDEA]/50 font-mono">Form 222 Electronic Ingestion & Physical Verification</p>
                  </div>
                </div>

                <button
                  onClick={() => setShowWasteModal(true)}
                  className="px-3 py-1.5 rounded-xl bg-[#0D120E] hover:bg-[#1A261F] border border-[#E8EDEA]/10 text-xs text-[#C8B195] font-mono flex items-center gap-1.5"
                >
                  <Flame className="w-3.5 h-3.5" />
                  <span>Log Form 41 Waste</span>
                </button>
              </div>

              <div className="space-y-3.5">
                {deaVaultRecords.map((record) => (
                  <div key={record.lotNumber} className="p-4 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-xs space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8EDEA]/10 pb-2">
                      <div>
                        <span className="font-bold text-[#E8EDEA] text-sm font-sans">{record.compound}</span>
                        <div className="text-[11px] font-mono text-[#93C5B5]">
                          Lot: {record.lotNumber} • {record.form222TrackingNumber}
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A261F] text-[#A8C69F] border border-[#A8C69F]/40">
                          {record.deaSchedule}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0D120E] text-[#E8EDEA]/70 border border-[#E8EDEA]/10">
                          {record.storageVaultId.slice(0, 18)}...
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 font-mono text-[11px]">
                      <div>
                        <div className="text-[#E8EDEA]/40">Physical Vault Count</div>
                        <div className="text-[#A8C69F] font-bold text-sm">{record.physicalVaultBalanceMg.toLocaleString()} mg</div>
                      </div>
                      <div>
                        <div className="text-[#E8EDEA]/40">Electronic Order Balance</div>
                        <div className="text-[#E8EDEA] font-bold text-sm">{record.electronicOrderBalanceMg.toLocaleString()} mg</div>
                      </div>
                      <div>
                        <div className="text-[#E8EDEA]/40">Discrepancy Delta</div>
                        <div className={`font-bold text-sm ${record.discrepancyDeltaMg === 0 ? 'text-[#A8C69F]' : 'text-rose-400'}`}>
                          {record.discrepancyDeltaMg === 0 ? '0.0 mg (Balanced)' : `${record.discrepancyDeltaMg} mg`}
                        </div>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-[#E8EDEA]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-[#E8EDEA]/50">
                      <div>Last Dual-Sign: {record.lastReconciliationDate}</div>
                      <div>Custodian 1: {record.custodianQHP1.slice(0, 20)} • Custodian 2: {record.custodianWitnessQHP2.slice(0, 20)}</div>
                    </div>

                    {/* Waste logs */}
                    {record.wasteLog.length > 0 && (
                      <div className="mt-2 p-2 rounded-lg bg-[#141B16] border border-[#E8EDEA]/10 space-y-1">
                        <div className="text-[10px] font-mono text-[#C8B195] font-bold">DEA Form 41 Destruction Records:</div>
                        {record.wasteLog.map((w, idx) => (
                          <div key={idx} className="flex items-center justify-between text-[10px] font-mono text-[#E8EDEA]/70">
                            <span>• {w.timestamp.slice(0, 10)}: {w.wastedMg}mg destroyed ({w.reason})</span>
                            <span>Witness: {w.witness1} & {w.witness2}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Perpetual Reconciliation & Dual-Sign Form */}
            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#C8B195]/15 text-[#C8B195] border border-[#C8B195]/30">
                  <Lock className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#E8EDEA]">Dual-Custody Vault Reconciliation</h3>
                  <p className="text-xs text-[#E8EDEA]/50 font-mono">21 CFR Part 11 Electronic Signing</p>
                </div>
              </div>

              <form onSubmit={handleReconcile} className="space-y-3.5 text-xs">
                <div className="space-y-1">
                  <label className="text-[#E8EDEA]/60 font-mono">Select Lot to Reconcile</label>
                  <select
                    value={reconcileLot}
                    onChange={(e) => setReconcileLot(e.target.value)}
                    className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-xs text-[#E8EDEA] focus:outline-none focus:border-[#93C5B5]"
                  >
                    {deaVaultRecords.map(r => (
                      <option key={r.lotNumber} value={r.lotNumber}>
                        {r.compound} (Bal: {r.physicalVaultBalanceMg}mg)
                      </option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[#E8EDEA]/60 font-mono">Physical Scale Count (mg)</label>
                  <input
                    type="number"
                    value={physicalCountMg}
                    onChange={(e) => setPhysicalCountMg(Number(e.target.value))}
                    className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-xs text-[#E8EDEA] focus:outline-none focus:border-[#93C5B5] font-mono"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[#E8EDEA]/60 font-mono">Secondary QHP Witness</label>
                  <input
                    type="text"
                    value={witnessQHP2}
                    onChange={(e) => setWitnessQHP2(e.target.value)}
                    className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-xs text-[#E8EDEA] focus:outline-none focus:border-[#93C5B5]"
                    required
                  />
                </div>

                {reconcileSuccess && (
                  <div className="p-3 rounded-xl bg-[#1A261F] border border-[#A8C69F]/40 text-[#A8C69F] text-xs font-mono flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#A8C69F]" />
                    <span>Perpetual inventory reconciled & sealed to audit ledger.</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-[#93C5B5] hover:bg-[#a6d4c5] text-[#0A0D0B] font-bold text-xs transition-all shadow-md mt-2"
                >
                  Verify Dual-Count & Stamp Reconciliation
                </button>
              </form>

              {/* Standard Dispense Box */}
              <div className="pt-4 border-t border-[#E8EDEA]/10 space-y-3">
                <div className="font-serif font-bold text-sm text-[#E8EDEA]">Immediate Session Dispense</div>
                <form onSubmit={handleDispense} className="space-y-2.5 text-xs">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={dispenseMg}
                      onChange={(e) => setDispenseMg(Number(e.target.value))}
                      placeholder="mg"
                      className="w-24 bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-1.5 text-[#E8EDEA] font-mono"
                    />
                    <button
                      type="submit"
                      className="flex-1 py-1.5 rounded-xl bg-[#0D120E] hover:bg-[#1A261F] border border-[#93C5B5]/40 text-[#93C5B5] font-mono font-bold"
                    >
                      Dispense {dispenseMg}mg
                    </button>
                  </div>
                  {dispenseSuccess !== null && (
                    <div className="text-[10px] font-mono text-[#A8C69F]">
                      ✓ {dispenseMg}mg dispensed for {currentPatient.pseudonym}
                    </div>
                  )}
                </form>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3.5: CPT Category III Superbill & Billing Engine */}
      {activeTab === 'billing' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-serif font-bold text-[#E8EDEA] flex items-center gap-2">
                <span>CPT Category III Multi-Provider Superbill Engine</span>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-[#1A261F] text-[#A8C69F] border border-[#A8C69F]/40">
                  Target: {currentPatient.pseudonym}
                </span>
              </h2>
              <p className="text-xs text-[#E8EDEA]/60 font-sans">
                Automated generation of out-of-network claims utilizing time-based coding: 0820T (Lead QHP), +0821T (Secondary Co-Therapist), and +0822T (Clinical Escort).
              </p>
            </div>

            <button
              onClick={() => generateSuperbill(currentPatient.id)}
              className="px-4 py-2 rounded-xl bg-[#93C5B5] hover:bg-[#a6d4c5] text-[#0A0D0B] font-bold text-xs flex items-center gap-1.5 transition-all shadow-md self-start"
            >
              <Receipt className="w-4 h-4" />
              <span>Generate / Refresh Superbill</span>
            </button>
          </div>

          {currentPatient.billingProfile ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Superbill Document View */}
              <div className="lg:col-span-2 bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-6 shadow-xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8EDEA]/10 pb-4">
                  <div>
                    <div className="text-xs font-mono text-[#93C5B5] uppercase">Clinical Superbill Statement</div>
                    <div className="text-xl font-serif font-bold text-[#E8EDEA]">
                      Superbill #{currentPatient.billingProfile.superbillId}
                    </div>
                  </div>
                  <div className="text-right font-mono text-xs text-[#E8EDEA]/60">
                    <div>Encounter: {currentPatient.billingProfile.encounterId}</div>
                    <div>Date: {currentPatient.journeyDate}</div>
                  </div>
                </div>

                {/* ICD-10 Diagnostic Codes */}
                <div className="space-y-1.5">
                  <div className="text-xs font-mono text-[#E8EDEA]/60 font-bold">ICD-10 Diagnostic Classifications:</div>
                  <div className="flex flex-wrap gap-2">
                    {currentPatient.billingProfile.icd10Codes.map((c, i) => (
                      <span key={i} className="text-xs font-mono px-3 py-1 rounded-lg bg-[#0D120E] text-[#93C5B5] border border-[#93C5B5]/30">
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Time-Based CPT Coding Breakdown Table */}
                <div className="space-y-2">
                  <div className="text-xs font-mono text-[#E8EDEA]/60 font-bold">Multi-Provider CPT Category III Breakdown:</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs font-mono">
                      <thead>
                        <tr className="border-b border-[#E8EDEA]/10 text-[#E8EDEA]/50 text-left">
                          <th className="pb-2">CPT Code</th>
                          <th className="pb-2">Provider Role & NPI</th>
                          <th className="pb-2">Hours Logged</th>
                          <th className="pb-2">Rate / Hr</th>
                          <th className="pb-2 text-right">Total Billed</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E8EDEA]/5">
                        <tr>
                          <td className="py-2.5 text-[#93C5B5] font-bold">{currentPatient.billingProfile.primaryQHP.code}</td>
                          <td className="py-2.5 text-[#E8EDEA]">{currentPatient.billingProfile.primaryQHP.name} (NPI: {currentPatient.billingProfile.primaryQHP.npi})</td>
                          <td className="py-2.5 text-[#E8EDEA]/80">{currentPatient.billingProfile.primaryQHP.hoursLogged} hrs</td>
                          <td className="py-2.5 text-[#E8EDEA]/80">${currentPatient.billingProfile.primaryQHP.unitRate}</td>
                          <td className="py-2.5 text-right font-bold text-[#A8C69F]">${currentPatient.billingProfile.primaryQHP.totalBilled}</td>
                        </tr>
                        {currentPatient.billingProfile.secondaryQHP && (
                          <tr>
                            <td className="py-2.5 text-[#93C5B5] font-bold">{currentPatient.billingProfile.secondaryQHP.code}</td>
                            <td className="py-2.5 text-[#E8EDEA]">{currentPatient.billingProfile.secondaryQHP.name} (NPI: {currentPatient.billingProfile.secondaryQHP.npi})</td>
                            <td className="py-2.5 text-[#E8EDEA]/80">{currentPatient.billingProfile.secondaryQHP.hoursLogged} hrs</td>
                            <td className="py-2.5 text-[#E8EDEA]/80">${currentPatient.billingProfile.secondaryQHP.unitRate}</td>
                            <td className="py-2.5 text-right font-bold text-[#A8C69F]">${currentPatient.billingProfile.secondaryQHP.totalBilled}</td>
                          </tr>
                        )}
                        {currentPatient.billingProfile.clinicalStaff && (
                          <tr>
                            <td className="py-2.5 text-[#93C5B5] font-bold">{currentPatient.billingProfile.clinicalStaff.code}</td>
                            <td className="py-2.5 text-[#E8EDEA]">{currentPatient.billingProfile.clinicalStaff.name}</td>
                            <td className="py-2.5 text-[#E8EDEA]/80">{currentPatient.billingProfile.clinicalStaff.hoursLogged} hrs</td>
                            <td className="py-2.5 text-[#E8EDEA]/80">${currentPatient.billingProfile.clinicalStaff.unitRate}</td>
                            <td className="py-2.5 text-right font-bold text-[#A8C69F]">${currentPatient.billingProfile.clinicalStaff.totalBilled}</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Total Claim Calculation */}
                <div className="pt-4 border-t border-[#E8EDEA]/10 flex items-center justify-between font-mono">
                  <div className="text-xs text-[#E8EDEA]/60">Total Insurance Superbill Claim Amount:</div>
                  <div className="text-xl font-bold text-[#A8C69F]">
                    ${(currentPatient.billingProfile.primaryQHP.totalBilled + (currentPatient.billingProfile.secondaryQHP?.totalBilled || 0) + (currentPatient.billingProfile.clinicalStaff?.totalBilled || 0)).toLocaleString()}
                  </div>
                </div>
              </div>

              {/* Package Subscription & Fee Split Architecture */}
              <div className="space-y-6">
                <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4">
                  <div className="flex items-center gap-2 text-[#C8B195] font-mono text-xs">
                    <DollarSign className="w-4 h-4" />
                    <span>Care Bundle & Fee Split</span>
                  </div>
                  <h3 className="font-serif font-bold text-base text-[#E8EDEA]">
                    {currentPatient.billingProfile.packageSubscription.packageName}
                  </h3>
                  
                  <div className="text-2xl font-serif font-bold text-[#E8EDEA]">
                    ${currentPatient.billingProfile.packageSubscription.totalCost.toLocaleString()} <span className="text-xs font-mono font-normal text-[#E8EDEA]/50">Bundle Flat Fee</span>
                  </div>

                  <div className="space-y-2 pt-2 border-t border-[#E8EDEA]/10 text-xs font-mono">
                    <div className="flex items-center justify-between text-[#E8EDEA]/80">
                      <span>Lead QHP Share ({currentPatient.billingProfile.packageSubscription.feeSplit.leadQHPPercent}%):</span>
                      <span className="font-bold text-[#A8C69F]">
                        ${(currentPatient.billingProfile.packageSubscription.totalCost * (currentPatient.billingProfile.packageSubscription.feeSplit.leadQHPPercent / 100)).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#E8EDEA]/80">
                      <span>Co-Therapist Share ({currentPatient.billingProfile.packageSubscription.feeSplit.coTherapistPercent}%):</span>
                      <span className="font-bold text-[#A8C69F]">
                        ${(currentPatient.billingProfile.packageSubscription.totalCost * (currentPatient.billingProfile.packageSubscription.feeSplit.coTherapistPercent / 100)).toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#E8EDEA]/80">
                      <span>Sanctuary Facility Share ({currentPatient.billingProfile.packageSubscription.feeSplit.sanctuaryFacilityPercent}%):</span>
                      <span className="font-bold text-[#93C5B5]">
                        ${(currentPatient.billingProfile.packageSubscription.totalCost * (currentPatient.billingProfile.packageSubscription.feeSplit.sanctuaryFacilityPercent / 100)).toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <p className="text-[11px] text-[#E8EDEA]/50 font-sans pt-2">
                    Automates compliant multi-provider distribution and transparent patient superbill reimbursement reconciliation.
                  </p>
                </div>
              </div>

            </div>
          ) : (
            <div className="p-8 text-center bg-[#141B16] rounded-2xl border border-[#E8EDEA]/10 font-mono text-xs text-[#E8EDEA]/40">
              No active billing profile for selected patient. Click "Generate Superbill" above.
            </div>
          )}
        </div>
      )}

      {/* TAB 3.6: Sanctuary Scheduling & Environmental Controls */}
      {activeTab === 'scheduling' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="bg-[#141B16] border border-[#93C5B5]/40 rounded-2xl p-6 space-y-4 shadow-xl">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-[#E8EDEA]">Sanctuary Suite 1 — "Cindevra Alpha"</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A261F] text-[#A8C69F] border border-[#A8C69F]/40">Occupied (Session Live)</span>
              </div>
              <div className="text-xs text-[#E8EDEA]/70 space-y-1.5 font-mono">
                <div>Patient: AE-9941 (Aurora)</div>
                <div>Protocol: Psilocybin 25mg Macro</div>
                <div>Acoustic Isolation: <span className="text-[#A8C69F]">STC 68 (Certified)</span></div>
                <div>Circadian Lighting: <span className="text-[#C8B195]">2200K Warm Ember (15% Lux)</span></div>
                <div>HEPA Filtration: <span className="text-[#93C5B5]">14 ACH Air Cycles</span></div>
              </div>
            </div>

            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-[#E8EDEA]">Sanctuary Suite 2 — "Lotus Beta"</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0D120E] text-[#E8EDEA]/60 border border-[#E8EDEA]/10">Available</span>
              </div>
              <div className="text-xs text-[#E8EDEA]/70 space-y-1.5 font-mono">
                <div>Next Session: Tomorrow 08:30</div>
                <div>Patient: Sol (AE-6632)</div>
                <div>Acoustic Isolation: <span className="text-[#A8C69F]">STC 72 (Certified)</span></div>
                <div>HEPA Air Exchange: <span className="text-[#93C5B5]">12 ACH Air Cycles</span></div>
              </div>
            </div>

            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-base text-[#E8EDEA]">Sanctuary Suite 3 — "Sovereignty Sol"</h3>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#2A1F30] text-[#D4B8E5] border border-[#D4B8E5]/40">Integration Active</span>
              </div>
              <div className="text-xs text-[#E8EDEA]/70 space-y-1.5 font-mono">
                <div>Active Use: Somatic Integration Circle</div>
                <div>Facilitator: Sarah Chen, LCSW</div>
                <div>Chaperone Verified: <span className="text-[#A8C69F]">Yes (Active)</span></div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 3.7: Multi-Clinic Network Layer */}
      {activeTab === 'network' && (
        <div className="space-y-6">
          <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 sm:p-8 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#93C5B5]/15 text-[#93C5B5] border border-[#93C5B5]/30">
                <Network className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-base text-[#E8EDEA]">Multi-Clinic Sovereign Network Architecture</h3>
                <p className="text-xs text-[#E8EDEA]/50 font-mono">Federated Sanctuary Nodes</p>
              </div>
            </div>

            <p className="text-xs text-[#E8EDEA]/70 leading-relaxed max-w-3xl font-sans">
              Sanctuaries operate as sovereign nodes. Patient cryptographic identities remain local unless explicitly authorized for cross-sanctuary referral using zero-knowledge transfer tokens.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-xs space-y-1">
                <div className="font-bold text-[#E8EDEA] font-sans">Pacific Sanctuary (Node 01)</div>
                <div className="text-[11px] text-[#E8EDEA]/60 font-sans">Portland, Oregon • Primary Host</div>
                <div className="text-[10px] font-mono text-[#A8C69F] pt-1">● Online • 4 Active Journey Suites</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-xs space-y-1">
                <div className="font-bold text-[#E8EDEA] font-sans">Front Range Collective (Node 02)</div>
                <div className="text-[11px] text-[#E8EDEA]/60 font-sans">Boulder, Colorado • Licensed Node</div>
                <div className="text-[10px] font-mono text-[#A8C69F] pt-1">● Online • 6 Active Journey Suites</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-xs space-y-1">
                <div className="font-bold text-[#E8EDEA] font-sans">Alpine Neuro-Lab (Node 03)</div>
                <div className="text-[11px] text-[#E8EDEA]/60 font-sans">Zurich, Switzerland • BAG SAP</div>
                <div className="text-[10px] font-mono text-[#A8C69F] pt-1">● Online • 3 Clinical EEG Suites</div>
              </div>

              <div className="p-4 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-xs space-y-1">
                <div className="font-bold text-[#E8EDEA] font-sans">Cascadia Healing Node (Node 04)</div>
                <div className="text-[11px] text-[#E8EDEA]/60 font-sans">Vancouver, BC • SAP Health Canada</div>
                <div className="text-[10px] font-mono text-[#A8C69F] pt-1">● Online • 2 Palliative Units</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Log Waste Modal */}
      {showWasteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#141B16] border border-[#C8B195]/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-[#C8B195]">
              <Flame className="w-5 h-5" />
              <h3 className="font-serif font-bold text-lg text-[#E8EDEA]">DEA Form 41 Controlled Substance Waste Log</h3>
            </div>
            
            <form onSubmit={handleLogWaste} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[#E8EDEA]/60 font-mono">Select Compound Lot</label>
                <select
                  value={wasteLot}
                  onChange={(e) => setWasteLot(e.target.value)}
                  className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-[#E8EDEA] focus:outline-none focus:border-[#C8B195]"
                >
                  {deaVaultRecords.map(r => (
                    <option key={r.lotNumber} value={r.lotNumber}>{r.compound} ({r.lotNumber})</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[#E8EDEA]/60 font-mono">Milligrams to Destroy (mg)</label>
                <input
                  type="number"
                  value={wasteMg}
                  onChange={(e) => setWasteMg(Number(e.target.value))}
                  className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-[#E8EDEA] font-mono"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#E8EDEA]/60 font-mono">Reason for Disposal</label>
                <input
                  type="text"
                  value={wasteReason}
                  onChange={(e) => setWasteReason(e.target.value)}
                  className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-[#E8EDEA]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#E8EDEA]/60 font-mono">Primary Custodian QHP</label>
                <input
                  type="text"
                  value={wasteWitness1}
                  onChange={(e) => setWasteWitness1(e.target.value)}
                  className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-[#E8EDEA]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#E8EDEA]/60 font-mono">Mandatory Secondary QHP Witness</label>
                <input
                  type="text"
                  value={wasteWitness2}
                  onChange={(e) => setWasteWitness2(e.target.value)}
                  className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-[#E8EDEA]"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#C8B195] hover:bg-[#d6c1a7] text-[#0A0D0B] font-bold text-xs shadow-md"
                >
                  Record Witnessed Destruction
                </button>
                <button
                  type="button"
                  onClick={() => setShowWasteModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-[#E8EDEA]/70 text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Log MBC Survey Modal */}
      {showMBCModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#141B16] border border-[#93C5B5]/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-xl text-[#E8EDEA]">Log Measurement-Based Care (MBC) Battery</h3>
            
            <form onSubmit={handleAddMBCSurvey} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[#E8EDEA]/60 font-mono">Survey Instrument</label>
                <select
                  value={mbcSurveyType}
                  onChange={(e) => setMbcSurveyType(e.target.value as any)}
                  className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-[#E8EDEA] focus:outline-none focus:border-[#93C5B5]"
                >
                  <option value="PHQ-9">PHQ-9 (Patient Health Questionnaire-9 Depression)</option>
                  <option value="GAD-7">GAD-7 (Generalized Anxiety Disorder-7)</option>
                  <option value="PCL-5">PCL-5 (PTSD Checklist for DSM-5)</option>
                  <option value="MEQ-30">MEQ-30 (Mystical Experience Questionnaire-30)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[#E8EDEA]/60 font-mono">Longitudinal Schedule Timepoint</label>
                <select
                  value={mbcTimepoint}
                  onChange={(e) => setMbcTimepoint(e.target.value as any)}
                  className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-[#E8EDEA] focus:outline-none focus:border-[#93C5B5]"
                >
                  <option value="Baseline (Pre)">Baseline (Pre)</option>
                  <option value="24h Post-Dose">24h Post-Dose</option>
                  <option value="7-Day Post">7-Day Post</option>
                  <option value="30-Day Post">30-Day Post</option>
                  <option value="90-Day Post">90-Day Post</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[#E8EDEA]/60 font-mono">Recorded Score</label>
                <input
                  type="number"
                  value={mbcScore}
                  onChange={(e) => setMbcScore(Number(e.target.value))}
                  className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-[#E8EDEA] font-mono focus:outline-none focus:border-[#93C5B5]"
                  required
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#93C5B5] hover:bg-[#a6d4c5] text-[#0A0D0B] font-bold text-xs shadow-md"
                >
                  Save Psychometric Survey
                </button>
                <button
                  type="button"
                  onClick={() => setShowMBCModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-[#E8EDEA]/70 text-xs"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Patient Intake Modal */}
      {showNewPatientModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="bg-[#141B16] border border-[#93C5B5]/40 rounded-2xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <h3 className="font-serif font-bold text-xl text-[#E8EDEA]">Intake New Sovereign Participant</h3>
            
            <form onSubmit={handleCreatePatient} className="space-y-3.5 text-xs">
              <div className="space-y-1">
                <label className="text-[#E8EDEA]/60 font-sans">Participant Pseudonym (ZK Safe)</label>
                <input
                  type="text"
                  placeholder="e.g. Phoenix (AE-1192)"
                  value={newPseudonym}
                  onChange={(e) => setNewPseudonym(e.target.value)}
                  className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-[#E8EDEA] focus:outline-none focus:border-[#93C5B5]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#E8EDEA]/60 font-sans">Participant Age</label>
                <input
                  type="number"
                  value={newAge}
                  onChange={(e) => setNewAge(Number(e.target.value))}
                  className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-[#E8EDEA] focus:outline-none focus:border-[#93C5B5]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#E8EDEA]/60 font-sans">Clinical Indication</label>
                <input
                  type="text"
                  value={newIndication}
                  onChange={(e) => setNewIndication(e.target.value)}
                  className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-[#E8EDEA] focus:outline-none focus:border-[#93C5B5]"
                  required
                />
              </div>

              <div className="space-y-1">
                <label className="text-[#E8EDEA]/60 font-sans">Assigned Protocol</label>
                <select
                  value={newProtocol}
                  onChange={(e) => setNewProtocol(e.target.value)}
                  className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-[#E8EDEA] focus:outline-none focus:border-[#93C5B5]"
                >
                  <option value="PSIL-TRD-25">Psilocybin Macro 25mg (TRD)</option>
                  <option value="MDMA-PTSD-120">MDMA-Assisted 120mg+60mg (PTSD)</option>
                  <option value="5MEO-EXP-15">5-MeO-DMT Rapid Ego Dissolution (12mg IM)</option>
                  <option value="KET-NEURO-IM">Ketamine Sub-Dissociative IM</option>
                  <option value="IBOG-NEURO-RESET">Ibogaine Neuro-Reset (Addiction)</option>
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-[#A8C69F] hover:bg-[#b8d6af] text-[#0A0D0B] font-bold text-xs transition-all shadow-md"
                >
                  Create & Seal ZK Identity
                </button>
                <button
                  type="button"
                  onClick={() => setShowNewPatientModal(false)}
                  className="px-4 py-2.5 rounded-xl bg-[#0D120E] hover:bg-[#15221F] border border-[#E8EDEA]/10 text-[#E8EDEA]/70 text-xs transition-all"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
