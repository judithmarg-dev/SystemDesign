import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@core/testing';
import { TextField } from './TextField';

describe('TextField', () => {
  it('associates the label with the input', async () => {
    const onChange = vi.fn();
    renderWithTheme(<TextField label="Pet name" onChange={onChange} />);
    const input = screen.getByLabelText('Pet name');
    await userEvent.type(input, 'Mochi');
    expect(input).toHaveValue('Mochi');
    expect(onChange).toHaveBeenCalledTimes(5);
  });

  it('exposes helper text as the description and the error state as invalid', () => {
    renderWithTheme(<TextField label="Pet name" error helperText="Too short" />);
    const input = screen.getByLabelText('Pet name');
    expect(input).toHaveAccessibleDescription('Too short');
    expect(input).toBeInvalid();
  });

  it('is not marked invalid without an error', () => {
    renderWithTheme(<TextField label="Pet name" />);
    expect(screen.getByLabelText('Pet name')).not.toHaveAttribute('aria-invalid');
  });

  it('renders a textarea when multiline', () => {
    renderWithTheme(<TextField label="About" multiline rows={4} />);
    const textarea = screen.getByLabelText('About');
    expect(textarea.tagName).toBe('TEXTAREA');
    expect(textarea).toHaveAttribute('rows', '4');
  });
});
