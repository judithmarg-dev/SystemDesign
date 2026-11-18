import { screen } from '@testing-library/react';
import { createRef } from 'react';
import { renderWithTheme } from '@core/testing';
import { Paper } from './Paper';

describe('Paper', () => {
  it('renders its children and forwards attributes and the ref', () => {
    const ref = createRef<HTMLDivElement>();
    renderWithTheme(
      <Paper ref={ref} role="note" aria-label="Reminder">
        Water the mushrooms
      </Paper>,
    );
    const paper = screen.getByRole('note', { name: 'Reminder' });
    expect(paper).toHaveTextContent('Water the mushrooms');
    expect(ref.current).toBe(paper);
  });

  it('pads its content from the spacing scale', () => {
    renderWithTheme(<Paper data-testid="paper" padding={2} />);
    const paper = screen.getByTestId('paper');
    expect(paper).toHaveStyle({ padding: '16px' });
    expect(paper).not.toHaveAttribute('padding');
  });

  it('renders as another element when asked', () => {
    renderWithTheme(<Paper component="section" aria-label="Notes" />);
    expect(screen.getByRole('region', { name: 'Notes' }).tagName).toBe('SECTION');
  });

  it('keeps the character decorative', () => {
    renderWithTheme(<Paper character="mushroom">Hi</Paper>);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });
});
