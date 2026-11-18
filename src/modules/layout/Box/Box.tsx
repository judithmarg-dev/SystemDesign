import styled from '@emotion/styled';
import { forwardRef } from 'react';
import type { ElementType, HTMLAttributes } from 'react';
import { applySx } from '@core';
import type { SxProp } from '@core';

export interface BoxProps extends HTMLAttributes<HTMLElement>, SxProp {
  /** Element or component to render. Defaults to `div`. */
  component?: ElementType;
}

const BoxRoot = styled.div<SxProp>(applySx);

/** The layout primitive: any element, styled through `sx`. */
export const Box = forwardRef<HTMLElement, BoxProps>(function Box({ component, ...rest }, ref) {
  return <BoxRoot as={component} ref={ref as never} {...rest} />;
});
