import { getTheme } from '@/utils/getTheme';
import { Product } from '@/types/product';
import './ResultTile.css';

type Props = {
  result: Product;
  handleChange: (sku: string | number | null) => void;
};

export function ResultTile({ result, handleChange }: Readonly<Props>) {
  if (!result) return;
  const theme = getTheme(result?.sku || '');

  const handleClick = () => {
    handleChange(result.sku);
    window.scrollTo(0, 0);
  };

  return (
    <button
      className="result-tile | relative flex flex-col gap-2 cursor-pointer focusable"
      onClick={handleClick}
    >
      <span className={`block ${theme?.backgroundColor}`}>
        <img
          src="/pack.webp"
          alt=""
          className="result-tile__image"
        />
      </span>
      <h3 className="font-title">{result.name}</h3>
    </button>
  );
}
