import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Dna, 
  FileText, 
  Pill, 
  Plus, 
  Trash2, 
  Sparkles, 
  Lock, 
  HelpCircle,
  ExternalLink,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { 
  DrugInteractionQuery, 
  DrugInteractionEvaluation, 
  CandidateMedication, 
  EntheogenSubstance, 
  CYP2D6Phenotype, 
  CYP3A4Status,
  AdministrationRoute 
} from '../../types/interactions';
import { DrugInteractionEngine, MEDICATION_RULES_DATABASE } from '../../services/interactionEngine';
import { useAether } from '../../context/AetherContext';

export const DrugInteractionCalculator: React.FC = () => {
  const { patients, recordAudit } = useAether();

  // Query State
  const [selectedPatientId, setSelectedPatientId] = useState<string>(patients[0]?.id || 'AE-9941');
  const [plannedSubstance, setPlannedSubstance] = useState<EntheogenSubstance>('psilocybin');
  const [plannedDoseMg, setPlannedDoseMg] = useState<number>(25);
  const [plannedRoute, setPlannedRoute] = useState<AdministrationRoute>('oral');
  
  // Patient Metabolic Factors
  const [patientAge, setPatientAge] = useState<number>(38);
  const [patientWeightKg, setPatientWeightKg] = useState<number>(72);
  const [cyp2d6Phenotype, setCyp2d6Phenotype] = useState<CYP2D6Phenotype>('normal');
  const [cyp3a4Status, setCyp3a4Status] = useState<CYP3A4Status>('normal');
  const [hepaticImpairment, setHepaticImpairment] = useState<boolean>(false);
  const [renalImpairment, setRenalImpairment] = useState<boolean>(false);

  // Candidate Meds List
  const [candidateMeds, setCandidateMeds] = useState<CandidateMedication[]>([
    {
      name: 'Sertraline',
      dose_mg: 50,
      frequency: 'Once daily',
      last_dose_datetime: '2026-08-20T08:00:00Z',
      indication: 'Major Depressive Disorder'
    }
  ]);

  // New med form state
  const [newMedName, setNewMedName] = useState<string>('Escitalopram');
  const [newMedDose, setNewMedDose] = useState<number>(10);
  const [newMedFrequency, setNewMedFrequency] = useState<string>('Daily');
  const [newMedLastDose, setNewMedLastDose] = useState<string>('2026-08-15');

  // Evaluation Result State
  const [evaluation, setEvaluation] = useState<DrugInteractionEvaluation | null>(() => {
    // Initial calculation on mount
    const initialQuery: DrugInteractionQuery = {
      patient_journey_id: patients[0]?.id || 'AE-9941',
      candidate_medications: [
        {
          name: 'Sertraline',
          dose_mg: 50,
          frequency: 'Once daily',
          last_dose_datetime: '2026-08-20T08:00:00Z',
          indication: 'Major Depressive Disorder'
        }
      ],
      planned_entheogen: {
        substance: 'psilocybin',
        planned_dose_mg: 25,
        route: 'oral'
      },
      patient_factors: {
        age: 38,
        weight_kg: 72,
        known_cyp2d6_phenotype: 'normal',
        known_cyp3a4_status: 'normal',
        hepatic_impairment: false,
        renal_impairment: false
      }
    };
    return DrugInteractionEngine.evaluate(initialQuery);
  });

  const [qhpSigned, setQhpSigned] = useState<boolean>(false);
  const [showCopiedAlert, setShowCopiedAlert] = useState<boolean>(false);

  const handleRunEvaluation = () => {
    const query: DrugInteractionQuery = {
      patient_journey_id: selectedPatientId,
      candidate_medications: candidateMeds,
      planned_entheogen: {
        substance: plannedSubstance,
        planned_dose_mg: plannedDoseMg,
        route: plannedRoute
      },
      patient_factors: {
        age: patientAge,
        weight_kg: patientWeightKg,
        known_cyp2d6_phenotype: cyp2d6Phenotype,
        known_cyp3a4_status: cyp3a4Status,
        hepatic_impairment: hepaticImpairment,
        renal_impairment: renalImpairment
      }
    };

    const result = DrugInteractionEngine.evaluate(query);
    setEvaluation(result);
    setQhpSigned(false);

    recordAudit(
      `Pharmacological interaction evaluated for ${selectedPatientId} (${plannedSubstance.toUpperCase()} ${plannedDoseMg}mg): ${result.risk_summary.overall_risk_level.toUpperCase()} (Toxicity Index: ${result.risk_summary.serotonin_toxicity_score}/100)`,
      'CLINICAL'
    );
  };

  const handleAddMedication = () => {
    if (!newMedName) return;
    const newMed: CandidateMedication = {
      name: newMedName,
      dose_mg: newMedDose || null,
      frequency: newMedFrequency,
      last_dose_datetime: newMedLastDose ? `${newMedLastDose}T08:00:00Z` : null
    };
    setCandidateMeds([...candidateMeds, newMed]);
  };

  const handleRemoveMedication = (index: number) => {
    setCandidateMeds(candidateMeds.filter((_, i) => i !== index));
  };

  const handleSignEvaluation = () => {
    if (!evaluation) return;
    setQhpSigned(true);
    recordAudit(
      `QHP Pharmacological Clearance digitally signed for ${selectedPatientId}: ${evaluation.risk_summary.overall_risk_level.toUpperCase()}`,
      'CONSENT'
    );
  };

  const handleCopySoapNotes = () => {
    if (!evaluation) return;
    navigator.clipboard.writeText(evaluation.clinical_notes_for_chart);
    setShowCopiedAlert(true);
    setTimeout(() => setShowCopiedAlert(false), 3000);
  };

  const getRiskBadge = (level: string) => {
    switch (level) {
      case 'contraindicated':
        return (
          <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
            <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
            ABSOLUTE CONTRAINDICATION
          </span>
        );
      case 'high':
        return (
          <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            HIGH SEROTONERGIC HAZARD
          </span>
        );
      case 'moderate':
        return (
          <span className="px-3 py-1 rounded-full bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
            MODERATE INTERACTION / EFFICACY DAMPED
          </span>
        );
      default:
        return (
          <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold flex items-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
            LOW RISK / CLEARED FOR PROTOCOL
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 font-sans">
      
      {/* Header Banner */}
      <div className="bg-[#141B16] border border-[#D4B8E5]/30 rounded-2xl p-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-[#D4B8E5] font-mono text-xs">
            <Dna className="w-4 h-4 text-[#D4B8E5]" />
            <span>4.4 Canopy — Clinical Pharmacological Guardian</span>
          </div>
          <span className="text-[11px] font-mono text-[#E8EDEA]/50 bg-[#0D120E] px-2.5 py-1 rounded-lg border border-white/5">
            21 CFR Part 11 Auditable • Evidence Version 2026.4
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#E8EDEA]">
          Multi-Substance Pharmacodynamic & CYP450 Interaction Engine
        </h2>
        <p className="text-xs sm:text-sm text-[#E8EDEA]/70 font-light max-w-3xl">
          Automated algorithmic decision-support evaluating serotonin toxicity indices, CYP2D6/CYP3A4 hepatic clearance profiles, half-life washout schedules, and dangerous drug-drug combinations before dosing approval.
        </p>
      </div>

      {/* Main Grid: Input Form (Left) & Real-time Evidence Output (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Interactive Dosing & Med Parameters (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Planned Entheogen Selection */}
          <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#A8C69F] flex items-center gap-1.5">
                <Pill className="w-3.5 h-3.5" />
                1. Planned Entheogen Regimen
              </span>
              <span className="text-[11px] text-[#E8EDEA]/40 font-mono">Patient: {selectedPatientId}</span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-[#E8EDEA]/60 font-medium">Compound</label>
                <select
                  value={plannedSubstance}
                  onChange={(e) => {
                    const sub = e.target.value as EntheogenSubstance;
                    setPlannedSubstance(sub);
                    if (sub === 'psilocybin') setPlannedDoseMg(25);
                    if (sub === 'mdma') setPlannedDoseMg(120);
                    if (sub === '5meo_dmt') setPlannedDoseMg(15);
                    if (sub === 'ketamine') setPlannedDoseMg(75);
                    if (sub === 'ibogaine') setPlannedDoseMg(600);
                  }}
                  className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-xs text-[#E8EDEA] focus:outline-none focus:border-[#93C5B5]"
                >
                  <option value="psilocybin">Psilocybin (Synthetic)</option>
                  <option value="mdma">MDMA (Midomafetamine)</option>
                  <option value="5meo_dmt">5-MeO-DMT</option>
                  <option value="ketamine">Ketamine (Esketamine)</option>
                  <option value="ibogaine">Ibogaine HCl</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-[#E8EDEA]/60 font-medium">Planned Dose (mg)</label>
                <input
                  type="number"
                  value={plannedDoseMg}
                  onChange={(e) => setPlannedDoseMg(Number(e.target.value))}
                  className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-xs text-[#E8EDEA] font-mono focus:outline-none focus:border-[#93C5B5]"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[11px] text-[#E8EDEA]/60 font-medium">Administration Route</label>
              <select
                value={plannedRoute}
                onChange={(e) => setPlannedRoute(e.target.value as AdministrationRoute)}
                className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-xs text-[#E8EDEA] focus:outline-none focus:border-[#93C5B5]"
              >
                <option value="oral">Oral (Encapsulated)</option>
                <option value="intranasal">Intranasal (Aerosolized)</option>
                <option value="intramuscular">Intramuscular (IM)</option>
                <option value="sublingual">Sublingual / Buccal</option>
              </select>
            </div>
          </div>

          {/* Metabolic & Genotypic Factors */}
          <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-5 space-y-4">
            <span className="text-xs font-mono text-[#D4B8E5] flex items-center gap-1.5">
              <Dna className="w-3.5 h-3.5" />
              2. Pharmacogenomic & Organ Factors
            </span>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[11px] text-[#E8EDEA]/60 font-medium">CYP2D6 Phenotype</label>
                <select
                  value={cyp2d6Phenotype}
                  onChange={(e) => setCyp2d6Phenotype(e.target.value as CYP2D6Phenotype)}
                  className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-2.5 py-1.5 text-xs text-[#E8EDEA] focus:outline-none focus:border-[#93C5B5]"
                >
                  <option value="normal">Normal (Extensive)</option>
                  <option value="poor">Poor Metabolizer (*4/*4)</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="ultrarapid">Ultrarapid Duplication</option>
                  <option value="unknown">Unknown / Not Genotyped</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[11px] text-[#E8EDEA]/60 font-medium">CYP3A4 Induction/Inhibition</label>
                <select
                  value={cyp3a4Status}
                  onChange={(e) => setCyp3a4Status(e.target.value as CYP3A4Status)}
                  className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-2.5 py-1.5 text-xs text-[#E8EDEA] focus:outline-none focus:border-[#93C5B5]"
                >
                  <option value="normal">Normal Baseline</option>
                  <option value="inhibited">Inhibited (e.g. Ketoconazole)</option>
                  <option value="induced">Induced (e.g. St. John's Wort)</option>
                  <option value="unknown">Unknown</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-1">
              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0D120E] border border-white/5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={hepaticImpairment}
                  onChange={(e) => setHepaticImpairment(e.target.checked)}
                  className="rounded text-[#A8C69F] focus:ring-0"
                />
                <span className="text-[#E8EDEA]/80">Hepatic Impairment</span>
              </label>

              <label className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0D120E] border border-white/5 cursor-pointer text-xs">
                <input
                  type="checkbox"
                  checked={renalImpairment}
                  onChange={(e) => setRenalImpairment(e.target.checked)}
                  className="rounded text-[#A8C69F] focus:ring-0"
                />
                <span className="text-[#E8EDEA]/80">Renal Impairment</span>
              </label>
            </div>
          </div>

          {/* Current Candidate Medications List */}
          <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-[#C8B195] flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                3. Active & Recent Candidate Medications
              </span>
              <span className="text-xs text-[#E8EDEA]/50 font-mono">{candidateMeds.length} tracked</span>
            </div>

            {/* List of active meds */}
            <div className="space-y-2">
              {candidateMeds.map((med, idx) => (
                <div 
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D120E] border border-white/5 text-xs"
                >
                  <div>
                    <div className="font-medium text-[#E8EDEA] flex items-center gap-2">
                      <span>{med.name}</span>
                      {med.dose_mg && <span className="text-[#E8EDEA]/50 font-mono">({med.dose_mg}mg)</span>}
                    </div>
                    <div className="text-[11px] text-[#E8EDEA]/40 font-mono">
                      Last dose: {med.last_dose_datetime ? new Date(med.last_dose_datetime).toLocaleDateString() : 'Active/Ongoing'}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveMedication(idx)}
                    className="text-rose-400/60 hover:text-rose-400 p-1 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}

              {candidateMeds.length === 0 && (
                <div className="p-3 text-center text-xs text-[#E8EDEA]/40 border border-dashed border-white/10 rounded-xl">
                  No candidate medications added. Click below to add.
                </div>
              )}
            </div>

            {/* Add Med Dropdown Strip */}
            <div className="p-3 rounded-xl bg-[#0D120E] border border-white/5 space-y-2.5">
              <span className="text-[11px] text-[#E8EDEA]/60 font-mono">Add from Validated Database:</span>
              <div className="grid grid-cols-2 gap-2">
                <select
                  value={newMedName}
                  onChange={(e) => setNewMedName(e.target.value)}
                  className="bg-[#141B16] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-[#E8EDEA]"
                >
                  {Object.values(MEDICATION_RULES_DATABASE).map((rule) => (
                    <option key={rule.generic_name} value={rule.generic_name}>
                      {rule.generic_name} ({rule.drug_class})
                    </option>
                  ))}
                </select>
                <input
                  type="date"
                  value={newMedLastDose}
                  onChange={(e) => setNewMedLastDose(e.target.value)}
                  className="bg-[#141B16] border border-white/10 rounded-lg px-2 py-1.5 text-xs text-[#E8EDEA] font-mono"
                />
              </div>

              <button
                type="button"
                onClick={handleAddMedication}
                className="w-full py-2 rounded-lg bg-[#A8C69F]/20 hover:bg-[#A8C69F]/30 text-[#A8C69F] border border-[#A8C69F]/30 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Medication to Clearance Review
              </button>
            </div>

            {/* Execute Calculation Button */}
            <button
              type="button"
              onClick={handleRunEvaluation}
              className="w-full py-3 rounded-xl bg-[#A8C69F] hover:bg-[#b8d6af] text-[#0A0D0B] font-bold text-xs transition-all shadow-lg flex items-center justify-center gap-2"
            >
              <Sparkles className="w-4 h-4 text-[#0A0D0B]" />
              Run Evidence-Weighted Interaction Evaluation
            </button>
          </div>

        </div>

        {/* Right Column: Output Contract, Risk Scores & CYP Matrix (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {evaluation && (
            <>
              {/* Overall Risk Summary Card */}
              <div className={`rounded-2xl p-6 border shadow-xl space-y-4 ${
                evaluation.risk_summary.overall_risk_level === 'contraindicated'
                  ? 'bg-[#241212] border-rose-500/50'
                  : evaluation.risk_summary.overall_risk_level === 'high'
                  ? 'bg-[#221B12] border-amber-500/50'
                  : evaluation.risk_summary.overall_risk_level === 'moderate'
                  ? 'bg-[#1D1E13] border-yellow-500/50'
                  : 'bg-[#121B15] border-emerald-500/50'
              }`}>
                
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-xs font-mono text-[#E8EDEA]/60 uppercase tracking-wider">
                      Pharmacological Clearance Evaluation
                    </span>
                    <h3 className="text-xl font-serif font-bold text-[#E8EDEA] mt-1">
                      {plannedSubstance.toUpperCase()} ({plannedDoseMg}mg) Clearance Summary
                    </h3>
                  </div>
                  {getRiskBadge(evaluation.risk_summary.overall_risk_level)}
                </div>

                {/* Serotonin Toxicity Score Bar */}
                <div className="space-y-1.5 bg-[#0D120E]/70 p-4 rounded-xl border border-white/5">
                  <div className="flex justify-between items-center text-xs font-mono">
                    <span className="text-[#E8EDEA]/70">Cumulative Serotonin Toxicity Index:</span>
                    <span className={`font-bold ${
                      evaluation.risk_summary.serotonin_toxicity_score >= 60 
                        ? 'text-rose-400' 
                        : evaluation.risk_summary.serotonin_toxicity_score >= 30 
                        ? 'text-amber-400' 
                        : 'text-emerald-400'
                    }`}>
                      {evaluation.risk_summary.serotonin_toxicity_score} / 100
                    </span>
                  </div>
                  <div className="w-full h-2.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full transition-all duration-500 ${
                        evaluation.risk_summary.serotonin_toxicity_score >= 60
                          ? 'bg-rose-500'
                          : evaluation.risk_summary.serotonin_toxicity_score >= 30
                          ? 'bg-amber-500'
                          : 'bg-emerald-500'
                      }`}
                      style={{ width: `${Math.max(5, evaluation.risk_summary.serotonin_toxicity_score)}%` }}
                    />
                  </div>
                </div>

                {/* Absolute & Relative Warnings */}
                {evaluation.absolute_contraindications.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs space-y-1 text-rose-200">
                    <span className="font-bold flex items-center gap-1.5 font-mono text-rose-300">
                      <ShieldAlert className="w-4 h-4" />
                      CRITICAL CLINICAL STOPS:
                    </span>
                    {evaluation.absolute_contraindications.map((contra, i) => (
                      <p key={i} className="pl-5 leading-relaxed font-light">{contra}</p>
                    ))}
                  </div>
                )}

                {evaluation.relative_contraindications.length > 0 && (
                  <div className="p-3.5 rounded-xl bg-amber-950/40 border border-amber-500/30 text-xs space-y-1 text-amber-200">
                    <span className="font-bold flex items-center gap-1.5 font-mono text-amber-300">
                      <AlertTriangle className="w-4 h-4" />
                      PRECAUTIONARY PROTOCOL MODIFIERS:
                    </span>
                    {evaluation.relative_contraindications.map((rel, i) => (
                      <p key={i} className="pl-5 leading-relaxed font-light">{rel}</p>
                    ))}
                  </div>
                )}

              </div>

              {/* Washout Recommendations Table */}
              <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-5 space-y-4">
                <span className="text-xs font-mono text-[#A8C69F] flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  Washout Timeline Recommendations (Evidence-Graded)
                </span>

                <div className="space-y-3">
                  {evaluation.washout_recommendations.map((w, idx) => (
                    <div 
                      key={idx}
                      className="p-3.5 rounded-xl bg-[#0D120E] border border-white/5 space-y-2 text-xs"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[#E8EDEA]">{w.medication}</span>
                          <span className="px-2 py-0.5 rounded bg-[#1A261F] text-[#A8C69F] font-mono text-[10px]">
                            Grade {w.evidence_grade}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] font-mono">
                          <span className="text-[#E8EDEA]/60">Min: <strong className="text-[#E8EDEA]">{w.minimum_washout_days}d</strong></span>
                          <span className="text-[#E8EDEA]/30">•</span>
                          <span className="text-[#E8EDEA]/60">Preferred: <strong className="text-[#A8C69F]">{w.preferred_washout_days}d</strong></span>
                          <span className={`px-2 py-0.5 rounded text-[10px] ${w.washout_complete ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
                            {w.washout_complete ? 'Washout Satisfied' : 'Washout Incomplete'}
                          </span>
                        </div>
                      </div>
                      <p className="text-[11px] text-[#E8EDEA]/70 leading-relaxed font-light">
                        {w.rationale}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CYP Interaction Matrix Card */}
              <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-5 space-y-4">
                <span className="text-xs font-mono text-[#D4B8E5] flex items-center gap-1.5">
                  <Dna className="w-3.5 h-3.5" />
                  CYP450 & Monoamine Clearance Pathways
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  
                  <div className="p-3 rounded-xl bg-[#0D120E] border border-white/5 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold font-mono text-[#A8C69F]">CYP2D6 Pathway</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#E8EDEA]/70">
                        {evaluation.cyp_interaction_matrix.cyp2d6.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#E8EDEA]/60 leading-relaxed">
                      {evaluation.cyp_interaction_matrix.cyp2d6.impact_on_entheogen}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0D120E] border border-white/5 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold font-mono text-[#A8C69F]">CYP3A4 Pathway</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#E8EDEA]/70">
                        {evaluation.cyp_interaction_matrix.cyp3a4.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#E8EDEA]/60 leading-relaxed">
                      {evaluation.cyp_interaction_matrix.cyp3a4.impact_on_entheogen}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0D120E] border border-white/5 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold font-mono text-[#A8C69F]">CYP1A2 Pathway</span>
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 text-[#E8EDEA]/70">
                        {evaluation.cyp_interaction_matrix.cyp1a2.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#E8EDEA]/60 leading-relaxed">
                      {evaluation.cyp_interaction_matrix.cyp1a2.impact_on_entheogen}
                    </p>
                  </div>

                  <div className="p-3 rounded-xl bg-[#0D120E] border border-white/5 space-y-1.5">
                    <div className="flex justify-between items-center">
                      <span className="font-bold font-mono text-[#A8C69F]">Monoamine Oxidase (MAO)</span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                        evaluation.cyp_interaction_matrix.mao.status === 'High Risk'
                          ? 'bg-rose-500/20 text-rose-300'
                          : 'bg-white/5 text-[#E8EDEA]/70'
                      }`}>
                        {evaluation.cyp_interaction_matrix.mao.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-[#E8EDEA]/60 leading-relaxed">
                      {evaluation.cyp_interaction_matrix.mao.impact_on_entheogen}
                    </p>
                  </div>

                </div>
              </div>

              {/* SOAP Chart Insert & QHP Attestation */}
              <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono text-[#C8B195] flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5" />
                    Clinical SOAP Note Insert & QHP Attestation
                  </span>
                  <button
                    type="button"
                    onClick={handleCopySoapNotes}
                    className="text-xs text-[#A8C69F] hover:underline font-mono"
                  >
                    {showCopiedAlert ? 'Copied to Clipboard!' : 'Copy to Clinical Chart'}
                  </button>
                </div>

                <pre className="p-3.5 rounded-xl bg-[#0D120E] border border-white/5 text-[11px] font-mono text-[#E8EDEA]/70 whitespace-pre-wrap leading-relaxed">
                  {evaluation.clinical_notes_for_chart}
                </pre>

                <div className="p-4 rounded-xl bg-[#0D120E] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="text-xs text-[#E8EDEA]/70">
                    <div className="font-bold text-[#E8EDEA] flex items-center gap-1.5">
                      <Lock className="w-3.5 h-3.5 text-[#A8C69F]" />
                      21 CFR Part 11 Electronic Signature
                    </div>
                    <div className="text-[11px] text-[#E8EDEA]/50">
                      Licensed QHP must review and affirm pharmacological safety prior to vault dispensing.
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleSignEvaluation}
                    disabled={qhpSigned}
                    className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                      qhpSigned 
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 cursor-default'
                        : 'bg-[#A8C69F] hover:bg-[#b8d6af] text-[#0A0D0B] shadow-md'
                    }`}
                  >
                    {qhpSigned ? 'Signed & Appended to Audit Ledger' : 'Sign & Approve Clearance'}
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

      </div>

    </div>
  );
};
