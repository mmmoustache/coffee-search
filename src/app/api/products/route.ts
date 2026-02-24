import { NextResponse } from 'next/server';
import { z } from 'zod';
import { getAllProducts } from '@/lib/getProducts';

const QuerySchema = z.object({
  limit: z.coerce.number().min(1).max(500).default(100),
  offset: z.coerce.number().min(0).default(0),
});

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);

    const parsed = QuerySchema.parse({
      limit: searchParams.get('limit'),
      offset: searchParams.get('offset'),
    });

    const products = await getAllProducts(parsed.limit, parsed.offset);

    return NextResponse.json({
      count: products.length,
      limit: parsed.limit,
      offset: parsed.offset,
      products,
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (err: any) {
    return NextResponse.json({ error: err.message ?? 'Unknown error' }, { status: 400 });
  }
}
