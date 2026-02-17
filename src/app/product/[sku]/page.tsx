import { notFound } from 'next/navigation';
import { getProductBySku } from '@/lib/getProducts';
import { Button } from '@/components/Button/Button';
import { Product } from '@/components/Product/Product';

export default async function ProductPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  const product = await getProductBySku(sku);

  if (!product) notFound();

  return (
    <Product {...product}>
      <div className="text-center pt-6 flex justify-between gap-6">
        <Button
          as="a"
          href="#"
          icon="arrow-up-square"
          variant="secondary"
        >
          Buy now
        </Button>
        <Button
          as="a"
          href="/"
          icon="arrow-left"
          variant="primary"
        >
          New search
        </Button>
      </div>
    </Product>
  );
}
