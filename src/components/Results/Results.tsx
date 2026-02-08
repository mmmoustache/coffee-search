import type { RecommendResponse } from "@/types/recommend";

export function Results({ data }: Readonly<{ data: RecommendResponse }>) {
  if (!data.results?.length) return null;

  return (
    <>
      <p>
        {data.results.length} results for {data.query}
      </p>
      <h1>{data.recommendationText}</h1>
      <ul>
        {data.results.map((result) => (
          <li key={result.sku}>{result.name}</li>
        ))}
      </ul>
    </>
  );
}
