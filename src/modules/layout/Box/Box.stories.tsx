import type { Meta, StoryObj } from '@storybook/react-vite';
import { Box } from './Box';

const meta = {
  title: 'Layout/Box',
  component: Box,
  args: {
    children: 'A Box is any element, styled with sx.',
    sx: (theme) => ({
      padding: theme.spacing(3),
      borderRadius: theme.shape.radius.md,
      background: theme.palette.primary.soft,
      border: `2px dashed ${theme.palette.primary.main}`,
    }),
  },
} satisfies Meta<typeof Box>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const AsSection: Story = { args: { component: 'section' } };
