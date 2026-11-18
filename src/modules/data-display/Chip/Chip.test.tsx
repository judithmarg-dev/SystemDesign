import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@core/testing';
import { Chip } from './Chip';

describe('Chip', () => {
  it('is static by default: not a button and not focusable', () => {
    renderWithTheme(<Chip label="Otoño" />);
    expect(screen.getByText('Otoño')).toBeInTheDocument();
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
  });

  it('becomes a button when clickable, activated by click, Enter and Space', async () => {
    const onClick = vi.fn();
    renderWithTheme(<Chip label="Filtro" onClick={onClick} />);
    const chip = screen.getByRole('button', { name: 'Filtro' });
    await userEvent.click(chip);
    chip.focus();
    await userEvent.keyboard('{Enter}');
    await userEvent.keyboard(' ');
    expect(onClick).toHaveBeenCalledTimes(3);
  });

  it('deletes with its labelled button or with Backspace, without triggering onClick', async () => {
    const onClick = vi.fn();
    const onDelete = vi.fn();
    renderWithTheme(<Chip label="Bellota" onClick={onClick} onDelete={onDelete} deleteLabel="Quitar bellota" />);
    await userEvent.click(screen.getByRole('button', { name: 'Quitar bellota' }));
    screen.getByRole('button', { name: /Bellota/ }).focus();
    await userEvent.keyboard('{Backspace}');
    expect(onDelete).toHaveBeenCalledTimes(2);
    expect(onClick).not.toHaveBeenCalled();
  });

  it('ignores interaction when disabled', async () => {
    const onClick = vi.fn();
    renderWithTheme(<Chip label="Off" onClick={onClick} disabled />);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getByText('Off').parentElement).toHaveAttribute('aria-disabled', 'true');
  });
});
