import { render } from '@testing-library/react';
import type { RenderOptions } from '@testing-library/react';
import type { ReactElement } from 'react';
import { ThemeProvider } from './theme/ThemeProvider';
import type { MochiTheme } from './theme/types';

/** Test helper: renders `ui` inside a ThemeProvider. Not part of the published API. */
export function renderWithTheme(ui: ReactElement, options: RenderOptions & { theme?: MochiTheme } = {}) {
  const { theme, ...rest } = options;
  return render(ui, { wrapper: ({ children }) => <ThemeProvider theme={theme}>{children}</ThemeProvider>, ...rest });
}
