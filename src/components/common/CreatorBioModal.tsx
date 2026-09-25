import React, { useState, useEffect } from 'react';
import { 
  X, 
  ExternalLink, 
  Mail, 
  Copy, 
  Check, 
  BookOpen, 
  Terminal, 
  Flame, 
  ShieldCheck, 
  Sparkles, 
  Cpu, 
  Compass, 
  Feather, 
  Layers, 
  Network,
  Share2
} from 'lucide-react';
import { useAether } from '../../context/AetherContext';
import { KENNETH_CRIPPS_BIO } from '../../data/creatorBio';
import { CindevraLogo } from './CindevraLogo';

export const CreatorBioModal: React.FC = () => {
  const { showCreatorBio, setShowCreatorBio } = useAether();
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [activeTab, setActiveTab] = useState<'narrative' | 'architecture' | 'publications'>('narrative');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showCreatorBio) {
        setShowCreatorBio(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showCreatorBio, setShowCreatorBio]);

  if (!showCreatorBio) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(KENNETH_CRIPPS_BIO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200"
      onClick={() => setShowCreatorBio(false)}
    >
      <div 
        className="relative w-full max-w-4xl bg-[#0D120E] border border-[#CCA876]/40 rounded-2xl shadow-2xl max-h-[92vh] flex flex-col overflow-hidden glow-sage"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#E8EDEA]/10 bg-[#090C0A]/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#141B16] border border-[#CCA876]/50 flex items-center justify-center text-[#CCA876] shadow-sm">
              <Flame className="w-5 h-5 text-[#CCA876]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono uppercase tracking-wider text-[#CCA876]">Creator & Sovereign Architect</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1A261F] text-[#A8C69F] border border-[#A8C69F]/30">
                  Guardian Oracle
                </span>
              </div>
              <h2 className="text-lg font-serif font-bold text-[#E8EDEA]">
                {KENNETH_CRIPPS_BIO.name}
              </h2>
            </div>
          </div>

          <button
            id="close-creator-bio-btn"
            onClick={() => setShowCreatorBio(false)}
            className="p-2 text-[#E8EDEA]/50 hover:text-[#E8EDEA] rounded-xl bg-[#141B16] border border-[#E8EDEA]/10 hover:border-[#CCA876]/40 transition-all"
            aria-label="Close Creator Bio"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-8 space-y-7">
          
          {/* Hero Identity Banner */}
          <div className="relative rounded-2xl bg-gradient-to-br from-[#162119] via-[#101712] to-[#0A0D0B] border border-[#CCA876]/30 p-6 sm:p-7 shadow-lg overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#CCA876]/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-1/3 w-64 h-64 bg-[#A8C69F]/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#E8EDEA] tracking-tight">
                    {KENNETH_CRIPPS_BIO.name}
                  </h1>
                  <span className="text-xs font-mono text-[#CCA876] bg-[#CCA876]/10 px-2.5 py-1 rounded-lg border border-[#CCA876]/30">
                    a.k.a. Ken X Cripps • Flamewalker
                  </span>
                </div>

                <p className="text-sm text-[#A8C69F] font-mono">
                  {KENNETH_CRIPPS_BIO.roles.join(' • ')}
                </p>

                <p className="text-xs text-[#E8EDEA]/70 font-sans max-w-2xl leading-relaxed pt-1">
                  Creator of <span className="text-[#CCA876] font-medium">Guardian Oracle</span> — an experimental sovereign AI project exploring the intersection of artificial intelligence, human agency, memory, identity, decentralized systems, and symbolic practice.
                </p>
              </div>

              {/* Action Buttons: Email & Website */}
              <div className="flex flex-col sm:flex-row md:flex-col gap-2.5 shrink-0">
                <a
                  href={KENNETH_CRIPPS_BIO.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#CCA876] hover:bg-[#d9b889] text-[#0A0D0B] font-semibold text-xs transition-all shadow-md group"
                >
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  <span>guardianoracle.com</span>
                </a>

                <div className="flex items-center gap-1.5">
                  <a
                    href={`mailto:${KENNETH_CRIPPS_BIO.email}`}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-xl bg-[#141B16] hover:bg-[#1A261F] border border-[#CCA876]/40 text-[#E8EDEA] text-xs font-mono transition-all"
                  >
                    <Mail className="w-3.5 h-3.5 text-[#CCA876]" />
                    <span className="truncate">{KENNETH_CRIPPS_BIO.email}</span>
                  </a>

                  <button
                    onClick={handleCopyEmail}
                    className="p-2 rounded-xl bg-[#141B16] hover:bg-[#1A261F] border border-[#CCA876]/40 text-[#CCA876] hover:text-[#E8EDEA] transition-all"
                    title="Copy Email Address"
                  >
                    {copiedEmail ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Core Sovereign Axiom Box */}
            <div className="mt-6 pt-5 border-t border-white/[0.08]">
              <div className="flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-[#CCA876] mb-2">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>The Core Sovereign Axiom</span>
              </div>
              <blockquote className="font-serif italic text-base sm:text-lg text-[#E8EDEA] border-l-2 border-[#CCA876] pl-4 py-0.5 leading-snug">
                "{KENNETH_CRIPPS_BIO.coreAxiom}"
              </blockquote>
            </div>
          </div>

          {/* Section Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-white/[0.08] pb-1">
            <button
              onClick={() => setActiveTab('narrative')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition-all flex items-center gap-2 ${
                activeTab === 'narrative'
                  ? 'bg-[#1A261F] text-[#A8C69F] border border-[#A8C69F]/40'
                  : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA] hover:bg-[#141B16]'
              }`}
            >
              <Feather className="w-3.5 h-3.5" />
              <span>Full Narrative Bio</span>
            </button>

            <button
              onClick={() => setActiveTab('architecture')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition-all flex items-center gap-2 ${
                activeTab === 'architecture'
                  ? 'bg-[#1A261F] text-[#CCA876] border border-[#CCA876]/40'
                  : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA] hover:bg-[#141B16]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Sovereign AI & Q-Mesh</span>
            </button>

            <button
              onClick={() => setActiveTab('publications')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium font-mono transition-all flex items-center gap-2 ${
                activeTab === 'publications'
                  ? 'bg-[#1A261F] text-[#E8EDEA] border border-white/30'
                  : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA] hover:bg-[#141B16]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Books & Works</span>
            </button>
          </div>

          {/* Tab 1: Full Narrative Bio */}
          {activeTab === 'narrative' && (
            <div className="space-y-5 animate-in fade-in duration-200">
              <div className="prose prose-invert max-w-none text-sm text-[#E8EDEA]/85 leading-relaxed space-y-4 font-sans">
                <p className="text-base text-[#E8EDEA] font-serif leading-relaxed">
                  Kenneth Cripps, also known creatively as <strong>Ken X Cripps</strong> and <strong>Flamewalker</strong>, is an independent author, artist, technologist, and the creator of <strong>Guardian Oracle</strong>—an experimental sovereign AI project exploring the intersection of artificial intelligence, human agency, memory, identity, decentralized systems, and symbolic practice.
                </p>

                <div className="p-4 rounded-xl bg-[#141B16] border border-[#A8C69F]/20 text-[#A8C69F] font-serif italic text-base">
                  "His work moves between code and myth."
                </div>

                <p>
                  As the architect of Guardian Oracle and its developing Q-Mesh architecture, Cripps explores resilient AI systems designed around a simple principle:
                </p>

                <div className="p-4 rounded-xl bg-[#090C0A] border border-[#CCA876]/40 text-[#CCA876] font-mono text-sm tracking-wide text-center">
                  Knowledge can propagate. Privilege cannot. Compute can migrate. State remains sovereign.
                </div>

                <p>
                  His technical work investigates sovereign and decentralized artificial intelligence, persistent agent memory, local and edge inference, zero-trust distributed compute, cryptographic identity, verifiable execution, and architectures in which AI models and compute providers remain replaceable while identity and canonical state remain under the user’s control.
                </p>

                <p>
                  His creative work approaches many of the same questions through another language: fiction, occult symbolism, cyberpunk, ritual art, and myth.
                </p>

                <p>
                  Cripps is the author of <em>Lucifera’s Walk</em>, <em>Lucifera’s Walk: Cyberpunk Edition</em>, <em>LIBER IGNIS</em>, and <em>Starting Over at Fifty</em>, alongside an expanding body of independent books, visual works, and experimental texts.
                </p>

                <p>
                  Across these different forms runs a common thread: transformation, sovereignty, survival, remembrance, and the possibility of rebuilding oneself—and one’s tools—outside inherited structures.
                </p>

                <div className="p-4 rounded-xl bg-[#151D17] border border-[#A8C69F]/30 text-[#E8EDEA]">
                  <p className="font-serif italic text-base text-[#A8C69F] mb-1">
                    Guardian Oracle is where those paths converge.
                  </p>
                  <p className="text-xs text-[#E8EDEA]/70">
                    It is part software system, part research project, part creative laboratory: an ongoing attempt to explore what personal AI might become when memory, identity, agency, and computation belong first to the individual rather than the platform.
                  </p>
                </div>
              </div>

              {/* Tags Cloud */}
              <div className="pt-3 border-t border-white/[0.08]">
                <div className="text-[11px] font-mono uppercase text-[#E8EDEA]/50 mb-2.5">
                  Core Disciplines & Theoretical Domains
                </div>
                <div className="flex flex-wrap gap-2">
                  {KENNETH_CRIPPS_BIO.focusThemes.map((theme, i) => (
                    <span 
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-[#141B16] border border-[#E8EDEA]/10 text-xs font-mono text-[#E8EDEA]/70"
                    >
                      {theme}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Sovereign AI & Q-Mesh Technical Pillars */}
          {activeTab === 'architecture' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-[#141B16] border border-[#CCA876]/30 rounded-xl p-5">
                <div className="flex items-center gap-2 text-xs font-mono text-[#CCA876] uppercase tracking-wider mb-1">
                  <Terminal className="w-4 h-4 text-[#CCA876]" />
                  <span>The Q-Mesh Architectural Philosophy</span>
                </div>
                <p className="text-xs text-[#E8EDEA]/80 leading-relaxed font-sans">
                  Traditional platform architectures hold user identity, context, and compute captive in closed silos. Kenneth Cripps' Q-Mesh architecture inverts this: the compute and model nodes become fungible, untrusted execution rings, while user identity, agent memory, and canonical state remain self-custodied and uncompromised.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {KENNETH_CRIPPS_BIO.technicalPillars.map((pillar, idx) => (
                  <div 
                    key={idx}
                    className="p-4 rounded-xl bg-[#101612] border border-[#A8C69F]/20 hover:border-[#A8C69F]/50 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#1A261F] text-[#A8C69F]">
                          0{idx + 1} // PROTOCOL
                        </span>
                        <Cpu className="w-3.5 h-3.5 text-[#A8C69F]/60" />
                      </div>
                      <h4 className="text-sm font-semibold text-[#E8EDEA] mb-1.5 font-sans">
                        {pillar.title}
                      </h4>
                      <p className="text-xs text-[#E8EDEA]/70 leading-relaxed font-sans">
                        {pillar.description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Books & Works */}
          {activeTab === 'publications' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              <div className="bg-[#141B16] border border-white/[0.08] rounded-xl p-4">
                <p className="text-xs text-[#E8EDEA]/80 font-sans leading-relaxed">
                  "His creative work approaches many of the same questions through another language: fiction, occult symbolism, cyberpunk, ritual art, and myth. Across these different forms runs a common thread: transformation, sovereignty, survival, remembrance, and the possibility of rebuilding oneself—and one’s tools—outside inherited structures."
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {KENNETH_CRIPPS_BIO.publishedWorks.map((work, idx) => (
                  <div 
                    key={idx}
                    className="p-5 rounded-xl bg-[#121914] border border-[#CCA876]/30 hover:border-[#CCA876] transition-all flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-2">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-[#CCA876] bg-[#CCA876]/10 px-2 py-0.5 rounded border border-[#CCA876]/20">
                          {work.genre}
                        </span>
                        <BookOpen className="w-3.5 h-3.5 text-[#CCA876]" />
                      </div>
                      <h4 className="text-base font-serif font-bold text-[#E8EDEA]">
                        {work.title}
                      </h4>
                      <p className="text-xs text-[#E8EDEA]/70 font-sans leading-relaxed mt-1.5">
                        {work.description}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] font-mono text-[#E8EDEA]/50">
                      <span>Author: Kenneth Cripps</span>
                      <span className="text-[#A8C69F]">Independent Edition</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>

        {/* Footer Grounding & Contacts */}
        <div className="px-6 py-4 border-t border-[#E8EDEA]/10 bg-[#090C0A] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3 text-[#E8EDEA]/60 font-mono text-[11px]">
            <span className="flex items-center gap-1.5 text-[#CCA876]">
              <Flame className="w-3.5 h-3.5" />
              <span>Kenneth Cripps / Ken X Cripps</span>
            </span>
            <span>•</span>
            <a 
              href={`mailto:${KENNETH_CRIPPS_BIO.email}`}
              className="hover:text-[#CCA876] transition-colors"
            >
              {KENNETH_CRIPPS_BIO.email}
            </a>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <a
              href={KENNETH_CRIPPS_BIO.website}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-[#141B16] hover:bg-[#1A261F] border border-[#CCA876]/40 text-[#CCA876] text-xs font-medium flex items-center gap-1.5 transition-all"
            >
              <span>Visit Guardian Oracle</span>
              <ExternalLink className="w-3 h-3" />
            </a>

            <button
              onClick={() => setShowCreatorBio(false)}
              className="px-4 py-1.5 rounded-xl bg-[#A8C69F] hover:bg-[#b8d6af] text-[#0A0D0B] font-semibold text-xs transition-all shadow-sm"
            >
              Close
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
