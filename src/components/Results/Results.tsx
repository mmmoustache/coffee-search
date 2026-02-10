import { useEffect, useState } from 'react';
import { CSVRow } from '@/types/product';
import type { RecommendResponse } from '@/types/recommend';
import { ProductTitle } from '@/components/ProductTitle/ProductTitle';
import { Scale } from '../Scale/Scale';

const themes = {
  '100001': 'bg-100001',
  '100002': 'bg-100002',
  '100003': 'bg-100003',
  '100004': 'bg-100004',
  '100005': 'bg-100005',
  '100006': 'bg-100006',
  '100007': 'bg-100007',
  '100008': 'bg-100008',
  '100009': 'bg-100009',
  '100010': 'bg-100010',
};

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
      <div className={`flex flex-col gap-4 ${themes[selected.sku]}`}>
        <ProductTitle>{selected.name}</ProductTitle>
        {selected.description && <p className="font-body">{selected.description}</p>}
        {selected.category && <p>{selected.category}</p>}
        <ul>
          {selected.roast_level && (
            <li>
              <h3 className="font-title">Roast Level</h3>
              <Scale value={selected.roast_level} />
            </li>
          )}

          <li>
            <h3 className="font-title">Body</h3>
            <p>{selected.body}</p>
          </li>
          <li>
            <h3 className="font-title">Sweetness</h3>
            <p>{selected.sweetness}</p>
          </li>
          <li>
            <h3 className="font-title">Acidity</h3>
            <p>{selected.acidity}</p>
          </li>
        </ul>
        <div>
          <h2 className="font-title">Origin</h2>
          <ul>
            {selected?.origin?.map((origin) => (
              <li key={origin}>{origin}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-title">Tasting notes</h2>
          <ul>
            {selected?.tasting_notes?.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="font-title">Recommended for</h2>
          <ul>
            {selected?.recommended_for?.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>
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
