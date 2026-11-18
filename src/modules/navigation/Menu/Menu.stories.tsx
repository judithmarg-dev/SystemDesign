import type { Meta, StoryObj } from '@storybook/react-vite';
import { useEffect, useState } from 'react';
import { Leaf, characterNames } from '@core';
import { Button } from '@modules/inputs/Button';
import { Menu, MenuItem } from './Menu';

const meta = {
  title: 'Navigation/Menu',
  component: Menu,
  args: { open: false, anchorEl: null, character: false, placement: 'bottom-start' },
  argTypes: {
    anchorEl: { control: false },
    character: { control: 'select', options: [false, ...characterNames] },
    characterVariant: { control: 'inline-radio', options: ['peek', 'silhouette'] },
    characterSize: { control: 'inline-radio', options: ['sm', 'md', 'lg'] },
    placement: { control: 'inline-radio', options: ['bottom-start', 'bottom-end'] },
  },
  render: function Render(args) {
    const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
    const [open, setOpen] = useState(args.open);
    const [season, setSeason] = useState('Autumn');
    useEffect(() => setOpen(args.open), [args.open]);
    return (
      <div style={{ minHeight: 300 }}>
        <Button ref={setAnchor} variant="glass" aria-haspopup="menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          Season: {season}
        </Button>
        <Menu {...args} open={open} anchorEl={anchor} onClose={() => setOpen(false)} aria-label="Season">
          {['Spring', 'Summer', 'Autumn'].map((name) => (
            <MenuItem
              key={name}
              selected={name === season}
              startAdornment={<Leaf size={18} />}
              onClick={() => setSeason(name)}
            >
              {name}
            </MenuItem>
          ))}
          <MenuItem disabled>Winter (hibernating)</MenuItem>
        </Menu>
      </div>
    );
  },
} satisfies Meta<typeof Menu>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = { args: { open: true } };

export const WithCharacter: Story = { args: { open: true, character: 'hedgehog' } };

export const Silhouette: Story = { args: { open: true, character: 'bear', characterVariant: 'silhouette' } };
