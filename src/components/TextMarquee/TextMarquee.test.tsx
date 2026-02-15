import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TextMarquee } from './TextMarquee';

describe('<TextMarquee />', () => {
  it('renders a marquee track and repeats the children content (10 + 10)', () => {
    const { container } = render(
      <TextMarquee>
        <span>HELLO</span>
      </TextMarquee>
    );

    const root = container.querySelector('.text-marquee');
    expect(root).toBeInTheDocument();

    const track = container.querySelector('.text-marquee__track');
    expect(track).toBeInTheDocument();

    // children content should appear 20 times total (10 original + 10 duplicate)
    const occurrences = screen.getAllByText('HELLO');
    expect(occurrences).toHaveLength(20);

    // there are 20 items and 20 spacers
    expect(container.querySelectorAll('.text-marquee__item')).toHaveLength(20);
    const spacers = container.querySelectorAll('.text-marquee__spacer');
    expect(spacers).toHaveLength(20);

    // spacers are aria-hidden and contain the bullet
    spacers.forEach((spacer) => {
      expect(spacer).toHaveAttribute('aria-hidden', 'true');
      expect(spacer).toHaveTextContent('•');
    });

    // duplicate span is aria-hidden
    const hiddenDup = track?.querySelector('span[aria-hidden="true"]');
    expect(hiddenDup).toBeInTheDocument();
  });

  it('does not aria-hide the first set of items', () => {
    const { container } = render(<TextMarquee>HI</TextMarquee>);

    const track = container.querySelector('.text-marquee__track');
    expect(track).toBeInTheDocument();

    const spans = track!.querySelectorAll(':scope > span');
    expect(spans).toHaveLength(2);
    expect(spans[0]).not.toHaveAttribute('aria-hidden');
    expect(spans[1]).toHaveAttribute('aria-hidden', 'true');
  });
});
