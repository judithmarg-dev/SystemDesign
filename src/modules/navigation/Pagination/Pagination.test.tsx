import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { renderWithTheme } from '@core/testing';
import { Pagination, getPaginationItems } from './Pagination';

const labels = (count: number, page: number, siblingCount = 1, boundaryCount = 1) =>
  getPaginationItems({ count, page, siblingCount, boundaryCount, hidePrevButton: true, hideNextButton: true }).map(
    (item) => (item.type === 'page' ? item.page : '…'),
  );

describe('getPaginationItems', () => {
  it('lists every page when they fit', () => {
    expect(labels(5, 1)).toEqual([1, 2, 3, 4, 5]);
  });

  it('collapses the far side into an ellipsis', () => {
    expect(labels(10, 1)).toEqual([1, 2, 3, 4, 5, '…', 10]);
    expect(labels(10, 10)).toEqual([1, '…', 6, 7, 8, 9, 10]);
  });

  it('shows ellipses on both sides around the current page', () => {
    expect(labels(10, 5)).toEqual([1, '…', 4, 5, 6, '…', 10]);
    expect(labels(20, 10, 2, 2)).toEqual([1, 2, '…', 8, 9, 10, 11, 12, '…', 19, 20]);
  });

  it('handles a single page and no pages', () => {
    expect(labels(1, 1)).toEqual([1]);
    expect(labels(0, 1)).toEqual([]);
  });
});

describe('Pagination', () => {
  it('is a labelled navigation landmark that marks the current page', () => {
    renderWithTheme(<Pagination count={10} defaultPage={3} />);
    expect(screen.getByRole('navigation', { name: 'pagination navigation' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Page 3' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Go to page 4' })).not.toHaveAttribute('aria-current');
  });

  it('moves between pages with the page and arrow buttons', async () => {
    const onChange = vi.fn();
    renderWithTheme(<Pagination count={5} onChange={onChange} />);
    expect(screen.getByRole('button', { name: 'Go to previous page' })).toBeDisabled();

    await userEvent.click(screen.getByRole('button', { name: 'Go to page 4' }));
    expect(onChange).toHaveBeenLastCalledWith(4);
    await userEvent.click(screen.getByRole('button', { name: 'Go to next page' }));
    expect(onChange).toHaveBeenLastCalledWith(5);
    expect(screen.getByRole('button', { name: 'Page 5' })).toHaveAttribute('aria-current', 'page');
    expect(screen.getByRole('button', { name: 'Go to next page' })).toBeDisabled();
  });

  it('does not call onChange for the current page and respects a controlled page', async () => {
    const onChange = vi.fn();
    renderWithTheme(<Pagination count={5} page={2} onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: 'Page 2' }));
    expect(onChange).not.toHaveBeenCalled();
    await userEvent.click(screen.getByRole('button', { name: 'Go to page 3' }));
    expect(onChange).toHaveBeenCalledWith(3);
    expect(screen.getByRole('button', { name: 'Page 2' })).toHaveAttribute('aria-current', 'page');
  });

  it('disables every button when disabled', () => {
    renderWithTheme(<Pagination count={3} disabled />);
    for (const button of screen.getAllByRole('button')) expect(button).toBeDisabled();
  });
});
