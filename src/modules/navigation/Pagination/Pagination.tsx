import styled from '@emotion/styled';
import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { applySx, focusRing, glass, reducedMotion, transition } from '@core';
import type { ColorName, Size, SxProp } from '@core';
import { useControlled } from '@shared';

export type PaginationVariant = 'glass' | 'text' | 'outlined';

export type PaginationItem =
  | { type: 'page'; page: number }
  | { type: 'start-ellipsis' }
  | { type: 'end-ellipsis' }
  | { type: 'previous' | 'next'; page: number };

export interface UsePaginationOptions {
  count: number;
  page: number;
  /** Pages shown on each side of the current one. */
  siblingCount?: number;
  /** Pages always shown at the start and the end. */
  boundaryCount?: number;
  hidePrevButton?: boolean;
  hideNextButton?: boolean;
}

const range = (start: number, end: number) =>
  end < start ? [] : Array.from({ length: end - start + 1 }, (_, i) => start + i);

/**
 * Computes the items of a pagination bar: pages, ellipses and prev/next buttons.
 * Same algorithm as MUI, so the bar keeps a constant number of items while the page changes.
 */
export function getPaginationItems({
  count,
  page,
  siblingCount = 1,
  boundaryCount = 1,
  hidePrevButton = false,
  hideNextButton = false,
}: UsePaginationOptions): PaginationItem[] {
  const startPages = range(1, Math.min(boundaryCount, count));
  const endPages = range(Math.max(count - boundaryCount + 1, boundaryCount + 1), count);

  const siblingsStart = Math.max(
    Math.min(page - siblingCount, count - boundaryCount - siblingCount * 2 - 1),
    boundaryCount + 2,
  );
  const siblingsEnd = Math.min(
    Math.max(page + siblingCount, boundaryCount + siblingCount * 2 + 2),
    endPages.length > 0 ? endPages[0]! - 2 : count - 1,
  );

  const pages: Array<number | 'start-ellipsis' | 'end-ellipsis'> = [
    ...startPages,
    ...(siblingsStart > boundaryCount + 2
      ? (['start-ellipsis'] as const)
      : boundaryCount + 1 < count - boundaryCount
        ? [boundaryCount + 1]
        : []),
    ...range(siblingsStart, siblingsEnd),
    ...(siblingsEnd < count - boundaryCount - 1
      ? (['end-ellipsis'] as const)
      : count - boundaryCount > boundaryCount
        ? [count - boundaryCount]
        : []),
    ...endPages,
  ];

  return [
    ...(hidePrevButton ? [] : [{ type: 'previous' as const, page: Math.max(1, page - 1) }]),
    ...pages.map((item): PaginationItem => (typeof item === 'number' ? { type: 'page', page: item } : { type: item })),
    ...(hideNextButton ? [] : [{ type: 'next' as const, page: Math.min(count, page + 1) }]),
  ];
}

export interface PaginationProps
  extends Omit<HTMLAttributes<HTMLElement>, 'onChange' | 'color'>,
    SxProp,
    Pick<UsePaginationOptions, 'siblingCount' | 'boundaryCount' | 'hidePrevButton' | 'hideNextButton'> {
  /** Total number of pages. */
  count: number;
  /** Current page, 1-based (controlled). */
  page?: number;
  /** Initial page (uncontrolled). */
  defaultPage?: number;
  /** Called with the page the user picked. */
  onChange?: (page: number) => void;
  variant?: PaginationVariant;
  color?: ColorName;
  size?: Size;
  disabled?: boolean;
  /** Accessible label of each button. */
  getItemAriaLabel?: (type: 'page' | 'previous' | 'next', page: number, selected: boolean) => string;
}

const SIZE: Record<Size, number> = { sm: 30, md: 38, lg: 46 };
const FONT: Record<Size, string> = { sm: '0.8125rem', md: '0.9375rem', lg: '1.0625rem' };

const Nav = styled.nav<SxProp>({ display: 'block' }, applySx);

const List = styled.ul(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  margin: 0,
  padding: 0,
  listStyle: 'none',
}));

