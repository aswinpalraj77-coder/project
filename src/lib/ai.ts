import type { FIR, Case, Criminal, ChatMessage } from '@/types';
import { firs, cases, criminals, evidence } from '@/data/mock';
import { crimeTypeLabels, formatDate } from '@/lib/format';
import { uid } from '@/lib/format';

// Deterministic AI service with graceful fallbacks — works offline.
// In production this would call an LLM API; here we use structured heuristics
// so the demo always returns realistic, explainable results.

export interface CrimeSearchResult {
  answer: string;
  matchingFirs: FIR[];
  suspects: Criminal[];
  vehicles: string[];
  nearbyCctv: string[];
  reasoning: string[];
  confidence: number;
}

export function crimeSearch(query: string): CrimeSearchResult {
  const q = query.toLowerCase();
  const reasoning: string[] = [];

  // detect crime type
  const typeMap: Record<string, string> = {
    'chain snatch': 'chain_snatching',
    'snatching': 'chain_snatching',
    'robbery': 'robbery',
    'cyber': 'cyber_fraud',
    'fraud': 'cyber_fraud',
    'scam': 'cyber_fraud',
    'vehicle theft': 'vehicle_theft',
    'car theft': 'vehicle_theft',
    'burglary': 'burglary',
    'assault': 'assault',
    'missing': 'missing_person',
  };
  let detectedType: string | null = null;
  for (const [k, v] of Object.entries(typeMap)) {
    if (q.includes(k)) { detectedType = v; break; }
  }
  if (detectedType) reasoning.push(`Matched crime type: ${crimeTypeLabels[detectedType as keyof typeof crimeTypeLabels]}`);

  // detect area
  const areaMap: Record<string, string> = {
    'whitefield': 'Whitefield',
    'kadugodi': 'Whitefield',
    'hoodi': 'Whitefield',
    'koramangala': 'Koramangala',
    'indiranagar': 'Indiranagar',
    'mysuru': 'Mysuru',
    'mysore': 'Mysuru',
    'hubballi': 'Hubballi',
    'hubli': 'Hubballi',
    'bengaluru': 'Bengaluru Urban',
    'bangalore': 'Bengaluru Urban',
  };
  let detectedArea: string | null = null;
  for (const [k, v] of Object.entries(areaMap)) {
    if (q.includes(k)) { detectedArea = v; break; }
  }
  if (detectedArea) reasoning.push(`Filtered to area: ${detectedArea}`);

  // detect time window
  const hasRecent = q.includes('last 6 months') || q.includes('recent') || q.includes('last month') || q.includes('this month');
  if (hasRecent) reasoning.push('Time filter: last 6 months applied');

  let matches = firs.filter((f) => {
    let ok = true;
    if (detectedType && f.crimeType !== detectedType) ok = false;
    if (detectedArea && !f.area.includes(detectedArea) && !f.district.includes(detectedArea)) ok = false;
    return ok;
  });

  if (matches.length === 0) {
    matches = firs.slice(0, 4);
    reasoning.push('No exact match — showing closest related cases');
  }

  const suspectIds = new Set<string>();
  matches.forEach((f) => {
    const c = criminals.filter((cr) => cr.firIds.includes(f.id));
    c.forEach((cr) => suspectIds.add(cr.id));
  });
  const suspects = criminals.filter((c) => suspectIds.has(c.id));

  const vehicles = new Set<string>();
  suspects.forEach((s) => s.vehicles.forEach((v) => vehicles.add(v)));

  const nearbyCctv = evidence
    .filter((e) => e.type === 'cctv')
    .map((e) => e.name);

  const confidence = Math.min(95, 60 + matches.length * 6 + (detectedType ? 8 : 0) + (detectedArea ? 10 : 0));
  if (matches.length > 1) reasoning.push(`${matches.length} FIRs share the same MO and area`);
  if (suspects.length > 0) reasoning.push(`${suspects.length} suspect(s) linked across these cases`);
  if (vehicles.size > 0) reasoning.push(`${vehicles.size} vehicle(s) appear across incidents`);

  const answer = `Found ${matches.length} FIR${matches.length !== 1 ? 's' : ''}${detectedType ? ` for ${crimeTypeLabels[detectedType as keyof typeof crimeTypeLabels]}` : ''}${detectedArea ? ` in ${detectedArea}` : ''}. ${suspects.length > 0 ? `Primary suspect: ${suspects[0].name}.` : ''} ${vehicles.size > 0 ? `Vehicle of interest: ${[...vehicles][0]}.` : ''}`;

  return { answer, matchingFirs: matches, suspects, vehicles: [...vehicles], nearbyCctv, reasoning, confidence };
}

export interface CaseSummary {
  incidentSummary: string;
  keyPersons: { name: string; role: string }[];
  timeline: string[];
  missingEvidence: string[];
  nextSteps: string[];
  confidence: number;
}

