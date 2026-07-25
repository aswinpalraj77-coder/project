import { useState } from 'react';
import { Shield, Users, UserCog, ArrowLeft, Lock, Mail } from 'lucide-react';
import { useRouter } from '@/router';
import { useAuth, demoAccounts } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Form';
import { useToast } from '@/context/ToastContext';
import type { Role } from '@/types';
import { cn } from '@/lib/format';

export function LoginPage() {
  const { navigate } = useRouter();
  const { login, loginAs } = useAuth();
  const { push } = useToast();
  const [role, setRole] = useState<Role>('officer');
  const [email, setEmail] = useState(demoAccounts.officer.email);
  const [password, setPassword] = useState(demoAccounts.officer.password);
  const [error, setError] = useState('');

  const roles: { key: Role; label: string; icon: typeof Shield; color: string }[] = [
    { key: 'citizen', label: 'Citizen', icon: Users, color: 'teal' },
    { key: 'officer', label: 'Police Officer', icon: Shield, color: 'navy' },
    { key: 'admin', label: 'Administrator', icon: UserCog, color: 'gold' },
  ];

  const selectRole = (r: Role) => {
    setRole(r);
    setEmail(demoAccounts[r].email);
    setPassword(demoAccounts[r].password);
    setError('');
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (login(role, email, password)) {
      push('success', `Welcome back! Entering ${role} portal.`);
      navigate(`/${role}`);
    } else {
      setError('Invalid credentials. Try the demo account or use quick login.');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-navy-50 via-white to-teal-50/30 p-4 dark:from-navy-950 dark:via-navy-900 dark:to-navy-950">
      <div className="w-full max-w-md">
        <button onClick={() => navigate('/')} className="mb-6 flex items-center gap-1.5 text-sm text-navy-500 transition hover:text-navy-800 dark:text-navy-400 dark:hover:text-navy-200">
          <ArrowLeft className="h-4 w-4" /> Back to home
        </button>

        <div className="surface overflow-hidden">
          <div className="bg-navy-800 p-6 text-center text-white dark:bg-navy-700">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 backdrop-blur">
              <Shield className="h-8 w-8" />
            </div>
            <h1 className="mt-3 font-display text-xl font-bold">KSP Platform Sign In</h1>
            <p className="mt-1 text-xs text-navy-200">Select your role to continue</p>
          </div>

          <div className="p-6">
            {/* role selector */}
            <div className="mb-5 grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button
                  key={r.key}
                  onClick={() => selectRole(r.key)}
                  className={cn(
                    'flex flex-col items-center gap-1.5 rounded-xl border p-3 transition',
                    role === r.key
                      ? 'border-teal-500 bg-teal-50 text-teal-700 dark:border-teal-400 dark:bg-teal-500/10 dark:text-teal-300'
                      : 'border-navy-200 text-navy-500 hover:border-navy-300 dark:border-navy-700 dark:text-navy-400 dark:hover:border-navy-600',
                  )}
                >
                  <r.icon className="h-5 w-5" />
                  <span className="text-xs font-medium">{r.label}</span>
                </button>
              ))}
            </div>

            <form onSubmit={submit} className="space-y-4">
              <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} icon={<Mail className="h-4 w-4" />} placeholder="you@ksp.gov.in" />
              <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} icon={<Lock className="h-4 w-4" />} placeholder="••••••••" />
              {error && <p className="rounded-lg bg-danger-50 px-3 py-2 text-xs text-danger-700 dark:bg-danger-500/10 dark:text-danger-400">{error}</p>}
              <Button type="submit" className="w-full" size="lg">Sign In</Button>
            </form>

            <div className="my-4 flex items-center gap-3">
              <div className="h-px flex-1 bg-navy-100 dark:bg-navy-800" />
              <span className="text-xs text-navy-400">or quick demo login</span>
              <div className="h-px flex-1 bg-navy-100 dark:bg-navy-800" />
            </div>

            <Button variant="outline" className="w-full" onClick={() => { loginAs(role); push('info', `Demo login as ${role}`); navigate(`/${role}`); }}>
              Enter {roles.find((r) => r.key === role)?.label} Demo
            </Button>

            <div className="mt-4 rounded-lg bg-navy-50 p-3 text-xs text-navy-500 dark:bg-navy-800/50 dark:text-navy-400">
              <p className="font-semibold text-navy-700 dark:text-navy-200">Demo credentials:</p>
              <p className="mt-1">Citizen: ramesh.iyer@gmail.com / citizen123</p>
              <p>Officer: arjun.rao@ksp.gov.in / officer123</p>
              <p>Admin: admin@ksp.gov.in / admin123</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
