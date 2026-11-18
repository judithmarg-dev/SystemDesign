import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@core/testing';
import { List, ListItem, ListItemButton, ListItemIcon, ListItemText, ListSubheader } from './List';

describe('List', () => {
  it('renders a list of items with primary and secondary text', () => {
    renderWithTheme(
      <List aria-label="Animales">
        <ListItem>
          <ListItemText primary="Oso" secondary="Duerme en invierno" />
        </ListItem>
        <ListItem>
          <ListItemText primary="Ardilla" />
        </ListItem>
      </List>,
    );
    const list = screen.getByRole('list', { name: 'Animales' });
    const items = within(list).getAllByRole('listitem');
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent('Oso');
    expect(items[0]).toHaveTextContent('Duerme en invierno');
  });

  it('does not count the subheader as an item', () => {
    renderWithTheme(
      <List subheader={<ListSubheader>Bosque</ListSubheader>}>
        <ListItem>Uno</ListItem>
      </List>,
    );
    expect(screen.getByText('Bosque')).toBeInTheDocument();
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  it('has clickable rows that mark the selected one and hide decorative icons', async () => {
    const onClick = vi.fn();
    renderWithTheme(
      <List>
        <ListItem disablePadding>
          <ListItemButton selected onClick={onClick}>
            <ListItemIcon>🐻</ListItemIcon>
            <ListItemText primary="Inicio" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton disabled>
            <ListItemText primary="Ajustes" />
          </ListItemButton>
        </ListItem>
      </List>,
    );
    const home = screen.getByRole('button', { name: 'Inicio' });
    expect(home).toHaveAttribute('aria-current', 'true');
    await userEvent.click(home);
    expect(onClick).toHaveBeenCalledTimes(1);
    expect(screen.getByRole('button', { name: 'Ajustes' })).toBeDisabled();
  });

  it('renders a button row as a link when given a component', () => {
    renderWithTheme(
      <List>
        <ListItem disablePadding>
          <ListItemButton component="a" href="/bosque">
            <ListItemText primary="Bosque" />
          </ListItemButton>
        </ListItem>
      </List>,
    );
    const link = screen.getByRole('link', { name: 'Bosque' });
    expect(link).toHaveAttribute('href', '/bosque');
    expect(link).not.toHaveAttribute('type');
  });

  it('places the secondary action at the end of the row', () => {
    renderWithTheme(
      <List>
        <ListItem secondaryAction={<button>Borrar</button>}>
          <ListItemText primary="Hongo" />
        </ListItem>
      </List>,
    );
    expect(within(screen.getByRole('listitem')).getByRole('button', { name: 'Borrar' })).toBeInTheDocument();
  });
});
