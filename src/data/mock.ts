import type {
  FIR,
  Case,
  Criminal,
  Officer,
  PoliceStation,
  CitizenComplaint,
  Alert,
  Notification,
  Task,
  Hotspot,
  AuditLog,
  Appointment,
  Message,
  Evidence,
} from '@/types';

export const stations: PoliceStation[] = [
  { id: 'st_whitefield', name: 'Whitefield Police Station', district: 'Bengaluru Urban', area: 'Whitefield', lat: 12.9698, lng: 77.75, phone: '080-2569-1200', email: 'sp-whitefield@ksp.gov.in', officerCount: 42, jurisdiction: 'Whitefield, Kadugodi, Varthur', type: 'urban' },
  { id: 'st_koramangala', name: 'Koramangala Police Station', district: 'Bengaluru Urban', area: 'Koramangala', lat: 12.9352, lng: 77.6245, phone: '080-2553-7700', email: 'sp-koramangala@ksp.gov.in', officerCount: 38, jurisdiction: 'Koramangala, Adugodi', type: 'urban' },
  { id: 'st_mgroad', name: 'M.G. Road Traffic PS', district: 'Bengaluru Urban', area: 'M.G. Road', lat: 12.9756, lng: 77.6055, phone: '080-2294-3000', email: 'traffic-mgroad@ksp.gov.in', officerCount: 24, jurisdiction: 'MG Road, Brigade Road', type: 'traffic' },
  { id: 'st_cyber', name: 'Cyber Crime PS Bengaluru', district: 'Bengaluru Urban', area: 'Cottonpet', lat: 12.9634, lng: 77.5689, phone: '080-2294-9999', email: 'cyber-bengaluru@ksp.gov.in', officerCount: 31, jurisdiction: 'Statewide cybercrime', type: 'cyber' },
  { id: 'st_mysuru', name: 'Devaraja PS Mysuru', district: 'Mysuru', area: 'Devaraja Mohalla', lat: 12.3078, lng: 76.6492, phone: '0821-244-4100', email: 'sp-mysuru@ksp.gov.in', officerCount: 35, jurisdiction: 'Devaraja, Krishnaraja', type: 'urban' },
  { id: 'st_hubli', name: 'Hubballi Dharwad PS', district: 'Dharwad', area: 'Hubballi', lat: 15.3647, lng: 75.124, phone: '0836-236-4000', email: 'sp-hubli@ksp.gov.in', officerCount: 29, jurisdiction: 'Hubballi city', type: 'urban' },
  { id: 'st_mangaluru', name: 'Mangaluru City PS', district: 'Dakshina Kannada', area: 'Pandeshwara', lat: 12.8762, lng: 74.842, phone: '0824-244-2200', email: 'sp-mangaluru@ksp.gov.in', officerCount: 33, jurisdiction: 'Mangaluru city', type: 'urban' },
  { id: 'st_belagavi', name: 'Belagavi City PS', district: 'Belagavi', area: 'Camp', lat: 15.8543, lng: 74.5066, phone: '0831-246-3000', email: 'sp-belagavi@ksp.gov.in', officerCount: 27, jurisdiction: 'Belagavi city', type: 'urban' },
];

export const officers: Officer[] = [
  { id: 'of_arjun', name: 'Arjun Rao', rank: 'Inspector', badgeId: 'KSP-4471', stationId: 'st_whitefield', district: 'Bengaluru Urban', email: 'arjun.rao@ksp.gov.in', phone: '90080-11221', status: 'active', casesOpen: 8, casesSolved: 64, avatarColor: 'bg-navy-600', initials: 'AR', joinedAt: '2016-08-12' },
  { id: 'of_priya', name: 'Priya Nair', rank: 'Sub-Inspector', badgeId: 'KSP-5523', stationId: 'st_koramangala', district: 'Bengaluru Urban', email: 'priya.nair@ksp.gov.in', phone: '90080-33445', status: 'active', casesOpen: 5, casesSolved: 41, avatarColor: 'bg-teal-600', initials: 'PN', joinedAt: '2019-01-20' },
  { id: 'of_kiran', name: 'Kiran Kumar', rank: 'ASR', badgeId: 'KSP-6610', stationId: 'st_cyber', district: 'Bengaluru Urban', email: 'kiran.kumar@ksp.gov.in', phone: '90080-55667', status: 'active', casesOpen: 12, casesSolved: 28, avatarColor: 'bg-blue-600', initials: 'KK', joinedAt: '2021-06-05' },
  { id: 'of_rahul', name: 'Rahul Deshpande', rank: 'DySP', badgeId: 'KSP-2208', stationId: 'st_mysuru', district: 'Mysuru', email: 'rahul.d@ksp.gov.in', phone: '90080-77889', status: 'active', casesOpen: 4, casesSolved: 89, avatarColor: 'bg-navy-700', initials: 'RD', joinedAt: '2013-03-15' },
  { id: 'of_sara', name: 'Sara Fatima', rank: 'Inspector', badgeId: 'KSP-4489', stationId: 'st_mangaluru', district: 'Dakshina Kannada', email: 'sara.f@ksp.gov.in', phone: '90080-99001', status: 'leave', casesOpen: 2, casesSolved: 52, avatarColor: 'bg-gold-600', initials: 'SF', joinedAt: '2017-11-02' },
  { id: 'of_vikram', name: 'Vikram Singh', rank: 'Head Constable', badgeId: 'KSP-7733', stationId: 'st_whitefield', district: 'Bengaluru Urban', email: 'vikram.s@ksp.gov.in', phone: '90080-22334', status: 'active', casesOpen: 3, casesSolved: 19, avatarColor: 'bg-teal-700', initials: 'VS', joinedAt: '2022-09-10' },
  { id: 'of_meera', name: 'Meera Shetty', rank: 'PSI', badgeId: 'KSP-5598', stationId: 'st_mgroad', district: 'Bengaluru Urban', email: 'meera.s@ksp.gov.in', phone: '90080-44556', status: 'active', casesOpen: 6, casesSolved: 33, avatarColor: 'bg-blue-700', initials: 'MS', joinedAt: '2020-04-18' },
  { id: 'of_omkar', name: 'Omkar Joshi', rank: 'PI', badgeId: 'KSP-3312', stationId: 'st_belagavi', district: 'Belagavi', email: 'omkar.j@ksp.gov.in', phone: '90080-66778', status: 'active', casesOpen: 7, casesSolved: 47, avatarColor: 'bg-navy-500', initials: 'OJ', joinedAt: '2018-07-22' },
];

