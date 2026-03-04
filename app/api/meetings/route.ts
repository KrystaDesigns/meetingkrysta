import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createMeetingAndProcess } from '@/lib/meetings';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const title = String(formData.get('title') || '').trim();
    const description = String(formData.get('description') || '').trim() || undefined;
    const scheduledAtRaw = String(formData.get('scheduledAt') || '').trim();
    const file = formData.get('file');

    if (!title || !(file instanceof File)) {
      return NextResponse.json({ error: 'Title and file are required' }, { status: 400 });
    }

    const allowed = ['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/mp4', 'video/mp4', 'audio/x-m4a'];
    if (!allowed.includes(file.type)) {
      return NextResponse.json({ error: 'Unsupported file type' }, { status: 400 });
    }

    const result = await createMeetingAndProcess({
      userId: session.user.id,
      title,
      description,
      scheduledAt: scheduledAtRaw ? new Date(scheduledAtRaw) : undefined,
      file
    });

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to process meeting' }, { status: 500 });
  }
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q')?.trim();
  const page = Number(searchParams.get('page') || '1');
  const pageSize = Math.min(Number(searchParams.get('pageSize') || '20'), 50);

  const where = {
    userId: session.user.id,
    ...(q
      ? {
          OR: [
            { title: { contains: q, mode: 'insensitive' as const } },
            { description: { contains: q, mode: 'insensitive' as const } },
            { transcript: { is: { text: { contains: q, mode: 'insensitive' as const } } } }
          ]
        }
      : {})
  };

  const [meetings, total] = await Promise.all([
    prisma.meeting.findMany({
      where,
      include: {
        summary: true,
        transcript: {
          select: {
            text: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * pageSize,
      take: pageSize
    }),
    prisma.meeting.count({ where })
  ]);

  return NextResponse.json({ meetings, total, page, pageSize });
}
