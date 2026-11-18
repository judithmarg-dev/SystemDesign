import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { forwardRef } from 'react';
import type { HTMLAttributes } from 'react';
import { Character, applySx, glass, reducedMotion, transition } from '@core';
import type { CharacterName, ColorName, Size, SxProp } from '@core';
import { clamp } from '@shared';

export interface LinearProgressProps extends Omit<HTMLAttributes<HTMLDivElement>, 'color'>, SxProp {
  /** Progress from `min` to `max`. Leave undefined for an indeterminate bar. */
  value?: number;
  min?: number;
  max?: number;
  color?: ColorName;
  /** Track thickness. */
  size?: Size;
  /** A character whose head rides the leading end of the bar. Determinate mode only. */
  character?: CharacterName | boolean;
}

const HEIGHT: Record<Size, number> = { sm: 6, md: 10, lg: 14 };

const slide = keyframes({
  '0%': { transform: 'translateX(-100%)' },
  '100%': { transform: 'translateX(250%)' },
});

const Root = styled.div<SxProp & { $height: number; $rider: number }>(
  ({ $height, $rider }) => ({
    position: 'relative',
    width: '100%',
    height: $height,
    // Keeps the rider's head from overlapping whatever sits above and below the bar.
    margin: $rider ? `${($rider - $height) / 2}px 0` : undefined,
  }),
  applySx,
);

const Track = styled.div(({ theme }) => ({
  position: 'absolute',
  inset: 0,
  overflow: 'hidden',
  borderRadius: theme.shape.radius.pill,
  ...glass(theme, { blur: 'sm', tint: 'subtle' }),
}));

const Bar = styled.div<{ $color: ColorName; $indeterminate: boolean }>(({ theme, $color, $indeterminate }) => {
  const c = theme.palette[$color];
  return {
    height: '100%',
    borderRadius: theme.shape.radius.pill,
    background: `linear-gradient(90deg, ${c.light}, ${c.main})`,
    boxShadow: 'inset 0 1px 0 rgba(255, 255, 255, 0.5)',
    transition: transition(theme, ['width'], { duration: 'medium' }),
    ...($indeterminate && {
      width: '40%',
      animation: `${slide} 1.6s ${theme.motion.easing.standard} infinite`,
    }),
    // Without motion, an indeterminate bar becomes a static, dimmed full bar.
    [reducedMotion]: $indeterminate ? { animation: 'none', width: '100%', opacity: 0.6 } : { transition: 'none' },
  };
});

const Rider = styled.span<{ $size: number }>(({ theme, $size }) => ({
  position: 'absolute',
  top: '50%',
  width: $size,
  height: $size,
  margin: -$size / 2,
  pointerEvents: 'none',
  transition: transition(theme, ['left'], { duration: 'medium' }),
  [reducedMotion]: { transition: 'none' },
}));

/** A horizontal progress bar on a glass track. */
export const LinearProgress = forwardRef<HTMLDivElement, LinearProgressProps>(function LinearProgress(
  { value, min = 0, max = 100, color = 'primary', size = 'md', character = false, ...rest },
  ref,
) {
  const determinate = value !== undefined;
  const current = determinate ? clamp(value, min, max) : undefined;
  const percent = determinate && max > min ? ((current! - min) / (max - min)) * 100 : 0;
  const height = HEIGHT[size];
  const riderSize = determinate && character ? Math.round(height * 2.8) : 0;

  return (
    <Root
      ref={ref}
      role="progressbar"
      aria-valuemin={determinate ? min : undefined}
      aria-valuemax={determinate ? max : undefined}
      aria-valuenow={current}
      $height={height}
      $rider={riderSize}
      {...rest}
    >
      <Track>
        <Bar $color={color} $indeterminate={!determinate} style={determinate ? { width: `${percent}%` } : undefined} />
      </Track>
      {riderSize > 0 && (
        <Rider $size={riderSize} style={{ left: `${percent}%` }} aria-hidden>
          <Character
            name={character === true ? undefined : (character as CharacterName)}
            size={riderSize}
            mood={percent >= 100 ? 'happy' : 'neutral'}
          />
        </Rider>
      )}
    </Root>
  );
});
