import styled from '@emotion/styled';
import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { applySx, reducedMotion, transition } from '@core';
import type { ColorName, SxProp } from '@core';

export interface BadgeProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'content'>, SxProp {
  /** The element the badge is attached to. */
  children?: ReactNode;
  /** What the badge shows. Numbers above `max` are shown as `max+`. */
  content?: ReactNode;
  /** Highest number displayed. */
  max?: number;
  /** Shows a small dot instead of content. */
  dot?: boolean;
  color?: ColorName;
  /** Hides the badge. */
  invisible?: boolean;
  /** Shows the badge when `content` is `0`. */
  showZero?: boolean;
}

const Root = styled.span<SxProp>(
  { position: 'relative', display: 'inline-flex', flexShrink: 0, verticalAlign: 'middle' },
  applySx,
);

const Bubble = styled.span<{ $color: ColorName; $dot: boolean; $hidden: boolean }>(
  ({ theme, $color, $dot, $hidden }) => ({
    position: 'absolute',
    top: 0,
    insetInlineEnd: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxSizing: 'border-box',
    minWidth: $dot ? 12 : 22,
    height: $dot ? 12 : 22,
    padding: $dot ? 0 : '0 6px',
    borderRadius: theme.shape.radius.pill,
    border: `2px solid ${theme.glass.border}`,
    background: theme.palette[$color].main,
    color: theme.palette[$color].contrastText,
    fontFamily: theme.typography.fontFamily,
    fontSize: '0.6875rem',
    fontWeight: 800,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    boxShadow: theme.shadows[1],
    transform: `translate(40%, -40%) scale(${$hidden ? 0 : 1})`,
    '[dir="rtl"] &': { transform: `translate(-40%, -40%) scale(${$hidden ? 0 : 1})` },
    transition: transition(theme, ['transform'], { duration: 'medium', easing: 'bounce' }),
    [reducedMotion]: { transition: 'none' },
  }),
);

/** A small counter or status dot pinned to the top-end corner of its child. */
export const Badge = forwardRef<HTMLSpanElement, BadgeProps>(function Badge(
  { children, content, max = 99, dot = false, color = 'error', invisible = false, showZero = false, ...rest },
  ref,
) {
  const empty = content == null || content === false || content === '';
  const hidden = invisible || (!dot && (empty || (content === 0 && !showZero)));
  const display = typeof content === 'number' && content > max ? `${max}+` : content;

  return (
    <Root ref={ref} {...rest}>
      {children}
      <Bubble $color={color} $dot={dot} $hidden={hidden} aria-hidden={hidden || undefined}>
        {!dot && !hidden && display}
      </Bubble>
    </Root>
  );
});
