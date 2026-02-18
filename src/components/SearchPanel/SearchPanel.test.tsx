import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchPanel } from '@/components/SearchPanel/SearchPanel';

let recommendState: any;

vi.mock('@/hooks/useRecommend/useRecommend', () => ({
  useRecommend: () => recommendState,
}));

vi.mock('@/components/QueryForm/QueryForm', () => ({
  QueryForm: ({ onSubmit, isLoading }: any) => (
    <div
      data-testid="query-form"
      data-loading={String(isLoading)}
    >
      <button
        type="button"
        onClick={() => onSubmit({ query: 'abcde' })}
      >
        Submit query
      </button>
    </div>
  ),
}));

vi.mock('@/components/Results/Results', () => ({
  Results: ({ results, introduction, children }: any) => (
    <section data-testid="results">
      <p>{introduction}</p>
      <ul>
        {results.map((r: any) => (
          <li key={r.sku}>{r.name}</li>
        ))}
      </ul>
      {children}
    </section>
  ),
}));

vi.mock('@/components/TextMarquee/TextMarquee', () => ({
  TextMarquee: ({ children }: any) => <div data-testid="marquee">{children}</div>,
}));

vi.mock('@/components/Button/Button', () => ({
  Button: ({ as, href, onClick, children }: any) =>
    as === 'a' ? (
      <a href={href}>{children}</a>
    ) : (
      <button
        type="button"
        onClick={onClick}
      >
        {children}
      </button>
    ),
}));

vi.mock('@/components/Message/Message', () => ({
  Message: ({ children }: any) => <p role="alert">{children}</p>,
}));

describe('<SearchPanel />', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    window.scrollTo = vi.fn();

    recommendState = {
      submit: vi.fn(),
      reset: vi.fn(),
      isLoading: false,
      error: null,
      data: null,
    };
  });

  it('renders QueryForm when there are no results', () => {
    render(<SearchPanel />);

    expect(screen.getByTestId('query-form')).toBeInTheDocument();
    expect(screen.queryByTestId('results')).not.toBeInTheDocument();

    // marquee always present
    expect(screen.getByTestId('marquee')).toHaveTextContent('LOVE COFFEE');
  });

  it('renders Results when data is present', () => {
    recommendState.data = {
      introduction: 'We picked these for you',
      results: [
        { sku: '1', name: 'Coffee One' },
        { sku: '2', name: 'Coffee Two' },
      ],
    };

    render(<SearchPanel />);

    expect(screen.getByTestId('results')).toBeInTheDocument();
    expect(screen.getByText('We picked these for you')).toBeInTheDocument();

    expect(screen.getByText('Coffee One')).toBeInTheDocument();
    expect(screen.getByText('Coffee Two')).toBeInTheDocument();

    // QueryForm hidden
    expect(screen.queryByTestId('query-form')).not.toBeInTheDocument();
  });

  it('clicking "New search" resets and scrolls to top', async () => {
    const user = userEvent.setup();

    recommendState.data = {
      introduction: 'Intro',
      results: [{ sku: '1', name: 'Coffee One' }],
    };

    render(<SearchPanel />);

    await user.click(screen.getByRole('button', { name: /new search/i }));

    expect(recommendState.reset).toHaveBeenCalledTimes(1);
    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('renders Back to top link when showing results', () => {
    recommendState.data = {
      introduction: 'Intro',
      results: [{ sku: '1', name: 'Coffee One' }],
    };

    render(<SearchPanel />);

    const link = screen.getByRole('link', { name: /back to top/i });
    expect(link).toHaveAttribute('href', '#');
  });

  it('renders error message when error exists', () => {
    recommendState.error = 'Something went wrong';

    render(<SearchPanel />);

    expect(screen.getByRole('alert')).toHaveTextContent('Something went wrong');
  });

  it('passes loading state through to QueryForm', () => {
    recommendState.isLoading = true;

    render(<SearchPanel />);

    expect(screen.getByTestId('query-form')).toHaveAttribute('data-loading', 'true');
  });
});
