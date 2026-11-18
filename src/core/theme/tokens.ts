import { alpha } from '@shared';
import type { ColorMode, Glass, MochiTheme, Palette, PaletteColor, TypographyTokens } from './types';

const color = (main: string, light: string, dark: string, contrastText: string, softOpacity: number): PaletteColor => ({
  main,
  light,
  dark,
  contrastText,
  soft: alpha(main, softOpacity),
});

const COCOA = '#4A2F1E';

const lightPalette: Palette = {
  primary: color('#F08A4B', '#F9BD92', '#C4602A', COCOA, 0.2), // pumpkin
  secondary: color('#8A5A3C', '#C09A7E', '#63402A', '#FFFFFF', 0.18), // acorn
  success: color('#7BAF6A', '#B8D8AC', '#4F7F42', '#263A1E', 0.22), // moss
  warning: color('#F4C04E', '#FADF9C', '#B9861F', COCOA, 0.26), // honey
  error: color('#D6453A', '#F0A19A', '#A92F26', '#FFFFFF', 0.16), // toadstool
  info: color('#6FA8C7', '#B7D6E6', '#3F7A99', '#1D3442', 0.22), // morning sky
  neutral: color('#8C7566', '#C9B8AC', '#66544A', '#FFFFFF', 0.16),
  text: { primary: COCOA, secondary: '#7A5C49', disabled: alpha(COCOA, 0.38) },
  background: {
    default: '#FFE8D2',
    gradient: [
      'radial-gradient(circle at 12% 18%, #FFD3B0 0, transparent 38%)',
      'radial-gradient(circle at 85% 12%, #FFC8C2 0, transparent 34%)',
      'radial-gradient(circle at 78% 82%, #FBD98F 0, transparent 40%)',
      'radial-gradient(circle at 18% 88%, #F6B98A 0, transparent 36%)',
      'linear-gradient(160deg, #FFEBD6, #FFE0C4)',
    ].join(', '),
    paper: '#FFF6EC',
  },
  divider: alpha(COCOA, 0.14),
  action: {
    hover: alpha(COCOA, 0.06),
    selected: alpha(COCOA, 0.1),
    disabled: alpha(COCOA, 0.38),
    disabledBackground: alpha(COCOA, 0.1),
    focus: '#C4602A',
  },
  scrim: alpha('#5A3520', 0.32),
};

const CREAM = '#FBEADB';

const darkPalette: Palette = {
  primary: color('#F6A46C', '#FBC9A5', '#D9763A', '#3A2112', 0.24),
  secondary: color('#C9A184', '#E2C8B4', '#A07A5E', '#33211A', 0.22),
  success: color('#9CCB8B', '#C4E2B8', '#6FA35E', '#1E3017', 0.22),
  warning: color('#F7CF73', '#FBE3A9', '#D1A63E', '#3B2A0C', 0.24),
  error: color('#F08379', '#F7B4AD', '#D6564B', '#3F1310', 0.24),
  info: color('#8FC1DC', '#BEDDEC', '#5E97B6', '#12303F', 0.22),
  neutral: color('#B9A496', '#D8C9BE', '#8F7B6E', '#2B1F19', 0.2),
  text: { primary: CREAM, secondary: '#D3B9A7', disabled: alpha(CREAM, 0.4) },
  background: {
    default: '#2A1D24',
    gradient: [
      'radial-gradient(circle at 14% 16%, #6A3F3A 0, transparent 40%)',
      'radial-gradient(circle at 86% 14%, #5B3A55 0, transparent 36%)',
      'radial-gradient(circle at 80% 84%, #7A4B2E 0, transparent 40%)',
      'radial-gradient(circle at 16% 86%, #4A3350 0, transparent 38%)',
      'linear-gradient(160deg, #2E1F27, #24181F)',
    ].join(', '),
    paper: '#3A2A31',
  },
  divider: alpha(CREAM, 0.16),
  action: {
    hover: alpha(CREAM, 0.08),
    selected: alpha(CREAM, 0.14),
    disabled: alpha(CREAM, 0.4),
    disabledBackground: alpha(CREAM, 0.12),
    focus: '#FBC9A5',
  },
  scrim: alpha('#120A0E', 0.56),
};

