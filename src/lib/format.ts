import type { CrimeType, CaseStatus, Priority } from '@/types';

export function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  return `${Math.floor(months / 12)}y ago`;
}

export function cn(...parts: (string | false | null | undefined)[]): string {
  return parts.filter(Boolean).join(' ');
}

export const crimeTypeLabels: Record<CrimeType, string> = {
  chain_snatching: 'Chain Snatching',
  robbery: 'Robbery',
  burglary: 'Burglary',
  cyber_fraud: 'Cyber Fraud',
  theft: 'Theft',
  assault: 'Assault',
  murder: 'Murder',
  kidnapping: 'Kidnapping',
  missing_person: 'Missing Person',
  drug_trafficking: 'Drug Trafficking',
  vehicle_theft: 'Vehicle Theft',
  vandalism: 'Vandalism',
  domestic_violence: 'Domestic Violence',
  other: 'Other',
};

export const crimeTypeIcon: Record<CrimeType, string> = {
  chain_snatching: '🔗',
  robbery: '🎭',
  burglary: '🏠',
  cyber_fraud: '💻',
  theft: '👜',
  assault: '🥊',
  murder: '🔪',
  kidnapping: '🚸',
  missing_person: '👤',
  drug_trafficking: '💊',
  vehicle_theft: '🚗',
  vandalism: '🧨',
  domestic_violence: '💔',
  other: '📋',
};

export const caseStatusLabels: Record<CaseStatus, string> = {
  open: 'Open',
  under_investigation: 'Under Investigation',
  evidence_collection: 'Evidence Collection',
  filed_in_court: 'Filed in Court',
  closed: 'Closed',
  cold: 'Cold Case',
};

export const caseStatusColors: Record<CaseStatus, string> = {
  open: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  under_investigation: 'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300',
  evidence_collection: 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300',
  filed_in_court: 'bg-navy-100 text-navy-700 dark:bg-navy-700/40 dark:text-navy-200',
  closed: 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-300',
  cold: 'bg-navy-100 text-navy-500 dark:bg-navy-800 dark:text-navy-400',
};

export const priorityLabels: Record<Priority, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const priorityColors: Record<Priority, string> = {
  low: 'bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300',
  high: 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300',
  critical: 'bg-danger-100 text-danger-700 dark:bg-danger-500/15 dark:text-danger-300',
};

export function uid(prefix = 'id'): string {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}

export function riskColor(score: number): string {
  if (score >= 75) return 'text-danger-600 dark:text-danger-400';
  if (score >= 50) return 'text-warning-600 dark:text-warning-400';
  if (score >= 30) return 'text-blue-600 dark:text-blue-400';
  return 'text-success-600 dark:text-success-400';
}

export function riskBg(score: number): string {
  if (score >= 75) return 'bg-danger-500';
  if (score >= 50) return 'bg-warning-500';
  if (score >= 30) return 'bg-blue-500';
  return 'bg-success-500';
}

export function downloadText(filename: string, text: string) {
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
