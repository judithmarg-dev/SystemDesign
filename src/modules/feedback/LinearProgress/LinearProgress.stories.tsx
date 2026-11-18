import type { Meta, StoryObj } from '@storybook/react-vite';
import { characterNames } from '@core';
import { LinearProgress } from './LinearProgress';

const meta = {
  title: 'Feedback/LinearProgress',
  component: LinearProgress,
  args: { value: 60, 'aria-label': 'Loading', sx: { width: 360 } },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    color: { control: 'select', options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    character: { control: 'select', options: [false, ...characterNames] },
  },
} satisfies Meta<typeof LinearProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Determinate: Story = {};

export const Indeterminate: Story = { args: { value: undefined } };

export const WithCharacter: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 28 }}>
      <LinearProgress {...args} value={15} character="hedgehog" color="secondary" />
      <LinearProgress {...args} value={55} character="bear" size="lg" />
      <LinearProgress {...args} value={100} character="apple" color="success" size="lg" />
    </div>
  ),
};
