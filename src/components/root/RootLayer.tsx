import React, { useState } from 'react';
import { 
  Shield, 
  Key, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  History, 
  Lock, 
  EyeOff, 
  FileText, 
  Sparkles, 
  Download, 
  RefreshCw,
  Scale,
  Fingerprint,
  Cpu,
  Layers,
  HeartHandshake,
  ToggleLeft,
  ToggleRight,
  Send
} from 'lucide-react';
import { useAether } from '../../context/AetherContext';
import { PatientRecord } from '../../types/aether';

export const RootLayer: React.FC = () => {
  const { 
    patients, 
    selectedPatient, 
    setSelectedPatient, 
    updatePatientSovereignty, 
    triggerRightToBeForgotten,
    auditLedger,
    recordAudit,
    jurisdictions,
    activeJurisdiction,
    setActiveJurisdiction,
    emergencyLockdown,
    toggleEmergencyLockdown,
    part2Consents,
    togglePart2Redaction
  } = useAether();

  const [activeTab, setActiveTab] = useState<'sovereignty' | 'legal' | 'security' | 'part2'>('sovereignty');
  const [zkProofStatus, setZkProofStatus] = useState<'idle' | 'generating' | 'verified'>('idle');
  const [zkProofResult, setZkProofResult] = useState<string | null>(null);
  const [shredConfirmId, setShredConfirmId] = useState<string | null>(null);
  const [customJurisdictionNote, setCustomJurisdictionNote] = useState('');

  // Active patient target
  const patient = selectedPatient || patients[0];

  const handleGenerateZKProof = () => {
    setZkProofStatus('generating');
    setTimeout(() => {
      setZkProofStatus('verified');
      setZkProofResult(`π_ZK_SNARK: { a: [0x41b7..., 0x99ce...], b: [[0x01..., 0x02...]], c: [0x8f4d...], publicInputs: ["Eligible_No_Schizophrenia_History", "Valid_Consent_Signed", "Hash_${patient.zkIdentityHash.slice(0, 10)}"] }`);
      recordAudit(`Zero-Knowledge Proof verified for ${patient.pseudonym}: Clinical eligibility proven without disclosing psychiatric EHR history`, 'SECURITY');
    }, 1200);
  };

  const handleShred = (id: string) => {
    triggerRightToBeForgotten(id);
    setShredConfirmId(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      
      {/* Root Layer Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-6 rounded-2xl bg-[#141B16] border border-[#A8C69F]/30 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[#A8C69F] font-mono text-xs">
            <Shield className="w-4 h-4" />
            <span>1.0 Root Layer — Sovereignty & Foundation</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-serif font-bold text-[#E8EDEA] tracking-tight">
            Patient Sovereignty & Cryptographic Root
          </h1>
          <p className="text-xs sm:text-sm text-[#E8EDEA]/70 max-w-2xl font-light">
            Enforcing non-negotiable patient data ownership, zero-knowledge verification, 42 CFR Part 2 granular consent rules, and multi-jurisdictional legal adapters.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex items-center gap-2 bg-[#0D120E] p-1.5 rounded-xl border border-[#E8EDEA]/10 self-start md:self-auto overflow-x-auto max-w-full">
          <button
            id="root-tab-sovereignty"
            onClick={() => setActiveTab('sovereignty')}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'sovereignty'
                ? 'bg-[#1A261F] border border-[#A8C69F]/40 text-[#A8C69F] shadow'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
            }`}
          >
            1.1 Sovereignty Core
          </button>
          <button
            id="root-tab-part2"
            onClick={() => setActiveTab('part2')}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'part2'
                ? 'bg-[#1A261F] border border-[#A8C69F]/40 text-[#A8C69F] shadow'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
            }`}
          >
            1.2 42 CFR Part 2 Consent
          </button>
          <button
            id="root-tab-legal"
            onClick={() => setActiveTab('legal')}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'legal'
                ? 'bg-[#1A261F] border border-[#A8C69F]/40 text-[#A8C69F] shadow'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
            }`}
          >
            1.3 Legal Adapter
          </button>
          <button
            id="root-tab-security"
            onClick={() => setActiveTab('security')}
            className={`px-3.5 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
              activeTab === 'security'
                ? 'bg-[#1A261F] border border-[#A8C69F]/40 text-[#A8C69F] shadow'
                : 'text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
            }`}
          >
            1.4 Security & Privacy Root
          </button>
        </div>
      </div>

      {/* TAB 1.1: Patient Sovereignty Core */}
      {activeTab === 'sovereignty' && (
        <div className="space-y-6">
          
          {/* Patient Selector Strip */}
          <div className="flex items-center gap-3 overflow-x-auto pb-2">
            <span className="text-xs font-mono text-[#E8EDEA]/60 whitespace-nowrap">Active Participant Vault:</span>
            {patients.map(p => (
              <button
                key={p.id}
                onClick={() => setSelectedPatient(p)}
                className={`px-3 py-1.5 rounded-xl text-xs font-mono flex items-center gap-2 border transition-all whitespace-nowrap ${
                  patient.id === p.id 
                    ? 'bg-[#1A261F] border-[#A8C69F] text-[#A8C69F] glow-sage' 
                    : 'bg-[#141B16] border-[#E8EDEA]/10 text-[#E8EDEA]/60 hover:text-[#E8EDEA]'
                }`}
              >
                <Fingerprint className="w-3.5 h-3.5" />
                <span>{p.pseudonym}</span>
                {p.dataSovereignty.rightToBeForgottenRequested && (
                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-rose-950/60 text-rose-300 border border-rose-800">Shredded</span>
                )}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Identity & Consent Vault */}
            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#A8C69F]/15 text-[#A8C69F] border border-[#A8C69F]/30">
                    <Key className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#E8EDEA]">Identity & Consent Vault</h3>
                    <p className="text-xs text-[#E8EDEA]/50 font-mono">1.1.1 Self-Custodial Permissions</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#1A261F] text-[#A8C69F] border border-[#A8C69F]/30">
                  Signed
                </span>
              </div>

              <div className="space-y-3 pt-2 text-xs">
                <div className="bg-[#0D120E] p-3 rounded-xl border border-[#E8EDEA]/10 space-y-1">
                  <div className="text-[#E8EDEA]/50 font-mono text-[11px]">Zero-Knowledge Identity Hash</div>
                  <div className="font-mono text-[#A8C69F] break-all text-[11px]">
                    {patient.zkIdentityHash}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[#E8EDEA]/80 font-medium block font-sans">Key Custody Architecture</label>
                  <select
                    value={patient.dataSovereignty.encryptedKeyHolder}
                    onChange={(e) => updatePatientSovereignty(patient.id, { encryptedKeyHolder: e.target.value as PatientRecord['dataSovereignty']['encryptedKeyHolder'] })}
                    className="w-full bg-[#0D120E] border border-[#E8EDEA]/10 rounded-xl px-3 py-2 text-xs text-[#E8EDEA] focus:outline-none focus:border-[#A8C69F]"
                  >
                    <option value="Patient Self-Custody">Patient Self-Custody (Private Key in Secure Enclave)</option>
                    <option value="Dual-Key Proxy">Dual-Key Proxy (Patient + Lead Clinician Multi-Sig)</option>
                    <option value="Emergency Medical Custody">Emergency Medical Custody (Timed Escrow)</option>
                  </select>
                </div>

                <div className="pt-2 border-t border-[#E8EDEA]/10 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[#E8EDEA]/80 font-sans">Differential Privacy Opt-In</span>
                    <input
                      type="checkbox"
                      checked={patient.dataSovereignty.researchContributionOptIn}
                      onChange={(e) => updatePatientSovereignty(patient.id, { researchContributionOptIn: e.target.checked })}
                      className="w-4 h-4 accent-[#A8C69F] rounded cursor-pointer"
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-[#E8EDEA]/50">
                    <span>Privacy Epsilon Budget (ε)</span>
                    <span className="font-mono text-[#A8C69F]">ε = {patient.dataSovereignty.differentialPrivacyEpsilon}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Data Ownership Ledger */}
            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#C8B195]/15 text-[#C8B195] border border-[#C8B195]/30">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#E8EDEA]">Data Ownership Ledger</h3>
                    <p className="text-xs text-[#E8EDEA]/50 font-mono">1.1.2 Immutable Access Records</p>
                  </div>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[#0D120E] text-[#E8EDEA]/70 border border-[#E8EDEA]/10">
                  {patient.dataSovereignty.auditLogCount} Access Proofs
                </span>
              </div>

              <p className="text-xs text-[#E8EDEA]/60 leading-relaxed font-sans">
                Every single clinician view, vitals export, or audio stream decryption is recorded as an immutable hash signature on the participant's sovereign record.
              </p>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10">
                  <span className="text-[#E8EDEA]/50">Assigned Clinical Protocol</span>
                  <span className="font-mono text-[#E8EDEA]">{patient.assignedProtocolId}</span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10">
                  <span className="text-[#E8EDEA]/50">Somatic Touch Code Status</span>
                  <span className="text-[#A8C69F] flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Explicitly Authorized
                  </span>
                </div>
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10">
                  <span className="text-[#E8EDEA]/50">Jurisdiction Compliance</span>
                  <span className="font-mono text-[#C8B195]">{patient.jurisdiction}</span>
                </div>
              </div>

              <button
                onClick={() => recordAudit(`Sovereign Data Archive exported by ${patient.pseudonym}`, 'SOVEREIGNTY')}
                className="w-full mt-2 flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-[#1A261F] hover:bg-[#202E25] text-xs text-[#E8EDEA] font-medium transition-all border border-[#A8C69F]/30"
              >
                <Download className="w-3.5 h-3.5 text-[#A8C69F]" /> Export Sovereign JSON-LD Archive
              </button>
            </div>

            {/* Right to be Forgotten & Zero-Knowledge Verifier */}
            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-rose-950/40 text-rose-300 border border-rose-800/40">
                    <Trash2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#E8EDEA]">Right to be Forgotten</h3>
                    <p className="text-xs text-[#E8EDEA]/50 font-mono">1.1.4 Cryptographic Data Shredder</p>
                  </div>
                </div>
              </div>

              <p className="text-xs text-[#E8EDEA]/60 leading-relaxed font-sans">
                Permanent cryptographic erasure overwrites all personal session logs and bio-markers with randomized entropy, preserving only the zero-knowledge compliance proof.
              </p>

              {patient.dataSovereignty.rightToBeForgottenRequested ? (
                <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-800 text-rose-200 text-xs font-mono space-y-1">
                  <div className="font-bold">Cryptographically Shredded:</div>
                  <div className="text-[11px] text-rose-300/80">Keys burned at {patient.dataSovereignty.shreddedTimestamp}</div>
                </div>
              ) : (
                <div className="space-y-3 pt-2">
                  {shredConfirmId === patient.id ? (
                    <div className="p-3 bg-rose-950/60 border border-rose-700 rounded-xl space-y-2">
                      <div className="text-xs text-rose-200 font-medium">Irreversible: Confirm key destruction?</div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleShred(patient.id)}
                          className="flex-1 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs"
                        >
                          Confirm Burn
                        </button>
                        <button
                          onClick={() => setShredConfirmId(null)}
                          className="px-3 py-1.5 rounded-lg bg-[#0D120E] text-xs text-[#E8EDEA]/80"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShredConfirmId(patient.id)}
                      className="w-full py-2.5 rounded-xl bg-[#2A1515] hover:bg-[#3D1A1A] border border-rose-800/50 text-rose-300 font-medium text-xs transition-all flex items-center justify-center gap-2"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Initiate Cryptographic Shredding</span>
                    </button>
                  )}
                </div>
              )}

              {/* ZK-SNARK Verifier Box */}
              <div className="pt-3 border-t border-[#E8EDEA]/10 space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-mono text-[#E8EDEA]/70">Zero-Knowledge Eligibility Circuit</span>
                  <span className="text-[10px] font-mono text-[#A8C69F]">Groth16 Verifier</span>
                </div>

                {zkProofStatus === 'verified' && zkProofResult && (
                  <div className="p-2.5 rounded-xl bg-[#1A261F] border border-[#A8C69F]/40 font-mono text-[10px] text-[#A8C69F] break-all">
                    {zkProofResult}
                  </div>
                )}

                <button
                  onClick={handleGenerateZKProof}
                  disabled={zkProofStatus === 'generating'}
                  className="w-full py-2 rounded-xl bg-[#0D120E] hover:bg-[#15221F] border border-[#A8C69F]/30 text-xs text-[#A8C69F] font-mono flex items-center justify-center gap-1.5 transition-all"
                >
                  <Cpu className="w-3.5 h-3.5" />
                  <span>{zkProofStatus === 'generating' ? 'Computing Proof...' : 'Generate ZK-SNARK Verification'}</span>
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* TAB 1.2: 42 CFR Part 2 Granular Consent & Redisclosure Rules */}
      {activeTab === 'part2' && (
        <div className="space-y-6">
          <div className="bg-[#141B16] border border-[#93C5B5]/30 rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="p-2 rounded-lg bg-[#93C5B5]/15 text-[#93C5B5] border border-[#93C5B5]/30">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif font-bold text-lg text-[#E8EDEA]">42 CFR Part 2 Granular Consent & Redisclosure Rules</h3>
                <p className="text-xs text-[#E8EDEA]/50 font-mono">Segmented Authorization & Strict Prohibition on Redisclosure</p>
              </div>
            </div>

            <p className="text-xs text-[#E8EDEA]/70 leading-relaxed font-sans max-w-3xl">
              Under federal 42 CFR Part 2 guidelines, clinical entheogen and substance-use disorder records may NOT be disclosed to general Health Information Exchanges (HIEs), clearinghouses, or primary care networks without explicit, granular opt-in consent.
            </p>
          </div>

          {/* Granular Consent Rule Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {part2Consents.map((rule) => (
              <div key={rule.id} className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4 shadow-xl flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-serif font-bold text-base text-[#E8EDEA]">{rule.recipientName}</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#0D120E] text-[#93C5B5] border border-[#93C5B5]/30">
                      {rule.recipientType}
                    </span>
                  </div>

                  <div className="text-xs text-[#E8EDEA]/70 font-sans space-y-1">
                    <div>Purpose: <span className="text-[#E8EDEA] font-mono">{rule.purpose}</span></div>
                    <div>Expiration: <span className="text-[#C8B195] font-mono">{rule.expirationDate}</span></div>
                  </div>

                  {/* Redaction Switches */}
                  <div className="space-y-2 pt-2 border-t border-[#E8EDEA]/10">
                    <div className="text-xs font-mono text-[#E8EDEA]/50">Granular Segment Redactions:</div>
                    
                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-xs">
                      <span className="text-[#E8EDEA]/80">Redact SUD Diagnostic Data</span>
                      <button
                        onClick={() => togglePart2Redaction(rule.id, 'redactSUD')}
                        className={`font-mono text-xs px-2 py-0.5 rounded ${rule.redactSUD ? 'bg-[#1A261F] text-[#A8C69F] border border-[#A8C69F]/40' : 'bg-rose-950/40 text-rose-300'}`}
                      >
                        {rule.redactSUD ? 'ON (Redacted)' : 'OFF'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-xs">
                      <span className="text-[#E8EDEA]/80">Redact Psychiatric Session Notes</span>
                      <button
                        onClick={() => togglePart2Redaction(rule.id, 'redactPsychNotes')}
                        className={`font-mono text-xs px-2 py-0.5 rounded ${rule.redactPsychNotes ? 'bg-[#1A261F] text-[#A8C69F] border border-[#A8C69F]/40' : 'bg-rose-950/40 text-rose-300'}`}
                      >
                        {rule.redactPsychNotes ? 'ON (Redacted)' : 'OFF'}
                      </button>
                    </div>

                    <div className="flex items-center justify-between p-2 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-xs">
                      <span className="text-[#E8EDEA]/80">Redact Bio-Telemetry Logs</span>
                      <button
                        onClick={() => togglePart2Redaction(rule.id, 'redactBioTelemetry')}
                        className={`font-mono text-xs px-2 py-0.5 rounded ${rule.redactBioTelemetry ? 'bg-[#1A261F] text-[#A8C69F] border border-[#A8C69F]/40' : 'bg-rose-950/40 text-rose-300'}`}
                      >
                        {rule.redactBioTelemetry ? 'ON (Redacted)' : 'OFF'}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-[#E8EDEA]/10 space-y-2">
                  <div className="p-2 rounded-lg bg-[#0D120E] text-[10px] font-mono text-[#A8C69F] break-all">
                    ✓ ECDSA Signature: {rule.patientSignatureHash.slice(0, 24)}...
                  </div>
                  <div className="text-[10px] font-mono text-[#E8EDEA]/40">
                    Prohibition on Redisclosure Notice (42 CFR 2.32) Attached
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 1.3: Legal & Regulatory Kernel */}
      {activeTab === 'legal' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Jurisdiction Mapper */}
            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#C8B195]/15 text-[#C8B195] border border-[#C8B195]/30">
                    <Scale className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#E8EDEA]">1.3.2 Jurisdiction Mapper</h3>
                    <p className="text-xs text-[#E8EDEA]/50 font-mono">State-Federal-International Legal Compliance</p>
                  </div>
                </div>
              </div>

              <div className="space-y-2.5">
                {jurisdictions.map(j => {
                  const isSelected = activeJurisdiction.id === j.id;
                  return (
                    <div
                      key={j.id}
                      onClick={() => setActiveJurisdiction(j)}
                      className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                        isSelected 
                          ? 'bg-[#1F1C16] border-[#C8B195]/60 text-[#E8EDEA] glow-earth' 
                          : 'bg-[#0D120E] border-[#E8EDEA]/10 text-[#E8EDEA]/80 hover:border-[#E8EDEA]/20'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-semibold text-xs text-[#E8EDEA] font-sans">{j.name}</span>
                        <span className="text-[10px] font-mono text-[#C8B195]">{j.complianceHealthScore}% Health</span>
                      </div>
                      <div className="text-[11px] text-[#E8EDEA]/60 space-y-0.5 font-sans">
                        <div>Region: <span className="text-[#E8EDEA]">{j.region}</span></div>
                        <div>Mandatory Ratio: <span className="text-[#E8EDEA]">{j.mandatoryFacilitatorRatio}</span></div>
                        <div>Substances: <span className="text-[#E8EDEA]">{j.substancesCovered.join(', ')}</span></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Schedule Transition Adapter & Sacred Exception */}
            <div className="space-y-6">
              
              {/* Schedule Transition Adapter */}
              <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#93C5B5]/15 text-[#93C5B5] border border-[#93C5B5]/30">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#E8EDEA]">1.3.1 Schedule Transition Adapter</h3>
                    <p className="text-xs text-[#E8EDEA]/50 font-mono">Dynamic Rescheduling State Migration</p>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-[#0D120E] border border-[#E8EDEA]/10 text-xs space-y-2">
                  <div className="flex items-center justify-between text-[#E8EDEA]/60">
                    <span>Federal Status:</span>
                    <span className="text-[#C8B195] font-mono">Schedule I (IND / Expanded Access)</span>
                  </div>
                  <div className="flex items-center justify-between text-[#E8EDEA]/60">
                    <span>Target Rescheduled Tier:</span>
                    <span className="text-[#A8C69F] font-mono">Schedule II / III-N with REMS</span>
                  </div>
                  <div className="flex items-center justify-between text-[#E8EDEA]/60">
                    <span>Adapter Migration Hook:</span>
                    <span className="text-[#93C5B5] font-mono">AUTOMATED_REMS_TELEMETRY_BRIDGE</span>
                  </div>
                </div>

                <p className="text-xs text-[#E8EDEA]/60 font-sans">
                  As federal scheduling transitions occur, Cindevra dynamically adapts compliance telemetry, physician sign-off requirements, and dispensing logs without requiring clinical workflow overhauls.
                </p>
              </div>

              {/* Sacred Use Exception Handler */}
              <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 rounded-lg bg-[#A8C69F]/15 text-[#A8C69F] border border-[#A8C69F]/30">
                    <HeartHandshake className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg text-[#E8EDEA]">1.3.4 Sacred Use Exception Handler</h3>
                    <p className="text-xs text-[#E8EDEA]/50 font-mono">Indigenous Lineage Reverence & Non-Commercial Rights</p>
                  </div>
                </div>

                <div className="text-xs text-[#E8EDEA]/60 space-y-2 font-sans">
                  <p>
                    Ensures sacred plant medicine lineages (Ayahuasca, Peyote, San Pedro, Traditional Psilocybin) receive non-extractive clinical protections, indigenous reciprocity fund allocations, and exemption from speculative pharmaceutical patent models.
                  </p>
                  <div className="p-3 rounded-xl bg-[#1A261F] border border-[#A8C69F]/30 text-[#A8C69F] text-[11px] font-mono">
                    ✓ 5% Sanctuary Revenue Stream bound to Indigenous Botanical Sovereignty Trust
                  </div>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}

      {/* TAB 1.4: Security & Privacy Root */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Zero Knowledge Root */}
            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-3">
              <div className="p-2 w-fit rounded-lg bg-[#A8C69F]/15 text-[#A8C69F] border border-[#A8C69F]/30">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#E8EDEA]">1.4.1 Zero-Knowledge Layer</h3>
              <p className="text-xs text-[#E8EDEA]/60 leading-relaxed font-sans">
                Uses Groth16 zk-SNARK circuits to mathematically prove safety checklists and eligibility without exposing medical records to outside verifiers.
              </p>
              <div className="text-[11px] font-mono text-[#A8C69F] pt-2">
                • 0 Diagnostic Data Leaks<br/>
                • Circom Circuit v2.1 Verified
              </div>
            </div>

            {/* End-to-End Encryption */}
            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-3">
              <div className="p-2 w-fit rounded-lg bg-[#93C5B5]/15 text-[#93C5B5] border border-[#93C5B5]/30">
                <Lock className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#E8EDEA]">1.4.2 End-to-End Journey E2EE</h3>
              <p className="text-xs text-[#E8EDEA]/60 leading-relaxed font-sans">
                All real-time ECG/HRV bio-telemetry, voice notes, and integration journals are encrypted with ephemeral asymmetric keys generated per session.
              </p>
              <div className="text-[11px] font-mono text-[#93C5B5] pt-2">
                • AES-256-GCM Hardware Accelerated<br/>
                • Forward Secrecy Enabled
              </div>
            </div>

            {/* Breach-Resilient Architecture */}
            <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-3">
              <div className="p-2 w-fit rounded-lg bg-[#C8B195]/15 text-[#C8B195] border border-[#C8B195]/30">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-serif font-bold text-lg text-[#E8EDEA]">1.4.3 Breach Resilience</h3>
              <p className="text-xs text-[#E8EDEA]/60 leading-relaxed font-sans">
                Split-key Shamir Secret Sharing across sanctuary nodes prevents single points of vulnerability or unauthorized administrative access.
              </p>
              <div className="text-[11px] font-mono text-[#C8B195] pt-2">
                • 3-of-5 Multi-Sig Custody<br/>
                • Offline Air-Gapped Vault Mode
              </div>
            </div>

          </div>

          {/* 21 CFR Part 11 Immutable Hash Chain Audit Log */}
          <div className="bg-[#141B16] border border-[#E8EDEA]/10 rounded-2xl p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="p-2 rounded-lg bg-[#A8C69F]/15 text-[#A8C69F] border border-[#A8C69F]/30">
                  <History className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-serif font-bold text-lg text-[#E8EDEA]">Tamper-Evident Audit & Compliance Chain</h3>
                  <p className="text-xs text-[#E8EDEA]/50 font-mono">21 CFR Part 11 & HIPAA Cryptographic Hash Trail</p>
                </div>
              </div>
              <span className="text-xs font-mono text-[#A8C69F] flex items-center gap-1.5 self-start sm:self-auto">
                <CheckCircle2 className="w-4 h-4" /> All Block Hashes Validated
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#E8EDEA]/10 text-[#E8EDEA]/50 font-mono text-[11px]">
                    <th className="py-2.5 px-3">Log ID</th>
                    <th className="py-2.5 px-3">Timestamp</th>
                    <th className="py-2.5 px-3">Category</th>
                    <th className="py-2.5 px-3">Actor</th>
                    <th className="py-2.5 px-3">Action Description</th>
                    <th className="py-2.5 px-3">Cryptographic Hash</th>
                  </tr>
                </thead>
                <tbody className="divide-y border-[#E8EDEA]/5 font-mono text-[11px]">
                  {auditLedger.slice(0, 6).map((log) => (
                    <tr key={log.id} className="hover:bg-white/[0.02] text-[#E8EDEA]/80">
                      <td className="py-2.5 px-3 text-[#A8C69F] font-bold">{log.id}</td>
                      <td className="py-2.5 px-3 text-[#E8EDEA]/50">{log.timestamp}</td>
                      <td className="py-2.5 px-3">
                        <span className="px-2 py-0.5 rounded bg-[#0D120E] border border-[#E8EDEA]/10 text-[#C8B195] text-[10px]">
                          {log.category}
                        </span>
                      </td>
                      <td className="py-2.5 px-3 text-[#E8EDEA]">{log.actor}</td>
                      <td className="py-2.5 px-3 font-sans text-xs text-[#E8EDEA]">{log.action}</td>
                      <td className="py-2.5 px-3 text-[#E8EDEA]/40 break-all">{log.blockHash.slice(0, 14)}...</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
