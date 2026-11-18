import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@core/testing';
import { Alert } from './Alert';

describe('Alert', () => {
  it('announces errors and warnings assertively, the rest politely', () => {
    renderWithTheme(
      <>
        <Alert severity="error">Broken</Alert>
        <Alert severity="success">Saved</Alert>
      </>,
    );
    expect(screen.getByRole('alert')).toHaveTextContent('Broken');
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
  });

  it('renders the title and a custom icon instead of the character', () => {
    renderWithTheme(
      <Alert title="Heads up" icon={<span data-testid="icon" />}>
        Body
      </Alert>,
    );
    expect(screen.getByText('Heads up')).toBeInTheDocument();
    expect(screen.getByTestId('icon')).toBeInTheDocument();
  });

  it('shows a labelled close button only when onClose is given', async () => {
    const onClose = vi.fn();
    const { rerender } = renderWithTheme(<Alert>Body</Alert>);
    expect(screen.queryByRole('button')).not.toBeInTheDocument();

    rerender(
      <Alert onClose={onClose} closeLabel="Dismiss">
        Body
      </Alert>,
    );
    await userEvent.click(screen.getByRole('button', { name: 'Dismiss' }));
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
