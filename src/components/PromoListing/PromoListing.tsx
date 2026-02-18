import { Product } from '@/types/product';
import { PromoTile } from '@/components/PromoListing/PromoTile';

type Props = {
  products: Product[];
};

export function PromoListing({ products = [] }: Readonly<Props>) {
  return (
    <section className="py-20 px-6 flex flex-col gap-6">
      <h2 className="font-heading text-center">You will also love</h2>
      <ul className="flex max-xl:gap-10 max-xl:flex-col xl:justify-evenly xl:w-6xl mx-auto">
        {products?.map((product: Product) => (
          <li key={product.sku}>
            <PromoTile product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
