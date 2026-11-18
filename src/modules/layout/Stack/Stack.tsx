import styled from '@emotion/styled';
import { Children, Fragment, forwardRef } from 'react';
import type { CSSProperties, ElementType, HTMLAttributes, ReactNode } from 'react';
import { applySx } from '@core';
import type { SxProp } from '@core';

export interface StackProps extends HTMLAttributes<HTMLElement>, SxProp {
  direction?: 'row' | 'column' | 'row-reverse' | 'column-reverse';
  /** Gap between children, in spacing units. */
  spacing?: number;
  align?: CSSProperties['alignItems'];
  justify?: CSSProperties['justifyContent'];
  /** Lets children wrap onto several lines. */
  wrap?: boolean;
  /** Element inserted between each pair of children. */
  divider?: ReactNode;
  /** Element or component to render. Defaults to `div`. */
  component?: ElementType;
}

interface RootProps extends SxProp {
  $direction: NonNullable<StackProps['direction']>;
  $spacing: number;
  $align: StackProps['align'];
  $justify: StackProps['justify'];
  $wrap: boolean;
}

const Root = styled.div<RootProps>(
  ({ theme, $direction, $spacing, $align, $justify, $wrap }) => ({
    display: 'flex',
    flexDirection: $direction,
    gap: theme.spacing($spacing),
    alignItems: $align,
    justifyContent: $justify,
    flexWrap: $wrap ? 'wrap' : 'nowrap',
    minWidth: 0,
  }),
  applySx,
);

/** Lays children out in one direction with even spacing. */
export const Stack = forwardRef<HTMLElement, StackProps>(function Stack(
  { direction = 'column', spacing = 2, align, justify, wrap = false, divider, component, children, ...rest },
  ref,
) {
  return (
    <Root
      as={component}
      ref={ref as never}
      $direction={direction}
      $spacing={spacing}
      $align={align}
      $justify={justify}
      $wrap={wrap}
      {...rest}
    >
      {divider
        ? Children.toArray(children).map((child, index) => (
            <Fragment key={index}>
              {index > 0 && divider}
              {child}
            </Fragment>
          ))
        : children}
    </Root>
  );
});
