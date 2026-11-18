import type { Meta, StoryObj } from '@storybook/react-vite';
import { Stack } from '@modules/layout/Stack';
import { Divider } from './Divider';

const meta: Meta<typeof Divider> = {
  title: 'Data Display/Divider',
  component: Divider,
  args: { orientation: 'horizontal', variant: 'fullWidth' },
};
export default meta;

type Story = StoryObj<typeof Divider>;

export const Horizontal: Story = {
  render: (args) => (
    <Stack spacing={2} sx={{ width: 320 }}>
      <span>Bellotas</span>
      <Divider {...args} />
      <span>Castañas</span>
    </Stack>
  ),
};

export const WithText: Story = {
  render: (args) => (
    <div style={{ width: 320 }}>
      <Divider {...args}>o</Divider>
    </div>
  ),
};

export const Vertical: Story = {
  render: () => (
    <Stack direction="row" spacing={2} align="center" sx={{ height: 32 }}>
      <span>Oso</span>
      <Divider orientation="vertical" flexItem />
      <span>Ardilla</span>
    </Stack>
  ),
};
