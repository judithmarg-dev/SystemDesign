import type { Meta, StoryObj } from '@storybook/react-vite';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Inputs/Checkbox',
  component: Checkbox,
  args: { label: 'Feed the hedgehog' },
  argTypes: {
    color: { control: 'select', options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] },
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 14 }}>
      <Checkbox {...args} label="Unchecked" />
      <Checkbox {...args} label="Checked" defaultChecked />
      <Checkbox {...args} label="Indeterminate" indeterminate />
      <Checkbox {...args} label="Success" color="success" defaultChecked />
      <Checkbox {...args} label="Error" color="error" defaultChecked />
      <Checkbox {...args} label="Disabled" disabled />
      <Checkbox {...args} label="Disabled checked" disabled defaultChecked />
    </div>
  ),
};
