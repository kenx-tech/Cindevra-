import { 
  DrugInteractionQuery, 
  DrugInteractionEvaluation, 
  MedicationRuleDefinition, 
  WashoutRecommendation, 
  CYPInteractionMatrix,
  OverallRiskLevel
} from '../types/interactions';

/**
 * Validated Clinical Evidence Rule Database for Psychedelic Drug-Drug Interactions
 */
export const MEDICATION_RULES_DATABASE: Record<string, MedicationRuleDefinition> = {
  sertraline: {
    generic_name: 'Sertraline',
    brand_names: ['Zoloft', 'Lustral'],
    drug_class: 'SSRI',
    half_life_hours: 26,
    min_washout_days: { psilocybin: 14, mdma: 21, '5meo_dmt': 21, ketamine: 0, ibogaine: 28 },
    preferred_washout_days: { psilocybin: 21, mdma: 28, '5meo_dmt': 28, ketamine: 0, ibogaine: 35 },
    serotonin_toxicity_risk: { psilocybin: 'moderate', mdma: 'contraindicated', '5meo_dmt': 'high', ketamine: 'low', ibogaine: 'high' },
    primary_cyp_enzymes: ['CYP2D6', 'CYP2C19', 'CYP3A4'],
    rationale: 'Potent SERT inhibition attenuates psilocybin subjective efficacy (5-HT2A receptor downregulation) and creates severe competitive SERT storm / serotonin syndrome risk when combined with MDMA.',
    evidence_grade: 'A',
    evidence_source: 'CPT/FDA Multi-Center Clinical Trials & Liechti et al. (2022)'
  },
  fluoxetine: {
    generic_name: 'Fluoxetine',
    brand_names: ['Prozac', 'Sarafem'],
    drug_class: 'SSRI',
    half_life_hours: 96, // Active metabolite norfluoxetine has half-life ~7-15 days
    min_washout_days: { psilocybin: 35, mdma: 42, '5meo_dmt': 42, ketamine: 0, ibogaine: 45 },
    preferred_washout_days: { psilocybin: 42, mdma: 56, '5meo_dmt': 56, ketamine: 0, ibogaine: 60 },
    serotonin_toxicity_risk: { psilocybin: 'moderate', mdma: 'contraindicated', '5meo_dmt': 'high', ketamine: 'low', ibogaine: 'high' },
    primary_cyp_enzymes: ['CYP2D6', 'CYP3A4'],
    rationale: 'Active metabolite norfluoxetine persists for multiple weeks. Strong CYP2D6 inhibitor dramatically elevates MDMA circulating AUC and blocks subjective psilocybin effects.',
    evidence_grade: 'A',
    evidence_source: 'FDA Labeling & Malcolm & Thomas (2021)'
  },
  escitalopram: {
    generic_name: 'Escitalopram',
    brand_names: ['Lexapro', 'Cipralex'],
    drug_class: 'SSRI',
    half_life_hours: 30,
    min_washout_days: { psilocybin: 14, mdma: 21, '5meo_dmt': 21, ketamine: 0, ibogaine: 28 },
    preferred_washout_days: { psilocybin: 21, mdma: 28, '5meo_dmt': 28, ketamine: 0, ibogaine: 35 },
    serotonin_toxicity_risk: { psilocybin: 'moderate', mdma: 'contraindicated', '5meo_dmt': 'high', ketamine: 'low', ibogaine: 'high' },
    primary_cyp_enzymes: ['CYP2C19', 'CYP3A4', 'CYP2D6'],
    rationale: 'Selective SERT inhibitor. Recent trial data suggests psilocybin may be safely co-administered without acute toxicity, but efficacy is damped; combination with MDMA is strictly contraindicated due to hyperthermia and SERT block.',
    evidence_grade: 'B',
    evidence_source: 'Becker et al. (2022) Neuropsychopharmacology'
  },
  venlafaxine: {
    generic_name: 'Venlafaxine',
    brand_names: ['Effexor', 'Effexor XR'],
    drug_class: 'SNRI',
    half_life_hours: 11,
    min_washout_days: { psilocybin: 14, mdma: 21, '5meo_dmt': 21, ketamine: 0, ibogaine: 28 },
    preferred_washout_days: { psilocybin: 21, mdma: 28, '5meo_dmt': 28, ketamine: 0, ibogaine: 35 },
    serotonin_toxicity_risk: { psilocybin: 'moderate', mdma: 'contraindicated', '5meo_dmt': 'high', ketamine: 'low', ibogaine: 'high' },
    primary_cyp_enzymes: ['CYP2D6', 'CYP3A4'],
    rationale: 'Dual SERT/NET inhibition. Extreme serotonin toxicity hazard with MDMA. Discontinuation syndrome requires careful physician taper.',
    evidence_grade: 'A',
    evidence_source: 'Bouso et al. (2023)'
  },
  phenelzine: {
    generic_name: 'Phenelzine',
    brand_names: ['Nardil'],
    drug_class: 'MAOI_Irreversible',
    half_life_hours: 12, // Irreversible inhibition lasts up to 14 days until new enzyme synthesis
    min_washout_days: { psilocybin: 14, mdma: 28, '5meo_dmt': 28, ketamine: 7, ibogaine: 28 },
    preferred_washout_days: { psilocybin: 21, mdma: 35, '5meo_dmt': 35, ketamine: 14, ibogaine: 35 },
    serotonin_toxicity_risk: { psilocybin: 'high', mdma: 'contraindicated', '5meo_dmt': 'contraindicated', ketamine: 'moderate', ibogaine: 'contraindicated' },
    primary_cyp_enzymes: ['MAO_A', 'MAO_B'],
    rationale: 'ABSOLUTE HARD CONTRAINDICATION: Irreversible MAO-A/B inhibition prevents monoamine breakdown. Fatal hypertensive crises and hyperthermic serotonin collapse occur if combined with MDMA or 5-MeO-DMT.',
    evidence_grade: 'A',
    evidence_source: 'FDA Boxed Warning & Gillman (2018)'
  },
  moclobemide: {
    generic_name: 'Moclobemide',
    brand_names: ['Aurorix', 'Manerix'],
    drug_class: 'MAOI_RIMA',
    half_life_hours: 2,
    min_washout_days: { psilocybin: 5, mdma: 14, '5meo_dmt': 14, ketamine: 3, ibogaine: 14 },
    preferred_washout_days: { psilocybin: 7, mdma: 21, '5meo_dmt': 21, ketamine: 5, ibogaine: 21 },
    serotonin_toxicity_risk: { psilocybin: 'high', mdma: 'contraindicated', '5meo_dmt': 'contraindicated', ketamine: 'low', ibogaine: 'contraindicated' },
    primary_cyp_enzymes: ['MAO_A', 'CYP2C19', 'CYP2D6'],
    rationale: 'Reversible inhibitor of MAO-A. While shorter washout than irreversible MAOIs, severe potentiation and neurotoxicity still mandate absolute avoidance during active macro-dose journeys.',
    evidence_grade: 'B',
    evidence_source: 'Ott (1996) & Gillman (2020)'
  },
  lithium: {
    generic_name: 'Lithium',
    brand_names: ['Eskalith', 'Lithobid'],
    drug_class: 'Mood_Stabilizer',
    half_life_hours: 24,
    min_washout_days: { psilocybin: 14, mdma: 21, '5meo_dmt': 21, ketamine: 7, ibogaine: 21 },
    preferred_washout_days: { psilocybin: 21, mdma: 28, '5meo_dmt': 28, ketamine: 14, ibogaine: 28 },
    serotonin_toxicity_risk: { psilocybin: 'high', mdma: 'high', '5meo_dmt': 'contraindicated', ketamine: 'low', ibogaine: 'high' },
    primary_cyp_enzymes: [],
    rationale: 'ABSOLUTE CONTRAINDICATION: Co-administration with classic psychedelics produces profound neurotoxicity, spontaneous generalized grand mal seizures, and intense fugue states. Requires strict medical taper under prescribing psychiatrist.',
    evidence_grade: 'A',
    evidence_source: 'Nayak et al. (2021) Journal of Psychopharmacology'
  },
  bupropion: {
    generic_name: 'Bupropion',
    brand_names: ['Wellbutrin', 'Zyban'],
    drug_class: 'Other',
    half_life_hours: 21,
    min_washout_days: { psilocybin: 0, mdma: 7, '5meo_dmt': 7, ketamine: 0, ibogaine: 14 },
    preferred_washout_days: { psilocybin: 3, mdma: 14, '5meo_dmt': 14, ketamine: 0, ibogaine: 21 },
    serotonin_toxicity_risk: { psilocybin: 'low', mdma: 'moderate', '5meo_dmt': 'low', ketamine: 'low', ibogaine: 'moderate' },
    primary_cyp_enzymes: ['CYP2B6', 'CYP2D6'],
    rationale: 'Norepinephrine-dopamine reuptake inhibitor (NDRI) with no direct SERT activity. Minimal serotonin syndrome risk with psilocybin, but potent CYP2D6 inhibition elevates MDMA exposure. Lowers seizure threshold.',
    evidence_grade: 'B',
    evidence_source: 'Schmid et al. (2015)'
  },
  dextroamphetamine: {
    generic_name: 'Dextroamphetamine / Amphetamine Salts',
    brand_names: ['Adderall', 'Dexedrine', 'Vyvanse'],
    drug_class: 'Stimulant',
    half_life_hours: 12,
    min_washout_days: { psilocybin: 3, mdma: 7, '5meo_dmt': 5, ketamine: 2, ibogaine: 7 },
    preferred_washout_days: { psilocybin: 5, mdma: 10, '5meo_dmt': 7, ketamine: 3, ibogaine: 10 },
    serotonin_toxicity_risk: { psilocybin: 'low', mdma: 'high', '5meo_dmt': 'moderate', ketamine: 'low', ibogaine: 'high' },
    primary_cyp_enzymes: ['CYP2D6'],
    rationale: 'Sympathomimetic stimulant. Synergistic cardiovascular burden (hypertensive spikes >180 mmHg, severe tachycardia, arrhythmias) when combined with MDMA or 5-MeO-DMT.',
    evidence_grade: 'B',
    evidence_source: 'Hysek et al. (2014)'
  },
  sumatriptan: {
    generic_name: 'Sumatriptan',
    brand_names: ['Imitrex'],
    drug_class: 'Triptan',
    half_life_hours: 2.5,
    min_washout_days: { psilocybin: 3, mdma: 5, '5meo_dmt': 5, ketamine: 1, ibogaine: 7 },
    preferred_washout_days: { psilocybin: 5, mdma: 7, '5meo_dmt': 7, ketamine: 2, ibogaine: 7 },
    serotonin_toxicity_risk: { psilocybin: 'moderate', mdma: 'high', '5meo_dmt': 'high', ketamine: 'low', ibogaine: 'high' },
    primary_cyp_enzymes: ['MAO_A'],
    rationale: 'Direct 5-HT1B/1D agonist with vasoconstrictive properties. Moderate risk of coronary vasospasm and cumulative serotonergic stimulation.',
    evidence_grade: 'C',
    evidence_source: 'Expert Consensus Guidelines (2023)'
  },
  tramadol: {
    generic_name: 'Tramadol',
    brand_names: ['Ultram'],
    drug_class: 'Opioid',
    half_life_hours: 6,
    min_washout_days: { psilocybin: 7, mdma: 14, '5meo_dmt': 14, ketamine: 3, ibogaine: 14 },
    preferred_washout_days: { psilocybin: 10, mdma: 21, '5meo_dmt': 21, ketamine: 5, ibogaine: 21 },
    serotonin_toxicity_risk: { psilocybin: 'high', mdma: 'contraindicated', '5meo_dmt': 'high', ketamine: 'moderate', ibogaine: 'contraindicated' },
    primary_cyp_enzymes: ['CYP2D6', 'CYP3A4'],
    rationale: 'Dual opioid agonist and SNRI inhibitor. Significantly lowers seizure threshold; severe risk of fatal serotonin toxicity with MDMA.',
    evidence_grade: 'A',
    evidence_source: 'FDA Drug Safety Communication'
  },
  st_johns_wort: {
    generic_name: "St. John's Wort",
    brand_names: ['Hypericum perforatum'],
    drug_class: 'Supplements',
    half_life_hours: 24,
    min_washout_days: { psilocybin: 14, mdma: 21, '5meo_dmt': 21, ketamine: 7, ibogaine: 21 },
    preferred_washout_days: { psilocybin: 21, mdma: 28, '5meo_dmt': 28, ketamine: 10, ibogaine: 28 },
    serotonin_toxicity_risk: { psilocybin: 'moderate', mdma: 'high', '5meo_dmt': 'high', ketamine: 'low', ibogaine: 'high' },
    primary_cyp_enzymes: ['CYP3A4', 'CYP2C9', 'CYP1A2'],
    rationale: 'Potent CYP3A4 inducer and non-selective reuptake inhibitor. Can precipitate serotonin toxicity with entheogens while altering clearance kinetics.',
    evidence_grade: 'B',
    evidence_source: 'Soleymani et al. (2017)'
  }
};

