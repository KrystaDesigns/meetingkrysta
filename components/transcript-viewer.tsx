'use client';

import { useMemo, useState } from 'react';
import { formatTimestamp } from '@/lib/utils';
import { Input } from '@/components/ui';

type Segment = {
  id: string;
  speaker: string;
  startTimeSeconds: number;
  endTimeSeconds: number;
  text: string;
};

export function TranscriptViewer({
  segments,
  onSeek
}: {
  segments: Segment[];
  onSeek: (time: number) => void;
}) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return segments;
    return segments.filter((segment) => segment.text.toLowerCase().includes(query.toLowerCase()));
  }, [segments, query]);

  return (
    <div className="space-y-3">
      <Input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder="Search in transcript..."
      />
      <div className="max-h-[420px] space-y-2 overflow-y-auto rounded-md border border-slate-800 p-3">
        {filtered.map((segment) => {
          const matches = query && segment.text.toLowerCase().includes(query.toLowerCase());
          return (
            <button
              type="button"
              key={segment.id}
              onClick={() => onSeek(segment.startTimeSeconds)}
              className="w-full rounded-md border border-slate-800 p-3 text-left hover:border-brand"
            >
              <div className="mb-1 flex items-center gap-2 text-xs text-slate-400">
                <span>{formatTimestamp(segment.startTimeSeconds)}</span>
                <span>•</span>
                <span>{segment.speaker}</span>
              </div>
              <p className={matches ? 'text-brand' : 'text-slate-200'}>{segment.text}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
}
