import { z } from 'zod';

const summarySchema = z.object({
  summary: z.string(),
  keyTakeaways: z.array(z.string()),
  actionItems: z.array(z.string())
});

export async function summarizeTranscript({
  transcriptText
}: {
  transcriptText: string;
}): Promise<{ summary: string; keyTakeaways: string[]; actionItems: string[] }> {
  if (!process.env.LLM_API_KEY) {
    return {
      summary: 'LLM key missing. This is a development fallback summary.',
      keyTakeaways: ['Fallback key takeaway generated locally.'],
      actionItems: ['Provide LLM_API_KEY to generate real summaries.']
    };
  }

  const prompt = `You are an expert meeting analyst. Given this transcript, return ONLY JSON with fields: summary (string), keyTakeaways (string[] max 5), actionItems (string[] max 5). Transcript: ${transcriptText.slice(0, 15000)}`;

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.LLM_API_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'Respond with valid JSON only.' },
        { role: 'user', content: prompt }
      ],
      temperature: 0.2
    })
  });

  if (!response.ok) {
    throw new Error(`LLM API failed: ${response.status} ${await response.text()}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;
  const parsed = summarySchema.safeParse(JSON.parse(content));

  if (!parsed.success) {
    throw new Error('Unable to parse LLM summary response');
  }

  return parsed.data;
}