export function summarizeCase(caseId: string): CaseSummary {
  const c = cases.find((x) => x.id === caseId);
  if (!c) {
    return {
      incidentSummary: 'Case not found.',
      keyPersons: [], timeline: [], missingEvidence: [], nextSteps: [], confidence: 0,
    };
  }
  const fir = firs.find((f) => f.id === c.firId);
  const suspects = criminals.filter((cr) => c.suspectIds.includes(cr.id));
  const evs = evidence.filter((e) => c.evidenceIds.includes(e.id));

  const keyPersons: { name: string; role: string }[] = [
    { name: fir?.complainant || 'Unknown', role: 'Complainant' },
    ...suspects.map((s) => ({ name: s.name, role: `Suspect — ${s.status === 'wanted' ? 'Wanted' : s.status === 'in_custody' ? 'In custody' : 'Active'}` })),
  ];

  const timeline = c.timeline.map((t) => `${formatDate(t.time)} — ${t.label}: ${t.detail}`);

  const missingEvidence: string[] = [];
  if (!evs.some((e) => e.type === 'cctv')) missingEvidence.push('No CCTV footage linked — check nearby cameras');
  if (!evs.some((e) => e.type === 'statement')) missingEvidence.push('Witness statements incomplete');
  if (!evs.some((e) => e.type === 'forensic') && c.crimeType === 'cyber_fraud') missingEvidence.push('Forensic analysis of devices pending');
  if (suspects.length === 0) missingEvidence.push('No suspect identified yet');

  const confidence = Math.min(96, 70 + c.timeline.length * 3 + evs.length * 4);

  return {
    incidentSummary: c.summary,
    keyPersons,
    timeline,
    missingEvidence,
    nextSteps: c.nextSteps,
    confidence,
  };
}

export function copilotAnswer(query: string): { content: string; reasoning?: string[]; confidence?: number } {
  const q = query.toLowerCase();

  if (q.includes('briefing') || q.includes('brief')) {
    const open = cases.filter((c) => c.status !== 'closed').length;
    const critical = cases.filter((c) => c.priority === 'critical').length;
    const wanted = criminals.filter((c) => c.status === 'wanted').length;
    return {
      content: `**Daily Briefing — ${formatDate(new Date().toISOString())}**

Good morning, team. Here is today's operational briefing:

**Active caseload:** ${open} cases under investigation across the district.
**Critical priority:** ${critical} case(s) require immediate attention — focus on the TrustInvest cyber fraud and Whitefield chain snatching series.
**Wanted persons:** ${wanted} suspect(s) at large. Ravi Kalla remains priority — last seen Whitefield, approach with caution.

**Today's priorities:**
1. Execute arrest warrant on Ravi Kalla (KA03 ME 4471 traced)
2. Freeze remaining UPI mule accounts in TrustInvest case
3. Night patrol reinforcement at Kadugodi and Hope Farm signals — hotspot risk 88%

**Resource note:** Sara Fatima on leave — redistribute Mangaluru caseload to Omkar Joshi.

Stay alert. Stay safe.`,
      reasoning: ['Aggregated from live case data', 'Cross-referenced with hotspot predictions', 'Wanted persons registry'],
      confidence: 92,
    };
  }

  if (q.includes('cyber fraud') || q.includes('cyber')) {
    const cyber = firs.filter((f) => f.crimeType === 'cyber_fraud');
    return {
      content: `This month there are ${cyber.length} active cyber fraud FIRs. The largest is FIR/460/2025 — the "TrustInvest Pro" investment scam with ₹2.4 Cr in losses across 1,200 victims. Proceeds were routed through 38 UPI mule accounts. SI Kiran Kumar is the investigating officer. Key next step: freeze the remaining 12 mule accounts and issue a look-out notice for Deepak Sharma.`,
      reasoning: ['Queried FIR records for cyber_fraud', 'Aggregated financial loss data', 'Linked to assigned officer'],
      confidence: 94,
    };
  }

  if (q.includes('chain snatch') || q.includes('snatching')) {
    const cs = firs.filter((f) => f.crimeType === 'chain_snatching');
    return {
      content: `There are ${cs.length} chain snatching FIRs, all concentrated in Whitefield. The MO is consistent — two men on a black Pulsar targeting women at signals after 20:00. Primary suspect Ravi Kalla (wanted) with associate Suresh Babu (in custody). Vehicle KA03 ME 4471 is traced. Inspector Arjun Rao is leading the case.`,
      reasoning: ['Pattern matched across 3 FIRs', 'Same vehicle identified', 'Suspect linked via recovered SIM'],
      confidence: 91,
    };
  }

  if (q.includes('hotspot') || q.includes('patrol') || q.includes('deploy')) {
    return {
      content: `The highest-risk hotspot tonight is Kadugodi Signal (risk score 88%, trending up). Predicted window is 21:00–23:00. Contributing factors: signal point with low lighting, repeat MO using a black Pulsar, and 3 incidents in the last 14 days. I recommend deploying 2 patrol units and a checkpoint at the signal from 20:30 to 23:30. Secondary hotspot: Hope Farm Circle at 74%.`,
      reasoning: ['Hotspot predictor v2.3', '14-day incident history', 'Weather and lighting model'],
      confidence: 88,
    };
  }

  if (q.includes('how many') && q.includes('case')) {
    return {
      content: `There are currently ${cases.length} active cases in the system. ${cases.filter((c) => c.status === 'under_investigation').length} under investigation, ${cases.filter((c) => c.status === 'evidence_collection').length} in evidence collection, and ${cases.filter((c) => c.priority === 'critical').length} marked critical priority.`,
      reasoning: ['Live case database query'],
      confidence: 98,
    };
  }

  return {
    content: `I can help with case searches, crime statistics, briefing generation, hotspot recommendations, and suspect lookups. Try asking: "How many cyber frauds this month?", "Create a briefing for SP", "Where should I deploy patrols tonight?", or "Show chain snatching cases near Whitefield".`,
    confidence: 70,
  };
}

