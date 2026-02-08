import { openai } from '@/lib/openai';

export async function embedText(input: string): Promise<number[]> {
  const res = await openai.embeddings.create({
    model: process.env.EMBED_MODEL || 'text-embedding-3-small',
    input,
  });
  return res.data[0].embedding;
}
