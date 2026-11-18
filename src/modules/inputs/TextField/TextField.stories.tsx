import type { Meta, StoryObj } from '@storybook/react-vite';
import { Leaf } from '@core';
import { TextField } from './TextField';

const meta = {
  title: 'Inputs/TextField',
  component: TextField,
  args: { label: 'Pet name', placeholder: 'e.g. Mochi' },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 260px)', gap: 24, alignItems: 'start' }}>
      <TextField {...args} helperText="This is how friends will find them." fullWidth />
      <TextField {...args} defaultValue="Mochi" startAdornment={<Leaf size={18} />} endAdornment="🐾" fullWidth />
      <TextField {...args} error defaultValue="!!" helperText="Names need at least 3 letters." fullWidth />
      <TextField {...args} disabled defaultValue="Hibernating" fullWidth />
      <TextField {...args} label="About" placeholder="Likes acorns, naps…" multiline fullWidth />
      <div style={{ display: 'grid', gap: 12 }}>
        <TextField {...args} label={undefined} aria-label="Small" size="sm" fullWidth />
        <TextField {...args} label={undefined} aria-label="Large" size="lg" fullWidth />
      </div>
    </div>
  ),
};
