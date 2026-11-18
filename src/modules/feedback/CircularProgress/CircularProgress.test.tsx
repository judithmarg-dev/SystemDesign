import { screen } from '@testing-library/react';
import { renderWithTheme } from '@core/testing';
import { CircularProgress } from './CircularProgress';

describe('CircularProgress', () => {
  it('exposes a clamped value when determinate', () => {
    renderWithTheme(<CircularProgress aria-label="Upload" value={-20} />);
    const ring = screen.getByRole('progressbar', { name: 'Upload' });
    expect(ring).toHaveAttribute('aria-valuenow', '0');
    expect(ring).toHaveAttribute('aria-valuemax', '100');
  });

  it('has no value when indeterminate', () => {
    renderWithTheme(<CircularProgress aria-label="Loading" />);
    expect(screen.getByRole('progressbar')).not.toHaveAttribute('aria-valuenow');
  });

  it('renders children in the center instead of the character', () => {
    renderWithTheme(
      <CircularProgress aria-label="Upload" value={70} character="bear">
        70%
      </CircularProgress>,
    );
    const ring = screen.getByRole('progressbar');
    expect(ring).toHaveTextContent('70%');
    // Only the ring itself: no character head.
    expect(ring.querySelectorAll('svg')).toHaveLength(1);
  });
});