export const criminals: Criminal[] = [
  {
    id: 'cr_ravi', name: 'Ravi alias Ravi Kalla', aliases: ['Kalla Ravi', 'Ravi Mysuru'], age: 34, gender: 'male', photoColor: 'bg-danger-600',
    status: 'wanted', dangerLevel: 'extreme', district: 'Bengaluru Urban', area: 'Whitefield',
    casesCount: 11, firIds: ['fir_1001', 'fir_1003', 'fir_1007'],
    associates: [
      { criminalId: 'cr_suresh', relation: 'Co-accused — chain snatching gang' },
      { criminalId: 'cr_mohan', relation: 'Fences stolen gold' },
    ],
    vehicles: ['KA03 ME 4471', 'KA05 MN 2210'], phones: ['+91 90080 11122', '+91 74067 88990'],
    addresses: ['Kadugodi, Bengaluru'], gang: 'Whitefield Chain Gang',
    notes: 'Repeat offender, 11 FIRs. Targets women on two-wheelers at signals.',
  },
  {
    id: 'cr_suresh', name: 'Suresh Babu', aliases: ['Suri'], age: 29, gender: 'male', photoColor: 'bg-warning-600',
    status: 'in_custody', dangerLevel: 'high', district: 'Bengaluru Urban', area: 'KR Puram',
    casesCount: 7, firIds: ['fir_1001', 'fir_1005'],
    associates: [{ criminalId: 'cr_ravi', relation: 'Co-accused' }, { criminalId: 'cr_mohan', relation: 'Fence' }],
    vehicles: ['KA05 MN 2210'], phones: ['+91 74067 88990'],
    addresses: ['KR Puram, Bengaluru'], gang: 'Whitefield Chain Gang',
    notes: 'Pillion rider in chain snatchings. Arrested 2024-09.',
  },
  {
    id: 'cr_mohan', name: 'Mohan Lal', aliases: ['Mohan Jeweller'], age: 51, gender: 'male', photoColor: 'bg-gold-600',
    status: 'active', dangerLevel: 'medium', district: 'Bengaluru Urban', area: 'Marathahalli',
    casesCount: 3, firIds: ['fir_1003'],
    associates: [{ criminalId: 'cr_ravi', relation: 'Buys stolen gold' }, { criminalId: 'cr_suresh', relation: 'Fence' }],
    vehicles: [], phones: ['+91 80221 33445'],
    addresses: ['Marathahalli Bridge Road'], notes: 'Jeweller suspected of melting stolen gold.',
  },
  {
    id: 'cr_deepak', name: 'Deepak Sharma', aliases: ['Deepak Cyber'], age: 26, gender: 'male', photoColor: 'bg-blue-600',
    status: 'wanted', dangerLevel: 'high', district: 'Bengaluru Urban', area: 'Online',
    casesCount: 9, firIds: ['fir_1010', 'fir_1011'],
    associates: [{ criminalId: 'cr_rajesh', relation: 'UPI mule network' }],
    vehicles: [], phones: ['+91 63002 55120', '+91 99880 12345'],
    addresses: ['Unknown — operates via VPN'], notes: 'Fake investment app scam, ₹2.4 Cr losses.',
  },
  {
    id: 'cr_rajesh', name: 'Rajesh Verma', aliases: [], age: 23, gender: 'male', photoColor: 'bg-teal-600',
    status: 'active', dangerLevel: 'medium', district: 'Mysuru', area: 'Vijayanagar',
    casesCount: 4, firIds: ['fir_1010'],
    associates: [{ criminalId: 'cr_deepak', relation: 'UPI mule' }],
    vehicles: [], phones: ['+91 99880 12345'],
    addresses: ['Vijayanagar, Mysuru'], notes: 'Lends bank accounts to cyber fraudsters for commission.',
  },
  {
    id: 'cr_imran', name: 'Imran Khan', aliases: ['Imran Bhai'], age: 38, gender: 'male', photoColor: 'bg-navy-700',
    status: 'active', dangerLevel: 'high', district: 'Dharwad', area: 'Hubballi',
    casesCount: 6, firIds: ['fir_1015'],
    associates: [{ criminalId: 'cr_ravi', relation: 'Inter-district fence' }],
    vehicles: ['KA31 AB 7890'], phones: ['+91 70220 55667'],
    addresses: ['Hubballi old town'], gang: 'Hubballi Theft Ring',
    notes: 'Vehicle theft across districts.',
  },
];

