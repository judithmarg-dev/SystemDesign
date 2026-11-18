import type { Meta, StoryObj } from '@storybook/react-vite';
import { Paper } from '@modules/surfaces/Paper';
import { Grid, GridItem } from './Grid';

const cell = (label: string) => (
  <Paper padding={2} elevation={1} radius="md" sx={{ textAlign: 'center' }}>
    {label}
  </Paper>
);

const meta = {
  title: 'Layout/Grid',
  component: Grid,
  args: { columns: 12, spacing: 2, sx: { width: 640 } },
} satisfies Meta<typeof Grid>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Spans: Story = {
  render: (args) => (
    <Grid {...args}>
      <GridItem span={12}>{cell('12')}</GridItem>
      <GridItem span={8}>{cell('8')}</GridItem>
      <GridItem span={4}>{cell('4')}</GridItem>
      <GridItem span={4}>{cell('4')}</GridItem>
      <GridItem span={4}>{cell('4')}</GridItem>
      <GridItem span={4}>{cell('4')}</GridItem>
    </Grid>
  ),
};

export const Responsive: Story = {
  args: { columns: { xs: 1, sm: 2, md: 4 }, sx: { width: '80vw' } },
  render: (args) => (
    <Grid {...args}>
      {['bear', 'squirrel', 'hedgehog', 'mushroom'].map((name) => (
        <GridItem key={name}>{cell(name)}</GridItem>
      ))}
    </Grid>
  ),
};
