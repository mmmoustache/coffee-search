'use client';

import { useRecommend } from '@/hooks/useRecommend';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/Button/Button';
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
    return results.filter((r) => r.sku !== selected.sku).splice(0, 4);
  }, [results, selected]);

  const handleReset = () => {
    setSelectedSKU(null);
    reset();
  };

  return (
    <>
      <QueryForm
        onSubmit={submit}
        isLoading={isLoading}
      />

      {selected && (
        <Product {...selected}>
          <div className="flex pt-6 gap-6 justify-between">
            <Button
              type="button"
              onClick={handleReset}
              icon="arrow-left"
              iconPosition="left"
            >
              Back to search
            </Button>
            <Button
              as="a"
              href="#"
              icon="trolley"
              iconPosition="right"
              variant="secondary"
            >
              Buy now
            </Button>
          </div>
        </Product>
      )}

      {showResults && (
        <Results
          data={others}
          handleChange={setSelectedSKU}
        />
      )}
      {/* {error ? <p role="alert">{error}</p> : null} */}
    </>
  );
}
