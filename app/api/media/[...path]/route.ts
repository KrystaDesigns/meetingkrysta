import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getEffectiveUserId } from '@/lib/authUser';

export async function GET(
  _request: Request,
  { params }: { params: { path: string[] } }
) {
  const userId = await getEffectiveUserId();

  const relativePath = params.path.join('/');
  const normalized = path.normalize(relativePath);
  if (normalized.includes('..')) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 });
  }

  const meeting = await prisma.meeting.findFirst({
    where: {
      userId,
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
