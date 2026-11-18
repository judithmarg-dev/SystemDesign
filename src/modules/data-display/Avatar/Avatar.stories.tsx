import type { Meta, StoryObj } from '@storybook/react-vite';
import { characterNames } from '@core';
import { Avatar } from './Avatar';

const meta = {
  title: 'Data Display/Avatar',
  component: Avatar,
  args: { size: 'md' },
  argTypes: {
    character: { control: 'select', options: [undefined, ...characterNames] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    mood: { control: 'inline-radio', options: ['neutral', 'happy', 'sleepy', 'surprised'] },
  },
} satisfies Meta<typeof Avatar>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: 'flex', gap: 16, alignItems: 'center' } as const;

export const Playground: Story = {};

export const Characters: Story = {
  render: (args) => (
    <div style={row}>
      {characterNames.map((name) => (
        <Avatar key={name} {...args} character={name} alt={name} size="lg" />
      ))}
    </div>
  ),
};

export const Initials: Story = {
  render: (args) => (
    <div style={row}>
      <Avatar {...args} size="sm">
        Maple Bear
      </Avatar>
      <Avatar {...args}>Hazel Squirrel</Avatar>
      <Avatar {...args} size="lg">
        Pip
      </Avatar>
    </div>
  ),
};

export const Sizes: Story = {
  render: (args) => (
    <div style={row}>
      <Avatar {...args} size="sm" />
      <Avatar {...args} size="md" />
      <Avatar {...args} size="lg" />
      <Avatar {...args} size={96} />
    </div>
  ),
};
