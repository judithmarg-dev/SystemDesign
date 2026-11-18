import type { CSSObject } from '@emotion/react';
import type { BlurLevel, MochiTheme, TintLevel } from '../theme/types';

/** Style overrides, as an object or a function of the theme. The system's take on MUI's `sx`. */
export type SxProps = CSSObject | ((theme: MochiTheme) => CSSObject);

export interface SxProp {
  /** Style overrides applied to the root element. */
  sx?: SxProps;
}

/** Add as the last style of a root styled component to support the `sx` prop. */
export const applySx = ({ theme, sx }: { theme: MochiTheme; sx?: SxProps }): CSSObject =>
  typeof sx === 'function' ? sx(theme) : (sx ?? {});

export interface GlassOptions {
  blur?: BlurLevel;
  tint?: TintLevel;
  /** Overrides the fill, e.g. with a translucent brand color. */
  background?: string;
  /** Elevation shadow index, 0–5. */
  elevation?: 0 | 1 | 2 | 3 | 4 | 5;
  border?: boolean;
}

/** The glassmorphism recipe: translucent fill, blurred backdrop, hairline edge and inner highlight. */
export function glass(theme: MochiTheme, options: GlassOptions = {}): CSSObject {
  const { blur = 'md', tint = 'regular', background, elevation = 0, border = true } = options;
  const filter = `blur(${theme.glass.blur[blur]}px) saturate(${theme.glass.saturation})`;
  return {
    background: background ?? theme.glass.tint[tint],
    backdropFilter: filter,
    WebkitBackdropFilter: filter,
    border: border ? `1px solid ${theme.glass.border}` : undefined,
    boxShadow: [`inset 0 1px 0 ${theme.glass.highlight}`, elevation > 0 ? theme.shadows[elevation] : null]
      .filter(Boolean)
      .join(', '),
  };
}

/** Visible keyboard focus indicator. */
export const focusRing = (theme: MochiTheme, color: string = theme.palette.action.focus): CSSObject => ({
  outline: `3px solid ${color}`,
  outlineOffset: 2,
});

/** `transition` shorthand using the theme's motion tokens. */
export const transition = (
  theme: MochiTheme,
  properties: string[],
  options: { duration?: keyof MochiTheme['motion']['duration']; easing?: keyof MochiTheme['motion']['easing'] } = {},
): string => {
  const { duration = 'short', easing = 'standard' } = options;
  return properties.map((p) => `${p} ${theme.motion.duration[duration]}ms ${theme.motion.easing[easing]}`).join(', ');
};

export const reducedMotion = '@media (prefers-reduced-motion: reduce)';
