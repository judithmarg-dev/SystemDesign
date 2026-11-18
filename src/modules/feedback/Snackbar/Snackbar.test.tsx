import { act, fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '@core/testing';
import { Snackbar } from './Snackbar';

describe('Snackbar', () => {
  afterEach(() => vi.useRealTimers());

  it('renders a polite status message only while open', () => {
    const { rerender } = renderWithTheme(<Snackbar open={false} message="Saved" />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();

    rerender(<Snackbar open message="Saved" />);
    expect(screen.getByRole('status')).toHaveTextContent('Saved');
  });

  it('asks to close after autoHideDuration', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    renderWithTheme(<Snackbar open message="Saved" autoHideDuration={3000} onClose={onClose} />);

    act(() => void vi.advanceTimersByTime(2999));
    expect(onClose).not.toHaveBeenCalled();
    act(() => void vi.advanceTimersByTime(1));
    expect(onClose).toHaveBeenCalledWith('timeout');
  });

  it('pauses the timer while hovered and restarts it afterwards', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    renderWithTheme(<Snackbar open message="Saved" autoHideDuration={3000} onClose={onClose} />);
    const bar = screen.getByRole('status');

    fireEvent.mouseEnter(bar);
    act(() => void vi.advanceTimersByTime(10_000));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.mouseLeave(bar);
    act(() => void vi.advanceTimersByTime(3000));
    expect(onClose).toHaveBeenCalledWith('timeout');
  });

  it('asks to close on Escape and never times out with a null duration', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    renderWithTheme(<Snackbar open message="Saved" autoHideDuration={null} onClose={onClose} />);

    act(() => void vi.advanceTimersByTime(60_000));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(onClose).toHaveBeenCalledWith('escape');
  });
});
