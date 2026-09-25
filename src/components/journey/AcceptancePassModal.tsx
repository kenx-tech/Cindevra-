import React, { useState } from 'react';
import { 
  CheckCircle2, 
  XCircle, 
  Play, 
  RefreshCw, 
  ShieldCheck, 
  X, 
  AlertTriangle, 
  Check, 
  ChevronRight,
  Terminal,
  Activity
} from 'lucide-react';
import { runClinicalAlertAcceptanceSuite, AcceptanceSuiteReport } from '../../services/acceptancePass';

interface AcceptancePassModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AcceptancePassModal: React.FC<AcceptancePassModalProps> = ({ isOpen, onClose }) => {
  const [isRunning, setIsRunning] = useState(false);
  const [report, setReport] = useState<AcceptanceSuiteReport | null>(null);
  const [selectedScenarioId, setSelectedScenarioId] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleRunSuite = async () => {
    setIsRunning(true);
    try {
      // Allow UI to paint loading state
      await new Promise(res => setTimeout(res, 250));
      const res = await runClinicalAlertAcceptanceSuite();
      setReport(res);
      if (res.results.length > 0) {
        setSelectedScenarioId(res.results[0].scenarioId);
      }
    } finally {
      setIsRunning(false);
    }
  };

  const selectedScenario = report?.results.find(r => r.scenarioId === selectedScenarioId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md">
      <div className="bg-[#0A0D0B] border border-white/10 rounded-2xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-white font-sans">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex items-center justify-between bg-[#0F1411]">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 font-mono text-[10px] text-emerald-400 font-bold uppercase tracking-wider">
                <span>Clinical Telemetry Integrity</span>
                <span className="text-white/40">•</span>
                <span>21 CFR Part 11 Engine</span>
              </div>
              <h2 className="text-lg sm:text-xl font-serif font-bold text-[#E8EDEA]">
                Alert Lifecycle Acceptance Test Suite (6 Passes)
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleRunSuite}
              disabled={isRunning}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold flex items-center gap-2 transition-all ${
                isRunning 
                  ? 'bg-emerald-600/50 text-white cursor-wait' 
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg cursor-pointer'
              }`}
            >
              {isRunning ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Executing Scenarios...</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>Run 6-Pass Suite</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-white/60 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* Overview Banner */}
          {!report && !isRunning && (
            <div className="p-6 rounded-2xl bg-[#0F1411] border border-white/10 text-center space-y-3">
              <Activity className="w-10 h-10 text-emerald-400 mx-auto opacity-70" />
              <h3 className="text-base font-bold text-[#E8EDEA]">
                Ready for Verification
              </h3>
              <p className="text-xs text-[#E8EDEA]/70 max-w-xl mx-auto leading-relaxed">
                Click &ldquo;Run 6-Pass Suite&rdquo; to execute the deterministic state machine tests covering sensor disconnect preservation, reconnection resumption, duplicate sample rejection, recurrent episode isolation, cross-patient purge, and cumulative baseline deterioration.
              </p>
            </div>
          )}

          {report && (
            <div className="space-y-4">
              
              {/* Score Bar */}
              <div className="p-4 rounded-xl bg-[#0F1411] border border-white/10 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg font-bold text-xs font-mono flex items-center gap-1.5 ${
                    report.allPassed 
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                      : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                  }`}>
                    {report.allPassed ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />}
                    <span>{report.allPassed ? 'ALL 6 SCENARIOS PASSED' : `${report.totalFailed} SCENARIOS FAILED`}</span>
                  </div>
                  <div className="text-xs text-[#E8EDEA]/70 font-mono">
                    Score: <span className="text-white font-bold">{report.totalPassed} / {report.results.length}</span> Verified
                  </div>
                </div>
                <div className="text-[11px] font-mono text-[#E8EDEA]/50">
                  Executed at: {new Date(report.timestamp).toLocaleTimeString()}
                </div>
              </div>

              {/* Master-Detail Grid */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                
                {/* Scenario List (Left) */}
                <div className="md:col-span-5 space-y-2">
                  <div className="text-[11px] font-mono text-[#E8EDEA]/50 uppercase tracking-wider px-1">
                    Acceptance Scenarios
                  </div>
                  {report.results.map((sc) => (
                    <button
                      key={sc.scenarioId}
                      type="button"
                      onClick={() => setSelectedScenarioId(sc.scenarioId)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between gap-2 ${
                        selectedScenarioId === sc.scenarioId
                          ? 'bg-[#172019] border-emerald-500/50 shadow-md'
                          : 'bg-[#0F1411] border-white/5 hover:bg-white/5 text-[#E8EDEA]/70'
                      }`}
                    >
                      <div className="flex items-start gap-2 min-w-0">
                        <div className="mt-0.5">
                          {sc.passed ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                          ) : (
                            <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-white truncate">
                            Pass {sc.scenarioId}: {sc.title}
                          </div>
                          <div className="text-[10px] text-[#E8EDEA]/50 font-mono">
                            {sc.durationMs}ms
                          </div>
                        </div>
                      </div>
                      <ChevronRight className="w-4 h-4 text-white/30 shrink-0" />
                    </button>
                  ))}
                </div>

                {/* Scenario Detail (Right) */}
                <div className="md:col-span-7 bg-[#0F1411] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4">
                  {selectedScenario ? (
                    <div className="space-y-3">
                      <div className="flex items-center justify-between border-b border-white/10 pb-3">
                        <div>
                          <div className="text-[10px] font-mono text-emerald-400 uppercase font-bold">
                            Scenario #{selectedScenario.scenarioId}
                          </div>
                          <h4 className="text-sm sm:text-base font-bold text-white">
                            {selectedScenario.title}
                          </h4>
                        </div>
                        <span className={`px-2.5 py-1 rounded text-[11px] font-mono font-bold ${
                          selectedScenario.passed 
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' 
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                        }`}>
                          {selectedScenario.passed ? 'PASSED' : 'FAILED'}
                        </span>
                      </div>

                      <div>
                        <div className="text-[10px] font-mono text-[#E8EDEA]/50 mb-1">
                          Expected Clinical Behavior:
                        </div>
                        <div className="p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs text-[#93C5B5] font-mono">
                          {selectedScenario.expectedBehavior}
                        </div>
                      </div>

                      <div>
                        <div className="text-[10px] font-mono text-[#E8EDEA]/50 mb-1 flex items-center gap-1.5">
                          <Terminal className="w-3 h-3 text-emerald-400" />
                          <span>Execution Trace & Assertion Log:</span>
                        </div>
                        <div className="p-3 rounded-xl bg-black/60 border border-white/5 space-y-1.5 font-mono text-[11px]">
                          {selectedScenario.details.map((detail, idx) => (
                            <div 
                              key={idx}
                              className={`leading-relaxed ${
                                detail.startsWith('PASS') 
                                  ? 'text-emerald-300' 
                                  : detail.startsWith('FAIL') 
                                  ? 'text-rose-300 font-bold' 
                                  : 'text-[#E8EDEA]/70'
                              }`}
                            >
                              {detail}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-xs text-[#E8EDEA]/50 font-mono">
                      Select a scenario on the left to review assertion logs.
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-white/10 flex items-center justify-between bg-[#0F1411]">
          <span className="text-[10px] font-mono text-[#E8EDEA]/40">
            Engine: TelemetryIngestionService • Typed SHA-256 Audit Stream
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-xs"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
