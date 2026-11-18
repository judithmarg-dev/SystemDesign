import { renderWithTheme } from '@core/testing';
import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  it('is hidden from assistive technology', () => {
    const { container } = renderWithTheme(<Skeleton />);
    expect(container.firstElementChild).toHaveAttribute('aria-hidden', 'true');
  });

  it('applies numeric and string sizes', () => {
    const { container } = renderWithTheme(<Skeleton variant="rounded" width={120} height="50%" />);
    expect(container.firstElementChild).toHaveAttribute('style', expect.stringContaining('width: 120px; height: 50%'));
  });

  it('makes circular skeletons square from a single dimension', () => {
    const { container } = renderWithTheme(<Skeleton variant="circular" width={48} />);
    expect(container.firstElementChild).toHaveStyle({ width: '48px', height: '48px', borderRadius: '50%' });
  });

  it('defaults circular skeletons to 40px', () => {
    const { container } = renderWithTheme(<Skeleton variant="circular" />);
    expect(container.firstElementChild).toHaveStyle({ width: '40px', height: '40px' });
  });

  it('keeps the caller style and forwards other props', () => {
    const { container } = renderWithTheme(<Skeleton data-testid="s" style={{ marginTop: 4 }} />);
    expect(container.firstElementChild).toHaveAttribute('data-testid', 's');
    expect(container.firstElementChild).toHaveStyle({ marginTop: '4px' });
  });
});
