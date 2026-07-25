import { useState } from 'react';
import {
  LayoutDashboard, Search, FileText, Briefcase, Clock, Package,
  Users, Network, Sparkles, MapPin, ClipboardList, Siren, Mic,
  FileBarChart, MessageSquare, Bell, User,
} from 'lucide-react';
import { PortalLayout } from '@/components/PortalLayout';
import { useRouter, matchRoute } from '@/router';
import { useAuth } from '@/context/AuthContext';
import { Card, CardBody, CardHeader, PageHeader, StatCard, SectionTitle, EmptyState, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select, Avatar, Tabs } from '@/components/ui/Form';
import { Table, Pagination } from '@/components/ui/Table';
import { MapView } from '@/components/ui/MapView';
import { ChatPanel } from '@/components/ui/ChatPanel';
import { BarChart, LineChart, DonutChart, Sparkline } from '@/components/ui/Charts';
import { Modal } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';
import {
  firs, cases, criminals, officers, evidence, hotspots, tasks, alerts, messages, stations,
  crimeTrendMonthly, districtStats, notifications,
} from '@/data/mock';
import {
  crimeTypeLabels, crimeTypeIcon, caseStatusLabels, caseStatusColors,
  priorityLabels, priorityColors, formatDate, formatDateTime, timeAgo, cn, riskColor, riskBg, downloadText,
} from '@/lib/format';
import {
  crimeSearch, summarizeCase, copilotAnswer, makeChatMessage,
} from '@/lib/ai';
import type { ChatMessage, Case, FIR, Criminal } from '@/types';

const nav = [
  { label: 'Dashboard', path: '/officer', icon: LayoutDashboard },
  { label: 'AI Crime Search', path: '/officer/ai-search', icon: Sparkles, badge: 0 },
  { label: 'FIR Management', path: '/officer/firs', icon: FileText },
  { label: 'My Cases', path: '/officer/cases', icon: Briefcase },
  { label: 'Investigation', path: '/officer/investigation', icon: Clock },
  { label: 'Evidence', path: '/officer/evidence', icon: Package },
  { label: 'Criminal Search', path: '/officer/criminals', icon: Users },
  { label: 'Network Graph', path: '/officer/network', icon: Network },
  { label: 'Case Summarizer', path: '/officer/summarizer', icon: Sparkles },
  { label: 'Hotspot Maps', path: '/officer/hotspots', icon: MapPin },
  { label: 'Patrol Planning', path: '/officer/patrol', icon: ClipboardList },
  { label: 'Tasks', path: '/officer/tasks', icon: ClipboardList },
  { label: 'Field Reports', path: '/officer/field-reports', icon: FileText },
  { label: 'Voice Assistant', path: '/officer/voice', icon: Mic },
  { label: 'Reports', path: '/officer/reports', icon: FileBarChart },
  { label: 'Messages', path: '/officer/messages', icon: MessageSquare },
  { label: 'Alerts', path: '/officer/alerts', icon: Siren },
  { label: 'Notifications', path: '/officer/notifications', icon: Bell },
  { label: 'Profile', path: '/officer/profile', icon: User },
];

export function OfficerPortal() {
  const { path } = useRouter();

  const caseMatch = matchRoute('/officer/cases/:id', path);
  const firMatch = matchRoute('/officer/firs/:id', path);
  const criminalMatch = matchRoute('/officer/criminals/:id', path);

  if (path === '/officer' || path === '/officer/') return <OfficerDashboard />;
  if (path === '/officer/ai-search') return <AICrimeSearch />;
  if (path === '/officer/firs') return <FIRManagement />;
  if (firMatch) return <FIRDetail firId={firMatch.id} />;
  if (path === '/officer/cases') return <MyCases />;
  if (caseMatch) return <CaseDetail caseId={caseMatch.id} />;
  if (path === '/officer/investigation') return <InvestigationTimeline />;
  if (path === '/officer/evidence') return <EvidenceManagement />;
  if (path === '/officer/criminals') return <CriminalSearch />;
  if (criminalMatch) return <CriminalProfile criminalId={criminalMatch.id} />;
  if (path === '/officer/network') return <NetworkGraph />;
  if (path === '/officer/summarizer') return <CaseSummarizer />;
  if (path === '/officer/hotspots') return <HotspotMaps />;
  if (path === '/officer/patrol') return <PatrolPlanning />;
  if (path === '/officer/tasks') return <TasksView />;
  if (path === '/officer/field-reports') return <FieldReports />;
  if (path === '/officer/voice') return <VoiceAssistant />;
  if (path === '/officer/copilot') return <OfficerCopilot />;
  if (path === '/officer/reports') return <ReportGeneration />;
  if (path === '/officer/messages') return <OfficerMessages />;
  if (path === '/officer/alerts') return <OfficerAlerts />;
  if (path === '/officer/notifications') return <OfficerNotifications />;
  if (path === '/officer/profile' || path === '/officer/settings') return <OfficerProfile />;
  return <OfficerDashboard />;
}

