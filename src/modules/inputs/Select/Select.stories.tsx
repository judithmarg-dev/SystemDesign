import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Character } from '@core';
import { Option, Select } from './Select';

const snacks = [
  { value: 'acorn', label: 'Acorn' },
  { value: 'apple', label: 'Apple' },
  { value: 'berry', label: 'Berry' },
  { value: 'chestnut', label: 'Chestnut' },
  { value: 'honey', label: 'Honey (sold out)', disabled: true },
  { value: 'mushroom', label: 'Mushroom' },
];

const meta = {
  title: 'Inputs/Select',
  component: Select,
  args: { label: 'Snack', placeholder: 'Pick a snack', options: snacks, sx: { width: 260 } },
  argTypes: {
    size: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
  },
} satisfies Meta<typeof Select>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const WithHelperAndError: Story = {
  args: { error: true, helperText: 'Choose something for the picnic' },
};

export const Multiple: Story = {
  render: () => {
    const [value, setValue] = useState<string[]>(['bear']);
    return (
      <Select label="Invite friends" multiple value={value} onChange={setValue} sx={{ width: 280 }}>
        <Option value="bear" textValue="Bear">
          <Character name="bear" size={22} /> Bear
        </Option>
        <Option value="squirrel" textValue="Squirrel">
          <Character name="squirrel" size={22} /> Squirrel
        </Option>
        <Option value="hedgehog" textValue="Hedgehog">
          <Character name="hedgehog" size={22} /> Hedgehog
        </Option>
      </Select>
    );
  },
};

export const Sizes: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 16 }}>
      <Select {...args} size="sm" label="Small" />
      <Select {...args} size="md" label="Medium" />
      <Select {...args} size="lg" label="Large" />
      <Select {...args} disabled label="Disabled" />
    </div>
  ),
};