export const evidence: Evidence[] = [
  { id: 'ev_1', caseId: 'case_2001', firId: 'fir_1001', name: 'CCTV — Kadugodi Signal 21:40', type: 'cctv', collectedAt: '2025-12-04T15:30:00Z', collectedBy: 'Arjun Rao', description: 'Footage shows two men on black Pulsar, plate obscured. Snatch at 21:40.', status: 'analyzed', tags: ['chain_snatching', 'pulsar', 'night'] },
  { id: 'ev_2', caseId: 'case_2001', firId: 'fir_1001', name: 'Victim Statement — Lakshmi R', type: 'statement', collectedAt: '2025-12-04T22:10:00Z', collectedBy: 'Priya Nair', description: 'Victim saw Pulsar, rider in black helmet, pillion in red shirt.', status: 'collected', tags: ['statement'] },
  { id: 'ev_3', caseId: 'case_2001', firId: 'fir_1001', name: 'SIM card recovered', type: 'phone', collectedAt: '2025-12-06T11:00:00Z', collectedBy: 'Vikram Singh', description: 'Discarded SIM linked to +91 74067 88990.', status: 'analyzed', tags: ['sim', 'phone'] },
  { id: 'ev_4', caseId: 'case_2002', firId: 'fir_1010', name: 'Fake app APK', type: 'forensic', collectedAt: '2025-11-20T09:00:00Z', collectedBy: 'Kiran Kumar', description: 'APK of "TrustInvest Pro" with phishing C2 server.', status: 'analyzed', tags: ['cyber', 'apk'] },
  { id: 'ev_5', caseId: 'case_2002', firId: 'fir_1010', name: 'UPI transaction log', type: 'document', collectedAt: '2025-11-20T09:30:00Z', collectedBy: 'Kiran Kumar', description: '₹2.4 Cr routed through 38 mule accounts.', status: 'in_court', tags: ['upi', 'cyber'] },
  { id: 'ev_6', caseId: 'case_2003', firId: 'fir_1015', name: 'Recovered Swift KA01', type: 'vehicle', collectedAt: '2025-12-12T18:00:00Z', collectedBy: 'Omkar Joshi', description: 'Stolen Swift recovered from Hubballi godown.', status: 'collected', tags: ['vehicle', 'hubballi'] },
];

