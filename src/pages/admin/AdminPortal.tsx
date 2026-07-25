import { useState } from 'react';
import {
  LayoutDashboard, Users, Shield, Building2, Network, Cpu, Lock,
  ScrollText, Activity, Server, Bell, FileBarChart, Settings,
  MessageSquare, AlertTriangle, Package, Gauge, User,
} from 'lucide-react';
import { PortalLayout } from '@/components/PortalLayout';
import { Card, CardBody, CardHeader, PageHeader, StatCard, SectionTitle, EmptyState, Badge } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select, Avatar, Tabs } from '@/components/ui/Form';
import { Table, Pagination } from '@/components/ui/Table';
import { BarChart, DonutChart, LineChart, Sparkline } from '@/components/ui/Charts';
import { Modal, ConfirmDialog } from '@/components/ui/Modal';
import { useToast } from '@/context/ToastContext';
import {
  officers, citizens, stations, districtStats, auditLogs, systemHealth,
  aiModels, notifications, alerts, complaints, firs, cases,
  crimeTrendMonthly,
} from '@/data/mock';
import {
  formatDate, formatDateTime, timeAgo, cn, caseStatusColors, caseStatusLabels, downloadText,
} from '@/lib/format';
import type { Role } from '@/types';

const nav = [
  { label: 'Dashboard', path: '/admin', icon: LayoutDashboard },
  { label: 'User Management', path: '/admin/users', icon: Users },
  { label: 'Officer Management', path: '/admin/officers', icon: Shield },
  { label: 'Department Hierarchy', path: '/admin/departments', icon: Network },
  { label: 'Police Stations', path: '/admin/stations', icon: Building2 },
  { label: 'District Analytics', path: '/admin/analytics', icon: FileBarChart },
  { label: 'AI Model Management', path: '/admin/ai-models', icon: Cpu },
  { label: 'Roles & Permissions', path: '/admin/roles', icon: Lock },
  { label: 'Audit Logs', path: '/admin/audit', icon: ScrollText },
  { label: 'Security Monitoring', path: '/admin/security', icon: AlertTriangle },
  { label: 'System Health', path: '/admin/system', icon: Activity },
  { label: 'API Management', path: '/admin/api', icon: Server },
  { label: 'Notifications', path: '/admin/notifications', icon: Bell },
  { label: 'Reports', path: '/admin/reports', icon: FileBarChart },
  { label: 'Escalations', path: '/admin/escalations', icon: AlertTriangle },
  { label: 'Feedback', path: '/admin/feedback', icon: MessageSquare },
  { label: 'Resources', path: '/admin/resources', icon: Package },
  { label: 'Settings', path: '/admin/settings', icon: Settings },
  { label: 'Profile', path: '/admin/profile', icon: User },
];

export function AdminPortal() {
  const { path } = useRouter();
  if (path === '/admin' || path === '/admin/') return <AdminDashboard />;
  if (path === '/admin/users') return <UserManagement />;
  if (path === '/admin/officers') return <OfficerManagement />;
  if (path === '/admin/departments') return <DepartmentHierarchy />;
  if (path === '/admin/stations') return <StationManagement />;
  if (path === '/admin/analytics') return <DistrictAnalytics />;
  if (path === '/admin/ai-models') return <AIModelManagement />;
  if (path === '/admin/roles') return <RolesPermissions />;
  if (path === '/admin/audit') return <AuditLogs />;
  if (path === '/admin/security') return <SecurityMonitoring />;
  if (path === '/admin/system') return <SystemHealth />;
  if (path === '/admin/api') return <APIManagement />;
  if (path === '/admin/notifications') return <AdminNotifications />;
  if (path === '/admin/reports') return <AdminReports />;
  if (path === '/admin/escalations') return <Escalations />;
  if (path === '/admin/feedback') return <FeedbackManagement />;
  if (path === '/admin/resources') return <ResourceAllocation />;
  if (path === '/admin/settings' || path === '/admin/profile') return <AdminProfile />;
  return <AdminDashboard />;
}

import { useRouter } from '@/router';
import { useAuth } from '@/context/AuthContext';

