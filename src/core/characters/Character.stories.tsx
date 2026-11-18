import type { Meta, StoryObj } from '@storybook/react-vite';
import { Character } from './Character';
import { Flower, Leaf } from './decorations';
import { characterNames } from './registry';

const meta = {
  title: 'Core/Characters',
  component: Character,
  args: { size: 96, mood: 'neutral' },
  argTypes: {
    name: { control: 'select', options: characterNames },
    mood: { control: 'inline-radio', options: ['neutral', 'happy', 'sleepy', 'surprised'] },
  },
} satisfies Meta<typeof Character>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { name: 'bear' } };

export const Cast: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 28, flexWrap: 'wrap', alignItems: 'center' }}>
      {characterNames.map((name) => (
        <Character key={name} {...args} name={name} title={name} />
      ))}
    </div>
  ),
};

export const Moods: Story = {
  render: (args) => (
    <div style={{ display: 'flex', gap: 28 }}>
      {(['neutral', 'happy', 'sleepy', 'surprised'] as const).map((mood) => (
        <Character key={mood} {...args} name="bear" mood={mood} />
      ))}
    </div>
  ),
};

export const Decorations: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
      <Leaf size={48} />
      <Leaf size={48} color="#F4C04E" />
      <Leaf size={48} color="#D6453A" />
      <Flower size={48} />
      <Flower size={48} color="#FFD9CF" center="#F08A4B" />
    </div>
  ),
};
