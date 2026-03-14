import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getEffectiveUserId } from '@/lib/authUser';

export async function GET(
  _request: Request,
  { params }: { params: { id: string } }
) {
  const userId = await getEffectiveUserId();

  const meeting = await prisma.meeting.findFirst({
    where: {
      id: params.id,
      userId
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
