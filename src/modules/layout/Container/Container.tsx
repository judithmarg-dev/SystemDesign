import styled from '@emotion/styled';
import { forwardRef } from 'react';
import type { ElementType, HTMLAttributes } from 'react';
import { applySx } from '@core';
import type { Breakpoint, SxProp } from '@core';

export interface ContainerProps extends HTMLAttributes<HTMLElement>, SxProp {
  /** Widest the content may get, as a breakpoint. `false` lets it fill the viewport. */
  maxWidth?: Exclude<Breakpoint, 'xs'> | false;
  /** Removes the side padding. */
  disableGutters?: boolean;
  /** Element or component to render. Defaults to `div`. */
  component?: ElementType;
}

const Root = styled.div<SxProp & { $maxWidth: ContainerProps['maxWidth']; $gutters: boolean }>(
  ({ theme, $maxWidth, $gutters }) => ({
    width: '100%',
    marginInline: 'auto',
    maxWidth: $maxWidth ? theme.breakpoints.values[$maxWidth] : undefined,
    ...($gutters && {
      paddingInline: theme.spacing(2),
      [theme.breakpoints.up('sm')]: { paddingInline: theme.spacing(3) },
    }),
  }),
  applySx,
);

/** Centers page content horizontally and caps its width. */
export const Container = forwardRef<HTMLElement, ContainerProps>(function Container(
  { maxWidth = 'lg', disableGutters = false, component, ...rest },
  ref,
) {
  return <Root as={component} ref={ref as never} $maxWidth={maxWidth} $gutters={!disableGutters} {...rest} />;
});