export const firs: FIR[] = [
  { id: 'fir_1001', firNumber: 'FIR/447/2025', title: 'Chain snatching near Kadugodi signal', crimeType: 'chain_snatching', status: 'under_investigation', priority: 'high', district: 'Bengaluru Urban', area: 'Whitefield', lat: 12.991, lng: 77.76, filedAt: '2025-12-04T21:45:00Z', complainant: 'Lakshmi R', accused: 'Ravi alias Ravi Kalla', description: 'Two men on black Pulsar snatched gold chain at Kadugodi signal around 21:40. Victim fell, minor injuries.', assignedOfficerId: 'of_arjun', stationId: 'st_whitefield', evidenceIds: ['ev_1', 'ev_2', 'ev_3'], relatedFirIds: ['fir_1003', 'fir_1007'], tags: ['pulsar', 'signal', 'night', 'gold'] },
  { id: 'fir_1003', firNumber: 'FIR/449/2025', title: 'Chain snatching at Hope Farm circle', crimeType: 'chain_snatching', status: 'under_investigation', priority: 'high', district: 'Bengaluru Urban', area: 'Whitefield', lat: 12.985, lng: 77.745, filedAt: '2025-12-09T20:30:00Z', complainant: 'Suma T', accused: 'Ravi alias Ravi Kalla', description: 'Same MO — black Pulsar, pillion snatches chain. 20:30 at Hope Farm.', assignedOfficerId: 'of_arjun', stationId: 'st_whitefield', evidenceIds: [], relatedFirIds: ['fir_1001', 'fir_1007'], tags: ['pulsar', 'signal', 'gold'] },
  { id: 'fir_1005', firNumber: 'FIR/451/2025', title: 'Attempted snatching at Varthur Kodi', crimeType: 'chain_snatching', status: 'open', priority: 'medium', district: 'Bengaluru Urban', area: 'Varthur', lat: 12.94, lng: 77.74, filedAt: '2025-12-14T19:00:00Z', complainant: 'Geeta M', accused: 'Unknown', description: 'Pillion attempted snatch, victim held chain, suspects fled.', assignedOfficerId: 'of_arjun', stationId: 'st_whitefield', evidenceIds: [], relatedFirIds: ['fir_1001'], tags: ['attempt', 'pulsar'] },
  { id: 'fir_1007', firNumber: 'FIR/453/2025', title: 'Chain snatching Hoodi junction', crimeType: 'chain_snatching', status: 'evidence_collection', priority: 'high', district: 'Bengaluru Urban', area: 'Whitefield', lat: 12.978, lng: 77.735, filedAt: '2025-12-18T21:10:00Z', complainant: 'Kavya S', accused: 'Ravi alias Ravi Kalla', description: 'Same MO, black Pulsar KA03 ME 4471 sighted.', assignedOfficerId: 'of_arjun', stationId: 'st_whitefield', evidenceIds: [], relatedFirIds: ['fir_1001', 'fir_1003'], tags: ['pulsar', 'gold', 'night'] },
  { id: 'fir_1010', firNumber: 'FIR/460/2025', title: 'Fake investment app fraud ₹2.4 Cr', crimeType: 'cyber_fraud', status: 'under_investigation', priority: 'critical', district: 'Bengaluru Urban', area: 'Online', lat: 12.96, lng: 77.57, filedAt: '2025-11-18T10:00:00Z', complainant: 'Multiple victims', accused: 'Deepak Sharma', description: '"TrustInvest Pro" app promised 2% daily returns. 1,200 victims, ₹2.4 Cr routed via UPI mules.', assignedOfficerId: 'of_kiran', stationId: 'st_cyber', evidenceIds: ['ev_4', 'ev_5'], relatedFirIds: ['fir_1011'], tags: ['cyber', 'upi', 'investment'] },
  { id: 'fir_1011', firNumber: 'FIR/461/2025', title: 'UPI mule account network', crimeType: 'cyber_fraud', status: 'under_investigation', priority: 'high', district: 'Mysuru', area: 'Vijayanagar', lat: 12.31, lng: 76.65, filedAt: '2025-11-22T14:00:00Z', complainant: 'Bank fraud cell', accused: 'Rajesh Verma', description: '38 mule accounts used to layer TrustInvest proceeds.', assignedOfficerId: 'of_kiran', stationId: 'st_cyber', evidenceIds: ['ev_5'], relatedFirIds: ['fir_1010'], tags: ['cyber', 'upi'] },
  { id: 'fir_1015', firNumber: 'FIR/470/2025', title: 'Multi-district vehicle theft ring', crimeType: 'vehicle_theft', status: 'evidence_collection', priority: 'high', district: 'Dharwad', area: 'Hubballi', lat: 15.36, lng: 75.12, filedAt: '2025-12-10T08:00:00Z', complainant: 'Showroom owner', accused: 'Imran Khan', description: '6 Swifts stolen from Bengaluru, recovered in Hubballi godown.', assignedOfficerId: 'of_omkar', stationId: 'st_hubli', evidenceIds: ['ev_6'], relatedFirIds: [], tags: ['vehicle', 'swift', 'gang'] },
  { id: 'fir_1020', firNumber: 'FIR/475/2025', title: 'Burglary at Jayanagar residence', crimeType: 'burglary', status: 'open', priority: 'medium', district: 'Bengaluru Urban', area: 'Jayanagar', lat: 12.925, lng: 77.59, filedAt: '2025-12-20T03:00:00Z', complainant: 'Anand K', accused: 'Unknown', description: 'House broken into at night, jewellery and cash stolen.', assignedOfficerId: 'of_priya', stationId: 'st_koramangala', evidenceIds: [], relatedFirIds: [], tags: ['night', 'jewellery'] },
  { id: 'fir_1022', firNumber: 'FIR/477/2025', title: 'Assault at Indiranagar pub', crimeType: 'assault', status: 'filed_in_court', priority: 'medium', district: 'Bengaluru Urban', area: 'Indiranagar', lat: 12.97, lng: 77.64, filedAt: '2025-11-28T01:30:00Z', complainant: 'Bouncer', accused: 'Manoj T', description: 'Altercation escalated to assault, CCTV available.', assignedOfficerId: 'of_meera', stationId: 'st_mgroad', evidenceIds: [], relatedFirIds: [], tags: ['pub', 'night'] },
  { id: 'fir_1025', firNumber: 'FIR/480/2025', title: 'Missing person — Anil, age 14', crimeType: 'missing_person', status: 'under_investigation', priority: 'high', district: 'Mysuru', area: 'Devaraja', lat: 12.31, lng: 76.65, filedAt: '2025-12-22T18:00:00Z', complainant: 'Mother', accused: 'Unknown', description: '14-year-old Anil missing from home since morning. Last seen near bus stand.', assignedOfficerId: 'of_rahul', stationId: 'st_mysuru', evidenceIds: [], relatedFirIds: [], tags: ['minor', 'missing'] },
];

