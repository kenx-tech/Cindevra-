import React from 'react';
import { 
  ShieldCheck, 
  Sparkles, 
  Volume2, 
  VolumeX, 
  Lock, 
  Unlock, 
  FileText, 
  Activity, 
  Radio, 
  ScrollText,
  Building2,
  Flame
} from 'lucide-react';
import { useAether } from '../../context/AetherContext';
import { CindevraLogo } from '../common/CindevraLogo';

export const Header: React.FC = () => {
  const { 
    activeJurisdiction, 
    jurisdictions, 
    setActiveJurisdiction, 
    ambientAudioActive, 
    toggleAmbientAudio, 
    setShowManifesto, 
    setShowCreatorBio,
    emergencyLockdown, 
    toggleEmergencyLockdown,
    liveTelemetry,
    setActiveLayer
  } = useAether();

  return (
    <header className="sticky top-0 z-50 border-b border-[#E8EDEA]/10 bg-[#0A0D0B]/90 backdrop-blur-md px-4 lg:px-8 py-3">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        
        {/* Brand & Mission Anchor */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-start">
          <div 
            onClick={() => setActiveLayer('tree')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative w-11 h-11 rounded-xl bg-[#141B16] border border-[#CCA876]/40 flex items-center justify-center group-hover:border-[#CCA876] transition-all duration-300 shadow-[0_0_15px_rgba(204,168,118,0.15)]">
              <CindevraLogo size="sm" />
              <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-[#CCA876] rounded-full border-2 border-[#0A0D0B] flex items-center justify-center">
                <span className="w-1.5 h-1.5 bg-[#0A0D0B] rounded-full"></span>
              </div>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-serif font-semibold text-2xl tracking-tight text-[#E8EDEA]">Cindevra</span>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded-full bg-[#1A261F] text-[#CCA876] border border-[#CCA876]/40">
                  Sovereign Kernel v4.2
                </span>
              </div>
              <p className="text-[11px] text-[#E8EDEA]/60 hidden sm:block font-light">
                The Sovereign Platform for Psychedelic-Assisted Care
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              id="creator-bio-btn"
              onClick={() => setShowCreatorBio(true)}
              className="flex items-center gap-1.5 text-xs text-[#CCA876] hover:text-[#E8EDEA] px-3 py-1.5 rounded-xl border border-[#CCA876]/40 hover:border-[#CCA876] bg-[#141B16] transition-all group shadow-[0_0_12px_rgba(204,168,118,0.1)]"
              title="Kenneth Cripps — Creator & Architect Bio"
            >
              <Flame className="w-3.5 h-3.5 text-[#CCA876] group-hover:scale-110 transition-transform" />
              <span className="font-medium hidden sm:inline">Kenneth Cripps</span>
              <span className="text-[10px] text-[#CCA876]/80 hidden md:inline font-mono">/ Architect</span>
            </button>

            <button
              id="manifesto-btn"
              onClick={() => setShowManifesto(true)}
              className="flex items-center gap-1.5 text-xs text-[#A8C69F] hover:text-[#E8EDEA] px-3 py-1.5 rounded-xl border border-[#A8C69F]/30 hover:border-[#A8C69F] bg-[#141B16] transition-all"
              title="Read Platform Summary & Constitutional Charter"
            >
              <ScrollText className="w-3.5 h-3.5 text-[#A8C69F]" />
              <span className="font-medium hidden sm:inline">Platform Guide & Charter</span>
            </button>
          </div>
        </div>

        {/* Global Controls & Status */}
        <div className="flex items-center flex-wrap gap-2.5 w-full md:w-auto justify-end">
          
          {/* Active Session Telemetry Indicator */}
          <button
            id="live-journey-pill"
            onClick={() => setActiveLayer('live-journey')}
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141B16] border border-[#E8EDEA]/10 hover:border-[#A8C69F]/50 text-xs transition-all group"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A8C69F] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A8C69F]"></span>
            </span>
            <span className="text-[#E8EDEA]/80 group-hover:text-[#A8C69F] font-mono text-[11px]">
              Active Journey: <strong className="text-[#E8EDEA] font-medium">AE-9941</strong> (HR {liveTelemetry.heartRate} bpm)
            </span>
            <Activity className="w-3.5 h-3.5 text-[#A8C69F] ml-0.5" />
          </button>

          {/* Jurisdiction Selector */}
          <div className="flex items-center gap-1.5 bg-[#141B16] border border-[#E8EDEA]/10 rounded-xl px-2.5 py-1 text-xs">
            <Building2 className="w-3.5 h-3.5 text-[#E8EDEA]/50" />
            <select
              id="jurisdiction-select"
              aria-label="Select legal jurisdiction"
              value={activeJurisdiction.id}
              onChange={(e) => {
                const found = jurisdictions.find(j => j.id === e.target.value);
                if (found) setActiveJurisdiction(found);
              }}
              className="bg-transparent text-[#E8EDEA]/90 text-xs focus:outline-none cursor-pointer pr-1 font-mono"
            >
              {jurisdictions.map(j => (
                <option key={j.id} value={j.id} className="bg-[#0A0D0B] text-[#E8EDEA]">
                  {j.id} — {j.name}
                </option>
              ))}
            </select>
          </div>

          {/* 432Hz Sacred Acoustic Drone */}
          <button
            id="ambient-sound-toggle"
            onClick={toggleAmbientAudio}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs border transition-all ${
              ambientAudioActive 
                ? 'bg-[#1A261F] border-[#A8C69F]/50 text-[#A8C69F] glow-sage' 
                : 'bg-[#141B16] border-[#E8EDEA]/10 text-[#E8EDEA]/50 hover:text-[#E8EDEA]'
            }`}
            title="Toggle 432Hz Grounding Synthesizer + Theta Harmonic"
          >
            {ambientAudioActive ? <Volume2 className="w-3.5 h-3.5 text-[#A8C69F]" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="font-mono text-[11px] hidden sm:inline">{ambientAudioActive ? '432Hz Tone Active' : 'Sound Off'}</span>
          </button>

          {/* Sovereign Emergency Lockdown */}
          <button
            id="emergency-lockdown-toggle"
            onClick={toggleEmergencyLockdown}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-medium border transition-all ${
              emergencyLockdown
                ? 'bg-[#2B1515] border-rose-500/70 text-rose-200 shadow-lg animate-pulse'
                : 'bg-[#141B16] border-[#E8EDEA]/10 text-[#E8EDEA]/60 hover:text-[#E8EDEA] hover:border-[#E8EDEA]/20'
            }`}
            title="Toggle Zero-Trust Emergency Sovereign Sanctuary Isolation"
          >
            {emergencyLockdown ? (
              <>
                <Lock className="w-3.5 h-3.5 text-rose-400" />
                <span className="font-mono text-[11px]">Vault Isolated</span>
              </>
            ) : (
              <>
                <Unlock className="w-3.5 h-3.5 text-[#A8C69F]" />
                <span className="font-mono text-[11px]">Vault Secure</span>
              </>
            )}
          </button>

        </div>
      </div>
    </header>
  );
};
