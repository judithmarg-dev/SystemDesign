import type { Meta, StoryObj } from '@storybook/react-vite';
import { IconButton } from './IconButton';

const Heart = () => (
  <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden focusable="false">
    <path d="M12 21s-7.5-4.6-9.6-9.3C.9 8.300 2.700 4.500 6.400 4.500c2.100 0 3.800 1.100 5.600 3.200 1.800-2.100 3.500-3.200 5.600-3.200 3.700 0 5.500 3.800 4 7.200C19.500 16.400 12 21 12 21z" />
  </svg>
);

const meta = {
  title: 'Inputs/IconButton',
  component: IconButton,
  args: { 'aria-label': 'Favorite', children: <Heart /> },
  argTypes: {
    variant: { control: 'inline-radio', options: ['filled', 'glass', 'text'] },
    color: { control: 'select', options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] },
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    children: { control: false },
  },
} satisfies Meta<typeof IconButton>;

export default meta;
type Story = StoryObj<typeof meta>;

const row = { display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' } as const;

export const Playground: Story = { args: { variant: 'glass', color: 'error' } };

export const Variants: Story = {
  render: (args) => (
    <div style={row}>
      <IconButton {...args} variant="filled" color="primary" />
      <IconButton {...args} variant="glass" color="error" />
      <IconButton {...args} variant="text" />
      <IconButton {...args} variant="filled" disabled />
      <IconButton {...args} variant="filled" color="error" size="sm" />
      <IconButton {...args} variant="filled" color="error" size="lg" />
    </div>
  ),
};
