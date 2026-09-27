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
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#141B16] border border-[#A8C69F]/30 hover:border-[#A8C69F] text-xs transition-all group focus-visible:ring-2 focus-visible:ring-[#A8C69F]"
            aria-label="Active Journey Telemetry Monitor: AE-9941"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#A8C69F] opacity-80"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#A8C69F]"></span>
            </span>
            <span className="text-[#E8EDEA] group-hover:text-[#A8C69F] font-mono text-xs">
              Active: <strong className="text-[#A8C69F] font-semibold">AE-9941</strong> (HR {liveTelemetry.heartRate} bpm)
            </span>
            <Activity className="w-3.5 h-3.5 text-[#A8C69F] ml-0.5" />
          </button>

          {/* Jurisdiction Selector */}
          <div className="flex items-center gap-1.5 bg-[#141B16] border border-white/20 rounded-xl px-2.5 py-1 text-xs">
            <Building2 className="w-3.5 h-3.5 text-[#A8C69F]" />
            <select
              id="jurisdiction-select"
              aria-label="Select legal jurisdiction"
              value={activeJurisdiction.id}
              onChange={(e) => {
                const found = jurisdictions.find(j => j.id === e.target.value);
                if (found) setActiveJurisdiction(found);
              }}
              className="bg-transparent text-[#E8EDEA] text-xs focus:outline-none cursor-pointer pr-1 font-mono font-medium"
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
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-medium border transition-all focus-visible:ring-2 focus-visible:ring-[#A8C69F] ${
              ambientAudioActive 
                ? 'bg-[#1A261F] border-[#A8C69F] text-[#A8C69F] shadow-sm' 
                : 'bg-[#141B16] border-white/20 text-[#E8EDEA] hover:text-[#A8C69F] hover:border-[#A8C69F]/50'
            }`}
            title="Toggle 432Hz Grounding Synthesizer + Theta Harmonic"
            aria-label="Toggle 432Hz Grounding Synthesizer"
            aria-pressed={ambientAudioActive}
          >
            {ambientAudioActive ? <Volume2 className="w-3.5 h-3.5 text-[#A8C69F]" /> : <VolumeX className="w-3.5 h-3.5 text-[#E8EDEA]/70" />}
            <span className="hidden sm:inline">{ambientAudioActive ? '432Hz Sound Active' : 'Sound Muted'}</span>
          </button>

          {/* Sovereign Emergency Lockdown */}
          <button
            id="emergency-lockdown-toggle"
            onClick={toggleEmergencyLockdown}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-semibold border transition-all focus-visible:ring-2 focus-visible:ring-rose-400 ${
              emergencyLockdown
                ? 'bg-[#2B1515] border-rose-500 text-rose-100 shadow-lg animate-pulse'
                : 'bg-[#131B15] border-[#A8C69F]/50 text-[#E8EDEA] hover:border-[#A8C69F] hover:bg-[#18231c]'
            }`}
            title="Toggle Zero-Trust Emergency Sovereign Sanctuary Isolation"
            aria-label={`Sovereign Vault Isolation status: ${emergencyLockdown ? 'Vault Isolated' : 'Vault Secure'}. Click to toggle.`}
            aria-pressed={emergencyLockdown}
          >
            {emergencyLockdown ? (
              <>
                <Lock className="w-4 h-4 text-rose-300" />
                <span className="tracking-wide text-rose-100">Vault Isolated</span>
              </>
            ) : (
              <>
                <Unlock className="w-4 h-4 text-[#A8C69F]" />
                <span className="tracking-wide text-[#E8EDEA]">Vault Secure</span>
              </>
            )}
          </button>

        </div>
      </div>
    </header>
  );
};
