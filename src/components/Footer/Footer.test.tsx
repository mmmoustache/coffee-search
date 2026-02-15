import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Footer } from '@/components/Footer/Footer';

describe('<Footer />', () => {
  it('renders footer text, source link and icon', () => {
    const { container } = render(<Footer />);

    const footer = container.querySelector('footer');
    expect(footer).toBeInTheDocument();

    expect(screen.getByText('Built with love. All rights reserved.')).toBeInTheDocument();

    const link = screen.getByRole('link', { name: /source code/i });
    expect(link).toHaveAttribute('href', '#');
    expect(link).toHaveAttribute('target', '_blank');
    expect(link).toHaveAttribute('rel', 'noopener noreferrer');

    const useEl = container.querySelector('svg use');
    expect(useEl).toBeInTheDocument();
    expect(useEl).toHaveAttribute('xlink:href', '/icons/icons.svg#backpack');
  });
});
