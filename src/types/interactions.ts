/**
 * Cindevra 4.0 Canopy Layer — Multi-Substance Pharmacodynamic & CYP450 Interaction Contracts
 * 
 * Defines the deterministic data architecture, rule engine models, and clinical evaluation
 * outputs for detecting serotonin toxicity, CYP enzyme inhibition/induction, and washout timelines.
 */

// ==========================================
// 1. INPUT CONTRACTS
// ==========================================

export type EntheogenSubstance = 
  | 'psilocybin' 
  | 'mdma' 
  | '5meo_dmt' 
  | 'ketamine' 
  | 'ibogaine' 
  | 'other';

export type AdministrationRoute = 
  | 'oral' 
  | 'intranasal' 
  | 'intravenous' 
  | 'intramuscular' 
  | 'sublingual';

export type CYP2D6Phenotype = 
  | 'poor' 
  | 'intermediate' 
  | 'normal' 
  | 'ultrarapid' 
  | 'unknown';

export type CYP3A4Status = 
  | 'inhibited' 
  | 'induced' 
  | 'normal' 
  | 'unknown';

export interface CandidateMedication {
  name: string;                         // e.g. "Sertraline", "Phenelzine", "Lithium"
  rxnorm_cui?: string | null;
  dose_mg?: number | null;
  frequency?: string | null;           // e.g. "Once daily", "BID", "PRN"
  last_dose_datetime?: string | null;  // ISO-8601 string
  indication?: string | null;          // e.g. "Major Depressive Disorder"
}

export interface PlannedEntheogen {
  substance: EntheogenSubstance;
  planned_dose_mg: number | null;
  route: AdministrationRoute;
}

export interface PatientMetabolicFactors {
  age: number;
  weight_kg: number | null;
  known_cyp2d6_phenotype: CYP2D6Phenotype;
  known_cyp3a4_status: CYP3A4Status;
  hepatic_impairment: boolean;
  renal_impairment: boolean;
}

export interface DrugInteractionQuery {
  patient_journey_id: string;
  candidate_medications: CandidateMedication[];
  planned_entheogen: PlannedEntheogen;
  patient_factors: PatientMetabolicFactors;
}

// ==========================================
// 2. OUTPUT CONTRACTS
// ==========================================

export type OverallRiskLevel = 
  | 'low' 
  | 'moderate' 
  | 'high' 
  | 'contraindicated';

export type EvidenceGrade = 
  | 'A' 
  | 'B' 
  | 'C' 
  | 'expert_consensus';

export interface RiskSummary {
  overall_risk_level: OverallRiskLevel;
  serotonin_toxicity_score: number;    // Scale: 0 - 100
  primary_concerns: string[];
}

export interface WashoutRecommendation {
  medication: string;
  minimum_washout_days: number;
  preferred_washout_days: number;
  rationale: string;
  evidence_grade: EvidenceGrade;
  current_washout_elapsed_days?: number | null;
  washout_complete: boolean;
}

export interface CYPPathwayStatus {
  status: 'Uninhibited' | 'Competitive Substrate' | 'Strongly Inhibited' | 'Induced' | 'High Risk';
  impact_on_entheogen: string;
  impact_on_medication: string;
}

export interface CYPInteractionMatrix {
  cyp2d6: CYPPathwayStatus;
  cyp3a4: CYPPathwayStatus;
  cyp1a2: CYPPathwayStatus;
  mao: CYPPathwayStatus;
}

export interface DrugInteractionEvaluation {
  query_timestamp_utc: string;
  patient_journey_id: string;
  planned_entheogen: PlannedEntheogen;
  risk_summary: RiskSummary;
  washout_recommendations: WashoutRecommendation[];
  cyp_interaction_matrix: CYPInteractionMatrix;
  absolute_contraindications: string[];
  relative_contraindications: string[];
  monitoring_requirements: string[];
  clinical_notes_for_chart: string;    // Formatted for direct SOAP note inclusion
  qhp_decision_status: 'pending_review' | 'qhp_approved' | 'dosing_aborted';
  qhp_signature?: string | null;
}

// ==========================================
// 3. SEED CLINICAL RULE MODEL
// ==========================================

export interface MedicationRuleDefinition {
  generic_name: string;
  brand_names: string[];
  drug_class: 'SSRI' | 'SNRI' | 'MAOI_Irreversible' | 'MAOI_RIMA' | 'TCA' | 'Mood_Stabilizer' | 'Stimulant' | 'Opioid' | 'Triptan' | 'Supplements' | 'Antipsychotic' | 'Other';
  half_life_hours: number;
  min_washout_days: {
    psilocybin: number;
    mdma: number;
    '5meo_dmt': number;
    ketamine: number;
    ibogaine: number;
  };
  preferred_washout_days: {
    psilocybin: number;
    mdma: number;
    '5meo_dmt': number;
    ketamine: number;
    ibogaine: number;
  };
  serotonin_toxicity_risk: {
    psilocybin: 'low' | 'moderate' | 'high' | 'contraindicated';
    mdma: 'low' | 'moderate' | 'high' | 'contraindicated';
    '5meo_dmt': 'low' | 'moderate' | 'high' | 'contraindicated';
    ketamine: 'low' | 'moderate' | 'high' | 'contraindicated';
    ibogaine: 'low' | 'moderate' | 'high' | 'contraindicated';
  };
  primary_cyp_enzymes: ('CYP2D6' | 'CYP3A4' | 'CYP1A2' | 'MAO_A' | 'MAO_B' | 'CYP2C19' | 'CYP2B6' | 'CYP2C9')[];
  rationale: string;
  evidence_grade: EvidenceGrade;
  evidence_source: string;
}
