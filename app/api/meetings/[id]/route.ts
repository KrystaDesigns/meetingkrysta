import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const meeting = await prisma.meeting.findFirst({
    where: {
      id: params.id,
      userId: session.user.id
    },
    include: {
      summary: true,
      transcript: {
        include: {
          segments: {
            orderBy: { startTimeSeconds: 'asc' }
          }
        }
      }
    }
  });

  if (!meeting) {
    return NextResponse.json({ error: 'Meeting not found' }, { status: 404 });
  }

  return NextResponse.json({ meeting });
}
