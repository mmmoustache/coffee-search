'use client';

import { useRecommend } from '@/hooks/useRecommend';
import { QueryForm } from '@/components/QueryForm/QueryForm';
import { Results } from '@/components/Results/Results';
import './Search.css';

export function Search() {
  const { submit, data, setData, error, isLoading } = useRecommend();
  const showResults = !!data;

  const closeResults = () => {
    setData(null);
  };

  return (
    <div
      className="shell | min-h-dvh w-full relative"
      data-layout={showResults ? 'full' : 'default'}
    >
      {showResults ? null : (
        <div className="shell__form | max-w-2xl absolute">
          <QueryForm
            onSubmit={submit}
            isLoading={isLoading}
          />
        </div>
      )}

      {showResults ? (
        <div className="shell__results | min-h-dvh p-5">
          <button
            type="button"
            onClick={closeResults}
          >
            Close
          </button>

          <Results data={data} />
        </div>
      ) : null}

      {/* {error ? <p role="alert">{error}</p> : null} */}
    </div>
  );
}
