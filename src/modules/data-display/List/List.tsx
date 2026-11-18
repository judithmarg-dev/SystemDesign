import styled from '@emotion/styled';
import { createContext, forwardRef, useContext } from 'react';
import type { ButtonHTMLAttributes, ElementType, HTMLAttributes, LiHTMLAttributes, ReactNode } from 'react';
import { applySx, focusRing, reducedMotion, transition } from '@core';
import type { SxProp } from '@core';

const ListContext = createContext({ dense: false });

/* ---------------------------------- List ---------------------------------- */

export interface ListProps extends HTMLAttributes<HTMLUListElement>, SxProp {
  /** Tighter rows, for compact menus and sidebars. */
  dense?: boolean;
  /** Removes the vertical padding of the list. */
  disablePadding?: boolean;
  /** Content shown at the top, usually a `ListSubheader`. */
  subheader?: ReactNode;
  /** Element or component to render. Defaults to `ul`. */
  component?: ElementType;
}

const ListRoot = styled.ul<SxProp & { $disablePadding: boolean }>(
  ({ theme, $disablePadding }) => ({
    position: 'relative',
    margin: 0,
    padding: $disablePadding ? 0 : `${theme.spacing(0.75)} 0`,
    listStyle: 'none',
    display: 'flex',
    flexDirection: 'column',
    gap: 2,
  }),
  applySx,
);

/** A vertical list of rows. Compose with `ListItem`, `ListItemButton`, `ListItemIcon` and `ListItemText`. */
export const List = forwardRef<HTMLUListElement, ListProps>(function List(
  { dense = false, disablePadding = false, subheader, component, children, ...rest },
  ref,
) {
  return (
    <ListContext.Provider value={{ dense }}>
      <ListRoot as={component} ref={ref as never} $disablePadding={disablePadding} {...rest}>
        {subheader}
        {children}
      </ListRoot>
    </ListContext.Provider>
  );
});

/* -------------------------------- ListItem -------------------------------- */

export interface ListItemProps extends LiHTMLAttributes<HTMLLIElement>, SxProp {
  /** Removes the item's padding, e.g. when it wraps a `ListItemButton`. */
  disablePadding?: boolean;
  /** Element placed at the end of the row, such as an `IconButton`. */
  secondaryAction?: ReactNode;
}

const rowPadding = (dense: boolean) => (dense ? [0.5, 1.5] : [1, 2]);

const ItemRoot = styled.li<SxProp & { $dense: boolean; $disablePadding: boolean }>(
  ({ theme, $dense, $disablePadding }) => {
    const [y, x] = rowPadding($dense);
    return {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1.5),
      boxSizing: 'border-box',
      minWidth: 0,
      padding: $disablePadding ? 0 : `${theme.spacing(y!)} ${theme.spacing(x!)}`,
      color: theme.palette.text.primary,
      fontFamily: theme.typography.fontFamily,
    };
  },
  applySx,
);

const SecondaryAction = styled.div(({ theme }) => ({
  display: 'inline-flex',
  flexShrink: 0,
  marginInlineStart: 'auto',
  paddingInlineEnd: theme.spacing(1),
}));

export const ListItem = forwardRef<HTMLLIElement, ListItemProps>(function ListItem(
  { disablePadding = false, secondaryAction, children, ...rest },
  ref,
) {
  const { dense } = useContext(ListContext);
  return (
    <ItemRoot ref={ref} $dense={dense} $disablePadding={disablePadding} {...rest}>
      {children}
      {secondaryAction && <SecondaryAction>{secondaryAction}</SecondaryAction>}
    </ItemRoot>
  );
});

/* ----------------------------- ListItemButton ----------------------------- */

export interface ListItemButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, SxProp {
  /** Marks the row as the current choice (e.g. the active page in a sidebar). */
  selected?: boolean;
  /** Element or component to render, e.g. `a` or a router link. Defaults to `button`. */
  component?: ElementType;
  href?: string;
}

