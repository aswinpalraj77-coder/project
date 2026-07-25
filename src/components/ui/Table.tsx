import { type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/format';

interface Column<T> {
  key: string;
  header: string;
  render?: (row: T) => ReactNode;
  className?: string;
}

interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  onRowClick?: (row: T) => void;
  empty?: ReactNode;
  rowKey?: (row: T) => string;
}

export function Table<T extends Record<string, any>>({ columns, data, onRowClick, empty, rowKey }: TableProps<T>) {
  if (data.length === 0 && empty) return <>{empty}</>;
  return (
    <div className="overflow-x-auto scrollbar-thin">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-navy-100 dark:border-navy-800">
            {columns.map((c) => (
              <th key={c.key} className={cn('whitespace-nowrap px-4 py-3 text-xs font-semibold uppercase tracking-wide text-navy-500 dark:text-navy-400', c.className)}>
                {c.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr
              key={rowKey ? rowKey(row) : (row.id || i)}
              onClick={() => onRowClick?.(row)}
              className={cn(
                'border-b border-navy-50 transition last:border-0 dark:border-navy-800/50',
                onRowClick && 'cursor-pointer hover:bg-navy-50 dark:hover:bg-navy-800/40',
              )}
            >
              {columns.map((c) => (
                <td key={c.key} className={cn('px-4 py-3 text-navy-700 dark:text-navy-200', c.className)}>
                  {c.render ? c.render(row) : row[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface PaginationProps {
  page: number;
  total: number;
  onChange: (p: number) => void;
}

export function Pagination({ page, total, onChange }: PaginationProps) {
  if (total <= 1) return null;
  return (
    <div className="flex items-center justify-between px-4 py-3 text-sm">
      <span className="text-navy-500 dark:text-navy-400">Page {page} of {total}</span>
      <div className="flex gap-1">
        <button disabled={page <= 1} onClick={() => onChange(page - 1)} className="rounded-lg p-1.5 text-navy-500 transition hover:bg-navy-100 disabled:opacity-40 dark:hover:bg-navy-800">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button disabled={page >= total} onClick={() => onChange(page + 1)} className="rounded-lg p-1.5 text-navy-500 transition hover:bg-navy-100 disabled:opacity-40 dark:hover:bg-navy-800">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
