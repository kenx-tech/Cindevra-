/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { AetherProvider, useAether } from './context/AetherContext';
import { Header } from './components/layout/Header';
import { LayerNav } from './components/layout/LayerNav';
import { MissionStatementModal } from './components/common/MissionStatementModal';
import { CreatorBioModal } from './components/common/CreatorBioModal';
import { SovereignTreeVisualizer } from './components/common/SovereignTreeVisualizer';
import { RootLayer } from './components/root/RootLayer';
import { TrunkLayer } from './components/trunk/TrunkLayer';
import { BranchLayer } from './components/branch/BranchLayer';
import { CanopyLayer } from './components/canopy/CanopyLayer';
import { MycorrhizalLayer } from './components/mycorrhizal/MycorrhizalLayer';
import { LiveJourneyConsole } from './components/journey/LiveJourneyConsole';
import { ShieldCheck, Sparkles, ScrollText, Lock, Radio, Flame, ExternalLink, Mail } from 'lucide-react';

const CindevraContent: React.FC = () => {
  const { activeLayer, emergencyLockdown, setShowManifesto, setShowCreatorBio } = useAether();

  return (
    <div className="min-h-screen bg-[#0A0D0B] text-[#E8EDEA] flex flex-col selection:bg-[#A8C69F]/30 selection:text-[#E8EDEA] bg-natural-radial">
      
      {/* Sovereign Emergency Isolation Banner */}
      {emergencyLockdown && (
        <div className="bg-[#241212] border-b border-rose-500/60 px-4 py-2 text-center text-xs font-mono text-rose-200 flex items-center justify-center gap-2 animate-pulse z-50">
          <Lock className="w-4 h-4 text-rose-400" />
          <span>ZERO-TRUST SOVEREIGN SANCTUARY LOCKDOWN ACTIVE: EXTERNAL RELAYS ISOLATED • CUSTODY SECURE</span>
        </div>
      )}

      {/* Top Header */}
      <Header />

      {/* 5-Tier Architecture Nav */}
      <LayerNav />

      {/* Main Viewport */}
      <main className="flex-1 pb-16">
        {activeLayer === 'tree' && <SovereignTreeVisualizer />}
        {activeLayer === 'root' && <RootLayer />}
        {activeLayer === 'trunk' && <TrunkLayer />}
        {activeLayer === 'branch' && <BranchLayer />}
        {activeLayer === 'canopy' && <CanopyLayer />}
        {activeLayer === 'mycorrhizal' && <MycorrhizalLayer />}
        {activeLayer === 'live-journey' && <LiveJourneyConsole />}
      </main>

      {/* Modals & Overlays */}
      <MissionStatementModal />
      <CreatorBioModal />

      {/* Sovereign Footer */}
      <footer className="border-t border-white/[0.06] bg-[#070908] px-4 lg:px-8 py-7 text-xs text-[#E8EDEA]/60">
        <div className="max-w-7xl mx-auto space-y-5">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            
            <div className="flex items-center gap-3">
              <span className="font-serif font-semibold text-lg text-[#E8EDEA]">Cindevra</span>
              <span className="font-mono text-[11px] text-[#E8EDEA]/30">|</span>
              <span className="font-mono text-[11px] text-[#A8C69F]">
                The Sovereign Platform for Psychedelic-Assisted Care
              </span>
            </div>

            {/* Three Non-Negotiable Reminders */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-mono text-[#E8EDEA]/70">
              <span className="text-[#A8C69F]">1. Sovereign Human Journey</span>
              <span className="text-[#E8EDEA]/30">•</span>
              <span className="text-[#C8B195]">2. Rigorous Clinical Evidence</span>
              <span className="text-[#E8EDEA]/30">•</span>
              <span className="text-[#A8C69F]">3. Humble Servant of Awakening</span>
            </div>

            <div className="flex items-center gap-3">
              <button
                id="footer-bio-btn"
                onClick={() => setShowCreatorBio(true)}
                className="text-[#CCA876] hover:text-[#E8EDEA] font-mono text-[11px] flex items-center gap-1.5 transition-colors px-2 py-1 rounded-lg hover:bg-[#141B16]"
              >
                <Flame className="w-3.5 h-3.5 text-[#CCA876]" />
                <span>Kenneth Cripps Bio</span>
              </button>

              <button
                onClick={() => setShowManifesto(true)}
                className="text-[#E8EDEA]/60 hover:text-[#A8C69F] font-mono text-[11px] flex items-center gap-1.5 transition-colors px-2 py-1 rounded-lg hover:bg-[#141B16]"
              >
                <ScrollText className="w-3.5 h-3.5 text-[#A8C69F]" />
                <span>Platform Guide & Charter</span>
              </button>
            </div>

          </div>

          {/* Creator Attribution & Axiom Bar */}
          <div className="pt-4 border-t border-white/[0.04] flex flex-col md:flex-row items-center justify-between gap-3 text-[11px] font-mono text-[#E8EDEA]/50">
            <div className="flex flex-wrap items-center gap-2 text-center md:text-left">
              <span>Creator & Architect:</span>
              <button 
                onClick={() => setShowCreatorBio(true)}
                className="text-[#CCA876] hover:underline font-semibold"
              >
                Kenneth Cripps
              </button>
              <span className="text-white/20">•</span>
              <span className="text-[#E8EDEA]/60">Guardian Oracle & Q-Mesh Architecture</span>
              <span className="text-white/20">•</span>
              <span className="text-[#A8C69F]/80">"State remains sovereign."</span>
            </div>

            <div className="flex items-center gap-4">
              <a
                href="mailto:Kenx@guardianoracle.com"
                className="hover:text-[#CCA876] transition-colors flex items-center gap-1"
              >
                <Mail className="w-3 h-3 text-[#CCA876]" />
                <span>Kenx@guardianoracle.com</span>
              </a>
              <a
                href="https://guardianoracle.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-[#CCA876] transition-colors flex items-center gap-1"
              >
                <span>guardianoracle.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default function App() {
  return (
    <AetherProvider>
      <CindevraContent />
    </AetherProvider>
  );
}
