import { fireEvent, screen } from '@testing-library/react';
import { renderWithTheme } from '@core/testing';
import { Avatar } from './Avatar';

describe('Avatar', () => {
  it('shows the image with its alt text', () => {
    renderWithTheme(<Avatar src="/maple.png" alt="Maple Bear" />);
    expect(screen.getByRole('img', { name: 'Maple Bear' })).toHaveAttribute('src', '/maple.png');
  });

  it('falls back to initials when the image fails to load', () => {
    renderWithTheme(
      <Avatar src="/broken.png" alt="Maple Bear">
        Maple Bear
      </Avatar>,
    );
    fireEvent.error(screen.getByRole('img'));
    const fallback = screen.getByRole('img', { name: 'Maple Bear' });
    expect(fallback.tagName).toBe('SPAN');
    expect(fallback).toHaveTextContent('MB');
  });

  it('falls back to a character when there is no image or children', () => {
    const { container } = renderWithTheme(<Avatar alt="Guest" />);
    expect(screen.getByRole('img', { name: 'Guest' })).toBeInTheDocument();
    expect(container.querySelector('svg')).toBeInTheDocument();
  });

  it('accepts a numeric size', () => {
    renderWithTheme(<Avatar data-testid="avatar" size={50} />);
    expect(screen.getByTestId('avatar')).toHaveStyle({ width: '50px', height: '50px' });
  });
});
