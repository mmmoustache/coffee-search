import { Product } from '@/types/product';
import { PromoTile } from './PromoTile';

type Props = {
  products: Product[];
};

export function PromoListing({ products = [] }: Readonly<Props>) {
  return (
    <section className="py-20 px-6 flex flex-col gap-6">
      <h2 className="font-heading text-center">You will also love</h2>
      <ul className="xl:flex xl:justify-evenly xl:w-6xl mx-auto">
        {products?.map((product: Product) => (
          <li key={product.sku}>
            <PromoTile product={product} />
          </li>
        ))}
      </ul>
    </section>
  );
}
