import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { QueryForm } from './QueryForm';

// Keep focused on QueryForm behaviour
vi.mock('@/components/Button/Button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('@/components/Message/Message', () => ({
  Message: ({ children }: any) => <p role="alert">{children}</p>,
}));

describe('<QueryForm />', () => {
  it('renders heading, input, and submit button', () => {
    render(
      <QueryForm
        onSubmit={vi.fn()}
        isLoading={false}
      />
    );

    expect(
      screen.getByRole('heading', { level: 1, name: /describe your perfect coffee/i })
    ).toBeInTheDocument();

    expect(screen.getByPlaceholderText(/in your own words/i)).toBeInTheDocument();

    // Accessible name comes from aria-label
    expect(screen.getByRole('button', { name: /submit search term/i })).toBeInTheDocument();

    // Visible text still present
    expect(screen.getByText(/find my coffee/i)).toBeInTheDocument();
  });

  it('shows validation error when submitted with less than 5 characters', async () => {
    const user = userEvent.setup();
    render(
      <QueryForm
        onSubmit={vi.fn()}
        isLoading={false}
      />
    );

    const input = screen.getByPlaceholderText(/in your own words/i);
    const submit = screen.getByRole('button', { name: /submit search term/i });

    await user.type(input, 'abc');
    await user.click(submit);

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(input).toHaveAttribute('data-valid', 'false');
  });

  it('submits when query is valid (>= 5 characters)', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <QueryForm
        onSubmit={onSubmit}
        isLoading={false}
      />
    );

    const input = screen.getByPlaceholderText(/in your own words/i);
    const submit = screen.getByRole('button', { name: /submit search term/i });

    await user.type(input, 'abcde');
    await user.click(submit);

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({ query: 'abcde' });
  });

  it('disables input and submit button, sets data-loading, and blocks submission when loading', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    const { container } = render(
      <QueryForm
        onSubmit={onSubmit}
        isLoading
      />
    );

    const form = container.querySelector('form');
    expect(form).toHaveAttribute('data-loading', 'true');

    const input = screen.getByPlaceholderText(/in your own words/i);
    expect(input).toBeDisabled();

    const submit = screen.getByRole('button', { name: /submit search term/i });
    expect(submit).toBeDisabled();

    await user.click(submit);
    expect(onSubmit).not.toHaveBeenCalled();
  });
});
