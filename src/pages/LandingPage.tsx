import { Shield, Users, UserCog, ArrowRight, Sparkles, MapPin, Brain, MessageSquare } from 'lucide-react';
import { useRouter } from '@/router';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { useTheme } from '@/context/ThemeContext';

export function LandingPage() {
  const { navigate } = useRouter();
  const { loginAs } = useAuth();
  const { theme, toggle } = useTheme();

  const portals = [
    { role: 'citizen' as const, title: 'Citizen Portal', desc: 'File complaints, track cases, emergency SOS, cybercrime reporting, and public services.', icon: Users, color: 'from-teal-500 to-teal-600', features: ['File e-FIR', 'Track complaints', 'Emergency SOS', 'AI awareness chatbot'] },
    { role: 'officer' as const, title: 'Officer Portal', desc: 'AI crime search, case management, criminal networks, hotspot prediction, and patrol planning.', icon: Shield, color: 'from-navy-600 to-navy-700', features: ['AI Crime Assistant', 'Case Summarizer', 'Criminal Network Graph', 'Officer Copilot'] },
    { role: 'admin' as const, title: 'Administrator Portal', desc: 'User and officer management, department hierarchy, AI model control, audit logs, and system health.', icon: UserCog, color: 'from-gold-500 to-gold-600', features: ['User & officer management', 'Role & permissions', 'AI model management', 'Audit & security monitoring'] },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-navy-50 via-white to-teal-50/30 dark:from-navy-950 dark:via-navy-900 dark:to-navy-950">
      {/* top bar */}
      <header className="sticky top-0 z-30 glass border-b border-navy-100 dark:border-navy-800">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-navy-700 text-white shadow-sm dark:bg-navy-600">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <p className="font-display text-base font-bold leading-tight text-navy-900 dark:text-navy-50">KSP</p>
              <p className="text-[10px] leading-tight text-navy-500 dark:text-navy-400">AI Crime Intelligence Platform</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={toggle} className="rounded-lg border border-navy-200 px-3 py-1.5 text-xs font-medium text-navy-600 transition hover:bg-navy-50 dark:border-navy-700 dark:text-navy-300 dark:hover:bg-navy-800">
              {theme === 'light' ? 'Dark' : 'Light'}
            </button>
            <Button size="sm" onClick={() => navigate('/login')}>Sign In</Button>
          </div>
        </div>
      </header>

      {/* hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 grid-pattern opacity-40" />
        <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-24">
          <div className="inline-flex items-center gap-2 rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-xs font-medium text-teal-700 dark:border-teal-500/30 dark:bg-teal-500/10 dark:text-teal-300">
            <Sparkles className="h-3.5 w-3.5" />
            Datathon 2026 · Karnataka State Police
          </div>
          <h1 className="mx-auto mt-6 max-w-3xl font-display text-4xl font-bold tracking-tight text-navy-900 dark:text-navy-50 sm:text-5xl md:text-6xl">
            AI-Powered Crime Intelligence for a Safer Karnataka
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-base text-navy-600 dark:text-navy-300 sm:text-lg">
            A unified platform connecting citizens, officers, and administrators. Predict, investigate, and solve crime faster with AI built for real deployment.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Button size="lg" onClick={() => navigate('/login')}>
              Enter a Portal <ArrowRight className="h-4 w-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => { loginAs('officer'); navigate('/officer'); }}>
              Try Officer Demo
            </Button>
          </div>

          {/* feature highlights */}
          <div className="mx-auto mt-14 grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-3">
            {[
              { icon: Brain, title: 'AI Crime Assistant', desc: 'Search FIRs in natural language' },
              { icon: MapPin, title: 'Hotspot Prediction', desc: 'Deploy patrols before incidents' },
              { icon: MessageSquare, title: 'Officer Copilot', desc: 'Generate briefings instantly' },
            ].map((f) => (
              <div key={f.title} className="surface p-5 text-left">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300">
                  <f.icon className="h-5 w-5" />
                </div>
                <p className="mt-3 font-display text-sm font-semibold text-navy-900 dark:text-navy-50">{f.title}</p>
                <p className="mt-0.5 text-xs text-navy-500 dark:text-navy-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* portals */}
      <section className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16">
        <h2 className="text-center font-display text-2xl font-bold text-navy-900 dark:text-navy-50">Choose your portal</h2>
        <p className="mt-2 text-center text-sm text-navy-500 dark:text-navy-400">Each portal has its own tools, workflows, and permissions.</p>
        <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
          {portals.map((p) => (
            <div key={p.role} className="surface group overflow-hidden transition hover:shadow-elevated">
              <div className={`h-2 bg-gradient-to-r ${p.color}`} />
              <div className="p-6">
                <div className={`flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${p.color} text-white shadow-sm`}>
                  <p.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-4 font-display text-lg font-bold text-navy-900 dark:text-navy-50">{p.title}</h3>
                <p className="mt-1.5 text-sm text-navy-500 dark:text-navy-400">{p.desc}</p>
                <ul className="mt-4 space-y-2">
                  {p.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-navy-700 dark:text-navy-200">
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-teal-100 text-teal-700 dark:bg-teal-500/20 dark:text-teal-300">
                        <svg className="h-2.5 w-2.5" viewBox="0 0 12 12" fill="none"><path d="M2 6l3 3 5-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Button className="mt-5 w-full" variant="outline" onClick={() => { loginAs(p.role); navigate(`/${p.role}`); }}>
                  Enter {p.title.split(' ')[0]} <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* footer */}
      <footer className="border-t border-navy-100 bg-white py-8 dark:border-navy-800 dark:bg-navy-900">
        <div className="mx-auto max-w-7xl px-4 text-center text-xs text-navy-500 dark:text-navy-400 sm:px-6">
          <p>KSP AI Crime Intelligence Platform · Datathon 2026 Submission · Built for Karnataka State Police</p>
          <p className="mt-1">Demo prototype — all data is simulated. Not for operational use.</p>
        </div>
      </footer>
    </div>
  );
}
