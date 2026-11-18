import type { Meta, StoryObj } from '@storybook/react-vite';
import { Radio, RadioGroup } from './Radio';

const meta = {
  title: 'Inputs/Radio',
  component: RadioGroup,
  args: { label: 'Favorite snack', defaultValue: 'acorn' },
  argTypes: {
    color: { control: 'select', options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] },
  },
  render: (args) => (
    <RadioGroup {...args}>
      <Radio value="acorn" label="Acorn" />
      <Radio value="apple" label="Apple" />
      <Radio value="mushroom" label="Mushroom" />
      <Radio value="honey" label="Honey (sold out)" disabled />
    </RadioGroup>
  ),
} satisfies Meta<typeof RadioGroup>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Row: Story = { args: { row: true, color: 'success' } };

export const Disabled: Story = { args: { disabled: true } };
