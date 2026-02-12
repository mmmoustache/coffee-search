import { CSVRow } from '@/types/product';
import './ResultTile.css';

type Props = {
  result: CSVRow;
  handleChange: (sku: string | number | null) => void;
};

export function ResultTile({ result, handleChange }: Readonly<Props>) {
  if (!result) return;
  return (
    <button
      className="result-tile | relative flex flex-col gap-2 cursor-pointer"
      onClick={() => handleChange(result.sku)}
    >
      <img
        src="/pack.webp"
        alt=""
        className="result-tile__image"
      />
      <h3 className="font-title">{result.name}</h3>
    </button>
  );
}
