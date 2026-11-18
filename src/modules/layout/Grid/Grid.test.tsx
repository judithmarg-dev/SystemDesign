import { screen } from '@testing-library/react';
import { renderWithTheme } from '@core/testing';
import { Grid, GridItem } from './Grid';

describe('Grid', () => {
  it('creates equal columns with a themed gap', () => {
    renderWithTheme(<Grid data-testid="grid" columns={3} spacing={1} />);
    expect(screen.getByTestId('grid')).toHaveStyle({
      display: 'grid',
      gap: '8px',
      gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
    });
  });

  it('uses the xs value as the base for responsive columns', () => {
    // jsdom evaluates media queries against a 1024px-wide window, so the other breakpoint
    // must be above that (lg = 1200px) for the xs base to be the one that applies.
    renderWithTheme(<Grid data-testid="grid" columns={{ xs: 1, lg: 4 }} />);
    expect(screen.getByTestId('grid')).toHaveStyle({ gridTemplateColumns: 'repeat(1, minmax(0, 1fr))' });
  });

  it('spans the requested number of columns', () => {
    renderWithTheme(
      <Grid columns={12}>
        <GridItem data-testid="item" span={6} />
      </Grid>,
    );
    expect(screen.getByTestId('item')).toHaveStyle({ gridColumn: 'span 6 / span 6' });
  });
});
