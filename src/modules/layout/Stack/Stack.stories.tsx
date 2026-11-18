import type { Meta, StoryObj } from '@storybook/react-vite';
import { Divider } from '@modules/data-display/Divider';
import { Paper } from '@modules/surfaces/Paper';
import { Stack } from './Stack';

const items = ['Acorns', 'Berries', 'Honey'].map((label) => (
  <Paper key={label} padding={2} elevation={1} radius="md">
    {label}
  </Paper>
));

const meta = {
  title: 'Layout/Stack',
  component: Stack,
  args: { spacing: 2, direction: 'column', children: items },
  argTypes: { direction: { control: 'inline-radio', options: ['row', 'column', 'row-reverse', 'column-reverse'] } },
} satisfies Meta<typeof Stack>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Column: Story = {};

export const Row: Story = { args: { direction: 'row', align: 'center' } };

export const WithDivider: Story = {
  args: { direction: 'row', align: 'center', divider: <Divider orientation="vertical" /> },
};
