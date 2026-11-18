import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { characterNames } from '@core';
import { Slider } from './Slider';

const meta = {
  title: 'Inputs/Slider',
  component: Slider,
  args: { 'aria-label': 'Volume', defaultValue: 40 },
  argTypes: {
    color: { control: 'select', options: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
    valueLabelDisplay: { control: 'inline-radio', options: ['auto', 'on', 'off'] },
    character: { control: 'select', options: [false, ...characterNames] },
  },
  render: (args) => (
    <div style={{ width: 320 }}>
      <Slider {...args} />
    </div>
  ),
} satisfies Meta<typeof Slider>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const CharacterThumb: Story = { args: { character: 'hedgehog', valueLabelDisplay: 'on' } };

export const Marks: Story = {
  args: {
    step: 25,
    marks: [
      { value: 0, label: 'Cold' },
      { value: 25 },
      { value: 50, label: 'Cozy' },
      { value: 75 },
      { value: 100, label: 'Hot' },
    ],
    valueLabelFormat: (v: number) => `${v}%`,
  },
};

export const Controlled: Story = {
  render: (args) => {
    const [value, setValue] = useState(20);
    return (
      <div style={{ width: 320, display: 'grid', gap: 12 }}>
        <Slider {...args} value={value} onChange={setValue} character="squirrel" color="secondary" />
        <span>Acorns gathered: {value}</span>
      </div>
    );
  },
};

export const States: Story = {
  render: (args) => (
    <div style={{ width: 320, display: 'grid', gap: 32 }}>
      <Slider {...args} size="sm" />
      <Slider {...args} color="success" marks step={10} />
      <Slider {...args} disabled character="bear" />
    </div>
  ),
};
