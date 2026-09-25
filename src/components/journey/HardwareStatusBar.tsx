import React from 'react';
import { 
  Activity, 
  Battery, 
  Radio, 
  Play, 
  Pause, 
  RotateCcw,
  RefreshCw,
  Clock,
  ShieldCheck
} from 'lucide-react';
import { DeviceStreamStatus } from '../../services/telemetryAdapter';
import { TelemetryQualityFlag } from '../../types/telemetry';

interface HardwareStatusBarProps {
  devices: DeviceStreamStatus[];
  isSimulating: boolean;
  onToggleSimulation: () => void;
  onResetBuffers: () => void;
  onInjectArtifact: (type: 'hypertensive_spike' | 'hypotensive_event' | 'panic_tachycardia' | 'extreme_bradycardia' | 'desaturation' | 'signal_drop') => void;
  onReconnectDevice: (deviceId: string) => void;
  streamQualityScore: number;
  onOpenAcceptanceSuite?: () => void;
}

export const HardwareStatusBar: React.FC<HardwareStatusBarProps> = ({
  devices,
  isSimulating,
  onToggleSimulation,
  onResetBuffers,
  onInjectArtifact,
  onReconnectDevice,
  streamQualityScore,
  onOpenAcceptanceSuite
}) => {
  const getQualityBadge = (quality: TelemetryQualityFlag, isStale: boolean, isManuallyDisconnected: boolean) => {
    if (isManuallyDisconnected) {
      return (
        <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-rose-400 bg-rose-500/15 px-1.5 py-0.5 rounded border border-rose-500/40">
          <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
          LEAD DISCONNECTED
        </span>
      );
    }

    if (isStale || quality === 'stale') {
      return (
        <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 bg-amber-500/15 px-1.5 py-0.5 rounded border border-amber-500/40 animate-pulse">
          <Clock className="w-2.5 h-2.5" />
          STALE TIMEOUT
        </span>
      );
    }

    switch (quality) {
      case 'good':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            SYNCHRONIZED
          </span>
        );
      case 'marginal':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-yellow-400 bg-yellow-500/10 px-1.5 py-0.5 rounded border border-yellow-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
            MARGINAL
          </span>
        );
      case 'poor':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            POOR SNR
          </span>
        );
      case 'awaiting_data':
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/30">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            AWAITING SIGNAL
          </span>
        );
      case 'disconnected':
      default:
        return (
          <span className="flex items-center gap-1 text-[10px] font-mono font-bold text-[#E8EDEA]/40 bg-white/5 px-1.5 py-0.5 rounded border border-white/10">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E8EDEA]/30" />
            DISCONNECTED
          </span>
        );
    }
  };

  return (
    <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-4 space-y-3.5 shadow-xl">
      
      {/* Top Strip: Stream Mode, Quality Score, Simulation Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 text-xs">
        
        {/* Left: Stream Mode & Quality Score */}
        <div className="flex items-center flex-wrap gap-3">
          
          <div className="flex items-center gap-2">
            <Radio className={`w-4 h-4 ${isSimulating ? 'text-emerald-400 animate-pulse' : 'text-[#E8EDEA]/40'}`} />
            <span className="font-mono font-bold text-[#E8EDEA]">
              2.0 Telemetry Ingestion Layer
            </span>
          </div>

          <div className="h-3.5 w-px bg-white/10 hidden sm:block" />

          {/* Mode Badge */}
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-mono uppercase text-[#E8EDEA]/50">Source:</span>
            <span className={`px-2 py-0.5 rounded font-mono text-[10px] font-bold uppercase tracking-wider ${
              isSimulating 
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' 
                : 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
            }`}>
              {isSimulating ? 'SIMULATED PROTOCOL STREAM' : 'PHYSICAL HARDWARE INGEST'}
            </span>
          </div>

          <div className="h-3.5 w-px bg-white/10 hidden sm:block" />

          {/* Stream Quality Score */}
          <div className="flex items-center gap-1.5 text-xs font-mono">
            <span className="text-[#E8EDEA]/60">Stream Quality:</span>
            <span className={`font-bold ${
              streamQualityScore >= 0.85 ? 'text-emerald-400' : streamQualityScore >= 0.5 ? 'text-yellow-400' : 'text-rose-400'
            }`}>
              {Math.round(streamQualityScore * 100)}%
            </span>
            <span className="text-[10px] text-[#E8EDEA]/40">
              ({devices.filter(d => d.quality === 'good' && !d.isStale && !d.isManuallyDisconnected).length}/{devices.length} channels verified)
            </span>
          </div>

        </div>

        {/* Right: Simulation Controls & Stress Injections */}
        <div className="flex items-center flex-wrap gap-2">
          
          <button
            type="button"
            onClick={onToggleSimulation}
            className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm ${
              isSimulating
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30'
                : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30'
            }`}
          >
            {isSimulating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            {isSimulating ? 'Pause Simulated Stream' : 'Start Simulated Stream'}
          </button>

          <button
            type="button"
            onClick={onResetBuffers}
            title="Reset telemetry buffers to awaiting data"
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#E8EDEA]/60 border border-white/10 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Stress Injection Sub-menu */}
          <div className="flex items-center gap-1 bg-[#0D120E] p-1 rounded-xl border border-white/5 flex-wrap">
            <span className="text-[10px] font-mono text-[#E8EDEA]/40 px-1.5">Inject Test:</span>
            
            <button
              type="button"
              onClick={() => onInjectArtifact('desaturation')}
              title="Inject SpO2 Desaturation (88%)"
              className="px-2 py-1 rounded bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 border border-purple-500/30 text-[10px] font-mono transition-colors"
            >
              SpO₂ 88%
            </button>

            <button
              type="button"
              onClick={() => onInjectArtifact('signal_drop')}
              title="Disconnect sensor lead (Signal unavailable test)"
              className="px-2 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-[10px] font-mono transition-colors"
            >
              Disconnect Sensor
            </button>

            <button
              type="button"
              onClick={() => onInjectArtifact('hypertensive_spike')}
              title="Inject High BP Protocol Threshold (174/106 mmHg)"
              className="px-2 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-[10px] font-mono transition-colors"
            >
              BP High (174/106)
            </button>

            <button
              type="button"
              onClick={() => onInjectArtifact('hypotensive_event')}
              title="Inject Hypotensive Event (84/52 mmHg)"
              className="px-2 py-1 rounded bg-amber-950/40 hover:bg-amber-900/60 text-amber-300 border border-amber-500/30 text-[10px] font-mono transition-colors"
            >
              BP Low (84/52)
            </button>

            <button
              type="button"
              onClick={() => onInjectArtifact('panic_tachycardia')}
              title="Inject Autonomic Surge / Severe Tachycardia (144 bpm / low HRV)"
              className="px-2 py-1 rounded bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-[10px] font-mono transition-colors"
            >
              Surge (144 bpm)
            </button>

            <button
              type="button"
              onClick={() => onInjectArtifact('extreme_bradycardia')}
              title="Inject Extreme Bradycardia (42 bpm)"
              className="px-2 py-1 rounded bg-blue-950/40 hover:bg-blue-900/60 text-blue-300 border border-blue-500/30 text-[10px] font-mono transition-colors"
            >
              Brady (42 bpm)
            </button>
          </div>

          {onOpenAcceptanceSuite && (
            <button
              type="button"
              onClick={onOpenAcceptanceSuite}
              title="Run 6-Pass Clinical Alert Acceptance Verification Suite"
              className="px-3 py-1.5 rounded-xl bg-emerald-500/15 hover:bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all shadow-sm"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Acceptance Pass (6/6)</span>
            </button>
          )}

        </div>

      </div>

      {/* Hardware Node Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-1">
        {devices.map((device) => {
          const isAwaiting = device.quality === 'awaiting_data' && device.sampleCount === 0;

          return (
            <div 
              key={device.deviceId}
              className={`p-3 rounded-xl border transition-all text-xs ${
                device.isManuallyDisconnected 
                  ? 'bg-rose-950/20 border-rose-500/30' 
                  : device.isStale 
                  ? 'bg-amber-950/20 border-amber-500/30'
                  : 'bg-[#0D120E] border-white/5'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="font-medium text-[#E8EDEA] flex items-center gap-1.5">
                    <Activity className={`w-3.5 h-3.5 ${
                      device.quality === 'good' && !device.isStale && !device.isManuallyDisconnected
                        ? 'text-emerald-400' 
                        : 'text-[#E8EDEA]/40'
                    }`} />
                    <span className="truncate max-w-[130px] font-sans text-xs">{device.modelName}</span>
                  </div>
                  <div className="text-[10px] font-mono text-[#E8EDEA]/40">
                    ID: {device.deviceId}
                  </div>
                </div>

                <div className="flex flex-col items-end gap-1">
                  {getQualityBadge(device.quality, device.isStale, device.isManuallyDisconnected)}
                </div>
              </div>

              {/* Status footer inside card */}
              <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between text-[10px] font-mono text-[#E8EDEA]/50">
                {isAwaiting ? (
                  <span className="text-[#E8EDEA]/40 italic">Awaiting first telemetry envelope...</span>
                ) : device.isManuallyDisconnected ? (
                  <button
                    type="button"
                    onClick={() => onReconnectDevice(device.deviceId)}
                    className="flex items-center gap-1 text-xs text-rose-300 hover:text-rose-200 underline font-bold"
                  >
                    <RefreshCw className="w-3 h-3" /> Reconnect Sensor Lead
                  </button>
                ) : (
                  <>
                    <div className="flex items-center gap-1">
                      <Battery className="w-3 h-3 text-[#93C5B5]" />
                      <span>{device.batteryPercent !== null ? `${device.batteryPercent}%` : 'N/A'}</span>
                    </div>

                    <div className="flex items-center gap-1">
                      <span>{device.latencyMs !== null ? `${device.latencyMs}ms` : '--'}</span>
                      <span>•</span>
                      <span>{device.sampleCount} pkts</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