const ButtonRoot = styled.button<SxProp & { $dense: boolean; $selected: boolean }>(
  ({ theme, $dense, $selected }) => {
    const [y, x] = rowPadding($dense);
    return {
      display: 'flex',
      alignItems: 'center',
      gap: theme.spacing(1.5),
      flex: 1,
      minWidth: 0,
      boxSizing: 'border-box',
      minHeight: $dense ? 36 : 44,
      padding: `${theme.spacing(y!)} ${theme.spacing(x!)}`,
      margin: 0,
      border: 0,
      borderRadius: theme.shape.radius.sm,
      background: $selected ? theme.palette.action.selected : 'transparent',
      color: theme.palette.text.primary,
      fontFamily: theme.typography.fontFamily,
      font: 'inherit',
      textAlign: 'start',
      textDecoration: 'none',
      cursor: 'pointer',
      WebkitTapHighlightColor: 'transparent',
      transition: transition(theme, ['background-color', 'transform']),
      [reducedMotion]: { transition: 'none' },
      '&:hover': { background: $selected ? theme.palette.action.selected : theme.palette.action.hover },
      '&:active': { transform: 'scale(0.985)' },
      '&:focus-visible': { ...focusRing(theme), outlineOffset: -2 },
      '&:disabled, &[aria-disabled="true"]': {
        cursor: 'not-allowed',
        color: theme.palette.action.disabled,
        background: 'transparent',
        transform: 'none',
      },
    };
  },
  applySx,
);

/** A clickable row. Put it inside `<ListItem disablePadding>`. */
export const ListItemButton = forwardRef<HTMLButtonElement, ListItemButtonProps>(function ListItemButton(
  { selected = false, component, type, ...rest },
  ref,
) {
  const { dense } = useContext(ListContext);
  const isButton = !component || component === 'button';
  return (
    <ButtonRoot
      as={component}
      ref={ref as never}
      type={isButton ? (type ?? 'button') : undefined}
      aria-current={selected ? 'true' : undefined}
      $dense={dense}
      $selected={selected}
      {...rest}
    />
  );
});

/* ------------------------------ ListItemIcon ------------------------------ */

export interface ListItemIconProps extends HTMLAttributes<HTMLSpanElement>, SxProp {}

const IconRoot = styled.span<SxProp>(
  ({ theme }) => ({
    display: 'inline-flex',
    flexShrink: 0,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 24,
    color: theme.palette.text.secondary,
    fontSize: '1.25rem',
  }),
  applySx,
);

/** Icon or avatar at the start of a row. Decorative: hidden from screen readers. */
export const ListItemIcon = forwardRef<HTMLSpanElement, ListItemIconProps>(function ListItemIcon(props, ref) {
  return <IconRoot ref={ref} aria-hidden {...props} />;
});

/* ------------------------------ ListItemText ------------------------------ */

export interface ListItemTextProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'>, SxProp {
  primary: ReactNode;
  secondary?: ReactNode;
}

const TextRoot = styled.div<SxProp>({ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 2 }, applySx);

const Primary = styled.span<{ $dense: boolean }>(({ theme, $dense }) => ({
  ...theme.typography.body2,
  fontSize: $dense ? '0.875rem' : '0.9375rem',
  fontWeight: 700,
  color: theme.palette.text.primary,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

const Secondary = styled.span(({ theme }) => ({
  ...theme.typography.caption,
  color: theme.palette.text.secondary,
}));

export const ListItemText = forwardRef<HTMLDivElement, ListItemTextProps>(function ListItemText(
  { primary, secondary, ...rest },
  ref,
) {
  const { dense } = useContext(ListContext);
  return (
    <TextRoot ref={ref} {...rest}>
      <Primary $dense={dense}>{primary}</Primary>
      {secondary && <Secondary>{secondary}</Secondary>}
    </TextRoot>
  );
});

/* ------------------------------ ListSubheader ----------------------------- */

export interface ListSubheaderProps extends LiHTMLAttributes<HTMLLIElement>, SxProp {}

const SubheaderRoot = styled.li<SxProp>(
  ({ theme }) => ({
    padding: `${theme.spacing(1)} ${theme.spacing(2)} ${theme.spacing(0.5)}`,
    ...theme.typography.overline,
    color: theme.palette.text.secondary,
    listStyle: 'none',
  }),
  applySx,
);

/** A small heading for a group of rows. */
export const ListSubheader = forwardRef<HTMLLIElement, ListSubheaderProps>(function ListSubheader(props, ref) {
  return <SubheaderRoot ref={ref} role="presentation" {...props} />;
});
