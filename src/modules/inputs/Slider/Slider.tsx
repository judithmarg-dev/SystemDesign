import styled from '@emotion/styled';
import { forwardRef, useRef, useState } from 'react';
import type { HTMLAttributes, KeyboardEvent, PointerEvent as ReactPointerEvent, ReactNode } from 'react';
import { Character, applySx, focusRing, glass, reducedMotion, transition, useTheme } from '@core';
import type { CharacterName, ColorName, SxProp } from '@core';
import { clamp, mergeRefs, useControlled } from '@shared';

export interface SliderMark {
  value: number;
  label?: ReactNode;
}

export type SliderValueLabelDisplay = 'auto' | 'on' | 'off';

export interface SliderProps
  extends Omit<HTMLAttributes<HTMLSpanElement>, 'onChange' | 'defaultValue' | 'color'>,
    SxProp {
  /** Current value (controlled). */
  value?: number;
  /** Initial value (uncontrolled). Defaults to `min`. */
  defaultValue?: number;
  /** Called while the value changes, on every step. */
  onChange?: (value: number) => void;
  /** Called once the user releases the thumb or finishes a keyboard change. */
  onChangeCommitted?: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
  /** Ticks along the track. `true` adds one per step. */
  marks?: boolean | SliderMark[];
  /** When to show the value bubble above the thumb: `auto` shows it while hovering, focusing or dragging. */
  valueLabelDisplay?: SliderValueLabelDisplay;
  /** Formats the value in the bubble and in `aria-valuetext`. */
  valueLabelFormat?: (value: number) => string;
  disabled?: boolean;
  color?: ColorName;
  size?: 'sm' | 'md';
  /** A character used as the thumb. `true` uses `theme.character.default`. */
  character?: CharacterName | boolean;
  /** Name of a hidden input, so the slider takes part in form submissions. */
  name?: string;
}

const TRACK_HEIGHT = { sm: 6, md: 8 } as const;
const THUMB = { sm: 18, md: 22 } as const;
const CHARACTER_THUMB = { sm: 28, md: 34 } as const;

const decimals = (step: number) => {
  const text = String(step);
  return text.includes('.') ? text.split('.')[1]!.length : 0;
};

/** Snaps `value` to the nearest step, counting from `min`. */
const snap = (value: number, min: number, max: number, step: number) => {
  const snapped = Math.round((value - min) / step) * step + min;
  return clamp(Number(snapped.toFixed(decimals(step))), min, max);
};

const percent = (value: number, min: number, max: number) => (max === min ? 0 : ((value - min) / (max - min)) * 100);

const Root = styled.span<SxProp & { $size: 'sm' | 'md'; $disabled: boolean; $hasLabels: boolean }>(
  ({ theme, $size, $disabled, $hasLabels }) => ({
    position: 'relative',
    display: 'block',
    width: '100%',
    minWidth: 120,
    height: CHARACTER_THUMB[$size],
    marginBottom: $hasLabels ? theme.spacing(3) : 0,
    touchAction: 'none',
    cursor: $disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
    fontFamily: theme.typography.fontFamily,
    ...($disabled && { filter: 'grayscale(0.7)', opacity: 0.6 }),
  }),
  applySx,
);

const Rail = styled.span<{ $size: 'sm' | 'md' }>(({ theme, $size }) => ({
  position: 'absolute',
  top: '50%',
  left: 0,
  right: 0,
  height: TRACK_HEIGHT[$size],
  marginTop: -TRACK_HEIGHT[$size] / 2,
  borderRadius: theme.shape.radius.pill,
  ...glass(theme, { blur: 'sm', tint: 'regular' }),
}));

