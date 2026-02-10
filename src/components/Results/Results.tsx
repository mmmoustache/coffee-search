import type { RecommendResponse } from '@/types/recommend';

export function Results({ data }: Readonly<{ data: RecommendResponse }>) {
  if (!data.results?.length) return null;

  const [mainRecommendation, ...rest] = data.results;
  const otherRecommendations = rest;

  return (
    <>
      <div className="flex flex-col gap-4">
        <h1>{mainRecommendation.name}</h1>
        {mainRecommendation.description && <p>{mainRecommendation.description}</p>}
        {mainRecommendation.category && <p>{mainRecommendation.category}</p>}
        <ul>
          <li>
            <h3>Roast Level</h3>
            <p>{mainRecommendation.roast_level}</p>
          </li>
          <li>
            <h3>Body</h3>
            <p>{mainRecommendation.body}</p>
          </li>
          <li>
            <h3>Sweetness</h3>
            <p>{mainRecommendation.sweetness}</p>
          </li>
          <li>
            <h3>Acidity</h3>
            <p>{mainRecommendation.acidity}</p>
          </li>
        </ul>
        <div>
          <h2>Origin</h2>
          <ul>
            {mainRecommendation?.origin?.map((origin) => (
              <li key={origin}>{origin}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Tasting notes</h2>
          <ul>
            {mainRecommendation?.tasting_notes?.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2>Recommended for</h2>
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
