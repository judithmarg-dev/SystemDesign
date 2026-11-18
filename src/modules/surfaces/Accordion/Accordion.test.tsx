import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@core/testing';
import { Accordion, AccordionDetails, AccordionSummary } from './Accordion';

describe('Accordion', () => {
  it('links the summary button and the details region', () => {
    renderWithTheme(
      <Accordion defaultExpanded>
        <AccordionSummary>Winter plans</AccordionSummary>
        <AccordionDetails>Gather acorns.</AccordionDetails>
      </Accordion>,
    );
    const button = screen.getByRole('button', { name: 'Winter plans' });
    const region = screen.getByRole('region', { name: 'Winter plans' });
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(button).toHaveAttribute('aria-controls', region.id);
    expect(screen.getByRole('heading', { level: 3, name: 'Winter plans' })).toBeInTheDocument();
  });

  it('expands and collapses on click and keyboard', async () => {
    const onChange = vi.fn();
    renderWithTheme(
      <Accordion onChange={onChange}>
        <AccordionSummary>Winter plans</AccordionSummary>
        <AccordionDetails>Gather acorns.</AccordionDetails>
      </Accordion>,
    );
    const button = screen.getByRole('button', { name: 'Winter plans' });
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(screen.queryByRole('region')).not.toBeInTheDocument();

    await userEvent.click(button);
    expect(button).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByRole('region')).toHaveTextContent('Gather acorns.');
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), true);

    button.focus();
    await userEvent.keyboard('{Enter}');
    expect(button).toHaveAttribute('aria-expanded', 'false');
    expect(onChange).toHaveBeenLastCalledWith(expect.anything(), false);
  });

  it('stays put when controlled until the parent updates `expanded`', async () => {
    const onChange = vi.fn();
    const ui = (expanded: boolean) => (
      <Accordion expanded={expanded} onChange={onChange}>
        <AccordionSummary>Winter plans</AccordionSummary>
        <AccordionDetails>Gather acorns.</AccordionDetails>
      </Accordion>
    );
    const { rerender } = renderWithTheme(ui(false));
    await userEvent.click(screen.getByRole('button'));
    expect(onChange).toHaveBeenCalledWith(expect.anything(), true);
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'false');
    rerender(ui(true));
    expect(screen.getByRole('button')).toHaveAttribute('aria-expanded', 'true');
  });

  it('cannot be toggled when disabled', async () => {
    const onChange = vi.fn();
    renderWithTheme(
      <Accordion disabled onChange={onChange}>
        <AccordionSummary headingLevel={2}>Winter plans</AccordionSummary>
        <AccordionDetails>Gather acorns.</AccordionDetails>
      </Accordion>,
    );
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button'));
    expect(screen.getByRole('button')).toBeDisabled();
    expect(onChange).not.toHaveBeenCalled();
  });
});
