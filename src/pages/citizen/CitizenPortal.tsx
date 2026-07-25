import { useState } from 'react';
import {
  Home, FileText, Search, Siren, Package, ShieldAlert, Calendar, MapPin,
  MessageSquare, Bell, User, Upload, ClipboardList,
} from 'lucide-react';
import { PortalLayout } from '@/components/PortalLayout';
import { useRouter } from '@/router';
import { useAuth } from '@/context/AuthContext';
import { Card, CardBody, CardHeader, PageHeader, StatCard, SectionTitle, EmptyState } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input, Textarea, Select, Avatar } from '@/components/ui/Form';
import { MapView } from '@/components/ui/MapView';
import { ChatPanel } from '@/components/ui/ChatPanel';
import { useToast } from '@/context/ToastContext';
import { complaints, stations, alerts, appointments, citizens, districts } from '@/data/mock';
import { crimeTypeLabels, formatDate, formatDateTime, timeAgo, cn, caseStatusColors, caseStatusLabels } from '@/lib/format';
import { citizenChatbotAnswer, makeChatMessage } from '@/lib/ai';
import type { ChatMessage, CrimeType } from '@/types';

const nav = [
  { label: 'Dashboard', path: '/citizen', icon: Home },
  { label: 'File Complaint', path: '/citizen/file', icon: FileText },
  { label: 'Track Complaint', path: '/citizen/track', icon: Search },
  { label: 'Emergency SOS', path: '/citizen/sos', icon: Siren },
  { label: 'Lost & Found', path: '/citizen/lost', icon: Package },
  { label: 'Cyber Crime', path: '/citizen/cyber', icon: ShieldAlert },
  { label: 'Appointments', path: '/citizen/appointments', icon: Calendar },
  { label: 'Nearby Stations', path: '/citizen/stations', icon: MapPin },
  { label: 'AI Assistant', path: '/citizen/assistant', icon: MessageSquare },
  { label: 'Notifications', path: '/citizen/notifications', icon: Bell },
  { label: 'Profile', path: '/citizen/profile', icon: User },
];

export function CitizenPortal() {
  const { path } = useRouter();
  if (path === '/citizen' || path === '/citizen/') return <CitizenDashboard />;
  if (path === '/citizen/file') return <FileComplaint />;
  if (path === '/citizen/track') return <TrackComplaint />;
  if (path === '/citizen/sos') return <EmergencySOS />;
  if (path === '/citizen/lost') return <LostFound />;
  if (path === '/citizen/cyber') return <CyberCrime />;
  if (path === '/citizen/appointments') return <Appointments />;
  if (path === '/citizen/stations') return <NearbyStations />;
  if (path === '/citizen/assistant') return <CitizenAssistant />;
  if (path === '/citizen/notifications') return <CitizenNotifications />;
  if (path === '/citizen/profile') return <CitizenProfile />;
  if (path === '/citizen/settings') return <CitizenProfile />;
  return <CitizenDashboard />;
}

