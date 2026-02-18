import { getTheme } from '@/utils/getTheme';
import { Product } from '@/types/product';
import './PromoTile.css';

type Props = {
  product: Product;
};

export function PromoTile({ product }: Readonly<Props>) {
  const theme = getTheme(product.sku);
  return (
    <a
      href={`/product/${product.sku}`}
      className="promo-tile | block focusable"
    >
      <span className={`block w-75 h-75 | ${theme?.backgroundColor}`}>
        <img
          src="/pack.webp"
          alt={`Pack shot of the ${product.name} product`}
          width={300}
          height={300}
          className="promo-tile__image"
        />
      </span>

      <span className="font-title block text-center">{product.name}</span>
    </a>
  );
}
