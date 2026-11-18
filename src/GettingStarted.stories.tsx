import type { Meta, StoryObj } from '@storybook/react-vite';
import type { ReactNode } from 'react';
import { Paper } from '@modules/surfaces/Paper';
import { Typography } from '@modules/data-display/Typography';

const Code = ({ children }: { children: string }) => (
  <pre
    style={{
      margin: '8px 0 20px',
      padding: '14px 18px',
      borderRadius: 14,
      background: 'rgba(60, 30, 10, 0.08)',
      overflowX: 'auto',
      fontSize: 13,
      lineHeight: 1.6,
    }}
  >
    <code>{children}</code>
  </pre>
);

const Section = ({ title, children }: { title: string; children: ReactNode }) => (
  <section style={{ marginTop: 24 }}>
    <Typography variant="h5" component="h2">
      {title}
    </Typography>
    {children}
  </section>
);

function GettingStartedPage() {
  return (
    <Paper character="bear" characterPlacement="end" sx={{ maxWidth: 760, margin: '48px auto 0' }} padding={4}>
      <Typography variant="h3" component="h1">
        Getting started
      </Typography>
      <Typography variant="body1" sx={{ marginTop: 8 }}>
        Mochi UI is a React design system with a glassmorphism look and cute animal characters, inspired by Material UI.
      </Typography>

      <Section title="1. Install">
        <Typography variant="body2">Install the package together with its peer dependencies:</Typography>
        <Code>{`pnpm add mochi-ui react react-dom @emotion/react @emotion/styled`}</Code>
        <Typography variant="body2">
          React 18 and 19 are supported. React, React DOM and Emotion are peer dependencies, so your app provides them and
          they are never bundled twice.
        </Typography>
      </Section>

      <Section title="2. Load the Nunito font">
        <Typography variant="body2">The default typography uses Nunito. Add it to your HTML (the library does not download it):</Typography>
        <Code>{`<link rel="preconnect" href="https://fonts.googleapis.com" />
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
<link href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;600;700;800&display=swap" rel="stylesheet" />`}</Code>
      </Section>

      <Section title="3. Wrap your app in ThemeProvider">
        <Typography variant="body2">
          <code>ThemeProvider</code> is required: every component reads its values from the theme.{' '}
          <code>CssBaseline</code> adds the page background that the glass blurs.
        </Typography>
        <Code>{`import { ThemeProvider, CssBaseline, createTheme, Button } from 'mochi-ui';

const theme = createTheme({ mode: 'light', character: { default: 'bear' } });

export function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Button character>Hello</Button>
    </ThemeProvider>
  );
}`}</Code>
      </Section>

      <Section title="4. Explore">
        <Typography variant="body2">
          Browse the sidebar: every component has a Playground story with live controls. Switch between “Autumn day” and
          “Cozy night” with the Mode button in the toolbar.
        </Typography>
      </Section>
    </Paper>
  );
}

const meta = {
  title: 'Getting started',
  component: GettingStartedPage,
  parameters: { layout: 'fullscreen', controls: { disable: true } },
} satisfies Meta<typeof GettingStartedPage>;

export default meta;

export const Overview: StoryObj<typeof meta> = {};
