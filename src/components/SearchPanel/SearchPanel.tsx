'use client';

import { useRecommend } from '@/hooks/useRecommend/useRecommend';
import { Button } from '@/components/Button/Button';
import { Message } from '@/components/Message/Message';
import { QueryForm } from '@/components/QueryForm/QueryForm';
import { Results } from '@/components/Results/Results';
import { TextMarquee } from '@/components/TextMarquee/TextMarquee';

export function SearchPanel() {
  const { submit, data, error, reset, isLoading } = useRecommend();

  const results = data?.results ?? [];
  const showResults = !!data && results.length > 0;

  const handleReset = () => {
    reset();
    window.scrollTo(0, 0);
  };

  return (
    <>
      {showResults ? null : (
        <div
          className={`shell | overflow-hidden flex flex-col justify-center items-center transition-opacity bg-100001 mx-5 border-white ${showResults ? 'min-h-3/6' : 'min-h-(--shell-height)'}`}
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
      )}

      {showResults && (
        <Results
          results={data?.results}
          introduction={data?.introduction}
        >
          <div className="text-center pt-6 flex justify-center gap-6">
            <Button
              as="a"
              href="#"
              icon="arrow-up-square"
              variant="secondary"
            >
              Back to top
            </Button>
            <Button
              icon="arrow-left"
              variant="primary"
              onClick={handleReset}
            >
              New search
            </Button>
          </div>
        </Results>
      )}

      <TextMarquee>LOVE COFFEE</TextMarquee>

      {error ? <Message>{error}</Message> : null}
    </>
  );
}