export const cases: Case[] = [
  {
    id: 'case_2001', caseNumber: 'C/2025/2001', firId: 'fir_1001', title: 'Whitefield chain snatching series', crimeType: 'chain_snatching', status: 'under_investigation', priority: 'high', district: 'Bengaluru Urban', area: 'Whitefield', assignedOfficerIds: ['of_arjun', 'of_priya'], openedAt: '2025-12-04T22:00:00Z', updatedAt: '2025-12-20T10:00:00Z',
    summary: 'Series of chain snatchings in Whitefield by two men on a black Pulsar. Same MO across 3 FIRs. Suspect Ravi Kalla identified via SIM recovery. Vehicle KA03 ME 4471 traced.',
    timeline: [
      { id: 'tl1', time: '2025-12-04T21:40:00Z', label: 'Incident', detail: 'Chain snatched at Kadugodi signal', type: 'incident' },
      { id: 'tl2', time: '2025-12-04T22:10:00Z', label: 'Statement', detail: 'Victim statement recorded', type: 'witness' },
      { id: 'tl3', time: '2025-12-05T09:00:00Z', label: 'CCTV', detail: 'Footage from signal camera retrieved', type: 'evidence' },
      { id: 'tl4', time: '2025-12-06T11:00:00Z', label: 'Evidence', detail: 'Discarded SIM recovered, linked to Ravi Kalla', type: 'evidence' },
      { id: 'tl5', time: '2025-12-09T20:30:00Z', label: 'Linked FIR', detail: 'Second snatching at Hope Farm — same MO', type: 'note' },
      { id: 'tl6', time: '2025-12-18T21:10:00Z', label: 'Linked FIR', detail: 'Third snatching at Hoodi — vehicle traced', type: 'note' },
    ],
    evidenceIds: ['ev_1', 'ev_2', 'ev_3'], suspectIds: ['cr_ravi', 'cr_suresh'],
    nextSteps: ['Trace owner of KA03 ME 4471', 'Pick up Ravi Kalla — warrant issued', 'Line-up with pillion suspect', 'Recover stolen gold from Mohan Lal'],
  },
  {
    id: 'case_2002', caseNumber: 'C/2025/2002', firId: 'fir_1010', title: 'TrustInvest Pro cyber fraud', crimeType: 'cyber_fraud', status: 'under_investigation', priority: 'critical', district: 'Bengaluru Urban', area: 'Online', assignedOfficerIds: ['of_kiran'], openedAt: '2025-11-18T11:00:00Z', updatedAt: '2025-12-19T16:00:00Z',
    summary: 'Fake investment app "TrustInvest Pro" defrauded 1,200 victims of ₹2.4 Cr. Proceeds layered through 38 UPI mule accounts. Mastermind Deepak Sharma operating via VPN.',
    timeline: [
      { id: 'tl1', time: '2025-11-18T10:00:00Z', label: 'Complaint', detail: 'First victim reported app scam', type: 'incident' },
      { id: 'tl2', time: '2025-11-18T14:00:00Z', label: 'Forensic', detail: 'APK analysed — C2 server identified', type: 'evidence' },
      { id: 'tl3', time: '2025-11-20T09:00:00Z', label: 'Forensic', detail: 'APK reverse-engineered, phishing domains mapped', type: 'evidence' },
      { id: 'tl4', time: '2025-11-22T14:00:00Z', label: 'Linked', detail: 'Mule account network identified — Rajesh Verma', type: 'note' },
      { id: 'tl5', time: '2025-12-01T12:00:00Z', label: 'Court', detail: 'Look-out notice issued for Deepak Sharma', type: 'court' },
    ],
    evidenceIds: ['ev_4', 'ev_5'], suspectIds: ['cr_deepak', 'cr_rajesh'],
    nextSteps: ['Freeze remaining mule accounts', 'Coordinate with CERT-In on C2 server takedown', 'Trace Deepak via payment gateway KYC', 'Issue state-wide look-out notice'],
  },
  {
    id: 'case_2003', caseNumber: 'C/2025/2003', firId: 'fir_1015', title: 'Hubballi vehicle theft ring', crimeType: 'vehicle_theft', status: 'evidence_collection', priority: 'high', district: 'Dharwad', area: 'Hubballi', assignedOfficerIds: ['of_omkar'], openedAt: '2025-12-10T09:00:00Z', updatedAt: '2025-12-12T18:00:00Z',
    summary: 'Six Maruti Swifts stolen from Bengaluru showrooms recovered from a Hubballi godown. Imran Khan suspected of fencing. Inter-district gang.',
    timeline: [
      { id: 'tl1', time: '2025-12-10T08:00:00Z', label: 'Report', detail: 'Showroom owner reported 6 missing Swifts', type: 'incident' },
      { id: 'tl2', time: '2025-12-11T13:00:00Z', label: 'Recovery', detail: 'Swifts traced to Hubballi godown', type: 'evidence' },
      { id: 'tl3', time: '2025-12-12T18:00:00Z', label: 'Seizure', detail: 'Vehicles seized, Imran absconding', type: 'evidence' },
    ],
    evidenceIds: ['ev_6'], suspectIds: ['cr_imran'],
    nextSteps: ['Arrest Imran Khan', 'Map godown ownership records', 'Check for re-chassis operations', 'Coordinate with Bengaluru DCP'],
  },
];

export const complaints: CitizenComplaint[] = [
  {
    id: 'cp_1', trackingId: 'KSP-2025-TRK-8842', citizenId: 'ct_ramesh', citizenName: 'Ramesh Iyer', type: 'complaint', category: 'chain_snatching', title: 'Chain snatched near Kadugodi signal', description: 'Two men on a bike snatched my wife\'s gold chain at the Kadugodi signal around 9:40 PM.', district: 'Bengaluru Urban', area: 'Whitefield', status: 'investigating', priority: 'high', createdAt: '2025-12-04T21:45:00Z', updatedAt: '2025-12-20T10:00:00Z', assignedOfficerId: 'of_arjun', stationId: 'st_whitefield',
    timeline: [
      { time: '2025-12-04T21:45:00Z', label: 'Submitted', detail: 'Complaint filed online' },
      { time: '2025-12-05T09:00:00Z', label: 'Assigned', detail: 'Inspector Arjun Rao assigned' },
      { time: '2025-12-06T11:00:00Z', label: 'Evidence', detail: 'SIM card recovered' },
      { time: '2025-12-20T10:00:00Z', label: 'Update', detail: 'Suspect identified — Ravi Kalla' },
    ],
    documents: [{ name: 'victim_photo.jpg', type: 'image', size: '1.2 MB' }],
  },
  {
    id: 'cp_2', trackingId: 'KSP-2025-TRK-8843', citizenId: 'ct_ramesh', citizenName: 'Ramesh Iyer', type: 'lost_found', category: 'lost_item', title: 'Lost wallet at Phoenix Marketcity', description: 'Brown leather wallet with Aadhaar, driving licence and ₹3,000 cash lost at Phoenix Mall.', district: 'Bengaluru Urban', area: 'Whitefield', status: 'submitted', priority: 'low', createdAt: '2025-12-22T15:00:00Z', updatedAt: '2025-12-22T15:00:00Z',
    timeline: [{ time: '2025-12-22T15:00:00Z', label: 'Submitted', detail: 'Lost item report filed' }],
    documents: [],
  },
  {
    id: 'cp_3', trackingId: 'KSP-2025-TRK-8844', citizenId: 'ct_ramesh', citizenName: 'Ramesh Iyer', type: 'cybercrime', category: 'cyber_fraud', title: 'Fake investment app scam', description: 'Invested ₹50,000 in "TrustInvest Pro" app — they stopped withdrawals after 3 days.', district: 'Bengaluru Urban', area: 'Online', status: 'assigned', priority: 'critical', createdAt: '2025-11-18T10:00:00Z', updatedAt: '2025-11-20T09:00:00Z', assignedOfficerId: 'of_kiran', stationId: 'st_cyber',
    timeline: [
      { time: '2025-11-18T10:00:00Z', label: 'Submitted', detail: 'Cybercrime complaint filed' },
      { time: '2025-11-19T12:00:00Z', label: 'Under review', detail: 'Cyber Crime PS picked up' },
      { time: '2025-11-20T09:00:00Z', label: 'Assigned', detail: 'SI Kiran Kumar assigned' },
    ],
    documents: [{ name: 'upi_transactions.pdf', type: 'document', size: '320 KB' }, { name: 'app_screenshot.png', type: 'image', size: '780 KB' }],
  },
  {
    id: 'cp_4', trackingId: 'KSP-2025-TRK-8845', citizenId: 'ct_ramesh', citizenName: 'Ramesh Iyer', type: 'service_request', category: 'tenant_verification', title: 'Tenant verification request', description: 'Requesting verification for new tenant at my rental property in Koramangala.', district: 'Bengaluru Urban', area: 'Koramangala', status: 'resolved', priority: 'low', createdAt: '2025-11-10T11:00:00Z', updatedAt: '2025-11-15T16:00:00Z', stationId: 'st_koramangala',
    timeline: [
      { time: '2025-11-10T11:00:00Z', label: 'Submitted', detail: 'Tenant verification requested' },
      { time: '2025-11-15T16:00:00Z', label: 'Resolved', detail: 'Verification complete — no record' },
    ],
    documents: [{ name: 'tenant_id.pdf', type: 'document', size: '410 KB' }],
  },
];

