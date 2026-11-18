import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@core/testing';
import { Breadcrumbs } from './Breadcrumbs';
import type { BreadcrumbsProps } from './Breadcrumbs';

const setup = (props: Partial<BreadcrumbsProps> = {}) =>
  renderWithTheme(
    <Breadcrumbs {...props}>
      <a href="#a">Home</a>
      <a href="#b">Forest</a>
      <a href="#c">Old oak</a>
      <a href="#d">Hollow</a>
      <span>Pantry</span>
    </Breadcrumbs>,
  );

describe('Breadcrumbs', () => {
  it('renders a labelled nav landmark with the last item as the current page', () => {
    setup();
    const nav = screen.getByRole('navigation', { name: 'Breadcrumb' });

    expect(within(nav).getAllByRole('link')).toHaveLength(4);
    expect(screen.getByText('Pantry')).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('link', { name: 'Hollow' })).not.toHaveAttribute('aria-current');
  });

  it('hides separators from assistive technology', () => {
    setup({ separator: '/' });
    // Only the five real items are exposed as list items.
    expect(screen.getAllByRole('listitem')).toHaveLength(5);
    expect(screen.getAllByText('/')).toHaveLength(4);
  });

  it('collapses the middle of a long trail and expands it on demand', async () => {
    setup({ maxItems: 3 });

    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Forest' })).not.toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Hollow' })).toBeInTheDocument();
    expect(screen.getByText('Pantry')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: 'Show full path' }));

    expect(screen.getByRole('link', { name: 'Forest' })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Show full path' })).not.toBeInTheDocument();
  });

  it('does not collapse when the trail fits', () => {
    setup({ maxItems: 5 });
    expect(screen.queryByRole('button')).not.toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(4);
  });
});
