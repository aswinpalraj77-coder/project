import { useId } from 'react';
import { cn } from '@/lib/format';

interface BarChartProps {
  data: { label: string; value: number }[];
  color?: string;
  height?: number;
  formatValue?: (v: number) => string;
}

export function BarChart({ data, color = '#1ba89e', height = 200, formatValue }: BarChartProps) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <div className="flex items-end gap-2" style={{ height }}>
      {data.map((d) => (
        <div key={d.label} className="group flex flex-1 flex-col items-center gap-2">
          <div className="relative flex w-full flex-1 items-end">
            <div
              className="w-full rounded-t-lg transition-all duration-500 group-hover:opacity-80"
              style={{ height: `${(d.value / max) * 100}%`, backgroundColor: color, minHeight: '4px' }}
            />
            <div className="absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-navy-900 px-2 py-1 text-xs font-medium text-white opacity-0 transition group-hover:opacity-100 dark:bg-navy-700">
              {formatValue ? formatValue(d.value) : d.value}
            </div>
          </div>
          <span className="text-xs text-navy-500 dark:text-navy-400">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

interface LineChartProps {
  data: { label: string; values: Record<string, number> }[];
  series: { key: string; label: string; color: string }[];
  height?: number;
}

export function LineChart({ data, series, height = 220 }: LineChartProps) {
  const gradId = useId();
  const w = 600;
  const h = height;
  const pad = { top: 16, right: 16, bottom: 28, left: 32 };
  const innerW = w - pad.left - pad.right;
  const innerH = h - pad.top - pad.bottom;

  const allValues = data.flatMap((d) => Object.values(d.values));
  const max = Math.max(...allValues, 1);
  const stepX = innerW / Math.max(1, data.length - 1);

  const toPath = (key: string) =>
    data.map((d, i) => {
      const x = pad.left + i * stepX;
      const y = pad.top + innerH - (d.values[key] / max) * innerH;
      return `${i === 0 ? 'M' : 'L'} ${x} ${y}`;
    }).join(' ');

  return (
    <div className="w-full overflow-x-auto scrollbar-thin">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full" style={{ minWidth: 400 }}>
        {[0, 0.25, 0.5, 0.75, 1].map((p) => {
          const y = pad.top + innerH - p * innerH;
          return (
            <g key={p}>
              <line x1={pad.left} y1={y} x2={w - pad.right} y2={y} className="stroke-navy-100 dark:stroke-navy-800" strokeWidth={1} />
              <text x={pad.left - 6} y={y + 4} textAnchor="end" className="fill-navy-400 text-[10px]">{Math.round(max * p)}</text>
            </g>
          );
        })}
        {data.map((d, i) => (
          <text key={i} x={pad.left + i * stepX} y={h - 8} textAnchor="middle" className="fill-navy-400 text-[10px]">{d.label}</text>
        ))}
        {series.map((s) => (
          <g key={s.key}>
            <path d={toPath(s.key)} fill="none" stroke={s.color} strokeWidth={2.5} strokeLinejoin="round" strokeLinecap="round" />
            {data.map((d, i) => {
              const x = pad.left + i * stepX;
              const y = pad.top + innerH - (d.values[s.key] / max) * innerH;
              return <circle key={i} cx={x} cy={y} r={3} fill="white" stroke={s.color} strokeWidth={2} className="transition hover:r-4" />;
            })}
          </g>
        ))}
      </svg>
      <div className="mt-2 flex flex-wrap gap-4">
        {series.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5 text-xs text-navy-500 dark:text-navy-400">
            <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
            {s.label}
          </div>
        ))}
      </div>
    </div>
  );
}

interface DonutProps {
  data: { label: string; value: number; color: string }[];
  size?: number;
}

export function DonutChart({ data, size = 160 }: DonutProps) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  const r = size / 2 - 12;
  const c = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="shrink-0">
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" className="stroke-navy-100 dark:stroke-navy-800" strokeWidth={14} />
        {data.map((d) => {
          const len = (d.value / total) * c;
          const el = (
            <circle
              key={d.label}
              cx={size / 2} cy={size / 2} r={r} fill="none"
              stroke={d.color} strokeWidth={14}
              strokeDasharray={`${len} ${c - len}`}
              strokeDashoffset={-offset}
              strokeLinecap="round"
              transform={`rotate(-90 ${size / 2} ${size / 2})`}
              className="transition-all duration-500"
            />
          );
          offset += len;
          return el;
        })}
        <text x="50%" y="48%" textAnchor="middle" className="fill-navy-900 text-xl font-bold dark:fill-navy-50">{total}</text>
        <text x="50%" y="60%" textAnchor="middle" className="fill-navy-400 text-[10px]">Total</text>
      </svg>
      <div className="space-y-2">
        {data.map((d) => (
          <div key={d.label} className="flex items-center gap-2 text-sm">
            <span className="h-3 w-3 rounded-sm" style={{ backgroundColor: d.color }} />
            <span className="text-navy-600 dark:text-navy-300">{d.label}</span>
            <span className="font-semibold text-navy-900 dark:text-navy-100">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Sparkline({ data, color = '#1ba89e', height = 40 }: { data: number[]; color?: string; height?: number }) {
  const max = Math.max(...data, 1);
  const min = Math.min(...data, 0);
  const range = max - min || 1;
  const w = 100;
  const points = data.map((v, i) => `${(i / (data.length - 1)) * w},${height - ((v - min) / range) * height}`).join(' ');
  return (
    <svg viewBox={`0 0 ${w} ${height}`} className={cn('w-full')} preserveAspectRatio="none" style={{ height }}>
      <polyline points={points} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
