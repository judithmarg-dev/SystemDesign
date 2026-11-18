import { fireEvent, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@core/testing';
import { Slider } from './Slider';

describe('Slider', () => {
  it('exposes a labelled slider with its range and value', () => {
    renderWithTheme(<Slider aria-label="Volume" min={10} max={50} defaultValue={20} />);
    const slider = screen.getByRole('slider', { name: 'Volume' });
    expect(slider).toHaveAttribute('aria-valuemin', '10');
    expect(slider).toHaveAttribute('aria-valuemax', '50');
    expect(slider).toHaveAttribute('aria-valuenow', '20');
  });

  it('moves with the arrow, page, Home and End keys', async () => {
    const onChange = vi.fn();
    renderWithTheme(<Slider aria-label="Volume" defaultValue={50} step={5} onChange={onChange} />);
    const slider = screen.getByRole('slider');
    await userEvent.tab();
    expect(slider).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}');
    expect(slider).toHaveAttribute('aria-valuenow', '55');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    expect(slider).toHaveAttribute('aria-valuenow', '45');
    await userEvent.keyboard('{PageUp}');
    expect(slider).toHaveAttribute('aria-valuenow', '55');
    await userEvent.keyboard('{End}');
    expect(slider).toHaveAttribute('aria-valuenow', '100');
    await userEvent.keyboard('{ArrowRight}');
    expect(slider).toHaveAttribute('aria-valuenow', '100');
    await userEvent.keyboard('{Home}');
    expect(slider).toHaveAttribute('aria-valuenow', '0');
    expect(onChange).toHaveBeenLastCalledWith(0);
  });

  it('snaps decimal steps without floating point noise', async () => {
    renderWithTheme(<Slider aria-label="Opacity" min={0} max={1} step={0.1} defaultValue={0.2} />);
    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}');
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '0.3');
  });

  it('stays put when controlled until the parent updates `value`', async () => {
    const onChange = vi.fn();
    const { rerender } = renderWithTheme(<Slider aria-label="Volume" value={10} onChange={onChange} />);
    await userEvent.tab();
    await userEvent.keyboard('{ArrowRight}');
    expect(onChange).toHaveBeenCalledWith(11);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '10');
    rerender(<Slider aria-label="Volume" value={11} onChange={onChange} />);
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '11');
  });

  it('jumps to the pointer position on the track', () => {
    const onChangeCommitted = vi.fn();
    const { container } = renderWithTheme(<Slider aria-label="Volume" onChangeCommitted={onChangeCommitted} />);
    const root = container.firstElementChild as HTMLElement;
    root.getBoundingClientRect = () => ({ left: 0, width: 200, top: 0, height: 20, right: 200, bottom: 20, x: 0, y: 0, toJSON: () => ({}) });
    fireEvent.pointerDown(root, { button: 0, clientX: 150, pointerId: 1 });
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuenow', '75');
    fireEvent.pointerUp(root, { pointerId: 1 });
    expect(onChangeCommitted).toHaveBeenCalledWith(75);
  });

  it('ignores input when disabled', async () => {
    const onChange = vi.fn();
    renderWithTheme(<Slider aria-label="Volume" disabled onChange={onChange} />);
    const slider = screen.getByRole('slider');
    expect(slider).toHaveAttribute('aria-disabled', 'true');
    expect(slider).toHaveAttribute('tabindex', '-1');
    fireEvent.keyDown(slider, { key: 'ArrowRight' });
    expect(onChange).not.toHaveBeenCalled();
  });

  it('formats the value text and submits through a hidden input', () => {
    const { container } = renderWithTheme(
      <Slider aria-label="Heat" name="heat" defaultValue={30} valueLabelFormat={(v) => `${v} °C`} />,
    );
    expect(screen.getByRole('slider')).toHaveAttribute('aria-valuetext', '30 °C');
    expect(container.querySelector('input[name="heat"]')).toHaveValue('30');
  });
});
