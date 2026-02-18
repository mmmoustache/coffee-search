import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { getTheme } from '@/utils/getTheme';
import { ResultTile } from './ResultTile';

// Mock theme util
vi.mock('@/utils/getTheme', () => ({
  getTheme: vi.fn(),
}));

// Mock Button to keep test focused on ResultTile behaviour
vi.mock('@/components/Button/Button', () => ({
  Button: ({ as, href, children }: any) =>
    as === 'a' ? <a href={href}>{children}</a> : <button>{children}</button>,
}));

describe('<ResultTile />', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    (getTheme as unknown as Mock).mockReturnValue({
      backgroundColor: 'bg-test',
      textColor: 'text-test',
    });
  });

  const result = {
    sku: 'sku-123',
    name: 'Ethiopia Natural',
    origin: ['Ethiopia', 'Kenya'],
    reasons: ['Fruity', 'Bright acidity', 'Floral notes'],
  } as any;

  it('renders the indexed title, origin, and reasons', () => {
    render(
      <ResultTile
        result={result}
        index={0}
      />
    );

    // index is displayed as 1-based
    expect(screen.getByText('1.')).toBeInTheDocument();
    expect(screen.getByText('Ethiopia Natural')).toBeInTheDocument();

    expect(screen.getByText('Origin: Ethiopia, Kenya')).toBeInTheDocument();

    expect(screen.getByText('Fruity')).toBeInTheDocument();
    expect(screen.getByText('Bright acidity')).toBeInTheDocument();
    expect(screen.getByText('Floral notes')).toBeInTheDocument();
  });

  it('calls getTheme with the sku and applies theme classes', () => {
    const { container } = render(
      <ResultTile
        result={result}
        index={1}
      />
    );

    expect(getTheme).toHaveBeenCalledTimes(1);
    expect(getTheme).toHaveBeenCalledWith('sku-123');

    // background applied to image wrapper
    expect(container.querySelector('.bg-test')).toBeInTheDocument();

    // text color applied to index number span
    expect(container.querySelector('.text-test')).toBeInTheDocument();
  });

  it('renders a link to the product details page', () => {
    render(
      <ResultTile
        result={result}
        index={0}
      />
    );

    const link = screen.getByRole('link', { name: /view details/i });

    expect(link).toHaveAttribute('href', '/product/sku-123');
  });

  it('renders a decorative image', () => {
    render(
      <ResultTile
        result={result}
        index={0}
      />
    );

    const img = screen.getByRole('img');

    expect(img).toHaveAttribute('src', '/pack.webp');
    expect(img).toHaveAttribute('alt', 'Pack shot of the Ethiopia Natural product');
  });

  it('renders nothing when result is missing', () => {
    const { container } = render(
      <ResultTile
        result={undefined as any}
        index={0}
      />
    );

    expect(container.firstChild).toBeNull();
  });
});
