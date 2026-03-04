'use client';

import { useRef, useState } from 'react';
import { TranscriptViewer } from '@/components/transcript-viewer';

type Segment = {
  id: string;
  speaker: string;
  startTimeSeconds: number;
  endTimeSeconds: number;
  text: string;
};

export function MeetingDetailClient({
  mediaUrl,
  mediaType,
  summary,
  keyTakeaways,
  actionItems,
  segments,
  transcriptText
}: {
  mediaUrl?: string;
  mediaType?: 'audio' | 'video';
  summary?: string;
  keyTakeaways: string[];
  actionItems: string[];
  segments: Segment[];
  transcriptText: string;
}) {
  const [tab, setTab] = useState<'summary' | 'transcript'>('summary');
  const mediaRef = useRef<HTMLMediaElement>(null);

  function seek(time: number) {
    if (!mediaRef.current) return;
    mediaRef.current.currentTime = time;
    mediaRef.current.play().catch(() => null);
  }

  return (
    <div className="space-y-6">
      {mediaUrl && mediaType === 'video' ? (
        <video ref={mediaRef as any} controls className="w-full rounded-lg border border-slate-800">
          <source src={mediaUrl} />
        </video>
      ) : mediaUrl ? (
        <audio ref={mediaRef as any} controls className="w-full">
          <source src={mediaUrl} />
        </audio>
      ) : null}

      <div className="flex gap-2">
        <button
          onClick={() => setTab('summary')}
          className={`rounded-md px-3 py-1 text-sm ${tab === 'summary' ? 'bg-brand' : 'bg-slate-800'}`}
        >
          Summary
        </button>
        <button
          onClick={() => setTab('transcript')}
          className={`rounded-md px-3 py-1 text-sm ${tab === 'transcript' ? 'bg-brand' : 'bg-slate-800'}`}
        >
          Transcript
        </button>
      </div>

      {tab === 'summary' ? (
        <section className="space-y-5 rounded-lg border border-slate-800 bg-slate-900 p-5">
          <div>
            <h2 className="mb-2 text-lg font-semibold">Summary</h2>
            <p className="text-slate-300">{summary ?? 'Summary not available yet.'}</p>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Key takeaways</h3>
            <ul className="list-disc space-y-1 pl-5 text-slate-300">
              {keyTakeaways.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="mb-2 font-medium">Action items</h3>
            <ul className="list-disc space-y-1 pl-5 text-slate-300">
              {actionItems.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </section>
      ) : (
        <section className="space-y-4 rounded-lg border border-slate-800 bg-slate-900 p-5">
          {!segments.length ? <p className="text-slate-400">{transcriptText || 'Transcript unavailable.'}</p> : null}
          {!!segments.length ? <TranscriptViewer segments={segments} onSeek={seek} /> : null}
        </section>
      )}
    </div>
  );
}
