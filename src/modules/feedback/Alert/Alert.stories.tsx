import type { Meta, StoryObj } from '@storybook/react-vite';
import { characterNames } from '@core';
import { Button } from '@modules/inputs/Button';
import { Alert } from './Alert';

const meta = {
  title: 'Feedback/Alert',
  component: Alert,
  args: {
    severity: 'info',
    title: 'Heads up',
    children: 'The forest library closes early today.',
    sx: { width: 420 },
  },
  argTypes: {
    severity: { control: 'inline-radio', options: ['success', 'info', 'warning', 'error'] },
    character: { control: 'select', options: [false, true, ...characterNames] },
  },
} satisfies Meta<typeof Alert>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Severities: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Alert {...args} severity="success" title="Saved">
        Your acorns are safely stored.
      </Alert>
      <Alert {...args} severity="info" title="Heads up">
        The forest library closes early today.
      </Alert>
      <Alert {...args} severity="warning" title="Getting sleepy">
        Your session will end in five minutes.
      </Alert>
      <Alert {...args} severity="error" title="Oh no">
        We could not reach the burrow. Try again.
      </Alert>
    </div>
  ),
};

export const WithActions: Story = {
  args: {
    severity: 'warning',
    character: 'squirrel',
    onClose: () => {},
    action: (
      <Button size="sm" variant="text" color="warning">
        Undo
      </Button>
    ),
  },
};