export const alerts: Alert[] = [
  { id: 'al_1', title: 'Chain snatching alert — Whitefield', message: 'Spike in chain snatchings near Kadugodi and Hoodi signals. Avoid wearing gold jewellery at night.', severity: 'critical', scope: 'citizen', district: 'Bengaluru Urban', area: 'Whitefield', createdAt: '2025-12-20T08:00:00Z', read: false },
  { id: 'al_2', title: 'Cyber fraud advisory', message: 'Beware of "TrustInvest Pro" and similar apps promising daily returns. Report to cyber crime helpline 1930.', severity: 'warning', scope: 'citizen', createdAt: '2025-11-25T09:00:00Z', read: false },
  { id: 'al_3', title: 'Bandobast — New Year eve', message: 'Additional deployment across Bengaluru from 31 Dec 20:00 to 01 Jan 06:00.', severity: 'info', scope: 'officer', district: 'Bengaluru Urban', createdAt: '2025-12-28T10:00:00Z', read: false },
  { id: 'al_4', title: 'Wanted: Ravi Kalla', message: 'Extremely dangerous. Last seen Whitefield. Approach with caution, do not engage alone.', severity: 'critical', scope: 'officer', district: 'Bengaluru Urban', area: 'Whitefield', createdAt: '2025-12-22T07:00:00Z', read: false },
  { id: 'al_5', title: 'System maintenance window', message: 'Platform maintenance scheduled 02:00–04:00. Brief unavailability expected.', severity: 'info', scope: 'admin', createdAt: '2025-12-29T18:00:00Z', read: true },
];

export const notifications: Notification[] = [
  { id: 'nt_1', title: 'Evidence analyzed', message: 'CCTV footage for case C/2025/2001 has been analyzed.', type: 'success', scope: 'officer', createdAt: '2025-12-20T10:00:00Z', read: false, link: '/officer/cases/case_2001' },
  { id: 'nt_2', title: 'New FIR assigned', message: 'FIR/453/2025 assigned to you.', type: 'info', scope: 'officer', createdAt: '2025-12-18T21:30:00Z', read: false, link: '/officer/firs' },
  { id: 'nt_3', title: 'Task overdue', message: 'Field report for C/2025/2001 is overdue.', type: 'warning', scope: 'officer', createdAt: '2025-12-22T09:00:00Z', read: false },
  { id: 'nt_4', title: 'Complaint status update', message: 'Your complaint KSP-2025-TRK-8842 is now under investigation.', type: 'info', scope: 'citizen', createdAt: '2025-12-05T09:00:00Z', read: false },
  { id: 'nt_5', title: 'New user registered', message: '47 new citizens signed up this week.', type: 'info', scope: 'admin', createdAt: '2025-12-28T08:00:00Z', read: false },
  { id: 'nt_6', title: 'Audit flagged', message: 'Unusual admin permission change detected.', type: 'warning', scope: 'admin', createdAt: '2025-12-27T14:00:00Z', read: false },
];

