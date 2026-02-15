import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { QueryForm } from './QueryForm';

vi.mock('@/components/Button/Button', () => ({
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
}));

vi.mock('@/components/Message/Message', () => ({
  Message: ({ children }: any) => <p role="alert">{children}</p>,
}));

describe('<QueryForm />', () => {
  it('renders heading, input and submit button', () => {
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

    expect(screen.getByRole('button', { name: /submit search term/i })).toBeInTheDocument();

    expect(screen.getByText(/quench my thirst/i)).toBeInTheDocument();
  });

  it('shows a validation error after blur when query is shorter than 5 chars', async () => {
    const user = userEvent.setup();
    render(
      <QueryForm
        onSubmit={vi.fn()}
        isLoading={false}
      />
    );

    const input = screen.getByPlaceholderText(/in your own words/i);

    await user.type(input, 'abc');
    await user.tab(); // blur input

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(input).toHaveAttribute('data-valid', 'false');
  });

  it('submits when query is valid (>= 5 chars)', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(
      <QueryForm
        onSubmit={onSubmit}
        isLoading={false}
      />
    );

    const input = screen.getByPlaceholderText(/in your own words/i);
    await user.type(input, 'abcde');

    await user.click(screen.getByRole('button', { name: /submit search term/i }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit).toHaveBeenCalledWith({ query: 'abcde' });
  });

  it('disables input and submit button, sets data-loading and blocks submission when loading', async () => {
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
