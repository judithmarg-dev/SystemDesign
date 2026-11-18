import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useState } from 'react';
import { renderWithTheme } from '@core/testing';
import { Menu, MenuItem } from './Menu';
import type { MenuCloseReason } from './Menu';

function Example({ onClose, onPick }: { onClose?: (reason: MenuCloseReason) => void; onPick?: (name: string) => void }) {
  const [anchor, setAnchor] = useState<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState(false);
  return (
    <>
      <button ref={setAnchor} onClick={() => setOpen((o) => !o)}>
        Options
      </button>
      <button>Elsewhere</button>
      <Menu
        open={open}
        anchorEl={anchor}
        aria-label="Options"
        onClose={(reason) => {
          onClose?.(reason);
          setOpen(false);
        }}
      >
        <MenuItem onClick={() => onPick?.('rename')}>Rename</MenuItem>
        <MenuItem disabled>Share</MenuItem>
        <MenuItem onClick={() => onPick?.('delete')}>Delete</MenuItem>
      </Menu>
    </>
  );
}

const openMenu = async () => {
  await userEvent.click(screen.getByRole('button', { name: 'Options' }));
  return screen.findByRole('menu', { name: 'Options' });
};

describe('Menu', () => {
  it('opens with focus on the first item and moves it with the arrow keys, skipping disabled items', async () => {
    renderWithTheme(<Example />);
    await openMenu();

    const rename = screen.getByRole('menuitem', { name: 'Rename' });
    const remove = screen.getByRole('menuitem', { name: 'Delete' });
    await waitFor(() => expect(rename).toHaveFocus());

    await userEvent.keyboard('{ArrowDown}');
    expect(remove).toHaveFocus();
    await userEvent.keyboard('{ArrowDown}');
    expect(rename).toHaveFocus();
    await userEvent.keyboard('{ArrowUp}');
    expect(remove).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(rename).toHaveFocus();
    await userEvent.keyboard('{End}');
    expect(remove).toHaveFocus();
  });

  it('closes on Escape and returns focus to the anchor', async () => {
    const onClose = vi.fn();
    renderWithTheme(<Example onClose={onClose} />);
    await openMenu();
    await waitFor(() => expect(screen.getByRole('menuitem', { name: 'Rename' })).toHaveFocus());

    await userEvent.keyboard('{Escape}');

    expect(onClose).toHaveBeenCalledWith('escape');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('button', { name: 'Options' })).toHaveFocus());
  });

  it('runs the item action and closes when an item is chosen', async () => {
    const onClose = vi.fn();
    const onPick = vi.fn();
    renderWithTheme(<Example onClose={onClose} onPick={onPick} />);
    await openMenu();

    await userEvent.click(screen.getByRole('menuitem', { name: 'Delete' }));

    expect(onPick).toHaveBeenCalledWith('delete');
    expect(onClose).toHaveBeenCalledWith('select');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });

  it('closes on an outside click but ignores disabled items', async () => {
    const onClose = vi.fn();
    const onPick = vi.fn();
    renderWithTheme(<Example onClose={onClose} onPick={onPick} />);
    await openMenu();

    await userEvent.click(screen.getByRole('menuitem', { name: 'Share' }));
    expect(onPick).not.toHaveBeenCalled();
    expect(screen.getByRole('menu')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Elsewhere' }));
    expect(onClose).toHaveBeenCalledWith('outside');
    expect(screen.queryByRole('menu')).not.toBeInTheDocument();
  });
});
