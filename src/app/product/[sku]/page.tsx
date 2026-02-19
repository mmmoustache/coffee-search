import { notFound } from 'next/navigation';
import { getProductBySku, getSimilarProductsBySku } from '@/lib/getProducts';
import { Button } from '@/components/Button/Button';
import { Product } from '@/components/Product/Product';
import { PromoListing } from '@/components/PromoListing/PromoListing';

export default async function ProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ sku: string }>;
  searchParams: any;
}) {
  const { sku } = await params;
  const from = (await searchParams)?.from ?? '/';
  const product = await getProductBySku(sku);
  const otherProducts = await getSimilarProductsBySku(sku, 3);

  if (!product) notFound();

  return (
    <>
      <Product {...product}>
        <div className="text-center pt-6 flex gap-6">
          <Button
            href="#"
            icon="trolley"
            variant="secondary"
          >
            Buy now
          </Button>
          <Button
            href={from}
            icon="search"
          >
            Back to results
          </Button>
        </div>
      </Product>

      <PromoListing products={otherProducts} />
    </>
  );
}
