import styled from '@emotion/styled';
import { forwardRef } from 'react';
import type { ButtonHTMLAttributes } from 'react';
import { applySx, focusRing, glass, reducedMotion, transition } from '@core';
import type { ColorName, Size, SxProp } from '@core';

export type IconButtonVariant = 'filled' | 'glass' | 'text';

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, SxProp {
  /** Accessible name. Required, since the button has no visible text. */
  'aria-label': string;
  variant?: IconButtonVariant;
  color?: ColorName;
  size?: Size;
}

const SIZE: Record<Size, number> = { sm: 32, md: 40, lg: 50 };
const ICON: Record<Size, string> = { sm: '1rem', md: '1.25rem', lg: '1.5rem' };

interface RootProps extends SxProp {
  $variant: IconButtonVariant;
  $color: ColorName;
  $size: Size;
}

const Root = styled.button<RootProps>(
  ({ theme, $variant, $color, $size }) => {
    const c = theme.palette[$color];
    const onSurface = theme.mode === 'dark' ? c.light : c.dark;
    return {
      display: 'inline-grid',
      placeItems: 'center',
      flexShrink: 0,
      width: SIZE[$size],
      height: SIZE[$size],
      padding: 0,
      border: '1px solid transparent',
      borderRadius: '50%',
      fontSize: ICON[$size],
      lineHeight: 1,
      cursor: 'pointer',
      WebkitTapHighlightColor: 'transparent',
      transition: transition(theme, ['transform', 'box-shadow', 'background-color', 'filter'], { easing: 'bounce' }),
      [reducedMotion]: { transition: 'none' },
      '& > svg': { width: '1em', height: '1em' },

      ...($variant === 'filled' && {
        color: c.contrastText,
        background: `linear-gradient(180deg, ${c.light} -40%, ${c.main} 70%)`,
        boxShadow: `inset 0 1px 0 rgba(255, 255, 255, 0.5), 0 3px 0 ${c.dark}, ${theme.shadows[2]}`,
        '&:hover': { filter: 'brightness(1.05)', transform: 'translateY(-1px)' },
        '&:active': {
          transform: 'translateY(2px) scale(0.96)',
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
        '&:active': { transform: 'scale(0.9)' },
      }),
      ...($variant === 'text' && {
        color: onSurface,
        background: 'transparent',
        '&:hover': { background: c.soft },
        '&:active': { transform: 'scale(0.9)' },
      }),

      '&:focus-visible': focusRing(theme),
      '&:disabled': {
        cursor: 'not-allowed',
        color: theme.palette.action.disabled,
        background: $variant === 'text' ? 'transparent' : theme.palette.action.disabledBackground,
        borderColor: 'transparent',
        boxShadow: 'none',
        backdropFilter: 'none',
        filter: 'none',
        transform: 'none',
      },
    };
  },
  applySx,
);

/** A round button holding a single icon. */
export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { variant = 'text', color = 'neutral', size = 'md', type = 'button', children, ...rest },
  ref,
) {
  return (
    <Root ref={ref} type={type} $variant={variant} $color={color} $size={size} {...rest}>
      {children}
    </Root>
  );
});
