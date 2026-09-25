import React, { useState } from 'react';
import { 
  Sparkles, 
  Brain, 
  EyeOff, 
  TrendingUp, 
  ShieldCheck, 
  Sliders, 
  Activity, 
  Download,
  Share2,
  Atom,
  Database,
  LineChart,
  Pill
} from 'lucide-react';
import { useAether } from '../../context/AetherContext';
import { RESEARCH_OUTCOMES } from '../../data/mockData';
import { DrugInteractionCalculator } from './DrugInteractionCalculator';

export const CanopyLayer: React.FC = () => {
  const { patients, recordAudit } = useAether();

  const [activeTab, setActiveTab] = useState<'outcomes' | 'consciousness' | 'faucet' | 'predictive' | 'interactions'>('interactions');
  const [privacyEpsilon, setPrivacyEpsilon] = useState<number>(0.25);
  const [selectedConditionIdx, setSelectedConditionIdx] = useState<number>(0);
  const [doseCalcWeight, setDoseCalcWeight] = useState<number>(70); // kg
  const [doseCalcIndication, setDoseCalcIndication] = useState<'TRD' | 'PTSD' | 'EOL'>('TRD');
  const [simulatedDoseResult, setSimulatedDoseResult] = useState<number>(25);

  const handleCalculateDose = () => {
    let base = 25;
    if (doseCalcIndication === 'PTSD') base = 120;
    if (doseCalcIndication === 'EOL') base = 25;
    // Weight-adjusted adaptive micro-modulation
    const calculated = doseCalcIndication === 'PTSD' 
      ? Math.round((base * (doseCalcWeight / 70)) * 10) / 10
      : base;
    setSimulatedDoseResult(calculated);
    recordAudit(`Predictive dose estimated for ${doseCalcWeight}kg participant (${doseCalcIndication}): ${calculated}mg`, 'CLINICAL');
  };

  const activeOutcome = RESEARCH_OUTCOMES[selectedConditionIdx];

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Canopy Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#141B16] border border-[#D4B8E5]/30 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#D4B8E5] font-mono text-xs">
            <Sparkles className="w-4 h-4" />
            <span>4.0 Canopy — Intelligence & Research</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#E8EDEA] tracking-tight">
            Consciousness Intelligence & Anonymized Research
          </h1>
          <p className="text-xs sm:text-sm text-[#E8EDEA]/70 max-w-2xl font-light">
            Differential privacy outcome aggregation, Default Mode Network neuro-topography, MEQ-30 mystical correlation engines, and predictive biomarker safety modeling.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-[#0D120E] p-1.5 rounded-xl border border-[#E8EDEA]/10 self-start md:self-auto overflow-x-auto">
          <button
            id="canopy-tab-interactions"
            onClick={() => setActiveTab('interactions')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
              activeTab === 'interactions'
                ? 'bg-[#15221F] border border-[#D4B8E5]/40 text-[#D4B8E5] shadow'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
            }`}
          >
            <Pill className="w-3.5 h-3.5" />
            4.0 CYP450 Drug Interaction Guardian
          </button>
          <button
            id="canopy-tab-outcomes"
            onClick={() => setActiveTab('outcomes')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'outcomes'
                ? 'bg-[#15221F] border border-[#93C5B5]/40 text-[#93C5B5] shadow'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
            }`}
          >
            4.1 Outcome Analytics
          </button>
          <button
            id="canopy-tab-consciousness"
            onClick={() => setActiveTab('consciousness')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'consciousness'
                ? 'bg-[#15221F] border border-[#93C5B5]/40 text-[#93C5B5] shadow'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
            }`}
          >
            4.2 Consciousness Interface
          </button>
          <button
            id="canopy-tab-faucet"
            onClick={() => setActiveTab('faucet')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'faucet'
                ? 'bg-[#15221F] border border-[#93C5B5]/40 text-[#93C5B5] shadow'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
            }`}
          >
            4.3 Differential Privacy Faucet
          </button>
          <button
            id="canopy-tab-predictive"
            onClick={() => setActiveTab('predictive')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'predictive'
                ? 'bg-[#15221F] border border-[#93C5B5]/40 text-[#93C5B5] shadow'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
            }`}
          >
            4.4 Predictive Safety Models
          </button>
        </div>
      </div>

      {/* TAB 4.0: Drug Interaction Guardian */}
      {activeTab === 'interactions' && (
        <DrugInteractionCalculator />
      )}

      {/* TAB 4.1: Outcome Analytics */}
      {activeTab === 'outcomes' && (
        <div className="space-y-6">
          
          {/* Condition Selector Strip */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {RESEARCH_OUTCOMES.map((item, idx) => {
              const isSelected = selectedConditionIdx === idx;
              return (
                <button
                  key={item.condition}
                  onClick={() => setSelectedConditionIdx(idx)}
                  className={`p-4 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'bg-[#15221F] border-[#93C5B5] text-[#E8EDEA] glow-sage'
                      : 'bg-[#141B16] border-[#E8EDEA]/10 text-[#E8EDEA]/70 hover:border-[#E8EDEA]/20'
                  }`}
                >
                  <div className="text-[10px] font-mono text-[#D4B8E5] mb-1">
                    N = {item.sampleSize} Multi-Site Participants
                  </div>
                  <div className="font-semibold text-xs text-[#E8EDEA] line-clamp-1 font-sans">
                    {item.condition}
                  </div>
                  <div className="mt-2 text-lg font-bold font-mono text-[#A8C69F]">
                    {item.remissionRatePercent}% Remission
                  </div>
                </button>
              );
            })}
          </div>

          {/* Outcome Detail Card with Visual Graph */}
          {activeOutcome && (
            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#E8EDEA]/10 pb-4">
                <div>
                  <h2 className="text-xl font-serif font-bold text-[#E8EDEA]">
                    {activeOutcome.condition}
                  </h2>
                  <p className="text-xs text-[#E8EDEA]/60 font-sans">
                    Differential Privacy Filtered • Verified via Open Science Hash Ledger
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="bg-[#0D120E] border border-[#E8EDEA]/10 px-3 py-2 rounded-xl text-center">
                    <div className="text-[10px] font-mono text-[#E8EDEA]/50">Mystical Correlation (MEQ-30)</div>
                    <div className="text-base font-bold font-mono text-[#D4B8E5]">r = {activeOutcome.mysticalExperienceCorrelation}</div>
                  </div>
                </div>
              </div>

              {/* Symptom Severity Delta Chart */}
              <div className="space-y-4">
                <div className="text-xs font-mono text-[#E8EDEA]/60 flex items-center justify-between">
                  <span>CLINICAL SYMPTOM REDUCTION CURVE (PRE vs 1-MONTH vs 6-MONTH)</span>
                  <span className="text-[#A8C69F] font-bold">71.8% Sustained Response</span>
                </div>

                {/* SVG Visual Graph for Symptom Trajectory */}
                <div className="bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl p-6 relative overflow-hidden">
                  <div className="h-44 w-full flex items-end justify-between gap-8 pt-6 px-4">
                    
                    {/* Baseline Bar */}
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <span className="font-mono text-xs text-rose-400 font-bold">{activeOutcome.baselineScore} pts</span>
                      <div 
                        style={{ height: `${(activeOutcome.baselineScore / 70) * 120}px` }} 
                        className="w-full max-w-[80px] bg-gradient-to-t from-rose-950 to-rose-500/80 rounded-t-lg border-t border-rose-400 transition-all duration-500"
                      ></div>
                      <span className="text-[11px] font-mono text-[#E8EDEA]/50">Baseline (Pre-Session)</span>
                    </div>

                    {/* 1 Month Bar */}
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <span className="font-mono text-xs text-[#93C5B5] font-bold">{activeOutcome.post1MonthScore} pts</span>
                      <div 
                        style={{ height: `${Math.max(14, (activeOutcome.post1MonthScore / 70) * 120)}px` }} 
                        className="w-full max-w-[80px] bg-gradient-to-t from-[#15221F] to-[#93C5B5]/80 rounded-t-lg border-t border-[#93C5B5] transition-all duration-500"
                      ></div>
                      <span className="text-[11px] font-mono text-[#E8EDEA]/50">Post 1-Month</span>
                    </div>

                    {/* 6 Month Bar */}
                    <div className="flex-1 flex flex-col items-center gap-2">
                      <span className="font-mono text-xs text-[#A8C69F] font-bold">{activeOutcome.post6MonthScore} pts</span>
                      <div 
                        style={{ height: `${Math.max(14, (activeOutcome.post6MonthScore / 70) * 120)}px` }} 
                        className="w-full max-w-[80px] bg-gradient-to-t from-[#1A261F] to-[#A8C69F]/80 rounded-t-lg border-t border-[#A8C69F] transition-all duration-500"
                      ></div>
                      <span className="text-[11px] font-mono text-[#E8EDEA]/50">Post 6-Month Flourishing</span>
                    </div>

                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#2A1F30]/40 border border-[#D4B8E5]/30 text-xs text-[#D4B8E5] font-mono flex items-center justify-between">
                  <span>Neuroplastic Marker: {activeOutcome.neuroplasticityMarkerBDNFDelta}</span>
                  <span className="text-[#E8EDEA]/50 text-[11px]">p &lt; 0.0001 (Two-Tailed)</span>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* TAB 4.2: Consciousness Research Interface */}
      {activeTab === 'consciousness' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Default Mode Network Dissolution Map */}
            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#D4B8E5]/15 text-[#D4B8E5] border border-[#D4B8E5]/30">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#E8EDEA]">4.2.1 DMN Functional Decoupling</h3>
                  <p className="text-xs text-[#E8EDEA]/50 font-mono">fMRI & High-Density EEG Topological Correlates</p>
                </div>
              </div>

              {/* Dynamic Animated Waveform Map */}
              <div className="h-48 bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl p-4 flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between text-[11px] font-mono text-[#E8EDEA]/60 z-10">
                  <span>Posterior Cingulate Cortex (PCC)</span>
                  <span className="text-[#D4B8E5] font-bold">-78% Hyper-Connectivity</span>
                </div>

                <div className="relative h-24 flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center justify-around opacity-75">
                    <span className="w-16 h-16 rounded-full bg-[#D4B8E5]/20 animate-ping"></span>
                    <span className="w-24 h-24 rounded-full bg-[#93C5B5]/20 animate-pulse"></span>
                    <span className="w-20 h-20 rounded-full bg-[#A8C69F]/20 animate-ping"></span>
                  </div>
                  <span className="text-xs font-mono text-[#E8EDEA] z-10 bg-[#0D120E]/90 px-3 py-1 rounded-lg border border-[#E8EDEA]/10">
                    Entropy / Global Network Repertoire: <strong>+3.4 bits</strong>
                  </span>
                </div>

                <div className="flex justify-between text-[10px] font-mono text-[#E8EDEA]/50 z-10">
                  <span>Theta Power: 86%</span>
                  <span>Alpha Desynchronization: 91%</span>
                  <span>Trans-Spatial Coherence: 0.88</span>
                </div>
              </div>

              <p className="text-xs text-[#E8EDEA]/70 leading-relaxed font-sans">
                During the entheogenic peak, modular boundaries between brain networks dissolve, allowing global functional cross-talk and liberating rigid depressive rumination schemas.
              </p>
            </div>

            {/* Phenomenological Landscape Mapper */}
            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#93C5B5]/15 text-[#93C5B5] border border-[#93C5B5]/30">
                  <Atom className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#E8EDEA]">4.2.2 Phenomenological Topology</h3>
                  <p className="text-xs text-[#E8EDEA]/50 font-mono">Multidimensional Consciousness Vectoring</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs font-sans">
                <div className="p-3 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#E8EDEA]">Ego Dissolution Index (EDI)</div>
                    <div className="text-[11px] text-[#E8EDEA]/60">Feeling of boundaries melting into totality</div>
                  </div>
                  <span className="text-[#A8C69F] font-mono font-bold text-sm">94 / 100</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#E8EDEA]">Challenging Experience Index (CEI)</div>
                    <div className="text-[11px] text-[#E8EDEA]/60">Grief / somatic fear successfully integrated</div>
                  </div>
                  <span className="text-[#C8B195] font-mono font-bold text-sm">38 / 100 (Resolved)</span>
                </div>

                <div className="p-3 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-[#E8EDEA]">Psychological Flexibility (AAQ-2)</div>
                    <div className="text-[11px] text-[#E8EDEA]/60">Acceptance of negative emotional states</div>
                  </div>
                  <span className="text-[#93C5B5] font-mono font-bold text-sm">+82% Improvement</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 4.3: Anonymized Data Contribution Layer */}
      {activeTab === 'faucet' && (
        <div className="space-y-6">
          <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#D4B8E5] font-mono text-xs">
                <EyeOff className="w-4 h-4" />
                <span>4.3 Anonymized Data Contribution Layer</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-[#E8EDEA]">
                Sovereign Differential Privacy Research Faucet
              </h2>
              <p className="text-xs sm:text-sm text-[#E8EDEA]/70 font-light font-sans">
                Patients who opt-in to scientific progress can stream randomized Gaussian noise-infused biometrics to global research consortia with mathematical privacy guarantees (Differential Privacy with configurable ε parameter).
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              <div className="bg-[#0D120E] border border-[#E8EDEA]/10 p-5 rounded-xl space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-[#E8EDEA]/80 font-medium">Privacy Epsilon Parameter (ε)</span>
                  <span className="font-mono text-[#D4B8E5] font-bold">ε = {privacyEpsilon}</span>
                </div>

                <input
                  type="range"
                  min={0.05}
                  max={1.0}
                  step={0.05}
                  value={privacyEpsilon}
                  onChange={(e) => setPrivacyEpsilon(Number(e.target.value))}
                  className="w-full accent-[#A8C69F] bg-[#141B16] h-2 rounded-lg cursor-pointer"
                />

                <div className="flex justify-between text-[10px] font-mono text-[#E8EDEA]/50">
                  <span>ε=0.05 (Maximum Noise / Zero Re-Identification)</span>
                  <span>ε=1.0 (Higher Precision)</span>
                </div>

                <div className="p-3 rounded-lg bg-[#141B16] border border-[#E8EDEA]/10 text-xs text-[#E8EDEA]/70">
                  <span className="font-semibold text-[#A8C69F]">Sovereign Faucet Status:</span> 3 of 4 participants currently contributing anonymized data. 1 participant in 100% air-gapped private mode.
                </div>
              </div>

              <div className="bg-[#0D120E] border border-[#E8EDEA]/10 p-5 rounded-xl space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-serif font-bold text-sm text-[#E8EDEA] flex items-center gap-2">
                    <Database className="w-4 h-4 text-[#D4B8E5]" /> Research Data Stream Hash
                  </h3>
                  <div className="p-3 rounded-lg bg-black/40 border border-[#E8EDEA]/10 text-[11px] font-mono text-[#E8EDEA]/60 break-all">
                    DP_STREAM_HASH: 0x99a8b1c4e201f893d9... (Gaussian σ = 1.42)
                  </div>
                  <p className="text-xs text-[#E8EDEA]/60 font-sans">
                    Export verified differential privacy bundles to MAPS Public Benefit Corp, Beckley Foundation, or Johns Hopkins Center for Psychedelic Research.
                  </p>
                </div>

                <button
                  onClick={() => recordAudit(`Exported differential privacy research bundle (ε=${privacyEpsilon}) to Open Science Consortium`, 'REGULATORY')}
                  className="w-full py-2.5 rounded-xl bg-[#A8C69F] hover:bg-[#b8d6af] text-[#0A0D0B] font-semibold text-xs transition-all shadow-md flex items-center justify-center gap-2"
                >
                  <Share2 className="w-3.5 h-3.5" /> Stream Anonymized Batch to Open Science
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4.4: Predictive Safety Models */}
      {activeTab === 'predictive' && (
        <div className="space-y-6">
          <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#D4B8E5] font-mono text-xs">
                <Sliders className="w-4 h-4" />
                <span>4.4 Predictive Safety & Efficacy Models</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-[#E8EDEA]">
                Biomarker Safety & Optimal Dose Estimator
              </h2>
              <p className="text-xs sm:text-sm text-[#E8EDEA]/70 font-light font-sans">
                Utilizing multi-variable regression on past session bio-telemetry, CYP enzyme profiles, and somatic baseline measurements to predict optimal therapeutic windows and minimize adverse autonomic spikes.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 font-sans">
              
              <div className="space-y-1.5">
                <label className="text-xs text-[#E8EDEA]/60">Participant Weight (kg)</label>
                <input
                  type="number"
                  value={doseCalcWeight}
                  onChange={(e) => setDoseCalcWeight(Number(e.target.value))}
                  className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-xs text-[#E8EDEA] focus:outline-none focus:border-[#93C5B5] font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-[#E8EDEA]/60">Clinical Indication Profile</label>
                <select
                  value={doseCalcIndication}
                  onChange={(e) => setDoseCalcIndication(e.target.value as 'TRD' | 'PTSD' | 'EOL')}
                  className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-xs text-[#E8EDEA] focus:outline-none focus:border-[#93C5B5]"
                >
                  <option value="TRD">Treatment-Resistant Depression (Psilocybin)</option>
                  <option value="PTSD">Severe Complex PTSD (MDMA Protocol)</option>
                  <option value="EOL">End-of-Life Existential Anxiety (Psilocybin)</option>
                </select>
              </div>

              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleCalculateDose}
                  className="w-full py-2.5 rounded-xl bg-[#A8C69F] hover:bg-[#b8d6af] text-[#0A0D0B] font-bold text-xs transition-all shadow-md"
                >
                  Compute Precision Dose Window
                </button>
              </div>

            </div>

            <div className="p-4 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-xs text-[#E8EDEA]/50 font-mono">Recommended Therapeutic Dose:</span>
                <div className="text-xl font-bold font-mono text-[#A8C69F]">{simulatedDoseResult} mg Macro</div>
              </div>
              <div className="text-xs text-[#E8EDEA]/70 font-mono sm:text-right">
                <div>Predicted MEQ-30 Probability: <span className="text-[#93C5B5] font-bold">89.4%</span></div>
                <div>Autonomic Pressor Risk Index: <span className="text-[#A8C69F] font-bold">Low (1.8 / 10)</span></div>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