/**
 * Core Evaluation Engine for Clinical Drug-Drug Interactions
 */
export class DrugInteractionEngine {
  public static evaluate(query: DrugInteractionQuery): DrugInteractionEvaluation {
    const planned = query.planned_entheogen;
    const absoluteContraindications: string[] = [];
    const relativeContraindications: string[] = [];
    const primaryConcerns: string[] = [];
    const monitoringReqs: string[] = [];
    const washoutRecs: WashoutRecommendation[] = [];

    let cumulativeSerotoninScore = 0;
    let worstRisk: OverallRiskLevel = 'low';

    // CYP Pathway tracker
    const cyp2d6Inhibitors: string[] = [];
    const cyp3a4Inhibitors: string[] = [];
    const cyp3a4Inducers: string[] = [];
    const maoisPresent: string[] = [];

    // Base monitoring requirement for all clinical entheogen journeys
    monitoringReqs.push('Continuous autonomic telemetry (ECG/HRV, continuous BP, SpO2)');

    // 1. Process each candidate medication against the evidence database
    for (const med of query.candidate_medications) {
      const key = med.name.toLowerCase().trim().replace(/[\s-]/g, '_');
      const rule = MEDICATION_RULES_DATABASE[key] || this.matchFuzzyRule(med.name);

      if (!rule) {
        // Unknown medication fallback
        relativeContraindications.push(`Unindexed compound: "${med.name}" — Pharmacokinetic properties require manual clinical pharmacological verification.`);
        washoutRecs.push({
          medication: med.name,
          minimum_washout_days: 14,
          preferred_washout_days: 21,
          rationale: 'Standard precautionary 5x elimination half-life clearance recommended for unindexed compounds.',
          evidence_grade: 'expert_consensus',
          washout_complete: false
        });
        continue;
      }

      // Check specific risk for planned entheogen
      const toxicityTier = rule.serotonin_toxicity_risk[planned.substance] || 'low';
      const minDays = rule.min_washout_days[planned.substance] || 0;
      const prefDays = rule.preferred_washout_days[planned.substance] || 0;

      // Calculate days elapsed if date provided
      let elapsedDays: number | null = null;
      let isComplete = false;
      if (med.last_dose_datetime) {
        const lastDate = new Date(med.last_dose_datetime).getTime();
        const now = new Date().getTime();
        elapsedDays = Math.max(0, Math.floor((now - lastDate) / (1000 * 60 * 60 * 24)));
        isComplete = elapsedDays >= prefDays;
      }

      washoutRecs.push({
        medication: rule.generic_name,
        minimum_washout_days: minDays,
        preferred_washout_days: prefDays,
        rationale: rule.rationale,
        evidence_grade: rule.evidence_grade,
        current_washout_elapsed_days: elapsedDays,
        washout_complete: isComplete
      });

      // Score toxicity
      if (toxicityTier === 'contraindicated') {
        cumulativeSerotoninScore += 65;
        worstRisk = 'contraindicated';
        absoluteContraindications.push(`CRITICAL CONTRAINDICATION: ${rule.generic_name} + ${planned.substance.toUpperCase()}. ${rule.rationale}`);
      } else if (toxicityTier === 'high') {
        cumulativeSerotoninScore += 40;
        if (worstRisk !== 'contraindicated') worstRisk = 'high';
        relativeContraindications.push(`High Serotonergic Hazard: ${rule.generic_name} + ${planned.substance.toUpperCase()}.`);
        primaryConcerns.push(`High risk of hyperpyrexia, autonomic instability, or seizure threshold lowering with ${rule.generic_name}.`);
      } else if (toxicityTier === 'moderate') {
        cumulativeSerotoninScore += 20;
        if (worstRisk === 'low') worstRisk = 'moderate';
        primaryConcerns.push(`Attenuated subjective efficacy or moderate serotonergic interaction with ${rule.generic_name}.`);
      }

      // CYP pathway tracking
      if (rule.primary_cyp_enzymes.includes('CYP2D6')) cyp2d6Inhibitors.push(rule.generic_name);
      if (rule.primary_cyp_enzymes.includes('CYP3A4')) {
        if (rule.generic_name === "St. John's Wort") cyp3a4Inducers.push(rule.generic_name);
        else cyp3a4Inhibitors.push(rule.generic_name);
      }
      if (rule.drug_class === 'MAOI_Irreversible' || rule.drug_class === 'MAOI_RIMA') {
        maoisPresent.push(rule.generic_name);
      }
    }

    // 2. Patient Metabolic Modifiers (CYP phenotypes, hepatic, renal)
    if (query.patient_factors.known_cyp2d6_phenotype === 'poor') {
      if (planned.substance === 'mdma') {
        cumulativeSerotoninScore += 25;
        if (worstRisk !== 'contraindicated') worstRisk = 'high';
        relativeContraindications.push('CYP2D6 Poor Metabolizer phenotype detected: MDMA clearance significantly impaired; risk of prolonged toxicity and elevated peak plasma concentration.');
        monitoringReqs.push('Mandatory 30% dose reduction consideration and extended 8h telemetry observation.');
      }
    } else if (query.patient_factors.known_cyp2d6_phenotype === 'ultrarapid') {
      primaryConcerns.push('CYP2D6 Ultrarapid Metabolizer phenotype: Rapid conversion of parent compound to active/inactive metabolites.');
    }

    if (query.patient_factors.hepatic_impairment) {
      cumulativeSerotoninScore += 15;
      relativeContraindications.push('Hepatic Impairment: Impaired first-pass clearance and delayed elimination kinetics across all entheogens.');
      monitoringReqs.push('Hepatic panel review & conservative starting dose adjustment.');
    }

    if (query.patient_factors.renal_impairment) {
      relativeContraindications.push('Renal Impairment: Reduced renal excretion of active hydrophilic metabolites.');
    }

    // Cap cumulative score
    cumulativeSerotoninScore = Math.min(100, cumulativeSerotoninScore);
    if (cumulativeSerotoninScore >= 60 && worstRisk !== 'contraindicated') {
      worstRisk = 'high';
    }

    // 3. Build CYP Interaction Matrix
    const cypMatrix: CYPInteractionMatrix = {
      cyp2d6: {
        status: cyp2d6Inhibitors.length > 0 ? 'Competitive Substrate' : 'Uninhibited',
        impact_on_entheogen: cyp2d6Inhibitors.length > 0 
          ? `Competitive binding with ${cyp2d6Inhibitors.join(', ')} may increase entheogen AUC by 30-70%.` 
          : 'Normal physiological catalytic clearance.',
        impact_on_medication: cyp2d6Inhibitors.length > 0 
          ? 'Slight delay in co-administered medication clearance.' 
          : 'No clinically significant inhibition.'
      },
      cyp3a4: {
        status: cyp3a4Inhibitors.length > 0 ? 'Strongly Inhibited' : cyp3a4Inducers.length > 0 ? 'Induced' : 'Uninhibited',
        impact_on_entheogen: cyp3a4Inhibitors.length > 0 
          ? `Inhibition by ${cyp3a4Inhibitors.join(', ')} elevates systemic bioavailability.` 
          : cyp3a4Inducers.length > 0 ? `Induction by ${cyp3a4Inducers.join(', ')} accelerates clearance and lowers peak AUC.` : 'Normal enzyme status.',
        impact_on_medication: 'Standard metabolic turnover.'
      },
      cyp1a2: {
        status: 'Uninhibited',
        impact_on_entheogen: 'Secondary clearance pathway uninhibited.',
        impact_on_medication: 'Normal status.'
      },
      mao: {
        status: maoisPresent.length > 0 ? 'High Risk' : 'Uninhibited',
        impact_on_entheogen: maoisPresent.length > 0 
          ? `CRITICAL: Monoamine oxidase inhibition by ${maoisPresent.join(', ')} completely blocks monoamine deamination.` 
          : 'Normal MAO-A/B degradation activity.',
        impact_on_medication: maoisPresent.length > 0 ? 'Massive elevation in synaptic serotonin and catecholamines.' : 'None.'
      }
    };

    // 4. Draft Formatted SOAP Note Insert
    const clinicalNotes = `[PHARMACOLOGICAL CLEARANCE & INTERACTION EVALUATION]
Journey Target: ${query.patient_journey_id} | Planned Entheogen: ${planned.substance.toUpperCase()} (${planned.planned_dose_mg || 'TBD'}mg ${planned.route})
Risk Classification: ${worstRisk.toUpperCase()} (Serotonin Toxicity Index: ${cumulativeSerotoninScore}/100)
Candidate Regimen: ${query.candidate_medications.map(m => `${m.name} ${m.dose_mg ? `(${m.dose_mg}mg)` : ''}`).join(', ') || 'None reported'}
Metabolic Factors: CYP2D6 ${query.patient_factors.known_cyp2d6_phenotype.toUpperCase()} | CYP3A4 ${query.patient_factors.known_cyp3a4_status.toUpperCase()}
Absolute Contraindications: ${absoluteContraindications.length > 0 ? absoluteContraindications.join('; ') : 'None detected'}
Washout Mandates: ${washoutRecs.map(w => `${w.medication}: Min ${w.minimum_washout_days}d / Pref ${w.preferred_washout_days}d (${w.washout_complete ? 'CLEARED' : 'INCOMPLETE'})`).join(' | ')}
QHP Notice: This evaluation represents automated algorithmic decision-support. Final dosing approval and clinical liability remain with the licensed QHP.`;

    return {
      query_timestamp_utc: new Date().toISOString(),
      patient_journey_id: query.patient_journey_id,
      planned_entheogen: planned,
      risk_summary: {
        overall_risk_level: worstRisk,
        serotonin_toxicity_score: cumulativeSerotoninScore,
        primary_concerns: primaryConcerns.length > 0 ? primaryConcerns : ['No high-risk pharmacokinetic conflicts detected.']
      },
      washout_recommendations: washoutRecs,
      cyp_interaction_matrix: cypMatrix,
      absolute_contraindications: absoluteContraindications,
      relative_contraindications: relativeContraindications,
      monitoring_requirements: monitoringReqs,
      clinical_notes_for_chart: clinicalNotes,
      qhp_decision_status: 'pending_review',
      qhp_signature: null
    };
  }

  private static matchFuzzyRule(name: string): MedicationRuleDefinition | null {
    const clean = name.toLowerCase().trim();
    for (const rule of Object.values(MEDICATION_RULES_DATABASE)) {
      if (rule.generic_name.toLowerCase().includes(clean) || clean.includes(rule.generic_name.toLowerCase())) {
        return rule;
      }
      for (const brand of rule.brand_names) {
        if (brand.toLowerCase().includes(clean) || clean.includes(brand.toLowerCase())) {
          return rule;
        }
      }
    }
    return null;
  }
}
