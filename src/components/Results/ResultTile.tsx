import { getTheme } from '@/utils/getTheme';
import { Recommendation } from '@/types/recommend';
import { Button } from '@/components/Button/Button';
import './ResultTile.css';

type Props = {
  result: Recommendation;
  index: number;
};

export function ResultTile({ result, index }: Readonly<Props>) {
  if (!result) return null;
  const theme = getTheme(result?.sku || '');

  return (
    <div className="result-tile | grid">
      <div className={`${theme?.backgroundColor} w-75 h-75`}>
        <img
          src="/pack.webp"
          alt={`Pack shot of the ${result.name} product`}
          className="result-tile__image"
          width={300}
          height={300}
        />
      </div>
      <div className="px-8 py-5 flex flex-col gap-2 bg-white">
        <h3 className="font-title">
          <span className={theme?.textColor}>{index + 1}.</span> {result.name}
        </h3>
        <p className="font-body">Origin: {result.origin.join(', ')}</p>
        <ul className="list-disc pl-5 font-small">
          {result?.reasons?.map((reason) => (
            <li key={reason}>{reason}</li>
          ))}
        </ul>
        <Button
          as="a"
          href={`/product/${result.sku}`}
          className="mt-3 self-start"
          icon="arrow-right"
        >
          View details
        </Button>
      </div>
    </div>
  );
}
