import styled from '@emotion/styled';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { Character, applySx, focusRing, getCharacter, glass, reducedMotion, transition, useTheme } from '@core';
import type { CharacterName, ColorName, Size, SxProp } from '@core';

export type ButtonVariant = 'filled' | 'glass' | 'outlined' | 'text';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, SxProp {
  variant?: ButtonVariant;
  color?: ColorName;
  size?: Size;
  fullWidth?: boolean;
  startIcon?: ReactNode;
  endIcon?: ReactNode;
  /** A character peeking over the button. `true` uses `theme.character.default`. */
  character?: CharacterName | boolean;
}

const HEIGHT: Record<Size, number> = { sm: 34, md: 42, lg: 52 };
const PADDING: Record<Size, number> = { sm: 14, md: 20, lg: 28 };
const FONT: Record<Size, string> = { sm: '0.8125rem', md: '0.9375rem', lg: '1.0625rem' };

interface RootProps extends SxProp {
  $variant: ButtonVariant;
  $color: ColorName;
  $size: Size;
  $fullWidth: boolean;
}

const Root = styled.button<RootProps>(
  ({ theme, $variant, $color, $size, $fullWidth }) => {
    const c = theme.palette[$color];
    const onSurface = theme.mode === 'dark' ? c.light : c.dark;
    return {
      position: 'relative',
      isolation: 'isolate',
      display: $fullWidth ? 'flex' : 'inline-flex',
      width: $fullWidth ? '100%' : undefined,
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing(1),
      minHeight: HEIGHT[$size],
      padding: `0 ${PADDING[$size]}px`,
      border: '1px solid transparent',
      borderRadius: theme.shape.radius.pill,
      fontFamily: theme.typography.fontFamily,
      ...theme.typography.button,
      fontSize: FONT[$size],
      cursor: 'pointer',
      userSelect: 'none',
      textDecoration: 'none',
      WebkitTapHighlightColor: 'transparent',
      transition: transition(theme, ['transform', 'box-shadow', 'background-color', 'filter'], { easing: 'bounce' }),
      [reducedMotion]: { transition: 'none' },

      ...($variant === 'filled' && {
        color: c.contrastText,
        background: `linear-gradient(180deg, ${c.light} -40%, ${c.main} 70%)`,
        boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 3px 0 ${c.dark}, ${theme.shadows[2]}`,
        '&:hover': { filter: 'brightness(1.05)', transform: 'translateY(-1px)' },
        '&:active': {
          transform: 'translateY(2px) scale(0.98)',
          boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 1px 0 ${c.dark}, ${theme.shadows[1]}`,
        },
      }),
      ...($variant === 'glass' && {
        color: onSurface,
        ...glass(theme, {
          blur: 'sm',
          elevation: 1,
          background: `linear-gradient(${c.soft}, ${c.soft}), linear-gradient(${theme.glass.tint.regular}, ${theme.glass.tint.regular})`,
        }),
        '&:hover': { transform: 'translateY(-1px)', filter: 'brightness(1.04)' },
        '&:active': { transform: 'scale(0.96)' },
      }),
      ...($variant === 'outlined' && {
        color: onSurface,
        background: 'transparent',
        borderColor: onSurface,
        borderWidth: 2,
        '&:hover': { background: c.soft },
        '&:active': { transform: 'scale(0.96)' },
      }),
      ...($variant === 'text' && {
        color: onSurface,
        background: 'transparent',
        '&:hover': { background: c.soft },
        '&:active': { transform: 'scale(0.96)' },
      }),

      '&:focus-visible': focusRing(theme),
      '&:disabled': {
        cursor: 'not-allowed',
        color: theme.palette.action.disabled,
        background: $variant === 'filled' || $variant === 'glass' ? theme.palette.action.disabledBackground : 'transparent',
        borderColor: $variant === 'outlined' ? theme.palette.action.disabled : 'transparent',
        boxShadow: 'none',
        backdropFilter: 'none',
        filter: 'none',
        transform: 'none',
      },
    };
  },
  applySx,
);

const Icon = styled.span({ display: 'inline-flex', flexShrink: 0, fontSize: '1.25em' });

const Peek = styled.span<{ $size: number; $line: number }>(({ $size, $line }) => ({
  position: 'absolute',
  // Behind the button, so only what rises above its top edge is visible on opaque variants.
  zIndex: -1,
  top: -($size * $line) / 100 + 2,
  insetInlineEnd: $size * 0.35,
  width: $size,
  height: $size,
  pointerEvents: 'none',
}));

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  {
    variant = 'filled',
    color = 'primary',
    size = 'md',
    fullWidth = false,
    startIcon,
    endIcon,
    character = false,
    type = 'button',
    children,
    ...rest
  },
  ref,
) {
  const theme = useTheme();
  const name = character === true ? theme.character.default : character;
  const peekSize = HEIGHT[size] * 0.95;

  return (
    <Root ref={ref} type={type} $variant={variant} $color={color} $size={size} $fullWidth={fullWidth} {...rest}>
      {name && (
        <Peek $size={peekSize} $line={getCharacter(name).peekLine} aria-hidden>
          <Character name={name} size={peekSize} mood={rest.disabled ? 'sleepy' : 'neutral'} />
        </Peek>
      )}
      {startIcon && <Icon aria-hidden>{startIcon}</Icon>}
      {children}
      {endIcon && <Icon aria-hidden>{endIcon}</Icon>}
    </Root>
  );
});
