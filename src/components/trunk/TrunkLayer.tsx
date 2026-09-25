import React, { useState } from 'react';
import { 
  Dna, 
  GitFork, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Volume2, 
  ShieldAlert, 
  PlusCircle, 
  Heart, 
  Flame, 
  Activity, 
  Brain,
  Compass,
  FileCheck,
  ChevronRight
} from 'lucide-react';
import { useAether } from '../../context/AetherContext';
import { ClinicalProtocol } from '../../types/aether';

export const TrunkLayer: React.FC = () => {
  const { 
    protocols, 
    selectedProtocol, 
    setSelectedProtocol, 
    forkProtocol,
    setActiveLayer,
    recordAudit 
  } = useAether();

  const [activeTab, setActiveTab] = useState<'protocols' | 'preparation' | 'integration' | 'forking'>('protocols');
  const [selectedPhaseIdx, setSelectedPhaseIdx] = useState<number>(1);
  
  // Fork Form State
  const [forkName, setForkName] = useState('');
  const [forkDose, setForkDose] = useState<number>(selectedProtocol.dosingSchedule.macroDoseMg);

  // Preparation Checklist State
  const [prepChecklist, setPrepChecklist] = useState({
    contraindicationClearance: true,
    medicationWashoutVerified: true,
    somaticAnchorsEstablished: true,
    consentVaultSigned: true,
    acousticSanctuaryCertified: true,
    emergencyRescueKitLoaded: true,
  });

  // Integration Scale Simulation State
  const [meqScores, setMeqScores] = useState({
    mysticalUnity: 92,
    sacredness: 88,
    noeticQuality: 85,
    deeplyFeltPositiveMood: 94,
    transcendenceOfTimeSpace: 90,
  });

  const handleCreateFork = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forkName.trim()) return;
    forkProtocol(selectedProtocol.id, forkName, forkDose);
    setForkName('');
    setActiveTab('protocols');
  };

  const avgMeq = Math.round(
    (meqScores.mysticalUnity + meqScores.sacredness + meqScores.noeticQuality + meqScores.deeplyFeltPositiveMood + meqScores.transcendenceOfTimeSpace) / 5
  );

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Trunk Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#141B16] border border-[#93C5B5]/30 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#93C5B5] font-mono text-xs">
            <Dna className="w-4 h-4" />
            <span>2.0 Trunk — Clinical Protocol Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#E8EDEA] tracking-tight">
            Clinical Protocol & Journey Engine
          </h1>
          <p className="text-xs sm:text-sm text-[#E8EDEA]/70 max-w-2xl font-light">
            Evidence-based preparation frameworks, multi-compound clinical sequences (Psilocybin, MDMA, 5-MeO, Ibogaine, Ketamine), real-time safety overlays, and multi-week integration pathways.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-[#0D120E] p-1.5 rounded-xl border border-[#E8EDEA]/10 self-start md:self-auto overflow-x-auto">
          <button
            id="trunk-tab-protocols"
            onClick={() => setActiveTab('protocols')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'protocols'
                ? 'bg-[#15221F] border border-[#93C5B5]/40 text-[#93C5B5] shadow'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
            }`}
          >
            2.2 Journey Sequences
          </button>
          <button
            id="trunk-tab-prep"
            onClick={() => setActiveTab('prep')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'prep'
                ? 'bg-[#15221F] border border-[#93C5B5]/40 text-[#93C5B5] shadow'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
            }`}
          >
            2.1 Preparation & Screening
          </button>
          <button
            id="trunk-tab-integration"
            onClick={() => setActiveTab('integration')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'integration'
                ? 'bg-[#15221F] border border-[#93C5B5]/40 text-[#93C5B5] shadow'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
            }`}
          >
            2.3 Integration & MEQ-30
          </button>
          <button
            id="trunk-tab-forking"
            onClick={() => setActiveTab('forking')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'forking'
                ? 'bg-[#15221F] border border-[#93C5B5]/40 text-[#93C5B5] shadow'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
            }`}
          >
            2.4 Protocol Versioning & Forks
          </button>
        </div>
      </div>

      {/* Protocol Selector Strip */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-mono text-[#E8EDEA]/60 whitespace-nowrap">Active Substance:</span>
        {protocols.map((p) => {
          const isSelected = selectedProtocol.id === p.id;
          return (
            <button
              key={p.id}
              onClick={() => {
                setSelectedProtocol(p);
                setForkDose(p.dosingSchedule.macroDoseMg);
              }}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono flex items-center gap-2 border transition-all whitespace-nowrap ${
                isSelected
                  ? 'bg-[#15221F] border-[#93C5B5] text-[#93C5B5] glow-sage'
                  : 'bg-[#141B16] border-[#E8EDEA]/10 text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${
                p.compound === 'Psilocybin' ? 'bg-[#A8C69F]' :
                p.compound === 'MDMA' ? 'bg-[#93C5B5]' :
                p.compound === '5-MeO-DMT' ? 'bg-[#D4B8E5]' :
                p.compound === 'Ibogaine' ? 'bg-[#C8B195]' : 'bg-[#93C5B5]'
              }`}></span>
              <strong className="text-[#E8EDEA]">{p.compound}</strong>
              <span className="text-[11px] text-[#E8EDEA]/50">({p.dosingSchedule.macroDoseMg}mg)</span>
            </button>
          );
        })}
      </div>

      {/* TAB 2.2: Journey Sequences & Timelines */}
      {activeTab === 'protocols' && (
        <div className="space-y-6">
          
          {/* Main Protocol Card */}
          <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-6 border-b border-[#E8EDEA]/10">
              <div className="space-y-1">
                <div className="flex items-center gap-2 text-xs font-mono text-[#93C5B5]">
                  <span className="px-2 py-0.5 rounded bg-[#0D120E] border border-[#93C5B5]/40">{selectedProtocol.evidenceTier}</span>
                  <span>{selectedProtocol.version}</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#E8EDEA]">
                  {selectedProtocol.title}
                </h2>
                <p className="text-xs sm:text-sm text-[#E8EDEA]/70 font-light">
                  Target Indication: <strong className="text-[#E8EDEA] font-medium">{selectedProtocol.indication}</strong>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <div className="bg-[#0D120E] border border-[#E8EDEA]/10 p-3 rounded-xl text-center min-w-[100px]">
                  <div className="text-[10px] font-mono text-[#E8EDEA]/50">Macro Dose</div>
                  <div className="text-lg font-bold text-[#A8C69F] font-mono">
                    {selectedProtocol.dosingSchedule.macroDoseMg} mg
                  </div>
                  <div className="text-[10px] text-[#E8EDEA]/40">{selectedProtocol.dosingSchedule.administrationRoute}</div>
                </div>

                {selectedProtocol.dosingSchedule.boosterDoseMg && (
                  <div className="bg-[#0D120E] border border-[#E8EDEA]/10 p-3 rounded-xl text-center min-w-[100px]">
                    <div className="text-[10px] font-mono text-[#E8EDEA]/50">Optional Booster</div>
                    <div className="text-lg font-bold text-[#93C5B5] font-mono">
                      +{selectedProtocol.dosingSchedule.boosterDoseMg} mg
                    </div>
                    <div className="text-[10px] text-[#E8EDEA]/40">@ {selectedProtocol.dosingSchedule.boosterWindowMin} min</div>
                  </div>
                )}

                <button
                  onClick={() => setActiveLayer('live-journey')}
                  className="px-4 py-3 rounded-xl bg-[#A8C69F] hover:bg-[#b8d6af] text-[#0A0D0B] font-bold text-xs flex items-center gap-2 transition-all shadow-md"
                >
                  <Activity className="w-4 h-4" />
                  <span>Launch Live Journey Console</span>
                </button>
              </div>
            </div>

            {/* Interactive Timeline Phases */}
            <div className="space-y-4">
              <h3 className="text-xs font-mono uppercase tracking-wider text-[#E8EDEA]/60 flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#93C5B5]" /> Interactive Session Progression Timeline
              </h3>

              {/* Step Navigation Bar */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
                {selectedProtocol.timelinePhases.map((phase, idx) => {
                  const isSelected = selectedPhaseIdx === idx;
                  return (
                    <button
                      key={phase.name}
                      onClick={() => setSelectedPhaseIdx(idx)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        isSelected
                          ? 'bg-[#15221F] border-[#93C5B5] text-[#E8EDEA] glow-sage'
                          : 'bg-[#0D120E] border-[#E8EDEA]/10 text-[#E8EDEA]/60 hover:border-[#E8EDEA]/30'
                      }`}
                    >
                      <div className="text-[10px] font-mono text-[#93C5B5] mb-1">
                        Min {phase.startMin} - {phase.endMin}
                      </div>
                      <div className="font-semibold text-xs text-[#E8EDEA] line-clamp-1 font-sans">
                        {phase.name.split(':')[1] || phase.name}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Selected Phase Detail Box */}
              {selectedProtocol.timelinePhases[selectedPhaseIdx] && (
                <div className="bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl p-5 space-y-4 animate-in fade-in">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#E8EDEA]/10 pb-3">
                    <div>
                      <h4 className="font-serif font-bold text-base text-[#E8EDEA]">
                        {selectedProtocol.timelinePhases[selectedPhaseIdx].name}
                      </h4>
                      <p className="text-xs text-[#E8EDEA]/60 font-sans">
                        Target Phenomenological State: <span className="text-[#93C5B5] font-medium">{selectedProtocol.timelinePhases[selectedPhaseIdx].targetState}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2 text-xs font-mono text-[#93C5B5] bg-[#15221F] border border-[#93C5B5]/40 px-3 py-1 rounded-lg">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Acoustic Energy: {selectedProtocol.timelinePhases[selectedPhaseIdx].musicEnergyLevel}</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-xs font-mono text-[#E8EDEA]/60">Mandated Facilitator Protocols & Overlays:</div>
                    <ul className="space-y-2">
                      {selectedProtocol.timelinePhases[selectedPhaseIdx].facilitatorActions.map((act, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs text-[#E8EDEA]/80 font-sans">
                          <CheckCircle2 className="w-4 h-4 text-[#A8C69F] shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </div>

            {/* Contraindications & Rescue Matrix */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-4 border-t border-[#E8EDEA]/10">
              
              {/* Contraindication Tree */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-[#C8B195] flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" /> 2.1 Screening & Contraindications
                </h3>
                <div className="space-y-2">
                  {selectedProtocol.contraindications.map((c, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-[#E8EDEA] font-sans">{c.rule}</span>
                        <span className={`text-[10px] font-mono px-2 py-0.5 rounded ${
                          c.category === 'Absolute' ? 'bg-rose-950/60 text-rose-300 border border-rose-800' :
                          c.category === 'Washout Required' ? 'bg-[#241E16] text-[#C8B195] border border-[#C8B195]/40' :
                          'bg-[#141B16] text-[#E8EDEA]/70'
                        }`}>
                          {c.category}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#E8EDEA]/50 font-mono">{c.mechanism}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Rescue Protocols */}
              <div className="space-y-3">
                <h3 className="text-xs font-mono uppercase tracking-wider text-rose-400 flex items-center gap-2">
                  <ShieldAlert className="w-4 h-4" /> Real-time De-Escalation & Rescue Protocols
                </h3>
                <div className="space-y-2">
                  {selectedProtocol.rescueProtocols.map((r, i) => (
                    <div key={i} className="p-3 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-xs space-y-2">
                      <div className="font-semibold text-rose-300 flex items-center gap-1.5 font-sans">
                        <Flame className="w-3.5 h-3.5" /> Trigger: {r.trigger}
                      </div>
                      <div className="space-y-1 text-[#E8EDEA]/80 pl-2 border-l border-rose-900/60 text-[11px] font-sans">
                        <div>• Step 1: {r.step1}</div>
                        <div>• Step 2: {r.step2}</div>
                        {r.rescueMedication && (
                          <div className="text-[#93C5B5] font-mono">• Rescue Drug: {r.rescueMedication}</div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* TAB 2.1: Preparation Protocols */}
      {activeTab === 'prep' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Intention Setting & Somatic Anchors */}
            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#93C5B5]/15 text-[#93C5B5] border border-[#93C5B5]/30">
                  <Compass className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#E8EDEA]">2.1.2 Intention Setting & Somatic Anchors</h3>
                  <p className="text-xs text-[#E8EDEA]/50 font-mono">Psychological Inoculation & Nervous System Grounding</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="space-y-1.5">
                  <label className="text-[#E8EDEA]/80 font-medium font-sans">Participant Intention Statement</label>
                  <textarea
                    defaultValue="To surrender the heavy armor of past grief and remember the fundamental innocence of my being."
                    rows={3}
                    className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl p-3 text-xs text-[#E8EDEA] focus:outline-none focus:border-[#93C5B5]"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[#E8EDEA]/80 font-medium font-sans">Verified Somatic Grounding Anchors</label>
                  <div className="space-y-1.5 font-mono text-[11px]">
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0D120E] border border-[#E8EDEA]/10 text-[#93C5B5]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#A8C69F]" />
                      <span>Physical: Hand firmly placed over sternum / heart center</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0D120E] border border-[#E8EDEA]/10 text-[#93C5B5]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#A8C69F]" />
                      <span>Auditory: Long low-frequency exhalation with gentle vocal hum</span>
                    </div>
                    <div className="flex items-center gap-2 p-2.5 rounded-lg bg-[#0D120E] border border-[#E8EDEA]/10 text-[#93C5B5]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#A8C69F]" />
                      <span>Tactile: Touch of natural cedar wood talisman</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Set & Setting Checklist */}
            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#A8C69F]/15 text-[#A8C69F] border border-[#A8C69F]/30">
                  <FileCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#E8EDEA]">2.1.3 Set & Setting Protocol Checklist</h3>
                  <p className="text-xs text-[#E8EDEA]/50 font-mono">Pre-Flight Safety Verification</p>
                </div>
              </div>

              <div className="space-y-2.5 text-xs">
                {Object.entries(prepChecklist).map(([key, val]) => (
                  <label 
                    key={key} 
                    className="flex items-center justify-between p-3 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 cursor-pointer hover:border-[#E8EDEA]/20 transition-colors"
                  >
                    <span className="text-[#E8EDEA]/80 capitalize font-sans">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <input
                      type="checkbox"
                      checked={val}
                      onChange={(e) => setPrepChecklist(prev => ({ ...prev, [key]: e.target.checked }))}
                      className="w-4 h-4 accent-[#A8C69F] rounded cursor-pointer"
                    />
                  </label>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-[#1A261F] border border-[#A8C69F]/40 text-[#A8C69F] text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#A8C69F] shrink-0" />
                <span>All 6 Preparation Milestones Verified — Authorized for Administration</span>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2.3: Integration Protocols & MEQ-30 */}
      {activeTab === 'integration' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* Multi-Week Integration Pathway */}
            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#D4B8E5]/15 text-[#D4B8E5] border border-[#D4B8E5]/30">
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#E8EDEA]">2.3.2 Multi-Week Integration Pathway</h3>
                  <p className="text-xs text-[#E8EDEA]/50 font-mono">Neuroplastic Window Consolidation</p>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                <div className="p-3.5 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 space-y-1">
                  <div className="flex items-center justify-between font-semibold text-[#D4B8E5] font-sans">
                    <span>Day 1 (Within 24 Hours)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A261F] text-[#A8C69F]">Completed</span>
                  </div>
                  <p className="text-[#E8EDEA]/60 font-sans">Immediate somatic landing, review voice journal, check sleep hygiene.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 space-y-1">
                  <div className="flex items-center justify-between font-semibold text-[#D4B8E5] font-sans">
                    <span>Day 3 (Peak Neuroplastic Window)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A261F] text-[#A8C69F]">Completed</span>
                  </div>
                  <p className="text-[#E8EDEA]/60 font-sans">Cognitive reframing, habit disruption, creative expression & nature immersion.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 space-y-1">
                  <div className="flex items-center justify-between font-semibold text-[#D4B8E5] font-sans">
                    <span>Week 2 (Relational Integration)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#241E16] text-[#C8B195]">Scheduled</span>
                  </div>
                  <p className="text-[#E8EDEA]/60 font-sans">Interpersonal boundary renegotiation, family system dialogue.</p>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 space-y-1">
                  <div className="flex items-center justify-between font-semibold text-[#D4B8E5] font-sans">
                    <span>Week 4 (Long-Term Flourishing Assessment)</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#141B16] text-[#E8EDEA]/50">Upcoming</span>
                  </div>
                  <p className="text-[#E8EDEA]/60 font-sans">PHQ-9 & GAD-7 clinical discharge evaluation, long-term flourishing survey.</p>
                </div>
              </div>
            </div>

            {/* MEQ-30 Mystical Experience Assessment Simulator */}
            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#93C5B5]/15 text-[#93C5B5] border border-[#93C5B5]/30">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#E8EDEA]">2.3.3 MEQ-30 Assessment Matrix</h3>
                    <p className="text-xs text-[#E8EDEA]/50 font-mono">Validated Mystical Experience Index</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-[#E8EDEA]/50 font-mono">Composite MEQ</span>
                  <div className="text-xl font-bold font-mono text-[#A8C69F]">{avgMeq} / 100</div>
                </div>
              </div>

              <div className="space-y-3 text-xs">
                {Object.entries(meqScores).map(([domain, val]) => (
                  <div key={domain} className="space-y-1">
                    <div className="flex justify-between text-[#E8EDEA]/80 font-sans">
                      <span className="capitalize">{domain.replace(/([A-Z])/g, ' $1')}</span>
                      <span className="font-mono text-[#93C5B5]">{val}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      value={val}
                      onChange={(e) => setMeqScores(prev => ({ ...prev, [domain]: Number(e.target.value) }))}
                      className="w-full accent-[#93C5B5] bg-[#0D120E] h-1.5 rounded-lg cursor-pointer"
                    />
                  </div>
                ))}
              </div>

              <div className="p-3 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-xs text-[#E8EDEA]/60 font-sans">
                <span className="text-[#A8C69F] font-semibold font-mono">Clinical Note:</span> Scores &gt;60% on all four subscales correlate with sustained 6-month depression and PTSD remission (p &lt; 0.001, Griffiths et al.).
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 2.4: Protocol Versioning & Forking */}
      {activeTab === 'forking' && (
        <div className="space-y-6">
          <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#93C5B5] font-mono text-xs">
                <GitFork className="w-4 h-4" />
                <span>2.4 Protocol Versioning & Evolution</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-[#E8EDEA]">
                Sovereign Protocol Branching & Evidence Updates
              </h2>
              <p className="text-xs sm:text-sm text-[#E8EDEA]/70 font-light">
                Clinics can fork open-source clinical protocols to create custom sub-specialty pathways (e.g. Veterans Trauma, Palliative Care, Eating Disorders) while maintaining full backward-compatibility and telemetry compliance.
              </p>
            </div>

            <form onSubmit={handleCreateFork} className="bg-[#0D120E] border border-[#E8EDEA]/10 p-5 rounded-xl space-y-4">
              <h3 className="text-sm font-semibold text-[#E8EDEA] font-sans">Create New Protocol Fork from "{selectedProtocol.title}"</h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs text-[#E8EDEA]/60 font-sans">Fork Name / Target Cohort</label>
                  <input
                    type="text"
                    placeholder="e.g. Veteran Neuro-Regen High-Dose Fork"
                    value={forkName}
                    onChange={(e) => setForkName(e.target.value)}
                    className="w-full bg-[#141B16] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-xs text-[#E8EDEA] focus:outline-none focus:border-[#93C5B5]"
                    required
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs text-[#E8EDEA]/60 font-sans">Macro Dose (mg)</label>
                  <input
                    type="number"
                    value={forkDose}
                    onChange={(e) => setForkDose(Number(e.target.value))}
                    className="w-full bg-[#141B16] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-xs text-[#E8EDEA] focus:outline-none focus:border-[#93C5B5]"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#93C5B5] hover:bg-[#a6d4c5] text-[#0A0D0B] font-semibold text-xs transition-all shadow-md"
              >
                <GitFork className="w-4 h-4" />
                <span>Initialize Sovereign Protocol Fork</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
