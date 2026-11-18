import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@modules/inputs/Button';
import { Avatar } from '../Avatar';
import { Badge } from './Badge';

const meta = {
  title: 'Data Display/Badge',
  component: Badge,
  args: { content: 4, color: 'error', children: <Avatar character="squirrel" size="lg" /> },
  argTypes: {
    color: { control: 'select', options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] },
  },
} satisfies Meta<typeof Badge>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variations: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 36, alignItems: 'center' }}>
      <Badge {...args} content={4} />
      <Badge {...args} content={250} color="primary" />
      <Badge {...args} dot color="success" />
      <Badge {...args} content="new" color="info">
        <Button variant="glass">Messages</Button>
      </Badge>
    </div>
  ),
};
