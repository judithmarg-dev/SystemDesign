import type { Meta, StoryObj } from '@storybook/react-vite';
import { characterNames } from '@core';
import { Button } from '@modules/inputs/Button';
import { IconButton } from '@modules/inputs/IconButton';
import { AppBar, Toolbar } from './AppBar';

const Title = ({ children }: { children: string }) => (
  <strong style={{ flex: 1, fontSize: '1.125rem' }}>{children}</strong>
);

const meta = {
  title: 'Surfaces/AppBar',
  component: AppBar,
  parameters: { layout: 'fullscreen' },
  args: { position: 'static' },
  argTypes: {
    position: { control: 'inline-radio', options: ['static', 'sticky', 'fixed'] },
    color: { control: 'select', options: [undefined, 'primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] },
    character: { control: 'select', options: [false, ...characterNames] },
    characterPlacement: { control: 'inline-radio', options: ['start', 'center', 'end'] },
  },
  render: (args) => (
    <div style={{ paddingTop: args.character ? 56 : 0 }}>
      <AppBar {...args}>
        <Toolbar>
          <IconButton aria-label="Open menu">☰</IconButton>
          <Title>Forest friends</Title>
          <Button size="sm" variant="glass">
            Sign in
          </Button>
        </Toolbar>
      </AppBar>
    </div>
  ),
} satisfies Meta<typeof AppBar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Tinted: Story = { args: { color: 'primary' } };

export const WithCharacter: Story = { args: { character: 'squirrel', characterPlacement: 'end' } };

export const Flush: Story = { args: { floating: false } };

export const StickyOnScroll: Story = {
  args: { position: 'sticky' },
  render: (args) => (
    <div style={{ height: 360, overflow: 'auto', paddingTop: 12 }}>
      <AppBar {...args}>
        <Toolbar variant="dense">
          <Title>Scroll me</Title>
        </Toolbar>
      </AppBar>
      {Array.from({ length: 30 }, (_, i) => (
        <p key={i} style={{ paddingInline: 24 }}>
          Line {i + 1} of a cozy autumn story.
        </p>
      ))}
    </div>
  ),
};
