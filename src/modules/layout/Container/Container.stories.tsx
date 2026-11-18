import type { Meta, StoryObj } from '@storybook/react-vite';
import { Paper } from '@modules/surfaces/Paper';
import { Container } from './Container';

const meta = {
  title: 'Layout/Container',
  component: Container,
  parameters: { layout: 'fullscreen' },
  args: { maxWidth: 'sm', children: <Paper>The container centers this sheet and caps its width.</Paper> },
  argTypes: { maxWidth: { control: 'inline-radio', options: ['sm', 'md', 'lg', 'xl', false] } },
} satisfies Meta<typeof Container>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Fluid: Story = { args: { maxWidth: false } };
