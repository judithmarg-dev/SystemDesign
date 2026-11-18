import { screen } from '@testing-library/react';
import { renderWithTheme } from '@core/testing';
import { Box } from './Box';

describe('Box', () => {
  it('renders a div by default and the given component otherwise', () => {
    renderWithTheme(
      <>
        <Box data-testid="plain">a</Box>
        <Box component="section" data-testid="section">
          b
        </Box>
      </>,
    );
    expect(screen.getByTestId('plain').tagName).toBe('DIV');
    expect(screen.getByTestId('section').tagName).toBe('SECTION');
  });

  it('applies sx as an object or a function of the theme', () => {
    renderWithTheme(
      <>
        <Box data-testid="object" sx={{ padding: 12 }} />
        <Box data-testid="fn" sx={(theme) => ({ marginTop: theme.spacing(2) })} />
      </>,
    );
    expect(screen.getByTestId('object')).toHaveStyle({ padding: '12px' });
    expect(screen.getByTestId('fn')).toHaveStyle({ marginTop: '16px' });
  });
});
