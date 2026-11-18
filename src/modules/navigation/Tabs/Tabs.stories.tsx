import type { Meta, StoryObj } from '@storybook/react-vite';
import { characterNames } from '@core';
import { Paper } from '@modules/surfaces/Paper';
import { Tab, TabList, TabPanel, Tabs } from './Tabs';

const meta = {
  title: 'Navigation/Tabs',
  component: Tabs,
  args: { defaultValue: 'forest', color: 'primary', character: false },
  argTypes: {
    color: { control: 'select', options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] },
    character: { control: 'select', options: [false, ...characterNames] },
  },
  render: (args) => (
    <Tabs {...args} sx={{ width: 420 }}>
      <TabList aria-label="Places">
        <Tab value="forest">Forest</Tab>
        <Tab value="meadow">Meadow</Tab>
        <Tab value="burrow">Burrow</Tab>
        <Tab value="cave" disabled>
          Cave
        </Tab>
      </TabList>
      <TabPanel value="forest">
        <Paper>Tall trees, soft moss and plenty of acorns.</Paper>
      </TabPanel>
      <TabPanel value="meadow">
        <Paper>Flowers as far as a hedgehog can see.</Paper>
      </TabPanel>
      <TabPanel value="burrow">
        <Paper>Warm, quiet and stocked for winter.</Paper>
      </TabPanel>
    </Tabs>
  ),
} satisfies Meta<typeof Tabs>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithCharacter: Story = { args: { character: 'squirrel', defaultValue: 'meadow' } };

export const FullWidth: Story = {
  render: (args) => (
    <Tabs {...args} sx={{ width: 420 }}>
      <TabList aria-label="Seasons" fullWidth>
        <Tab value="forest">Autumn</Tab>
        <Tab value="meadow">Winter</Tab>
        <Tab value="burrow">Spring</Tab>
      </TabList>
    </Tabs>
  ),
};
