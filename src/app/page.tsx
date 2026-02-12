'use client';

import { useRecommend } from '@/hooks/useRecommend';
import { useEffect, useMemo, useState } from 'react';
import { getTheme } from '@/utils/getTheme';
import { Product } from '@/components/Product/Product';
import { QueryForm } from '@/components/QueryForm/QueryForm';
import { Results } from '@/components/Results/Results';

export default function Home() {
  const { submit, data, error, reset, isLoading } = useRecommend();

  const [selectedSKU, setSelectedSKU] = useState<string | number | null>(null);

  const results = data?.results ?? [];
  const showResults = !!data && results.length > 0;

  useEffect(() => {
    const firstSku = data?.results?.[0]?.sku ?? null;
    setSelectedSKU(firstSku);
  }, [data]);

  const selected = useMemo(() => {
    if (!selectedSKU) return results[0] ?? null;
    return results.find((r) => r.sku === selectedSKU) ?? results[0] ?? null;
  }, [results, selectedSKU]);

  const others = useMemo(() => {
    if (!selected) return [];
    return results.filter((r) => r.sku !== selected.sku);
  }, [results, selected]);

  const handleReset = () => {
    setSelectedSKU(null);
    reset();
  };

  const theme = getTheme(selectedSKU || '');

  if (!showResults) {
    return (
      <QueryForm
        onSubmit={submit}
        isLoading={isLoading}
      />
    );
  }

  if (!selected) return null;

  return (
    <div className={theme?.backgroundColor}>
      <button
        type="button"
        onClick={handleReset}
        aria-label="Back to results"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          viewBox="0 0 16 16"
        >
          <path
            fillRule="evenodd"
            d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8"
          />
        </svg>
        Back to search
      </button>

      <Product {...selected} />
      <Results
        data={others}
        handleChange={setSelectedSKU}
      />
      {/* {error ? <p role="alert">{error}</p> : null} */}
    </div>
  );
}
