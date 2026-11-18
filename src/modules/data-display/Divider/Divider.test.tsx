import { screen } from '@testing-library/react';
import { renderWithTheme } from '@core/testing';
import { Divider } from './Divider';

describe('Divider', () => {
  it('renders an hr, which is a separator by default', () => {
    renderWithTheme(<Divider />);
    const divider = screen.getByRole('separator');
    expect(divider.tagName).toBe('HR');
  });

  it('exposes the vertical orientation to assistive technology', () => {
    renderWithTheme(<Divider orientation="vertical" />);
    expect(screen.getByRole('separator')).toHaveAttribute('aria-orientation', 'vertical');
  });

  it('shows its text content as a separator element', () => {
    renderWithTheme(<Divider>o</Divider>);
    const divider = screen.getByRole('separator');
    expect(divider.tagName).toBe('DIV');
    expect(divider).toHaveTextContent('o');
  });
});
