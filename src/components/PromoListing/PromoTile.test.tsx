import { render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PromoTile } from './PromoTile';

vi.mock('@/consts/label', () => ({
  PACKSHOT_ALT: 'Pack shot of the {name} product',
}));

vi.mock('next/image', () => ({
  default: (props: any) => {
    const { src, alt, width, height, ...rest } = props;
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        {...rest}
      />
    );
  },
}));

const getThemeMock = vi.fn();
vi.mock('@/utils/getTheme', () => ({
  getTheme: (sku: string) => getThemeMock(sku),
}));

const interpolateTextMock = vi.fn();
vi.mock('@/utils/interpolate', () => ({
  interpolateText: (...args: any[]) => interpolateTextMock(...args),
}));

describe('PromoTile', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders link with href and product name', () => {
    getThemeMock.mockReturnValue({ backgroundColor: 'bg-100001' });
    interpolateTextMock.mockReturnValue('Pack shot alt');

    render(
      <PromoTile
        href="/product/100001?from=home"
        product={{ sku: '100001', name: 'Moon Roast' } as any}
      />
    );

    const link = screen.getByRole('link', { name: /moon roast/i });
    expect(link).toHaveAttribute('href', '/product/100001?from=home');
    expect(screen.getByText('Moon Roast')).toBeInTheDocument();
  });

  it('uses getTheme(sku) to apply background color class', () => {
    getThemeMock.mockReturnValue({ backgroundColor: 'bg-999999' });
    interpolateTextMock.mockReturnValue('Pack shot alt');

    const { container } = render(
      <PromoTile
        href="/x"
        product={{ sku: 'SKU-XYZ', name: 'Star Blend' } as any}
      />
    );

    expect(getThemeMock).toHaveBeenCalledTimes(1);
    expect(getThemeMock).toHaveBeenCalledWith('SKU-XYZ');

    // The first wrapper span around the Image has the theme background class
    const packshotWrapper = container.querySelector('a > span');
    expect(packshotWrapper).not.toBeNull();
    expect(packshotWrapper!.className).toContain('bg-999999');
  });

  it('builds the image alt text via interpolateText(PACKSHOT_ALT, { name })', () => {
    getThemeMock.mockReturnValue({ backgroundColor: 'bg-100001' });
    interpolateTextMock.mockReturnValue('Pack shot of the Sun product');

    render(
      <PromoTile
        href="/x"
        product={{ sku: '100002', name: 'Sun' } as any}
      />
    );

    expect(interpolateTextMock).toHaveBeenCalledTimes(1);
    expect(interpolateTextMock).toHaveBeenCalledWith('Pack shot of the {name} product', {
      name: 'Sun',
    });

    const img = screen.getByRole('img', { name: 'Pack shot of the Sun product' });
    expect(img).toHaveAttribute('src', '/pack.webp');
    expect(img).toHaveAttribute('width', '300');
    expect(img).toHaveAttribute('height', '300');
  });

  it('handles missing theme gracefully (no background class added)', () => {
    getThemeMock.mockReturnValue(undefined);
    interpolateTextMock.mockReturnValue('Alt');

    const { container } = render(
      <PromoTile
        href="/x"
        product={{ sku: '100003', name: 'No Theme' } as any}
      />
    );

    const packshotWrapper = container.querySelector('a > span');
    expect(packshotWrapper).not.toBeNull();

    expect(packshotWrapper!.className.includes('bg-')).toBe(false);
  });
});
