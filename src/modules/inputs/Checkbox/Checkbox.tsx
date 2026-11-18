import styled from '@emotion/styled';
import { forwardRef, useEffect, useRef } from 'react';
import type { InputHTMLAttributes, ReactNode } from 'react';
import { focusRing, reducedMotion, transition } from '@core';
import type { ColorName, SxProp } from '@core';
import { mergeRefs } from '@shared';
import { ChoiceControl, ChoiceInput, ChoiceRoot } from '../internal/choice';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'>, SxProp {
  /** Text next to the box. Without it, pass `aria-label`. */
  label?: ReactNode;
  color?: ColorName;
  /** Shows a dash: neither checked nor unchecked (e.g. a partially selected group). */
  indeterminate?: boolean;
}

const Box = styled.span<{ $color: ColorName }>(({ theme, $color }) => {
  const c = theme.palette[$color];
  return {
    display: 'grid',
    placeItems: 'center',
    width: 24,
    height: 24,
    borderRadius: theme.shape.radius.xs,
    border: `2px solid ${theme.palette.text.secondary}`,
    background: theme.glass.tint.regular,
    color: c.contrastText,
    transition: transition(theme, ['background-color', 'border-color', 'transform'], { easing: 'bounce' }),
    [reducedMotion]: { transition: 'none', '& > svg': { transition: 'none' } },
    '& > svg': {
      gridArea: '1 / 1',
      width: 16,
      height: 16,
      transform: 'scale(0)',
      transition: transition(theme, ['transform'], { duration: 'medium', easing: 'bounce' }),
    },
    'input:checked + &, input:indeterminate + &': {
      background: `linear-gradient(180deg, ${c.light} -40%, ${c.main} 70%)`,
      borderColor: c.dark,
    },
    'input:checked:not(:indeterminate) + & > .mochi-paw': { transform: 'scale(1)' },
    'input:indeterminate + & > .mochi-dash': { transform: 'scale(1)' },
    'input:active:not(:disabled) + &': { transform: 'scale(0.88)' },
    'input:focus-visible + &': focusRing(theme),
    'input:disabled + &': {
      borderColor: theme.palette.action.disabled,
      background: theme.palette.action.disabledBackground,
      color: theme.palette.action.disabled,
    },
  };
});

/** A checkbox whose check mark is a paw print. */
export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, color = 'primary', indeterminate = false, disabled = false, className, style, sx, ...rest },
  ref,
) {
  const inputRef = useRef<HTMLInputElement>(null);

  // `indeterminate` only exists as a DOM property, not as an attribute.
  useEffect(() => {
    if (inputRef.current) inputRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <ChoiceRoot $disabled={disabled} className={className} style={style} sx={sx}>
      <ChoiceControl>
        <ChoiceInput ref={mergeRefs(ref, inputRef)} type="checkbox" disabled={disabled} {...rest} />
        <Box $color={color} aria-hidden>
          <svg className="mochi-paw" viewBox="0 0 24 24" fill="currentColor" focusable="false">
            <ellipse cx="12" cy="16.2" rx="5.4" ry="4.4" />
            <ellipse cx="4.9" cy="10.6" rx="2" ry="2.5" />
            <ellipse cx="9.4" cy="6" rx="2" ry="2.6" />
            <ellipse cx="14.6" cy="6" rx="2" ry="2.6" />
            <ellipse cx="19.1" cy="10.6" rx="2" ry="2.5" />
          </svg>
          <svg className="mochi-dash" viewBox="0 0 24 24" focusable="false">
            <path d="M6 12h12" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round" />
          </svg>
        </Box>
      </ChoiceControl>
      {label}
    </ChoiceRoot>
  );
});
