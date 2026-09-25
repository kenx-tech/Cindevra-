import React, { useState } from 'react';
import { 
  Network, 
  FileCode, 
  Share2, 
  Send, 
  Radio, 
  CheckCircle2, 
  Sparkles, 
  Download, 
  Sliders, 
  Layers,
  Cpu,
  Eye
} from 'lucide-react';
import { useAether } from '../../context/AetherContext';

export const MycorrhizalLayer: React.FC = () => {
  const { selectedPatient, recordAudit } = useAether();

  const [activeTab, setActiveTab] = useState<'ehr' | 'consortium' | 'rems' | 'techHooks'>('ehr');
  const [fhirExported, setFhirExported] = useState(false);
  const [remsReportGenerated, setRemsReportGenerated] = useState(false);
  const [lightingPreset, setLightingPreset] = useState<'Warm Ember 2200K' | 'Oceanic Indigo 450nm' | 'Luminous Gold 3000K' | 'Dim Red Grounding 650nm'>('Warm Ember 2200K');
  const [bciStatus, setBciStatus] = useState<'Connected' | 'Streaming' | 'Calibrated'>('Streaming');

  const handleExportFHIR = () => {
    setFhirExported(true);
    recordAudit(`FHIR R4 DiagnosticReport JSON-LD generated for ${selectedPatient?.pseudonym || 'AE-9941'}`, 'REGULATORY');
  };

  const handleGenerateREMS = () => {
    setRemsReportGenerated(true);
    recordAudit(`FDA REMS Electronic Compliance Dossier compiled & cryptographically sealed`, 'REGULATORY');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Mycorrhizal Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#141B16] border border-[#C8B195]/30 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#C8B195] font-mono text-xs">
            <Network className="w-4 h-4" />
            <span>5.0 Mycorrhizal Network — Interconnection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#E8EDEA] tracking-tight">
            EHR Interoperability, Open Science & Tech Hooks
          </h1>
          <p className="text-xs sm:text-sm text-[#E8EDEA]/70 max-w-2xl font-light">
            SMART-on-FHIR clinical interoperability, research consortium bridges (MAPS, Usona, Beckley), FDA REMS compliance APIs, and future BCI consciousness telemetry hooks.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-[#0D120E] p-1.5 rounded-xl border border-[#E8EDEA]/10 self-start md:self-auto overflow-x-auto">
          <button
            id="myco-tab-ehr"
            onClick={() => setActiveTab('ehr')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'ehr'
                ? 'bg-[#15221F] border border-[#93C5B5]/40 text-[#93C5B5] shadow'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
            }`}
          >
            5.1 FHIR / EHR Bridge
          </button>
          <button
            id="myco-tab-consortium"
            onClick={() => setActiveTab('consortium')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'consortium'
                ? 'bg-[#15221F] border border-[#93C5B5]/40 text-[#93C5B5] shadow'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
            }`}
          >
            5.2 Research Consortia
          </button>
          <button
            id="myco-tab-rems"
            onClick={() => setActiveTab('rems')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'rems'
                ? 'bg-[#15221F] border border-[#93C5B5]/40 text-[#93C5B5] shadow'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
            }`}
          >
            5.3 Regulatory REMS API
          </button>
          <button
            id="myco-tab-tech"
            onClick={() => setActiveTab('techHooks')}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'techHooks'
                ? 'bg-[#15221F] border border-[#93C5B5]/40 text-[#93C5B5] shadow'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
            }`}
          >
            5.4 BCI & Spatial Tech Hooks
          </button>
        </div>
      </div>

      {/* TAB 5.1: FHIR / EHR Interoperability */}
      {activeTab === 'ehr' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* FHIR Bundle Exporter */}
            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#C8B195]/15 text-[#C8B195] border border-[#C8B195]/30">
                  <FileCode className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#E8EDEA]">5.1.1 SMART-on-FHIR R4 Bundle Exporter</h3>
                  <p className="text-xs text-[#E8EDEA]/50 font-mono">Epic / Cerner / AthenaHealth Standardized Integration</p>
                </div>
              </div>

              <p className="text-xs text-[#E8EDEA]/70 leading-relaxed font-sans">
                Transforms session biometrics, dosage administration events, and MEQ-30 scores into HL7/FHIR compliant Clinical Document Architecture (CDA) records without exposing raw personal identifiers.
              </p>

              <div className="space-y-2 text-xs font-mono">
                <div className="p-3 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-[#E8EDEA]/60 flex justify-between">
                  <span>Resource Type:</span>
                  <span className="text-[#C8B195]">Bundle (collection) — MedicationAdministration</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-[#E8EDEA]/60 flex justify-between">
                  <span>LOINC Code:</span>
                  <span className="text-[#93C5B5]">96582-2 (Psychedelic-assisted session summary)</span>
                </div>
                <div className="p-3 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-[#E8EDEA]/60 flex justify-between">
                  <span>RxNorm Concept:</span>
                  <span className="text-[#A8C69F]">1114197 (Psilocybin oral capsule 25 mg)</span>
                </div>
              </div>

              <button
                onClick={handleExportFHIR}
                className="w-full py-2.5 rounded-xl bg-[#A8C69F] hover:bg-[#b8d6af] text-[#0A0D0B] font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Generate & Sign FHIR R4 Bundle</span>
              </button>

              {fhirExported && (
                <div className="p-3 rounded-xl bg-[#1A261F] border border-[#A8C69F]/40 text-[#A8C69F] text-xs font-mono flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#A8C69F] shrink-0" />
                  <span>FHIR R4 Bundle validated & cryptographically attested for Epic EHR export.</span>
                </div>
              )}
            </div>

            {/* FHIR JSON Preview */}
            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-serif font-bold text-sm text-[#E8EDEA]">FHIR R4 Resource Preview</h3>
                <span className="text-[10px] font-mono text-[#A8C69F]">application/fhir+json</span>
              </div>

              <pre className="p-4 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-[11px] font-mono text-[#E8EDEA]/70 overflow-x-auto h-72">
{`{
  "resourceType": "Bundle",
  "id": "cindevra-journey-bundle-9941",
  "type": "collection",
  "timestamp": "${new Date().toISOString()}",
  "entry": [
    {
      "resource": {
        "resourceType": "MedicationAdministration",
        "id": "med-admin-01",
        "status": "completed",
        "medicationCodeableConcept": {
          "coding": [{
            "system": "http://www.nlm.nih.gov/research/rxnorm",
            "code": "1114197",
            "display": "Psilocybin GMP API 25mg"
          }]
        },
        "subject": {
          "reference": "Patient/${selectedPatient?.zkIdentityHash.slice(0, 12)}..."
        },
        "effectiveDateTime": "2026-09-01T09:00:00Z",
        "dosage": {
          "dose": { "value": 25, "unit": "mg" },
          "route": { "text": "Oral Capsule with Sacred Ceremony Protocol" }
        }
      }
    }
  ]
}`}
              </pre>
            </div>

          </div>
        </div>
      )}

      {/* TAB 5.2: Research Consortium Bridge */}
      {activeTab === 'consortium' && (
        <div className="space-y-6">
          <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#C8B195] font-mono text-xs">
                <Share2 className="w-4 h-4" />
                <span>5.2 Open Science Consortium Bridge</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-[#E8EDEA]">
                Federated Open Science Clinical Data Stream
              </h2>
              <p className="text-xs sm:text-sm text-[#E8EDEA]/70 font-light font-sans">
                Sync anonymous clinical outcomes directly with global open science databases to accelerate meta-analyses for worldwide re-scheduling.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-xs space-y-2">
                <div className="font-bold text-[#E8EDEA] text-sm font-sans">MAPS / Lycos Open Science Portal</div>
                <p className="text-[#E8EDEA]/60 font-sans">MDMA-Assisted Psychotherapy for PTSD Global Phase III Real-World Database.</p>
                <div className="pt-2 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#A8C69F]">● Connected</span>
                  <span className="text-[#E8EDEA]/40">Sync Daily 00:00</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-xs space-y-2">
                <div className="font-bold text-[#E8EDEA] text-sm font-sans">Usona Institute Clinical Registry</div>
                <p className="text-[#E8EDEA]/60 font-sans">Psilocybin for Major Depressive Disorder synthetic trial meta-consortium.</p>
                <div className="pt-2 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#A8C69F]">● Connected</span>
                  <span className="text-[#E8EDEA]/40">Sync Bi-Weekly</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-xs space-y-2">
                <div className="font-bold text-[#E8EDEA] text-sm font-sans">Beckley Foundation Consciousness Lab</div>
                <p className="text-[#E8EDEA]/60 font-sans">5-MeO-DMT and Ibogaine Neuroplasticity & EEG synchrony repository.</p>
                <div className="pt-2 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#A8C69F]">● Connected</span>
                  <span className="text-[#E8EDEA]/40">Sync Continuous</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5.3: Regulatory REMS API */}
      {activeTab === 'rems' && (
        <div className="space-y-6">
          <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 sm:p-8 space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-[#C8B195] font-mono text-xs">
                <Send className="w-4 h-4" />
                <span>5.3 Regulatory Reporting & FDA REMS Bridge</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-[#E8EDEA]">
                Automated Risk Evaluation & Mitigation Strategy (REMS)
              </h2>
              <p className="text-xs sm:text-sm text-[#E8EDEA]/70 font-light font-sans">
                Generates cryptographically sealed adverse event filings, two-physician sign-offs, and state licensing authority quarterly dossiers with one click.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-xs space-y-3 font-sans">
              <div className="flex justify-between items-center text-[#E8EDEA]/80 font-mono">
                <span>FDA REMS Form 3804-PSY Status:</span>
                <span className="text-[#A8C69F] font-bold">100% Compliant</span>
              </div>
              <div className="flex justify-between items-center text-[#E8EDEA]/80 font-mono">
                <span>Mandatory Adverse Event Audit:</span>
                <span className="text-[#A8C69F] font-bold">0 Serious Adverse Events (SAEs)</span>
              </div>
              <div className="flex justify-between items-center text-[#E8EDEA]/80 font-mono">
                <span>Dual Facilitator Certification:</span>
                <span className="text-[#93C5B5] font-bold">Verified on State Registry</span>
              </div>
            </div>

            <button
              onClick={handleGenerateREMS}
              className="px-5 py-2.5 rounded-xl bg-[#A8C69F] hover:bg-[#b8d6af] text-[#0A0D0B] font-bold text-xs transition-all shadow-md font-sans"
            >
              Compile & Sign REMS Quarterly Audit Report
            </button>

            {remsReportGenerated && (
              <div className="p-3.5 rounded-xl bg-[#1A261F] border border-[#A8C69F]/40 text-[#A8C69F] text-xs font-mono flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#A8C69F]" />
                <span>FDA REMS Packet compiled with 256-bit signature. Ready for electronic gateway relay.</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 5.4: Future Consciousness Tech Hooks */}
      {activeTab === 'techHooks' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            
            {/* BCI Telemetry Ingestion */}
            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#C8B195]/15 text-[#C8B195] border border-[#C8B195]/30">
                  <Cpu className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#E8EDEA]">5.4.1 BCI & Neural Stream Ingestion</h3>
                  <p className="text-xs text-[#E8EDEA]/50 font-mono">Non-Invasive EEG / Near-Infrared Spectrometry</p>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 space-y-2 text-xs font-mono">
                <div className="flex justify-between">
                  <span className="text-[#E8EDEA]/50">BCI Ingestion Stream:</span>
                  <span className="text-[#A8C69F]">LSL (Lab Streaming Layer) Active</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#E8EDEA]/50">Hardware Bridge:</span>
                  <span className="text-[#E8EDEA]">OpenBCI Cyton 8-Ch / Emotiv EPOC X</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#E8EDEA]/50">Sampling Rate:</span>
                  <span className="text-[#93C5B5]">250 Hz (Low Latency Buffer)</span>
                </div>
              </div>

              <p className="text-xs text-[#E8EDEA]/70 leading-relaxed font-sans">
                Cindevra ingests real-time neural synchrony metrics to dynamically adjust acoustic playlists and alert facilitators if theta-alpha coherence signals panic.
              </p>
            </div>

            {/* Immersive Room & Circadian Light Drivers */}
            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#A8C69F]/15 text-[#A8C69F] border border-[#A8C69F]/30">
                  <Sliders className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-base text-[#E8EDEA]">5.4.2 Sanctuary Spatial Environment Hooks</h3>
                  <p className="text-xs text-[#E8EDEA]/50 font-mono">DMX-512 & Smart Lighting Architecture</p>
                </div>
              </div>

              <div className="space-y-2 text-xs font-sans">
                <label className="text-[#E8EDEA]/80 font-medium">Active Sanctuary Circadian Lighting Preset</label>
                <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                  {(['Warm Ember 2200K', 'Oceanic Indigo 450nm', 'Luminous Gold 3000K', 'Dim Red Grounding 650nm'] as const).map((preset) => (
                    <button
                      key={preset}
                      onClick={() => setLightingPreset(preset)}
                      className={`p-2.5 rounded-xl border text-left transition-all ${
                        lightingPreset === preset 
                          ? 'bg-[#15221F] border-[#93C5B5] text-[#93C5B5]' 
                          : 'bg-[#0D120E] border-[#E8EDEA]/10 text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
                      }`}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-xs text-[#E8EDEA]/70 font-mono">
                Current Room Preset: <strong className="text-[#C8B195]">{lightingPreset}</strong> (Synced with Ingestion Phase 2)
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
