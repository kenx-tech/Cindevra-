import React, { useState } from 'react';
import { 
  Sparkles, 
  Shield, 
  HeartHandshake, 
  Eye, 
  CheckCircle2, 
  X, 
  Scale, 
  Lock, 
  Activity, 
  Boxes, 
  TrendingDown, 
  DollarSign, 
  FileText, 
  BookOpen, 
  Compass,
  ArrowRight,
  ShieldCheck,
  Building2
} from 'lucide-react';
import { useAether } from '../../context/AetherContext';
import { CindevraLogo } from './CindevraLogo';

export const MissionStatementModal: React.FC = () => {
  const { showManifesto, setShowManifesto, setActiveLayer } = useAether();
  const [activeTab, setActiveTab] = useState<'overview' | 'axioms'>('overview');

  if (!showManifesto) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setShowManifesto(false)}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#0D120E] border border-[#CCA876]/40 rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden glow-sage"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8EDEA]/10 bg-[#090C0A]/90">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-[#141B16] border border-[#CCA876]/50 flex items-center justify-center p-1.5 shadow-[0_0_15px_rgba(204,168,118,0.2)]">
              <CindevraLogo size="sm" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-bold text-lg sm:text-xl text-[#E8EDEA] tracking-tight">Cindevra</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1A261F] text-[#CCA876] border border-[#CCA876]/30">
                  Official Guide
                </span>
              </div>
              <p className="text-xs font-mono text-[#A8C69F] tracking-wide">
                The Sovereign Platform for Psychedelic-Assisted Care
              </p>
            </div>
          </div>

          <button
            id="close-manifesto-btn"
            onClick={() => setShowManifesto(false)}
            className="p-2 text-[#E8EDEA]/50 hover:text-[#E8EDEA] rounded-xl bg-[#141B16] border border-[#E8EDEA]/10 hover:border-[#CCA876]/40 transition-all"
            aria-label="Close Platform Guide"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center gap-2 px-6 pt-3 pb-2 border-b border-white/[0.08] bg-[#0A0D0B]">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition-all flex items-center gap-2 ${
              activeTab === 'overview'
                ? 'bg-[#1A261F] text-[#A8C69F] border border-[#A8C69F]/40'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA] hover:bg-[#141B16]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>Platform Overview & Guide</span>
          </button>

          <button
            onClick={() => setActiveTab('axioms')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition-all flex items-center gap-2 ${
              activeTab === 'axioms'
                ? 'bg-[#1A261F] text-[#CCA876] border border-[#CCA876]/40'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA] hover:bg-[#141B16]'
            }`}
          >
            <Shield className="w-3.5 h-3.5" />
            <span>Constitutional Charter & Axioms</span>
          </button>
        </div>

        {/* Scrollable Content Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-8">
          
          {activeTab === 'overview' && (
            <div className="space-y-8 animate-in fade-in duration-200">
              
              {/* Section 1: The Simple Summary */}
              <div className="rounded-2xl bg-[#121A15] border border-[#A8C69F]/30 p-6 shadow-md space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A8C69F]">
                  <Sparkles className="w-3.5 h-3.5 text-[#A8C69F]" />
                  <span>The Simple Summary</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-serif font-bold text-[#E8EDEA]">
                  A specialized software platform built for licensed operations and facilitators
                </h3>
                <p className="text-sm text-[#E8EDEA]/85 font-sans leading-relaxed">
                  Cindevra is a specialized software platform built for licensed psilocybin service centers, facilitators, and ketamine clinics administering psychedelic-assisted therapies and neuro-regenerative treatments.
                </p>
                <p className="text-sm text-[#E8EDEA]/85 font-sans leading-relaxed">
                  It handles everything a licensed operation needs to run safely and in good standing with its regulators — from session protocols and state-mandated custody logs to live vital-sign monitoring during sessions — while guaranteeing that a patient's deeply personal psychological experience remains strictly private and under their own custody.
                </p>
              </div>

              {/* Section 2: Why Cindevra Was Built */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#CCA876]">
                  <Building2 className="w-3.5 h-3.5" />
                  <span>Why Cindevra Was Built</span>
                </div>

                <p className="text-sm text-[#E8EDEA]/80 font-sans leading-relaxed">
                  As psychedelic-assisted care moves from underground and clinical-trial settings into regulated, licensed operation, providers face two conflicting pressures:
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                  
                  {/* Strict Regulatory Compliance */}
                  <div className="p-5 rounded-xl bg-[#141B16] border border-[#CCA876]/30 space-y-2.5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#CCA876]">
                      <Scale className="w-4 h-4 text-[#CCA876]" />
                      <span>Strict Regulatory Compliance</span>
                    </div>
                    <p className="text-xs text-[#E8EDEA]/75 font-sans leading-relaxed">
                      Licensed operators must satisfy their governing body's rules — <strong>Oregon Health Authority / Oregon Psilocybin Services (OPS)</strong> for psilocybin, Colorado's <strong>Natural Medicine Health Act (NMHA)</strong> framework, or <strong>DEA/state medical board</strong> rules for ketamine — including custody logging, safety documentation, and (where applicable) billing.
                    </p>
                  </div>

                  {/* Intense Privacy Vulnerability */}
                  <div className="p-5 rounded-xl bg-[#141B16] border border-[#A8C69F]/30 space-y-2.5">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#A8C69F]">
                      <Lock className="w-4 h-4 text-[#A8C69F]" />
                      <span>Intense Privacy Vulnerability</span>
                    </div>
                    <p className="text-xs text-[#E8EDEA]/75 font-sans leading-relaxed">
                      During a psychedelic journey, a person shares their deepest traumas, subconscious thoughts, and emotional memories. If standard clinic software or corporate AI tools log these experiences to the cloud, that privacy can be permanently compromised or commercialized — and in a subpoena or data-breach scenario, potentially exposed.
                    </p>
                  </div>

                </div>

                {/* The Resolution */}
                <div className="p-4 rounded-xl bg-[#090C0A] border border-[#A8C69F]/40 text-xs sm:text-sm font-sans text-[#E8EDEA]/90 leading-relaxed">
                  <strong className="text-[#A8C69F]">Cindevra solves this:</strong> it gives operators the tools to satisfy their actual regulator, while using mathematical privacy (zero-knowledge encryption) so patients own their data completely — nobody can sell it, scrape it, or access it without explicit permission.
                </div>
              </div>

              {/* Section 3: What Cindevra Actually Does */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#A8C69F]">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#A8C69F]" />
                  <span>What Cindevra Actually Does</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  
                  {/* Feature 1 */}
                  <div className="p-5 rounded-xl bg-[#141B16] border border-white/[0.08] hover:border-[#A8C69F]/40 transition-all space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#E8EDEA]">
                      <ShieldCheck className="w-4 h-4 text-[#A8C69F]" />
                      <span>Protects Patient Sovereignty & Privacy</span>
                    </div>
                    <p className="text-xs text-[#E8EDEA]/75 font-sans leading-relaxed">
                      Patients hold the cryptographic keys to their own session records. A built-in "Right-to-Be-Forgotten" tool shreds the encryption key instantly on request, ensuring their inner journey can never be leaked or compelled by subpoena.
                    </p>
                  </div>

                  {/* Feature 2 */}
                  <div className="p-5 rounded-xl bg-[#141B16] border border-white/[0.08] hover:border-[#A8C69F]/40 transition-all space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#E8EDEA]">
                      <BookOpen className="w-4 h-4 text-[#CCA876]" />
                      <span>Standardizes Evidence-Informed Session Protocols</span>
                    </div>
                    <p className="text-xs text-[#E8EDEA]/75 font-sans leading-relaxed">
                      Session workflows built on published research frameworks — including Johns Hopkins and NYU psilocybin protocols, and MAPS-derived structures for MDMA-assisted work — guide staff through preparation, the administration session itself, and integration follow-up.
                    </p>
                  </div>

                  {/* Feature 3 */}
                  <div className="p-5 rounded-xl bg-[#141B16] border border-white/[0.08] hover:border-[#A8C69F]/40 transition-all space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#E8EDEA]">
                      <Activity className="w-4 h-4 text-[#A8C69F]" />
                      <span>Powers the Live Journey Cockpit</span>
                    </div>
                    <p className="text-xs text-[#E8EDEA]/75 font-sans leading-relaxed">
                      During an active session, facilitators monitor real-time vital signs (heart rate, HRV, blood pressure), log therapeutic touch and verbal check-ins, and manage supportive acoustic environments (e.g. 432 Hz grounding soundscapes) to keep the client safe.
                    </p>
                  </div>

                  {/* Feature 4: Guards the Substance Vault */}
                  <div className="p-5 rounded-xl bg-[#141B16] border border-white/[0.08] hover:border-[#A8C69F]/40 transition-all space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#E8EDEA]">
                      <Boxes className="w-4 h-4 text-[#CCA876]" />
                      <span>Guards the Substance Vault</span>
                    </div>
                    <ul className="text-xs text-[#E8EDEA]/75 font-sans space-y-1.5 list-disc pl-4 leading-relaxed">
                      <li>
                        <strong>Psilocybin (Oregon/Colorado licensed centers):</strong> tracks lot numbers, dosage, and two-person witness sign-offs to meet OPS / NMHA custody and reporting requirements.
                      </li>
                      <li>
                        <strong>Ketamine (medical clinics):</strong> tracks milligram-accurate dispensing and custody logs to DEA Schedule III standards.
                      </li>
                      <li>
                        <strong>MDMA:</strong> architecture is in place to support MDMA-assisted protocols as federal regulatory pathways open; not currently a legal administration pathway outside clinical trials.
                      </li>
                    </ul>
                  </div>

                  {/* Feature 5 */}
                  <div className="p-5 rounded-xl bg-[#141B16] border border-white/[0.08] hover:border-[#A8C69F]/40 transition-all space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#E8EDEA]">
                      <TrendingDown className="w-4 h-4 text-[#A8C69F]" />
                      <span>Translates Real Outcomes into Science</span>
                    </div>
                    <p className="text-xs text-[#E8EDEA]/75 font-sans leading-relaxed">
                      Tracks standardized depression, PTSD, and anxiety recovery scores over months of follow-up. Operators can contribute anonymized data to research efforts without ever revealing a client's identity.
                    </p>
                  </div>

                  {/* Feature 6 */}
                  <div className="p-5 rounded-xl bg-[#141B16] border border-white/[0.08] hover:border-[#A8C69F]/40 transition-all space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-[#E8EDEA]">
                      <DollarSign className="w-4 h-4 text-[#CCA876]" />
                      <span>Handles Payment, Honestly</span>
                    </div>
                    <p className="text-xs text-[#E8EDEA]/75 font-sans leading-relaxed">
                      Most psilocybin sessions are cash-pay (no insurance reimbursement exists yet, since nothing in this category is FDA-approved). Ketamine sessions, administered under a medical framework, may be billable depending on the clinic's setup. Cindevra tracks either model without assuming one-size-fits-all billing.
                    </p>
                  </div>

                </div>
              </div>

              {/* Section 4: The Core Philosophy */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-[#141E17] via-[#101712] to-[#0A0D0B] border border-[#CCA876]/40 space-y-3">
                <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-[#CCA876]">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>The Core Philosophy</span>
                </div>
                <blockquote className="font-serif italic text-base sm:text-lg text-[#E8EDEA] border-l-2 border-[#CCA876] pl-4 py-1 leading-snug">
                  "Knowledge can propagate. Privilege cannot. Compute can migrate. State remains sovereign."
                </blockquote>
                <p className="text-xs sm:text-sm text-[#A8C69F] font-mono pt-1">
                  Technology must always remain a humble, quiet servant of human healing — never an owner or exploiter of human consciousness.
                </p>
              </div>

            </div>
          )}

          {activeTab === 'axioms' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              
              {/* Mission Lead */}
              <div className="space-y-4 text-[#E8EDEA]/80 text-sm leading-relaxed border-b border-[#E8EDEA]/10 pb-5 font-sans">
                <p className="text-lg text-[#E8EDEA] font-serif italic leading-snug">
                  "We build the sovereign operating system that allows the safe, sacred, and scalable delivery of clinical entheogen therapies and neuro-regeneration protocols as the legal cascade completes."
                </p>
                <p>
                  Cindevra exists to protect the patient’s sovereignty over their own consciousness while enabling clinics, facilitators, and researchers to serve at the highest standard of safety, efficacy, and ethical integrity.
                </p>
                <p>
                  We create the technological root system that will support the coming wave of trauma healing, consciousness research, and human regeneration — so that what is currently exceptional becomes accessible, accountable, and luminous.
                </p>
              </div>

              {/* 3 Non-Negotiable Axioms */}
              <div>
                <h3 className="text-xs font-mono uppercase tracking-widest text-[#A8C69F] mb-4 flex items-center gap-2">
                  <Shield className="w-4 h-4" /> Three Non-Negotiable Constitutional Axioms
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div className="bg-[#141B16] border border-[#A8C69F]/20 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-[#A8C69F]/20 text-[#A8C69F] flex items-center justify-center font-bold text-sm mb-3 font-mono">
                        01
                      </div>
                      <h4 className="text-sm font-semibold text-[#E8EDEA] mb-1.5 font-sans">Sovereignty of Journey</h4>
                      <p className="text-xs text-[#E8EDEA]/60 leading-normal">
                        The human journey remains sovereign. No state, corporation, or AI may expropriate, commercialize, or weaponize the inner landscape of the participant.
                      </p>
                    </div>
                    <div className="mt-3 text-[11px] text-[#A8C69F] flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Enforced by ZK Vaults
                    </div>
                  </div>

                  <div className="bg-[#141B16] border border-[#C8B195]/20 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-[#C8B195]/20 text-[#C8B195] flex items-center justify-center font-bold text-sm mb-3 font-mono">
                        02
                      </div>
                      <h4 className="text-sm font-semibold text-[#E8EDEA] mb-1.5 font-sans">Clinical Rigor</h4>
                      <p className="text-xs text-[#E8EDEA]/60 leading-normal">
                        The clinical process remains rigorous and evidence-evolving. Protocols adapt dynamically to biomarker telemetry, harm-reduction science, and peer-reviewed safety data.
                      </p>
                    </div>
                    <div className="mt-3 text-[11px] text-[#C8B195] flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" /> 21 CFR Part 11 Audit
                    </div>
                  </div>

                  <div className="bg-[#141B16] border border-[#A8C69F]/20 rounded-xl p-4 flex flex-col justify-between">
                    <div>
                      <div className="w-8 h-8 rounded-lg bg-[#A8C69F]/20 text-[#A8C69F] flex items-center justify-center font-bold text-sm mb-3 font-mono">
                        03
                      </div>
                      <h4 className="text-sm font-semibold text-[#E8EDEA] mb-1.5 font-sans">Humble Servant</h4>
                      <p className="text-xs text-[#E8EDEA]/60 leading-normal">
                        The technology remains a humble servant of awakening, never its master. Algorithmic telemetry assists facilitators but never supersedes human presence and reverent holding.
                      </p>
                    </div>
                    <div className="mt-3 text-[11px] text-[#A8C69F] flex items-center gap-1 font-mono">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Sacred Restraint Core
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer Grounding */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-[#E8EDEA]/10 bg-[#090C0A] text-xs text-[#E8EDEA]/60">
          <div className="font-serif italic text-sm sm:text-base text-[#A8C69F] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#A8C69F]"></span>
            <span>"State remains sovereign."</span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={() => {
                setShowManifesto(false);
                setActiveLayer('tree');
              }}
              className="px-4 py-2 rounded-xl bg-[#141B16] hover:bg-[#1A261F] border border-[#A8C69F]/40 text-[#A8C69F] font-mono text-xs transition-all"
            >
              Explore Architecture
            </button>

            <button
              id="acknowledge-manifesto-btn"
              onClick={() => setShowManifesto(false)}
              className="px-5 py-2 rounded-xl bg-[#A8C69F] hover:bg-[#b8d6af] text-[#0A0D0B] font-semibold text-xs transition-all shadow-md"
            >
              Enter Sovereign Platform
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
