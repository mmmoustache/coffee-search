import { NextResponse } from "next/server";
import { z } from "zod";
import { pool } from "@/lib/db";
import { openai } from "@/lib/openai";
import { toSql } from "pgvector/pg";

const Body = z.object({
  query: z.string().min(2),
});

export async function POST(req: Request) {
  const { query } = Body.parse(await req.json());
  const embedding = await openai.embeddings.create({
    model: "text-embedding-3-small",
    input: query,
  });
  const qEmbedding = embedding.data[0].embedding;

  const { rows: candidates } = await pool.query(
    `
    SELECT id, sku, name, category, origin, tasting_notes, recommended_for,
           roast_level, body, sweetness, acidity, description, weight_g
    FROM products
    WHERE embedding IS NOT NULL
    ORDER BY embedding <=> $1::vector
    LIMIT 12
    `,
    [toSql(qEmbedding)],
  );

  const resp = await openai.responses.create({
    model: "gpt-5.2",
    input: [
      {
        role: "system",
        content:
          "You are a coffee recommender for a shop catalogue.\n" +
          "RULES: Only recommend coffees from the provided candidate list.\n" +
          "Pick exactly 3 (unless fewer candidates exist).\n" +
          "For each, include: name (SKU) + 1 short reason tied to tasting_notes/origin/profile.\n" +
          "No extra commentary.",
      },
      {
        role: "user",
        content: JSON.stringify({ query, candidates }),
      },
    ],
  });

  return NextResponse.json({
    query,
    candidates,
    recommendationText: resp.output_text,
  });
}
