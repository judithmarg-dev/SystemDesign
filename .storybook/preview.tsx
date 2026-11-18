import type { Preview } from '@storybook/react-vite';
import { CssBaseline, ThemeProvider, createTheme } from '../src/core';

const themes = {
  light: createTheme({ mode: 'light' }),
  dark: createTheme({ mode: 'dark' }),
};

const preview: Preview = {
  globalTypes: {
    mode: {
      description: 'Color mode',
      toolbar: {
        title: 'Mode',
        icon: 'mirror',
        items: [
          { value: 'light', title: 'Autumn day' },
          { value: 'dark', title: 'Cozy night' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: { mode: 'light' },
  parameters: {
    layout: 'centered',
    controls: { expanded: true },
  },
  decorators: [
    (Story, context) => (
      <ThemeProvider theme={themes[context.globals.mode === 'dark' ? 'dark' : 'light']}>
        <CssBaseline />
        <div style={{ padding: 56 }}>
          <Story />
        </div>
      </ThemeProvider>
    ),
  ],
};

export default preview;
