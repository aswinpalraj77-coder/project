import { createContext, useContext, useState, type ReactNode } from 'react';
import type { User, Role } from '@/types';
import { officers, citizens } from '@/data/mock';

interface AuthCtx {
  user: User | null;
  login: (role: Role, email: string, password: string) => boolean;
  logout: () => void;
  loginAs: (role: Role) => void;
}

const Ctx = createContext<AuthCtx | null>(null);

const demoAccounts: Record<Role, { email: string; password: string; user: User }> = {
  citizen: {
    email: 'ramesh.iyer@gmail.com',
    password: 'citizen123',
    user: {
      id: 'ct_ramesh', name: 'Ramesh Iyer', role: 'citizen', email: 'ramesh.iyer@gmail.com',
      phone: '90080-12345', avatarColor: 'bg-navy-600', initials: 'RI',
      citizenId: 'KA-CT-2025-0042', address: 'Prestige Lakeside, Whitefield, Bengaluru',
    },
  },
  officer: {
    email: 'arjun.rao@ksp.gov.in',
    password: 'officer123',
    user: {
      id: 'of_arjun', name: 'Arjun Rao', role: 'officer', email: 'arjun.rao@ksp.gov.in',
      phone: '90080-11221', avatarColor: 'bg-navy-600', initials: 'AR',
      rank: 'Inspector', badgeId: 'KSP-4471', stationId: 'st_whitefield', district: 'Bengaluru Urban',
      department: 'Whitefield Police Station',
    },
  },
  admin: {
    email: 'admin@ksp.gov.in',
    password: 'admin123',
    user: {
      id: 'ad_1', name: 'Vikas Gupta', role: 'admin', email: 'admin@ksp.gov.in',
      phone: '90080-00001', avatarColor: 'bg-navy-700', initials: 'VG',
      rank: 'ADGP', department: 'State HQ', district: 'Bengaluru Urban',
    },
  },
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    if (typeof window === 'undefined') return null;
    const saved = localStorage.getItem('ksp-user');
    return saved ? JSON.parse(saved) : null;
  });

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem('ksp-user', JSON.stringify(u));
    else localStorage.removeItem('ksp-user');
  };

  const login = (role: Role, email: string, password: string): boolean => {
    const acc = demoAccounts[role];
    if (email.trim().toLowerCase() === acc.email && password === acc.password) {
      persist(acc.user);
      return true;
    }
    // also allow any officer/citizen email from mock
    if (role === 'officer') {
      const o = officers.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
      if (o && password === 'officer123') {
        persist({
          id: o.id, name: o.name, role: 'officer', email: o.email, phone: o.phone,
          avatarColor: o.avatarColor, initials: o.initials, rank: o.rank, badgeId: o.badgeId,
          stationId: o.stationId, district: o.district, department: o.name,
        });
        return true;
      }
    }
    if (role === 'citizen') {
      const c = citizens.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
      if (c && password === 'citizen123') {
        persist({
          id: c.id, name: c.name, role: 'citizen', email: c.email, phone: c.phone,
          avatarColor: c.avatarColor, initials: c.initials, citizenId: `KA-CT-2025-${String(c.complaints).padStart(4, '0')}`,
          address: c.address,
        });
        return true;
      }
    }
    return false;
  };

  const loginAs = (role: Role) => {
    persist(demoAccounts[role].user);
  };

  const logout = () => persist(null);

  return <Ctx.Provider value={{ user, login, logout, loginAs }}>{children}</Ctx.Provider>;
}

export function useAuth() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}

export { demoAccounts };