export const tasks: Task[] = [
  { id: 'tk_1', title: 'Trace vehicle KA03 ME 4471', description: 'RC lookup and owner trace for the Pulsar used in chain snatchings.', assigneeId: 'of_arjun', caseId: 'case_2001', dueAt: '2025-12-26T18:00:00Z', status: 'in_progress', priority: 'high' },
  { id: 'tk_2', title: 'Execute warrant on Ravi Kalla', description: 'Coordinate with Whitefield team for arrest.', assigneeId: 'of_arjun', caseId: 'case_2001', dueAt: '2025-12-27T06:00:00Z', status: 'pending', priority: 'critical' },
  { id: 'tk_3', title: 'Freeze mule accounts', description: 'Coordinate with banks to freeze remaining 12 mule accounts.', assigneeId: 'of_kiran', caseId: 'case_2002', dueAt: '2025-12-25T17:00:00Z', status: 'overdue', priority: 'critical' },
  { id: 'tk_4', title: 'Field report — Hoodi junction', description: 'Submit field report for FIR/453/2025.', assigneeId: 'of_arjun', caseId: 'case_2001', dueAt: '2025-12-23T20:00:00Z', status: 'overdue', priority: 'high' },
  { id: 'tk_5', title: 'Arrest Imran Khan', description: 'Raids on Hubballi godown associates.', assigneeId: 'of_omkar', caseId: 'case_2003', dueAt: '2025-12-28T10:00:00Z', status: 'pending', priority: 'high' },
  { id: 'tk_6', title: 'Patrol — Koramangala 100 ft road', description: 'Night patrol 22:00–02:00, focus on signal points.', assigneeId: 'of_priya', dueAt: '2025-12-25T22:00:00Z', status: 'pending', priority: 'medium' },
];

export const hotspots: Hotspot[] = [
  { id: 'hs_1', area: 'Kadugodi Signal', district: 'Bengaluru Urban', lat: 12.991, lng: 77.76, riskScore: 88, trend: 'up', crimeTypes: ['chain_snatching', 'robbery'], predictedWindow: 'Tonight 21:00–23:00', factors: ['Signal point', 'Low lighting', 'Repeat MO — black Pulsar', '3 incidents in 14 days'] },
  { id: 'hs_2', area: 'Hope Farm Circle', district: 'Bengaluru Urban', lat: 12.985, lng: 77.745, riskScore: 74, trend: 'up', crimeTypes: ['chain_snatching'], predictedWindow: 'Tonight 20:00–22:00', factors: ['Same gang MO', 'Weekend spike'] },
  { id: 'hs_3', area: 'Koramangala 100 ft road', district: 'Bengaluru Urban', lat: 12.935, lng: 77.624, riskScore: 62, trend: 'stable', crimeTypes: ['theft', 'burglary'], predictedWindow: 'Weekend 19:00–23:00', factors: ['Pub crowd', 'Parking theft'] },
  { id: 'hs_4', area: 'MG Road', district: 'Bengaluru Urban', lat: 12.975, lng: 77.605, riskScore: 45, trend: 'down', crimeTypes: ['vehicle_theft'], predictedWindow: 'Evening 18:00–21:00', factors: ['Improved CCTV coverage'] },
  { id: 'hs_5', area: 'Hubballi old town', district: 'Dharwad', lat: 15.36, lng: 75.12, riskScore: 58, trend: 'up', crimeTypes: ['vehicle_theft', 'burglary'], predictedWindow: 'This week nights', factors: ['Theft ring active', 'Recovery godown nearby'] },
  { id: 'hs_6', area: 'Devaraja Mohalla', district: 'Mysuru', lat: 12.307, lng: 76.649, riskScore: 38, trend: 'stable', crimeTypes: ['missing_person', 'theft'], predictedWindow: 'Daytime', factors: ['Bus stand traffic'] },
];

export const auditLogs: AuditLog[] = [
  { id: 'au_1', actor: 'admin@ksp.gov.in', actorRole: 'admin', action: 'Updated officer role', target: 'Priya Nair → Sub-Inspector', ip: '10.0.4.21', createdAt: '2025-12-28T11:00:00Z', severity: 'info' },
  { id: 'au_2', actor: 'admin@ksp.gov.in', actorRole: 'admin', action: 'Disabled user account', target: 'ct_suspended_44', ip: '10.0.4.21', createdAt: '2025-12-27T16:00:00Z', severity: 'warning' },
  { id: 'au_3', actor: 'system', actorRole: 'admin', action: 'AI model retrained', target: 'hotspot-predictor-v2.3', ip: '127.0.0.1', createdAt: '2025-12-26T02:00:00Z', severity: 'info' },
  { id: 'au_4', actor: 'arjun.rao@ksp.gov.in', actorRole: 'officer', action: 'Viewed criminal profile', target: 'Ravi Kalla', ip: '10.4.2.18', createdAt: '2025-12-25T14:00:00Z', severity: 'info' },
  { id: 'au_5', actor: 'unknown', actorRole: 'admin', action: 'Failed login attempt', target: 'admin portal', ip: '203.0.113.55', createdAt: '2025-12-24T03:00:00Z', severity: 'critical' },
  { id: 'au_6', actor: 'admin@ksp.gov.in', actorRole: 'admin', action: 'Exported audit report', target: 'Dec-2025.csv', ip: '10.0.4.21', createdAt: '2025-12-23T18:00:00Z', severity: 'info' },
];

export const appointments: Appointment[] = [
  { id: 'ap_1', citizenId: 'ct_ramesh', stationId: 'st_koramangala', purpose: 'Tenant verification follow-up', date: '2025-12-30', time: '11:00', status: 'scheduled', officerId: 'of_priya' },
  { id: 'ap_2', citizenId: 'ct_ramesh', stationId: 'st_whitefield', purpose: 'Statement recording — chain snatching', date: '2025-12-26', time: '15:00', status: 'scheduled', officerId: 'of_arjun' },
];

