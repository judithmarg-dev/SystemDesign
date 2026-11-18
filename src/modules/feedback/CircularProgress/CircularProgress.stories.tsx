import type { Meta, StoryObj } from '@storybook/react-vite';
import { characterNames } from '@core';
import { CircularProgress } from './CircularProgress';

const meta = {
  title: 'Feedback/CircularProgress',
  component: CircularProgress,
  args: { 'aria-label': 'Loading' },
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100 } },
    color: { control: 'select', options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] },
    character: { control: 'select', options: [false, ...characterNames] },
  },
} satisfies Meta<typeof CircularProgress>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Indeterminate: Story = {};

export const Determinate: Story = { args: { value: 70, size: 64, thickness: 6, children: '70%' } };

export const WithCharacter: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 28, alignItems: 'center' }}>
      <CircularProgress {...args} size={72} thickness={5} character="bear" />
      <CircularProgress {...args} size={72} thickness={5} value={45} character="mushroom" color="error" />
      <CircularProgress {...args} size={96} thickness={7} value={100} character="acorn" color="success" />
    </div>
  ),
};
