import { type InputHTMLAttributes, type SelectHTMLAttributes, type TextareaHTMLAttributes, type ReactNode, forwardRef } from 'react';
import { cn } from '@/lib/format';

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement> & { label?: string; hint?: string; icon?: ReactNode }>(
  ({ label, hint, icon, className, ...props }, ref) => (
    <div>
      {label && <label className="label-base">{label}</label>}
      <div className="relative">
        {icon && <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-navy-400">{icon}</div>}
        <input ref={ref} className={cn('input-base', icon ? 'pl-10' : '', className)} {...props} />
      </div>
      {hint && <p className="mt-1 text-xs text-navy-400">{hint}</p>}
    </div>
  ),
);
Input.displayName = 'Input';

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaHTMLAttributes<HTMLTextAreaElement> & { label?: string }>(
  ({ label, className, ...props }, ref) => (
    <div>
      {label && <label className="label-base">{label}</label>}
      <textarea ref={ref} className={cn('input-base min-h-[100px] resize-y', className)} {...props} />
    </div>
  ),
);
Textarea.displayName = 'Textarea';

export const Select = forwardRef<HTMLSelectElement, SelectHTMLAttributes<HTMLSelectElement> & { label?: string; options: { value: string; label: string }[] }>(
  ({ label, options, className, ...props }, ref) => (
    <div>
      {label && <label className="label-base">{label}</label>}
      <select ref={ref} className={cn('input-base appearance-none bg-[url(\'data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns=%22http://www.w3.org/2000/svg%22%20width=%2212%22%20height=%2212%22%20viewBox=%220%200%2024%2024%22%20fill=%22none%22%20stroke=%22%2364748b%22%20stroke-width=%222%22%3E%3Cpath%20d=%22M6%209l6%206%206-6%22/%3E%3C/svg%3E\')]', className)} {...props}>
        {options.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
      </select>
    </div>
  ),
);
Select.displayName = 'Select';

export function Avatar({ initials, color, size = 'md' }: { initials: string; color: string; size?: 'sm' | 'md' | 'lg' }) {
  const sizes = { sm: 'h-8 w-8 text-xs', md: 'h-10 w-10 text-sm', lg: 'h-14 w-14 text-lg' };
  return (
    <div className={cn('flex shrink-0 items-center justify-center rounded-full font-semibold text-white', color, sizes[size])}>
      {initials}
    </div>
  );
}

export function ProgressBar({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn('h-2 w-full overflow-hidden rounded-full bg-navy-100 dark:bg-navy-800', className)}>
      <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${Math.min(100, value)}%` }} />
    </div>
  );
}

export function Tabs({ tabs, active, onChange }: { tabs: { key: string; label: string; count?: number }[]; active: string; onChange: (k: string) => void }) {
  return (
    <div className="flex gap-1 overflow-x-auto scrollbar-thin border-b border-navy-100 dark:border-navy-800">
      {tabs.map((t) => (
        <button
          key={t.key}
          onClick={() => onChange(t.key)}
          className={cn(
            'whitespace-nowrap border-b-2 px-4 py-2.5 text-sm font-medium transition',
            active === t.key
              ? 'border-teal-500 text-navy-900 dark:text-navy-50'
              : 'border-transparent text-navy-500 hover:text-navy-700 dark:text-navy-400 dark:hover:text-navy-200',
          )}
        >
          {t.label}
          {t.count !== undefined && (
            <span className={cn('ml-1.5 rounded-full px-1.5 py-0.5 text-xs', active === t.key ? 'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-300' : 'bg-navy-100 text-navy-500 dark:bg-navy-800 dark:text-navy-400')}>{t.count}</span>
          )}
        </button>
      ))}
    </div>
  );
}
