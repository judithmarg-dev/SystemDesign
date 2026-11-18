import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@core/testing';
import { Checkbox } from './Checkbox';

describe('Checkbox', () => {
  it('toggles when its label is clicked', async () => {
    const onChange = vi.fn();
    renderWithTheme(<Checkbox label="Feed the hedgehog" onChange={onChange} />);
    const checkbox = screen.getByRole('checkbox', { name: 'Feed the hedgehog' });
    expect(checkbox).not.toBeChecked();
    await userEvent.click(screen.getByText('Feed the hedgehog'));
    expect(checkbox).toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('toggles with the keyboard', async () => {
    renderWithTheme(<Checkbox label="Feed the hedgehog" defaultChecked />);
    await userEvent.tab();
    expect(screen.getByRole('checkbox')).toHaveFocus();
    await userEvent.keyboard(' ');
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  it('reflects the indeterminate state on the input', () => {
    const { rerender } = renderWithTheme(<Checkbox label="All" indeterminate />);
    expect(screen.getByRole('checkbox')).toBePartiallyChecked();
    rerender(<Checkbox label="All" />);
    expect(screen.getByRole('checkbox')).not.toBePartiallyChecked();
  });

  it('cannot be toggled while disabled', async () => {
    renderWithTheme(<Checkbox label="Feed the hedgehog" disabled />);
    await userEvent.click(screen.getByText('Feed the hedgehog'));
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });
});
