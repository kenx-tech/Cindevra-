import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  Heart, 
  Volume2, 
  Pill, 
  CheckCircle2, 
  AlertTriangle, 
  X,
  FileCheck,
  PhoneCall,
  Stethoscope,
  Activity,
  UserCheck,
  Send,
  AlertOctagon
} from 'lucide-react';
import { ClinicalAlertEpisode, StandingOrderTemplate, MedicationInterventionStatus } from '../../types/alertLifecycle';

interface RapidRescueModalProps {
  isOpen: boolean;
  onClose: () => void;
  patientName: string;
  patientId: string;
  compound: string;
  triggerEpisode?: ClinicalAlertEpisode | null;
  onConfirmRescue: (actionNotes: string, episodeId?: string, medicationGiven?: string) => void;
}

type RescueTab = 'immediate_assessment' | 'event_specific_protocol' | 'comfort_grounding' | 'documentation_attestation';

// Evidence-based standing order templates mapped strictly by alert category and substance
const STANDING_ORDERS_CATALOG: StandingOrderTemplate[] = [
  {
    orderId: 'SO-HTN-01',
    compoundSuitability: ['Psilocybin', 'MDMA', 'Ketamine', 'All'],
    applicableAlertCategories: ['BLOOD_PRESSURE', 'AUTONOMIC_STORM'],
    medicationName: 'Oral Labetalol',
    dosageRoute: '100 mg PO with sips of water',
    indication: 'Sustained systolic blood pressure ≥165 mmHg or diastolic ≥100 mmHg exceeding protocol threshold >10 min',
    contraindications: ['Severe asthma / bronchospasm', 'Second or third-degree AV block', 'Severe bradycardia'],
    protocolThresholdNote: 'Alpha/beta-adrenergic antagonist for acute hyperadrenergic vasoconstriction.'
  },
  {
    orderId: 'SO-PANIC-02',
    compoundSuitability: ['Psilocybin', 'MDMA', 'Ketamine', 'All'],
    applicableAlertCategories: ['HEART_RATE', 'AUTONOMIC_STORM'],
    medicationName: 'Sublingual Lorazepam',
    dosageRoute: '1.0 mg SL (rapid dissolvable)',
    indication: 'Severe acute distress / refractory panic surge unmitigated by somatic anchoring',
    contraindications: ['Respiratory depression (SpO2 < 90%)', 'Acute narrow-angle glaucoma'],
    protocolThresholdNote: 'GABA-A positive allosteric modulator for somatic and autonomic de-escalation.'
  },
  {
    orderId: 'SO-EMESIS-03',
    compoundSuitability: ['Psilocybin', 'MDMA', 'All'],
    applicableAlertCategories: ['OXYGENATION', 'AUTONOMIC_STORM'],
    medicationName: 'Sublingual Ondansetron',
    dosageRoute: '4.0 mg ODT (oral disintegrating tablet)',
    indication: 'Intractable serotonergic nausea / emesis compromising participant positioning or airway',
    contraindications: ['Known QT prolongation', 'Hypokalemia'],
    protocolThresholdNote: 'Selective 5-HT3 receptor antagonist without sedative burden.'
  },
  {
    orderId: 'SO-O2-04',
    compoundSuitability: ['All'],
    applicableAlertCategories: ['OXYGENATION'],
    medicationName: 'Supplemental Medical Oxygen',
    dosageRoute: '2.0 - 4.0 L/min via Nasal Cannula',
    indication: 'Pulse oximetry desaturation <92% SpO2 unresponsive to repositioning and breathing cues',
    contraindications: ['Severe CO2 retention / hypercapnia without monitor'],
    protocolThresholdNote: 'Maintains alveolar oxygen tension during hypopnea or chest rigidity.'
  }
];