function AdminDashboard() {
  const { user } = useAuth();
  const { push } = useToast();
  const totalCases = districtStats.reduce((s, d) => s + d.cases, 0);
  const totalSolved = districtStats.reduce((s, d) => s + d.solved, 0);
  const totalOfficers = districtStats.reduce((s, d) => s + d.officers, 0);
  const totalStations = districtStats.reduce((s, d) => s + d.stations, 0);

  const trendData = crimeTrendMonthly.map((m) => ({
    label: m.month,
    values: { 'Total Crime': m.chain_snatching + m.robbery + m.cyber_fraud + m.vehicle_theft + m.burglary },
  }));

  const districtDist = districtStats.map((d, i) => ({ label: d.district.split(' ')[0], value: d.cases, color: ['#33558f', '#1ba89e', '#dca82a', '#f04438', '#12b157'][i] }));

  return (
    <PortalLayout role="admin" nav={nav} accent="gold">
      <PageHeader title="Platform Dashboard" subtitle={`${user?.rank} · State HQ · ${user?.name}`} actions={<Button variant="gold" onClick={() => { downloadText(`KSP_dashboard_report_${new Date().toISOString().slice(0, 10)}.txt`, `KSP DASHBOARD REPORT\n${'='.repeat(40)}\nTotal Cases: ${totalCases}\nSolved: ${totalSolved}\nOfficers: ${totalOfficers}\nStations: ${totalStations}\n`); push('success', 'Report exported and downloaded.'); }}><FileBarChart className="h-4 w-4" /> Export Report</Button>} />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Cases" value={totalCases.toLocaleString('en-IN')} icon={<FileBarChart className="h-5 w-5" />} color="navy" trend={{ value: '8%', up: true }} />
        <StatCard label="Cases Solved" value={totalSolved.toLocaleString('en-IN')} icon={<Shield className="h-5 w-5" />} color="success" trend={{ value: '12%', up: true }} />
        <StatCard label="Active Officers" value={totalOfficers} icon={<Users className="h-5 w-5" />} color="teal" />
        <StatCard label="Police Stations" value={totalStations} icon={<Building2 className="h-5 w-5" />} color="gold" />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Statewide Crime Trend" subtitle="Last 6 months" icon={<Activity className="h-5 w-5" />} />
            <CardBody>
              <LineChart data={trendData} series={[{ key: 'Total Crime', label: 'Total Crime', color: '#33558f' }]} />
            </CardBody>
          </Card>
        </div>
        <Card>
          <CardHeader title="Cases by District" />
          <CardBody><DonutChart data={districtDist} /></CardBody>
        </Card>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader title="System Health" subtitle="Live platform status" icon={<Activity className="h-5 w-5" />} />
          <CardBody className="space-y-2">
            {systemHealth.map((s) => (
              <div key={s.service} className="flex items-center justify-between rounded-lg bg-navy-50 p-3 dark:bg-navy-800/50">
                <div className="flex items-center gap-2">
                  <span className={cn('h-2 w-2 rounded-full', s.status === 'operational' ? 'bg-success-500' : 'bg-warning-500')} />
                  <span className="text-sm font-medium text-navy-900 dark:text-navy-50">{s.service}</span>
                </div>
                <div className="flex items-center gap-3 text-xs text-navy-500 dark:text-navy-400">
                  <span>{s.uptime}%</span>
                  <span>{s.latency}ms</span>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Recent Activity" subtitle="Latest audit events" icon={<ScrollText className="h-5 w-5" />} />
          <CardBody className="space-y-2">
            {auditLogs.slice(0, 5).map((a) => (
              <div key={a.id} className="flex items-start gap-2.5 rounded-lg p-2.5">
                <div className={cn('flex h-7 w-7 items-center justify-center rounded-lg', a.severity === 'critical' ? 'bg-danger-100 text-danger-700 dark:bg-danger-500/15 dark:text-danger-400' : a.severity === 'warning' ? 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400' : 'bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300')}>
                  <Activity className="h-3.5 w-3.5" />
                </div>
                <div className="flex-1">
                  <p className="text-sm text-navy-800 dark:text-navy-100">{a.action}</p>
                  <p className="text-xs text-navy-400">{a.target} · {timeAgo(a.createdAt)}</p>
                </div>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </PortalLayout>
  );
}

function UserManagement() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const { push } = useToast();
  const filtered = citizens.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));
  return (
    <PortalLayout role="admin" nav={nav} accent="gold">
      <PageHeader title="User Management" subtitle="Manage citizen accounts and access" actions={<Button variant="gold" onClick={() => push('info', 'User creation form will open in a future update. For now, citizens self-register via the login page.')}><Users className="h-4 w-4" /> Add User</Button>} />
      <Card>
        <div className="p-4">
          <Input icon={<Users className="h-4 w-4" />} placeholder="Search users by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Table
          columns={[
            { key: 'name', header: 'Name', render: (u) => (
              <div className="flex items-center gap-3">
                <Avatar initials={u.initials} color={u.avatarColor} size="sm" />
                <div><p className="font-medium text-navy-900 dark:text-navy-50">{u.name}</p><p className="text-xs text-navy-400">{u.email}</p></div>
              </div>
            ) },
            { key: 'phone', header: 'Phone', render: (u) => <span className="text-sm text-navy-600 dark:text-navy-300">{u.phone}</span> },
            { key: 'area', header: 'Location', render: (u) => <span className="text-sm text-navy-600 dark:text-navy-300">{u.area}, {u.district}</span> },
            { key: 'complaints', header: 'Complaints', render: (u) => <span className="font-semibold text-navy-900 dark:text-navy-50">{u.complaints}</span> },
            { key: 'joinedAt', header: 'Joined', render: (u) => <span className="text-xs text-navy-500">{formatDate(u.joinedAt)}</span> },
            { key: 'status', header: 'Status', render: () => <span className="chip bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-300">Active</span> },
          ]}
          data={filtered}
        />
        <Pagination page={page} total={Math.max(1, Math.ceil(filtered.length / 8))} onChange={setPage} />
      </Card>
    </PortalLayout>
  );
}

function OfficerManagement() {
  const { push } = useToast();
  const [search, setSearch] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const filtered = officers.filter((o) => o.name.toLowerCase().includes(search.toLowerCase()) || o.badgeId.toLowerCase().includes(search.toLowerCase()));
  const [officerList, setOfficerList] = useState(officers);

  const toggleStatus = (id: string) => {
    setOfficerList((list) => list.map((o) => o.id === id ? { ...o, status: o.status === 'active' ? 'suspended' : 'active' } : o));
    push('info', 'Officer status updated.');
  };

  return (
    <PortalLayout role="admin" nav={nav} accent="gold">
      <PageHeader title="Officer Management" subtitle="Manage officer accounts, ranks, and assignments" actions={<Button variant="gold" onClick={() => setAddOpen(true)}><Shield className="h-4 w-4" /> Add Officer</Button>} />
      <Card>
        <div className="p-4">
          <Input icon={<Shield className="h-4 w-4" />} placeholder="Search by name or badge ID..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Table
          columns={[
            { key: 'name', header: 'Officer', render: (o) => (
              <div className="flex items-center gap-3">
                <Avatar initials={o.initials} color={o.avatarColor} size="sm" />
                <div><p className="font-medium text-navy-900 dark:text-navy-50">{o.name}</p><p className="text-xs text-navy-400">{o.rank} · {o.badgeId}</p></div>
              </div>
            ) },
            { key: 'station', header: 'Station', render: (o) => <span className="text-sm text-navy-600 dark:text-navy-300">{stations.find((s) => s.id === o.stationId)?.name || '—'}</span> },
            { key: 'casesOpen', header: 'Open', render: (o) => <span className="font-semibold text-navy-900 dark:text-navy-50">{o.casesOpen}</span> },
            { key: 'casesSolved', header: 'Solved', render: (o) => <span className="font-semibold text-success-600 dark:text-success-400">{o.casesSolved}</span> },
            { key: 'status', header: 'Status', render: (o) => <span className={cn('chip', o.status === 'active' ? 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-300' : o.status === 'leave' ? 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300' : 'bg-danger-100 text-danger-700 dark:bg-danger-500/15 dark:text-danger-400')}>{o.status}</span> },
            { key: 'actions', header: 'Actions', render: (o) => <Button size="sm" variant="outline" onClick={() => toggleStatus(o.id)}>{o.status === 'active' ? 'Suspend' : 'Activate'}</Button> },
          ]}
          data={filtered}
        />
      </Card>
      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Add New Officer" subtitle="Create a new officer account">
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Input label="Full Name" placeholder="e.g., Anil Kumar" />
            <Input label="Badge ID" placeholder="e.g., KSP-8890" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select label="Rank" options={['Constable', 'Head Constable', 'ASR', 'PSI', 'Sub-Inspector', 'Inspector', 'PI', 'DySP', 'SP'].map((r) => ({ value: r, label: r }))} />
            <Select label="Station" options={stations.map((s) => ({ value: s.id, label: s.name }))} />
          </div>
          <Input label="Email" type="email" placeholder="name@ksp.gov.in" />
          <Input label="Phone" placeholder="90080-XXXXX" />
          <div className="flex justify-end gap-2 pt-2">
            <Button variant="outline" onClick={() => setAddOpen(false)}>Cancel</Button>
            <Button variant="gold" onClick={() => { setAddOpen(false); push('success', 'Officer account created.'); }}>Create Officer</Button>
          </div>
        </div>
      </Modal>
    </PortalLayout>
  );
}

function DepartmentHierarchy() {
  const hierarchy = [
    { rank: 'DGP', count: 1, color: 'bg-navy-800' },
    { rank: 'ADGP', count: 2, color: 'bg-navy-700' },
    { rank: 'IGP', count: 4, color: 'bg-navy-600' },
    { rank: 'DIG', count: 8, color: 'bg-navy-500' },
    { rank: 'SP', count: 16, color: 'bg-teal-600' },
    { rank: 'DySP', count: 32, color: 'bg-teal-500' },
    { rank: 'Inspector', count: 64, color: 'bg-blue-600' },
    { rank: 'Sub-Inspector', count: 128, color: 'bg-blue-500' },
    { rank: 'Constable', count: 512, color: 'bg-navy-400' },
  ];
  return (
    <PortalLayout role="admin" nav={nav} accent="gold">
      <PageHeader title="Department Hierarchy" subtitle="Karnataka State Police rank structure" />
      <Card>
        <CardBody>
          <div className="space-y-3">
            {hierarchy.map((h, i) => (
              <div key={h.rank} className="flex items-center gap-4">
                <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl text-white', h.color)}>
                  <Shield className="h-5 w-5" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-navy-900 dark:text-navy-50">{h.rank}</p>
                    <span className="text-xs text-navy-500 dark:text-navy-400">{h.count} officers</span>
                  </div>
                  <div className="mt-1.5 h-2 overflow-hidden rounded-full bg-navy-100 dark:bg-navy-800">
                    <div className={cn('h-full rounded-full', h.color)} style={{ width: `${(h.count / 512) * 100}%` }} />
                  </div>
                </div>
                {i < hierarchy.length - 1 && <div className="text-navy-300 dark:text-navy-600">↓</div>}
              </div>
            ))}
          </div>
        </CardBody>
      </Card>
    </PortalLayout>
  );
}

function StationManagement() {
  const [page, setPage] = useState(1);
  const { push } = useToast();
  const [addStationOpen, setAddStationOpen] = useState(false);
  const [stationList, setStationList] = useState(stations);
  const [stName, setStName] = useState('');
  const [stArea, setStArea] = useState('');
  const [stDistrict, setStDistrict] = useState('Bengaluru Urban');
  const [stType, setStType] = useState('urban');

  const addStation = () => {
    if (!stName) { push('warning', 'Please provide a station name.'); return; }
    const newStation = {
      id: `st_${Date.now()}`, name: stName, district: stDistrict, area: stArea || stDistrict,
      lat: 12.97, lng: 77.59, phone: '000-000-0000', email: `sp-${stArea.toLowerCase()}@ksp.gov.in`,
      officerCount: 0, jurisdiction: stArea, type: stType as any,
    };
    setStationList([newStation, ...stationList]);
    setAddStationOpen(false); setStName(''); setStArea('');
    push('success', `Station "${newStation.name}" added successfully.`);
  };

  return (
    <PortalLayout role="admin" nav={nav} accent="gold">
      <PageHeader title="Police Station Management" subtitle="Manage stations, jurisdiction, and staffing" actions={<Button variant="gold" onClick={() => setAddStationOpen(true)}><Building2 className="h-4 w-4" /> Add Station</Button>} />
      <Modal open={addStationOpen} onClose={() => setAddStationOpen(false)} title="Add New Police Station" subtitle="Register a new station" size="md"
        footer={<><Button variant="outline" onClick={() => setAddStationOpen(false)}>Cancel</Button><Button variant="gold" onClick={addStation}>Add Station</Button></>}>
        <div className="space-y-4">
          <Input label="Station Name" value={stName} onChange={(e) => setStName(e.target.value)} placeholder="e.g., Whitefield Police Station" />
          <div className="grid grid-cols-2 gap-4">
            <Input label="Area" value={stArea} onChange={(e) => setStArea(e.target.value)} placeholder="e.g., Whitefield" />
            <Select label="District" value={stDistrict} onChange={(e) => setStDistrict(e.target.value)} options={['Bengaluru Urban', 'Bengaluru Rural', 'Mysuru', 'Dharwad', 'Dakshina Kannada', 'Belagavi', 'Kalaburagi'].map((d) => ({ value: d, label: d }))} />
          </div>
          <Select label="Station Type" value={stType} onChange={(e) => setStType(e.target.value)} options={[{ value: 'urban', label: 'Urban' }, { value: 'rural', label: 'Rural' }, { value: 'traffic', label: 'Traffic' }, { value: 'cyber', label: 'Cyber' }, { value: 'women', label: 'Women' }]} />
        </div>
      </Modal>
      <Card>
        <Table
          columns={[
            { key: 'name', header: 'Station', render: (s) => <div><p className="font-medium text-navy-900 dark:text-navy-50">{s.name}</p><p className="text-xs text-navy-400">{s.area}, {s.district}</p></div> },
            { key: 'type', header: 'Type', render: (s) => <span className="chip bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300">{s.type}</span> },
            { key: 'officers', header: 'Officers', render: (s) => <span className="font-semibold text-navy-900 dark:text-navy-50">{s.officerCount}</span> },
            { key: 'phone', header: 'Phone', render: (s) => <span className="text-sm text-navy-600 dark:text-navy-300">{s.phone}</span> },
            { key: 'jurisdiction', header: 'Jurisdiction', render: (s) => <span className="text-xs text-navy-500 dark:text-navy-400">{s.jurisdiction}</span> },
          ]}
          data={stationList}
          rowKey={(s) => s.id}
        />
        <Pagination page={page} total={1} onChange={setPage} />
      </Card>
    </PortalLayout>
  );
}

function DistrictAnalytics() {
  return (
    <PortalLayout role="admin" nav={nav} accent="gold">
      <PageHeader title="District & State Analytics" subtitle="Crime statistics and performance across districts" />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Total Cases" value={districtStats.reduce((s, d) => s + d.cases, 0).toLocaleString('en-IN')} icon={<FileBarChart className="h-5 w-5" />} color="navy" />
        <StatCard label="Solved Rate" value={`${Math.round((districtStats.reduce((s, d) => s + d.solved, 0) / districtStats.reduce((s, d) => s + d.cases, 0)) * 100)}%`} icon={<Shield className="h-5 w-5" />} color="success" />
        <StatCard label="Cyber Cases" value={districtStats.reduce((s, d) => s + d.cyber, 0)} icon={<Cpu className="h-5 w-5" />} color="teal" />
        <StatCard label="Pending" value={districtStats.reduce((s, d) => s + d.pending, 0)} icon={<AlertTriangle className="h-5 w-5" />} color="danger" />
      </div>
      <Card className="mb-6">
        <CardHeader title="District Comparison" subtitle="Cases vs solved" icon={<FileBarChart className="h-5 w-5" />} />
        <CardBody>
          <BarChart data={districtStats.map((d) => ({ label: d.district.split(' ')[0], value: d.cases }))} color="#33558f" />
        </CardBody>
      </Card>
      <Card>
        <CardHeader title="District Breakdown" />
        <CardBody>
          <Table
            columns={[
              { key: 'district', header: 'District', render: (d) => <span className="font-medium text-navy-900 dark:text-navy-50">{d.district}</span> },
              { key: 'cases', header: 'Cases', render: (d) => <span className="font-semibold">{d.cases}</span> },
              { key: 'solved', header: 'Solved', render: (d) => <span className="font-semibold text-success-600 dark:text-success-400">{d.solved}</span> },
              { key: 'pending', header: 'Pending', render: (d) => <span className="font-semibold text-warning-600 dark:text-warning-400">{d.pending}</span> },
              { key: 'officers', header: 'Officers', render: (d) => <span>{d.officers}</span> },
              { key: 'stations', header: 'Stations', render: (d) => <span>{d.stations}</span> },
              { key: 'cyber', header: 'Cyber', render: (d) => <span className="text-teal-600 dark:text-teal-400">{d.cyber}</span> },
              { key: 'rate', header: 'Solve Rate', render: (d) => <div className="flex items-center gap-2"><div className="h-1.5 w-16 overflow-hidden rounded-full bg-navy-100 dark:bg-navy-800"><div className="h-full rounded-full bg-success-500" style={{ width: `${(d.solved / d.cases) * 100}%` }} /></div><span className="text-xs">{Math.round((d.solved / d.cases) * 100)}%</span></div> },
            ]}
            data={districtStats}
            rowKey={(d) => d.district}
          />
        </CardBody>
      </Card>
    </PortalLayout>
  );
}

function AIModelManagement() {
  const { push } = useToast();
  const [models, setModels] = useState(aiModels);
  const toggle = (id: string) => {
    setModels((list) => list.map((m) => m.id === id ? { ...m, status: m.status === 'active' ? 'inactive' : 'active' } : m));
    push('info', 'Model status updated.');
  };
  return (
    <PortalLayout role="admin" nav={nav} accent="gold">
      <PageHeader title="AI Model Management" subtitle="Monitor and control AI models powering the platform" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {models.map((m) => (
          <Card key={m.id}>
            <CardBody>
              <div className="flex items-start justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy-700 dark:bg-navy-800 dark:text-navy-200">
                  <Cpu className="h-5 w-5" />
                </div>
                <button onClick={() => toggle(m.id)} className={cn('relative h-6 w-11 rounded-full transition', m.status === 'active' ? 'bg-teal-500' : 'bg-navy-200 dark:bg-navy-700')}>
                  <span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all', m.status === 'active' ? 'left-[22px]' : 'left-0.5')} />
                </button>
              </div>
              <p className="mt-3 font-display text-sm font-bold text-navy-900 dark:text-navy-50">{m.name}</p>
              <p className="text-xs text-navy-400">{m.version}</p>
              <p className="mt-2 text-xs text-navy-600 dark:text-navy-300">{m.description}</p>
              <div className="mt-3 space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-navy-500 dark:text-navy-400">Accuracy</span>
                  <span className="font-semibold text-navy-900 dark:text-navy-50">{m.accuracy}%</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-navy-100 dark:bg-navy-800"><div className="h-full rounded-full bg-teal-500" style={{ width: `${m.accuracy}%` }} /></div>
                <div className="flex items-center justify-between text-xs text-navy-500 dark:text-navy-400">
                  <span>{m.calls.toLocaleString('en-IN')} calls</span>
                  <span>Trained {formatDate(m.lastTrained)}</span>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </PortalLayout>
  );
}

function RolesPermissions() {
  const roles: { role: Role; label: string; permissions: string[] }[] = [
    { role: 'citizen', label: 'Citizen', permissions: ['File complaints', 'Track own complaints', 'Emergency SOS', 'Lost & Found', 'Cybercrime report', 'Book appointments', 'View nearby stations', 'AI awareness chatbot'] },
    { role: 'officer', label: 'Police Officer', permissions: ['View all FIRs', 'AI Crime Search', 'Manage assigned cases', 'Evidence management', 'Criminal search', 'Network graph', 'Case summarizer', 'Hotspot maps', 'Patrol planning', 'Field reports', 'Voice assistant', 'Officer copilot', 'Report generation', 'Officer messaging'] },
    { role: 'admin', label: 'Administrator', permissions: ['User management', 'Officer management', 'Station management', 'AI model control', 'Roles & permissions', 'Audit logs', 'Security monitoring', 'System health', 'API management', 'Escalations', 'Resource allocation', 'Platform settings'] },
  ];
  return (
    <PortalLayout role="admin" nav={nav} accent="gold">
      <PageHeader title="Roles & Permissions" subtitle="Control feature access by role" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {roles.map((r) => (
          <Card key={r.role}>
            <CardHeader icon={<Lock className="h-5 w-5" />} title={r.label} subtitle={`${r.permissions.length} permissions`} />
            <CardBody className="space-y-2">
              {r.permissions.map((p) => (
                <div key={p} className="flex items-center gap-2 rounded-lg bg-navy-50 p-2.5 text-sm text-navy-700 dark:bg-navy-800/50 dark:text-navy-200">
                  <span className="flex h-4 w-4 items-center justify-center rounded-full bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400">
                    <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
                  </span>
                  {p}
                </div>
              ))}
            </CardBody>
          </Card>
        ))}
      </div>
    </PortalLayout>
  );
}

function AuditLogs() {
  const [filter, setFilter] = useState('all');
  const { push } = useToast();
  const filtered = filter === 'all' ? auditLogs : auditLogs.filter((a) => a.severity === filter);

  const exportLogs = () => {
    const csv = ['Time,Actor,Role,Action,Target,IP,Severity', ...filtered.map((a) => `${a.createdAt},${a.actor},${a.actorRole},${a.action},${a.target},${a.ip},${a.severity}`)].join('\n');
    downloadText(`audit_logs_${new Date().toISOString().slice(0, 10)}.csv`, csv);
    push('success', 'Audit logs exported as CSV.');
  };

  return (
    <PortalLayout role="admin" nav={nav} accent="gold">
      <PageHeader title="Audit Logs" subtitle="Complete record of all platform actions" actions={<Button variant="outline" onClick={exportLogs}><FileBarChart className="h-4 w-4" /> Export</Button>} />
      <div className="mb-4 flex gap-2">
        {['all', 'info', 'warning', 'critical'].map((f) => (
          <button key={f} onClick={() => setFilter(f)} className={cn('rounded-full px-3 py-1.5 text-xs font-medium transition', filter === f ? 'bg-navy-700 text-white dark:bg-navy-600' : 'bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300')}>{f === 'all' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}</button>
        ))}
      </div>
      <Card>
        <Table
          columns={[
            { key: 'createdAt', header: 'Time', render: (a) => <span className="text-xs text-navy-500">{formatDateTime(a.createdAt)}</span> },
            { key: 'actor', header: 'Actor', render: (a) => <div><p className="font-medium text-navy-900 dark:text-navy-50">{a.actor}</p><p className="text-xs text-navy-400">{a.actorRole}</p></div> },
            { key: 'action', header: 'Action', render: (a) => <span className="text-sm text-navy-700 dark:text-navy-200">{a.action}</span> },
            { key: 'target', header: 'Target', render: (a) => <span className="text-sm text-navy-600 dark:text-navy-300">{a.target}</span> },
            { key: 'ip', header: 'IP', render: (a) => <span className="font-mono text-xs text-navy-400">{a.ip}</span> },
            { key: 'severity', header: 'Severity', render: (a) => <span className={cn('chip', a.severity === 'critical' ? 'bg-danger-100 text-danger-700 dark:bg-danger-500/15 dark:text-danger-400' : a.severity === 'warning' ? 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400' : 'bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300')}>{a.severity}</span> },
          ]}
          data={filtered}
        />
      </Card>
    </PortalLayout>
  );
}

function SecurityMonitoring() {
  const { push } = useToast();
  const [threatList, setThreatList] = useState([
    { id: 'th_1', title: 'Failed login attempts', detail: '5 failed attempts from IP 203.0.113.55 on admin portal', severity: 'critical', at: '2025-12-24T03:00:00Z', status: 'open' },
    { id: 'th_2', title: 'Unusual permission change', detail: 'Admin role modified outside business hours', severity: 'warning', at: '2025-12-27T14:00:00Z', status: 'open' },
    { id: 'th_3', title: 'API rate limit exceeded', detail: 'IP 198.51.100.22 exceeded rate limit on /api/firs', severity: 'warning', at: '2025-12-23T22:00:00Z', status: 'open' },
  ]);
  const [investigateOpen, setInvestigateOpen] = useState(false);
  const [selectedThreat, setSelectedThreat] = useState<typeof threatList[0] | null>(null);

  const investigate = (id: string) => {
    setThreatList((list) => list.map((t) => t.id === id ? { ...t, status: 'investigating' } : t));
    const t = threatList.find((x) => x.id === id);
    setSelectedThreat(t || null);
    setInvestigateOpen(true);
    push('info', `Investigation started for: ${t?.title}`);
  };

  const resolveThreat = () => {
    if (selectedThreat) {
      setThreatList((list) => list.map((t) => t.id === selectedThreat.id ? { ...t, status: 'resolved' } : t));
      push('success', `Threat "${selectedThreat.title}" resolved.`);
    }
    setInvestigateOpen(false);
  };

  return (
    <PortalLayout role="admin" nav={nav} accent="gold">
      <PageHeader title="Security Monitoring" subtitle="Real-time threat detection and response" />
      <div className="mb-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard label="Active Threats" value={threatList.filter((t) => t.status !== 'resolved').length} icon={<AlertTriangle className="h-5 w-5" />} color="danger" />
        <StatCard label="Blocked IPs" value={3} icon={<Lock className="h-5 w-5" />} color="navy" />
        <StatCard label="Failed Logins" value={12} icon={<Shield className="h-5 w-5" />} color="warning" />
        <StatCard label="Security Score" value="94%" icon={<Gauge className="h-5 w-5" />} color="success" />
      </div>
      <Card>
        <CardHeader title="Active Threats" subtitle="Requires attention" icon={<AlertTriangle className="h-5 w-5" />} />
        <CardBody className="space-y-3">
          {threatList.map((t) => (
            <div key={t.id} className={cn('flex items-start gap-3 rounded-lg border p-4', t.status === 'resolved' ? 'border-success-200 bg-success-50/40 dark:border-success-500/30 dark:bg-success-500/5' : t.severity === 'critical' ? 'border-danger-200 bg-danger-50/40 dark:border-danger-500/30 dark:bg-danger-500/5' : 'border-warning-200 bg-warning-50/40 dark:border-warning-500/30 dark:bg-warning-500/5')}>
              <AlertTriangle className={cn('mt-0.5 h-5 w-5', t.status === 'resolved' ? 'text-success-600 dark:text-success-400' : t.severity === 'critical' ? 'text-danger-600 dark:text-danger-400' : 'text-warning-600 dark:text-warning-400')} />
              <div className="flex-1">
                <p className="text-sm font-semibold text-navy-900 dark:text-navy-50">{t.title}</p>
                <p className="text-xs text-navy-600 dark:text-navy-300">{t.detail}</p>
                <p className="mt-1 text-[10px] text-navy-400">{timeAgo(t.at)} · {t.status}</p>
              </div>
              <Button size="sm" variant={t.status === 'resolved' ? 'outline' : 'outline'} onClick={() => investigate(t.id)}>{t.status === 'resolved' ? 'Resolved' : 'Investigate'}</Button>
            </div>
          ))}
        </CardBody>
      </Card>
      <Modal open={investigateOpen} onClose={() => setInvestigateOpen(false)} title="Threat Investigation" subtitle={selectedThreat?.title} size="md"
        footer={<><Button variant="outline" onClick={() => setInvestigateOpen(false)}>Close</Button><Button variant="gold" onClick={resolveThreat}>Mark Resolved</Button></>}>
        <div className="space-y-3">
          <div className="rounded-lg bg-navy-50 p-3 dark:bg-navy-800/50">
            <p className="text-xs font-semibold text-navy-500 dark:text-navy-400">Threat Detail</p>
            <p className="mt-1 text-sm text-navy-800 dark:text-navy-100">{selectedThreat?.detail}</p>
          </div>
          <div className="rounded-lg bg-navy-50 p-3 dark:bg-navy-800/50">
            <p className="text-xs font-semibold text-navy-500 dark:text-navy-400">Severity</p>
            <p className="mt-1 text-sm font-medium text-danger-600 dark:text-danger-400">{selectedThreat?.severity}</p>
          </div>
          <div className="rounded-lg bg-navy-50 p-3 dark:bg-navy-800/50">
            <p className="text-xs font-semibold text-navy-500 dark:text-navy-400">Recommended Actions</p>
            <ul className="mt-1 space-y-1 text-sm text-navy-700 dark:text-navy-200">
              <li>1. Block source IP address</li>
              <li>2. Review recent access logs</li>
              <li>3. Notify security team</li>
              <li>4. Update firewall rules</li>
            </ul>
          </div>
        </div>
      </Modal>
    </PortalLayout>
  );
}

function SystemHealth() {
  return (
    <PortalLayout role="admin" nav={nav} accent="gold">
      <PageHeader title="System Health" subtitle="Live monitoring of all platform services" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {systemHealth.map((s) => (
          <Card key={s.service}>
            <CardBody>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={cn('h-3 w-3 rounded-full', s.status === 'operational' ? 'bg-success-500' : 'bg-warning-500')} />
                  <p className="text-sm font-semibold text-navy-900 dark:text-navy-50">{s.service}</p>
                </div>
                <span className={cn('chip', s.status === 'operational' ? 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-300' : 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300')}>{s.status}</span>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <div><p className="text-xs text-navy-400">Uptime</p><p className="font-display text-lg font-bold text-navy-900 dark:text-navy-50">{s.uptime}%</p></div>
                <div><p className="text-xs text-navy-400">Latency</p><p className="font-display text-lg font-bold text-navy-900 dark:text-navy-50">{s.latency}<span className="text-xs font-normal">ms</span></p></div>
              </div>
              <div className="mt-3"><Sparkline data={[40, 42, 38, 45, 43, 41, 44, 42, 40, 43]} color={s.status === 'operational' ? '#12b157' : '#f99207'} /></div>
            </CardBody>
          </Card>
        ))}
      </div>
    </PortalLayout>
  );
}

function APIManagement() {
  const apis = [
    { endpoint: '/api/v1/firs', method: 'GET', calls: 48210, status: 'active' },
    { endpoint: '/api/v1/cases', method: 'GET', calls: 32100, status: 'active' },
    { endpoint: '/api/v1/criminals', method: 'GET', calls: 18920, status: 'active' },
    { endpoint: '/api/v1/ai/search', method: 'POST', calls: 22480, status: 'active' },
    { endpoint: '/api/v1/ai/summarize', method: 'POST', calls: 3210, status: 'active' },
    { endpoint: '/api/v1/complaints', method: 'POST', calls: 8120, status: 'active' },
    { endpoint: '/api/v1/sos', method: 'POST', calls: 340, status: 'active' },
    { endpoint: '/api/v1/reports', method: 'GET', calls: 1240, status: 'rate_limited' },
  ];
  return (
    <PortalLayout role="admin" nav={nav} accent="gold">
      <PageHeader title="API Management" subtitle="Monitor API endpoints, usage, and rate limits" />
      <Card>
        <Table
          columns={[
            { key: 'endpoint', header: 'Endpoint', render: (a) => <span className="font-mono text-sm text-navy-900 dark:text-navy-50">{a.endpoint}</span> },
            { key: 'method', header: 'Method', render: (a) => <span className={cn('chip font-mono', a.method === 'GET' ? 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-300' : 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300')}>{a.method}</span> },
            { key: 'calls', header: 'Calls (30d)', render: (a) => <span className="font-semibold text-navy-900 dark:text-navy-50">{a.calls.toLocaleString('en-IN')}</span> },
            { key: 'status', header: 'Status', render: (a) => <span className={cn('chip', a.status === 'active' ? 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-300' : 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300')}>{a.status.replace('_', ' ')}</span> },
          ]}
          data={apis}
          rowKey={(a) => a.endpoint}
        />
      </Card>
    </PortalLayout>
  );
}

function AdminNotifications() {
  const { push } = useToast();
  const [broadcastOpen, setBroadcastOpen] = useState(false);
  const [bcTitle, setBcTitle] = useState('');
  const [bcMessage, setBcMessage] = useState('');
  const [bcScope, setBcScope] = useState('all');
  const [notifList, setNotifList] = useState(notifications);
  const adminNotifs = notifList.filter((n) => n.scope === 'admin');

  const broadcast = () => {
    if (!bcTitle || !bcMessage) { push('warning', 'Please fill in title and message.'); return; }
    const newNotif = {
      id: `nt_${Date.now()}`, title: bcTitle, message: bcMessage, type: 'info' as const,
      scope: bcScope as any, createdAt: new Date().toISOString(), read: false,
    };
    setNotifList([newNotif, ...notifList]);
    setBroadcastOpen(false); setBcTitle(''); setBcMessage('');
    push('success', `Notification broadcast to ${bcScope === 'all' ? 'all users' : bcScope + 's'}.`);
  };

  return (
    <PortalLayout role="admin" nav={nav} accent="gold">
      <PageHeader title="Notification Center" subtitle="Broadcast and manage platform notifications" actions={<Button variant="gold" onClick={() => setBroadcastOpen(true)}><Bell className="h-4 w-4" /> Broadcast</Button>} />
      <Modal open={broadcastOpen} onClose={() => setBroadcastOpen(false)} title="Broadcast Notification" subtitle="Send a notification to users" size="md"
        footer={<><Button variant="outline" onClick={() => setBroadcastOpen(false)}>Cancel</Button><Button variant="gold" onClick={broadcast}>Send Broadcast</Button></>}>
        <div className="space-y-4">
          <Input label="Title" value={bcTitle} onChange={(e) => setBcTitle(e.target.value)} placeholder="Notification title" />
          <Textarea label="Message" value={bcMessage} onChange={(e) => setBcMessage(e.target.value)} placeholder="Notification message..." />
          <Select label="Target Audience" value={bcScope} onChange={(e) => setBcScope(e.target.value)} options={[{ value: 'all', label: 'All Users' }, { value: 'citizen', label: 'Citizens' }, { value: 'officer', label: 'Officers' }, { value: 'admin', label: 'Administrators' }]} />
        </div>
      </Modal>
      <div className="space-y-3">
        {adminNotifs.map((n) => (
          <Card key={n.id}>
            <CardBody className="flex items-start gap-3">
              <div className={cn('flex h-9 w-9 items-center justify-center rounded-lg', n.type === 'warning' ? 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400' : n.type === 'success' ? 'bg-success-100 text-success-700 dark:bg-success-500/15 dark:text-success-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400')}>
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

function AdminReports() {
  const { push } = useToast();
  return (
    <PortalLayout role="admin" nav={nav} accent="gold">
      <PageHeader title="Reports" subtitle="Generate and download platform-wide reports" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[
          { title: 'Monthly Crime Report', desc: 'Statewide crime statistics and trends', icon: FileBarChart },
          { title: 'Officer Performance', desc: 'Case solve rates and productivity metrics', icon: Shield },
          { title: 'District Comparison', desc: 'Cross-district analytics and benchmarks', icon: Activity },
          { title: 'AI Usage Report', desc: 'AI model calls, accuracy, and adoption', icon: Cpu },
          { title: 'Audit Summary', desc: 'Security and compliance audit trail', icon: ScrollText },
          { title: 'Resource Report', desc: 'Station staffing and resource allocation', icon: Package },
        ].map((r) => (
          <Card key={r.title}>
            <CardBody>
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-navy-50 text-navy-700 dark:bg-navy-800 dark:text-navy-200">
                <r.icon className="h-5 w-5" />
              </div>
              <p className="mt-3 font-display text-sm font-semibold text-navy-900 dark:text-navy-50">{r.title}</p>
              <p className="mt-0.5 text-xs text-navy-500 dark:text-navy-400">{r.desc}</p>
              <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => push('success', `${r.title} generated.`)}>Generate</Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </PortalLayout>
  );
}

function Escalations() {
  const { push } = useToast();
  const escalated = complaints.filter((c) => c.priority === 'critical' || c.priority === 'high');
  return (
    <PortalLayout role="admin" nav={nav} accent="gold">
      <PageHeader title="Complaint Escalations" subtitle="High-priority complaints requiring administrative oversight" />
      <div className="space-y-3">
        {escalated.map((c) => (
          <Card key={c.id}>
            <CardBody className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-navy-400">{c.trackingId}</span>
                  <span className={cn('chip', c.priority === 'critical' ? 'bg-danger-100 text-danger-700 dark:bg-danger-500/15 dark:text-danger-400' : 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400')}>{c.priority}</span>
                  <span className={cn('chip', caseStatusColors[c.status as keyof typeof caseStatusColors] || 'bg-navy-100')}>{caseStatusLabels[c.status as keyof typeof caseStatusLabels] || c.status}</span>
                </div>
                <p className="mt-1.5 font-medium text-navy-900 dark:text-navy-50">{c.title}</p>
                <p className="text-xs text-navy-500 dark:text-navy-400">{c.citizenName} · {c.area} · {timeAgo(c.createdAt)}</p>
              </div>
              <Button size="sm" variant="gold" onClick={() => push('success', `Complaint "${c.title}" escalated to senior officer. Notification sent.`)}>Escalate</Button>
            </CardBody>
          </Card>
        ))}
      </div>
    </PortalLayout>
  );
}

function FeedbackManagement() {
  const feedback = [
    { id: 'fb_1', from: 'Ramesh Iyer', role: 'Citizen', rating: 5, message: 'The AI assistant helped me file my complaint quickly. Very intuitive!', at: '2025-12-22T10:00:00Z' },
    { id: 'fb_2', from: 'Priya Nair', role: 'Officer', rating: 4, message: 'Case summarizer saves a lot of time. Would love Kannada voice support.', at: '2025-12-20T14:00:00Z' },
    { id: 'fb_3', from: 'Anand K', role: 'Citizen', rating: 5, message: 'SOS feature gave me peace of mind. Response was quick.', at: '2025-12-18T09:00:00Z' },
    { id: 'fb_4', from: 'Kiran Kumar', role: 'Officer', rating: 5, message: 'The criminal network graph helped us crack the Whitefield chain gang case.', at: '2025-12-15T16:00:00Z' },
  ];
  return (
    <PortalLayout role="admin" nav={nav} accent="gold">
      <PageHeader title="Feedback Management" subtitle="User feedback from citizens and officers" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {feedback.map((f) => (
          <Card key={f.id}>
            <CardBody>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar initials={f.from.split(' ').map((n) => n[0]).join('')} color="bg-navy-600" size="sm" />
                  <div>
                    <p className="text-sm font-semibold text-navy-900 dark:text-navy-50">{f.from}</p>
                    <p className="text-xs text-navy-400">{f.role} · {timeAgo(f.at)}</p>
                  </div>
                </div>
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <span key={s} className={cn('text-sm', s <= f.rating ? 'text-gold-500' : 'text-navy-200 dark:text-navy-700')}>★</span>
                  ))}
                </div>
              </div>
              <p className="mt-3 text-sm text-navy-700 dark:text-navy-200">"{f.message}"</p>
            </CardBody>
          </Card>
        ))}
      </div>
    </PortalLayout>
  );
}

function ResourceAllocation() {
  return (
    <PortalLayout role="admin" nav={nav} accent="gold">
      <PageHeader title="Resource Allocation" subtitle="Distribute officers and equipment across stations" />
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card>
          <CardHeader title="Officer Distribution" subtitle="By district" icon={<Users className="h-5 w-5" />} />
          <CardBody>
            <BarChart data={districtStats.map((d) => ({ label: d.district.split(' ')[0], value: d.officers }))} color="#33558f" />
          </CardBody>
        </Card>
        <Card>
          <CardHeader title="Station Staffing" subtitle="Officers per station" icon={<Building2 className="h-5 w-5" />} />
          <CardBody>
            <div className="space-y-3">
              {stations.map((s) => (
                <div key={s.id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-navy-700 dark:text-navy-200">{s.name}</span>
                    <span className="font-semibold text-navy-900 dark:text-navy-50">{s.officerCount}</span>
                  </div>
                  <div className="mt-1 h-2 overflow-hidden rounded-full bg-navy-100 dark:bg-navy-800">
                    <div className="h-full rounded-full bg-teal-500" style={{ width: `${(s.officerCount / 45) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </div>
    </PortalLayout>
  );
}

function AdminProfile() {
  const { user } = useAuth();
  const { push } = useToast();
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [aiEnabled, setAiEnabled] = useState(true);
  const [citizenEnabled, setCitizenEnabled] = useState(true);
  if (!user) return null;
  return (
    <PortalLayout role="admin" nav={nav} accent="gold">
      <PageHeader title="Administrator Profile" subtitle="Your account and platform settings" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardBody className="flex flex-col items-center text-center">
            <Avatar initials={user.initials} color={user.avatarColor} size="lg" />
            <p className="mt-3 font-display text-lg font-bold text-navy-900 dark:text-navy-50">{user.name}</p>
            <p className="text-sm text-navy-500 dark:text-navy-400">{user.rank} · State HQ</p>
            <span className="chip mt-3 bg-gold-100 text-gold-700 dark:bg-gold-500/15 dark:text-gold-300">Administrator</span>
          </CardBody>
        </Card>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Account Information" />
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Full Name" defaultValue={user.name} />
                <Input label="Rank" defaultValue={user.rank} />
                <Input label="Email" defaultValue={user.email} />
                <Input label="Phone" defaultValue={user.phone} />
              </div>
              <Button variant="gold" onClick={() => push('success', 'Profile updated successfully.')}>Save Changes</Button>
            </CardBody>
          </Card>
          <Card className="mt-6">
            <CardHeader title="Platform Settings" icon={<Settings className="h-5 w-5" />} />
            <CardBody className="space-y-4">
              <div className="flex items-center justify-between rounded-lg bg-navy-50 p-3 dark:bg-navy-800/50">
                <div><p className="text-sm font-medium text-navy-900 dark:text-navy-50">AI Features</p><p className="text-xs text-navy-400">Enable AI-powered features platform-wide</p></div>
                <button onClick={() => { setAiEnabled(!aiEnabled); push('info', `AI Features ${!aiEnabled ? 'enabled' : 'disabled'}.`); }} className="relative h-6 w-11 rounded-full bg-teal-500"><span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all', aiEnabled ? 'left-[22px]' : 'left-0.5')} /></button>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-navy-50 p-3 dark:bg-navy-800/50">
                <div><p className="text-sm font-medium text-navy-900 dark:text-navy-50">Citizen Self-Service</p><p className="text-xs text-navy-400">Allow citizens to file and track complaints online</p></div>
                <button onClick={() => { setCitizenEnabled(!citizenEnabled); push('info', `Citizen Self-Service ${!citizenEnabled ? 'enabled' : 'disabled'}.`); }} className="relative h-6 w-11 rounded-full bg-teal-500"><span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all', citizenEnabled ? 'left-[22px]' : 'left-0.5')} /></button>
              </div>
              <div className="flex items-center justify-between rounded-lg bg-navy-50 p-3 dark:bg-navy-800/50">
                <div><p className="text-sm font-medium text-navy-900 dark:text-navy-50">Voice Assistant</p><p className="text-xs text-navy-400">Enable voice queries for officers</p></div>
                <button onClick={() => { setVoiceEnabled(!voiceEnabled); push('info', `Voice Assistant ${!voiceEnabled ? 'enabled' : 'disabled'}.`); }} className={cn('relative h-6 w-11 rounded-full transition', voiceEnabled ? 'bg-teal-500' : 'bg-navy-200 dark:bg-navy-700')}><span className={cn('absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all', voiceEnabled ? 'left-[22px]' : 'left-0.5')} /></button>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
