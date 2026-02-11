import { useState } from 'react';
import { CSVRow } from '@/types/product';
import type { RecommendResponse } from '@/types/recommend';
import { Product } from '@/components/Product/Product';

export function Results({ data }: Readonly<{ data: RecommendResponse }>) {
  const [selected, setSelected] = useState<CSVRow>(data?.results?.[0]);
  const [recommendations, setRecommendations] = useState<CSVRow>(
    data?.results?.filter((result) => result.sku !== selected.sku)
  );

  if (!selected) {
    return;
  }

  const handleChange = (newItem) => {
    setSelected(newItem);
    setRecommendations(data?.results?.filter((result) => result.sku !== newItem.sku));
  };

  return (
    <>
      <Product {...selected} />
      <ul>
        {recommendations?.map((result) => (
          <li key={result.sku}>
            <button onClick={() => handleChange(result)}>
              {result.name} - {result.origin}
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}
