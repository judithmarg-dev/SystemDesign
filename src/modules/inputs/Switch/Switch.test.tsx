import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@core/testing';
import { Switch } from './Switch';

describe('Switch', () => {
  it('is exposed as a labelled switch and toggles on click', async () => {
    const onChange = vi.fn();
    renderWithTheme(<Switch label="Cozy mode" onChange={onChange} />);
    const control = screen.getByRole('switch', { name: 'Cozy mode' });
    expect(control).not.toBeChecked();
    await userEvent.click(screen.getByText('Cozy mode'));
    expect(control).toBeChecked();
    expect(onChange).toHaveBeenCalledTimes(1);
  });

  it('toggles with the space key', async () => {
    renderWithTheme(<Switch label="Cozy mode" defaultChecked />);
    await userEvent.tab();
    await userEvent.keyboard(' ');
    expect(screen.getByRole('switch')).not.toBeChecked();
  });

  it('stays put when controlled until the parent updates `checked`', async () => {
    const onChange = vi.fn();
    const { rerender } = renderWithTheme(<Switch label="Cozy mode" checked={false} onChange={onChange} />);
    await userEvent.click(screen.getByRole('switch'));
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('switch')).not.toBeChecked();
    rerender(<Switch label="Cozy mode" checked onChange={onChange} />);
    expect(screen.getByRole('switch')).toBeChecked();
  });

  it('keeps the character thumb out of the accessibility tree', () => {
    renderWithTheme(<Switch label="Cozy mode" character="bear" />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
