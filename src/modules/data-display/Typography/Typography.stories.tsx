import type { Meta, StoryObj } from '@storybook/react-vite';
import { Typography } from './Typography';

const variants = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'subtitle1', 'body1', 'body2', 'button', 'caption', 'overline'] as const;

const meta = {
  title: 'Data Display/Typography',
  component: Typography,
  args: { children: 'The squirrel hides acorns for winter', variant: 'body1' },
  argTypes: {
    variant: { control: 'select', options: variants },
    color: {
      control: 'select',
      options: ['inherit', 'textPrimary', 'textSecondary', 'primary', 'secondary', 'success', 'warning', 'error', 'info'],
    },
  },
} satisfies Meta<typeof Typography>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Scale: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 10 }}>
      {variants.map((variant) => (
        <Typography key={variant} variant={variant} component="div">
          {variant} — The squirrel hides acorns
        </Typography>
      ))}
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div style={{ display: 'grid', gap: 6 }}>
      {(['textPrimary', 'textSecondary', 'primary', 'secondary', 'success', 'warning', 'error', 'info'] as const).map((color) => (
        <Typography key={color} variant="subtitle1" component="div" color={color}>
          {color}
        </Typography>
      ))}
    </div>
  ),
};
