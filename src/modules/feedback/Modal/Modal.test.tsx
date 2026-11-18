import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { renderWithTheme } from '@core/testing';
import { Modal } from './Modal';

describe('Modal', () => {
  it('renders nothing while closed', () => {
    renderWithTheme(<Modal open={false} title="Hi" />);
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('is a modal dialog labelled by its title', () => {
    renderWithTheme(
      <Modal open title="Save your acorns?">
        Body
      </Modal>,
    );
    const dialog = screen.getByRole('dialog', { name: 'Save your acorns?' });
    expect(dialog).toHaveAttribute('aria-modal', 'true');
    expect(dialog).toHaveTextContent('Body');
  });

  it('reports why it was asked to close', async () => {
    const onClose = vi.fn();
    renderWithTheme(<Modal open title="Hi" closeButton onClose={onClose} />);
    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenLastCalledWith('escape');
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenLastCalledWith('closeButton');
  });

  it('ignores Escape when disableEscapeClose is set', async () => {
    const onClose = vi.fn();
    renderWithTheme(<Modal open title="Hi" disableEscapeClose onClose={onClose} />);
    await userEvent.keyboard('{Escape}');
    expect(onClose).not.toHaveBeenCalled();
  });

  it('moves focus into the dialog and locks page scroll', () => {
    renderWithTheme(<Modal open title="Hi" actions={<button type="button">OK</button>} />);
    expect(screen.getByRole('button', { name: 'OK' })).toHaveFocus();
    expect(document.body.style.overflow).toBe('hidden');
  });
});
