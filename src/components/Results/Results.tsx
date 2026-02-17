import { Recommendation } from '@/types/recommend';
import { Button } from '@/components/Button/Button';
import { ResultTile } from '@/components/Results/ResultTile';

type Props = {
  results: Recommendation[];
  introduction: string;
};

export function Results({ results, introduction }: Readonly<Props>) {
  return (
    <section className="p-20 lg:p-12 flex flex-col gap-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="font-heading">Our recommendation</h1>
        <p className="font-body">{introduction}</p>
      </div>

      <ul className="grid gap-8 xl:gap-20 mx-auto max-w-6xl">
        {results?.map((result: Recommendation, index: number) => (
          <li key={result.sku}>
            <ResultTile
              result={result}
              index={index}
            />
          </li>
        ))}
      </ul>
      <div className="text-center pt-6">
        <Button
          as="a"
          href="#"
          icon="arrow-up-square"
          variant="secondary"
        >
          Back to top
        </Button>
      </div>
    </section>
  );
}
