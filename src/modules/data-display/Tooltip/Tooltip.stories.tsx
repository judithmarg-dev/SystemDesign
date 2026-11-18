import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@modules/inputs/Button';
import { Tooltip } from './Tooltip';

const meta = {
  title: 'Data Display/Tooltip',
  component: Tooltip,
  args: { title: 'Guarda tus bellotas para el invierno', placement: 'top', children: <Button>Pasa el cursor</Button> },
  argTypes: { placement: { control: 'inline-radio', options: ['top', 'bottom', 'start', 'end'] } },
  decorators: [(Story) => <div style={{ padding: 80, display: 'flex', justifyContent: 'center' }}><Story /></div>],
} satisfies Meta<typeof Tooltip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Placements: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 16 }}>
      {(['top', 'bottom', 'start', 'end'] as const).map((placement) => (
        <Tooltip key={placement} {...args} placement={placement} title={`Tooltip ${placement}`}>
          <Button variant="glass">{placement}</Button>
        </Tooltip>
      ))}
    </div>
  ),
};

export const AlwaysOpen: Story = { args: { open: true } };
