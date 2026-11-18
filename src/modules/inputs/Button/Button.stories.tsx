import type { Meta, StoryObj } from '@storybook/react-vite';
import { characterNames } from '@core';
import { Button } from './Button';

const meta = {
  title: 'Inputs/Button',
  component: Button,
  args: { children: 'Adopt me' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['filled', 'glass', 'outlined', 'text'] },
    color: { control: 'select', options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    character: { control: 'select', options: [false, ...characterNames] },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' } as const;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      <Button {...args} variant="filled" />
      <Button {...args} variant="glass" />
      <Button {...args} variant="outlined" />
      <Button {...args} variant="text" />
      <Button {...args} disabled />
    </div>
  ),
};

export const Colors: Story = {
  render: (args) => (
    <div style={row}>
      {(['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] as const).map((color) => (
        <Button key={color} {...args} color={color}>
          {color}
        </Button>
      ))}
    </div>
  ),
};

export const WithCharacter: Story = {
  render: (args) => (
    <div style={{ ...row, gap: 28, paddingTop: 24 }}>
      {characterNames.map((name) => (
        <Button key={name} {...args} character={name} size="lg">
          {name}
        </Button>
      ))}
    </div>
  ),
};
