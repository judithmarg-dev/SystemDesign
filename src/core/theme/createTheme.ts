import { deepMerge } from '@shared';
import type { DeepPartial } from '@shared';
import { baseTokens, modeTokens } from './tokens';
import type { Breakpoint, MochiTheme, ThemeOptions } from './types';

/**
 * Builds a theme. Everything is optional: `createTheme()` is the light "autumn day" theme,
 * `createTheme({ mode: 'dark' })` the "cozy night" one. Any token can be overridden deeply.
 */
export function createTheme(options: ThemeOptions = {}): MochiTheme {
  const { mode = 'light', spacingUnit = 8, shadows, breakpoints, ...overrides } = options;
  const tokens = modeTokens[mode];
  const breakpointValues: Record<Breakpoint, number> = { ...baseTokens.breakpointValues, ...breakpoints?.values };

  const base: MochiTheme = {
    mode,
    palette: tokens.palette,
    glass: tokens.glass,
    shape: baseTokens.shape,
    typography: baseTokens.typography,
    shadows: shadows ?? tokens.shadows,
    motion: baseTokens.motion,
    zIndex: baseTokens.zIndex,
    character: baseTokens.character,
    spacing: (...factors) => factors.map((factor) => `${factor * spacingUnit}px`).join(' '),
    breakpoints: {
      values: breakpointValues,
      up: (key) => `@media (min-width: ${breakpointValues[key]}px)`,
    },
  };

  return deepMerge<MochiTheme>(base,overrides as DeepPartial<MochiTheme>);
}

export const defaultTheme = createTheme();
