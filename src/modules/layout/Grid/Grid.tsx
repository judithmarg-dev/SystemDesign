import type { CSSObject } from '@emotion/react';
import styled from '@emotion/styled';
import { forwardRef } from 'react';
import type { ElementType, HTMLAttributes } from 'react';
import { applySx } from '@core';
import type { Breakpoint, MochiTheme, SxProp } from '@core';

/** A single value, or one value per breakpoint (applied from that breakpoint up). */
export type Responsive<T> = T | Partial<Record<Breakpoint, T>>;

const ORDER: Breakpoint[] = ['xs', 'sm', 'md', 'lg', 'xl'];

/** Expands a responsive value into base styles plus min-width media queries. */
function responsive(theme: MochiTheme, value: Responsive<number>, style: (value: number) => CSSObject): CSSObject {
  if (typeof value !== 'object') return style(value);
  const result: CSSObject = {};
  for (const key of ORDER) {
    const v = value[key];
    if (v === undefined) continue;
    if (key === 'xs') Object.assign(result, style(v));
    else result[theme.breakpoints.up(key)] = style(v);
  }
  return result;
}

export interface GridProps extends HTMLAttributes<HTMLElement>, SxProp {
  /** Number of equal columns, optionally per breakpoint. */
  columns?: Responsive<number>;
  /** Gap between cells, in spacing units. */
  spacing?: number;
  /** Element or component to render. Defaults to `div`. */
  component?: ElementType;
}

const GridRoot = styled.div<SxProp & { $columns: Responsive<number>; $spacing: number }>(
  ({ theme, $columns, $spacing }) => ({
    display: 'grid',
    gap: theme.spacing($spacing),
    ...responsive(theme, $columns, (count) => ({ gridTemplateColumns: `repeat(${count}, minmax(0, 1fr))` })),
  }),
  applySx,
);

/** A CSS grid of equal columns. */
export const Grid = forwardRef<HTMLElement, GridProps>(function Grid({ columns = 12, spacing = 2, component, ...rest }, ref) {
  return <GridRoot as={component} ref={ref as never} $columns={columns} $spacing={spacing} {...rest} />;
});

export interface GridItemProps extends HTMLAttributes<HTMLElement>, SxProp {
  /** How many columns the item covers, optionally per breakpoint. */
  span?: Responsive<number>;
  /** Element or component to render. Defaults to `div`. */
  component?: ElementType;
}

const GridItemRoot = styled.div<SxProp & { $span: Responsive<number> }>(
  ({ theme, $span }) => ({
    minWidth: 0,
    ...responsive(theme, $span, (count) => ({ gridColumn: `span ${count} / span ${count}` })),
  }),
  applySx,
);

/** A cell of a `Grid`. */
export const GridItem = forwardRef<HTMLElement, GridItemProps>(function GridItem({ span = 1, component, ...rest }, ref) {
  return <GridItemRoot as={component} ref={ref as never} $span={span} {...rest} />;
});
