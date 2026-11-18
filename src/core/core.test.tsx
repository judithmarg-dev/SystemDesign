import { screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { Character, characterNames, createPen, createTheme, getCharacter, GlassSurface } from '.';
import { renderWithTheme } from './testing';

describe('createTheme', () => {
  it('defaults to the light theme with 8px spacing', () => {
    const theme = createTheme();
    expect(theme.mode).toBe('light');
    expect(theme.spacing(2)).toBe('16px');
    expect(theme.spacing(1, 2)).toBe('8px 16px');
  });

  it('switches palette and glass with the mode', () => {
    const light = createTheme();
    const dark = createTheme({ mode: 'dark' });
    expect(dark.palette.background.default).not.toBe(light.palette.background.default);
    expect(dark.glass.tint.regular).not.toBe(light.glass.tint.regular);
  });

  it('deep-merges overrides without dropping sibling tokens', () => {
    const theme = createTheme({ palette: { primary: { main: '#123456' } }, character: { default: 'apple' } });
    expect(theme.palette.primary.main).toBe('#123456');
    expect(theme.palette.primary.dark).toBe(createTheme().palette.primary.dark);
    expect(theme.character.default).toBe('apple');
  });

  it('builds breakpoint media queries from custom values', () => {
    expect(createTheme({ breakpoints: { values: { md: 1000 } } }).breakpoints.up('md')).toBe('@media (min-width: 1000px)');
  });
});

describe('characters', () => {
  it.each(characterNames)('%s defines a closed silhouette that stays within its declared overflow', (name) => {
    const ctx = { w: 320, h: 200, r: 26, u: 20 };
    const spec = getCharacter(name).silhouette(ctx, createPen());
    expect(spec.shapes.length).toBeGreaterThan(0);
    for (const shape of spec.shapes) {
      expect(shape.startsWith('M')).toBe(true);
      expect(shape.trim().endsWith('Z')).toBe(true);
      expect(shape).not.toContain('NaN');
    }
    for (const side of Object.values(spec.overflow)) expect(side).toBeGreaterThanOrEqual(0);
  });

  it('translates paths by the pen offset', () => {
    expect(createPen().circle(10, 10, 5)).toContain('M5,10');
    expect(createPen(100, 50).circle(10, 10, 5)).toContain('M105,60');
  });

  it('is decorative unless given a title', () => {
    const { container, rerender } = renderWithTheme(<Character name="bear" />);
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true');
    rerender(<Character name="bear" title="Bear" />);
    expect(screen.getByRole('img', { name: 'Bear' })).toBeInTheDocument();
  });
});

describe('GlassSurface', () => {
  it('renders children and forwards props to the root', () => {
    renderWithTheme(<GlassSurface data-testid="surface">Hello</GlassSurface>);
    expect(screen.getByTestId('surface')).toHaveTextContent('Hello');
  });

  it('hides character decorations from assistive technology', () => {
    const { container } = renderWithTheme(
      <GlassSurface character="squirrel" characterVariant="peek">
        Content
      </GlassSurface>,
    );
    const svgs = container.querySelectorAll('svg');
    expect(svgs.length).toBeGreaterThan(0);
    svgs.forEach((svg) => expect(svg.closest('[aria-hidden="true"]')).not.toBeNull());
  });

  it('draws the face band in the silhouette variant', () => {
    const { container } = renderWithTheme(
      <GlassSurface character="mushroom" characterVariant="silhouette">
        Content
      </GlassSurface>,
    );
    expect(container.querySelector('svg[viewBox="0 0 60 26"]')).not.toBeNull();
  });
});
