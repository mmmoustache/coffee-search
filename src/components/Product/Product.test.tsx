import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { getTheme } from '@/utils/getTheme';
import { Product } from '@/components/Product/Product';

vi.mock('@/utils/getTheme', () => ({
  getTheme: vi.fn(),
}));

vi.mock('@/components/Scale/Scale', () => ({
  Scale: ({ value }: any) => <div data-testid="scale">Scale: {value}</div>,
}));

vi.mock('@/components/TextMarquee/TextMarquee', () => ({
  TextMarquee: ({ children }: any) => <div data-testid="marquee">{children}</div>,
}));

const baseProps = {
  sku: 'SKU-123',
  name: 'Ethiopia Natural',
  body: 3,
  sweetness: 4,
  acidity: 2,
  description: 'Fruity and bright.',
  category: 'Filter',
  roast_level: 3.5,
  origin: ['Ethiopia'],
  tasting_notes: ['Blueberry', 'Jasmine'],
  recommended_for: ['V60', 'Aeropress'],
} as any;

describe('<Product />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getTheme as unknown as Mock).mockReturnValue({
      backgroundColor: 'bg-test-theme',
    });
  });

  it('renders core content and applies theme class from getTheme()', () => {
    const { container } = render(<Product {...baseProps} />);

    // getTheme called with sku
    expect(getTheme).toHaveBeenCalledWith('SKU-123');

    // themed root
    const root = container.querySelector('.product');
    expect(root).toBeInTheDocument();
    expect(root).toHaveClass('bg-test-theme');

    // heading + description + category
    expect(
      screen.getByRole('heading', { level: 1, name: /ethiopia natural/i })
    ).toBeInTheDocument();
    expect(screen.getByText('Fruity and bright.')).toBeInTheDocument();
    expect(screen.getByText('Filter')).toBeInTheDocument();

    // descriptor labels + values
    expect(screen.getByText('Body')).toBeInTheDocument();
    expect(screen.getByText('Sweetness')).toBeInTheDocument();
    expect(screen.getByText('Acidity')).toBeInTheDocument();
    expect(screen.getByText('3')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();

    // roast level section + Scale rendered
    expect(screen.getByRole('heading', { level: 2, name: /roast level/i })).toBeInTheDocument();
    expect(screen.getByTestId('scale')).toHaveTextContent('Scale: 3.5');

    // origin section
    expect(screen.getByRole('heading', { level: 2, name: /origin/i })).toBeInTheDocument();
    expect(screen.getByText('Ethiopia')).toBeInTheDocument();

    // tasting notes + recommended for lists
    expect(screen.getByRole('heading', { level: 2, name: /tasting notes/i })).toBeInTheDocument();
    expect(screen.getByText('Blueberry')).toBeInTheDocument();
    expect(screen.getByText('Jasmine')).toBeInTheDocument();

    expect(screen.getByRole('heading', { level: 2, name: /recommended for/i })).toBeInTheDocument();
    expect(screen.getByText('V60')).toBeInTheDocument();
    expect(screen.getByText('Aeropress')).toBeInTheDocument();

    // marquee with product name
    expect(screen.getByTestId('marquee')).toHaveTextContent('Ethiopia Natural');
  });

  it('renders children passed into the Product', () => {
    render(
      <Product {...baseProps}>
        <button type="button">Buy now</button>
      </Product>
    );

    expect(screen.getByRole('button', { name: /buy now/i })).toBeInTheDocument();
  });

  it('does not render Roast Level when roast_level is missing, and does not render Origin when origin is empty', () => {
    render(
      <Product
        {...baseProps}
        roast_level={undefined}
        origin={[]}
      />
    );

    expect(
      screen.queryByRole('heading', { level: 2, name: /roast level/i })
    ).not.toBeInTheDocument();
    expect(screen.queryByRole('heading', { level: 2, name: /origin/i })).not.toBeInTheDocument();
    expect(screen.queryByTestId('scale')).not.toBeInTheDocument();
  });

  it('does not render Tasting notes / Recommended for block unless BOTH arrays are present', () => {
    const { rerender } = render(
      <Product
        {...baseProps}
        tasting_notes={undefined}
        recommended_for={baseProps.recommended_for}
      />
    );

    expect(
      screen.queryByRole('heading', { level: 2, name: /tasting notes/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { level: 2, name: /recommended for/i })
    ).not.toBeInTheDocument();

    rerender(
      <Product
        {...baseProps}
        tasting_notes={baseProps.tasting_notes}
        recommended_for={undefined}
      />
    );

    expect(
      screen.queryByRole('heading', { level: 2, name: /tasting notes/i })
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole('heading', { level: 2, name: /recommended for/i })
    ).not.toBeInTheDocument();
  });

  it('does not render category/description when they are not provided', () => {
    render(
      <Product
        {...baseProps}
        category={undefined}
        description={undefined}
      />
    );

    expect(screen.queryByText('Filter')).not.toBeInTheDocument();
    expect(screen.queryByText('Fruity and bright.')).not.toBeInTheDocument();
  });

  it('calls getTheme with empty string when sku is falsy', () => {
    render(
      <Product
        {...baseProps}
        sku={''}
      />
    );
    expect(getTheme).toHaveBeenCalledWith('');
  });
});
