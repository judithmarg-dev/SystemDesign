import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@core/testing';
import { IconButton } from './IconButton';

describe('IconButton', () => {
  it('is named by aria-label and does not submit forms by default', () => {
    renderWithTheme(<IconButton aria-label="Favorite">♥</IconButton>);
    const button = screen.getByRole('button', { name: 'Favorite' });
    expect(button).toHaveAttribute('type', 'button');
  });

  it('calls onClick when pressed', async () => {
    const onClick = vi.fn();
    renderWithTheme(
      <IconButton aria-label="Favorite" onClick={onClick}>
        ♥
      </IconButton>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  it('ignores clicks while disabled', async () => {
    const onClick = vi.fn();
    renderWithTheme(
      <IconButton aria-label="Favorite" onClick={onClick} disabled>
        ♥
      </IconButton>,
    );
    await userEvent.click(screen.getByRole('button'));
    expect(onClick).not.toHaveBeenCalled();
  });
});
