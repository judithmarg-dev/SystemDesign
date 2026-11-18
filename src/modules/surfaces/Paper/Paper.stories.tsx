import type { Meta, StoryObj } from '@storybook/react-vite';
import { characterNames } from '@core';
import { Paper } from './Paper';

const meta = {
  title: 'Surfaces/Paper',
  component: Paper,
  args: {
    children: 'A frosted-glass sheet. Everything behind it is blurred.',
    sx: { width: 300 },
  },
  argTypes: {
    character: { control: 'select', options: [false, ...characterNames] },
    characterVariant: { control: 'inline-radio', options: ['peek', 'silhouette'] },
    characterPlacement: { control: 'inline-radio', options: ['start', 'center', 'end'] },
    characterSize: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    mood: { control: 'inline-radio', options: ['neutral', 'happy', 'sleepy', 'surprised'] },
    tone: { control: 'select', options: [undefined, 'primary', 'secondary', 'success', 'warning', 'error', 'info'] },
  },
} satisfies Meta<typeof Paper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Plain: Story = {};

export const Peek: Story = { args: { character: 'bear', characterVariant: 'peek' } };

export const Silhouette: Story = { args: { character: 'bear', characterVariant: 'silhouette' } };

const grid = { display: 'grid', gridTemplateColumns: 'repeat(3, 240px)', gap: '88px 72px', padding: '24px 48px' } as const;

export const AllPeeking: Story = {
  render: (args) => (
    <div style={grid}>
      {characterNames.map((name) => (
        <Paper key={name} {...args} sx={{ minHeight: 120 }} character={name} characterVariant="peek">
          {name}
        </Paper>
      ))}
    </div>
  ),
};

export const AllSilhouettes: Story = {
  render: (args) => (
    <div style={grid}>
      {characterNames.map((name) => (
        <Paper key={name} {...args} sx={{ minHeight: 150, textAlign: 'center' }} character={name} characterVariant="silhouette">
          {name}
        </Paper>
      ))}
    </div>
  ),
};