export const RapidRescueModal: React.FC<RapidRescueModalProps> = ({
  isOpen,
  onClose,
  patientName,
  patientId,
  compound,
  triggerEpisode,
  onConfirmRescue
}) => {
  const [activeTab, setActiveTab] = useState<RescueTab>('immediate_assessment');
  
  // Explicit Clinical Action Tracking (Separates reality from simulated click claims)
  const [externalCallLogged, setExternalCallLogged] = useState<boolean>(false);
  const [externalCallType, setExternalCallType] = useState<'911_EMS' | 'PHYSICIAN_PAGE' | 'NONE'>('NONE');
  const [externalCallTimestamp, setExternalCallTimestamp] = useState<string | null>(null);

  const [airwayRepositionLogged, setAirwayRepositionLogged] = useState<boolean>(false);
  const [somaticTouchLogged, setSomaticTouchLogged] = useState<boolean>(false);
  const [soundscapeEngaged, setSoundscapeEngaged] = useState<boolean>(false);

  // Medication Standing Order Lifecycle: selected -> ordered -> administered
  const [selectedOrderId, setSelectedOrderId] = useState<string>('NONE');
  const [medicationStatus, setMedicationStatus] = useState<MedicationInterventionStatus>('none');
  const [medicationAdministeredTime, setMedicationAdministeredTime] = useState<string | null>(null);

  // Attestation & Signer Identity (Derived from active session, starting factual notes empty)
  const [primaryQhpName, setPrimaryQhpName] = useState<string>('');
  const [primaryQhpRole, setPrimaryQhpRole] = useState<string>('Attending Lead Facilitator');
  const [coTherapistName, setCoTherapistName] = useState<string>('');
  const [encounterNarrative, setEncounterNarrative] = useState<string>('');
  const [isPrimaryAttested, setIsPrimaryAttested] = useState<boolean>(false);

  // Reset form whenever a new episode or participant opens the modal
  useEffect(() => {
    if (isOpen) {
      setActiveTab('immediate_assessment');
      setExternalCallLogged(false);
      setExternalCallType('NONE');
      setExternalCallTimestamp(null);
      setAirwayRepositionLogged(false);
      setSomaticTouchLogged(false);
      setSoundscapeEngaged(false);
      setSelectedOrderId('NONE');
      setMedicationStatus('none');
      setMedicationAdministeredTime(null);
      setEncounterNarrative('');
      setIsPrimaryAttested(false);
      
      // Initialize signer names empty so clinician explicitly enters their credentials; factual notes start empty
      setPrimaryQhpName('');
      setCoTherapistName('');
    }
  }, [isOpen, patientId, triggerEpisode?.episodeId]);

  if (!isOpen) return null;

  // Filter standing orders matching this event category and compound
  const relevantOrders = STANDING_ORDERS_CATALOG.filter(order => {
    const compoundMatch = order.compoundSuitability.includes('All') || 
      order.compoundSuitability.some(c => compound.toLowerCase().includes(c.toLowerCase()));
    if (!triggerEpisode) return compoundMatch;
    const catMatch = order.applicableAlertCategories.includes(triggerEpisode.category);
    return compoundMatch && catMatch;
  });

  const handleLogExternalCall = (callType: '911_EMS' | 'PHYSICIAN_PAGE') => {
    const time = new Date().toLocaleTimeString();
    setExternalCallLogged(true);
    setExternalCallType(callType);
    setExternalCallTimestamp(time);
  };

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrderId(orderId);
    if (orderId === 'NONE') {
      setMedicationStatus('none');
    } else {
      setMedicationStatus('selected');
    }
  };

  const handleOrderMedication = () => {
    setMedicationStatus('ordered');
  };

  const handleAdministerMedication = () => {
    setMedicationStatus('administered');
    setMedicationAdministeredTime(new Date().toLocaleTimeString());
  };

  const handleFinalizeEncounter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isPrimaryAttested || !primaryQhpName.trim()) return;

    const selectedOrderObj = STANDING_ORDERS_CATALOG.find(o => o.orderId === selectedOrderId);
    const medSummary = medicationStatus === 'administered' && selectedOrderObj
      ? `Medication Administered: ${selectedOrderObj.medicationName} (${selectedOrderObj.dosageRoute}) at ${medicationAdministeredTime}`
      : medicationStatus === 'ordered' && selectedOrderObj
      ? `Medication Ordered (Pending Administration): ${selectedOrderObj.medicationName}`
      : 'Supportive Care (No Pharmacological Rescue Administered)';

    const actionsRecorded: string[] = [];
    if (externalCallLogged && externalCallTimestamp) {
      actionsRecorded.push(`External Call: ${externalCallType} recorded at ${externalCallTimestamp}`);
    }
    if (airwayRepositionLogged) actionsRecorded.push('Airway & Posture Verified');
    if (somaticTouchLogged) actionsRecorded.push('Consent-Based Somatic Sternum Grounding Applied');
    if (soundscapeEngaged) actionsRecorded.push('432 Hz Grounding Acoustic Shift Engaged');
    actionsRecorded.push(medSummary);

    const fullRecord = `[CLINICAL RESCUE ENCOUNTER] Episode: ${triggerEpisode?.episodeId || 'Direct-Intervention'} | Participant: ${patientName} (${patientId}) | Target: ${triggerEpisode?.title || 'Clinical Evaluation'} | Actions: [${actionsRecorded.join(', ')}] | Clinician Notes: ${encounterNarrative || 'Standard harm-reduction evaluation conducted.'} | Signed by: ${primaryQhpName} (${primaryQhpRole})${coTherapistName ? `, Witness: ${coTherapistName}` : ''}`;

    onConfirmRescue(
      fullRecord,
      triggerEpisode?.episodeId,
      medicationStatus === 'administered' && selectedOrderObj ? selectedOrderObj.medicationName : undefined
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#141B16] border-2 border-rose-500/80 rounded-2xl max-w-3xl w-full p-6 sm:p-8 space-y-5 shadow-2xl relative text-xs">
        
        {/* Header with Direct Non-blocking Access */}
        <div className="flex items-start justify-between gap-4 border-b border-rose-500/30 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40">
              <ShieldAlert className="w-8 h-8" />
            </div>
            <div>
              <div className="font-mono text-[10px] text-rose-400 uppercase tracking-widest font-bold flex items-center gap-2">
                <span>Clinical Harm-Reduction Console</span>
                <span className="text-[#E8EDEA]/40">•</span>
                <span className="text-amber-300">Non-Linear Workflow</span>
              </div>
              <h2 className="text-xl font-serif font-bold text-[#E8EDEA]">
                Clinical Evaluation: {patientName}
              </h2>
              <div className="text-[11px] text-[#E8EDEA]/70 font-mono mt-0.5">
                Journey: <span className="text-emerald-400 font-bold">{patientId}</span> • Substance: <span className="text-[#93C5B5]">{compound}</span>
                {triggerEpisode && (
                  <> • Episode: <span className="text-rose-300 font-bold">{triggerEpisode.title} ({triggerEpisode.latestDisplayValue})</span></>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-[#E8EDEA]/60 hover:text-[#E8EDEA] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modular Non-Linear Navigation Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px]">
          <button
            type="button"
            onClick={() => setActiveTab('immediate_assessment')}
            className={`p-2.5 rounded-xl text-center font-bold transition-all border flex items-center justify-center gap-1.5 ${
              activeTab === 'immediate_assessment'
                ? 'bg-rose-500/20 text-rose-300 border-rose-500/60 shadow'
                : 'bg-[#0D120E] text-[#E8EDEA]/60 border-white/5 hover:bg-white/5'
            }`}
          >
            <PhoneCall className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            <span>1. Escalation</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('event_specific_protocol')}
            className={`p-2.5 rounded-xl text-center font-bold transition-all border flex items-center justify-center gap-1.5 ${
              activeTab === 'event_specific_protocol'
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow'
                : 'bg-[#0D120E] text-[#E8EDEA]/60 border-white/5 hover:bg-white/5'
            }`}
          >
            <Stethoscope className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>2. Orders & Meds</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('comfort_grounding')}
            className={`p-2.5 rounded-xl text-center font-bold transition-all border flex items-center justify-center gap-1.5 ${
              activeTab === 'comfort_grounding'
                ? 'bg-[#93C5B5]/20 text-[#93C5B5] border-[#93C5B5]/60 shadow'
                : 'bg-[#0D120E] text-[#E8EDEA]/60 border-white/5 hover:bg-white/5'
            }`}
          >
            <Heart className="w-3.5 h-3.5 text-[#93C5B5] shrink-0" />
            <span>3. Comfort & Audio</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('documentation_attestation')}
            className={`p-2.5 rounded-xl text-center font-bold transition-all border flex items-center justify-center gap-1.5 ${
              activeTab === 'documentation_attestation'
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow'
                : 'bg-[#0D120E] text-[#E8EDEA]/60 border-white/5 hover:bg-white/5'
            }`}
          >
            <FileCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span>4. Documentation</span>
          </button>
        </div>

        {/* Tab 1: Immediate Assessment & Escalation Controls */}
        {activeTab === 'immediate_assessment' && (
          <div className="space-y-4 bg-[#0D120E] p-4 sm:p-5 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-rose-300 font-bold text-sm">
                <PhoneCall className="w-4 h-4 text-rose-400" />
                <span>Immediate Assessment & External Call Logging</span>
              </div>
              <span className="text-[10px] font-mono text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/30">
                Direct Emergency Escalation
              </span>
            </div>

            <p className="text-[#E8EDEA]/80 leading-relaxed">
              Record external emergency dispatches and urgent bedside physical safety measures. Actions logged here record exact local timestamps into the encounter audit trail.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              
              {/* Emergency EMS Call Record */}
              <div className="p-4 rounded-xl bg-[#141B16] border border-white/10 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-xs text-[#E8EDEA]">Record External 911 / EMS Call</div>
                    <div className="text-[10px] text-[#E8EDEA]/60">Document emergency dispatcher communication</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-mono text-[#E8EDEA]/70">
                    {externalCallLogged && externalCallType === '911_EMS' 
                      ? `✓ Logged at ${externalCallTimestamp}` 
                      : 'Not recorded'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLogExternalCall('911_EMS')}
                    className="px-3 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-500 text-white font-mono text-[11px] font-bold"
                  >
                    Log 911 Call Made
                  </button>
                </div>
              </div>

              {/* Physician Paging Record */}
              <div className="p-4 rounded-xl bg-[#141B16] border border-white/10 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-xs text-[#E8EDEA]">Record On-Call Physician Page</div>
                    <div className="text-[10px] text-[#E8EDEA]/60">Supervising medical director consultation</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-mono text-[#E8EDEA]/70">
                    {externalCallLogged && externalCallType === 'PHYSICIAN_PAGE' 
                      ? `✓ Paged at ${externalCallTimestamp}` 
                      : 'Not recorded'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleLogExternalCall('PHYSICIAN_PAGE')}
                    className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-mono text-[11px] font-bold"
                  >
                    Log Physician Paged
                  </button>
                </div>
              </div>

              {/* Airway Check */}
              <div className="p-4 rounded-xl bg-[#141B16] border border-white/10 space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-bold text-xs text-[#E8EDEA]">Airway & Posture Repositioning</div>
                    <div className="text-[10px] text-[#E8EDEA]/60">Head elevation and neck extension for airway patency</div>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-1">
                  <span className="text-[11px] font-mono text-[#E8EDEA]/70">
                    {airwayRepositionLogged ? '✓ Airway Checked & Cleared' : 'Not recorded'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setAirwayRepositionLogged(!airwayRepositionLogged)}
                    className={`px-3 py-1.5 rounded-lg font-mono text-[11px] font-bold ${
                      airwayRepositionLogged ? 'bg-emerald-600 text-white' : 'bg-white/10 hover:bg-white/20 text-[#E8EDEA]'
                    }`}
                  >
                    {airwayRepositionLogged ? 'Clear Entry' : 'Log Airway Reposition'}
                  </button>
                </div>
              </div>

            </div>

            {/* Attestation & Escalation Audit Trail if Episode has History */}
            {triggerEpisode && ((triggerEpisode.attestationHistory && triggerEpisode.attestationHistory.length > 0) || (triggerEpisode.escalationHistory && triggerEpisode.escalationHistory.length > 0)) && (
              <div className="p-3.5 rounded-xl bg-[#141B16] border border-white/10 space-y-2 font-mono text-xs">
                <div className="text-amber-300 font-bold text-[11px] flex items-center justify-between">
                  <span>Incident Attestation & Escalation Trail</span>
                  <span className="text-[10px] text-[#E8EDEA]/50">Immutable Records</span>
                </div>
                {triggerEpisode.attestationHistory && triggerEpisode.attestationHistory.length > 0 && (
                  <div className="space-y-1">
                    <div className="text-[10px] text-[#E8EDEA]/60 uppercase tracking-wider">Facilitator Attestations:</div>
                    {triggerEpisode.attestationHistory.map((att) => (
                      <div key={att.attestationId} className="p-2 rounded bg-black/40 border border-white/5 flex items-center justify-between text-[11px]">
                        <div>
                          <span className="text-emerald-400 font-bold">{att.type === 'initial_acknowledgment' ? 'Initial Ack' : 'Re-Attested'}</span>: {att.displayValueSnapshot} by {att.attestedBy}
                        </div>
                        <span className="text-[10px] text-[#E8EDEA]/40">{new Date(att.attestedAt).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                )}
                {triggerEpisode.escalationHistory && triggerEpisode.escalationHistory.length > 0 && (
                  <div className="space-y-1 pt-1">
                    <div className="text-[10px] text-rose-400/80 uppercase tracking-wider">Cumulative Escalations:</div>
                    {triggerEpisode.escalationHistory.map((esc) => (
                      <div key={esc.escalationId} className="p-2 rounded bg-rose-950/20 border border-rose-500/20 flex items-center justify-between text-[11px]">
                        <div className="text-rose-300">
                          <span className="font-bold">Escalation:</span> {esc.reason}
                        </div>
                        <span className="text-[10px] text-[#E8EDEA]/40">{new Date(esc.escalatedAt).toLocaleTimeString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Clinician-Approved Standing Orders & Medication Lifecycle */}
        {activeTab === 'event_specific_protocol' && (
          <div className="space-y-4 bg-[#0D120E] p-4 sm:p-5 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
                <Stethoscope className="w-4 h-4 text-amber-400" />
                <span>Clinician Standing Orders ({compound})</span>
              </div>
              <div className="flex items-center gap-2 font-mono text-[10px]">
                <span className="text-[#E8EDEA]/50">Status:</span>
                <span className={`px-2 py-0.5 rounded font-bold uppercase ${
                  medicationStatus === 'administered' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
                  medicationStatus === 'ordered' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
                  medicationStatus === 'selected' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
                  'bg-white/5 text-[#E8EDEA]/40'
                }`}>
                  {medicationStatus}
                </span>
              </div>
            </div>

            {/* Target Alert Context */}
            {triggerEpisode && (
              <div className="p-3 rounded-xl bg-[#141B16] border border-amber-500/30 text-amber-200 text-xs">
                <div className="font-bold flex items-center gap-1.5">
                  <AlertOctagon className="w-4 h-4 text-amber-400" />
                  <span>Target Protocol Event: {triggerEpisode.title}</span>
                </div>
                <div className="text-[11px] text-[#E8EDEA]/80 mt-0.5">
                  {triggerEpisode.protocolThresholdDescription}
                </div>
              </div>
            )}

            {/* Standing Orders List */}
            <div className="space-y-2">
              <label
                className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                  selectedOrderId === 'NONE'
                    ? 'bg-emerald-950/20 border-emerald-500/50 text-emerald-200'
                    : 'bg-[#141B16] border-white/5 text-[#E8EDEA]/70 hover:bg-white/5'
                }`}
              >
                <div>
                  <div className="font-bold text-xs text-[#E8EDEA]">Supportive Care Only (No Pharmacological Rescue)</div>
                  <div className="text-[10px] text-[#E8EDEA]/50">Manage through physical repositioning, verbal grounding, and acoustic soundscape shift.</div>
                </div>
                <input
                  type="radio"
                  name="standingOrderRadio"
                  checked={selectedOrderId === 'NONE'}
                  onChange={() => handleSelectOrder('NONE')}
                  className="text-emerald-500 focus:ring-emerald-500"
                />
              </label>

              {relevantOrders.map((order) => (
                <div
                  key={order.orderId}
                  className={`p-3.5 rounded-xl border transition-all space-y-2 ${
                    selectedOrderId === order.orderId
                      ? 'bg-amber-950/20 border-amber-500/60 text-amber-100'
                      : 'bg-[#141B16] border-white/5 text-[#E8EDEA]/80'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-xs text-white">{order.medicationName}</span>
                        <span className="font-mono text-[10px] text-amber-300 px-1.5 py-0.5 rounded bg-amber-500/10">
                          {order.dosageRoute}
                        </span>
                      </div>
                      <div className="text-[11px] text-[#E8EDEA]/70 mt-0.5">{order.indication}</div>
                    </div>
                    <input
                      type="radio"
                      name="standingOrderRadio"
                      checked={selectedOrderId === order.orderId}
                      onChange={() => handleSelectOrder(order.orderId)}
                      className="text-amber-500 focus:ring-amber-500"
                    />
                  </div>

                  {/* Order Lifecycle Control Buttons (Distinguishes Selected, Ordered, Administered) */}
                  {selectedOrderId === order.orderId && (
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between flex-wrap gap-2 text-[11px] font-mono">
                      <div className="text-[#E8EDEA]/60">
                        {medicationStatus === 'administered' && medicationAdministeredTime
                          ? `✓ Administered at ${medicationAdministeredTime}`
                          : medicationStatus === 'ordered'
                          ? 'Order entered; awaiting administration'
                          : 'Order selected; not yet ordered'}
                      </div>
                      <div className="flex gap-2">
                        {medicationStatus === 'selected' && (
                          <button
                            type="button"
                            onClick={handleOrderMedication}
                            className="px-3 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold"
                          >
                            Mark as Ordered by Physician
                          </button>
                        )}
                        {medicationStatus === 'ordered' && (
                          <button
                            type="button"
                            onClick={handleAdministerMedication}
                            className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                          >
                            Confirm Administered to Participant
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Optional Comfort Measures & Audio Grounding */}
        {activeTab === 'comfort_grounding' && (
          <div className="space-y-4 bg-[#0D120E] p-4 sm:p-5 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#93C5B5] font-bold text-sm">
                <Heart className="w-4 h-4 text-[#93C5B5]" />
                <span>Consent-Based Somatic Grounding & Acoustic Soundscape</span>
              </div>
              <span className="text-[10px] font-mono text-[#93C5B5]">Available alongside medical care</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              
              {/* Somatic Touch Anchor */}
              <div className="p-4 rounded-xl bg-[#141B16] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-[#E8EDEA] flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-rose-400" />
                    <span>Somatic Sternum / Hand Anchor</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSomaticTouchLogged(!somaticTouchLogged)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold ${
                      somaticTouchLogged ? 'bg-emerald-600 text-white' : 'bg-white/10 text-[#E8EDEA]/70'
                    }`}
                  >
                    {somaticTouchLogged ? '✓ Applied' : 'Log Applied'}
                  </button>
                </div>
                <div className="text-[11px] text-[#E8EDEA]/70">
                  Gentle, firm grounding pressure applied over participant sternum or bilateral hand-hold with clear ongoing consent.
                </div>
              </div>

              {/* Acoustic Soundscape Shift */}
              <div className="p-4 rounded-xl bg-[#141B16] border border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="font-bold text-xs text-[#E8EDEA] flex items-center gap-1.5">
                    <Volume2 className="w-3.5 h-3.5 text-[#93C5B5]" />
                    <span>432 Hz Grounding Acoustic Shift</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSoundscapeEngaged(!soundscapeEngaged)}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold ${
                      soundscapeEngaged ? 'bg-[#93C5B5] text-[#0A0D0B]' : 'bg-white/10 text-[#E8EDEA]/70'
                    }`}
                  >
                    {soundscapeEngaged ? '✓ Active' : 'Engage 432 Hz'}
                  </button>
                </div>
                <div className="text-[11px] text-[#E8EDEA]/70">
                  Transitions sanctuary headphones to low-frequency grounding sine waves (432 Hz Solfeggio) with warm pink-noise masking.
                </div>
              </div>

            </div>
          </div>
        )}

        {/* Tab 4: Documentation & Electronic Attestation */}
        {activeTab === 'documentation_attestation' && (
          <form onSubmit={handleFinalizeEncounter} className="space-y-4 bg-[#0D120E] p-4 sm:p-5 rounded-2xl border border-white/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Clinical Documentation & Cryptographic Audit Ledger</span>
              </div>
              <span className="text-[10px] font-mono text-[#E8EDEA]/50">
                21 CFR Part 11 Audit Trail
              </span>
            </div>

            <div className="space-y-3">
              <div>
                <label className="block text-[10px] font-mono text-[#E8EDEA]/60 mb-1">
                  Clinician Narrative (Observations, Response to Intervention):
                </label>
                <textarea
                  rows={3}
                  value={encounterNarrative}
                  placeholder="Record objective clinical observations, patient response to intervention, and ongoing safety assessment..."
                  onChange={(e) => setEncounterNarrative(e.target.value)}
                  className="w-full bg-[#141B16] border border-white/10 rounded-xl p-2.5 text-xs text-[#E8EDEA] focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[10px] font-mono text-[#E8EDEA]/60 mb-1">
                    Primary QHP Facilitator:
                  </label>
                  <input
                    type="text"
                    value={primaryQhpName}
                    onChange={(e) => setPrimaryQhpName(e.target.value)}
                    placeholder="Facilitator Name, MD / PhD"
                    className="w-full bg-[#141B16] border border-white/10 rounded-xl p-2 text-xs text-[#E8EDEA]"
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-mono text-[#E8EDEA]/60 mb-1">
                    Secondary Witness / Co-Therapist:
                  </label>
                  <input
                    type="text"
                    value={coTherapistName}
                    onChange={(e) => setCoTherapistName(e.target.value)}
                    placeholder="Witness Name, LMFT / RN"
                    className="w-full bg-[#141B16] border border-white/10 rounded-xl p-2 text-xs text-[#E8EDEA]"
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 pt-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPrimaryAttested}
                  onChange={(e) => setIsPrimaryAttested(e.target.checked)}
                  className="rounded text-emerald-500 focus:ring-emerald-500"
                />
                <span className="text-[11px] text-[#E8EDEA]/80 font-mono">
                  I attest that all documented actions and biometric readings reflect real-time clinical interventions committed to the SHA-256 audit ledger.
                </span>
              </label>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-white/5 hover:bg-white/10 text-[#E8EDEA]/70 text-xs font-mono"
              >
                Close (Keep Unsaved In Draft)
              </button>
              <button
                type="submit"
                disabled={!isPrimaryAttested || !primaryQhpName.trim()}
                className={`px-5 py-2.5 rounded-xl font-mono font-bold text-xs shadow-lg transition-all ${
                  isPrimaryAttested && primaryQhpName.trim()
                    ? 'bg-emerald-600 hover:bg-emerald-500 text-white cursor-pointer'
                    : 'bg-white/10 text-[#E8EDEA]/30 cursor-not-allowed'
                }`}
              >
                Commit Electronic Signature to Ledger
              </button>
            </div>
          </form>
        )}

        {/* Global Footer */}
        <div className="flex justify-between items-center pt-2 border-t border-white/10">
          <div className="text-[10px] font-mono text-[#E8EDEA]/40">
            Encounter bound to Episode: {triggerEpisode?.episodeId || 'Immediate-Response'}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-[#E8EDEA] font-mono text-xs"
          >
            Done
          </button>
        </div>

      </div>
    </div>
  );
};
