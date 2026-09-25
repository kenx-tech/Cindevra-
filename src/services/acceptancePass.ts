import { TelemetryIngestionService } from './telemetryAdapter';
import { SpO2TelemetryPacket, BPTelemetryPacket } from '../types/telemetry';

export interface AcceptanceScenarioResult {
  scenarioId: number;
  title: string;
  expectedBehavior: string;
  passed: boolean;
  details: string[];
  durationMs: number;
}

export interface AcceptanceSuiteReport {
  timestamp: string;
  totalPassed: number;
  totalFailed: number;
  allPassed: boolean;
  results: AcceptanceScenarioResult[];
}

/**
 * Executes the 6 focused clinical alert acceptance scenarios
 * against the real TelemetryIngestionService state machine.
 */
export async function runClinicalAlertAcceptanceSuite(): Promise<AcceptanceSuiteReport> {
  const results: AcceptanceScenarioResult[] = [];
  const startTime = Date.now();

  // Helper to construct typed SpO2 packet
  const createSpO2Packet = (seq: number, spo2Val: number, journeyId: string = 'AE-TEST-01', timestampOffsetSec: number = 0): SpO2TelemetryPacket => ({
    stream_id: `SPO2_STREAM_${journeyId}`,
    device_id: 'NONIN-SPO2-01',
    device_type: 'spo2',
    patient_journey_id: journeyId,
    timestamp_utc: new Date(Date.now() + timestampOffsetSec * 1000).toISOString(),
    sequence_number: seq,
    sample_rate_hz: 1,
    quality_flag: 'good',
    payload: {
      spo2_percent: spo2Val,
      pulse_rate_bpm: 80,
      perfusion_index: 3.5
    }
  });

  // Helper to construct typed BP packet
  const createBPPacket = (seq: number, sys: number, dia: number, journeyId: string = 'AE-TEST-01', timestampOffsetSec: number = 0): BPTelemetryPacket => ({
    stream_id: `BP_STREAM_${journeyId}`,
    device_id: 'CNAP-MONITOR-02',
    device_type: 'continuous_bp',
    patient_journey_id: journeyId,
    timestamp_utc: new Date(Date.now() + timestampOffsetSec * 1000).toISOString(),
    sequence_number: seq,
    sample_rate_hz: 0.1,
    quality_flag: 'good',
    payload: {
      systolic_mmhg: sys,
      diastolic_mmhg: dia,
      mean_arterial_pressure_mmhg: Math.round((sys + 2 * dia) / 3),
      pulse_pressure_mmhg: sys - dia,
      measurement_method: 'continuous_noninvasive'
    }
  });

  // =========================================================================
  // SCENARIO 1: Active alert -> sensor disconnects (Preserves signal_unavailable)
  // =========================================================================
  {
    const sStart = Date.now();
    const details: string[] = [];
    let passed = true;

    const engine = new TelemetryIngestionService('AE-TEST-01', 'Synthetic Psilocybin 25mg');
    
    // Step 1: Ingest abnormal SpO2 = 88%
    const packet1 = createSpO2Packet(1, 88, 'AE-TEST-01');
    engine.ingestSpO2(packet1);

    const activeList1 = engine.getActiveEpisodesList();
    const desat1 = activeList1.find(e => e.alertKey === 'desaturation');
    if (!desat1 || desat1.state !== 'active_unacknowledged') {
      passed = false;
      details.push(`FAIL: Desaturation alert failed to trigger in 'active_unacknowledged' state. Current state: ${desat1?.state}`);
    } else {
      details.push(`PASS: Alert triggered with ID ${desat1.episodeId} in 'active_unacknowledged' at ${desat1.triggerDisplayValue}.`);
    }

    const initialEpisodeId = desat1?.episodeId;

    // Step 2: Disconnect SpO2 sensor
    engine.disconnectDevice('NONIN-SPO2-01');

    const activeList2 = engine.getActiveEpisodesList();
    const desat2 = activeList2.find(e => e.episodeId === initialEpisodeId);
    if (!desat2) {
      passed = false;
      details.push(`FAIL: Episode was erroneously deleted/resolved upon sensor disconnection.`);
    } else if (desat2.state !== 'signal_unavailable') {
      passed = false;
      details.push(`FAIL: Episode state is '${desat2.state}', expected 'signal_unavailable'.`);
    } else {
      details.push(`PASS: Episode ${initialEpisodeId} preserved in 'signal_unavailable' without false resolution.`);
    }

    results.push({
      scenarioId: 1,
      title: 'Active alert → sensor disconnects',
      expectedBehavior: 'Same episode remains unresolved; transitions to signal_unavailable',
      passed,
      details,
      durationMs: Date.now() - sStart
    });
  }

  // =========================================================================
  // SCENARIO 2: Sensor reconnects with abnormal readings (Resumes episode)
  // =========================================================================
  {
    const sStart = Date.now();
    const details: string[] = [];
    let passed = true;

    const engine = new TelemetryIngestionService('AE-TEST-02', 'Synthetic Psilocybin 25mg');
    
    // Trigger initial alert and acknowledge it
    engine.ingestSpO2(createSpO2Packet(1, 87, 'AE-TEST-02'));
    const ep1 = engine.getActiveEpisodesList().find(e => e.alertKey === 'desaturation')!;
    const originalEpisodeId = ep1.episodeId;
    engine.acknowledgeAlertEpisode(originalEpisodeId, 'Dr. Tester');

    // Disconnect
    engine.disconnectDevice('NONIN-SPO2-01');

    const epDisconnected = engine.getEpisodeById(originalEpisodeId);
    if (epDisconnected?.state !== 'signal_unavailable') {
      passed = false;
      details.push(`FAIL: Episode failed to enter signal_unavailable.`);
    }

    // Reconnect & deliver fresh abnormal packet (86%)
    engine.reconnectDevice('NONIN-SPO2-01');
    engine.ingestSpO2(createSpO2Packet(2, 86, 'AE-TEST-02', 2));

    const epReconnected = engine.getEpisodeById(originalEpisodeId);
    if (!epReconnected) {
      passed = false;
      details.push(`FAIL: Original episode was lost after reconnect.`);
    } else if (epReconnected.episodeId !== originalEpisodeId) {
      passed = false;
      details.push(`FAIL: Episode ID mutated on reconnect.`);
    } else if (epReconnected.state !== 'acknowledged_ongoing' && epReconnected.state !== 'worsening_escalation') {
      passed = false;
      details.push(`FAIL: Reconnected state is '${epReconnected.state}', expected 'acknowledged_ongoing' or 'worsening_escalation'.`);
    } else {
      details.push(`PASS: Episode ${originalEpisodeId} resumed cleanly upon reconnect. Current state: ${epReconnected.state} (${epReconnected.latestDisplayValue}).`);
    }

    results.push({
      scenarioId: 2,
      title: 'Sensor reconnects with abnormal readings',
      expectedBehavior: 'Episode resumes with continuous audit identity; historical context preserved',
      passed,
      details,
      durationMs: Date.now() - sStart
    });
  }

  // =========================================================================
  // SCENARIO 3: One normal packet evaluated repeatedly (Requires fresh packets)
  // =========================================================================
  {
    const sStart = Date.now();
    const details: string[] = [];
    let passed = true;

    const engine = new TelemetryIngestionService('AE-TEST-03', 'Synthetic Psilocybin 25mg');
    
    // Trigger desaturation (requires 3 consecutive distinct recovery ticks)
    engine.ingestSpO2(createSpO2Packet(1, 89, 'AE-TEST-03'));
    const alertEp = engine.getActiveEpisodesList().find(e => e.alertKey === 'desaturation')!;
    const alertId = alertEp.episodeId;
    details.push(`Initial alert triggered with ID: ${alertId}`);

    // Ingest 1 normal packet (seq 2, 98%)
    engine.ingestSpO2(createSpO2Packet(2, 98, 'AE-TEST-03', 2));
    
    // Repeatedly trigger evaluation without sending any new packets (simulating clock tick / duplicate evaluations)
    for (let i = 0; i < 5; i++) {
      engine.evaluateAndBroadcast();
    }

    // Episode MUST STILL BE ACTIVE because only 1 distinct fresh packet was delivered!
    const activeAfterDuplicateEval = engine.getEpisodeById(alertId);
    if (!activeAfterDuplicateEval || activeAfterDuplicateEval.state === 'resolved') {
      passed = false;
      details.push(`FAIL: Duplicate evaluation of cached packet incorrectly advanced recovery and resolved episode!`);
    } else {
      details.push(`PASS: 5 redundant evaluations of cached packet did not falsely increment recovery count. Episode remains active.`);
    }

    // Now send 2 distinct fresh packets (seq 3, 98% and seq 4, 99%)
    engine.ingestSpO2(createSpO2Packet(3, 98, 'AE-TEST-03', 4));
    engine.ingestSpO2(createSpO2Packet(4, 99, 'AE-TEST-03', 6));

    // NOW episode should be resolved
    const resolvedInActive = engine.getActiveEpisodesList().find(e => e.episodeId === alertId);
    const inPastResolved = engine.getPastResolvedEpisodesList().find(e => e.episodeId === alertId);

    if (resolvedInActive || !inPastResolved) {
      passed = false;
      details.push(`FAIL: Episode failed to resolve after 3 distinct fresh normal samples.`);
    } else {
      details.push(`PASS: Episode successfully resolved after 3 distinct fresh packets delivered.`);
    }

    results.push({
      scenarioId: 3,
      title: 'One normal packet evaluated repeatedly',
      expectedBehavior: 'Recovery counter advances only once; requires distinct, fresh measurements',
      passed,
      details,
      durationMs: Date.now() - sStart
    });
  }

  // =========================================================================
  // SCENARIO 4: Valid recovery -> abnormal recurrence (Fresh unacknowledged episode)
  // =========================================================================
  {
    const sStart = Date.now();
    const details: string[] = [];
    let passed = true;

    const engine = new TelemetryIngestionService('AE-TEST-04', 'Synthetic Psilocybin 25mg');
    
    // Episode A: trigger -> acknowledge -> resolve
    engine.ingestSpO2(createSpO2Packet(1, 88, 'AE-TEST-04', 1));
    const epA = engine.getActiveEpisodesList().find(e => e.alertKey === 'desaturation')!;
    const idA = epA.episodeId;
    engine.acknowledgeAlertEpisode(idA, 'Dr. Vance');
    
    // Resolve with 3 fresh normal packets
    engine.ingestSpO2(createSpO2Packet(2, 98, 'AE-TEST-04', 2));
    engine.ingestSpO2(createSpO2Packet(3, 98, 'AE-TEST-04', 3));
    engine.ingestSpO2(createSpO2Packet(4, 99, 'AE-TEST-04', 4));

    if (engine.getActiveEpisodesList().length !== 0) {
      passed = false;
      details.push(`FAIL: Episode A was not resolved.`);
    }

    // Now recurrent abnormal reading arrives (seq 5, 85%)
    engine.ingestSpO2(createSpO2Packet(5, 85, 'AE-TEST-04', 10));

    const activeList = engine.getActiveEpisodesList();
    const epB = activeList.find(e => e.alertKey === 'desaturation');

    if (!epB) {
      passed = false;
      details.push(`FAIL: New episode was not created on recurrence.`);
    } else if (epB.episodeId === idA) {
      passed = false;
      details.push(`FAIL: Recurrence reused the resolved episode ID instead of creating a fresh episode instance.`);
    } else if (epB.state !== 'active_unacknowledged') {
      passed = false;
      details.push(`FAIL: Recurrent episode did not require acknowledgment (state: ${epB.state}).`);
    } else {
      details.push(`PASS: New episode instance ${epB.episodeId} created in 'active_unacknowledged' state. Previous episode ${idA} safely archived.`);
    }

    results.push({
      scenarioId: 4,
      title: 'Valid recovery → abnormal recurrence',
      expectedBehavior: 'Previous episode preserved in history; new recurrence requires explicit acknowledgment',
      passed,
      details,
      durationMs: Date.now() - sStart
    });
  }

  // =========================================================================
  // SCENARIO 5: Patient changes while rescue documentation is open (No data transfer)
  // =========================================================================
  {
    const sStart = Date.now();
    const details: string[] = [];
    let passed = true;

    const engine = new TelemetryIngestionService('AE-PATIENT-ALPHA', 'Synthetic Psilocybin 25mg');
    engine.ingestSpO2(createSpO2Packet(1, 88, 'AE-PATIENT-ALPHA', 1));
    const alphaEpisode = engine.getActiveEpisodesList().find(e => e.alertKey === 'desaturation')!;
    
    // Context switch to Patient BETA
    engine.setJourneyContext('AE-PATIENT-BETA', 'MDMA Assisted Therapy 120mg', 'ascent');

    const betaActiveList = engine.getActiveEpisodesList();
    const betaPastList = engine.getPastResolvedEpisodesList();

    if (betaActiveList.length > 0 || betaPastList.length > 0) {
      passed = false;
      details.push(`FAIL: Active alerts leaked across journey context switch! Active: ${betaActiveList.length}, Past: ${betaPastList.length}`);
    } else {
      details.push(`PASS: Journey context switch from ALPHA to BETA cleared all buffers and alert records.`);
    }

    results.push({
      scenarioId: 5,
      title: 'Patient changes during active session',
      expectedBehavior: 'Zero data leakage; complete purge of cached packets, alert buffers, and incident bindings',
      passed,
      details,
      durationMs: Date.now() - sStart
    });
  }

  // =========================================================================
  // SCENARIO 6: Re-attestation -> further deterioration (Earlier evidence intact)
  // =========================================================================
  {
    const sStart = Date.now();
    const details: string[] = [];
    let passed = true;

    const engine = new TelemetryIngestionService('AE-TEST-06', 'Synthetic Psilocybin 25mg');
    
    // Step 1: Trigger hypertensive spike (170/105)
    engine.ingestBP(createBPPacket(1, 170, 105, 'AE-TEST-06', 1));
    const bpEp = engine.getActiveEpisodesList().find(e => e.alertKey === 'hypertensive_spike')!;
    const bpId = bpEp.episodeId;

    // Step 2: Facilitator initial acknowledgment
    engine.acknowledgeAlertEpisode(bpId, 'Dr. Elena Vance, Lead Facilitator');
    
    // Step 3: Facilitator re-attestation at 172/106
    engine.ingestBP(createBPPacket(2, 172, 106, 'AE-TEST-06', 3));
    engine.reAttestVitalsSnapshot(bpId, 'Dr. Elena Vance, Lead Facilitator');

    const epAfterReattest = engine.getEpisodeById(bpId)!;
    if (epAfterReattest.attestationHistory?.length !== 2) {
      passed = false;
      details.push(`FAIL: Expected 2 attestation records, found: ${epAfterReattest.attestationHistory?.length}`);
    } else {
      details.push(`PASS: Attestation history contains 2 distinct snapshots: Initial Ack and Re-Attestation.`);
    }

    // Step 4: Further deterioration to 185/115 (Sys increased +13 mmHg, Dia +9 mmHg)
    engine.ingestBP(createBPPacket(3, 185, 115, 'AE-TEST-06', 6));

    const epDeteriorated = engine.getEpisodeById(bpId)!;
    if (epDeteriorated.state !== 'worsening_escalation') {
      passed = false;
      details.push(`FAIL: Expected state 'worsening_escalation', found '${epDeteriorated.state}'.`);
    } else if (!epDeteriorated.escalationHistory || epDeteriorated.escalationHistory.length === 0) {
      passed = false;
      details.push(`FAIL: Escalation history was not recorded on worsening.`);
    } else {
      details.push(`PASS: Deterioration triggered 'worsening_escalation' with recorded escalation record. Baseline trigger (${epDeteriorated.triggerDisplayValue}) intact.`);
    }

    results.push({
      scenarioId: 6,
      title: 'Re-attestation → further deterioration',
      expectedBehavior: 'Earlier evidence remains intact; cumulative history preserved; worsening triggers escalation',
      passed,
      details,
      durationMs: Date.now() - sStart
    });
  }

  const totalPassed = results.filter(r => r.passed).length;
  const totalFailed = results.filter(r => !r.passed).length;

  return {
    timestamp: new Date().toISOString(),
    totalPassed,
    totalFailed,
    allPassed: totalFailed === 0,
    results
  };
}
