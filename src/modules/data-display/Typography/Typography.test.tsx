import { screen } from '@testing-library/react';
import { defaultTheme } from '@core';
import { renderWithTheme } from '@core/testing';
import { Typography } from './Typography';

describe('Typography', () => {
  it('uses the semantic tag for the variant', () => {
    renderWithTheme(
      <>
        <Typography variant="h2">Title</Typography>
        <Typography>Body</Typography>
      </>,
    );
    expect(screen.getByRole('heading', { level: 2, name: 'Title' })).toBeInTheDocument();
    expect(screen.getByText('Body').tagName).toBe('P');
  });

  it('lets `component` override the tag without changing the style', () => {
    renderWithTheme(
      <Typography variant="h4" component="h1">
        Page title
      </Typography>,
    );
    expect(screen.getByRole('heading', { level: 1 })).toHaveStyle({ fontWeight: '700' });
  });

  it('resolves theme colors', () => {
    renderWithTheme(<Typography color="textSecondary">Muted</Typography>);
    expect(screen.getByText('Muted')).toHaveStyle({ color: defaultTheme.palette.text.secondary });
  });
});