function CitizenDashboard() {
  const { user } = useAuth();
  const { navigate } = useRouter();
  const myComplaints = complaints.filter((c) => c.citizenId === user?.id);
  const citizenAlerts = alerts.filter((a) => a.scope === 'citizen');

  const services = [
    { label: 'File Complaint', icon: FileText, path: '/citizen/file', color: 'bg-navy-600' },
    { label: 'Track Complaint', icon: Search, path: '/citizen/track', color: 'bg-teal-600' },
    { label: 'Emergency SOS', icon: Siren, path: '/citizen/sos', color: 'bg-danger-600' },
    { label: 'Lost & Found', icon: Package, path: '/citizen/lost', color: 'bg-blue-600' },
    { label: 'Cyber Crime', icon: ShieldAlert, path: '/citizen/cyber', color: 'bg-gold-600' },
    { label: 'Appointment', icon: Calendar, path: '/citizen/appointments', color: 'bg-navy-500' },
    { label: 'Nearby Stations', icon: MapPin, path: '/citizen/stations', color: 'bg-teal-500' },
    { label: 'AI Assistant', icon: MessageSquare, path: '/citizen/assistant', color: 'bg-navy-700' },
  ];

  return (
    <PortalLayout role="citizen" nav={nav} accent="teal">
      <PageHeader title={`Welcome, ${user?.name?.split(' ')[0]}`} subtitle="Your citizen dashboard for police services" />

      {/* service shortcuts */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
        {services.map((s) => (
          <button key={s.label} onClick={() => navigate(s.path)} className="surface flex flex-col items-center gap-2 p-4 transition hover:shadow-card-hover">
            <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl text-white', s.color)}>
              <s.icon className="h-5 w-5" />
            </div>
            <span className="text-center text-xs font-medium text-navy-700 dark:text-navy-200">{s.label}</span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* my complaints */}
        <div className="lg:col-span-2">
          <SectionTitle action={<Button size="sm" variant="ghost" onClick={() => navigate('/citizen/track')}>View all</Button>}>My Complaints</SectionTitle>
          <div className="space-y-3">
            {myComplaints.length === 0 ? (
              <Card><CardBody><EmptyState icon={<FileText className="h-7 w-7" />} title="No complaints yet" description="File your first complaint to get started." action={<Button size="sm" onClick={() => navigate('/citizen/file')}>File a Complaint</Button>} /></CardBody></Card>
            ) : (
              myComplaints.map((c) => (
                <Card key={c.id} className="cursor-pointer transition hover:shadow-card-hover" onClick={() => navigate('/citizen/track')}>
                  <CardBody className="flex items-start justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className={cn('chip', caseStatusColors[c.status as keyof typeof caseStatusColors] || 'bg-navy-100')}>{caseStatusLabels[c.status as keyof typeof caseStatusLabels] || c.status}</span>
                        <span className="text-xs text-navy-400">{c.trackingId}</span>
                      </div>
                      <p className="mt-1.5 font-medium text-navy-900 dark:text-navy-50">{c.title}</p>
                      <p className="mt-0.5 text-xs text-navy-500 dark:text-navy-400">{crimeTypeLabels[c.category as CrimeType] || c.category} · {c.area} · {timeAgo(c.updatedAt)}</p>
                    </div>
                  </CardBody>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* alerts */}
        <div>
          <SectionTitle>Safety Alerts</SectionTitle>
          <div className="space-y-3">
            {citizenAlerts.map((a) => (
              <Card key={a.id} className={cn(a.severity === 'critical' && 'border-danger-200 dark:border-danger-500/30')}>
                <CardBody>
                  <div className="flex items-start gap-2.5">
                    <div className={cn('flex h-8 w-8 shrink-0 items-center justify-center rounded-lg', a.severity === 'critical' ? 'bg-danger-100 text-danger-700 dark:bg-danger-500/15 dark:text-danger-400' : a.severity === 'warning' ? 'bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400')}>
                      <ShieldAlert className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy-900 dark:text-navy-50">{a.title}</p>
                      <p className="mt-0.5 text-xs text-navy-500 dark:text-navy-400">{a.message}</p>
                      <p className="mt-1 text-[10px] text-navy-400">{a.area} · {timeAgo(a.createdAt)}</p>
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

function FileComplaint() {
  const { push } = useToast();
  const { navigate } = useRouter();
  const [type, setType] = useState('complaint');
  const [category, setCategory] = useState('chain_snatching');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [district, setDistrict] = useState('Bengaluru Urban');
  const [area, setArea] = useState('');
  const [docs, setDocs] = useState<{ name: string; type: string; size: string }[]>([]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) { push('warning', 'Please fill in all required fields.'); return; }
    const trackingId = `KSP-2025-TRK-${Math.floor(8000 + Math.random() * 1999)}`;
    push('success', `Complaint filed successfully! Your tracking ID is ${trackingId}.`);
    navigate('/citizen/track');
  };

  const addDoc = () => {
    setDocs([...docs, { name: `document_${docs.length + 1}.pdf`, type: 'document', size: `${Math.floor(100 + Math.random() * 900)} KB` }]);
  };

  return (
    <PortalLayout role="citizen" nav={nav} accent="teal">
      <PageHeader title="File a Complaint" subtitle="Submit a complaint, e-FIR, or service request" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardHeader icon={<FileText className="h-5 w-5" />} title="Complaint Details" subtitle="Provide accurate information for faster processing" />
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select label="Complaint Type" value={type} onChange={(e) => setType(e.target.value)} options={[
                  { value: 'complaint', label: 'General Complaint' },
                  { value: 'fir', label: 'e-FIR' },
                  { value: 'lost_found', label: 'Lost & Found' },
                  { value: 'cybercrime', label: 'Cyber Crime' },
                  { value: 'service_request', label: 'Service Request' },
                ]} />
                <Select label="Category" value={category} onChange={(e) => setCategory(e.target.value)} options={Object.entries(crimeTypeLabels).map(([k, v]) => ({ value: k, label: v }))} />
              </div>
              <Input label="Title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Brief title of the incident" />
              <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe what happened in detail..." />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Select label="District" value={district} onChange={(e) => setDistrict(e.target.value)} options={districts.map((d) => ({ value: d, label: d }))} />
                <Input label="Area / Locality" value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g., Whitefield" />
              </div>
              <div>
                <label className="label-base">Supporting Documents</label>
                <div className="space-y-2">
                  {docs.map((d, i) => (
                    <div key={i} className="flex items-center gap-2 rounded-lg bg-navy-50 px-3 py-2 text-sm dark:bg-navy-800/50">
                      <Upload className="h-4 w-4 text-navy-400" />
                      <span className="flex-1 text-navy-700 dark:text-navy-200">{d.name}</span>
                      <span className="text-xs text-navy-400">{d.size}</span>
                      <button onClick={() => setDocs(docs.filter((_, idx) => idx !== i))} className="text-danger-500 hover:text-danger-700">Remove</button>
                    </div>
                  ))}
                  <button onClick={addDoc} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-navy-200 py-3 text-sm text-navy-500 transition hover:border-teal-400 hover:text-teal-600 dark:border-navy-700 dark:text-navy-400">
                    <Upload className="h-4 w-4" /> Upload Document
                  </button>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => navigate('/citizen')}>Cancel</Button>
                <Button onClick={submit}>Submit Complaint</Button>
              </div>
            </CardBody>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader icon={<ClipboardList className="h-5 w-5" />} title="Before You File" />
            <CardBody className="space-y-3 text-sm text-navy-600 dark:text-navy-300">
              <p>• Provide accurate date, time, and location of the incident.</p>
              <p>• Upload any photos, videos, or documents as evidence.</p>
              <p>• For emergencies, call <span className="font-bold text-danger-600">112</span> or use SOS instead.</p>
              <p>• You'll receive a tracking ID to monitor status.</p>
              <p>• False complaints are punishable under Section 182 IPC.</p>
            </CardBody>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}

function TrackComplaint() {
  const { user } = useAuth();
  const [searchId, setSearchId] = useState('');
  const myComplaints = complaints.filter((c) => c.citizenId === user?.id);
  const filtered = searchId ? myComplaints.filter((c) => c.trackingId.toLowerCase().includes(searchId.toLowerCase()) || c.title.toLowerCase().includes(searchId.toLowerCase())) : myComplaints;

  return (
    <PortalLayout role="citizen" nav={nav} accent="teal">
      <PageHeader title="Track Complaints" subtitle="Monitor the status of your complaints and service requests" />
      <div className="mb-4">
        <Input icon={<Search className="h-4 w-4" />} placeholder="Search by tracking ID or title..." value={searchId} onChange={(e) => setSearchId(e.target.value)} />
      </div>
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <Card><CardBody><EmptyState icon={<Search className="h-7 w-7" />} title="No complaints found" description="Try a different search term." /></CardBody></Card>
        ) : (
          filtered.map((c) => (
            <Card key={c.id}>
              <CardHeader icon={<FileText className="h-5 w-5" />} title={c.title} subtitle={`${c.trackingId} · Filed ${formatDate(c.createdAt)}`} action={<span className={cn('chip', caseStatusColors[c.status as keyof typeof caseStatusColors] || 'bg-navy-100')}>{caseStatusLabels[c.status as keyof typeof caseStatusLabels] || c.status}</span>} />
              <CardBody>
                <p className="mb-4 text-sm text-navy-600 dark:text-navy-300">{c.description}</p>
                <SectionTitle>Status Timeline</SectionTitle>
                <div className="space-y-3">
                  {c.timeline.map((t, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex flex-col items-center">
                        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300">
                          <span className="text-xs font-bold">{i + 1}</span>
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
          ))
        )}
      </div>
    </PortalLayout>
  );
}

function EmergencySOS() {
  const { push } = useToast();
  const [sosActive, setSosActive] = useState(false);
  const [countdown, setCountdown] = useState(3);

  const triggerSOS = () => {
    setCountdown(3);
    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          setSosActive(true);
          push('critical', 'SOS ACTIVATED! Alert sent to nearest police station. Help is on the way.');
          return 0;
        }
        return c - 1;
      });
    }, 1000);
  };

  const cancelSOS = () => {
    setSosActive(false);
    push('info', 'SOS cancelled.');
  };

  const nearbyStations = stations.slice(0, 3);

  return (
    <PortalLayout role="citizen" nav={nav} accent="teal">
      <PageHeader title="Emergency SOS" subtitle="Send an instant distress alert with your live location" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card className="overflow-hidden">
            <div className={cn('flex flex-col items-center justify-center py-12 text-center transition', sosActive ? 'bg-danger-50 dark:bg-danger-500/10' : 'bg-navy-50/40 dark:bg-navy-900/40')}>
              {!sosActive && countdown === 3 ? (
                <>
                  <button onClick={triggerSOS} className="group relative flex h-40 w-40 items-center justify-center rounded-full bg-danger-600 text-white shadow-elevated transition hover:bg-danger-700 active:scale-95">
                    <span className="absolute inset-0 animate-ping-slow rounded-full bg-danger-500/40" />
                    <div className="relative flex flex-col items-center">
                      <Siren className="h-12 w-12" />
                      <span className="mt-2 font-display text-lg font-bold">SOS</span>
                    </div>
                  </button>
                  <p className="mt-6 text-sm text-navy-600 dark:text-navy-300">Press and hold to send emergency alert</p>
                  <p className="mt-1 text-xs text-navy-400">Your location will be shared with the nearest police station</p>
                </>
              ) : sosActive ? (
                <>
                  <div className="flex h-40 w-40 items-center justify-center rounded-full bg-danger-600 text-white shadow-elevated">
                    <div className="flex flex-col items-center">
                      <Siren className="h-12 w-12 animate-pulse-soft" />
                      <span className="mt-2 font-display text-lg font-bold">ACTIVE</span>
                    </div>
                  </div>
                  <p className="mt-6 font-display text-base font-bold text-danger-700 dark:text-danger-400">ALERT SENT</p>
                  <p className="mt-1 text-sm text-navy-600 dark:text-navy-300">Help is on the way. Stay where you are.</p>
                  <Button variant="danger" className="mt-4" onClick={cancelSOS}>Cancel SOS</Button>
                </>
              ) : (
                <>
                  <div className="flex h-40 w-40 items-center justify-center rounded-full bg-warning-500 text-white">
                    <span className="font-display text-5xl font-bold">{countdown}</span>
                  </div>
                  <p className="mt-6 text-sm font-medium text-navy-700 dark:text-navy-200">Sending alert in {countdown}...</p>
                  <Button variant="outline" className="mt-3" onClick={() => setCountdown(3)}>Cancel</Button>
                </>
              )}
            </div>
          </Card>
        </div>
        <div className="space-y-4">
          <Card>
            <CardHeader icon={<MapPin className="h-5 w-5" />} title="Nearest Stations" />
            <CardBody className="space-y-3">
              {nearbyStations.map((s) => (
                <div key={s.id} className="rounded-lg bg-navy-50 p-3 dark:bg-navy-800/50">
                  <p className="text-sm font-semibold text-navy-900 dark:text-navy-50">{s.name}</p>
                  <p className="text-xs text-navy-500 dark:text-navy-400">{s.area} · {s.district}</p>
                  <p className="mt-1 text-xs font-medium text-teal-700 dark:text-teal-300">{s.phone}</p>
                </div>
              ))}
            </CardBody>
          </Card>
          <Card className="border-danger-200 dark:border-danger-500/30">
            <CardBody>
              <p className="text-sm font-semibold text-danger-700 dark:text-danger-400">Emergency Numbers</p>
              <div className="mt-2 space-y-1 text-sm text-navy-700 dark:text-navy-200">
                <p>Police: <span className="font-bold">100</span></p>
                <p>Ambulance: <span className="font-bold">108</span></p>
                <p>Cyber Crime: <span className="font-bold">1930</span></p>
                <p>Women Helpline: <span className="font-bold">1091</span></p>
              </div>
            </CardBody>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}

function LostFound() {
  const { push } = useToast();
  const [items, setItems] = useState([
    { id: 'lf_1', name: 'Brown leather wallet', area: 'Phoenix Marketcity', date: '2025-12-22', status: 'searching' },
  ]);
  const [itemName, setItemName] = useState('');
  const [itemArea, setItemArea] = useState('');
  const [description, setDescription] = useState('');

  const report = (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName) { push('warning', 'Please describe the lost item.'); return; }
    setItems([{ id: `lf_${Date.now()}`, name: itemName, area: itemArea, date: new Date().toISOString().slice(0, 10), status: 'searching' }, ...items]);
    setItemName(''); setItemArea(''); setDescription('');
    push('success', 'Lost item report filed. You will be notified if it is found.');
  };

  return (
    <PortalLayout role="citizen" nav={nav} accent="teal">
      <PageHeader title="Lost & Found" subtitle="Report lost items or browse found items deposited at stations" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader icon={<Package className="h-5 w-5" />} title="Report a Lost Item" />
          <CardBody className="space-y-4">
            <Input label="Item Name" value={itemName} onChange={(e) => setItemName(e.target.value)} placeholder="e.g., Brown leather wallet" />
            <Input label="Last Seen Location" value={itemArea} onChange={(e) => setItemArea(e.target.value)} placeholder="e.g., Phoenix Marketcity" />
            <Textarea label="Description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the item — color, brand, contents..." />
            <Button onClick={report} className="w-full">Report Lost Item</Button>
          </CardBody>
        </Card>
        <Card>
          <CardHeader icon={<ClipboardList className="h-5 w-5" />} title="Your Reports" subtitle={`${items.length} item(s) reported`} />
          <CardBody className="space-y-3">
            {items.map((it) => (
              <div key={it.id} className="flex items-center justify-between rounded-lg bg-navy-50 p-3 dark:bg-navy-800/50">
                <div>
                  <p className="text-sm font-semibold text-navy-900 dark:text-navy-50">{it.name}</p>
                  <p className="text-xs text-navy-500 dark:text-navy-400">{it.area} · {formatDate(it.date)}</p>
                </div>
                <span className="chip bg-warning-100 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300">Searching</span>
              </div>
            ))}
          </CardBody>
        </Card>
      </div>
    </PortalLayout>
  );
}

function CyberCrime() {
  const { push } = useToast();
  const [step, setStep] = useState(1);
  const [fraudType, setFraudType] = useState('investment');
  const [amount, setAmount] = useState('');
  const [platform, setPlatform] = useState('');
  const [description, setDescription] = useState('');

  const submit = () => {
    push('success', 'Cyber crime complaint filed. Call 1930 to freeze fraudulent transactions immediately.');
    setStep(1);
  };

  return (
    <PortalLayout role="citizen" nav={nav} accent="teal">
      <PageHeader title="Cyber Crime Report" subtitle="Report online fraud, scams, and cyber attacks" />
      <Card className="mb-4 border-gold-200 bg-gold-50/40 dark:border-gold-500/30 dark:bg-gold-500/5">
        <CardBody className="flex items-center gap-3">
          <ShieldAlert className="h-5 w-5 text-gold-600 dark:text-gold-400" />
          <p className="text-sm text-navy-700 dark:text-navy-200">If money was stolen, call <span className="font-bold text-gold-700 dark:text-gold-300">1930</span> immediately to report and freeze the transaction. Time is critical.</p>
        </CardBody>
      </Card>
      <Card>
        <CardBody>
          {/* steps */}
          <div className="mb-6 flex items-center justify-between">
            {[1, 2, 3].map((s) => (
              <div key={s} className="flex flex-1 items-center">
                <div className={cn('flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold', step >= s ? 'bg-teal-600 text-white' : 'bg-navy-100 text-navy-400 dark:bg-navy-800')}>
                  {s}
                </div>
                {s < 3 && <div className={cn('mx-2 h-1 flex-1 rounded', step > s ? 'bg-teal-500' : 'bg-navy-100 dark:bg-navy-800')} />}
              </div>
            ))}
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <Select label="Type of Fraud" value={fraudType} onChange={(e) => setFraudType(e.target.value)} options={[
                { value: 'investment', label: 'Investment / Trading Scam' },
                { value: 'upi', label: 'UPI / Payment Fraud' },
                { value: 'phishing', label: 'Phishing / Identity Theft' },
                { value: 'social_media', label: 'Social Media Crime' },
                { value: 'ransomware', label: 'Ransomware / Hacking' },
                { value: 'other', label: 'Other Cyber Crime' },
              ]} />
              <Input label="Amount Lost (₹)" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="e.g., 50000" type="number" />
              <div className="flex justify-end"><Button onClick={() => setStep(2)}>Next</Button></div>
            </div>
          )}
          {step === 2 && (
            <div className="space-y-4">
              <Input label="Platform / App Used" value={platform} onChange={(e) => setPlatform(e.target.value)} placeholder="e.g., WhatsApp, TrustInvest Pro app, fake website URL" />
              <Textarea label="What Happened" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Describe the fraud in detail — how you were contacted, what was promised, how money was transferred..." />
              <div className="flex justify-between"><Button variant="outline" onClick={() => setStep(1)}>Back</Button><Button onClick={() => setStep(3)}>Next</Button></div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div className="rounded-lg bg-navy-50 p-4 dark:bg-navy-800/50">
                <p className="mb-2 font-semibold text-navy-900 dark:text-navy-50">Review your complaint</p>
                <div className="space-y-1 text-sm text-navy-600 dark:text-navy-300">
                  <p>Fraud type: <span className="font-medium">{fraudType}</span></p>
                  <p>Amount: <span className="font-medium">₹{amount || '0'}</span></p>
                  <p>Platform: <span className="font-medium">{platform || 'N/A'}</span></p>
                </div>
              </div>
              <div className="flex justify-between"><Button variant="outline" onClick={() => setStep(2)}>Back</Button><Button onClick={submit}>Submit Complaint</Button></div>
            </div>
          )}
        </CardBody>
      </Card>
    </PortalLayout>
  );
}

function Appointments() {
  const { push } = useToast();
  const myAppts = appointments;
  const [stationId, setStationId] = useState(stations[0].id);
  const [purpose, setPurpose] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('10:00');

  const book = (e: React.FormEvent) => {
    e.preventDefault();
    if (!purpose || !date) { push('warning', 'Please fill all fields.'); return; }
    push('success', 'Appointment booked! You will receive a confirmation SMS.');
  };

  return (
    <PortalLayout role="citizen" nav={nav} accent="teal">
      <PageHeader title="Appointments" subtitle="Book a visit to your nearest police station" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader icon={<Calendar className="h-5 w-5" />} title="Book Appointment" />
          <CardBody className="space-y-4">
            <Select label="Police Station" value={stationId} onChange={(e) => setStationId(e.target.value)} options={stations.map((s) => ({ value: s.id, label: s.name }))} />
            <Input label="Purpose" value={purpose} onChange={(e) => setPurpose(e.target.value)} placeholder="e.g., Passport verification, statement recording" />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Date" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
              <Select label="Time" value={time} onChange={(e) => setTime(e.target.value)} options={['09:00', '10:00', '11:00', '12:00', '15:00', '16:00', '17:00'].map((t) => ({ value: t, label: t }))} />
            </div>
            <Button onClick={book} className="w-full">Book Appointment</Button>
          </CardBody>
        </Card>
        <Card>
          <CardHeader icon={<ClipboardList className="h-5 w-5" />} title="My Appointments" subtitle={`${myAppts.length} scheduled`} />
          <CardBody className="space-y-3">
            {myAppts.map((a) => {
              const st = stations.find((s) => s.id === a.stationId);
              return (
                <div key={a.id} className="flex items-center justify-between rounded-lg bg-navy-50 p-3 dark:bg-navy-800/50">
                  <div>
                    <p className="text-sm font-semibold text-navy-900 dark:text-navy-50">{a.purpose}</p>
                    <p className="text-xs text-navy-500 dark:text-navy-400">{st?.name}</p>
                    <p className="text-xs text-navy-500 dark:text-navy-400">{formatDate(a.date)} at {a.time}</p>
                  </div>
                  <span className={cn('chip', a.status === 'scheduled' ? 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300' : 'bg-navy-100 text-navy-500')}>{a.status}</span>
                </div>
              );
            })}
          </CardBody>
        </Card>
      </div>
    </PortalLayout>
  );
}

function NearbyStations() {
  const markers = stations.map((s) => ({ id: s.id, lat: s.lat, lng: s.lng, label: s.area, type: 'station' as const }));
  return (
    <PortalLayout role="citizen" nav={nav} accent="teal">
      <PageHeader title="Nearby Police Stations" subtitle="Find stations close to your location" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <Card>
            <CardBody>
              <MapView markers={markers} height={400} />
            </CardBody>
          </Card>
        </div>
        <div className="space-y-3">
          {stations.map((s) => (
            <Card key={s.id}>
              <CardBody>
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-100 text-navy-700 dark:bg-navy-800 dark:text-navy-200">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-navy-900 dark:text-navy-50">{s.name}</p>
                    <p className="text-xs text-navy-500 dark:text-navy-400">{s.area} · {s.district}</p>
                    <p className="mt-1 text-xs font-medium text-teal-700 dark:text-teal-300">{s.phone}</p>
                    <p className="text-xs text-navy-400">Jurisdiction: {s.jurisdiction}</p>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
}

function CitizenAssistant() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);

  const send = (q: string) => {
    setMessages((m) => [...m, makeChatMessage('user', q)]);
    setLoading(true);
    setTimeout(() => {
      const res = citizenChatbotAnswer(q);
      setMessages((m) => [...m, makeChatMessage('assistant', res.content)]);
      setLoading(false);
    }, 700);
  };

  return (
    <PortalLayout role="citizen" nav={nav} accent="teal">
      <PageHeader title="AI Crime Awareness Assistant" subtitle="Ask about police services, FIR filing, cyber safety, and more" />
      <div style={{ height: 'calc(100vh - 12rem)' }}>
        <ChatPanel
          title="KSP Citizen Assistant"
          subtitle="AI-powered · Available 24/7"
          placeholder="Ask about filing an FIR, cyber fraud, lost items..."
          messages={messages}
          onSend={send}
          loading={loading}
          accent="teal"
          suggestions={['How do I file an FIR?', 'What is the SOS feature?', 'How to report cyber fraud?', 'How to report a lost item?']}
        />
      </div>
    </PortalLayout>
  );
}

function CitizenNotifications() {
  const citizenNotifs = [...complaints, ...alerts.filter((a) => a.scope === 'citizen')].slice(0, 8);
  return (
    <PortalLayout role="citizen" nav={nav} accent="teal">
      <PageHeader title="Notifications" subtitle="Updates on your complaints and safety alerts" />
      <div className="space-y-3">
        {citizenNotifs.map((n) => (
          <Card key={(n as { id: string }).id}>
            <CardBody className="flex items-start gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300">
                <Bell className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-navy-900 dark:text-navy-50">{(n as { title: string }).title}</p>
                <p className="mt-0.5 text-xs text-navy-500 dark:text-navy-400">{(n as { message?: string }).message || (n as { description: string }).description}</p>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>
    </PortalLayout>
  );
}

function CitizenProfile() {
  const { user } = useAuth();
  const { push } = useToast();
  if (!user) return null;
  const myComplaints = complaints.filter((c) => c.citizenId === user.id);

  return (
    <PortalLayout role="citizen" nav={nav} accent="teal">
      <PageHeader title="My Profile" subtitle="Manage your personal information and preferences" />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card>
          <CardBody className="flex flex-col items-center text-center">
            <Avatar initials={user.initials} color={user.avatarColor} size="lg" />
            <p className="mt-3 font-display text-lg font-bold text-navy-900 dark:text-navy-50">{user.name}</p>
            <p className="text-sm text-navy-500 dark:text-navy-400">{user.email}</p>
            <div className="mt-3 flex gap-2">
              <span className="chip bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300">Citizen</span>
              <span className="chip bg-navy-100 text-navy-600 dark:bg-navy-800 dark:text-navy-300">{myComplaints.length} Complaints</span>
            </div>
          </CardBody>
        </Card>
        <div className="lg:col-span-2">
          <Card>
            <CardHeader title="Personal Information" />
            <CardBody className="space-y-4">
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Input label="Full Name" defaultValue={user.name} />
                <Input label="Email" defaultValue={user.email} />
                <Input label="Phone" defaultValue={user.phone} />
                <Input label="Citizen ID" defaultValue={user.citizenId} readOnly />
                <Input label="District" defaultValue="Bengaluru Urban" />
                <Input label="Address" defaultValue={user.address} />
              </div>
              <Button onClick={() => push('success', 'Profile updated successfully.')}>Save Changes</Button>
            </CardBody>
          </Card>
        </div>
      </div>
    </PortalLayout>
  );
}
