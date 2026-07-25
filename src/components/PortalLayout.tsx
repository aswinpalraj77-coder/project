import { useState, type ReactNode } from 'react';
import {
  Shield, Bell, Search, Menu, X, Sun, Moon, LogOut, ChevronDown, Settings,
} from 'lucide-react';
import { useRouter } from '@/router';
import { useAuth } from '@/context/AuthContext';
import { useTheme } from '@/context/ThemeContext';
import { Avatar } from '@/components/ui/Form';
import { cn, timeAgo } from '@/lib/format';
import { notifications } from '@/data/mock';
import type { Role } from '@/types';

interface NavItem {
  label: string;
  path: string;
  icon: typeof Shield;
  badge?: number;
}

interface PortalLayoutProps {
  role: Role;
  nav: NavItem[];
  children: ReactNode;
  accent?: 'navy' | 'teal' | 'gold';
}

export function PortalLayout({ role, nav, children, accent = 'navy' }: PortalLayoutProps) {
  const { path, navigate } = useRouter();
  const { user, logout } = useAuth();
  const { theme, toggle } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const roleLabels = { citizen: 'Citizen', officer: 'Police Officer', admin: 'Administrator' };
  const accentBg = { navy: 'bg-navy-700', teal: 'bg-teal-600', gold: 'bg-gold-500' }[accent];

  const myNotifs = notifications.filter((n) => n.scope === role || n.scope === 'all');
  const unread = myNotifs.filter((n) => !n.read).length;

  const isActive = (itemPath: string) => {
    if (itemPath === `/${role}`) return path === itemPath;
    return path.startsWith(itemPath);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <div className="flex min-h-screen bg-navy-50 dark:bg-navy-950">
      {/* sidebar */}
      <aside className={cn(
        'fixed inset-y-0 left-0 z-40 w-64 transform border-r border-navy-100 bg-white transition-transform dark:border-navy-800 dark:bg-navy-900 lg:translate-x-0',
        sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
      )}>
        <div className="flex h-16 items-center gap-2.5 border-b border-navy-100 px-5 dark:border-navy-800">
          <div className={cn('flex h-9 w-9 items-center justify-center rounded-xl text-white', accentBg)}>
            <Shield className="h-5 w-5" />
          </div>
          <div>
            <p className="font-display text-sm font-bold leading-tight text-navy-900 dark:text-navy-50">KSP Platform</p>
            <p className="text-[10px] leading-tight text-navy-500 dark:text-navy-400">{roleLabels[role]} Portal</p>
          </div>
        </div>

        <nav className="flex max-h-[calc(100vh-4rem)] flex-col gap-0.5 overflow-y-auto scrollbar-thin p-3">
          {nav.map((item) => (
            <button
              key={item.path}
              onClick={() => { navigate(item.path); setSidebarOpen(false); }}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition',
                isActive(item.path)
                  ? accent === 'navy' ? 'bg-navy-700 text-white' : accent === 'teal' ? 'bg-teal-600 text-white' : 'bg-gold-500 text-white'
                  : 'text-navy-600 hover:bg-navy-50 dark:text-navy-300 dark:hover:bg-navy-800',
              )}
            >
              <item.icon className="h-4.5 w-4.5 shrink-0" />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge !== undefined && item.badge > 0 && (
                <span className="rounded-full bg-danger-500 px-1.5 py-0.5 text-[10px] font-bold text-white">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-navy-100 p-3 dark:border-navy-800">
          <button onClick={() => navigate(`/${role}/settings`)} className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-navy-600 transition hover:bg-navy-50 dark:text-navy-300 dark:hover:bg-navy-800">
            <Settings className="h-4.5 w-4.5" /> Settings
          </button>
        </div>
      </aside>

      {/* overlay */}
      {sidebarOpen && <div className="fixed inset-0 z-30 bg-navy-950/40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* main */}
      <div className="flex flex-1 flex-col lg:pl-64">
        {/* topbar */}
        <header className="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-navy-100 bg-white/80 px-4 backdrop-blur-xl dark:border-navy-800 dark:bg-navy-900/80 sm:px-6">
          <button onClick={() => setSidebarOpen(true)} className="rounded-lg p-2 text-navy-600 hover:bg-navy-100 dark:text-navy-300 dark:hover:bg-navy-800 lg:hidden">
            <Menu className="h-5 w-5" />
          </button>

          <div className="relative hidden flex-1 sm:block">
            <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-navy-400" />
            <input
              placeholder="Search cases, FIRs, suspects..."
              className="h-9 w-full max-w-md rounded-xl border border-navy-200 bg-navy-50/50 pl-10 pr-4 text-sm text-navy-900 placeholder-navy-400 transition focus:border-teal-500 focus:outline-none focus:ring-4 focus:ring-teal-500/10 dark:border-navy-700 dark:bg-navy-800/50 dark:text-navy-100"
            />
          </div>

          <div className="flex flex-1 items-center justify-end gap-2 sm:flex-none">
            <button onClick={toggle} className="rounded-lg p-2 text-navy-600 transition hover:bg-navy-100 dark:text-navy-300 dark:hover:bg-navy-800">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {/* notifications */}
            <div className="relative">
              <button onClick={() => { setNotifOpen(!notifOpen); setProfileOpen(false); }} className="relative rounded-lg p-2 text-navy-600 transition hover:bg-navy-100 dark:text-navy-300 dark:hover:bg-navy-800">
                <Bell className="h-5 w-5" />
                {unread > 0 && <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger-500 text-[9px] font-bold text-white">{unread}</span>}
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setNotifOpen(false)} />
                  <div className="absolute right-0 top-full z-40 mt-2 w-80 surface shadow-elevated animate-slide-in-up">
                    <div className="flex items-center justify-between border-b border-navy-100 p-3 dark:border-navy-800">
                      <p className="font-display text-sm font-semibold text-navy-900 dark:text-navy-50">Notifications</p>
                      <span className="text-xs text-navy-400">{unread} unread</span>
                    </div>
                    <div className="max-h-80 overflow-y-auto scrollbar-thin">
                      {myNotifs.map((n) => (
                        <div key={n.id} className={cn('border-b border-navy-50 p-3 dark:border-navy-800/50', !n.read && 'bg-teal-50/40 dark:bg-teal-500/5')}>
                          <div className="flex items-start gap-2">
                            <span className={cn('mt-1.5 h-2 w-2 shrink-0 rounded-full', n.type === 'success' ? 'bg-success-500' : n.type === 'warning' ? 'bg-warning-500' : n.type === 'error' ? 'bg-danger-500' : 'bg-blue-500')} />
                            <div className="flex-1">
                              <p className="text-sm font-medium text-navy-800 dark:text-navy-100">{n.title}</p>
                              <p className="mt-0.5 text-xs text-navy-500 dark:text-navy-400">{n.message}</p>
                              <p className="mt-1 text-[10px] text-navy-400">{timeAgo(n.createdAt)}</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* profile */}
            <div className="relative">
              <button onClick={() => { setProfileOpen(!profileOpen); setNotifOpen(false); }} className="flex items-center gap-2 rounded-xl p-1 pr-2 transition hover:bg-navy-100 dark:hover:bg-navy-800">
                <Avatar initials={user?.initials || '?'} color={user?.avatarColor || 'bg-navy-600'} size="sm" />
                <div className="hidden text-left sm:block">
                  <p className="text-xs font-semibold text-navy-900 dark:text-navy-50">{user?.name}</p>
                  <p className="text-[10px] text-navy-500 dark:text-navy-400">{user?.rank || roleLabels[role]}</p>
                </div>
                <ChevronDown className="hidden h-4 w-4 text-navy-400 sm:block" />
              </button>
              {profileOpen && (
                <>
                  <div className="fixed inset-0 z-30" onClick={() => setProfileOpen(false)} />
                  <div className="absolute right-0 top-full z-40 mt-2 w-56 surface shadow-elevated animate-slide-in-up">
                    <div className="border-b border-navy-100 p-3 dark:border-navy-800">
                      <p className="text-sm font-semibold text-navy-900 dark:text-navy-50">{user?.name}</p>
                      <p className="text-xs text-navy-500 dark:text-navy-400">{user?.email}</p>
                    </div>
                    <div className="p-1.5">
                      <button onClick={() => { navigate(`/${role}/profile`); setProfileOpen(false); }} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-navy-600 transition hover:bg-navy-50 dark:text-navy-300 dark:hover:bg-navy-800">
                        <Settings className="h-4 w-4" /> My Profile
                      </button>
                      <button onClick={handleLogout} className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm text-danger-600 transition hover:bg-danger-50 dark:text-danger-400 dark:hover:bg-danger-500/10">
                        <LogOut className="h-4 w-4" /> Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </header>

        {/* content */}
        <main className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>

      {/* close icon when sidebar open on mobile */}
      {sidebarOpen && (
        <button onClick={() => setSidebarOpen(false)} className="fixed right-4 top-4 z-50 rounded-lg bg-white p-2 text-navy-700 shadow-lg lg:hidden dark:bg-navy-900 dark:text-navy-200">
          <X className="h-5 w-5" />
        </button>
      )}
    </div>
  );
}
