import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { PromoListing } from '@/components/PromoListing/PromoListing';

// Mock child so we only test PromoListing's responsibility
vi.mock('@/components/PromoListing/PromoTile', () => ({
  PromoTile: ({ product }: any) => <a href={`/product/${product.sku}`}>{product.name}</a>,
}));

describe('<PromoListing />', () => {
  it('renders the heading', () => {
    render(<PromoListing products={[]} />);

    expect(
      screen.getByRole('heading', { level: 2, name: /you will also love/i })
    ).toBeInTheDocument();
  });

  it('renders a PromoTile for each product', () => {
    const products = [
      { sku: 'a1', name: 'Moonlight Roast' },
      { sku: 'b2', name: 'Sunrise Blend' },
      { sku: 'c3', name: 'Starfall Espresso' },
    ] as any[];

    render(<PromoListing products={products} />);

    expect(screen.getByRole('link', { name: /moonlight roast/i })).toHaveAttribute(
      'href',
      '/product/a1'
    );
    expect(screen.getByRole('link', { name: /sunrise blend/i })).toHaveAttribute(
      'href',
      '/product/b2'
    );
    expect(screen.getByRole('link', { name: /starfall espresso/i })).toHaveAttribute(
      'href',
      '/product/c3'
    );
  });

  it('renders a list item per product', () => {
    const products = [
      { sku: 'a1', name: 'Moonlight Roast' },
      { sku: 'b2', name: 'Sunrise Blend' },
    ] as any[];

    const { container } = render(<PromoListing products={products} />);

    expect(container.querySelectorAll('ul > li')).toHaveLength(2);
  });

  it('handles missing products prop by rendering an empty list', () => {
    // Products has a default of [] in the component signature
    const { container } = render(<PromoListing products={undefined as any} />);

    expect(container.querySelectorAll('ul > li')).toHaveLength(0);
  });
});
