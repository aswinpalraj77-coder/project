export type Role = 'citizen' | 'officer' | 'admin';

export type Theme = 'light' | 'dark';

export interface User {
  id: string;
  name: string;
  role: Role;
  email: string;
  phone?: string;
  avatarColor: string;
  initials: string;
  // role-specific
  rank?: string;
  badgeId?: string;
  stationId?: string;
  department?: string;
  district?: string;
  citizenId?: string;
  address?: string;
}

export type CaseStatus =
  | 'open'
  | 'under_investigation'
  | 'evidence_collection'
  | 'filed_in_court'
  | 'closed'
  | 'cold';

export type CrimeType =
  | 'chain_snatching'
  | 'robbery'
  | 'burglary'
  | 'cyber_fraud'
  | 'theft'
  | 'assault'
  | 'murder'
  | 'kidnapping'
  | 'missing_person'
  | 'drug_trafficking'
  | 'vehicle_theft'
  | 'vandalism'
  | 'domestic_violence'
  | 'other';

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export interface FIR {
  id: string;
  firNumber: string;
  title: string;
  crimeType: CrimeType;
  status: CaseStatus;
  priority: Priority;
  district: string;
  area: string;
  lat: number;
  lng: number;
  filedAt: string; // ISO
  complainant: string;
  accused?: string;
  description: string;
  assignedOfficerId?: string;
  stationId: string;
  evidenceIds: string[];
  relatedFirIds: string[];
  tags: string[];
}

export interface Case {
  id: string;
  caseNumber: string;
  firId: string;
  title: string;
  crimeType: CrimeType;
  status: CaseStatus;
  priority: Priority;
  district: string;
  area: string;
  assignedOfficerIds: string[];
  openedAt: string;
  updatedAt: string;
  summary: string;
  timeline: TimelineEvent[];
  evidenceIds: string[];
  suspectIds: string[];
  nextSteps: string[];
}

export interface TimelineEvent {
  id: string;
  time: string;
  label: string;
  detail: string;
  type: 'incident' | 'evidence' | 'witness' | 'arrest' | 'court' | 'note';
}

export interface Evidence {
  id: string;
  caseId?: string;
  firId?: string;
  name: string;
  type: 'cctv' | 'document' | 'photo' | 'audio' | 'weapon' | 'vehicle' | 'phone' | 'statement' | 'forensic';
  collectedAt: string;
  collectedBy: string;
  description: string;
  status: 'collected' | 'analyzed' | 'in_court' | 'lost';
  tags: string[];
}

export interface Criminal {
  id: string;
  name: string;
  aliases: string[];
  age: number;
  gender: 'male' | 'female';
  photoColor: string;
  status: 'active' | 'in_custody' | 'wanted' | 'released' | 'deceased';
  dangerLevel: 'low' | 'medium' | 'high' | 'extreme';
  district: string;
  area: string;
  casesCount: number;
  firIds: string[];
  associates: { criminalId: string; relation: string }[];
  vehicles: string[];
  phones: string[];
  addresses: string[];
  gang?: string;
  notes: string;
}

export interface Officer {
  id: string;
  name: string;
  rank: string;
  badgeId: string;
  stationId: string;
  district: string;
  email: string;
  phone: string;
  status: 'active' | 'leave' | 'suspended' | 'training';
  casesOpen: number;
  casesSolved: number;
  avatarColor: string;
  initials: string;
  joinedAt: string;
}

export interface PoliceStation {
  id: string;
  name: string;
  district: string;
  area: string;
  lat: number;
  lng: number;
  phone: string;
  email: string;
  officerCount: number;
  jurisdiction: string;
  type: 'urban' | 'rural' | 'traffic' | 'cyber' | 'women';
}

export interface CitizenComplaint {
  id: string;
  trackingId: string;
  citizenId: string;
  citizenName: string;
  type: 'complaint' | 'fir' | 'lost_found' | 'cybercrime' | 'service_request';
  category: CrimeType | 'lost_item' | 'passport_verification' | 'tenant_verification' | 'character_certificate' | 'event_permission';
  title: string;
  description: string;
  district: string;
  area: string;
  status: 'submitted' | 'under_review' | 'assigned' | 'investigating' | 'resolved' | 'rejected';
  priority: Priority;
  createdAt: string;
  updatedAt: string;
  assignedOfficerId?: string;
  stationId?: string;
  timeline: { time: string; label: string; detail: string }[];
  documents: { name: string; type: string; size: string }[];
}

export interface Alert {
  id: string;
  title: string;
  message: string;
  severity: 'info' | 'warning' | 'critical';
  scope: 'citizen' | 'officer' | 'admin';
  district?: string;
  area?: string;
  createdAt: string;
  read: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  scope: Role | 'all';
  createdAt: string;
  read: boolean;
  link?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  assigneeId: string;
  caseId?: string;
  dueAt: string;
  status: 'pending' | 'in_progress' | 'done' | 'overdue';
  priority: Priority;
}

export interface Hotspot {
  id: string;
  area: string;
  district: string;
  lat: number;
  lng: number;
  riskScore: number; // 0-100
  trend: 'up' | 'down' | 'stable';
  crimeTypes: CrimeType[];
  predictedWindow: string;
  factors: string[];
}

export interface AuditLog {
  id: string;
  actor: string;
  actorRole: Role;
  action: string;
  target: string;
  ip: string;
  createdAt: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface Appointment {
  id: string;
  citizenId: string;
  stationId: string;
  purpose: string;
  date: string;
  time: string;
  status: 'scheduled' | 'completed' | 'cancelled';
  officerId?: string;
}

export interface Message {
  id: string;
  fromId: string;
  fromName: string;
  toId: string;
  toName: string;
  body: string;
  at: string;
  read: boolean;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  at: string;
  citations?: { label: string; type: string }[];
  confidence?: number;
  reasoning?: string[];
}
