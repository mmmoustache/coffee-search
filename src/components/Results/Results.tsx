import { useState } from 'react';
import { CSVRow } from '@/types/product';
import type { RecommendResponse } from '@/types/recommend';
import { Product } from '@/components/Product/Product';

export function Results({ data, handleChange }) {
  return (
    <ul>
      {data?.map((result) => (
        <li key={result.sku}>
          <button onClick={() => handleChange(result.sku)}>
            {result.name} - {result.origin}
          </button>
        </li>
      ))}
    </ul>
  );
}
