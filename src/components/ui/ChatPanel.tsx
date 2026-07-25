import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Send, Sparkles, Mic, Loader2 } from 'lucide-react';
import type { ChatMessage } from '@/types';
import { cn, timeAgo } from '@/lib/format';
import { makeChatMessage } from '@/lib/ai';

interface ChatPanelProps {
  title: string;
  subtitle?: string;
  placeholder: string;
  messages: ChatMessage[];
  onSend: (query: string) => void;
  loading?: boolean;
  accent?: 'navy' | 'teal';
  suggestions?: string[];
  voice?: boolean;
  children?: ReactNode;
}

export function ChatPanel({ title, subtitle, placeholder, messages, onSend, loading, accent = 'teal', suggestions, voice, children }: ChatPanelProps) {
  const [input, setInput] = useState('');
  const [listening, setListening] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const send = () => {
    if (!input.trim() || loading) return;
    onSend(input.trim());
    setInput('');
  };

  const accentBg = accent === 'navy' ? 'bg-navy-600' : 'bg-teal-600';

  return (
    <div className="surface flex flex-col" style={{ height: '100%' }}>
      <div className="flex items-center gap-3 border-b border-navy-100 p-4 dark:border-navy-800">
        <div className={cn('flex h-10 w-10 items-center justify-center rounded-xl text-white', accentBg)}>
          <Sparkles className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-display text-base font-semibold text-navy-900 dark:text-navy-50">{title}</h3>
          {subtitle && <p className="text-xs text-navy-500 dark:text-navy-400">{subtitle}</p>}
        </div>
      </div>

      <div className="flex-1 space-y-4 overflow-y-auto scrollbar-thin p-4">
        {messages.length === 0 && (
          <div className="flex h-full flex-col items-center justify-center text-center">
            <div className={cn('flex h-14 w-14 items-center justify-center rounded-2xl text-white', accentBg)}>
              <Sparkles className="h-7 w-7" />
            </div>
            <p className="mt-3 text-sm font-medium text-navy-700 dark:text-navy-200">Ask me anything</p>
            <p className="mt-1 max-w-xs text-xs text-navy-400">I can search cases, summarize files, and generate briefings using AI.</p>
          </div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={cn('flex', m.role === 'user' ? 'justify-end' : 'justify-start')}>
            <div className={cn('max-w-[85%]')}>
              <div className={cn(
                'rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line',
                m.role === 'user'
                  ? 'bg-navy-700 text-white dark:bg-navy-600'
                  : 'surface-muted text-navy-800 dark:text-navy-100',
              )}>
                {m.content}
              </div>
              {m.role === 'assistant' && (m.reasoning || m.confidence !== undefined) && (
                <div className="mt-2 space-y-1.5 rounded-lg bg-teal-50/60 p-2.5 dark:bg-teal-500/10">
                  {m.confidence !== undefined && (
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-teal-700 dark:text-teal-300">Confidence</span>
                      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-teal-100 dark:bg-teal-500/20">
                        <div className="h-full rounded-full bg-teal-500" style={{ width: `${m.confidence}%` }} />
                      </div>
                      <span className="font-semibold text-teal-700 dark:text-teal-300">{m.confidence}%</span>
                    </div>
                  )}
                  {m.reasoning && m.reasoning.map((r, i) => (
                    <div key={i} className="flex items-start gap-1.5 text-xs text-teal-700 dark:text-teal-300">
                      <span className="mt-0.5">✓</span>
                      <span>{r}</span>
                    </div>
                  ))}
                </div>
              )}
              <p className={cn('mt-1 text-[10px] text-navy-400', m.role === 'user' ? 'text-right' : '')}>{timeAgo(m.at)}</p>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="surface-muted flex items-center gap-2 rounded-2xl px-4 py-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-teal-600" />
              <span className="text-sm text-navy-500">Analyzing...</span>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {suggestions && suggestions.length > 0 && messages.length <= 1 && (
        <div className="flex flex-wrap gap-1.5 px-4 pb-2">
          {suggestions.map((s) => (
            <button key={s} onClick={() => onSend(s)} className="rounded-full border border-navy-200 px-3 py-1 text-xs text-navy-600 transition hover:border-teal-400 hover:text-teal-700 dark:border-navy-700 dark:text-navy-300 dark:hover:border-teal-500 dark:hover:text-teal-300">
              {s}
            </button>
          ))}
        </div>
      )}

      {children}

      <div className="border-t border-navy-100 p-3 dark:border-navy-800">
        <div className="flex items-end gap-2">
          <div className="relative flex-1">
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(); } }}
              placeholder={placeholder}
              rows={1}
              className="input-base min-h-[40px] max-h-32 resize-none pr-10"
            />
            {voice && (
              <button
                onClick={() => setListening(!listening)}
                className={cn('absolute right-2 top-1/2 -translate-y-1/2 rounded-lg p-1.5 transition', listening ? 'bg-danger-500 text-white animate-pulse-soft' : 'text-navy-400 hover:text-navy-700 dark:hover:text-navy-200')}
              >
                <Mic className="h-4 w-4" />
              </button>
            )}
          </div>
          <button onClick={send} disabled={loading || !input.trim()} className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-600 text-white transition hover:bg-teal-700 disabled:opacity-40">
            <Send className="h-4 w-4" />
          </button>
        </div>
        {listening && <p className="mt-1.5 text-xs text-danger-600 dark:text-danger-400">Listening... (voice demo — type to interact)</p>}
      </div>
    </div>
  );
}

export { makeChatMessage };
