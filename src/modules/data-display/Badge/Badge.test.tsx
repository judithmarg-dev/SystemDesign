import { screen } from '@testing-library/react';
import { renderWithTheme } from '@core/testing';
import { Badge } from './Badge';

describe('Badge', () => {
  it('shows its content next to the child', () => {
    renderWithTheme(
      <Badge content={4}>
        <span>Inbox</span>
      </Badge>,
    );
    expect(screen.getByText('Inbox')).toBeInTheDocument();
    expect(screen.getByText('4')).toBeInTheDocument();
  });

  it('caps numbers at max', () => {
    renderWithTheme(<Badge content={120} max={99} />);
    expect(screen.getByText('99+')).toBeInTheDocument();
  });

  it('hides zero unless showZero is set', () => {
    const { rerender } = renderWithTheme(<Badge content={0} />);
    expect(screen.queryByText('0')).not.toBeInTheDocument();
    rerender(<Badge content={0} showZero />);
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders no content when invisible or dot', () => {
    const { rerender } = renderWithTheme(<Badge content={7} invisible />);
    expect(screen.queryByText('7')).not.toBeInTheDocument();
    rerender(<Badge content={7} dot />);
    expect(screen.queryByText('7')).not.toBeInTheDocument();
  });
});
