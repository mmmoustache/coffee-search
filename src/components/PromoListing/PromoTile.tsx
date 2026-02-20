import { PACKSHOT_ALT } from '@/consts/label';
import Image from 'next/image';
import { getTheme } from '@/utils/getTheme';
import { interpolateText } from '@/utils/interpolate';
import { Product } from '@/types/product';
import './PromoTile.css';

type Props = {
  product: Product;
  href: string;
};

export function PromoTile({ product, href }: Readonly<Props>) {
  const theme = getTheme(product.sku);
  const packShotAlt = interpolateText(PACKSHOT_ALT, {
    name: product.name,
  });

  return (
    <a
      href={href}
      className="promo-tile | block focusable"
    >
      <span className={`block w-75 h-75 | ${theme?.backgroundColor}`}>
        <Image
          src="/pack.webp"
          alt={packShotAlt}
          width={300}
          height={300}
          className="promo-tile__image"
        />
      </span>

      <span className="font-title block text-center">{product.name}</span>
    </a>
  );
}
