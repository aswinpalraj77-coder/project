import { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X, type LucideIcon } from 'lucide-react';

export type ToastType = 'success' | 'warning' | 'error' | 'info' | 'critical';
interface Toast { id: string; type: ToastType; message: string; }

interface ToastCtx {
  push: (type: ToastType, message: string) => void;
}

const Ctx = createContext<ToastCtx | null>(null);

const icons: Record<ToastType, LucideIcon> = {
  success: CheckCircle2, warning: AlertTriangle, error: XCircle, info: Info, critical: AlertTriangle,
};
const colors: Record<ToastType, string> = {
  success: 'text-success-600 dark:text-success-400',
  warning: 'text-warning-600 dark:text-warning-400',
  error: 'text-danger-600 dark:text-danger-400',
  info: 'text-blue-600 dark:text-blue-400',
  critical: 'text-danger-600 dark:text-danger-400',
};

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const push = useCallback((type: ToastType, message: string) => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, type, message }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 4000);
  }, []);

  const remove = (id: string) => setToasts((t) => t.filter((x) => x.id !== id));

  return (
    <Ctx.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => {
          const Icon = icons[t.type];
          return (
            <div
              key={t.id}
              className="surface flex items-start gap-3 p-3.5 shadow-elevated animate-slide-in-right"
            >
              <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${colors[t.type]}`} />
              <p className="flex-1 text-sm text-navy-800 dark:text-navy-100">{t.message}</p>
              <button onClick={() => remove(t.id)} className="text-navy-400 hover:text-navy-700 dark:hover:text-navy-200">
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>
    </Ctx.Provider>
  );
}

export function useToast() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useToast must be used within ToastProvider');
  return ctx;
}
