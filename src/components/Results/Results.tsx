import { CSVRow } from '@/types/product';
import { ResultTile } from '@/components/Results/ResultTile';

type Props = {
  data: CSVRow[];
  handleChange: (sku: string | number | null) => void;
};

export function Results({ data, handleChange }: Readonly<Props>) {
  return (
    <section className="p-4 lg:p-12 flex flex-col gap-8">
      <h2 className="font-heading text-center">Others you might like</h2>
      <ul className="grid gap-8 xl:gap-20 md:grid-cols-2 xl:grid-cols-4">
        {data?.map((result: CSVRow) => (
          <li key={result.sku}>
            <ResultTile
              result={result}
              handleChange={() => handleChange(result.sku)}
            />
          </li>
        ))}
      </ul>
    </section>
  );
}
