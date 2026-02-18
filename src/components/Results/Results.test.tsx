import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { Results } from './Results';

// Mock ResultTile so we test Results composition only
vi.mock('@/components/Results/ResultTile', () => ({
  ResultTile: ({ result, index }: any) => (
    <div data-testid="result-tile">
      {index + 1}. {result.name}
    </div>
  ),
}));

describe('<Results />', () => {
  const mockResults = [
    { sku: '1', name: 'Coffee One' },
    { sku: '2', name: 'Coffee Two' },
    { sku: '3', name: 'Coffee Three' },
  ] as any[];

  it('renders heading and introduction', () => {
    render(
      <Results
        results={mockResults}
        introduction="We picked these for you"
      >
        <div />
      </Results>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: /our recommendations/i })
    ).toBeInTheDocument();

    expect(screen.getByText('We picked these for you')).toBeInTheDocument();
  });

  it('renders one ResultTile per result with correct index', () => {
    render(
      <Results
        results={mockResults}
        introduction="Intro"
      >
        <div />
      </Results>
    );

    const tiles = screen.getAllByTestId('result-tile');
    expect(tiles).toHaveLength(3);

    expect(screen.getByText('1. Coffee One')).toBeInTheDocument();
    expect(screen.getByText('2. Coffee Two')).toBeInTheDocument();
    expect(screen.getByText('3. Coffee Three')).toBeInTheDocument();
  });

  it('renders children below the list', () => {
    render(
      <Results
        results={mockResults}
        introduction="Intro"
      >
        <button type="button">Load more</button>
      </Results>
    );

    expect(screen.getByRole('button', { name: /load more/i })).toBeInTheDocument();
  });

  it('renders empty list when results is empty', () => {
    const { container } = render(
      <Results
        results={[]}
        introduction="Intro"
      >
        <div />
      </Results>
    );

    expect(container.querySelectorAll('ul > li')).toHaveLength(0);
  });
});
