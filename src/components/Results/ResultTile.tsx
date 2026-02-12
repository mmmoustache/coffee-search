import { getTheme } from '@/utils/getTheme';
import { CSVRow } from '@/types/product';
import './ResultTile.css';

type Props = {
  result: CSVRow;
  handleChange: (sku: string | number | null) => void;
};

export function ResultTile({ result, handleChange }: Readonly<Props>) {
  if (!result) return;
  const theme = getTheme(result?.sku || '');

  return (
    <button
      className="result-tile | relative flex flex-col gap-2 cursor-pointer"
      onClick={() => handleChange(result.sku)}
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
