import styled from '@emotion/styled';
import { forwardRef } from 'react';
import type { ElementType, HTMLAttributes, ReactNode } from 'react';
import { applySx } from '@core';
import type { SxProp } from '@core';

export type DividerOrientation = 'horizontal' | 'vertical';
export type DividerVariant = 'fullWidth' | 'inset' | 'middle';

export interface DividerProps extends HTMLAttributes<HTMLElement>, SxProp {
  orientation?: DividerOrientation;
  /** `inset` leaves room at the start; `middle` leaves room on both sides. */
  variant?: DividerVariant;
  /** Stretches a vertical divider to the height of its flex container. */
  flexItem?: boolean;
  /** Optional text shown in the middle of a horizontal divider. */
  children?: ReactNode;
  /** Element or component to render. Defaults to `hr` (or `div` when it has children). */
  component?: ElementType;
}

interface RootProps extends SxProp {
  $orientation: DividerOrientation;
  $variant: DividerVariant;
  $flexItem: boolean;
  $withChildren: boolean;
}

const Root = styled.hr<RootProps>(
  ({ theme, $orientation, $variant, $flexItem, $withChildren }) => {
    const line = `1px solid ${theme.palette.divider}`;
    const vertical = $orientation === 'vertical';
    const inset = theme.spacing(2);

    if ($withChildren && !vertical) {
      return {
        display: 'flex',
        alignItems: 'center',
        gap: theme.spacing(1.5),
        margin: 0,
        marginInline: $variant === 'middle' ? inset : 0,
        marginInlineStart: $variant === 'fullWidth' ? 0 : inset,
        border: 0,
        color: theme.palette.text.secondary,
        fontFamily: theme.typography.fontFamily,
        fontSize: '0.875rem',
        fontWeight: 600,
        whiteSpace: 'nowrap',
        '&::before, &::after': { content: '""', flex: 1, borderTop: line },
      };
    }

    return {
      flexShrink: 0,
      margin: 0,
      border: 0,
      ...(vertical
        ? {
            borderInlineEnd: line,
            alignSelf: $flexItem ? 'stretch' : undefined,
            height: $flexItem ? 'auto' : '100%',
            marginBlock: $variant === 'middle' ? theme.spacing(1) : 0,
          }
        : {
            borderBottom: line,
            marginInlineStart: $variant === 'fullWidth' ? 0 : inset,
            marginInlineEnd: $variant === 'middle' ? inset : 0,
          }),
    };
  },
  applySx,
);

/** A thin line that separates content, horizontally or vertically. */
export const Divider = forwardRef<HTMLElement, DividerProps>(function Divider(
  { orientation = 'horizontal', variant = 'fullWidth', flexItem = false, children, component, ...rest },
  ref,
) {
  const withChildren = children !== undefined && children !== null;
  return (
    <Root
      as={component ?? (withChildren ? 'div' : 'hr')}
      ref={ref as never}
      role={withChildren || orientation === 'vertical' ? 'separator' : undefined}
      aria-orientation={orientation === 'vertical' ? 'vertical' : undefined}
      $orientation={orientation}
      $variant={variant}
      $flexItem={flexItem}
      $withChildren={withChildren}
      {...rest}
    >
      {withChildren ? <span>{children}</span> : null}
    </Root>
  );
});
