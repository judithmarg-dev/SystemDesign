import type { CSSObject } from '@emotion/react';
import type { DeepPartial } from '@shared';

export type ColorMode = 'light' | 'dark';
export type ColorName = 'primary' | 'secondary' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
export type CharacterName = 'bear' | 'squirrel' | 'hedgehog' | 'mushroom' | 'acorn' | 'apple';
export type Size = 'sm' | 'md' | 'lg';

export interface PaletteColor {
  main: string;
  light: string;
  dark: string;
  /** Text color with enough contrast on `main`. */
  contrastText: string;
  /** Translucent tint used for soft/tonal surfaces. */
  soft: string;
}

export interface Palette extends Record<ColorName, PaletteColor> {
  text: { primary: string; secondary: string; disabled: string };
  background: {
    /** Flat page color. */
    default: string;
    /** Decorative page background that gives the glass something to blur. */
    gradient: string;
    /** Opaque surface color, for when glass is not an option. */
    paper: string;
  };
  divider: string;
  action: { hover: string; selected: string; disabled: string; disabledBackground: string; focus: string };
  /** Dimmed layer behind modals. */
  scrim: string;
}

export type BlurLevel = 'sm' | 'md' | 'lg';
export type TintLevel = 'subtle' | 'regular' | 'strong';

export interface Glass {
  /** Backdrop blur radius in px. */
  blur: Record<BlurLevel, number>;
  /** Translucent fills, from most to least see-through. */
  tint: Record<TintLevel, string>;
  /** Hairline edge color. */
  border: string;
  /** Inner top highlight color. */
  highlight: string;
  /** Backdrop saturation boost, e.g. `1.6`. */
  saturation: number;
}

export type RadiusName = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'pill';

export type TypographyVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'h5'
  | 'h6'
  | 'subtitle1'
  | 'body1'
  | 'body2'
  | 'button'
  | 'caption'
  | 'overline';

export interface TypographyTokens extends Record<TypographyVariant, CSSObject> {
  fontFamily: string;
}

export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface MochiTheme {
  mode: ColorMode;
  palette: Palette;
  glass: Glass;
  shape: { radius: Record<RadiusName, number> };
  /** `theme.spacing(2)` → `"16px"`, `theme.spacing(1, 2)` → `"8px 16px"`. */
  spacing: (...factors: number[]) => string;
  typography: TypographyTokens;
  /** Elevation shadows, index 0 (none) to 5. */
  shadows: [string, string, string, string, string, string];
  motion: {
    duration: { short: number; medium: number; long: number };
    easing: { standard: string; bounce: string; exit: string };
  };
  zIndex: { appBar: number; drawer: number; modal: number; snackbar: number; tooltip: number };
  breakpoints: {
    values: Record<Breakpoint, number>;
    /** Media query matching `key` and wider. */
    up: (key: Breakpoint) => string;
  };
  character: {
    /** Character used when a component is given `character` without a name. */
    default: CharacterName;
  };
}

export type Theme = MochiTheme;

export interface ThemeOptions extends DeepPartial<Omit<MochiTheme, 'spacing' | 'breakpoints' | 'shadows'>> {
  /** Base spacing unit in px. Defaults to 8. */
  spacingUnit?: number;
  shadows?: MochiTheme['shadows'];
  breakpoints?: { values?: Partial<Record<Breakpoint, number>> };
}

declare module '@emotion/react' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  export interface Theme extends MochiTheme {}
}
