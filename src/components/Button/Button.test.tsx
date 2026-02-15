import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { Button } from '@/components/Button/Button';

describe('<Button />', () => {
  it('renders a <button> by default with correct defaults and content wrapper', () => {
    render(<Button>Click me</Button>);

    const el = screen.getByRole('button', { name: /click me/i });
    expect(el.tagName).toBe('BUTTON');

    // default data attrs
    expect(el).toHaveAttribute('data-variant', 'primary');
    expect(el).toHaveAttribute('data-size', 'default');
    expect(el).toHaveAttribute('data-icon-position', 'right');

    // default type
    expect(el).toHaveAttribute('type', 'button');

    // content wrapper exists when not iconOnly
    expect(el.querySelector('.button__content')).toHaveTextContent('Click me');
  });

  it('renders an <a> when as="a" and passes href/target/rel', () => {
    render(
      <Button
        as="a"
        href="https://example.com"
        target="_self"
      >
        Go
      </Button>
    );

    const el = screen.getByRole('link', { name: /go/i });
    expect(el.tagName).toBe('A');

    expect(el).toHaveAttribute('href', 'https://example.com');
    expect(el).toHaveAttribute('target', '_self');
    // rel should remain undefined for non-_blank unless provided
    expect(el).not.toHaveAttribute('rel');
  });

  it('adds rel="noopener noreferrer" automatically when target="_blank" and rel is not provided', () => {
    render(
      <Button
        as="a"
        href="/x"
        target="_blank"
      >
        External
      </Button>
    );

    const el = screen.getByRole('link', { name: /external/i });
    expect(el).toHaveAttribute('target', '_blank');
    expect(el).toHaveAttribute('rel', 'noopener noreferrer');
  });

  it('does not overwrite rel when target="_blank" and rel is provided', () => {
    render(
      <Button
        as="a"
        href="/x"
        target="_blank"
        rel="nofollow"
      >
        External
      </Button>
    );

    const el = screen.getByRole('link', { name: /external/i });
    expect(el).toHaveAttribute('rel', 'nofollow');
  });

  it('renders an icon with the correct xlinkHref when icon is provided', () => {
    render(<Button icon={'search' as any}>Search</Button>);

    const el = screen.getByRole('button', { name: /search/i });
    const use = el.querySelector('use');
    expect(use).toBeInTheDocument();
    expect(use).toHaveAttribute('xlink:href', '/icons/icons.svg#search');
  });

  it('when iconOnly=true, hides the .button__content but still renders the icon', () => {
    render(
      <Button
        iconOnly
        icon={'search' as any}
        ariaLabel="Search"
      >
        Search
      </Button>
    );

    const el = screen.getByRole('button', { name: /search/i });
    expect(el.querySelector('.button__content')).not.toBeInTheDocument();
    expect(el.querySelector('.button__icon')).toBeInTheDocument();
  });

  it('falls back aria-label to string children when iconOnly=true and ariaLabel is not provided', () => {
    render(
      <Button
        iconOnly
        icon={'search' as any}
      >
        Search
      </Button>
    );

    const el = screen.getByRole('button', { name: /search/i });
    expect(el).toHaveAttribute('aria-label', 'Search');
  });

  it('does NOT fall back aria-label when children is not a string', () => {
    render(
      <Button
        iconOnly
        icon={'search' as any}
      >
        <span>Search</span>
      </Button>
    );

    const el = screen.getByRole('button');
    expect(el).not.toHaveAttribute('aria-label');
  });

  it('applies sizing and iconOnly padding classes', () => {
    const { rerender } = render(<Button>Hi</Button>);
    let el = screen.getByRole('button', { name: /hi/i });

    expect(el.className).toContain('font-body');
    expect(el.className).toContain('px-5');

    rerender(
      <Button
        size="large"
        iconOnly
        ariaLabel="Hi"
      >
        Hi
      </Button>
    );

    el = screen.getByRole('button', { name: /hi/i });
    expect(el.className).toContain('font-title');
    expect(el.className).toContain('px-3');
  });

  it('calls onClick when enabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(<Button onClick={onClick}>Click</Button>);

    await user.click(screen.getByRole('button', { name: /click/i }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();

    render(
      <Button
        disabled
        onClick={onClick}
      >
        Click
      </Button>
    );

    const el = screen.getByRole('button', { name: /click/i });
    expect(el).toBeDisabled();

    await user.click(el);
    expect(onClick).not.toHaveBeenCalled();
  });
});
