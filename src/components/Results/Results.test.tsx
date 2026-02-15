import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Results } from './Results';

vi.mock('@/components/Results/ResultTile', () => ({
  ResultTile: ({ result, handleChange }: any) => (
    <button
      type="button"
      onClick={handleChange}
    >
      {result.name}
    </button>
  ),
}));

vi.mock('@/components/Button/Button', () => ({
  Button: ({ as, href, children }: any) =>
    as === 'a' ? <a href={href}>{children}</a> : <button type="button">{children}</button>,
}));

const mockData = [
  { sku: '111', name: 'Hot Valley Sauce' },
  { sku: '222', name: 'Yin River' },
] as any[];

describe('<Results />', () => {
  it('renders heading, a tile for each item and a "Back to top" link', () => {
    render(
      <Results
        data={mockData}
        handleChange={vi.fn()}
      />
    );

    expect(
      screen.getByRole('heading', { level: 2, name: /others you will love/i })
    ).toBeInTheDocument();

    expect(screen.getByRole('button', { name: 'Hot Valley Sauce' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Yin River' })).toBeInTheDocument();

    const backToTop = screen.getByRole('link', { name: /back to top/i });
    expect(backToTop).toHaveAttribute('href', '#');
  });

  it('wires each tile click to call handleChange its sku', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <Results
        data={mockData}
        handleChange={handleChange}
      />
    );

    await user.click(screen.getByRole('button', { name: 'Yin River' }));

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('222');
  });

  it('renders a list item per result', () => {
    const { container } = render(
      <Results
        data={mockData}
        handleChange={vi.fn()}
      />
    );

    // ul should contain two li elements
    const items = container.querySelectorAll('ul > li');
    expect(items).toHaveLength(2);
  });
});