function OfficerDashboard() {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const myCases = cases.filter((c) => c.assignedOfficerIds.includes(user?.id || ''));
  const myTasks = tasks.filter((t) => t.assigneeId === user?.id || t.assigneeId === 'of_arjun');
  const officerAlerts = alerts.filter((a) => a.scope === 'officer');

  const trendData = crimeTrendMonthly.map((m) => ({
    label: m.month,
    values: { 'Chain Snatching': m.chain_snatching, 'Cyber Fraud': m.cyber_fraud, 'Vehicle Theft': m.vehicle_theft },
  }));

  const crimeDistribution = [
    { label: 'Cyber Fraud', value: 48, color: '#33558f' },
    { label: 'Chain Snatching', value: 23, color: '#1ba89e' },
    { label: 'Vehicle Theft', value: 18, color: '#dca82a' },
    { label: 'Burglary', value: 14, color: '#f04438' },
  ];

  return (
    <PortalLayout role="officer" nav={nav} accent="navy">
      <PageHeader
        title={`Good morning, ${user?.name?.split(' ')[0]}`}
        subtitle={`${user?.rank} · Badge ${user?.badgeId} · ${user?.department}`}
        actions={<Button onClick={() => navigate('/officer/ai-search')}><Sparkles className="h-4 w-4" /> AI Crime Search</Button>}
      />

      {/* KPI cards */}
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active Cases" value={myCases.length} icon={<Briefcase className="h-5 w-5" />} color="navy" trend={{ value: '12%', up: false }} />
        <StatCard label="Pending Evidence" value={evidence.length} icon={<Package className="h-5 w-5" />} color="gold" />
        <StatCard label="Overdue Tasks" value={myTasks.filter((t) => t.status === 'overdue').length} icon={<Clock className="h-5 w-5" />} color="danger" />
        <StatCard label="Active Alerts" value={officerAlerts.length} icon={<Siren className="h-5 w-5" />} color="teal" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* crime trend */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Crime Trend — Last 6 Months" subtitle="By crime type" icon={<FileBarChart className="h-5 w-5" />} />
            <CardBody>
              <LineChart
                data={trendData}
                series={[
                  { key: 'Chain Snatching', label: 'Chain Snatching', color: '#1ba89e' },
                  { key: 'Cyber Fraud', label: 'Cyber Fraud', color: '#33558f' },
                  { key: 'Vehicle Theft', label: 'Vehicle Theft', color: '#dca82a' },
                ]}
              />
            </CardBody>
          </Card>
        </div>
        {/* distribution */}
        <Card>
          <CardHeader title="Crime Distribution" subtitle="This month" />
          <CardBody>
            <DonutChart data={crimeDistribution} />
          </CardBody>
        </Card>
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* my tasks */}
        <div className="lg:col-span-2">
          <SectionTitle action={<Button size="sm" variant="ghost" onClick={() => navigate('/officer/tasks')}>View all</Button>}>Today's Tasks</SectionTitle>
          <Card>
            <CardBody className="space-y-2">
              {myTasks.slice(0, 5).map((t) => (
                <div key={t.id} className="flex items-center gap-3 rounded-lg border border-navy-100 p-3 dark:border-navy-800">
                  <div className={cn('flex h-8 w-8 items-center justify-center rounded-lg', t.status === 'overdue' ? 'bg-danger-100 text-danger-700 dark:bg-danger-500/15 dark:text-danger-400' : t.status === 'done' ? 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400' : 'bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300')}>
                    <ClipboardList className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-navy-900 dark:text-navy-50">{t.title}</p>
                    <p className="text-xs text-navy-500 dark:text-navy-400">Due {formatDate(t.dueAt)}</p>
                  </div>
                  <span className={cn('chip', priorityColors[t.priority])}>{priorityLabels[t.priority]}</span>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
        {/* alerts */}
        <div>
          <SectionTitle>Active Alerts</SectionTitle>
          <div className="space-y-3">
            {officerAlerts.map((a) => (
              <Card key={a.id} className={cn(a.severity === 'critical' && 'border-danger-200 dark:border-danger-500/30')}>
                <CardBody>
                  <div className="flex items-start gap-2.5">
                    <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', a.severity === 'critical' ? 'bg-danger-100 text-danger-700 dark:bg-danger-500/15 dark:text-danger-400' : a.severity === 'warning' ? 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400')}>
                      <Siren className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy-900 dark:text-navy-50">{a.title}</p>
                      <p className="mt-0.5 text-xs text-navy-500 dark:text-navy-400">{a.message}</p>
                    </div>
                  </div>
                </CardBody>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </PortalLayout>
  );
}

function AICrimeSearch() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ReturnType<typeof crimeSearch> | null>(null);
  const [loading, setLoading] = useState(false);
  const { navigate } = useRouter();

  const search = (q?: string) => {
    const queryStr = q || query;
    if (!queryStr.trim()) return;
    setQuery(queryStr);
    setLoading(true);
    setTimeout(() => {
      setResults(crimeSearch(queryStr));
      setLoading(false);
    }, 900);
  };

  const suggestions = [
    'Show chain snatching cases near Whitefield in the last 6 months',
    'Cyber fraud cases this month',
    'Vehicle theft in Hubballi',
  ];

  return (
    <PortalLayout role="officer" nav={nav} accent="navy">
      <PageHeader title="AI Crime Assistant" subtitle="Search across FIRs, suspects, and evidence using natural language" />

      <Card className="mb-6">
        <CardBody>
          <div className="flex items-center gap-2 rounded-2xl border-2 border-navy-200 bg-navy-50/40 p-2 dark:border-navy-700 dark:bg-navy-800/40">
            <Sparkles className="ml-2 h-5 w-5 text-teal-600 dark:text-teal-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && search()}
              placeholder="e.g., Show chain snatching cases near Whitefield in the last 6 months"
              className="flex-1 bg-transparent text-sm text-navy-900 placeholder-navy-400 focus:outline-none dark:text-navy-100"
            />
            <Button size="md" onClick={() => search()} loading={loading}>
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {suggestions.map((s) => (
              <button key={s} onClick={() => search(s)} className="rounded-full border border-navy-200 px-3 py-1 text-xs text-navy-600 transition hover:border-teal-400 hover:text-teal-700 dark:border-navy-700 dark:text-navy-300">
                {s}
              </button>
            ))}
          </div>
        </CardBody>
      </Card>

      {loading && (
        <Card>
          <CardBody>
            <div className="space-y-3">
              <div className="skeleton h-4 w-3/4" />
              <div className="skeleton h-4 w-1/2" />
              <div className="skeleton h-32 w-full" />
            </div>
          </CardBody>
        </Card>
      )}

      {results && !loading && (
        <div className="space-y-6 animate-fade-in">
          {/* AI answer */}
          <Card className="border-teal-200 bg-teal-50/30 dark:border-teal-500/30 dark:bg-teal-500/5">
            <CardBody>
              <div className="flex items-start gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-navy-900 dark:text-navy-50">{results.answer}</p>
                  {/* explainable AI */}
                  <div className="mt-3 rounded-lg bg-white p-3 dark:bg-navy-900">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-teal-700 dark:text-teal-300">Confidence</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-teal-100 dark:bg-teal-500/20">
                        <div className="h-full rounded-full bg-teal-500" style={{ width: `${results.confidence}%` }} />
                      </div>
                      <span className="text-xs font-bold text-teal-700 dark:text-teal-300">{results.confidence}%</span>
                    </div>
                    <div className="mt-2 space-y-1">
                      {results.reasoning.map((r, i) => (
                        <div key={i} className="flex items-start gap-1.5 text-xs text-navy-600 dark:text-navy-300">
                          <span className="mt-0.5 text-teal-600 dark:text-teal-400">✓</span>
                          <span>{r}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardBody>
          </Card>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* matching FIRs */}
            <Card>
              <CardHeader title="Matching FIRs" subtitle={`${results.matchingFirs.length} found`} icon={<FileText className="h-5 w-5" />} />
              <CardBody className="space-y-2">
                {results.matchingFirs.map((f) => (
                  <div key={f.id} className="cursor-pointer rounded-lg border border-navy-100 p-3 transition hover:border-teal-300 dark:border-navy-800" onClick={() => navigate(`/officer/firs/${f.id}`)}>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium text-navy-400">{f.firNumber}</span>
                      <span className={cn('chip', caseStatusColors[f.status])}>{caseStatusLabels[f.status]}</span>
                    </div>
                    <p className="mt-1 text-sm font-medium text-navy-900 dark:text-navy-50">{f.title}</p>
                    <p className="mt-0.5 text-xs text-navy-500 dark:text-navy-400">{crimeTypeIcon[f.crimeType]} {crimeTypeLabels[f.crimeType]} · {f.area} · {formatDate(f.filedAt)}</p>
                  </div>
                ))}
              </CardBody>
            </Card>

            {/* suspects */}
            <Card>
              <CardHeader title="Suspects" subtitle={`${results.suspects.length} identified`} icon={<Users className="h-5 w-5" />} />
              <CardBody className="space-y-2">
                {results.suspects.length === 0 ? (
                  <EmptyState icon={<Users className="h-7 w-7" />} title="No suspects identified" />
                ) : (
                  results.suspects.map((s) => (
                    <div key={s.id} className="flex items-center gap-3 rounded-lg border border-navy-100 p-3 dark:border-navy-800" onClick={() => navigate(`/officer/criminals/${s.id}`)}>
                      <div className={cn('flex h-10 w-10 items-center justify-center rounded-full text-white', s.photoColor)}>
                        <span className="text-sm font-bold">{s.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-navy-900 dark:text-navy-50">{s.name}</p>
                        <p className="text-xs text-navy-500 dark:text-navy-400">{s.casesCount} cases · {s.status}</p>
                      </div>
                      <span className={cn('chip', s.dangerLevel === 'extreme' ? 'bg-danger-100 text-danger-700 dark:bg-danger-500/15 dark:text-danger-400' : s.dangerLevel === 'high' ? 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400' : 'bg-navy-100 text-navy-600 dark:bg-navy-800')}>{s.dangerLevel}</span>
                    </div>
                  ))
                )}
              </CardBody>
            </Card>

            {/* vehicles */}
            <Card>
              <CardHeader title="Vehicles of Interest" subtitle={`${results.vehicles.length} identified`} icon={<Search className="h-5 w-5" />} />
              <CardBody>
                {results.vehicles.length === 0 ? (
                  <EmptyState icon={<Search className="h-7 w-7" />} title="No vehicles identified" />
                ) : (
                  <div className="space-y-2">
                    {results.vehicles.map((v) => (
                      <div key={v} className="flex items-center gap-3 rounded-lg bg-navy-50 p-3 dark:bg-navy-800/50">
                        <span className="font-mono text-sm font-bold text-navy-900 dark:text-navy-50">{v}</span>
                        <Badge className="bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300">Flagged</Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardBody>
            </Card>

            {/* nearby CCTV */}
            <Card>
              <CardHeader title="Nearby CCTV" subtitle="Evidence in area" icon={<Package className="h-5 w-5" />} />
              <CardBody className="space-y-2">
                {results.nearbyCctv.length === 0 ? (
                  <EmptyState icon={<Package className="h-7 w-7" />} title="No CCTV footage linked" />
                ) : (
                  results.nearbyCctv.map((c) => (
                    <div key={c} className="rounded-lg bg-navy-50 p-3 text-sm text-navy-700 dark:bg-navy-800/50 dark:text-navy-200">{c}</div>
                  ))
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      )}
    </PortalLayout>
  );
}

function FIRManagement() {
  const { navigate } = useRouter();
  const { push } = useToast();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const [newFirOpen, setNewFirOpen] = useState(false);
  const [firList, setFirList] = useState(firs);
  const [firTitle, setFirTitle] = useState('');
  const [firCrimeType, setFirCrimeType] = useState('chain_snatching');
  const [firArea, setFirArea] = useState('');
  const [firDesc, setFirDesc] = useState('');
  const [firPriority, setFirPriority] = useState('medium');

  let filtered = firList;
  if (search) filtered = filtered.filter((f) => f.title.toLowerCase().includes(search.toLowerCase()) || f.firNumber.toLowerCase().includes(search.toLowerCase()));
  if (statusFilter !== 'all') filtered = filtered.filter((f) => f.status === statusFilter);

  const createFir = () => {
    if (!firTitle || !firDesc) { push('warning', 'Please fill in all required fields.'); return; }
    const newFir: FIR = {
      id: `fir_${Date.now()}`, firNumber: `FIR/${Math.floor(480 + Math.random() * 99)}/2025`,
      title: firTitle, crimeType: firCrimeType as FIR['crimeType'], status: 'open',
      priority: firPriority as FIR['priority'], district: 'Bengaluru Urban', area: firArea || 'Unknown',
      lat: 12.97, lng: 77.59, filedAt: new Date().toISOString(), complainant: 'Self',
      description: firDesc, stationId: 'st_whitefield', evidenceIds: [], relatedFirIds: [], tags: [],
    };
    setFirList([newFir, ...firList]);
    setNewFirOpen(false); setFirTitle(''); setFirArea(''); setFirDesc('');
    push('success', `FIR ${newFir.firNumber} created successfully.`);
  };

  return (
    <PortalLayout role="officer" nav={nav} accent="navy">
      <PageHeader title="FIR Management" subtitle="View and manage all First Information Reports" actions={<Button onClick={() => setNewFirOpen(true)}><FileText className="h-4 w-4" /> New FIR</Button>} />
      <Modal open={newFirOpen} onClose={() => setNewFirOpen(false)} title="Register New FIR" subtitle="Create a new First Information Report" size="lg"
        footer={<><Button variant="outline" onClick={() => setNewFirOpen(false)}>Cancel</Button><Button onClick={createFir}>Create FIR</Button></>}>
        <div className="space-y-4">
          <Input label="FIR Title" value={firTitle} onChange={(e) => setFirTitle(e.target.value)} placeholder="Brief title of the incident" />
          <div className="grid grid-cols-2 gap-4">
            <Select label="Crime Type" value={firCrimeType} onChange={(e) => setFirCrimeType(e.target.value)} options={Object.entries(crimeTypeLabels).map(([k, v]) => ({ value: k, label: v }))} />
            <Select label="Priority" value={firPriority} onChange={(e) => setFirPriority(e.target.value)} options={[{ value: 'low', label: 'Low' }, { value: 'medium', label: 'Medium' }, { value: 'high', label: 'High' }, { value: 'critical', label: 'Critical' }]} />
          </div>
          <Input label="Area / Locality" value={firArea} onChange={(e) => setFirArea(e.target.value)} placeholder="e.g., Whitefield" />
          <Textarea label="Description" value={firDesc} onChange={(e) => setFirDesc(e.target.value)} placeholder="Describe the incident in detail..." />
        </div>
      </Modal>
      <Card>
        <div className="flex flex-col gap-3 p-4 sm:flex-row">
          <Input icon={<Search className="h-4 w-4" />} placeholder="Search FIR number or title..." value={search} onChange={(e) => setSearch(e.target.value)} className="sm:flex-1" />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} options={[{ value: 'all', label: 'All Status' }, ...Object.entries(caseStatusLabels).map(([k, v]) => ({ value: k, label: v }))]} className="sm:w-48" />
        </div>
        <Table
          columns={[
            { key: 'firNumber', header: 'FIR No.', render: (f: FIR) => <span className="font-mono text-xs font-medium text-navy-700 dark:text-navy-200">{f.firNumber}</span> },
            { key: 'title', header: 'Title', render: (f: FIR) => (
              <div>
                <p className="font-medium text-navy-900 dark:text-navy-50">{f.title}</p>
                <p className="text-xs text-navy-400">{crimeTypeIcon[f.crimeType]} {crimeTypeLabels[f.crimeType]} · {f.area}</p>
              </div>
            ) },
            { key: 'status', header: 'Status', render: (f: FIR) => <span className={cn('chip', caseStatusColors[f.status])}>{caseStatusLabels[f.status]}</span> },
            { key: 'priority', header: 'Priority', render: (f: FIR) => <span className={cn('chip', priorityColors[f.priority])}>{priorityLabels[f.priority]}</span> },
            { key: 'filedAt', header: 'Filed', render: (f: FIR) => <span className="text-xs text-navy-500">{formatDate(f.filedAt)}</span> },
          ]}
          data={filtered}
          onRowClick={(f) => navigate(`/officer/firs/${f.id}`)}
        />
        <Pagination page={page} total={Math.max(1, Math.ceil(filtered.length / 8))} onChange={setPage} />
      </Card>
    </PortalLayout>
  );
}

function FIRDetail({ firId }: { firId: string }) {
  const { navigate } = useRouter();
  const fir = firs.find((f) => f.id === firId);
  if (!fir) return <PortalLayout role="officer" nav={nav} accent="navy"><PageHeader title="FIR Not Found" /><Button onClick={() => navigate('/officer/firs')}>Back to FIRs</Button></PortalLayout>;
  const officer = officers.find((o) => o.id === fir.assignedOfficerId);
  const station = stations.find((s) => s.id === fir.stationId);
  const evs = evidence.filter((e) => fir.evidenceIds.includes(e.id));
  const related = firs.filter((f) => fir.relatedFirIds.includes(f.id));

  return (
    <PortalLayout role="officer" nav={nav} accent="navy">
      <button onClick={() => navigate('/officer/firs')} className="mb-4 flex items-center gap-1.5 text-sm text-navy-500 hover:text-navy-800 dark:text-navy-400">← Back to FIRs</button>
      <PageHeader
        title={fir.title}
        subtitle={`${fir.firNumber} · Filed ${formatDateTime(fir.filedAt)}`}
        actions={
          <div className="flex gap-2">
            <span className={cn('chip', caseStatusColors[fir.status])}>{caseStatusLabels[fir.status]}</span>
            <span className={cn('chip', priorityColors[fir.priority])}>{priorityLabels[fir.priority]}</span>
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Incident Description" icon={<FileText className="h-5 w-5" />} />
            <CardBody>
              <p className="text-sm text-navy-700 dark:text-navy-200">{fir.description}</p>
              <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                <div><p className="text-xs text-navy-400">Crime Type</p><p className="font-medium text-navy-900 dark:text-navy-50">{crimeTypeLabels[fir.crimeType]}</p></div>
                <div><p className="text-xs text-navy-400">Location</p><p className="font-medium text-navy-900 dark:text-navy-50">{fir.area}, {fir.district}</p></div>
                <div><p className="text-xs text-navy-400">Complainant</p><p className="font-medium text-navy-900 dark:text-navy-50">{fir.complainant}</p></div>
                <div><p className="text-xs text-navy-400">Accused</p><p className="font-medium text-navy-900 dark:text-navy-50">{fir.accused || 'Unknown'}</p></div>
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Evidence" subtitle={`${evs.length} items`} icon={<Package className="h-5 w-5" />} />
            <CardBody>
              {evs.length === 0 ? <EmptyState icon={<Package className="h-7 w-7" />} title="No evidence yet" /> : (
                <div className="space-y-2">
                  {evs.map((e) => (
                    <div key={e.id} className="flex items-center gap-3 rounded-lg bg-navy-50 p-3 dark:bg-navy-800/50">
                      <Package className="h-5 w-5 text-navy-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-navy-900 dark:text-navy-50">{e.name}</p>
                        <p className="text-xs text-navy-500 dark:text-navy-400">{e.type} · {formatDate(e.collectedAt)}</p>
                      </div>
                      <span className="chip bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300">{e.status}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
          {related.length > 0 && (
            <Card>
              <CardHeader title="Related FIRs" subtitle="Likely linked by AI" icon={<Network className="h-5 w-5" />} />
              <CardBody className="space-y-2">
                {related.map((r) => (
                  <div key={r.id} className="cursor-pointer rounded-lg border border-navy-100 p-3 hover:border-teal-300 dark:border-navy-800" onClick={() => navigate(`/officer/firs/${r.id}`)}>
                    <p className="text-sm font-medium text-navy-900 dark:text-navy-50">{r.title}</p>
                    <p className="text-xs text-navy-400">{r.firNumber} · {formatDate(r.filedAt)}</p>
                  </div>
                ))}
              </CardBody>
            </Card>
          )}
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader title="Assignment" />
            <CardBody className="space-y-3">
              {officer && (
                <div className="flex items-center gap-3">
                  <Avatar initials={officer.initials} color={officer.avatarColor} />
                  <div>
                    <p className="text-sm font-medium text-navy-900 dark:text-navy-50">{officer.name}</p>
                    <p className="text-xs text-navy-500 dark:text-navy-400">{officer.rank} · {officer.badgeId}</p>
                  </div>
                </div>
              )}
              {station && (
                <div className="rounded-lg bg-navy-50 p-3 dark:bg-navy-800/50">
                  <p className="text-sm font-medium text-navy-900 dark:text-navy-50">{station.name}</p>
                  <p className="text-xs text-navy-500 dark:text-navy-400">{station.phone}</p>
                </div>
              )}
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Tags" />
            <CardBody>
              <div className="flex flex-wrap gap-2">
                {fir.tags.map((t) => <Badge key={t} className="bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300">#{t}</Badge>)}
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Location" />
            <CardBody>
              <MapView markers={[{ id: fir.id, lat: fir.lat, lng: fir.lng, label: fir.area, type: 'incident' }]} height={200} />
            </CardBody>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}

function MyCases() {
  const { user, } = useAuth();
  const { navigate } = useRouter();
  const { push } = useToast();
  const myCases = cases.filter((c) => c.assignedOfficerIds.includes(user?.id || '') || c.assignedOfficerIds.includes('of_arjun'));
  const [tab, setTab] = useState('all');
  const filtered = tab === 'all' ? myCases : myCases.filter((c) => c.status === tab);

  return (
    <PortalLayout role="officer" nav={nav} accent="navy">
      <PageHeader title="My Cases" subtitle="Cases assigned to you" actions={<Button onClick={() => push('info', 'New case creation requires an assigned FIR. Use FIR Management to create one first.')}><Briefcase className="h-4 w-4" /> New Case</Button>} />
      <Card>
        <div className="p-4">
          <Tabs
            tabs={[
              { key: 'all', label: 'All', count: myCases.length },
              { key: 'under_investigation', label: 'Investigating', count: myCases.filter((c) => c.status === 'under_investigation').length },
              { key: 'evidence_collection', label: 'Evidence', count: myCases.filter((c) => c.status === 'evidence_collection').length },
              { key: 'filed_in_court', label: 'In Court', count: myCases.filter((c) => c.status === 'filed_in_court').length },
            ]}
            active={tab}
            onChange={setTab}
          />
        </div>
        <div className="grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <Card key={c.id} className="cursor-pointer transition hover:shadow-card-hover" onClick={() => navigate(`/officer/cases/${c.id}`)}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-medium text-navy-400">{c.caseNumber}</span>
                  <span className={cn('chip', caseStatusColors[c.status])}>{caseStatusLabels[c.status]}</span>
                </div>
                <p className="mt-2 font-display text-sm font-semibold text-navy-900 dark:text-navy-50">{c.title}</p>
                <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">{crimeTypeIcon[c.crimeType]} {crimeTypeLabels[c.crimeType]} · {c.area}</p>
                <div className="mt-3 flex items-center justify-between">
                  <span className={cn('chip', priorityColors[c.priority])}>{priorityLabels[c.priority]}</span>
                  <span className="text-xs text-navy-400">Updated {timeAgo(c.updatedAt)}</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </Card>
    </PortalLayout>
  );
}

function CaseDetail({ caseId }: { caseId: string }) {
  const { navigate } = useRouter();
  const c = cases.find((x) => x.id === caseId);
  if (!c) return <PortalLayout role="officer" nav={nav} accent="navy"><PageHeader title="Case Not Found" /><Button onClick={() => navigate('/officer/cases')}>Back to Cases</Button></PortalLayout>;
  const assignedOfficers = officers.filter((o) => c.assignedOfficerIds.includes(o.id));
  const suspects = criminals.filter((s) => c.suspectIds.includes(s.id));
  const evs = evidence.filter((e) => c.evidenceIds.includes(e.id));

  return (
    <PortalLayout role="officer" nav={nav} accent="navy">
      <button onClick={() => navigate('/officer/cases')} className="mb-4 flex items-center gap-1.5 text-sm text-navy-500 hover:text-navy-800 dark:text-navy-400">← Back to Cases</button>
      <PageHeader
        title={c.title}
        subtitle={`${c.caseNumber} · Opened ${formatDate(c.openedAt)}`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => navigate(`/officer/summarizer?case=${c.id}`)}><Sparkles className="h-4 w-4" /> AI Summarize</Button>
            <span className={cn('chip', caseStatusColors[c.status])}>{caseStatusLabels[c.status]}</span>
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Case Summary" icon={<Briefcase className="h-5 w-5" />} />
            <CardBody><p className="text-sm text-navy-700 dark:text-navy-200">{c.summary}</p></CardBody>
          </Card>
          <Card>
            <CardHeader title="Investigation Timeline" subtitle={`${c.timeline.length} events`} icon={<Clock className="h-5 w-5" />} />
            <CardBody>
              <div className="space-y-4">
                {c.timeline.map((t, i) => (
                  <div key={t.id} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <div className={cn('flex h-8 w-8 items-center justify-center rounded-full text-xs', t.type === 'evidence' ? 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300' : t.type === 'court' ? 'bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-200' : t.type === 'witness' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300' : 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300')}>
                        {i + 1}
                      </div>
                      {i < c.timeline.length - 1 && <div className="my-1 w-px flex-1 bg-navy-200 dark:bg-navy-700" />}
                    </div>
                    <div className="pb-2">
                      <p className="text-sm font-medium text-navy-900 dark:text-navy-50">{t.label}</p>
                      <p className="text-xs text-navy-500 dark:text-navy-400">{t.detail}</p>
                      <p className="text-[10px] text-navy-400">{formatDateTime(t.time)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Evidence" subtitle={`${evs.length} items`} icon={<Package className="h-5 w-5" />} />
            <CardBody>
              {evs.length === 0 ? <EmptyState icon={<Package className="h-7 w-7" />} title="No evidence" /> : (
                <div className="space-y-2">
                  {evs.map((e) => (
                    <div key={e.id} className="flex items-center gap-3 rounded-lg bg-navy-50 p-3 dark:bg-navy-800/50">
                      <Package className="h-5 w-5 text-navy-400" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-navy-900 dark:text-navy-50">{e.name}</p>
                        <p className="text-xs text-navy-500 dark:text-navy-400">{e.type} · {e.status}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Next Steps" subtitle="AI-suggested investigation actions" icon={<Sparkles className="h-5 w-5" />} />
            <CardBody>
              <div className="space-y-2">
                {c.nextSteps.map((s, i) => (
                  <div key={i} className="flex items-start gap-2 rounded-lg bg-teal-50/50 p-3 dark:bg-teal-500/5">
                    <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700 dark:bg-teal-500/20 dark:text-teal-300">{i + 1}</span>
                    <p className="text-sm text-navy-700 dark:text-navy-200">{s}</p>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </div>
        <div className="space-y-6">
          <Card>
            <CardHeader title="Assigned Officers" />
            <CardBody className="space-y-3">
              {assignedOfficers.map((o) => (
                <div key={o.id} className="flex items-center gap-3">
                  <Avatar initials={o.initials} color={o.avatarColor} />
                  <div>
                    <p className="text-sm font-medium text-navy-900 dark:text-navy-50">{o.name}</p>
                    <p className="text-xs text-navy-500 dark:text-navy-400">{o.rank}</p>
                  </div>
                </div>
              ))}
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Suspects" />
            <CardBody className="space-y-2">
              {suspects.map((s) => (
                <div key={s.id} className="cursor-pointer rounded-lg border border-navy-100 p-3 hover:border-teal-300 dark:border-navy-800" onClick={() => navigate(`/officer/criminals/${s.id}`)}>
                  <p className="text-sm font-medium text-navy-900 dark:text-navy-50">{s.name}</p>
                  <p className="text-xs text-navy-500 dark:text-navy-400">{s.status} · {s.dangerLevel} danger</p>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}

function InvestigationTimeline() {
  const { navigate } = useRouter();
  return (
    <PortalLayout role="officer" nav={nav} accent="navy">
      <PageHeader title="Investigation Timeline" subtitle="Auto-reconstructed incident sequences across cases" />
      <div className="space-y-4">
        {cases.map((c) => (
          <Card key={c.id} className="cursor-pointer transition hover:shadow-card-hover" onClick={() => navigate(`/officer/cases/${c.id}`)}>
            <CardHeader title={c.title} subtitle={c.caseNumber} icon={<Clock className="h-5 w-5" />} action={<span className={cn('chip', caseStatusColors[c.status])}>{caseStatusLabels[c.status]}</span>} />
            <CardBody>
              <div className="flex items-center gap-2 overflow-x-auto scrollbar-thin pb-2">
                {c.timeline.map((t, i) => (
                  <div key={t.id} className="flex items-center gap-2">
                    <div className="flex min-w-[160px] flex-col rounded-lg bg-navy-50 p-3 dark:bg-navy-800/50">
                      <p className="text-xs font-semibold text-navy-900 dark:text-navy-50">{t.label}</p>
                      <p className="text-[10px] text-navy-500 dark:text-navy-400">{formatDateTime(t.time)}</p>
                      <p className="mt-1 text-xs text-navy-600 dark:text-navy-300">{t.detail}</p>
                    </div>
                    {i < c.timeline.length - 1 && <div className="text-navy-300 dark:text-navy-600">→</div>}
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </PortalLayout>
  );
}

function EvidenceManagement() {
  const { push } = useToast();
  const [typeFilter, setTypeFilter] = useState('all');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [evList, setEvList] = useState(evidence);
  const [evName, setEvName] = useState('');
  const [evType, setEvType] = useState('photo');
  const [evDesc, setEvDesc] = useState('');
  const filtered = evList.filter((e) => typeFilter === 'all' || e.type === typeFilter);

  const uploadEvidence = () => {
    if (!evName) { push('warning', 'Please provide an evidence name.'); return; }
    const newEv = {
      id: `ev_${Date.now()}`, name: evName, type: evType as any, collectedAt: new Date().toISOString(),
      collectedBy: 'You', description: evDesc, status: 'collected' as const, tags: [],
    };
    setEvList([newEv, ...evList]);
    setUploadOpen(false); setEvName(''); setEvDesc('');
    push('success', 'Evidence uploaded successfully.');
  };

  return (
    <PortalLayout role="officer" nav={nav} accent="navy">
      <PageHeader title="Evidence Management" subtitle="Centralized evidence inventory across all cases" actions={<Button onClick={() => setUploadOpen(true)}><Package className="h-4 w-4" /> Upload Evidence</Button>} />
      <Modal open={uploadOpen} onClose={() => setUploadOpen(false)} title="Upload Evidence" subtitle="Add new evidence to the inventory" size="md"
        footer={<><Button variant="outline" onClick={() => setUploadOpen(false)}>Cancel</Button><Button onClick={uploadEvidence}>Upload</Button></>}>
        <div className="space-y-4">
          <Input label="Evidence Name" value={evName} onChange={(e) => setEvName(e.target.value)} placeholder="e.g., CCTV footage from signal" />
          <Select label="Evidence Type" value={evType} onChange={(e) => setEvType(e.target.value)} options={[{ value: 'cctv', label: 'CCTV' }, { value: 'document', label: 'Document' }, { value: 'photo', label: 'Photo' }, { value: 'audio', label: 'Audio' }, { value: 'weapon', label: 'Weapon' }, { value: 'vehicle', label: 'Vehicle' }, { value: 'phone', label: 'Phone' }, { value: 'statement', label: 'Statement' }, { value: 'forensic', label: 'Forensic' }]} />
          <Textarea label="Description" value={evDesc} onChange={(e) => setEvDesc(e.target.value)} placeholder="Describe the evidence..." />
        </div>
      </Modal>
      <div className="mb-4 flex gap-2">
        {['all', 'cctv', 'document', 'statement', 'forensic', 'vehicle', 'phone'].map((t) => (
          <button key={t} onClick={() => setTypeFilter(t)} className={cn('rounded-full px-3 py-1.5 text-xs font-medium transition', typeFilter === t ? 'bg-navy-700 text-white dark:bg-navy-600' : 'bg-navy-100 text-navy-600 hover:bg-navy-200 dark:bg-navy-800 dark:text-navy-300')}>{t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}</button>
        ))}
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((e) => (
          <Card key={e.id}>
            <CardBody>
              <div className="flex items-start justify-between">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-50 text-navy-700 dark:bg-navy-800 dark:text-navy-200">
                  <Package className="h-5 w-5" />
                </div>
                <span className={cn('chip', e.status === 'analyzed' ? 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300' : e.status === 'in_court' ? 'bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-200' : 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300')}>{e.status}</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-navy-900 dark:text-navy-50">{e.name}</p>
              <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">{e.description}</p>
              <p className="mt-2 text-[10px] text-navy-400">{e.type} · Collected by {e.collectedBy} · {formatDate(e.collectedAt)}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </PortalLayout>
  );
}

function CriminalSearch() {
  const { navigate } = useRouter();
  const [search, setSearch] = useState('');
  const filtered = search ? criminals.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.aliases.some((a) => a.toLowerCase().includes(search.toLowerCase()))) : criminals;
  return (
    <PortalLayout role="officer" nav={nav} accent="navy">
      <PageHeader title="Criminal Profile Search" subtitle="Search criminal records, aliases, and gang affiliations" />
      <div className="mb-4">
        <Input icon={<Search className="h-4 w-4" />} placeholder="Search by name or alias..." value={search} onChange={(e) => setSearch(e.target.value)} />
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <Card key={c.id} className="cursor-pointer transition hover:shadow-card-hover" onClick={() => navigate(`/officer/criminals/${c.id}`)}>
            <CardBody>
              <div className="flex items-start gap-3">
                <div className={cn('flex h-12 w-12 items-center justify-center rounded-xl text-white', c.photoColor)}>
                  <span className="font-bold">{c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</span>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-semibold text-navy-900 dark:text-navy-50">{c.name}</p>
                  <p className="text-xs text-navy-500 dark:text-navy-400">{c.age}y · {c.area}</p>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                <span className={cn('chip', c.status === 'wanted' ? 'bg-danger-100 text-danger-700 dark:bg-danger-500/15 dark:text-danger-400' : c.status === 'in_custody' ? 'bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300' : 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300')}>{c.status.replace('_', ' ')}</span>
                <span className={cn('chip', c.dangerLevel === 'extreme' ? 'bg-danger-100 text-danger-700 dark:bg-danger-500/15 dark:text-danger-400' : 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300')}>{c.dangerLevel}</span>
                <span className="chip bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300">{c.casesCount} cases</span>
              </div>
              {c.gang && <p className="mt-2 text-xs text-navy-400">Gang: {c.gang}</p>}
            </CardBody>
          </Card>
        ))}
      </div>
    </PortalLayout>
  );
}

function CriminalProfile({ criminalId }: { criminalId: string }) {
  const { navigate } = useRouter();
  const c = criminals.find((x) => x.id === criminalId);
  if (!c) return <PortalLayout role="officer" nav={nav} accent="navy"><PageHeader title="Not Found" /><Button onClick={() => navigate('/officer/criminals')}>Back</Button></PortalLayout>;
  const associates = criminals.filter((a) => c.associates.some((as) => as.criminalId === a.id));
  const criminalFirs = firs.filter((f) => c.firIds.includes(f.id));

  return (
    <PortalLayout role="officer" nav={nav} accent="navy">
      <button onClick={() => navigate('/officer/criminals')} className="mb-4 flex items-center gap-1.5 text-sm text-navy-500 hover:text-navy-800 dark:text-navy-400">← Back to Criminals</button>
      <PageHeader
        title={c.name}
        subtitle={`${c.age} years · ${c.gender} · ${c.area}, ${c.district}`}
        actions={
          <div className="flex gap-2">
            <span className={cn('chip', c.status === 'wanted' ? 'bg-danger-100 text-danger-700 dark:bg-danger-500/15 dark:text-danger-400' : 'bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300')}>{c.status.replace('_', ' ')}</span>
            <Button variant="outline" onClick={() => navigate('/officer/network')}><Network className="h-4 w-4" /> View Network</Button>
          </div>
        }
      />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6">
          <Card>
            <CardBody className="flex flex-col items-center text-center">
              <div className={cn('flex h-20 w-20 items-center justify-center rounded-2xl text-white', c.photoColor)}>
                <span className="text-2xl font-bold">{c.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</span>
              </div>
              <p className="mt-3 font-display text-lg font-bold text-navy-900 dark:text-navy-50">{c.name}</p>
              <p className="text-xs text-navy-500 dark:text-navy-400">Aliases: {c.aliases.join(', ')}</p>
              <div className="mt-3 flex flex-wrap justify-center gap-1.5">
                <span className={cn('chip', c.dangerLevel === 'extreme' ? 'bg-danger-100 text-danger-700 dark:bg-danger-500/15 dark:text-danger-400' : 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300')}>{c.dangerLevel} danger</span>
                {c.gang && <span className="chip bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300">{c.gang}</span>}
              </div>
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Known Details" />
            <CardBody className="space-y-3 text-sm">
              <div><p className="text-xs text-navy-400">Vehicles</p>{c.vehicles.length ? c.vehicles.map((v) => <p key={v} className="font-mono font-medium text-navy-900 dark:text-navy-50">{v}</p>) : <p className="text-navy-400">None</p>}</div>
              <div><p className="text-xs text-navy-400">Phone Numbers</p>{c.phones.length ? c.phones.map((p) => <p key={p} className="font-mono font-medium text-navy-900 dark:text-navy-50">{p}</p>) : <p className="text-navy-400">None</p>}</div>
              <div><p className="text-xs text-navy-400">Addresses</p>{c.addresses.map((a) => <p key={a} className="text-navy-700 dark:text-navy-200">{a}</p>)}</div>
            </CardBody>
          </Card>
        </div>
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader title="Notes" icon={<FileText className="h-5 w-5" />} />
            <CardBody><p className="text-sm text-navy-700 dark:text-navy-200">{c.notes}</p></CardBody>
          </Card>
          <Card>
            <CardHeader title="Associated Criminals" subtitle={`${associates.length} linked`} icon={<Users className="h-5 w-5" />} />
            <CardBody className="space-y-2">
              {associates.map((a) => {
                const rel = c.associates.find((as) => as.criminalId === a.id);
                return (
                  <div key={a.id} className="flex items-center gap-3 rounded-lg border border-navy-100 p-3 dark:border-navy-800" onClick={() => navigate(`/officer/criminals/${a.id}`)}>
                    <div className={cn('flex h-8 w-8 items-center justify-center rounded-full text-white', a.photoColor)}><span className="text-xs font-bold">{a.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}</span></div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-navy-900 dark:text-navy-50">{a.name}</p>
                      <p className="text-xs text-navy-500 dark:text-navy-400">{rel?.relation}</p>
                    </div>
                  </div>
                );
              })}
            </CardBody>
          </Card>
          <Card>
            <CardHeader title="Linked FIRs" subtitle={`${criminalFirs.length} cases`} icon={<FileText className="h-5 w-5" />} />
            <CardBody className="space-y-2">
              {criminalFirs.map((f) => (
                <div key={f.id} className="cursor-pointer rounded-lg border border-navy-100 p-3 hover:border-teal-300 dark:border-navy-800" onClick={() => navigate(`/officer/firs/${f.id}`)}>
                  <p className="text-sm font-medium text-navy-900 dark:text-navy-50">{f.title}</p>
                  <p className="text-xs text-navy-400">{f.firNumber} · {formatDate(f.filedAt)}</p>
                </div>
              ))}
            </CardBody>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}

function NetworkGraph() {
  const { navigate } = useRouter();
  // Build a simple SVG network graph
  const nodes = criminals.map((c, i) => {
    const angle = (i / criminals.length) * 2 * Math.PI;
    return { id: c.id, name: c.name, x: 300 + Math.cos(angle) * 180, y: 220 + Math.sin(angle) * 180, color: c.photoColor, status: c.status };
  });
  const edges: { from: string; to: string; label: string }[] = [];
  criminals.forEach((c) => {
    c.associates.forEach((a) => {
      if (criminals.find((cr) => cr.id === a.criminalId)) {
        edges.push({ from: c.id, to: a.criminalId, label: a.relation });
      }
    });
  });

  return (
    <PortalLayout role="officer" nav={nav} accent="navy">
      <PageHeader title="Criminal Relationship Graph" subtitle="AI-mapped network of associates, vehicles, and gangs" />
      <Card>
        <CardBody>
          <svg viewBox="0 0 600 440" className="w-full">
            {/* edges */}
            {edges.map((e, i) => {
              const from = nodes.find((n) => n.id === e.from);
              const to = nodes.find((n) => n.id === e.to);
              if (!from || !to) return null;
              const mx = (from.x + to.x) / 2;
              const my = (from.y + to.y) / 2;
              return (
                <g key={i}>
                  <line x1={from.x} y1={from.y} x2={to.x} y2={to.y} className="stroke-navy-200 dark:stroke-navy-700" strokeWidth={2} />
                  <text x={mx} y={my} textAnchor="middle" className="fill-navy-400 text-[8px]">{e.label.split('—')[0]}</text>
                </g>
              );
            })}
            {/* nodes */}
            {nodes.map((n) => (
              <g key={n.id} className="cursor-pointer" onClick={() => navigate(`/officer/criminals/${n.id}`)}>
                <circle cx={n.x} cy={n.y} r={22} fill="white" className="stroke-navy-300 dark:stroke-navy-600" strokeWidth={2} />
                <circle cx={n.x} cy={n.y} r={18} className={cn(n.color)} />
                <text x={n.x} y={n.y + 2} textAnchor="middle" className="fill-white text-[10px] font-bold">{n.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}</text>
                <text x={n.x} y={n.y + 34} textAnchor="middle" className="fill-navy-700 text-[9px] font-medium dark:fill-navy-200">{n.name.split(' ')[0]}</text>
                {n.status === 'wanted' && <circle cx={n.x + 16} cy={n.y - 16} r={6} className="fill-danger-500" />}
              </g>
            ))}
          </svg>
          <div className="mt-4 flex flex-wrap gap-4 text-xs text-navy-500 dark:text-navy-400">
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-danger-500" />Wanted</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-warning-600" />In custody</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-teal-600" />Active</span>
            <span className="flex items-center gap-1.5"><span className="h-3 w-3 rounded-full bg-gold-600" />Fence</span>
          </div>
        </CardBody>
      </Card>
    </PortalLayout>
  );
}

function CaseSummarizer() {
  const { path } = useRouter();
  const params = new URLSearchParams(path.split('?')[1] || '');
  const [selectedCase, setSelectedCase] = useState(params.get('case') || cases[0].id);
  const [summary, setSummary] = useState<ReturnType<typeof summarizeCase> | null>(null);
  const [loading, setLoading] = useState(false);

  const generate = (caseId?: string) => {
    const id = caseId || selectedCase;
    setSelectedCase(id);
    setLoading(true);
    setSummary(null);
    setTimeout(() => {
      setSummary(summarizeCase(id));
      setLoading(false);
    }, 1200);
  };

  return (
    <PortalLayout role="officer" nav={nav} accent="navy">
      <PageHeader title="AI Case Summarizer" subtitle="Generate structured investigation briefs from case files" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader title="Select Case" icon={<Briefcase className="h-5 w-5" />} />
          <CardBody className="space-y-3">
            <Select label="Case" value={selectedCase} onChange={(e) => setSelectedCase(e.target.value)} options={cases.map((c) => ({ value: c.id, label: `${c.caseNumber} — ${c.title}` }))} />
            <Button className="w-full" onClick={() => generate()} loading={loading}><Sparkles className="h-4 w-4" /> {loading ? 'Generating...' : 'Generate Summary'}</Button>
            <p className="text-xs text-navy-400">The AI analyzes FIRs, evidence, timelines, and suspect data to produce a structured brief.</p>
          </CardBody>
        </Card>
        <div className="lg:col-span-2">
          {loading ? (
            <Card><CardBody><div className="space-y-3"><div className="skeleton h-4 w-3/4" /><div className="skeleton h-4 w-1/2" /><div className="skeleton h-32 w-full" /><div className="skeleton h-4 w-2/3" /></div></CardBody></Card>
          ) : summary ? (
            <div className="space-y-4 animate-fade-in">
              <Card className="border-teal-200 bg-teal-50/30 dark:border-teal-500/30 dark:bg-teal-500/5">
                <CardHeader title="Incident Summary" icon={<Sparkles className="h-5 w-5" />} action={<Badge className="bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300">{summary.confidence}% confidence</Badge>} />
                <CardBody><p className="text-sm text-navy-700 dark:text-navy-200">{summary.incidentSummary}</p></CardBody>
              </Card>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Card>
                  <CardHeader title="Key Persons" />
                  <CardBody className="space-y-2">
                    {summary.keyPersons.map((p, i) => (
                      <div key={i} className="flex items-center justify-between rounded-lg bg-navy-50 p-2.5 dark:bg-navy-800/50">
                        <span className="text-sm font-medium text-navy-900 dark:text-navy-50">{p.name}</span>
                        <span className="text-xs text-navy-500 dark:text-navy-400">{p.role}</span>
                      </div>
                    ))}
                  </CardBody>
                </Card>
                <Card>
                  <CardHeader title="Missing Evidence" />
                  <CardBody className="space-y-2">
                    {summary.missingEvidence.length === 0 ? <p className="text-sm text-success-600 dark:text-success-400">All evidence collected</p> : summary.missingEvidence.map((m, i) => (
                      <div key={i} className="flex items-start gap-2 rounded-lg bg-warning-50/50 p-2.5 dark:bg-warning-500/5">
                        <span className="text-warning-600 dark:text-warning-400">⚠</span>
                        <span className="text-xs text-navy-700 dark:text-navy-200">{m}</span>
                      </div>
                    ))}
                  </CardBody>
                </Card>
              </div>
              <Card>
                <CardHeader title="Timeline" icon={<Clock className="h-5 w-5" />} />
                <CardBody className="space-y-2">
                  {summary.timeline.map((t, i) => (
                    <div key={i} className="flex gap-2 text-sm text-navy-700 dark:text-navy-200">
                      <span className="font-mono text-xs text-navy-400">{i + 1}.</span>
                      <span>{t}</span>
                    </div>
                  ))}
                </CardBody>
              </Card>
              <Card>
                <CardHeader title="Recommended Next Steps" icon={<Sparkles className="h-5 w-5" />} />
                <CardBody className="space-y-2">
                  {summary.nextSteps.map((s, i) => (
                    <div key={i} className="flex items-start gap-2 rounded-lg bg-teal-50/50 p-3 dark:bg-teal-500/5">
                      <span className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-teal-100 text-xs font-bold text-teal-700 dark:bg-teal-500/20 dark:text-teal-300">{i + 1}</span>
                      <p className="text-sm text-navy-700 dark:text-navy-200">{s}</p>
                    </div>
                  ))}
                </CardBody>
              </Card>
            </div>
          ) : (
            <Card><CardBody><EmptyState icon={<Sparkles className="h-7 w-7" />} title="No summary yet" description="Select a case and click Generate Summary." /></CardBody></Card>
          )}
        </div>
      </div>
    </PortalLayout>
  );
}

function HotspotMaps() {
  const [selected, setSelected] = useState(hotspots[0]);
  const markers = hotspots.map((h) => ({ id: h.id, lat: h.lat, lng: h.lng, label: h.area, type: 'hotspot' as const, riskScore: h.riskScore }));
  return (
    <PortalLayout role="officer" nav={nav} accent="navy">
      <PageHeader title="AI Hotspot Prediction" subtitle="Predicted high-risk areas for proactive patrol deployment" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardBody>
              <MapView markers={markers} height={420} showRisk onMarkerClick={(m) => setSelected(hotspots.find((h) => h.id === m.id) || hotspots[0])} />
            </CardBody>
          </Card>
        </div>
        <div className="space-y-3">
          {hotspots.sort((a, b) => b.riskScore - a.riskScore).map((h) => (
            <Card key={h.id} className={cn('cursor-pointer transition', selected?.id === h.id && 'border-teal-400 ring-2 ring-teal-500/20')} onClick={() => setSelected(h)}>
              <CardBody>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-navy-900 dark:text-navy-50">{h.area}</p>
                  <span className={cn('text-lg font-bold', riskColor(h.riskScore))}>{h.riskScore}%</span>
                </div>
                <p className="text-xs text-navy-500 dark:text-navy-400">{h.district} · {h.predictedWindow}</p>
                <div className="mt-2 flex items-center gap-2">
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-navy-100 dark:bg-navy-800">
                    <div className={cn('h-full rounded-full', riskBg(h.riskScore))} style={{ width: `${h.riskScore}%` }} />
                  </div>
                  <span className={cn('text-xs', h.trend === 'up' ? 'text-danger-600 dark:text-danger-400' : h.trend === 'down' ? 'text-success-600 dark:text-success-400' : 'text-navy-400')}>{h.trend === 'up' ? '↑' : h.trend === 'down' ? '↓' : '→'}</span>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
      {selected && (
        <Card className="mt-6">
          <CardHeader title={selected.area} subtitle={selected.predictedWindow} icon={<MapPin className="h-5 w-5" />} action={<span className={cn('text-2xl font-bold', riskColor(selected.riskScore))}>{selected.riskScore}%</span>} />
          <CardBody>
            <SectionTitle>Contributing Factors</SectionTitle>
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              {selected.factors.map((f, i) => (
                <div key={i} className="flex items-center gap-2 rounded-lg bg-navy-50 p-3 text-sm text-navy-700 dark:bg-navy-800/50 dark:text-navy-200">
                  <span className="text-teal-600 dark:text-teal-400">✓</span>{f}
                </div>
              ))}
            </div>
            <SectionTitle>Predicted Crime Types</SectionTitle>
            <div className="flex flex-wrap gap-2">
              {selected.crimeTypes.map((t) => <Badge key={t} className="bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300">{crimeTypeLabels[t]}</Badge>)}
            </div>
          </CardBody>
        </Card>
      )}
    </PortalLayout>
  );
}

function PatrolPlanning() {
  const { push } = useToast();
  const topHotspots = hotspots.sort((a, b) => b.riskScore - a.riskScore).slice(0, 3);
  return (
    <PortalLayout role="officer" nav={nav} accent="navy">
      <PageHeader title="Patrol Planning" subtitle="AI-recommended patrol routes based on hotspot predictions" actions={<Button onClick={() => push('success', 'Patrol plan deployed to all units.')}><ClipboardList className="h-4 w-4" /> Deploy Plan</Button>} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="Recommended Patrols" subtitle="Based on tonight's hotspot predictions" icon={<MapPin className="h-5 w-5" />} />
          <CardBody className="space-y-3">
            {topHotspots.map((h, i) => (
              <div key={h.id} className="rounded-lg border border-navy-100 p-4 dark:border-navy-800">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-navy-900 dark:text-navy-50">Patrol Unit {i + 1}</p>
                  <span className={cn('chip', h.riskScore >= 75 ? 'bg-danger-100 text-danger-700 dark:bg-danger-500/15 dark:text-danger-400' : 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300')}>{h.riskScore}% risk</span>
                </div>
                <p className="mt-1 text-sm text-navy-700 dark:text-navy-200">Area: {h.area}, {h.district}</p>
                <p className="text-xs text-navy-500 dark:text-navy-400">Window: {h.predictedWindow}</p>
                <div className="mt-2 flex items-center gap-2">
                  <span className="text-xs text-navy-400">Crime types:</span>
                  {h.crimeTypes.map((t) => <span key={t} className="chip bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300">{crimeTypeLabels[t]}</span>)}
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Patrol Map" />
          <CardBody>
            <MapView markers={topHotspots.map((h) => ({ id: h.id, lat: h.lat, lng: h.lng, label: h.area, type: 'hotspot', riskScore: h.riskScore }))} height={400} showRisk />
          </CardBody>
        </Card>
      </div>
    </PortalLayout>
  );
}

function TasksView() {
  const { user } = useAuth();
  const myTasks = tasks.filter((t) => t.assigneeId === user?.id || t.assigneeId === 'of_arjun');
  return (
    <PortalLayout role="officer" nav={nav} accent="navy">
      <PageHeader title="Tasks" subtitle="Assigned investigation and patrol tasks" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {myTasks.map((t) => (
          <Card key={t.id}>
            <CardBody>
              <div className="flex items-center justify-between">
                <span className={cn('chip', t.status === 'overdue' ? 'bg-danger-100 text-danger-700 dark:bg-danger-500/15 dark:text-danger-400' : t.status === 'done' ? 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400' : t.status === 'in_progress' ? 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300' : 'bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300')}>{t.status.replace('_', ' ')}</span>
                <span className={cn('chip', priorityColors[t.priority])}>{priorityLabels[t.priority]}</span>
              </div>
              <p className="mt-2 text-sm font-semibold text-navy-900 dark:text-navy-50">{t.title}</p>
              <p className="mt-1 text-xs text-navy-500 dark:text-navy-400">{t.description}</p>
              <p className="mt-2 text-xs text-navy-400">Due {formatDate(t.dueAt)}</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </PortalLayout>
  );
}

function FieldReports() {
  const { push } = useToast();
  const [reports, setReports] = useState<{ id: string; title: string; area: string; date: string; status: string }[]>([
    { id: 'fr_1', title: 'Night patrol — Whitefield', area: 'Kadugodi', date: '2025-12-24', status: 'submitted' },
  ]);
  const [title, setTitle] = useState('');
  const [area, setArea] = useState('');
  const [body, setBody] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title) { push('warning', 'Please add a report title.'); return; }
    setReports([{ id: `fr_${Date.now()}`, title, area, date: new Date().toISOString().slice(0, 10), status: 'submitted' }, ...reports]);
    setTitle(''); setArea(''); setBody('');
    push('success', 'Field report submitted.');
  };

  return (
    <PortalLayout role="officer" nav={nav} accent="navy">
      <PageHeader title="Field Reports" subtitle="Submit and track field investigation reports" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="New Field Report" icon={<FileText className="h-5 w-5" />} />
          <CardBody className="space-y-4">
            <Input label="Report Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="e.g., Night patrol — Whitefield" />
            <Input label="Area" value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g., Kadugodi" />
            <Textarea label="Report Body" value={body} onChange={(e) => setBody(e.target.value)} placeholder="Describe observations, incidents, actions taken..." />
            <Button onClick={submit} className="w-full">Submit Report</Button>
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Submitted Reports" subtitle={`${reports.length} total`} />
          <CardBody className="space-y-3">
            {reports.map((r) => (
              <div key={r.id} className="flex items-center justify-between rounded-lg bg-navy-50 p-3 dark:bg-navy-800/50">
                <div>
                  <p className="text-sm font-semibold text-navy-900 dark:text-navy-50">{r.title}</p>
                  <p className="text-xs text-navy-500 dark:text-navy-400">{r.area} · {formatDate(r.date)}</p>
                </div>
                <span className="chip bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300">{r.status}</span>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </PortalLayout>
  );
}

function VoiceAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [listening, setListening] = useState(false);

  const send = (q: string) => {
    setMessages((m) => [...m, makeChatMessage('user', q)]);
    setLoading(true);
    setTimeout(() => {
      const res = copilotAnswer(q);
      setMessages((m) => [...m, makeChatMessage('assistant', res.content, { reasoning: res.reasoning, confidence: res.confidence })]);
      setLoading(false);
    }, 800);
  };

  return (
    <PortalLayout role="officer" nav={nav} accent="navy">
      <PageHeader title="Voice Assistant" subtitle="Hands-free queries in Kannada and English" />
      <div className="mb-4 flex justify-center">
        <button onClick={() => { setListening(!listening); if (!listening) { setTimeout(() => { send("Last week's robbery cases"); setListening(false); }, 2000); } }} className={cn('flex h-20 w-20 items-center justify-center rounded-full text-white transition', listening ? 'bg-danger-600 animate-pulse-soft' : 'bg-navy-700 hover:bg-navy-800')}>
          <Mic className="h-8 w-8" />
        </button>
      </div>
      <p className="mb-4 text-center text-sm text-navy-500 dark:text-navy-400">{listening ? 'Listening... (demo — will auto-submit a sample query)' : 'Tap to speak'}</p>
      <div style={{ height: 'calc(100vh - 22rem)' }}>
        <ChatPanel
          title="Voice Assistant"
          subtitle="Kannada + English · AI-powered"
          placeholder="Type or speak your query..."
          messages={messages}
          onSend={send}
          loading={loading}
          accent="navy"
          voice
          suggestions={['Last week\'s robbery cases', 'How many cyber frauds this month?', 'Create briefing for SP']}
        />
      </div>
    </PortalLayout>
  );
}

function OfficerCopilot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const send = (q: string) => {
    setMessages((m) => [...m, makeChatMessage('user', q)]);
    setLoading(true);
    setTimeout(() => {
      const res = copilotAnswer(q);
      setMessages((m) => [...m, makeChatMessage('assistant', res.content, { reasoning: res.reasoning, confidence: res.confidence })]);
      setLoading(false);
    }, 800);
  };

  return (
    <PortalLayout role="officer" nav={nav} accent="navy">
      <PageHeader title="Officer Copilot" subtitle="Your AI assistant for case queries and briefing generation" />
      <div style={{ height: 'calc(100vh - 12rem)' }}>
        <ChatPanel
          title="Officer Copilot"
          subtitle="ChatGPT for Police · AI-powered"
          placeholder="Ask about cases, generate briefings, get recommendations..."
          messages={messages}
          onSend={send}
          loading={loading}
          accent="navy"
          suggestions={['How many cyber frauds this month?', 'Create briefing for SP', 'Where should I deploy patrols tonight?', 'How many active cases?']}
        />
      </div>
    </PortalLayout>
  );
}

function ReportGeneration() {
  const { push } = useToast();
  const [reportType, setReportType] = useState('daily');

  const generate = () => {
    const content = `KSP ${reportType.toUpperCase()} REPORT\n${'='.repeat(40)}\nDate: ${formatDate(new Date().toISOString())}\n\nACTIVE CASES: ${cases.length}\nUNDER INVESTIGATION: ${cases.filter((c) => c.status === 'under_investigation').length}\nCRITICAL: ${cases.filter((c) => c.priority === 'critical').length}\n\nHOTSPOTS:\n${hotspots.map((h) => `- ${h.area}: ${h.riskScore}% risk`).join('\n')}\n\nWANTED:\n${criminals.filter((c) => c.status === 'wanted').map((c) => `- ${c.name} (${c.dangerLevel})`).join('\n')}\n\nRECOMMENDATIONS:\n- Deploy patrols to Kadugodi Signal (88% risk)\n- Execute warrant on Ravi Kalla\n- Freeze remaining UPI mule accounts\n`;
    downloadText(`KSP_${reportType}_report_${new Date().toISOString().slice(0, 10)}.txt`, content);
    push('success', 'Report generated and downloaded.');
  };

  return (
    <PortalLayout role="officer" nav={nav} accent="navy">
      <PageHeader title="Report Generation" subtitle="One-click auto-generated reports with charts and recommendations" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardHeader title="Generate Report" icon={<FileBarChart className="h-5 w-5" />} />
          <CardBody className="space-y-4">
            <Select label="Report Type" value={reportType} onChange={(e) => setReportType(e.target.value)} options={[
              { value: 'daily', label: 'Daily Report' },
              { value: 'weekly', label: 'Weekly Report' },
              { value: 'monthly', label: 'Monthly Report' },
              { value: 'briefing', label: 'SP Briefing' },
            ]} />
            <Button className="w-full" onClick={generate}><FileBarChart className="h-4 w-4" /> Generate & Download</Button>
          </CardBody>
        </Card>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Report Preview" subtitle={`${reportType} report`} />
            <CardBody>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                  <StatCard label="Active Cases" value={cases.length} icon={<Briefcase className="h-5 w-5" />} color="navy" />
                  <StatCard label="Critical" value={cases.filter((c) => c.priority === 'critical').length} icon={<Siren className="h-5 w-5" />} color="danger" />
                  <StatCard label="Wanted" value={criminals.filter((c) => c.status === 'wanted').length} icon={<Users className="h-5 w-5" />} color="gold" />
                  <StatCard label="Hotspots" value={hotspots.filter((h) => h.riskScore >= 70).length} icon={<MapPin className="h-5 w-5" />} color="teal" />
                </div>
                <Card className="surface-muted">
                  <CardBody>
                    <SectionTitle>Crime Trend</SectionTitle>
                    <BarChart data={crimeTrendMonthly.map((m) => ({ label: m.month, value: m.chain_snatching + m.robbery + m.cyber_fraud + m.vehicle_theft + m.burglary }))} />
                  </CardBody>
                </Card>
                <Card className="surface-muted">
                  <CardBody>
                    <SectionTitle>Top Hotspots</SectionTitle>
                    <div className="space-y-2">
                      {hotspots.sort((a, b) => b.riskScore - a.riskScore).slice(0, 3).map((h) => (
                        <div key={h.id} className="flex items-center justify-between text-sm">
                          <span className="text-navy-700 dark:text-navy-200">{h.area}</span>
                          <span className={cn('font-bold', riskColor(h.riskScore))}>{h.riskScore}%</span>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}

function OfficerMessages() {
  const [selected, setSelected] = useState(messages[0]);
  const [reply, setReply] = useState('');
  const { push } = useToast();
  const [allMsgs, setAllMsgs] = useState(messages);

  const send = () => {
    if (!reply.trim()) return;
    setAllMsgs([...allMsgs, { id: `ms_${Date.now()}`, fromId: 'me', fromName: 'You', toId: selected.fromId, toName: selected.fromName, body: reply, at: new Date().toISOString(), read: true }]);
    setReply('');
    push('success', 'Message sent.');
  };

  const conversations = [...new Set(allMsgs.map((m) => m.fromName))];

  return (
    <PortalLayout role="officer" nav={nav} accent="navy">
      <PageHeader title="Officer Communication" subtitle="Secure messaging with fellow officers" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3" style={{ height: 'calc(100vh - 12rem)' }}>
        <Card className="overflow-hidden">
          <CardHeader title="Conversations" />
          <CardBody className="space-y-2 p-3">
            {conversations.map((name) => (
              <button key={name} onClick={() => setSelected(allMsgs.find((m) => m.fromName === name) || allMsgs[0])} className={cn('flex w-full items-center gap-3 rounded-lg p-3 text-left transition', selected?.fromName === name ? 'bg-navy-100 dark:bg-navy-800' : 'hover:bg-navy-50 dark:hover:bg-navy-800/50')}>
                <Avatar initials={name.split(' ').map((n) => n[0]).join('')} color="bg-navy-600" size="sm" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-navy-900 dark:text-navy-50">{name}</p>
                  <p className="text-xs text-navy-400">{allMsgs.filter((m) => m.fromName === name).length} messages</p>
                </div>
              </button>
            ))}
          </CardBody>
        </Card>
        <div className="lg:col-span-2">
          <Card className="flex flex-col overflow-hidden">
            <CardHeader title={selected?.fromName} subtitle="Secure channel" />
            <div className="flex-1 space-y-3 overflow-y-auto scrollbar-thin p-4">
              {allMsgs.filter((m) => m.fromName === selected?.fromName || m.toName === selected?.fromName).map((m) => (
                <div key={m.id} className={cn('flex', m.fromId === 'me' ? 'justify-end' : 'justify-start')}>
                  <div className={cn('max-w-[75%] rounded-2xl px-4 py-2.5 text-sm', m.fromId === 'me' ? 'bg-navy-700 text-white' : 'surface-muted text-navy-800 dark:text-navy-100')}>
                    {m.body}
                    <p className={cn('mt-1 text-[10px]', m.fromId === 'me' ? 'text-navy-200' : 'text-navy-400')}>{timeAgo(m.at)}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="border-t border-navy-100 p-3 dark:border-navy-800">
              <div className="flex gap-2">
                <input value={reply} onChange={(e) => setReply(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && send()} placeholder="Type a message..." className="input-base" />
                <Button onClick={send}>Send</Button>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}

function OfficerAlerts() {
  const officerAlerts = alerts.filter((a) => a.scope === 'officer');
  return (
    <PortalLayout role="officer" nav={nav} accent="navy">
      <PageHeader title="Alerts" subtitle="Active operational alerts and wanted notices" />
      <div className="space-y-4">
        {officerAlerts.map((a) => (
          <Card key={a.id} className={cn(a.severity === 'critical' && 'border-danger-200 dark:border-danger-500/30')}>
            <CardBody className="flex items-start gap-3">
              <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl', a.severity === 'critical' ? 'bg-danger-100 text-danger-700 dark:bg-danger-500/15 dark:text-danger-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400')}>
                <Siren className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-display text-base font-semibold text-navy-900 dark:text-navy-50">{a.title}</p>
                <p className="mt-1 text-sm text-navy-600 dark:text-navy-300">{a.message}</p>
                <p className="mt-1 text-xs text-navy-400">{a.area || 'Statewide'} · {timeAgo(a.createdAt)}</p>
              </div>
              <span className={cn('chip', a.severity === 'critical' ? 'bg-danger-100 text-danger-700 dark:bg-danger-500/15 dark:text-danger-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400')}>{a.severity}</span>
            </CardBody>
          </Card>
        ))}
      </div>
    </PortalLayout>
  );
}

function OfficerNotifications() {
  const officerNotifs = [...notifications.filter((n) => n.scope === 'officer'), ...alerts.filter((a) => a.scope === 'officer').map((a) => ({ id: a.id, title: a.title, message: a.message, type: a.severity, scope: 'officer' as const, createdAt: a.createdAt, read: a.read }))];
  return (
    <PortalLayout role="officer" nav={nav} accent="navy">
      <PageHeader title="Notifications" subtitle="System and case updates" />
      <div className="space-y-3">
        {officerNotifs.map((n) => (
          <Card key={n.id}>
            <CardBody className="flex items-start gap-3">
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', n.type === 'success' ? 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400' : n.type === 'warning' ? 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400' : n.type === 'critical' || n.type === 'error' ? 'bg-danger-100 text-danger-700 dark:bg-danger-500/15 dark:text-danger-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400')}>
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-navy-900 dark:text-navy-50">{n.title}</p>
                <p className="mt-0.5 text-xs text-navy-500 dark:text-navy-400">{n.message}</p>
                <p className="mt-1 text-[10px] text-navy-400">{timeAgo(n.createdAt)}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </PortalLayout>
  );
}

function OfficerProfile() {
  const { user } = useAuth();
  const { push } = useToast();
  if (!user) return null;
  const officer = officers.find((o) => o.id === user.id);
  return (
    <PortalLayout role="officer" nav={nav} accent="navy">
      <PageHeader title="Officer Profile" subtitle="Your service record and settings" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardBody className="flex flex-col items-center text-center">
            <Avatar initials={user.initials} color={user.avatarColor} size="lg" />
            <p className="mt-3 font-display text-lg font-bold text-navy-900 dark:text-navy-50">{user.name}</p>
            <p className="text-sm text-navy-500 dark:text-navy-400">{user.rank} · {user.badgeId}</p>
            <div className="mt-3 flex gap-2">
              {officer && <><span className="chip bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300">{officer.casesSolved} Solved</span><span className="chip bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300">{officer.casesOpen} Active</span></>}
            </div>
          </CardBody>
        </Card>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Service Information" />
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Full Name" defaultValue={user.name} />
                <Input label="Rank" defaultValue={user.rank} />
                <Input label="Badge ID" defaultValue={user.badgeId} readOnly />
                <Input label="Email" defaultValue={user.email} />
                <Input label="Phone" defaultValue={user.phone} />
                <Input label="District" defaultValue={user.district} />
              </div>
              <Button onClick={() => push('success', 'Profile updated successfully.')}>Save Changes</Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
