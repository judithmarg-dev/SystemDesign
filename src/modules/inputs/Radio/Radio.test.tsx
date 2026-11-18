import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@core/testing';
import { Radio, RadioGroup } from './Radio';

const options = (
  <>
    <Radio value="acorn" label="Acorn" />
    <Radio value="apple" label="Apple" />
    <Radio value="honey" label="Honey" disabled />
  </>
);

describe('RadioGroup', () => {
  it('is a labelled radiogroup whose radios share a name', () => {
    renderWithTheme(<RadioGroup label="Snack">{options}</RadioGroup>);
    expect(screen.getByRole('radiogroup', { name: 'Snack' })).toBeInTheDocument();
    const names = screen.getAllByRole('radio').map((radio) => radio.getAttribute('name'));
    expect(names[0]).toBeTruthy();
    expect(new Set(names).size).toBe(1);
  });

  it('selects one option at a time when uncontrolled', async () => {
    const onChange = vi.fn();
    renderWithTheme(
      <RadioGroup label="Snack" defaultValue="acorn" onChange={onChange}>
        {options}
      </RadioGroup>,
    );
    expect(screen.getByRole('radio', { name: 'Acorn' })).toBeChecked();
    await userEvent.click(screen.getByText('Apple'));
    expect(screen.getByRole('radio', { name: 'Apple' })).toBeChecked();
    expect(screen.getByRole('radio', { name: 'Acorn' })).not.toBeChecked();
    expect(onChange).toHaveBeenCalledWith('apple', expect.anything());
  });

  it('keeps the selection under the parent’s control when `value` is given', async () => {
    const onChange = vi.fn();
    renderWithTheme(
      <RadioGroup label="Snack" value="acorn" onChange={onChange}>
        {options}
      </RadioGroup>,
    );
    await userEvent.click(screen.getByText('Apple'));
    expect(onChange).toHaveBeenCalledWith('apple', expect.anything());
    expect(screen.getByRole('radio', { name: 'Acorn' })).toBeChecked();
  });

  it('does not select disabled options, and can disable the whole group', async () => {
    const { rerender } = renderWithTheme(<RadioGroup label="Snack">{options}</RadioGroup>);
    await userEvent.click(screen.getByText('Honey'));
    expect(screen.getByRole('radio', { name: 'Honey' })).not.toBeChecked();
    rerender(
      <RadioGroup label="Snack" disabled>
        {options}
      </RadioGroup>,
    );
    for (const radio of screen.getAllByRole('radio')) expect(radio).toBeDisabled();
  });
});
