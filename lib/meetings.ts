import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { MeetingStatus, Prisma } from '@prisma/client';
import { prisma } from '@/lib/prisma';
import { transcribeMeetingFile } from '@/lib/transcriptionService';
import { summarizeTranscript } from '@/lib/llmService';

export async function createMeetingAndProcess({
  userId,
  title,
  description,
  scheduledAt,
  language,
  file
}: {
  userId: string;
  title: string;
  description?: string;
  scheduledAt?: Date;
  language?: string;
  file: File;
}) {
  const ext = file.name.includes('.') ? file.name.split('.').pop() : 'bin';
  const meetingId = randomUUID();
  const userUploadDir = path.join(process.cwd(), 'uploads', userId);
  await mkdir(userUploadDir, { recursive: true });
  const fileName = `${meetingId}.${ext}`;
  const absolutePath = path.join(userUploadDir, fileName);
  const relativeMediaPath = path.posix.join('uploads', userId, fileName);

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(absolutePath, buffer);

  let meeting = await prisma.meeting.create({
    data: {
      id: meetingId,
      userId,
      title,
      description,
      scheduledAt,
      language,
      status: MeetingStatus.PROCESSING,
      mediaPath: relativeMediaPath
    }
  });

  try {
    const transcription = await transcribeMeetingFile({ filePath: absolutePath, language });

    const transcript = await prisma.transcript.create({
      data: {
        meetingId: meeting.id,
        text: transcription.text,
        segments: {
          createMany: {
            data: transcription.segments.map((segment) => ({
              speaker: segment.speaker,
              startTimeSeconds: segment.start,
              endTimeSeconds: segment.end,
              text: segment.text
            }))
          }
        }
      }
    });

    const llmSummary = await summarizeTranscript({ transcriptText: transcription.text });

    await prisma.meetingSummary.create({
      data: {
        meetingId: meeting.id,
        summary: llmSummary.summary,
        keyTakeaways: llmSummary.keyTakeaways as Prisma.JsonArray,
        actionItems: llmSummary.actionItems as Prisma.JsonArray
      }
    });

    meeting = await prisma.meeting.update({
      where: { id: meeting.id },
      data: {
        status: MeetingStatus.READY,
        durationSeconds: Math.ceil(
          transcription.segments[transcription.segments.length - 1]?.end ?? transcript.text.split(' ').length / 2
        )
      }
    });

    return { meeting, processingFinished: true };
  } catch (error) {
    meeting = await prisma.meeting.update({
      where: { id: meeting.id },
      data: { status: MeetingStatus.FAILED }
    });
    throw error;
  }
}
