import { notFound } from 'next/navigation';
import { format } from 'date-fns';
import { prisma } from '@/lib/prisma';
import { getEffectiveUserId } from '@/lib/authUser';
import { formatSeconds } from '@/lib/utils';
import { MeetingDetailClient } from '@/components/meeting-detail';

export default async function MeetingDetailPage({ params }: { params: { id: string } }) {
  const userId = await getEffectiveUserId();

  const meeting = await prisma.meeting.findFirst({
    where: { id: params.id, userId },
    include: {
      transcript: {
        include: {
          segments: {
            orderBy: { startTimeSeconds: 'asc' }
          }
        }
      },
      summary: true
    }
  });

  if (!meeting) notFound();

  const mediaType = meeting.mediaPath?.endsWith('.mp4') ? 'video' : 'audio';
  const mediaUrl = meeting.mediaPath ? `/api/media/${meeting.mediaPath}` : undefined;
  const keyTakeaways = Array.isArray(meeting.summary?.keyTakeaways)
    ? (meeting.summary.keyTakeaways as string[])
    : [];
  const actionItems = Array.isArray(meeting.summary?.actionItems)
    ? (meeting.summary.actionItems as string[])
    : [];

  return (
    <div className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">{meeting.title}</h1>
        <p className="text-sm text-slate-400">
          {format(meeting.scheduledAt ?? meeting.createdAt, 'PPp')} • Status: {meeting.status} • Duration:{' '}
          {formatSeconds(meeting.durationSeconds)}
        </p>
      </header>

      <MeetingDetailClient
        mediaUrl={mediaUrl}
        mediaType={mediaType}
        summary={meeting.summary?.summary}
        keyTakeaways={keyTakeaways}
        actionItems={actionItems}
        segments={meeting.transcript?.segments ?? []}
        transcriptText={meeting.transcript?.text ?? ''}
      />
    </div>
  );
}
