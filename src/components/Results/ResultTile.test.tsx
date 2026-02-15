import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { getTheme } from '@/utils/getTheme';
import { ResultTile } from '@/components/Results/ResultTile';

vi.mock('@/utils/getTheme', () => ({
  getTheme: vi.fn(),
}));

const mockResult = {
  sku: '12345',
  name: 'Hot Valley Sauce',
} as any;

describe('<ResultTile />', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // mock scrollTo
    window.scrollTo = vi.fn();

    // default theme mock
    (getTheme as unknown as Mock).mockReturnValue({
      backgroundColor: 'bg-test-theme',
    });
  });

  it('renders the result name', () => {
    render(
      <ResultTile
        result={mockResult}
        handleChange={vi.fn()}
      />
    );

    expect(screen.getByText('Hot Valley Sauce')).toBeInTheDocument();
  });

  it('applies the background theme class from getTheme()', () => {
    const { container } = render(
      <ResultTile
        result={mockResult}
        handleChange={vi.fn()}
      />
    );

    const themedSpan = container.querySelector('span.bg-test-theme');
    expect(themedSpan).toBeInTheDocument();
  });

  it('calls handleChange with sku and scrolls to top when clicked', async () => {
    const user = userEvent.setup();
    const handleChange = vi.fn();

    render(
      <ResultTile
        result={mockResult}
        handleChange={handleChange}
      />
    );

    const button = screen.getByRole('button');

    await user.click(button);

    expect(handleChange).toHaveBeenCalledTimes(1);
    expect(handleChange).toHaveBeenCalledWith('12345');

    expect(window.scrollTo).toHaveBeenCalledWith(0, 0);
  });

  it('calls getTheme with the sku', () => {
    render(
      <ResultTile
        result={mockResult}
        handleChange={vi.fn()}
      />
    );

    expect(getTheme).toHaveBeenCalledWith('12345');
  });
});
