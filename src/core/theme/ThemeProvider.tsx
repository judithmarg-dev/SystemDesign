import { Global, ThemeProvider as EmotionThemeProvider, useTheme as useEmotionTheme } from '@emotion/react';
import type { ReactNode } from 'react';
import { defaultTheme } from './createTheme';
import type { MochiTheme } from './types';

export interface ThemeProviderProps {
  /** Theme from `createTheme()`. Defaults to the light theme. */
  theme?: MochiTheme;
  children: ReactNode;
}

export function ThemeProvider({ theme = defaultTheme, children }: ThemeProviderProps) {
  return <EmotionThemeProvider theme={theme}>{children}</EmotionThemeProvider>;
}

/** Returns the current theme, falling back to the default one outside a `ThemeProvider`. */
export function useTheme(): MochiTheme {
  const theme = useEmotionTheme() as Partial<MochiTheme>;
  return theme.palette ? (theme as MochiTheme) : defaultTheme;
}

/** Global reset plus the decorative page background the glass surfaces blur. */
export function CssBaseline() {
  const theme = useTheme();
  return (
    <Global
      styles={{
        '*, *::before, *::after': { boxSizing: 'border-box' },
        html: { WebkitTextSizeAdjust: '100%' },
        body: {
          margin: 0,
          minHeight: '100vh',
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.background.default,
          backgroundImage: theme.palette.background.gradient,
          backgroundAttachment: 'fixed',
          fontFamily: theme.typography.fontFamily,
          ...theme.typography.body1,
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          colorScheme: theme.mode,
        },
      }}
    />
  );
}
