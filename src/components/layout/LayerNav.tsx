import React from 'react';
import { 
  GitFork, 
  Shield, 
  Dna, 
  Workflow, 
  Network, 
  Sparkles, 
  Layers, 
  Radio
} from 'lucide-react';
import { useAether } from '../../context/AetherContext';
import { AetherLayerId } from '../../types/aether';

export const LayerNav: React.FC = () => {
  const { activeLayer, setActiveLayer } = useAether();

  const layers: { id: AetherLayerId; label: string; sub: string; icon: React.FC<{ className?: string }> }[] = [
    {
      id: 'tree',
      label: 'Architecture Matrix',
      sub: '5-Layer Hierarchy',
      icon: GitFork,
    },
    {
      id: 'root',
      label: '1. Root Layer',
      sub: 'Sovereignty & Privacy Root',
      icon: Shield,
    },
    {
      id: 'trunk',
      label: '2. Trunk Engine',
      sub: 'Clinical Protocol Engine',
      icon: Dna,
    },
    {
      id: 'branch',
      label: '3. Branch Ops',
      sub: 'Clinic Operations & Lab',
      icon: Workflow,
    },
    {
      id: 'canopy',
      label: '4. Canopy Intel',
      sub: 'Consciousness & Outcomes',
      icon: Sparkles,
    },
    {
      id: 'mycorrhizal',
      label: '5. Mycorrhizal Network',
      sub: 'FHIR, Consortia & BCI',
      icon: Network,
    },
    {
      id: 'live-journey',
      label: 'Live Journey Console',
      sub: 'Real-time Cockpit',
      icon: Radio,
    }
  ];

  return (
    <div className="bg-[#0D120E] border-b border-[#E8EDEA]/10 px-4 lg:px-8 py-2 overflow-x-auto">
      <div className="max-w-7xl mx-auto flex items-center gap-2 min-w-max">
        {layers.map((layer) => {
          const Icon = layer.icon;
          const isActive = activeLayer === layer.id;
          const isLiveJourney = layer.id === 'live-journey';

          return (
            <button
              key={layer.id}
              id={`nav-layer-${layer.id}`}
              onClick={() => setActiveLayer(layer.id)}
              className={`flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-left transition-all relative ${
                isActive
                  ? isLiveJourney
                    ? 'bg-[#1A261F] border border-[#A8C69F]/60 text-[#E8EDEA] shadow-md shadow-[#A8C69F]/10'
                    : 'bg-[#151D17] border border-[#A8C69F]/40 text-[#E8EDEA] shadow'
                  : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA] hover:bg-[#141B16]/60 border border-transparent'
              }`}
            >
              <div className={`p-1.5 rounded-lg ${
                isActive
                  ? isLiveJourney 
                    ? 'bg-[#A8C69F] text-[#0A0D0B]' 
                    : 'bg-[#A8C69F]/20 text-[#A8C69F]'
                  : 'bg-[#141B16] text-[#E8EDEA]/40'
              }`}>
                <Icon className="w-4 h-4" />
              </div>
              <div>
                <div className="text-xs font-semibold tracking-wide flex items-center gap-1.5 font-sans text-[#E8EDEA]">
                  {layer.label}
                  {isLiveJourney && (
                    <span className="w-2 h-2 rounded-full bg-[#A8C69F] animate-pulse"></span>
                  )}
                </div>
                <div className="text-[10px] text-[#E8EDEA]/50 font-mono">
                  {layer.sub}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
