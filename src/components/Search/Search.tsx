'use client';

import { useRecommend } from '@/hooks/useRecommend';
import { QueryForm } from '@/components/QueryForm/QueryForm';
import { Results } from '@/components/Results/Results';

export function Search() {
  const { submit, data, error, isLoading } = useRecommend();

  if (isLoading) {
    return isLoading ? <p>Loading...</p> : null;
  }

  return (
    <div>
      <QueryForm onSubmit={submit} />

      {error ? <p role="alert">{error}</p> : null}

      {data ? <Results data={data} /> : null}
    </div>
  );
}
