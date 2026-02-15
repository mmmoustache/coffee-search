import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { SearchPanel } from './SearchPanel';

type RecommendState = {
  submit: any;
  data: any;
  error: string | null;
  reset: any;
  isLoading: boolean;
};

let recommendState: RecommendState;

vi.mock('@/hooks/useRecommend/useRecommend', () => ({
  useRecommend: () => recommendState,
}));

// Mock child components to keep this test focused on wiring/flow
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

vi.mock('@/components/Product/Product', () => ({
  Product: ({ name, children }: any) => (
    <section data-testid="product">
      <h1>{name}</h1>
      {children}
    </section>
  ),
}));

vi.mock('@/components/Results/Results', () => ({
  Results: ({ data, handleChange }: any) => (
    <section data-testid="results">
      <ul>
        {data.map((r: any) => (
          <li key={r.sku}>
            <button
              type="button"
              onClick={() => handleChange(r.sku)}
            >
              {r.name}
            </button>
          </li>
        ))}
      </ul>
    </section>
  ),
}));

vi.mock('@/components/TextMarquee/TextMarquee', () => ({
  TextMarquee: ({ children }: any) => <div data-testid="marquee">{children}</div>,
}));

vi.mock('@/components/Button/Button', () => ({
  Button: ({ as, href, onClick, children, ...rest }: any) =>
    as === 'a' ? (
      <a
        href={href}
        {...rest}
      >
        {children}
      </a>
    ) : (
      <button
        type="button"
        onClick={onClick}
        {...rest}
      >
        {children}
      </button>
    ),
}));

vi.mock('@/components/Message/Message', () => ({
  Message: ({ children }: any) => <p role="alert">{children}</p>,
}));

const makeData = () => ({
  results: [
    { sku: '1', name: 'Coffee One' },
    { sku: '2', name: 'Coffee Two' },
    { sku: '3', name: 'Coffee Three' },
    { sku: '4', name: 'Coffee Four' },
    { sku: '5', name: 'Coffee Five' },
  ],
});

describe('<SearchPanel />', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    recommendState = {
      submit: vi.fn(),
      data: null,
      error: null,
      reset: vi.fn(() => {
        // emulate real hook reset clearing data
        recommendState.data = null;
        recommendState.error = null;
      }),
      isLoading: false,
    };
  });

  it('renders the shell with QueryForm when there is no selected product', () => {
    render(<SearchPanel />);

    expect(screen.getByTestId('query-form')).toBeInTheDocument();
    expect(screen.queryByTestId('product')).not.toBeInTheDocument();
    expect(screen.queryByTestId('results')).not.toBeInTheDocument();

    // marquee always renders
    expect(screen.getByTestId('marquee')).toHaveTextContent('LOVE COFFEE');
  });

  it('when data arrives, selects the first result and shows Product + Results of "others"', async () => {
    const user = userEvent.setup();

    recommendState.data = makeData();

    render(<SearchPanel />);

    // first result selected
    expect(screen.getByTestId('product')).toBeInTheDocument();
    expect(screen.getByRole('heading', { level: 1, name: 'Coffee One' })).toBeInTheDocument();

    // others = all except selected, sliced to max 4
    const results = screen.getByTestId('results');
    expect(results).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Coffee Two' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Coffee Three' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Coffee Four' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Coffee Five' })).toBeInTheDocument();

    // Clicking an "other" updates selected SKU and product
    await user.click(screen.getByRole('button', { name: 'Coffee Three' }));
    expect(screen.getByRole('heading', { level: 1, name: 'Coffee Three' })).toBeInTheDocument();
  });

  it('clicking "Back to search" resets and returns to QueryForm shell', async () => {
    const user = userEvent.setup();
    recommendState.data = makeData();

    render(<SearchPanel />);

    // product is visible
    expect(screen.getByTestId('product')).toBeInTheDocument();

    // Click reset button inside Product children
    await user.click(screen.getByRole('button', { name: /back to search/i }));

    expect(recommendState.reset).toHaveBeenCalledTimes(1);

    // after reset clears data, product & results disappear, shell returns
    expect(screen.getByTestId('query-form')).toBeInTheDocument();
    expect(screen.queryByTestId('product')).not.toBeInTheDocument();
    expect(screen.queryByTestId('results')).not.toBeInTheDocument();
  });

  it('pressing Escape triggers reset', async () => {
    const user = userEvent.setup();
    recommendState.data = makeData();

    render(<SearchPanel />);

    expect(screen.getByTestId('product')).toBeInTheDocument();

    await user.keyboard('{Escape}');

    expect(recommendState.reset).toHaveBeenCalledTimes(1);
    expect(screen.getByTestId('query-form')).toBeInTheDocument();
    expect(screen.queryByTestId('product')).not.toBeInTheDocument();
  });

  it('renders an error message when error is present', () => {
    recommendState.error = 'Something exploded';
    render(<SearchPanel />);

    expect(screen.getByRole('alert')).toHaveTextContent('Something exploded');
  });

  it('passes isLoading through to QueryForm (and bounces icon class in real component)', () => {
    recommendState.isLoading = true;
    render(<SearchPanel />);

    expect(screen.getByTestId('query-form')).toHaveAttribute('data-loading', 'true');
  });
});
