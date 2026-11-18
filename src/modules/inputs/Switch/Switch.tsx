import styled from '@emotion/styled';
import { forwardRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { Character, focusRing, glass, reducedMotion, transition, useTheme } from '@core';
import type { CharacterName, ColorName, SxProp } from '@core';
import { useControlled } from '@shared';
import { ChoiceControl, ChoiceInput, ChoiceRoot } from '../internal/choice';

export interface SwitchProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'role'>, SxProp {
  /** Text next to the switch. Without it, pass `aria-label`. */
  label?: ReactNode;
  color?: ColorName;
  size?: 'sm' | 'md';
  /**
   * Character used as the thumb: asleep when off, happy when on.
   * `true` uses `theme.character.default`; `false` renders a plain knob.
   */
  character?: CharacterName | boolean;
}

const TRACK = { sm: { width: 42, height: 22 }, md: { width: 54, height: 28 } } as const;
/** How far the character head sticks out of the track on each side. */
const OVERHANG = 5;

const Track = styled.span<{ $color: ColorName; $size: 'sm' | 'md'; $checked: boolean }>(
  ({ theme, $color, $size, $checked }) => {
    const c = theme.palette[$color];
    return {
      position: 'relative',
      display: 'block',
      width: TRACK[$size].width,
      height: TRACK[$size].height,
      borderRadius: theme.shape.radius.pill,
      ...glass(theme, { blur: 'sm', tint: 'regular' }),
      ...($checked && {
        background: `linear-gradient(180deg, ${c.main}, ${c.light})`,
        borderColor: c.dark,
        boxShadow: `inset 0 2px 3px ${theme.palette.action.selected}`,
      }),
      transition: transition(theme, ['background-color', 'border-color']),
      [reducedMotion]: { transition: 'none' },
      'input:focus-visible + &': focusRing(theme),
      'input:disabled + &': {
        background: theme.palette.action.disabledBackground,
        borderColor: 'transparent',
        boxShadow: 'none',
        backdropFilter: 'none',
        filter: 'grayscale(0.6)',
        opacity: 0.7,
      },
    };
  },
);

const Thumb = styled.span<{ $size: 'sm' | 'md'; $checked: boolean; $plain: boolean }>(({ theme, $size, $checked, $plain }) => {
  const { width, height } = TRACK[$size];
  const size = $plain ? height - 8 : height + OVERHANG * 2;
  const inset = $plain ? 3 : -OVERHANG;
  return {
    position: 'absolute',
    top: '50%',
    left: inset,
    width: size,
    height: size,
    marginTop: -size / 2 - 1,
    display: 'grid',
    placeItems: 'center',
    transform: `translateX(${$checked ? width - size - inset * 2 - 2 : 0}px)`,
    transition: transition(theme, ['transform'], { duration: 'medium', easing: 'bounce' }),
    [reducedMotion]: { transition: 'none' },
    filter: `drop-shadow(${theme.shadows[1].split(', ')[0]})`,
    ...($plain && {
      borderRadius: '50%',
      background: theme.palette.background.paper,
      boxShadow: theme.shadows[1],
      filter: 'none',
    }),
  };
});

/** An on/off toggle. Its thumb is a character that wakes up when the switch is turned on. */
export const Switch = forwardRef<HTMLInputElement, SwitchProps>(function Switch(
  {
    label,
    color = 'primary',
    size = 'md',
    character = true,
    checked: checkedProp,
    defaultChecked,
    onChange,
    disabled = false,
    className,
    style,
    sx,
    ...rest
  },
  ref,
) {
  const theme = useTheme();
  const [checked, setChecked] = useControlled(checkedProp, defaultChecked ?? false);
  const name = character === true ? theme.character.default : character;

  return (
    <ChoiceRoot $disabled={disabled} className={className} style={style} sx={sx}>
      <ChoiceControl>
        <ChoiceInput
          ref={ref}
          type="checkbox"
          role="switch"
          checked={checked}
          disabled={disabled}
          onChange={(event) => {
            setChecked(event.target.checked);
            onChange?.(event);
          }}
          {...rest}
        />
        <Track $color={color} $size={size} $checked={checked} aria-hidden>
          <Thumb $size={size} $checked={checked} $plain={!name}>
            {name && (
              <Character name={name} size={TRACK[size].height + OVERHANG * 2} mood={checked ? 'happy' : 'sleepy'} animated={false} />
            )}
          </Thumb>
        </Track>
      </ChoiceControl>
      {label}
    </ChoiceRoot>
  );
});
