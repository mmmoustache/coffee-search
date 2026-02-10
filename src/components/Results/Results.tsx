import type { RecommendResponse } from '@/types/recommend';
import { ProductTitle } from '@/components/ProductTitle/ProductTitle';

export function Results({ data }: Readonly<{ data: RecommendResponse }>) {
  if (!data.results?.length) return null;

  const [mainRecommendation, ...rest] = data.results;
  const otherRecommendations = rest;

  return (
    <>
      <div className={`flex flex-col gap-4 bg-${mainRecommendation.sku}`}>
        <ProductTitle>{mainRecommendation.name}</ProductTitle>
        {mainRecommendation.description && (
          <p className="font-body">{mainRecommendation.description}</p>
        )}
        {mainRecommendation.category && <p>{mainRecommendation.category}</p>}
        <ul>
          <li>
            <h3 className="font-title">Roast Level</h3>
            <p>{mainRecommendation.roast_level}</p>
          </li>
          <li>
            <h3 className="font-title">Body</h3>
            <p>{mainRecommendation.body}</p>
          </li>
          <li>
            <h3 className="font-title">Sweetness</h3>
            <p>{mainRecommendation.sweetness}</p>
          </li>
          <li>
            <h3 className="font-title">Acidity</h3>
            <p>{mainRecommendation.acidity}</p>
          </li>
        </ul>
        <div>
          <h2 className="font-title">Origin</h2>
          <ul>
            {mainRecommendation?.origin?.map((origin) => (
              <li key={origin}>{origin}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-title">Tasting notes</h2>
          <ul>
            {mainRecommendation?.tasting_notes?.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-title">Recommended for</h2>
          <ul>
            {mainRecommendation?.recommended_for?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
      <ul>
        {otherRecommendations.map((result) => (
          <li key={result.sku}>
            {result.name} - {result.origin}
          </li>
        ))}
      </ul>
    </>
  );
}
