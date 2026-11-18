import type { Meta, StoryObj } from '@storybook/react-vite';
import { characterNames } from '@core';
import { Switch } from './Switch';

const meta = {
  title: 'Inputs/Switch',
  component: Switch,
  args: { label: 'Cozy mode' },
  argTypes: {
    color: { control: 'select', options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    character: { control: 'select', options: [false, ...characterNames] },
  },
} satisfies Meta<typeof Switch>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Cast: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, auto)', gap: '18px 40px' }}>
      {characterNames.flatMap((name) => [
        <Switch key={`${name}-off`} {...args} character={name} label={`${name} off`} />,
        <Switch key={`${name}-on`} {...args} character={name} label={`${name} on`} defaultChecked />,
      ])}
    </div>
  ),
};

export const States: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 18 }}>
      <Switch {...args} label="Small" size="sm" defaultChecked />
      <Switch {...args} label="Success" color="success" defaultChecked />
      <Switch {...args} label="Plain knob" character={false} defaultChecked />
      <Switch {...args} label="Disabled" disabled />
      <Switch {...args} label="Disabled on" disabled defaultChecked />
    </div>
  ),
};
