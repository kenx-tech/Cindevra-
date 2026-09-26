import React, { useState } from 'react';
import { 
  GitBranch, 
  Shield, 
  Dna, 
  Workflow, 
  Sparkles, 
  Network, 
  ChevronRight, 
  Search, 
  CheckCircle2, 
  Cpu, 
  Lock, 
  Flame, 
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { useAether } from '../../context/AetherContext';
import { AetherLayerId } from '../../types/aether';
import { CindevraLogo } from './CindevraLogo';

interface TreeNode {
  id: string;
  code: string;
  title: string;
  layerId: AetherLayerId;
  submoduleId: string;
  description: string;
  status: 'Operational' | 'Active Ledger' | 'Regulated' | 'Differential Privacy';
  children?: TreeNode[];
  metrics?: string;
}

const TREE_DATA: TreeNode[] = [
  {
    id: 'root-layer',
    code: '1.0',
    title: 'Root Layer — Sovereignty & Foundation',
    layerId: 'root',
    submoduleId: 'all',
    description: 'Cryptographic data ownership, zero-knowledge consent vaults, and jurisdictional sovereignty matrices.',
    status: 'Operational',
    metrics: '3 Vaults • 256-bit ZK-SNARK • 100% Sovereign Custody',
    children: [
      {
        id: '1.1',
        code: '1.1',
        title: 'Patient Sovereignty Core',
        layerId: 'root',
        submoduleId: '1.1',
        description: 'Identity & Consent Vault, Data Ownership Ledger, Right-to-Be-Forgotten Cryptographic Shredder.',
        status: 'Active Ledger',
        metrics: '4 Active Patients • 0 Revocation Leaks',
        children: [
          { id: '1.1.1', code: '1.1.1', title: 'Identity & Consent Vault', layerId: 'root', submoduleId: '1.1-consent', description: 'Patient-held self-custodial asymmetric keypair consent ledger.', status: 'Operational' },
          { id: '1.1.2', code: '1.1.2', title: 'Data Ownership Ledger', layerId: 'root', submoduleId: '1.1-ledger', description: 'Immutable hash chain documenting every clinical reading access.', status: 'Active Ledger' },
          { id: '1.1.3', code: '1.1.3', title: 'Right-to-Be-Forgotten Engine', layerId: 'root', submoduleId: '1.1-shred', description: 'One-click ephemeral key shredder instantly wiping participant identity.', status: 'Operational' },
        ]
      },
      {
        id: '1.2',
        code: '1.2',
        title: 'Legal & Regulatory Kernel',
        layerId: 'root',
        submoduleId: '1.2',
        description: 'Schedule Transition Adapter (Schedule I → Clinical), State-Federal Jurisdiction Mapper, 21 CFR Part 11 Audit Trail, Sacred Use Exception Handler.',
        status: 'Regulated',
        metrics: '5 Active Legal Zones (OR, CO, FDA, Swiss, Sacred)',
        children: [
          { id: '1.2.1', code: '1.2.1', title: 'Schedule Transition Adapter', layerId: 'root', submoduleId: '1.2-adapter', description: 'Dynamic state migration engine handling Schedule I to clinical rescheduling.', status: 'Regulated' },
          { id: '1.2.2', code: '1.2.2', title: 'State-Federal Jurisdiction Mapper', layerId: 'root', submoduleId: '1.2-jurisdiction', description: 'Real-time compliance validation matrix against OR-M109, CO-Prop122, FDA REMS.', status: 'Operational' },
          { id: '1.2.3', code: '1.2.3', title: 'Audit & Compliance Trail', layerId: 'root', submoduleId: '1.2-audit', description: '21 CFR Part 11 compliant cryptographically signed telemetry history.', status: 'Active Ledger' },
          { id: '1.2.4', code: '1.2.4', title: 'Sacred Use Exception Handler', layerId: 'root', submoduleId: '1.2-sacred', description: 'Indigenous reciprocity verification and non-commercial ceremonial exemptions.', status: 'Operational' }
        ]
      },
      {
        id: '1.3',
        code: '1.3',
        title: 'Security & Privacy Root',
        layerId: 'root',
        submoduleId: '1.3',
        description: 'Zero-Knowledge Encryption, End-to-End Journey Encryption, Breach-Resilient Offline Vault.',
        status: 'Operational',
        metrics: 'Split-Key Sharding Active',
        children: [
          { id: '1.3.1', code: '1.3.1', title: 'Zero-Knowledge Encryption', layerId: 'root', submoduleId: '1.3-zk', description: 'Zero-knowledge proofs of clinical eligibility without exposing history.', status: 'Operational' },
          { id: '1.3.2', code: '1.3.2', title: 'End-to-End Journey Encryption', layerId: 'root', submoduleId: '1.3-e2ee', description: 'AES-GCM-256 session telemetry & voice note encryption.', status: 'Operational' },
          { id: '1.3.3', code: '1.3.3', title: 'Breach-Resilient Architecture', layerId: 'root', submoduleId: '1.3-breach', description: 'Offline vault mode, self-destruct canary, and anti-exfiltration isolation.', status: 'Operational' }
        ]
      }
    ]
  },
  {
    id: 'trunk-layer',
    code: '2.0',
    title: 'Trunk — Clinical Protocol Engine',
    layerId: 'trunk',
    submoduleId: 'all',
    description: 'Evidence-based preparation, live journey sequencing (Psilocybin, MDMA, 5-MeO, Ibogaine, Ketamine), and multi-week integration pathways.',
    status: 'Operational',
    metrics: '5 Multi-Phase Protocols • Real-Time Safety Overlays',
    children: [
      {
        id: '2.1',
        code: '2.1',
        title: 'Preparation Protocols',
        layerId: 'trunk',
        submoduleId: '2.1',
        description: 'Screening & Contraindication Tree, Intention Setting Module, Set & Setting Configuration.',
        status: 'Operational',
        metrics: '14 Contraindication Rules • 3-Session Prep Checklist',
      },
      {
        id: '2.2',
        code: '2.2',
        title: 'Journey Protocols',
        layerId: 'trunk',
        submoduleId: '2.2',
        description: 'Psilocybin & MDMA Sequences, Future Entheogens, Real-time Safety Monitoring, Facilitator Guidance Overlay.',
        status: 'Operational',
        metrics: '420-Min Interactive Timeline • Dual Facilitator Sync',
      },
      {
        id: '2.3',
        code: '2.3',
        title: 'Integration Protocols',
        layerId: 'trunk',
        submoduleId: '2.3',
        description: 'Immediate Post-Session Capture, Multi-Week Pathways (Day 1 - Week 4), Long-term Neuroplastic Tracking (MEQ-30, PHQ-9).',
        status: 'Operational',
        metrics: '86% Remission Sustained @ 6 Mo',
      },
      {
        id: '2.4',
        code: '2.4',
        title: 'Protocol Versioning & Evolution',
        layerId: 'trunk',
        submoduleId: '2.4',
        description: 'Evidence-Based Update Engine, Clinic-Custom Protocol Forks with sovereign dosing modifications.',
        status: 'Active Ledger',
        metrics: 'Git-style Protocol Branching Active',
      }
    ]
  },
  {
    id: 'branch-layer',
    code: '3.0',
    title: 'Branch Layer — Clinic Operations',
    layerId: 'branch',
    submoduleId: 'all',
    description: 'Patient Journey Orchestration, Facilitator & Clinician Workbench, Sanctuary Scheduling, and Schedule I/II GMP Inventory Vault.',
    status: 'Operational',
    metrics: '4 Active Cohorts • 3 Dispensary Vaults • 2 Chaperone Locks',
    children: [
      { id: '3.1', code: '3.1', title: 'Patient Journey Orchestration', layerId: 'branch', submoduleId: '3.1', description: 'Intake -> Preparation -> Journey -> Integration multi-stage kanban.', status: 'Operational' },
      { id: '3.2', code: '3.2', title: 'Facilitator & Clinician Workbench', layerId: 'branch', submoduleId: '3.2', description: 'Lead Facilitator + Medical Monitor co-therapist dual sign-off workstation.', status: 'Operational' },
      { id: '3.3', code: '3.3', title: 'Scheduling & Capacity Engine', layerId: 'branch', submoduleId: '3.3', description: 'Sanctuary acoustic isolation scoring and certified chaperone pairings.', status: 'Operational' },
      { id: '3.4', code: '3.4', title: 'Inventory & Compound Tracking', layerId: 'branch', submoduleId: '3.4', description: 'GMP Batch tracking, milligram dispensing logs with double-witness authorization.', status: 'Regulated' },
      { id: '3.5', code: '3.5', title: 'Multi-Clinic Network Layer', layerId: 'branch', submoduleId: '3.5', description: 'Cross-sanctuary federation across sovereign nodes.', status: 'Operational' }
    ]
  },
  {
    id: 'canopy-layer',
    code: '4.0',
    title: 'Canopy — Intelligence & Research',
    layerId: 'canopy',
    submoduleId: 'all',
    description: 'Outcome Analytics, Consciousness Research Interface, Differential Privacy Data Faucets, and Predictive Efficacy Models.',
    status: 'Differential Privacy',
    metrics: '446 Pooled Datapoints • ε = 0.25 • 0 Identity Exposures',
    children: [
      { id: '4.1', code: '4.1', title: 'Outcome Analytics', layerId: 'canopy', submoduleId: '4.1', description: 'Depression PHQ-9, PTSD CAPS-5, and MEQ-30 mystical score correlation metrics.', status: 'Operational' },
      { id: '4.2', code: '4.2', title: 'Consciousness Research Interface', layerId: 'canopy', submoduleId: '4.2', description: 'EEG Alpha/Theta synchrony, Default Mode Network attenuation visualizer.', status: 'Operational' },
      { id: '4.3', code: '4.3', title: 'Anonymized Data Contribution Layer', layerId: 'canopy', submoduleId: '4.3', description: 'Patient-controlled differential privacy epsilon allocation faucet.', status: 'Differential Privacy' },
      { id: '4.4', code: '4.4', title: 'Predictive Safety & Efficacy Models', layerId: 'canopy', submoduleId: '4.4', description: 'Dose-response prediction and autonomic resistance risk indicators.', status: 'Operational' }
    ]
  },
  {
    id: 'mycorrhizal-layer',
    code: '5.0',
    title: 'Mycorrhizal Network — Interconnection',
    layerId: 'mycorrhizal',
    submoduleId: 'all',
    description: 'FHIR / EHR Interoperability, Research Consortium Bridges (MAPS/Hopkins), FDA REMS Reporting APIs, and Future BCI/Sensory Hooks.',
    status: 'Operational',
    metrics: 'FHIR R4 Compliant • Open Science Stream • BCI Telemetry Ready',
    children: [
      { id: '5.1', code: '5.1', title: 'Interoperability with EHRs & External Systems', layerId: 'mycorrhizal', submoduleId: '5.1', description: 'SMART-on-FHIR Clinical Bundle Exporter (Epic/Cerner/AthenaHealth compatible).', status: 'Operational' },
      { id: '5.2', code: '5.2', title: 'Research Consortium Bridge', layerId: 'mycorrhizal', submoduleId: '5.2', description: 'Federated sync with MAPS, Usona, Beckley Foundation, and Johns Hopkins databases.', status: 'Operational' },
      { id: '5.3', code: '5.3', title: 'Regulatory Reporting API', layerId: 'mycorrhizal', submoduleId: '5.3', description: 'Automated FDA REMS and state health authority compliance packet generator.', status: 'Regulated' },
      { id: '5.4', code: '5.4', title: 'Future Consciousness Tech Hooks', layerId: 'mycorrhizal', submoduleId: '5.4', description: 'BCI EEG streamer, immersive spatial audio sync, and circadian ambient lighting drivers.', status: 'Operational' }
    ]
  }
];

export const SovereignTreeVisualizer: React.FC = () => {
  const { setActiveLayer, setActiveSubmodule, setShowCreatorBio } = useAether();
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({
    'root-layer': true,
    'trunk-layer': true,
    'branch-layer': true,
    'canopy-layer': true,
    'mycorrhizal-layer': true,
    '1.1': true,
    '1.2': true,
    '1.3': true,
  });

  const toggleExpand = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setExpandedNodes(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNodeClick = (node: TreeNode) => {
    setActiveLayer(node.layerId);
    setActiveSubmodule(node.submoduleId);
  };

  const matchesSearch = (node: TreeNode): boolean => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    if (node.title.toLowerCase().includes(q) || node.code.toLowerCase().includes(q) || node.description.toLowerCase().includes(q)) return true;
    if (node.children) return node.children.some(matchesSearch);
    return false;
  };

  const renderNode = (node: TreeNode, depth = 0) => {
    if (!matchesSearch(node)) return null;
    const isExpanded = expandedNodes[node.id];
    const hasChildren = node.children && node.children.length > 0;

    const layerColors = {
      root: 'border-[#A8C69F]/50 bg-[#162119] text-[#A8C69F]',
      trunk: 'border-[#93C5B5]/50 bg-[#15221F] text-[#93C5B5]',
      branch: 'border-[#C8B195]/50 bg-[#211E18] text-[#C8B195]',
      canopy: 'border-[#D4B8E5]/50 bg-[#201A24] text-[#D4B8E5]',
      mycorrhizal: 'border-[#D4A373]/50 bg-[#221B16] text-[#D4A373]',
      tree: 'border-[#E8EDEA]/20 bg-[#131B15] text-[#E8EDEA]',
      'live-journey': 'border-[#A8C69F] bg-[#162119] text-[#A8C69F]'
    };

    return (
      <div key={node.id} className="relative select-none">
        {/* Tree Line Connector */}
        {depth > 0 && (
          <div className="absolute -left-4 top-5 w-4 h-px bg-[#E8EDEA]/10"></div>
        )}

        <div
          onClick={() => handleNodeClick(node)}
          className={`group my-2 p-3.5 sm:p-4 rounded-xl border transition-all duration-200 cursor-pointer ${
            depth === 0
              ? `${layerColors[node.layerId]} border-l-4 shadow-lg hover:border-[#E8EDEA]/40`
              : depth === 1
              ? 'bg-[#141B16] border-[#E8EDEA]/10 hover:border-[#A8C69F]/40 text-[#E8EDEA]'
              : 'bg-[#0D120E] border-[#E8EDEA]/10 hover:border-[#A8C69F]/30 text-[#E8EDEA]/80'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              {hasChildren && (
                <button
                  type="button"
                  onClick={(e) => toggleExpand(node.id, e)}
                  className="p-1 rounded hover:bg-white/10 text-[#E8EDEA]/50 hover:text-[#E8EDEA] transition-colors"
                >
                  <ChevronRight className={`w-4 h-4 transition-transform ${isExpanded ? 'rotate-90 text-[#A8C69F]' : ''}`} />
                </button>
              )}

              <span className="font-mono text-xs px-2 py-0.5 rounded bg-[#0A0D0B] border border-[#E8EDEA]/10 text-[#A8C69F] font-semibold">
                {node.code}
              </span>

              <h4 className="font-serif font-semibold text-base sm:text-lg text-[#E8EDEA] group-hover:text-[#A8C69F] transition-colors">
                {node.title}
              </h4>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                node.status === 'Operational' ? 'bg-[#1A261F] text-[#A8C69F] border-[#A8C69F]/40' :
                node.status === 'Active Ledger' ? 'bg-[#172420] text-[#93C5B5] border-[#93C5B5]/40' :
                node.status === 'Regulated' ? 'bg-[#241E16] text-[#C8B195] border-[#C8B195]/40' :
                'bg-[#221B27] text-[#D4B8E5] border-[#D4B8E5]/40'
              }`}>
                {node.status}
              </span>

              <div className="opacity-0 group-hover:opacity-100 flex items-center text-xs text-[#A8C69F] font-mono gap-1 transition-opacity">
                <span>Enter Layer</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>

          <p className="mt-2 text-xs text-[#E8EDEA]/60 leading-relaxed pl-1 sm:pl-7">
            {node.description}
          </p>

          {node.metrics && (
            <div className="mt-2.5 pl-1 sm:pl-7 flex items-center gap-2 text-[11px] font-mono text-[#E8EDEA]/40">
              <span className="w-1.5 h-1.5 rounded-full bg-[#A8C69F]"></span>
              {node.metrics}
            </div>
          )}
        </div>

        {/* Children Render */}
        {hasChildren && isExpanded && (
          <div className="ml-5 sm:ml-8 pl-3 border-l border-[#E8EDEA]/10 space-y-1.5">
            {node.children!.map(child => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-6">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-[#141B16] border border-[#A8C69F]/30 p-6 sm:p-8 shadow-xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#A8C69F]/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start gap-4 max-w-2xl">
            <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-[#0D120E] border border-[#CCA876]/40 items-center justify-center p-2 shadow-[0_0_20px_rgba(204,168,118,0.15)] shrink-0">
              <CindevraLogo size="md" />
            </div>
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#1A261F] border border-[#CCA876]/30 text-[#CCA876] text-xs font-mono">
                <Layers className="w-3.5 h-3.5" /> The Sovereign Platform for Psychedelic-Assisted Care
              </div>
              <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#E8EDEA] tracking-tight">
                The Living Technological Root System
              </h1>
              <p className="text-sm text-[#E8EDEA]/70 leading-relaxed font-light">
                Built for licensed psilocybin service centers, facilitators, and ketamine clinics. Explore the five foundational layers of Cindevra: from mathematical zero-knowledge privacy roots to state-mandated custody logs and interconnected research networks. Click any node to interact with that live module.
              </p>
            </div>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl p-3 text-center">
              <div className="text-xs text-[#E8EDEA]/50 font-mono">Layers</div>
              <div className="text-xl font-bold font-serif text-[#A8C69F]">5 Tiers</div>
            </div>
            <div className="bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl p-3 text-center">
              <div className="text-xs text-[#E8EDEA]/50 font-mono">Submodules</div>
              <div className="text-xl font-bold font-serif text-[#C8B195]">20 Nodes</div>
            </div>
            <div className="bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl p-3 text-center col-span-2 sm:col-span-1">
              <div className="text-xs text-[#E8EDEA]/50 font-mono">Integrity</div>
              <div className="text-xl font-bold font-serif text-[#E8EDEA]">100% ZK</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mt-6 pt-5 border-t border-[#E8EDEA]/10 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#E8EDEA]/40 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              id="tree-search-input"
              type="text"
              placeholder="Search architecture (e.g., 'Zero-Knowledge', 'Psilocybin', 'Inventory', 'FHIR', 'Sovereignty')..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 focus:border-[#A8C69F]/80 rounded-xl pl-10 pr-4 py-2.5 text-xs text-[#E8EDEA] placeholder:text-[#E8EDEA]/40 focus:outline-none transition-all"
            />
          </div>
          <button
            id="expand-all-tree-btn"
            onClick={() => {
              const allExpanded = Object.values(expandedNodes).every(v => v);
              const next: Record<string, boolean> = {};
              TREE_DATA.forEach(n => {
                next[n.id] = !allExpanded;
                if (n.children) n.children.forEach(c => next[c.id] = !allExpanded);
              });
              setExpandedNodes(next);
            }}
            className="px-4 py-2.5 rounded-xl bg-[#141B16] hover:bg-[#1A261F] text-xs text-[#E8EDEA]/80 font-mono transition-colors border border-[#E8EDEA]/10"
          >
            Toggle All Branches
          </button>
        </div>
      </div>

      {/* Sovereign Architect & Philosophy Spotlight */}
      <div className="rounded-2xl bg-gradient-to-r from-[#121A15] via-[#101712] to-[#0A0D0B] border border-[#CCA876]/30 p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-[#162119] border border-[#CCA876]/50 flex items-center justify-center text-[#CCA876] shrink-0 shadow-[0_0_12px_rgba(204,168,118,0.15)]">
            <Flame className="w-5 h-5" />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-[#CCA876]">Architect & Sovereign Creator</span>
              <span className="text-white/20">•</span>
              <span className="text-sm font-semibold text-[#E8EDEA]">Kenneth Cripps</span>
              <span className="text-xs font-mono text-[#CCA876]/80 bg-[#1A261F] px-2 py-0.5 rounded border border-[#CCA876]/20">
                Ken X Cripps / Flamewalker
              </span>
            </div>
            <p className="text-xs sm:text-sm text-[#E8EDEA]/80 italic font-serif mt-1">
              "Knowledge can propagate. Privilege cannot. Compute can migrate. State remains sovereign."
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0 w-full md:w-auto justify-end">
          <button
            id="spotlight-bio-btn"
            onClick={() => setShowCreatorBio(true)}
            className="px-4 py-2 rounded-xl bg-[#1A261F] hover:bg-[#233329] border border-[#CCA876]/50 text-[#CCA876] hover:text-[#E8EDEA] text-xs font-mono transition-all flex items-center gap-2 group shadow-sm"
          >
            <span>Read Kenneth Cripps Bio</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* The Hierarchical Tree */}
      <div className="space-y-4">
        {TREE_DATA.map(node => renderNode(node))}
      </div>

    </div>
  );
};
