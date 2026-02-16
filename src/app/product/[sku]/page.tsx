import { notFound } from 'next/navigation';
import { getProductBySku } from '@/lib/getProducts';
import { Product } from '@/components/Product/Product';

export default async function ProductPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  const product = await getProductBySku(sku);

  if (!product) notFound();

  return <Product {...product} />;
}
