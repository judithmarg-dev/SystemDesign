import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@core/testing';
import { Tooltip } from './Tooltip';

describe('Tooltip', () => {
  it('shows on keyboard focus and describes its trigger', async () => {
    renderWithTheme(
      <Tooltip title="Guardar bellotas">
        <button>Guardar</button>
      </Tooltip>,
    );
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    await userEvent.tab();
    const tooltip = screen.getByRole('tooltip');
    expect(tooltip).toHaveTextContent('Guardar bellotas');
    expect(screen.getByRole('button')).toHaveAccessibleDescription('Guardar bellotas');
  });

  it('hides on blur and on Escape', async () => {
    renderWithTheme(
      <>
        <Tooltip title="Info">
          <button>Trigger</button>
        </Tooltip>
        <button>Other</button>
      </>,
    );
    await userEvent.tab();
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    await userEvent.keyboard('{Escape}');
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();

    await userEvent.tab();
    await userEvent.tab({ shift: true });
    expect(screen.getByRole('tooltip')).toBeInTheDocument();
    await userEvent.tab();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
  });

  it('shows on hover after the enter delay', async () => {
    renderWithTheme(
      <Tooltip title="Hola" enterDelay={50}>
        <button>Hover me</button>
      </Tooltip>,
    );
    await userEvent.hover(screen.getByRole('button'));
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    await waitFor(() => expect(screen.getByRole('tooltip')).toHaveTextContent('Hola'));
  });

  it('keeps an existing aria-describedby and renders nothing for an empty title', async () => {
    renderWithTheme(
      <>
        <span id="hint">Hint</span>
        <Tooltip title="">
          <button aria-describedby="hint">Empty</button>
        </Tooltip>
      </>,
    );
    await userEvent.tab();
    expect(screen.queryByRole('tooltip')).not.toBeInTheDocument();
    expect(screen.getByRole('button')).toHaveAttribute('aria-describedby', 'hint');
  });
});
