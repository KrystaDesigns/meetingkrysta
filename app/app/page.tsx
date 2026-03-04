import Link from 'next/link';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Input } from '@/components/ui';
import { MeetingList } from '@/components/meeting-list';

export default async function DashboardPage({
  searchParams
}: {
  searchParams: { q?: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return null;

  const q = searchParams.q?.trim();

  const meetings = await prisma.meeting.findMany({
    where: {
      userId: session.user.id,
      ...(q
        ? {
            OR: [
              { title: { contains: q, mode: 'insensitive' } },
              { description: { contains: q, mode: 'insensitive' } },
              { transcript: { is: { text: { contains: q, mode: 'insensitive' } } } }
            ]
          }
        : {})
    },
    include: {
      summary: {
        select: { summary: true }
      }
    },
    orderBy: {
      createdAt: 'desc'
    },
    take: 50
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <h1 className="text-2xl font-semibold">My Meetings</h1>
        <Link href="/app/meetings/new" className="rounded-md bg-brand px-4 py-2 text-sm font-medium hover:bg-brand-dark">
          New meeting
        </Link>
      </div>

      <form>
        <Input name="q" placeholder="Search title, summary, transcript..." defaultValue={q} />
      </form>

      <MeetingList meetings={meetings} />
    </div>
  );
}
