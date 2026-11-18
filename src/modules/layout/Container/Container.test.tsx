import { screen } from '@testing-library/react';
import { renderWithTheme } from '@core/testing';
import { Container } from './Container';

describe('Container', () => {
  it('caps the width at the breakpoint', () => {
    renderWithTheme(<Container data-testid="c" maxWidth="sm" />);
    expect(screen.getByTestId('c')).toHaveStyle({ maxWidth: '600px', width: '100%' });
  });

  it('has no max width when maxWidth is false', () => {
    renderWithTheme(<Container data-testid="c" maxWidth={false} />);
    expect(getComputedStyle(screen.getByTestId('c')).maxWidth).not.toMatch(/px/);
  });
});
