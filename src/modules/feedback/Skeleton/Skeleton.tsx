import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { applySx, reducedMotion } from '@core';
import type { SxProp } from '@core';

export type SkeletonVariant = 'text' | 'circular' | 'rounded';

export interface SkeletonProps extends HTMLAttributes<HTMLSpanElement>, SxProp {
  /** `text` matches a line of text, `circular` an avatar, `rounded` a block such as an image or card. */
  variant?: SkeletonVariant;
  /** Number is px; strings are used as-is. */
  width?: number | string;
  /** Number is px; strings are used as-is. */
  height?: number | string;
  /** Disables the shimmer. */
  disableAnimation?: boolean;
}

const shimmer = keyframes({
  from: { backgroundPosition: '200% 0' },
  to: { backgroundPosition: '-200% 0' },
});

const Root = styled.span<SxProp & { $variant: SkeletonVariant; $animated: boolean }>(
  ({ theme, $variant, $animated }) => ({
    display: 'block',
    backgroundColor: theme.palette.action.disabledBackground,
    ...($variant === 'text' && { height: '1.1em', margin: '0.25em 0', borderRadius: theme.shape.radius.xs }),
    ...($variant === 'circular' && { borderRadius: '50%' }),
    ...($variant === 'rounded' && { borderRadius: theme.shape.radius.md }),
    ...($animated && {
      backgroundImage: `linear-gradient(100deg, transparent 30%, ${theme.glass.tint.strong} 50%, transparent 70%)`,
      backgroundSize: '200% 100%',
      backgroundRepeat: 'no-repeat',
      animation: `${shimmer} 1.8s ${theme.motion.easing.standard} infinite`,
      [reducedMotion]: { animation: 'none', backgroundImage: 'none' },
    }),
  }),
  applySx,
);

/** A placeholder shown while content loads. Decorative: pair it with `aria-busy` on the loading region. */
export const Skeleton = forwardRef<HTMLSpanElement, SkeletonProps>(function Skeleton(
  { variant = 'text', width, height, disableAnimation = false, style, ...rest },
  ref,
) {
  const circularSize = variant === 'circular' ? (width ?? height ?? 40) : undefined;
  return (
    <Root
      ref={ref}
      aria-hidden
      $variant={variant}
      $animated={!disableAnimation}
      style={{ width: width ?? circularSize, height: height ?? circularSize, ...style }}
      {...rest}
    />
  );
});
