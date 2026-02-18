import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { getTheme } from '@/utils/getTheme';
import { PromoTile } from '@/components/PromoListing/PromoTile';

vi.mock('@/utils/getTheme', () => ({
  getTheme: vi.fn(),
}));

describe('<PromoTile />', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (getTheme as unknown as Mock).mockReturnValue({
      backgroundColor: 'bg-test-theme',
    });
  });

  it('renders a link to the product page and displays the product name', () => {
    const product = { sku: 'abc-123', name: 'Moonlight Roast' } as any;

    render(<PromoTile product={product} />);

    const link = screen.getByRole('link', { name: /moonlight roast/i });
    expect(link).toHaveAttribute('href', '/product/abc-123');

    expect(screen.getByText('Moonlight Roast')).toBeInTheDocument();
  });

  it('calls getTheme with the product sku and applies the background class', () => {
    const product = { sku: 'abc-123', name: 'Moonlight Roast' } as any;
    const { container } = render(<PromoTile product={product} />);

    expect(getTheme).toHaveBeenCalledTimes(1);
    expect(getTheme).toHaveBeenCalledWith('abc-123');

    const themedSpan = container.querySelector('span.bg-test-theme');
    expect(themedSpan).toBeInTheDocument();
  });

  it('renders the product image', () => {
    const product = { sku: 'abc-123', name: 'Moonlight Roast' } as any;
    render(<PromoTile product={product} />);

    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('alt', 'Pack shot of the Moonlight Roast product');
    expect(img).toHaveAttribute('src', '/pack.webp');
  });
});
