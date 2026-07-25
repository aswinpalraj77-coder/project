import { type ReactNode, useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/format';

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  footer?: ReactNode;
}

const sizeMap = {
  sm: 'max-w-md', md: 'max-w-lg', lg: 'max-w-2xl', xl: 'max-w-4xl',
};

export function Modal({ open, onClose, title, subtitle, children, size = 'md', footer }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handler);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className={cn('surface relative z-10 max-h-[90vh] w-full overflow-hidden shadow-elevated animate-slide-in-up', sizeMap[size])}>
        <div className="flex items-start justify-between border-b border-navy-100 p-5 dark:border-navy-800">
          <div>
            <h3 className="font-display text-lg font-semibold text-navy-900 dark:text-navy-50">{title}</h3>
            {subtitle && <p className="mt-0.5 text-sm text-navy-500 dark:text-navy-400">{subtitle}</p>}
          </div>
          <button onClick={onClose} className="rounded-lg p-1.5 text-navy-400 transition hover:bg-navy-100 hover:text-navy-700 dark:hover:bg-navy-800 dark:hover:text-navy-200">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="max-h-[calc(90vh-9rem)] overflow-y-auto scrollbar-thin p-5">{children}</div>
        {footer && <div className="flex justify-end gap-2 border-t border-navy-100 p-4 dark:border-navy-800">{footer}</div>}
      </div>
    </div>
  );
}

export function ConfirmDialog({ open, onClose, onConfirm, title, message, confirmLabel = 'Confirm', danger }: { open: boolean; onClose: () => void; onConfirm: () => void; title: string; message: string; confirmLabel?: string; danger?: boolean }) {
  return (
    <Modal open={open} onClose={onClose} title={title} size="sm"
      footer={
        <>
          <button onClick={onClose} className="rounded-xl px-4 py-2 text-sm font-semibold text-navy-600 hover:bg-navy-100 dark:text-navy-300 dark:hover:bg-navy-800">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className={cn('rounded-xl px-4 py-2 text-sm font-semibold text-white', danger ? 'bg-danger-600 hover:bg-danger-700' : 'bg-navy-700 hover:bg-navy-800')}>{confirmLabel}</button>
        </>
      }
    >
      <p className="text-sm text-navy-600 dark:text-navy-300">{message}</p>
    </Modal>
  );
}
