import { type ReactNode, type HTMLAttributes } from 'react';
import { cn } from '@/lib/format';

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn('surface', className)} {...props}>
      {children}
    </div>
  );
}

export function CardHeader({ title, subtitle, action, icon }: { title: ReactNode; subtitle?: ReactNode; action?: ReactNode; icon?: ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-navy-100 p-5 dark:border-navy-800">
      <div className="flex items-start gap-3">
        {icon && <div className="mt-0.5 flex h-9 w-9 items-center justify-center rounded-lg bg-navy-50 text-navy-700 dark:bg-navy-800 dark:text-navy-200">{icon}</div>}
        <div>
          <h3 className="font-display text-base font-semibold text-navy-900 dark:text-navy-50">{title}</h3>
          {subtitle && <p className="mt-0.5 text-sm text-navy-500 dark:text-navy-400">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  );
}

export function CardBody({ className, children }: { className?: string; children: ReactNode }) {
  return <div className={cn('p-5', className)}>{children}</div>;
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return <span className={cn('chip', className)}>{children}</span>;
}

export function StatCard({ label, value, icon, trend, color = 'navy' }: { label: string; value: ReactNode; icon: ReactNode; trend?: { value: string; up: boolean }; color?: 'navy' | 'teal' | 'gold' | 'danger' | 'success' | 'warning' }) {
  const colorMap = {
    navy: 'bg-navy-50 text-navy-700 dark:bg-navy-800 dark:text-navy-200',
    teal: 'bg-teal-50 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300',
    gold: 'bg-gold-50 text-gold-700 dark:bg-gold-500/15 dark:text-gold-300',
    danger: 'bg-danger-50 text-danger-700 dark:bg-danger-500/15 dark:text-danger-300',
    success: 'bg-success-50 text-success-700 dark:bg-success-500/15 dark:text-success-300',
    warning: 'bg-warning-50 text-warning-700 dark:bg-warning-500/15 dark:text-warning-300',
  };
  return (
    <Card className="p-5 transition hover:shadow-card-hover">
      <div className="flex items-center justify-between">
        <div className={cn('flex h-11 w-11 items-center justify-center rounded-xl', colorMap[color])}>{icon}</div>
        {trend && (
          <span className={cn('text-xs font-semibold', trend.up ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400')}>
            {trend.up ? '↑' : '↓'} {trend.value}
          </span>
        )}
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-navy-900 dark:text-navy-50">{value}</p>
      <p className="mt-0.5 text-sm text-navy-500 dark:text-navy-400">{label}</p>
    </Card>
  );
}

export function EmptyState({ icon, title, description, action }: { icon: ReactNode; title: string; description?: string; action?: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-navy-50 text-navy-400 dark:bg-navy-800 dark:text-navy-500">{icon}</div>
      <h3 className="mt-4 font-display text-base font-semibold text-navy-800 dark:text-navy-100">{title}</h3>
      {description && <p className="mt-1 max-w-sm text-sm text-navy-500 dark:text-navy-400">{description}</p>}
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

export function Skeleton({ className }: { className?: string }) {
  return <div className={cn('skeleton h-4 w-full', className)} />;
}

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl font-bold text-navy-900 dark:text-navy-50">{title}</h1>
        {subtitle && <p className="mt-1 text-sm text-navy-500 dark:text-navy-400">{subtitle}</p>}
      </div>
      {actions && <div className="flex items-center gap-2">{actions}</div>}
    </div>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <div className="mb-3 flex items-center justify-between">
      <h2 className="font-display text-sm font-semibold uppercase tracking-wide text-navy-500 dark:text-navy-400">{children}</h2>
      {action}
    </div>
  );
}
