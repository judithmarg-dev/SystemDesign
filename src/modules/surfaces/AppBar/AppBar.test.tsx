import { screen } from '@testing-library/react';
import { renderWithTheme } from '@core/testing';
import { AppBar, Toolbar } from './AppBar';

describe('AppBar', () => {
  it('renders a banner landmark with a toolbar row', () => {
    renderWithTheme(
      <AppBar>
        <Toolbar>Mochi</Toolbar>
      </AppBar>,
    );
    const banner = screen.getByRole('banner');
    expect(banner.tagName).toBe('HEADER');
    expect(banner).toHaveTextContent('Mochi');
  });

  it('applies the position', () => {
    renderWithTheme(<AppBar position="sticky">Mochi</AppBar>);
    expect(screen.getByRole('banner')).toHaveStyle({ position: 'sticky' });
  });

  it('forwards the ref to the header element', () => {
    let node: HTMLElement | null = null;
    renderWithTheme(
      <AppBar
        ref={(el) => {
          node = el;
        }}
      >
        Mochi
      </AppBar>,
    );
    expect(node).toBe(screen.getByRole('banner'));
  });

  it('keeps a peeking character out of the accessibility tree', () => {
    renderWithTheme(<AppBar character="bear">Mochi</AppBar>);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
