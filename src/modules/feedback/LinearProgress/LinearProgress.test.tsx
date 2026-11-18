import { screen } from '@testing-library/react';
import { renderWithTheme } from '@core/testing';
import { LinearProgress } from './LinearProgress';

describe('LinearProgress', () => {
  it('exposes the value and range when determinate', () => {
    renderWithTheme(<LinearProgress aria-label="Upload" value={30} min={10} max={50} />);
    const bar = screen.getByRole('progressbar', { name: 'Upload' });
    expect(bar).toHaveAttribute('aria-valuenow', '30');
    expect(bar).toHaveAttribute('aria-valuemin', '10');
    expect(bar).toHaveAttribute('aria-valuemax', '50');
  });

  it('clamps out-of-range values', () => {
    renderWithTheme(<LinearProgress aria-label="Upload" value={140} />);
    expect(screen.getByRole('progressbar')).toHaveAttribute('aria-valuenow', '100');
  });

  it('omits the value attributes when indeterminate', () => {
    renderWithTheme(<LinearProgress aria-label="Loading" />);
    const bar = screen.getByRole('progressbar');
    expect(bar).not.toHaveAttribute('aria-valuenow');
    expect(bar).not.toHaveAttribute('aria-valuemax');
  });
});
