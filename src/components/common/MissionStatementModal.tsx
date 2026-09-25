import React from 'react';
import { Sparkles, Shield, HeartHandshake, Eye, CheckCircle2, X } from 'lucide-react';
import { useAether } from '../../context/AetherContext';
import { CindevraLogo } from './CindevraLogo';

export const MissionStatementModal: React.FC = () => {
  const { showManifesto, setShowManifesto } = useAether();

  if (!showManifesto) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-3xl bg-[#0D120E] border border-[#CCA876]/30 rounded-2xl p-6 sm:p-8 shadow-2xl max-h-[90vh] overflow-y-auto glow-sage"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          id="close-manifesto-btn"
          onClick={() => setShowManifesto(false)}
          className="absolute top-5 right-5 p-2 text-[#E8EDEA]/50 hover:text-[#E8EDEA] rounded-xl bg-[#141B16] border border-[#E8EDEA]/10 hover:border-[#CCA876]/40 transition-all"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Sacred Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#141B16] border border-[#CCA876]/40 flex items-center justify-center shadow-[0_0_20px_rgba(204,168,118,0.2)]">
            <CindevraLogo size="sm" />
          </div>
          <div>
            <h2 className="text-2xl sm:text-3xl font-serif font-bold text-[#E8EDEA] tracking-tight">
              Mission Statement of Cindevra
            </h2>
            <p className="text-xs font-mono text-[#CCA876] tracking-wider uppercase">
              Foundational Charter & Constitutional Principles
            </p>
          </div>
        </div>

        {/* Core Vision Passage */}
        <div className="space-y-4 text-[#E8EDEA]/80 text-sm leading-relaxed border-y border-[#E8EDEA]/10 py-5 font-sans">
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

        {/* 3 Non-Negotiable Principles */}
        <div className="my-6">
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

        {/* Footer Grounding */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-[#E8EDEA]/10 text-xs text-[#E8EDEA]/60">
          <div className="font-serif italic text-base text-[#A8C69F] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#A8C69F]"></span>
            "This is the ground we stand on."
          </div>
          <button
            id="acknowledge-manifesto-btn"
            onClick={() => setShowManifesto(false)}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#A8C69F] hover:bg-[#b8d6af] text-[#0A0D0B] font-semibold text-xs transition-all shadow-md"
          >
            Affirm & Enter Sovereign Space
          </button>
        </div>

      </div>
    </div>
  );
};