export function citizenChatbotAnswer(query: string): { content: string } {
  const q = query.toLowerCase();

  if (q.includes('fir') && (q.includes('file') || q.includes('register') || q.includes('complain'))) {
    return {
      content: `To file an FIR online:\n\n1. Go to the "File Complaint" section from your citizen dashboard.\n2. Select the type — Complaint, e-FIR, Cybercrime, or Lost & Found.\n3. Fill in the incident details: type, date, location, and description.\n4. Upload any supporting documents or photos.\n5. Submit — you'll receive a tracking ID immediately.\n\nYou can track the status anytime under "Track Complaint". If it's an emergency, call 112 or use the SOS button.`,
    };
  }
  if (q.includes('sos') || q.includes('emergency')) {
    return {
      content: `The SOS feature sends an instant distress alert with your live location to the nearest police station and your registered emergency contacts. Tap the red SOS button on your dashboard. Your location is captured automatically and the nearest patrol unit is dispatched. Please use SOS only for genuine emergencies — misuse is punishable under law.`,
    };
  }
  if (q.includes('cyber') || q.includes('fraud') || q.includes('scam')) {
    return {
      content: `If you've been a victim of cyber fraud:\n\n1. Call the national cyber crime helpline 1930 immediately to report and freeze fraudulent transactions.\n2. File a cybercrime complaint through this portal under "Cyber Crime Report".\n3. Preserve all evidence — screenshots, UPI references, chat logs, and the app/website link.\n4. Do not delete messages or uninstall the fraudulent app.\n\nThe Cyber Crime PS Bengaluru handles these cases statewide.`,
    };
  }
  if (q.includes('lost')) {
    return {
      content: `To report a lost item:\n\n1. Use the "Lost & Found" service from your dashboard.\n2. Describe the item, where you last saw it, and upload a photo if possible.\n3. You'll get a tracking ID. If the item is found and deposited at a station, you'll be notified.\n\nFor lost documents like Aadhaar or licence, also report to the respective issuing authority.`,
    };
  }
  if (q.includes('passport') || q.includes('verification') || q.includes('tenant')) {
    return {
      content: `For verification services (passport, tenant, character certificate):\n\n1. Go to "Service Requests" from your dashboard.\n2. Choose the verification type.\n3. Upload the required documents (ID proof, address proof, photo).\n4. Book an appointment at your nearest police station for in-person verification.\n\nTypical processing time is 7–15 working days.`,
    };
  }
  if (q.includes('near') && q.includes('station')) {
    return {
      content: `Use the "Nearby Stations" map on your dashboard to find police stations close to your location. You'll see contact numbers, jurisdiction areas, and directions. The nearest station to your registered address (Whitefield) is Whitefield Police Station — 080-2569-1200.`,
    };
  }
  if (q.includes('track') || q.includes('status')) {
    return {
      content: `To track your complaint, go to "Track Complaint" and enter your tracking ID (e.g., KSP-2025-TRK-XXXX). You'll see the full status timeline — from submission to assignment to investigation to resolution. You can also view all your complaints under "My Complaints".`,
    };
  }
  return {
    content: `I'm your KSP AI assistant. I can help with:\n\n• Filing complaints and FIRs\n• Tracking your complaints\n• Cyber fraud reporting\n• Lost and found items\n• Verification services (passport, tenant)\n• Finding nearby police stations\n• Emergency SOS guidance\n\nAsk me anything about police services!`,
  };
}

export function makeChatMessage(role: 'user' | 'assistant', content: string, extra?: Partial<ChatMessage>): ChatMessage {
  return { id: uid('msg'), role, content, at: new Date().toISOString(), ...extra };
}
