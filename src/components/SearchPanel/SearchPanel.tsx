'use client';

import { useRecommend } from '@/hooks/useRecommend/useRecommend';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo } from 'react';
import { Button } from '@/components/Button/Button';
import { Message } from '@/components/Message/Message';
import { QueryForm } from '@/components/QueryForm/QueryForm';
import { Results } from '@/components/Results/Results';
import { TextMarquee } from '@/components/TextMarquee/TextMarquee';

export function SearchPanel() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { submit, data, error, reset, isLoading } = useRecommend();

  const queryFromUrl = useMemo(() => (searchParams.get('query') ?? '').trim(), [searchParams]);

  const results = data?.results ?? [];
  const showResults = !!data && results.length > 0;

  useEffect(() => {
    if (!queryFromUrl) return;
    if (showResults) return;

    submit({ query: queryFromUrl });
  }, [queryFromUrl]);

  const handleReset = () => {
    reset();
    router.replace(pathname, { scroll: false });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (payload: { query: string }) => {
    const q = payload.query.trim();
    router.replace(`${pathname}?query=${encodeURIComponent(q)}`, { scroll: false });

    await submit(payload);

    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 0);
  };

  return (
    <>
      {showResults ? null : (
        <div className="shell | overflow-hidden flex flex-col justify-center items-center transition-opacity bg-100001 mx-3 lg:mx-5 border-white min-h-(--shell-height)">
          <div className="flex flex-col gap-2">
            <svg
              className={`icon | mx-auto${isLoading ? ' animate-bounce' : ''}`}
              width="4em"
              height="4em"
              fill="currentColor"
            >
              <use xlinkHref="/icons/icons.svg#cup-hot" />
            </svg>
            <QueryForm
              onSubmit={handleSubmit}
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
          <div className="text-center pt-6 flex max-md:flex-col justify-center gap-6">
            <div>
              <Button
                href="#"
                icon="arrow-up-square"
                variant="secondary"
              >
                Back to top
              </Button>
            </div>
            <div>
              <Button
                icon="search"
                variant="primary"
                onClick={handleReset}
              >
                New search
              </Button>
            </div>
          </div>
        </Results>
      )}

      <TextMarquee>LOVE COFFEE</TextMarquee>

      {error ? <Message>{error}</Message> : null}
    </>
  );
}
