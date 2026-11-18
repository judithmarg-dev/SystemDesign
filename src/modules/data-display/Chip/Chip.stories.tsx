import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Avatar } from '../Avatar';
import { Chip } from './Chip';

const COLORS = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'] as const;

const meta = {
  title: 'Data Display/Chip',
  component: Chip,
  args: { label: 'Bellota', variant: 'soft', color: 'primary', size: 'md' },
  argTypes: {
    color: { control: 'select', options: COLORS },
    variant: { control: 'inline-radio', options: ['filled', 'soft', 'outlined'] },
    size: { control: 'inline-radio', options: ['sm', 'md'] },
  },
} satisfies Meta<typeof Chip>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Variants: Story = {
  render: (args) => (
    <div style={{ display: 'grid', gap: 12 }}>
      {(['filled', 'soft', 'outlined'] as const).map((variant) => (
        <div key={variant} style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {COLORS.map((color) => (
            <Chip key={color} {...args} variant={variant} color={color} label={color} />
          ))}
        </div>
      ))}
    </div>
  ),
};

export const WithAvatarAndDelete: Story = {
  render: (args) => {
    const [tags, setTags] = useState(['Oso', 'Ardilla', 'Erizo']);
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        {tags.map((tag) => (
          <Chip
            key={tag}
            {...args}
            label={tag}
            icon={<Avatar size={20} character={tag === 'Oso' ? 'bear' : tag === 'Ardilla' ? 'squirrel' : 'hedgehog'} />}
            onDelete={() => setTags((t) => t.filter((x) => x !== tag))}
            deleteLabel={`Quitar ${tag}`}
          />
        ))}
      </div>
    );
  },
};

export const Filters: Story = {
  render: () => {
    const [active, setActive] = useState<string[]>(['Hongos']);
    const toggle = (name: string) =>
      setActive((a) => (a.includes(name) ? a.filter((x) => x !== name) : [...a, name]));
    return (
      <div style={{ display: 'flex', gap: 8 }}>
        {['Hongos', 'Manzanas', 'Bellotas'].map((name) => (
          <Chip
            key={name}
            label={name}
            color="primary"
            variant={active.includes(name) ? 'filled' : 'outlined'}
            aria-pressed={active.includes(name)}
            onClick={() => toggle(name)}
          />
        ))}
      </div>
    );
  },
};
