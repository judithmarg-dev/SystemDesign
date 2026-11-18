import styled from '@emotion/styled';
import { Children, cloneElement, forwardRef, isValidElement, useRef, useState } from 'react';
import type { HTMLAttributes, ReactElement, ReactNode } from 'react';
import { Leaf, applySx, focusRing, useTheme } from '@core';
import type { SxProp } from '@core';

export interface BreadcrumbsProps extends HTMLAttributes<HTMLElement>, SxProp {
  /** The trail, one element per level (usually links). The last one is the current page. */
  children: ReactNode;
  /** Element drawn between items. Defaults to a chevron, or a leaf when `decorated`. */
  separator?: ReactNode;
  /** Use a little autumn leaf as the separator. */
  decorated?: boolean;
  /** Collapse the middle of the trail behind an ellipsis button when there are more items than this. */
  maxItems?: number;
  /** Accessible label for the ellipsis button. */
  expandLabel?: string;
}

const Root = styled.nav<SxProp>(
  ({ theme }) => ({
    color: theme.palette.text.secondary,
    fontFamily: theme.typography.fontFamily,
    ...theme.typography.body2,
    fontWeight: 600,
  }),
  applySx,
);

const List = styled.ol(({ theme }) => ({
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: theme.spacing(0.75),
  margin: 0,
  padding: 0,
  listStyle: 'none',
}));

const Item = styled.li(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  '& a': {
    color: 'inherit',
    textDecoration: 'none',
    borderRadius: theme.shape.radius.xs,
    '&:hover': { color: theme.palette.text.primary, textDecoration: 'underline' },
    '&:focus-visible': focusRing(theme),
  },
  '& [aria-current="page"]': { color: theme.palette.text.primary, fontWeight: 800 },
}));

const Separator = styled.li(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  color: theme.palette.text.disabled,
  userSelect: 'none',
}));

const Expand = styled.button(({ theme }) => ({
  display: 'inline-grid',
  placeItems: 'center',
  minWidth: 32,
  height: 24,
  padding: 0,
  border: 0,
  borderRadius: theme.shape.radius.pill,
  background: theme.palette.action.selected,
  color: theme.palette.text.secondary,
  cursor: 'pointer',
  '&:hover': { background: theme.palette.action.hover, color: theme.palette.text.primary },
  '&:focus-visible': focusRing(theme),
}));

const Chevron = () => (
  <svg width="8" height="12" viewBox="0 0 8 12" aria-hidden focusable="false">
    <path d="M1.5 1.5L6 6l-4.5 4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

/** Shows where the current page sits in the hierarchy. */
export const Breadcrumbs = forwardRef<HTMLElement, BreadcrumbsProps>(function Breadcrumbs(
  { children, separator, decorated = false, maxItems, expandLabel = 'Show full path', 'aria-label': ariaLabel = 'Breadcrumb', ...rest },
  ref,
) {
  const theme = useTheme();
  const listRef = useRef<HTMLOListElement>(null);
  const [expanded, setExpanded] = useState(false);

  const items = Children.toArray(children).map((child, index, all) =>
    index === all.length - 1 && isValidElement(child)
      ? cloneElement(child as ReactElement<{ 'aria-current'?: string }>, { 'aria-current': 'page' })
      : child,
  );

  const divider = separator ?? (decorated ? <Leaf size={14} color={theme.palette.primary.main} /> : <Chevron />);

  const expand = () => {
    setExpanded(true);
    // The button is about to unmount: hand focus to the first item it was hiding.
    requestAnimationFrame(() => {
      listRef.current?.querySelectorAll<HTMLElement>('li:not([aria-hidden]) a, li:not([aria-hidden]) button')[1]?.focus();
    });
  };

  const collapsed = !expanded && maxItems !== undefined && maxItems >= 2 && items.length > maxItems;
  const visible: ReactNode[] = collapsed
    ? [
        items[0],
        <Expand key="expand" type="button" aria-label={expandLabel} onClick={expand}>
          <svg width="16" height="4" viewBox="0 0 16 4" aria-hidden focusable="false" fill="currentColor">
            <circle cx="2" cy="2" r="2" />
            <circle cx="8" cy="2" r="2" />
            <circle cx="14" cy="2" r="2" />
          </svg>
        </Expand>,
        ...items.slice(items.length - (maxItems - 1)),
      ]
    : items;

  return (
    <Root ref={ref} aria-label={ariaLabel} {...rest}>
      <List ref={listRef}>
        {visible.flatMap((item, index) => [
          index > 0 && (
            <Separator key={`separator-${index}`} aria-hidden>
              {divider}
            </Separator>
          ),
          <Item key={`item-${index}`}>{item}</Item>,
        ])}
      </List>
    </Root>
  );
});