const lightGlass: Glass = {
  blur: { sm: 8, md: 16, lg: 28 },
  tint: {
    subtle: 'rgba(255, 250, 244, 0.28)',
    regular: 'rgba(255, 250, 244, 0.46)',
    strong: 'rgba(255, 250, 244, 0.68)',
  },
  border: 'rgba(255, 255, 255, 0.72)',
  highlight: 'rgba(255, 255, 255, 0.85)',
  saturation: 1.6,
};

const darkGlass: Glass = {
  blur: { sm: 8, md: 16, lg: 28 },
  tint: {
    subtle: 'rgba(255, 232, 214, 0.07)',
    regular: 'rgba(255, 232, 214, 0.12)',
    strong: 'rgba(255, 232, 214, 0.2)',
  },
  border: 'rgba(255, 236, 222, 0.22)',
  highlight: 'rgba(255, 240, 228, 0.28)',
  saturation: 1.4,
};

const fontFamily = "'Nunito', 'Quicksand', ui-rounded, 'Hiragino Maru Gothic ProN', 'Segoe UI', system-ui, sans-serif";

const typography: TypographyTokens = {
  fontFamily,
  h1: { fontSize: '3rem', fontWeight: 800, lineHeight: 1.15, letterSpacing: '-0.02em' },
  h2: { fontSize: '2.375rem', fontWeight: 800, lineHeight: 1.2, letterSpacing: '-0.015em' },
  h3: { fontSize: '1.875rem', fontWeight: 800, lineHeight: 1.25, letterSpacing: '-0.01em' },
  h4: { fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3 },
  h5: { fontSize: '1.25rem', fontWeight: 700, lineHeight: 1.35 },
  h6: { fontSize: '1.0625rem', fontWeight: 700, lineHeight: 1.4 },
  subtitle1: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },
  body1: { fontSize: '1rem', fontWeight: 400, lineHeight: 1.6 },
  body2: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.55 },
  button: { fontSize: '0.9375rem', fontWeight: 700, lineHeight: 1.2, letterSpacing: '0.01em' },
  caption: { fontSize: '0.75rem', fontWeight: 600, lineHeight: 1.4 },
  overline: { fontSize: '0.6875rem', fontWeight: 800, lineHeight: 1.4, letterSpacing: '0.1em', textTransform: 'uppercase' },
};

const shadows = (rgb: string, strength: number): MochiTheme['shadows'] => {
  const s = (o: number) => `rgba(${rgb}, ${(o * strength).toFixed(3)})`;
  return [
    'none',
    `0 1px 2px ${s(0.1)}, 0 2px 6px ${s(0.08)}`,
    `0 2px 4px ${s(0.1)}, 0 6px 16px ${s(0.1)}`,
    `0 4px 8px ${s(0.1)}, 0 12px 28px ${s(0.12)}`,
    `0 6px 12px ${s(0.1)}, 0 20px 44px ${s(0.14)}`,
    `0 8px 16px ${s(0.12)}, 0 32px 64px ${s(0.18)}`,
  ];
};

export interface ModeTokens {
  palette: Palette;
  glass: Glass;
  shadows: MochiTheme['shadows'];
}

export const modeTokens: Record<ColorMode, ModeTokens> = {
  light: { palette: lightPalette, glass: lightGlass, shadows: shadows('134, 78, 40', 1) },
  dark: { palette: darkPalette, glass: darkGlass, shadows: shadows('8, 4, 6', 2.6) },
};

export const baseTokens = {
  shape: { radius: { xs: 8, sm: 12, md: 18, lg: 26, xl: 36, pill: 999 } },
  typography,
  motion: {
    duration: { short: 140, medium: 240, long: 420 },
    easing: {
      standard: 'cubic-bezier(0.3, 0, 0.2, 1)',
      /** Slight overshoot — the "squishy" feel of the system. */
      bounce: 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      exit: 'cubic-bezier(0.4, 0, 1, 1)',
    },
  },
  zIndex: { appBar: 1100, drawer: 1200, modal: 1300, snackbar: 1400, tooltip: 1500 },
  breakpointValues: { xs: 0, sm: 600, md: 900, lg: 1200, xl: 1536 },
  character: { default: 'bear' },
} as const;
