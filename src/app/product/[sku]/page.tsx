import { notFound } from 'next/navigation';
import { getProductBySku, getSimilarProductsBySku } from '@/lib/getProducts';
import { Button } from '@/components/Button/Button';
import { Product } from '@/components/Product/Product';
import { PromoListing } from '@/components/PromoListing/PromoListing';

export default async function ProductPage({ params }: { params: Promise<{ sku: string }> }) {
  const { sku } = await params;
  const product = await getProductBySku(sku);
  const otherProducts = await getSimilarProductsBySku(sku, 3);

  if (!product) notFound();

  return (
    <>
      <Product {...product}>
        <div className="text-center pt-6 flex justify-between gap-6">
          <Button
            as="a"
            href="#"
            icon="trolley"
            variant="secondary"
          >
            Buy now
          </Button>
        </div>
      </Product>

      <PromoListing products={otherProducts} />
    </>
  );
}
