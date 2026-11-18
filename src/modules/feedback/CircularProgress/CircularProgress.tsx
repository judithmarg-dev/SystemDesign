import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { forwardRef } from 'react';
import type { HTMLAttributes, ReactNode } from 'react';
import { Character, applySx, reducedMotion, transition } from '@core';
import type { CharacterName, ColorName, SxProp } from '@core';
import { clamp } from '@shared';

export interface CircularProgressProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'color'>, SxProp {
  /** Progress from 0 to 100. Leave undefined for an indeterminate spinner. */
  value?: number;
  /** Diameter in px. */
  size?: number;
  /** Ring thickness in px. */
  thickness?: number;
  color?: ColorName;
  /** A character shown inside the ring. `true` uses `theme.character.default`. */
  character?: CharacterName | boolean;
  /** Custom content centered inside the ring, e.g. a percentage. Takes precedence over `character`. */
  children?: ReactNode;
}

const spin = keyframes({ to: { transform: 'rotate(360deg)' } });

const Root = styled.span<SxProp & { $size: number }>(
  ({ theme, $size }) => ({
    position: 'relative',
    display: 'inline-grid',
    placeItems: 'center',
    flexShrink: 0,
    width: $size,
    height: $size,
    color: theme.palette.text.primary,
    ...theme.typography.caption,
  }),
  applySx,
);

const Ring = styled.svg<{ $indeterminate: boolean }>(({ $indeterminate }) => ({
  position: 'absolute',
  inset: 0,
  // Start the arc at 12 o'clock.
  transform: 'rotate(-90deg)',
  ...($indeterminate && {
    animation: `${spin} 1.1s linear infinite`,
    // A spinner that does not move looks broken, so it only slows down.
    [reducedMotion]: { animationDuration: '4s' },
  }),
}));

const Track = styled.circle<{ $color: ColorName }>(({ theme, $color }) => ({
  fill: 'none',
  stroke: theme.palette[$color].soft,
}));

const Indicator = styled.circle<{ $color: ColorName }>(({ theme, $color }) => ({
  fill: 'none',
  stroke: theme.palette[$color].main,
  strokeLinecap: 'round',
  transition: transition(theme, ['stroke-dashoffset'], { duration: 'medium' }),
  [reducedMotion]: { transition: 'none' },
}));

const Center = styled.span({ position: 'relative', display: 'inline-flex' });

/** A ring-shaped progress indicator, with room for a character or a label in the middle. */
export const CircularProgress = forwardRef<HTMLSpanElement, CircularProgressProps>(function CircularProgress(
  { value, size = 44, thickness = 4, color = 'primary', character = false, children, ...rest },
  ref,
) {
  const determinate = value !== undefined;
  const current = determinate ? clamp(value, 0, 100) : undefined;
  const radius = (size - thickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = determinate ? current! / 100 : 0.28;
  const circle = { cx: size / 2, cy: size / 2, r: radius, strokeWidth: thickness };
  const inner = Math.round((size - thickness * 2) * 0.78);

  return (
    <Root
      ref={ref}
      role="progressbar"
      aria-valuemin={determinate ? 0 : undefined}
      aria-valuemax={determinate ? 100 : undefined}
      aria-valuenow={current}
      $size={size}
      {...rest}
    >
      <Ring viewBox={`0 0 ${size} ${size}`} width={size} height={size} $indeterminate={!determinate} aria-hidden focusable="false">
        <Track $color={color} {...circle} />
        <Indicator
          $color={color}
          {...circle}
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - filled)}
        />
      </Ring>
      {children !== undefined ? (
        <Center>{children}</Center>
      ) : (
        character && (
          <Center aria-hidden>
            <Character
              name={character === true ? undefined : character}
              size={inner}
              mood={current === 100 ? 'happy' : 'neutral'}
            />
          </Center>
        )
      )}
    </Root>
  );
});
