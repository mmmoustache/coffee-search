import '@testing-library/jest-dom/vitest';
import { render, screen } from '@testing-library/react';
import { Mock, beforeEach, describe, expect, it, vi } from 'vitest';
import { getMessageType } from '@/utils/getMessageType';
import { Message } from '@/components/Message/Message';

// mock the util
vi.mock('@/utils/getMessageType', () => ({
  getMessageType: vi.fn(),
}));

describe('<Message />', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // default mock return
    (getMessageType as unknown as Mock).mockReturnValue({
      backgroundColor: 'bg-test-color',
      textColor: 'text-test',
    });
  });

  it('renders the message content and uses role="alert"', () => {
    render(<Message>Something went wrong</Message>);

    const alert = screen.getByRole('alert');
    expect(alert).toBeInTheDocument();
    expect(alert).toHaveTextContent('Something went wrong');
  });

  it('uses "error" as the default type', () => {
    render(<Message>Default error</Message>);

    expect(getMessageType).toHaveBeenCalledTimes(1);
    expect(getMessageType).toHaveBeenCalledWith('error');
  });

  it('passes a custom type to getMessageType()', () => {
    render(<Message type="success">Saved!</Message>);

    expect(getMessageType).toHaveBeenCalledWith('success');
  });

  it('applies the background color returned by getMessageType()', () => {
    const { container } = render(<Message>Styled</Message>);

    const alert = container.querySelector('p');
    expect(alert).toHaveClass('bg-test-color');
  });
});