const Fill = styled.span<{ $size: 'sm' | 'md'; $color: ColorName }>(({ theme, $size, $color }) => {
  const c = theme.palette[$color];
  return {
    position: 'absolute',
    top: '50%',
    insetInlineStart: 0,
    height: TRACK_HEIGHT[$size],
    marginTop: -TRACK_HEIGHT[$size] / 2,
    borderRadius: theme.shape.radius.pill,
    background: `linear-gradient(90deg, ${c.light}, ${c.main})`,
    boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.45)`,
  };
});

const Mark = styled.span<{ $active: boolean; $color: ColorName }>(({ theme, $active, $color }) => ({
  position: 'absolute',
  top: '50%',
  width: 4,
  height: 4,
  marginTop: -2,
  marginInlineStart: -2,
  borderRadius: '50%',
  background: $active ? theme.palette[$color].contrastText : theme.palette.text.disabled,
  opacity: 0.8,
}));

const MarkLabel = styled.span(({ theme }) => ({
  position: 'absolute',
  top: '100%',
  transform: 'translateX(-50%)',
  marginTop: theme.spacing(0.5),
  ...theme.typography.caption,
  color: theme.palette.text.secondary,
  whiteSpace: 'nowrap',
  '[dir="rtl"] &': { transform: 'translateX(50%)' },
}));

const Thumb = styled.span<{ $size: 'sm' | 'md'; $color: ColorName; $plain: boolean; $dragging: boolean }>(
  ({ theme, $size, $color, $plain, $dragging }) => {
    const c = theme.palette[$color];
    const size = $plain ? THUMB[$size] : CHARACTER_THUMB[$size];
    return {
      position: 'absolute',
      top: '50%',
      width: size,
      height: size,
      marginTop: -size / 2,
      marginInlineStart: -size / 2,
      display: 'grid',
      placeItems: 'center',
      borderRadius: '50%',
      outline: 'none',
      transform: $dragging ? 'scale(1.12)' : 'none',
      transition: transition(theme, ['transform', 'box-shadow'], { easing: 'bounce' }),
      [reducedMotion]: { transition: 'none' },
      ...($plain
        ? {
            ...glass(theme, { blur: 'sm', tint: 'strong', elevation: 2 }),
            border: `2px solid ${c.main}`,
          }
        : { filter: `drop-shadow(${theme.shadows[1].split(', ')[0]})` }),
      '&:hover': { transform: 'scale(1.08)' },
      '&:focus-visible': { ...focusRing(theme), outlineOffset: 3 },
      '[aria-disabled="true"] > &': { cursor: 'not-allowed', transform: 'none' },
    };
  },
);

const ValueLabel = styled.span<{ $visible: boolean }>(({ theme, $visible }) => ({
  position: 'absolute',
  bottom: '100%',
  left: '50%',
  marginBottom: theme.spacing(0.75),
  padding: `${theme.spacing(0.25)} ${theme.spacing(1)}`,
  borderRadius: theme.shape.radius.sm,
  ...glass(theme, { blur: 'md', tint: 'strong', elevation: 2 }),
  color: theme.palette.text.primary,
  fontSize: '0.75rem',
  fontWeight: 800,
  whiteSpace: 'nowrap',
  pointerEvents: 'none',
  // Transform only, so the glass keeps its blur while it pops in.
  transform: `translateX(-50%) scale(${$visible ? 1 : 0})`,
  transformOrigin: 'bottom center',
  transition: transition(theme, ['transform'], { easing: 'bounce' }),
  [reducedMotion]: { transition: 'none' },
}));

/**
 * Picks a number from a range by dragging a thumb along a glass track.
 * Arrow keys move one step, PageUp/PageDown ten steps, Home/End jump to the ends.
 */
export const Slider = forwardRef<HTMLSpanElement, SliderProps>(function Slider(
  {
    value: valueProp,
    defaultValue,
    onChange,
    onChangeCommitted,
    min = 0,
    max = 100,
    step = 1,
    marks = false,
    valueLabelDisplay = 'auto',
    valueLabelFormat = String,
    disabled = false,
    color = 'primary',
    size = 'md',
    character = false,
    name,
    'aria-label': ariaLabel,
    'aria-labelledby': ariaLabelledBy,
    'aria-valuetext': ariaValueText,
    onPointerDown,
    ...rest
  },
  ref,
) {
  const theme = useTheme();
  const rootRef = useRef<HTMLSpanElement>(null);
  const [value, setValueState] = useControlled(valueProp, clamp(defaultValue ?? min, min, max));
  const [dragging, setDragging] = useState(false);
  const [active, setActive] = useState(false);
  const latest = useRef(value);
  latest.current = value;

  const characterName = character === true ? theme.character.default : character;
  const current = clamp(value, min, max);
  const position = percent(current, min, max);

  const change = (next: number) => {
    const snapped = snap(next, min, max, step);
    if (snapped === latest.current) return snapped;
    latest.current = snapped;
    setValueState(snapped);
    onChange?.(snapped);
    return snapped;
  };

  const valueFromPointer = (clientX: number) => {
    const node = rootRef.current;
    if (!node) return current;
    const rect = node.getBoundingClientRect();
    if (rect.width === 0) return current;
    const rtl = getComputedStyle(node).direction === 'rtl';
    let ratio = (clientX - rect.left) / rect.width;
    if (rtl) ratio = 1 - ratio;
    return min + clamp(ratio, 0, 1) * (max - min);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLSpanElement>) => {
    onPointerDown?.(event);
    if (disabled || event.button !== 0 || event.defaultPrevented) return;
    event.preventDefault();
    event.currentTarget.setPointerCapture?.(event.pointerId);
    setDragging(true);
    change(valueFromPointer(event.clientX));
    event.currentTarget.querySelector<HTMLElement>('[role="slider"]')?.focus();
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (!dragging) return;
    change(valueFromPointer(event.clientX));
  };

  const endDrag = () => {
    if (!dragging) return;
    setDragging(false);
    onChangeCommitted?.(latest.current);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLSpanElement>) => {
    if (disabled) return;
    const rtl = getComputedStyle(event.currentTarget).direction === 'rtl';
    const big = Math.max(step, (max - min) / 10);
    let next: number;
    switch (event.key) {
      case 'ArrowUp':
        next = current + step;
        break;
      case 'ArrowDown':
        next = current - step;
        break;
      case 'ArrowRight':
        next = current + (rtl ? -step : step);
        break;
      case 'ArrowLeft':
        next = current + (rtl ? step : -step);
        break;
      case 'PageUp':
        next = current + big;
        break;
      case 'PageDown':
        next = current - big;
        break;
      case 'Home':
        next = min;
        break;
      case 'End':
        next = max;
        break;
      default:
        return;
    }
    event.preventDefault();
    const committed = change(next);
    onChangeCommitted?.(committed);
  };

  const markList: SliderMark[] =
    marks === true
      ? Array.from({ length: Math.floor((max - min) / step) + 1 }, (_, i) => ({ value: snap(min + i * step, min, max, step) }))
      : marks || [];
  const hasLabels = markList.some((mark) => mark.label !== undefined && mark.label !== null);
  const showLabel = valueLabelDisplay === 'on' || (valueLabelDisplay === 'auto' && (active || dragging));
  const text = valueLabelFormat(current);

  return (
    <Root
      ref={mergeRefs(ref, rootRef)}
      $size={size}
      $disabled={disabled}
      $hasLabels={hasLabels}
      aria-disabled={disabled || undefined}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={endDrag}
      onPointerCancel={endDrag}
      onLostPointerCapture={endDrag}
      {...rest}
    >
      <Rail $size={size} aria-hidden />
      <Fill $size={size} $color={color} style={{ width: `${position}%` }} aria-hidden />
      {markList.map((mark) => {
        const at = percent(clamp(mark.value, min, max), min, max);
        return (
          <span key={mark.value} aria-hidden>
            <Mark $active={mark.value <= current} $color={color} style={{ insetInlineStart: `${at}%` }} />
            {mark.label !== undefined && <MarkLabel style={{ insetInlineStart: `${at}%` }}>{mark.label}</MarkLabel>}
          </span>
        );
      })}
      <Thumb
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={current}
        aria-valuetext={ariaValueText ?? (valueLabelFormat === String ? undefined : text)}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledBy}
        aria-orientation="horizontal"
        aria-disabled={disabled || undefined}
        $size={size}
        $color={color}
        $plain={!characterName}
        $dragging={dragging}
        style={{ insetInlineStart: `${position}%` }}
        onKeyDown={handleKeyDown}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
        onPointerEnter={() => setActive(true)}
        onPointerLeave={() => setActive(false)}
      >
        {characterName && (
          <Character
            name={characterName}
            size={CHARACTER_THUMB[size]}
            mood={disabled ? 'sleepy' : dragging ? 'surprised' : current === max ? 'happy' : 'neutral'}
            animated={false}
          />
        )}
        {valueLabelDisplay !== 'off' && (
          <ValueLabel $visible={showLabel} aria-hidden>
            {text}
          </ValueLabel>
        )}
      </Thumb>
      {name && <input type="hidden" name={name} value={current} />}
    </Root>
  );
});
