import type { Meta, StoryObj } from '@storybook/react-vite';
import { Paper } from '@modules/surfaces/Paper';
import { Skeleton } from './Skeleton';

const meta = {
  title: 'Feedback/Skeleton',
  component: Skeleton,
  argTypes: { variant: { control: 'inline-radio', options: ['text', 'circular', 'rounded'] } },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { variant: 'rounded', width: 240, height: 120 } };

export const LoadingCard: Story = {
  render: (args) => (
    <Paper aria-busy sx={{ width: 320 }}>
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 16 }}>
        <Skeleton {...args} variant="circular" width={44} />
        <div style={{ flex: 1 }}>
          <Skeleton {...args} width="60%" />
          <Skeleton {...args} width="35%" />
        </div>
      </div>
      <Skeleton {...args} variant="rounded" height={120} />
      <Skeleton {...args} />
      <Skeleton {...args} width="80%" />
    </Paper>
  ),
};
