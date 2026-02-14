'use client';

import { useRecommend } from '@/hooks/useRecommend';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/Button/Button';
import { Product } from '@/components/Product/Product';
import { QueryForm } from '@/components/QueryForm/QueryForm';
import { Results } from '@/components/Results/Results';
import { TextMarquee } from '@/components/TextMarquee/TextMarquee';

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
      <div
        className={`shell | overflow-hidden flex flex-col justify-center items-center transition-opacity bg-100001 ${selected ? 'opacity-0 h-0' : 'opacity-100 h-(--shell-height) m-5'}`}
      >
        <div className="flex flex-col gap-2">
          <svg
            className={`icon | mx-auto ${isLoading && 'animate-bounce'}`}
            width="4em"
            height="4em"
            fill="currentColor"
          >
            <use xlinkHref="/icons/icons.svg#cup-hot" />
          </svg>
          <QueryForm
            onSubmit={submit}
            isLoading={isLoading}
          />
        </div>
      </div>

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
      <TextMarquee>LOVE COFFEE</TextMarquee>
      {/* {error ? <p role="alert">{error}</p> : null} */}
    </>
  );
}