const ItemButton = styled.button<{ $variant: PaginationVariant; $color: ColorName; $size: Size; $selected: boolean }>(
  ({ theme, $variant, $color, $size, $selected }) => {
    const c = theme.palette[$color];
    return {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: SIZE[$size],
      height: SIZE[$size],
      padding: `0 ${theme.spacing(0.75)}`,
      border: '1px solid transparent',
      borderRadius: theme.shape.radius.pill,
      background: 'transparent',
      color: theme.palette.text.primary,
      fontFamily: theme.typography.fontFamily,
      fontSize: FONT[$size],
      fontWeight: 700,
      fontVariantNumeric: 'tabular-nums',
      cursor: 'pointer',
      WebkitTapHighlightColor: 'transparent',
      transition: transition(theme, ['transform', 'background-color', 'box-shadow'], { easing: 'bounce' }),
      [reducedMotion]: { transition: 'none' },
      '& > svg': { width: '1.1em', height: '1.1em' },
      // Arrows point the other way in right-to-left pages.
      '[dir="rtl"] & > svg': { transform: 'scaleX(-1)' },
      ...($variant === 'glass' && glass(theme, { blur: 'sm', tint: 'subtle' })),
      ...($variant === 'outlined' && { borderColor: theme.palette.divider }),
      '&:hover': { background: theme.palette.action.hover, transform: 'translateY(-1px)' },
      '&:active': { transform: 'scale(0.94)' },
      ...($selected && {
        color: c.contrastText,
        background: `linear-gradient(180deg, ${c.light} -40%, ${c.main} 70%)`,
        borderColor: 'transparent',
        boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 2px 0 ${c.dark}`,
        '&:hover': { background: `linear-gradient(180deg, ${c.light} -40%, ${c.main} 70%)`, transform: 'none' },
      }),
      '&:focus-visible': focusRing(theme),
      '&:disabled': {
        cursor: 'not-allowed',
        color: theme.palette.action.disabled,
        background: $selected ? theme.palette.action.disabledBackground : 'transparent',
        boxShadow: 'none',
        backdropFilter: 'none',
        transform: 'none',
      },
    };
  },
);

const Ellipsis = styled.span<{ $size: Size }>(({ theme, $size }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  minWidth: SIZE[$size],
  color: theme.palette.text.secondary,
  fontSize: FONT[$size],
  fontWeight: 700,
  userSelect: 'none',
}));

const Arrow = ({ direction }: { direction: 'previous' | 'next' }): ReactNode => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d={direction === 'previous' ? 'M15 6l-6 6 6 6' : 'M9 6l6 6-6 6'} />
  </svg>
);

const defaultAriaLabel = (type: 'page' | 'previous' | 'next', page: number, selected: boolean) => {
  if (type === 'previous') return 'Go to previous page';
  if (type === 'next') return 'Go to next page';
  return selected ? `Page ${page}` : `Go to page ${page}`;
};

/** Lets the user move between pages of content. The current page is announced with `aria-current="page"`. */
export const Pagination = forwardRef<HTMLElement, PaginationProps>(function Pagination(
  {
    count,
    page: pageProp,
    defaultPage = 1,
    onChange,
    siblingCount = 1,
    boundaryCount = 1,
    hidePrevButton = false,
    hideNextButton = false,
    variant = 'glass',
    color = 'primary',
    size = 'md',
    disabled = false,
    getItemAriaLabel = defaultAriaLabel,
    'aria-label': ariaLabel = 'pagination navigation',
    ...rest
  },
  ref,
) {
  const [page, setPage] = useControlled(pageProp, defaultPage);
  const total = Math.max(0, Math.floor(count));
  const current = Math.min(Math.max(1, page), Math.max(1, total));

  const go = (next: number) => {
    if (next === current || next < 1 || next > total) return;
    setPage(next);
    onChange?.(next);
  };

  const items = getPaginationItems({ count: total, page: current, siblingCount, boundaryCount, hidePrevButton, hideNextButton });

  return (
    <Nav ref={ref} aria-label={ariaLabel} {...rest}>
      <List>
        {items.map((item, index) => {
          if (item.type === 'start-ellipsis' || item.type === 'end-ellipsis') {
            return (
              <li key={item.type}>
                <Ellipsis $size={size} aria-hidden>
                  …
                </Ellipsis>
              </li>
            );
          }
          const selected = item.type === 'page' && item.page === current;
          const edgeDisabled =
            (item.type === 'previous' && current <= 1) || (item.type === 'next' && current >= total);
          return (
            <li key={item.type === 'page' ? item.page : `${item.type}-${index}`}>
              <ItemButton
                type="button"
                $variant={variant}
                $color={color}
                $size={size}
                $selected={selected}
                disabled={disabled || edgeDisabled}
                aria-current={selected ? 'page' : undefined}
                aria-label={getItemAriaLabel(item.type, item.page, selected)}
                onClick={() => go(item.page)}
              >
                {item.type === 'page' ? item.page : <Arrow direction={item.type} />}
              </ItemButton>
            </li>
          );
        })}
      </List>
    </Nav>
  );
});
