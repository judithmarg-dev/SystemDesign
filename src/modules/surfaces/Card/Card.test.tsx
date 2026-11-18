import { screen } from '@testing-library/react';
import { createRef } from 'react';
import { renderWithTheme } from '@core/testing';
import { Card, CardActions, CardContent, CardHeader, CardMedia } from './Card';

describe('Card', () => {
  it('composes header, media, content and actions', () => {
    renderWithTheme(
      <Card data-testid="card">
        <CardHeader title="Picnic" subheader="Saturday" action={<button>More</button>} />
        <CardMedia src="hills.png" alt="Hills at sunset" />
        <CardContent>Bring a blanket.</CardContent>
        <CardActions>
          <button>Join</button>
        </CardActions>
      </Card>,
    );
    const card = screen.getByTestId('card');
    expect(card).toHaveTextContent('Picnic');
    expect(card).toHaveTextContent('Saturday');
    expect(card).toHaveTextContent('Bring a blanket.');
    expect(screen.getByRole('img', { name: 'Hills at sunset' })).toHaveAttribute('src', 'hills.png');
    expect(screen.getAllByRole('button').map((b) => b.textContent)).toEqual(['More', 'Join']);
  });

  it('forwards its ref and DOM props to the root, without leaking internal props', () => {
    const ref = createRef<HTMLDivElement>();
    renderWithTheme(<Card ref={ref} interactive aria-label="Event" className="custom" />);
    expect(ref.current).toHaveAttribute('aria-label', 'Event');
    expect(ref.current).toHaveClass('custom');
    expect(ref.current).not.toHaveAttribute('interactive');
  });

  it('keeps the character decoration out of the accessibility tree', () => {
    renderWithTheme(
      <Card character="bear" data-testid="card">
        <CardContent>Hello</CardContent>
      </Card>,
    );
    const decorations = screen.getByTestId('card').querySelectorAll('svg');
    expect(decorations.length).toBeGreaterThan(0);
    decorations.forEach((svg) => expect(svg.closest('[aria-hidden="true"]')).not.toBeNull());
  });
});
