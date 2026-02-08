'use client';

import { useRecommend } from '@/hooks/useRecommend';
import { QueryFormComponent } from '@/components/QueryForm/QueryFormComponent';
import { Results } from '@/components/Results/Results';

export function QueryForm() {
  const { submit, data, error, isLoading } = useRecommend();

  return (
    <div>
      <QueryFormComponent onSubmit={submit} />

      {isLoading ? <p>Loading...</p> : null}

      {error ? <p role="alert">{error}</p> : null}

      {data ? <Results data={data} /> : null}
    </div>
  );
}
