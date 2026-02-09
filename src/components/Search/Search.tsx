'use client';

import { useRecommend } from '@/hooks/useRecommend';
import { QueryForm } from '@/components/QueryForm/QueryForm';
import { Results } from '@/components/Results/Results';

export function Search() {
  const { submit, data, error, isLoading } = useRecommend();

  return (
    <div>
      <QueryForm
        onSubmit={submit}
        isLoading={isLoading}
      />

      {isLoading ? <p>Loading...</p> : data ? <Results data={data} /> : null}

      {error ? <p role="alert">{error}</p> : null}
    </div>
  );
}