export const messages: Message[] = [
  { id: 'ms_1', fromId: 'of_arjun', fromName: 'Arjun Rao', toId: 'of_priya', toName: 'Priya Nair', body: 'Priya, the SIM we recovered links to Ravi Kalla. Pull his prior records and meet me at 4.', at: '2025-12-20T13:30:00Z', read: true },
  { id: 'ms_2', fromId: 'of_priya', fromName: 'Priya Nair', toId: 'of_arjun', toName: 'Arjun Rao', body: 'On it. His associate Suresh is in custody — should I request a line-up?', at: '2025-12-20T13:45:00Z', read: false },
  { id: 'ms_3', fromId: 'of_kiran', fromName: 'Kiran Kumar', toId: 'of_arjun', toName: 'Arjun Rao', body: 'Sharing the UPI mule list — one of the accounts traces back to a Whitefield address. Might overlap with your chain gang.', at: '2025-12-21T09:10:00Z', read: false },
];

export const citizens = [
  { id: 'ct_ramesh', name: 'Ramesh Iyer', email: 'ramesh.iyer@gmail.com', phone: '90080-12345', district: 'Bengaluru Urban', area: 'Whitefield', address: 'Prestige Lakeside, Whitefield', avatarColor: 'bg-navy-600', initials: 'RI', joinedAt: '2025-09-10', complaints: 4 },
  { id: 'ct_lakshmi', name: 'Lakshmi R', email: 'lakshmi.r@gmail.com', phone: '90080-67890', district: 'Bengaluru Urban', area: 'Whitefield', address: 'Kadugodi Main Road', avatarColor: 'bg-teal-600', initials: 'LR', joinedAt: '2025-12-04', complaints: 1 },
  { id: 'ct_anand', name: 'Anand K', email: 'anand.k@gmail.com', phone: '90080-22233', district: 'Bengaluru Urban', area: 'Jayanagar', address: '4th Block Jayanagar', avatarColor: 'bg-blue-600', initials: 'AK', joinedAt: '2025-10-22', complaints: 1 },
];

export const districts = [
  'Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Dharwad', 'Dakshina Kannada', 'Belagavi', 'Kalaburagi', 'Mangaluru',
];

export const crimeTrendMonthly = [
  { month: 'Jul', chain_snatching: 12, robbery: 8, cyber_fraud: 22, vehicle_theft: 15, burglary: 10 },
  { month: 'Aug', chain_snatching: 14, robbery: 7, cyber_fraud: 28, vehicle_theft: 12, burglary: 9 },
  { month: 'Sep', chain_snatching: 11, robbery: 9, cyber_fraud: 35, vehicle_theft: 14, burglary: 11 },
  { month: 'Oct', chain_snatching: 16, robbery: 11, cyber_fraud: 41, vehicle_theft: 10, burglary: 8 },
  { month: 'Nov', chain_snatching: 19, robbery: 8, cyber_fraud: 52, vehicle_theft: 13, burglary: 12 },
  { month: 'Dec', chain_snatching: 23, robbery: 10, cyber_fraud: 48, vehicle_theft: 18, burglary: 14 },
];

export const districtStats = [
  { district: 'Bengaluru Urban', cases: 1284, solved: 892, pending: 392, officers: 168, stations: 14, cyber: 312 },
  { district: 'Mysuru', cases: 412, solved: 318, pending: 94, officers: 67, stations: 8, cyber: 41 },
  { district: 'Dharwad', cases: 298, solved: 231, pending: 67, officers: 48, stations: 6, cyber: 28 },
  { district: 'Dakshina Kannada', cases: 267, solved: 201, pending: 66, officers: 44, stations: 5, cyber: 19 },
  { district: 'Belagavi', cases: 231, solved: 178, pending: 53, officers: 39, stations: 5, cyber: 14 },
];

export const systemHealth = [
  { service: 'API Gateway', status: 'operational', uptime: 99.98, latency: 42 },
  { service: 'Database Cluster', status: 'operational', uptime: 99.99, latency: 12 },
  { service: 'AI Inference Service', status: 'operational', uptime: 99.91, latency: 880 },
  { service: 'File Storage', status: 'operational', uptime: 100, latency: 28 },
  { service: 'Notification Service', status: 'degraded', uptime: 98.72, latency: 340 },
  { service: 'SMS Gateway', status: 'operational', uptime: 99.45, latency: 210 },
];

export const aiModels = [
  { id: 'mdl_hotspot', name: 'Hotspot Predictor', version: 'v2.3', status: 'active', accuracy: 87, calls: 14820, lastTrained: '2025-12-26', description: 'Predicts crime hotspots using 14-day history, weather, events, and demographics.' },
  { id: 'mdl_summarizer', name: 'Case Summarizer', version: 'v1.8', status: 'active', accuracy: 91, calls: 3210, lastTrained: '2025-12-15', description: 'Summarizes FIRs and case files into structured investigation briefs.' },
  { id: 'mdl_assistant', name: 'Crime Assistant', version: 'v2.1', status: 'active', accuracy: 89, calls: 22480, lastTrained: '2025-12-20', description: 'Natural-language search across FIRs, suspects, vehicles, and evidence.' },
  { id: 'mdl_dupdetect', name: 'Duplicate FIR Detector', version: 'v1.2', status: 'active', accuracy: 84, calls: 5600, lastTrained: '2025-12-10', description: 'Clusters likely-related FIRs by MO, location, and suspect overlap.' },
  { id: 'mdl_network', name: 'Criminal Network Mapper', version: 'v1.5', status: 'active', accuracy: 86, calls: 1820, lastTrained: '2025-12-18', description: 'Builds relationship graphs from co-accused, vehicles, phones, and addresses.' },
  { id: 'mdl_copilot', name: 'Officer Copilot', version: 'v2.0', status: 'active', accuracy: 90, calls: 9120, lastTrained: '2025-12-22', description: 'Conversational Q&A and briefing generation for officers.' },
];
