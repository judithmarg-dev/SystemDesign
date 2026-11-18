import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Paper } from '@modules/surfaces/Paper';
import { Avatar } from '../Avatar';
import { Chip } from '../Chip';
import { Divider } from '../Divider';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from './List';

const meta = {
  title: 'Data Display/List',
  component: List,
  args: { dense: false },
} satisfies Meta<typeof List>;

export default meta;
type Story = StoryObj<typeof meta>;

const FRIENDS = [
  { name: 'Oso Maple', note: 'Duerme hasta la primavera', character: 'bear' },
  { name: 'Ardilla Nuez', note: '128 bellotas guardadas', character: 'squirrel' },
  { name: 'Erizo Pino', note: 'Busca manzanas', character: 'hedgehog' },
] as const;

export const Simple: Story = {
  render: (args) => (
    <Paper sx={{ width: 320 }}>
      <List {...args} subheader={<ListSubheader>Amigos del bosque</ListSubheader>}>
        {FRIENDS.map((f) => (
          <ListItem key={f.name}>
            <ListItemIcon>
              <Avatar size={36} character={f.character} />
            </ListItemIcon>
            <ListItemText primary={f.name} secondary={f.note} />
          </ListItem>
        ))}
      </List>
    </Paper>
  ),
};

export const Navigation: Story = {
  render: (args) => {
    const [page, setPage] = useState('Inicio');
    return (
      <Paper sx={{ width: 260, padding: 8 }}>
        <List {...args} disablePadding aria-label="Navegación">
          {['Inicio', 'Despensa', 'Mapa'].map((name) => (
            <ListItem key={name} disablePadding>
              <ListItemButton selected={page === name} onClick={() => setPage(name)}>
                <ListItemText primary={name} />
              </ListItemButton>
            </ListItem>
          ))}
          <Divider component="li" role="separator" sx={{ marginBlock: 6 }} />
          <ListItem disablePadding>
            <ListItemButton disabled>
              <ListItemText primary="Ajustes" />
            </ListItemButton>
          </ListItem>
        </List>
      </Paper>
    );
  },
};

export const WithSecondaryAction: Story = {
  args: { dense: true },
  render: (args) => (
    <Paper sx={{ width: 320 }}>
      <List {...args}>
        {['Hongos', 'Manzanas', 'Bellotas'].map((name, i) => (
          <ListItem key={name} secondaryAction={<Chip size="sm" label={`${(i + 1) * 4}`} color="primary" />}>
            <ListItemText primary={name} />
          </ListItem>
        ))}
      </List>
    </Paper>
  ),
};
