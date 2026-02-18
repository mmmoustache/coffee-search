import { PropsWithChildren } from 'react';
import { Recommendation } from '@/types/recommend';
import { ResultTile } from '@/components/Results/ResultTile';

type Props = {
  results: Recommendation[];
  introduction: string;
};

export function Results({ results, introduction, children }: PropsWithChildren<Props>) {
  return (
    <section className="py-12 px-6 lg:p-12 mx-5 flex flex-col gap-8 bg-100001">
      <div className="mx-auto max-w-4xl flex flex-col gap-5">
        <svg
          className="icon | mx-auto"
          width="4em"
          height="4em"
          fill="currentColor"
        >
          <use xlinkHref="/icons/icons.svg#cup-hot" />
        </svg>
        <h1 className="font-heading text-center">Our recommendations</h1>
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
      {children}
    </section>
  );
}
