import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@core/testing';
import { Tab, TabList, TabPanel, Tabs } from './Tabs';
import type { TabsProps } from './Tabs';

const setup = (props: Partial<TabsProps> = {}) =>
  renderWithTheme(
    <Tabs defaultValue="one" {...props}>
      <TabList aria-label="Sections">
        <Tab value="one">One</Tab>
        <Tab value="two">Two</Tab>
        <Tab value="three" disabled>
          Three
        </Tab>
        <Tab value="four">Four</Tab>
      </TabList>
      <TabPanel value="one">Panel one</TabPanel>
      <TabPanel value="two">Panel two</TabPanel>
      <TabPanel value="four">Panel four</TabPanel>
    </Tabs>,
  );

describe('Tabs', () => {
  it('links the selected tab to its panel and hides the others', () => {
    setup();
    const tab = screen.getByRole('tab', { name: 'One' });
    const panel = screen.getByRole('tabpanel');

    expect(tab).toHaveAttribute('aria-selected', 'true');
    expect(tab).toHaveAttribute('aria-controls', panel.id);
    expect(panel).toHaveAttribute('aria-labelledby', tab.id);
    expect(panel).toHaveTextContent('Panel one');
    expect(screen.queryByText('Panel two')).not.toBeInTheDocument();
  });

  it('selects a tab on click and reports the change', async () => {
    const onChange = vi.fn();
    setup({ onChange });

    await userEvent.click(screen.getByRole('tab', { name: 'Two' }));

    expect(onChange).toHaveBeenCalledWith('two');
    expect(screen.getByRole('tab', { name: 'Two' })).toHaveAttribute('aria-selected', 'true');
    expect(screen.getByRole('tabpanel')).toHaveTextContent('Panel two');
  });

  it('uses a roving tabindex and arrow keys, skipping disabled tabs and wrapping', async () => {
    setup();
    const [one, two, , four] = screen.getAllByRole('tab');
    expect(one).toHaveAttribute('tabindex', '0');
    expect(two).toHaveAttribute('tabindex', '-1');

    await userEvent.tab();
    expect(one).toHaveFocus();

    await userEvent.keyboard('{ArrowRight}{ArrowRight}');
    expect(four).toHaveFocus();
    expect(four).toHaveAttribute('aria-selected', 'true');

    await userEvent.keyboard('{ArrowRight}');
    expect(one).toHaveFocus();

    await userEvent.keyboard('{End}');
    expect(four).toHaveFocus();
    await userEvent.keyboard('{Home}');
    expect(one).toHaveAttribute('aria-selected', 'true');
  });

  it('stays on the given value when controlled', async () => {
    const onChange = vi.fn();
    setup({ value: 'one', defaultValue: undefined, onChange });

    await userEvent.click(screen.getByRole('tab', { name: 'Two' }));

    expect(onChange).toHaveBeenCalledWith('two');
    expect(screen.getByRole('tab', { name: 'One' })).toHaveAttribute('aria-selected', 'true');
  });
});
