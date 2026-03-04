import Link from 'next/link';
import { MeetingStatus } from '@prisma/client';
import { format } from 'date-fns';

type MeetingListItem = {
  id: string;
  title: string;
  status: MeetingStatus;
  createdAt: Date;
  scheduledAt: Date | null;
  summary: { summary: string } | null;
};

const statusClasses: Record<MeetingStatus, string> = {
  PENDING: 'bg-slate-700 text-slate-100',
  PROCESSING: 'bg-yellow-700 text-yellow-100',
  READY: 'bg-emerald-700 text-emerald-100',
  FAILED: 'bg-red-700 text-red-100'
};

export function MeetingList({ meetings }: { meetings: MeetingListItem[] }) {
  if (!meetings.length) {
    return <p className="rounded-md border border-slate-800 p-6 text-slate-400">No meetings found.</p>;
  }

  return (
    <div className="overflow-hidden rounded-lg border border-slate-800">
      <table className="w-full text-sm">
        <thead className="bg-slate-900 text-left text-slate-400">
          <tr>
            <th className="px-4 py-3">Title</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Summary</th>
          </tr>
        </thead>
        <tbody>
          {meetings.map((meeting) => (
            <tr key={meeting.id} className="border-t border-slate-800">
              <td className="px-4 py-3">
                <Link href={`/app/meetings/${meeting.id}`} className="font-medium text-white hover:text-brand">
                  {meeting.title}
                </Link>
              </td>
              <td className="px-4 py-3 text-slate-300">
                {format(meeting.scheduledAt ?? meeting.createdAt, 'PPp')}
              </td>
              <td className="px-4 py-3">
                <span className={`rounded-full px-2 py-1 text-xs ${statusClasses[meeting.status]}`}>
                  {meeting.status}
                </span>
              </td>
              <td className="px-4 py-3 text-slate-400">{meeting.summary?.summary ?? '—'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
