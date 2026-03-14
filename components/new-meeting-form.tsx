'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, TextArea } from '@/components/ui';

export function NewMeetingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(formData: FormData) {
    setLoading(true);
    setError(null);
    const response = await fetch('/api/meetings', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    setLoading(false);

    if (!response.ok) {
      setError(data.error ?? 'Failed to create meeting');
      return;
    }

    router.push(`/app/meetings/${data.meeting.id}`);
    router.refresh();
  }

  return (
    <form action={onSubmit} className="space-y-4 rounded-lg border border-slate-800 bg-slate-900 p-6">
      <div>
        <label className="mb-2 block text-sm font-medium">Meeting title</label>
        <Input name="title" required placeholder="Weekly product sync" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Description</label>
        <TextArea name="description" placeholder="Optional context" rows={3} />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Meeting date/time</label>
        <Input type="datetime-local" name="scheduledAt" />
      </div>
      <div>
        <label className="mb-2 block text-sm font-medium">Audio/video file</label>
        <Input
          type="file"
          name="file"
          required
          accept=".mp3,.wav,.m4a,.mp4,audio/mpeg,audio/wav,audio/mp4,video/mp4"
        />
      </div>
      {error && <p className="text-sm text-red-400">{error}</p>}
      <Button disabled={loading} type="submit">
        {loading ? 'Processing...' : 'Create meeting'}
      </Button>
    </form>
  );
}
