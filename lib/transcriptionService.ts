import { readFile } from 'node:fs/promises';

export type TranscriptionSegment = {
  start: number;
  end: number;
  speaker: string;
  text: string;
};

export async function transcribeMeetingFile({
  filePath,
  language
}: {
  filePath: string;
  language?: string;
}): Promise<{ text: string; segments: TranscriptionSegment[] }> {
  const bytes = await readFile(filePath);

  if (!process.env.TRANSCRIPTION_API_KEY) {
    const fallbackText =
      'Transcription service key is missing. This is fallback transcript text for development.';
    return {
      text: fallbackText,
      segments: [
        {
          start: 0,
          end: 12,
          speaker: 'Speaker 1',
          text: fallbackText
        }
      ]
    };
  }

  const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.TRANSCRIPTION_API_KEY}`
    },
    body: (() => {
      const formData = new FormData();
      formData.append('file', new Blob([bytes]), filePath.split('/').pop() ?? 'meeting-file.mp3');
      formData.append('model', 'whisper-1');
      formData.append('response_format', 'verbose_json');
      if (language) formData.append('language', language);
      return formData;
    })()
  });

  if (!response.ok) {
    throw new Error(`Transcription API failed: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const segments: TranscriptionSegment[] = Array.isArray(data.segments)
    ? data.segments.map((segment: any, idx: number) => ({
        start: Number(segment.start ?? 0),
        end: Number(segment.end ?? segment.start ?? 0),
        speaker: `Speaker ${(idx % 2) + 1}`,
        text: String(segment.text ?? '')
      }))
    : [
        {
          start: 0,
          end: 0,
          speaker: 'Speaker 1',
          text: String(data.text ?? '')
        }
      ];

  return {
    text: String(data.text ?? ''),
    segments
  };
}
