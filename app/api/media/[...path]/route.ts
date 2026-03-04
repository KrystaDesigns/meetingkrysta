import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  _request: Request,
  { params }: { params: { path: string[] } }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const relativePath = params.path.join('/');
  const normalized = path.normalize(relativePath);
  if (normalized.includes('..')) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  const meeting = await prisma.meeting.findFirst({
    where: {
      userId: session.user.id,
      mediaPath: normalized
    }
  });

  if (!meeting?.mediaPath) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const absolutePath = path.join(process.cwd(), meeting.mediaPath);
  const fileBuffer = await readFile(absolutePath);

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': meeting.mediaPath.endsWith('.mp4') ? 'video/mp4' : 'audio/mpeg'
    }
  });
}
