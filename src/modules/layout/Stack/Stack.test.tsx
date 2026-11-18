import { screen } from '@testing-library/react';
import { renderWithTheme } from '@core/testing';
import { Stack } from './Stack';

describe('Stack', () => {
  it('lays children out with the direction and themed gap', () => {
    renderWithTheme(
      <Stack data-testid="stack" direction="row" spacing={3}>
        <span>a</span>
        <span>b</span>
      </Stack>,
    );
    expect(screen.getByTestId('stack')).toHaveStyle({ display: 'flex', flexDirection: 'row', gap: '24px' });
  });

  it('inserts the divider between children only', () => {
    renderWithTheme(
      <Stack divider={<hr />}>
        <span>a</span>
        <span>b</span>
        <span>c</span>
      </Stack>,
    );
    expect(screen.getAllByRole('separator')).toHaveLength(2);
  });
});
