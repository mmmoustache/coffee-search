"use client";

import { QueryFormComponent } from "@/components/QueryForm/QueryFormComponent";
import { Results } from "@/components/Results/Results";
import { useRecommend } from "@/hooks/useRecommend";

export default function QueryFeature() {
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
