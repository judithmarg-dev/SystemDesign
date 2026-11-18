import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@core/testing';
import { Option, Select } from './Select';

const fruits = [
  { value: 'apple', label: 'Apple' },
  { value: 'acorn', label: 'Acorn' },
  { value: 'berry', label: 'Berry', disabled: true },
  { value: 'chestnut', label: 'Chestnut' },
];

const activeOption = () => {
  const id = screen.getByRole('combobox').getAttribute('aria-activedescendant');
  return id ? document.getElementById(id) : null;
};

describe('Select', () => {
  it('is a labelled combobox that shows the placeholder until something is chosen', () => {
    renderWithTheme(<Select label="Snack" options={fruits} placeholder="Pick one" helperText="For the picnic" />);
    const combobox = screen.getByRole('combobox', { name: /Snack/ });
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
    expect(combobox).toHaveTextContent('Pick one');
    expect(combobox).toHaveAccessibleDescription('For the picnic');
  });

  it('opens on click and selects an option', async () => {
    const onChange = vi.fn();
    renderWithTheme(<Select label="Snack" options={fruits} onChange={onChange} />);
    await userEvent.click(screen.getByRole('combobox'));
    const listbox = screen.getByRole('listbox', { name: 'Snack' });
    expect(within(listbox).getAllByRole('option')).toHaveLength(4);

    await userEvent.click(screen.getByRole('option', { name: 'Chestnut' }));
    expect(onChange).toHaveBeenCalledWith('chestnut');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveTextContent('Chestnut');
    expect(screen.getByRole('combobox')).toHaveFocus();
  });

  it('navigates with the keyboard, skipping disabled options', async () => {
    renderWithTheme(<Select label="Snack" options={fruits} />);
    const combobox = screen.getByRole('combobox');
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}');
    expect(combobox).toHaveAttribute('aria-expanded', 'true');

    expect(activeOption()).toHaveTextContent('Apple');
    await userEvent.keyboard('{ArrowDown}{ArrowDown}');
    expect(activeOption()).toHaveTextContent('Chestnut');
    await userEvent.keyboard('{Home}');
    expect(activeOption()).toHaveTextContent('Apple');
    await userEvent.keyboard('{End}{Enter}');
    expect(combobox).toHaveTextContent('Chestnut');
    expect(combobox).toHaveAttribute('aria-expanded', 'false');
  });

  it('closes on Escape without changing the value', async () => {
    const onChange = vi.fn();
    renderWithTheme(<Select label="Snack" options={fruits} defaultValue="apple" onChange={onChange} />);
    await userEvent.tab();
    await userEvent.keyboard('{Enter}{ArrowDown}{Escape}');
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(onChange).not.toHaveBeenCalled();
    expect(screen.getByRole('combobox')).toHaveTextContent('Apple');
  });

  it('jumps to a matching option when typing', async () => {
    renderWithTheme(<Select label="Snack" options={fruits} />);
    await userEvent.tab();
    await userEvent.keyboard('{ArrowDown}c');
    expect(activeOption()).toHaveTextContent('Chestnut');
  });

  it('accepts <Option> children and multiple selection', async () => {
    const onChange = vi.fn();
    renderWithTheme(
      <Select label="Friends" multiple defaultValue={['bear']} onChange={onChange} name="friends">
        <Option value="bear">Bear</Option>
        <Option value="squirrel">Squirrel</Option>
      </Select>,
    );
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.getByRole('listbox')).toHaveAttribute('aria-multiselectable', 'true');
    expect(screen.getByRole('option', { name: /Bear/ })).toHaveAttribute('aria-selected', 'true');

    await userEvent.click(screen.getByRole('option', { name: /Squirrel/ }));
    expect(onChange).toHaveBeenLastCalledWith(['bear', 'squirrel']);
    // Stays open for more picks.
    expect(screen.getByRole('listbox')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveTextContent('Bear, Squirrel');
  });

  it('does not open when disabled', async () => {
    renderWithTheme(<Select label="Snack" options={fruits} disabled />);
    await userEvent.click(screen.getByRole('combobox'));
    expect(screen.queryByRole('listbox')).not.toBeInTheDocument();
    expect(screen.getByRole('combobox')).toHaveAttribute('aria-disabled', 'true');
  });
});
