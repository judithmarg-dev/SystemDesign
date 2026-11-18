import styled from '@emotion/styled';
import { forwardRef } from 'react';
import type { HTMLAttributes, KeyboardEvent, MouseEvent, ReactNode } from 'react';
import { applySx, focusRing, reducedMotion, transition } from '@core';
import type { ColorName, MochiTheme, SxProp } from '@core';

export type ChipVariant = 'filled' | 'soft' | 'outlined';
export type ChipSize = 'sm' | 'md';

export interface ChipProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onClick'>, SxProp {
  label: ReactNode;
  variant?: ChipVariant;
  color?: ColorName;
  size?: ChipSize;
  /** Element shown before the label, e.g. an icon or a small `Avatar`. */
  icon?: ReactNode;
  /** Makes the chip interactive: focusable, and activated with Enter or Space. */
  onClick?: (event: MouseEvent<HTMLDivElement> | KeyboardEvent<HTMLDivElement>) => void;
  /** Shows a delete button. Backspace and Delete also call it while the chip has focus. */
  onDelete?: () => void;
  /** Accessible name of the delete button. */
  deleteLabel?: string;
  disabled?: boolean;
}

interface RootProps extends SxProp {
  $variant: ChipVariant;
  $color: ColorName;
  $size: ChipSize;
  $clickable: boolean;
  $disabled: boolean;
}

function colors(theme: MochiTheme, variant: ChipVariant, color: ColorName) {
  const c = theme.palette[color];
  switch (variant) {
    case 'filled':
      return { background: c.main, color: c.contrastText, border: '1px solid transparent' };
    case 'soft':
      return { background: c.soft, color: c.dark, border: '1px solid transparent' };
    case 'outlined':
      return { background: 'transparent', color: c.dark, border: `1px solid ${c.main}` };
  }
}

const Root = styled.div<RootProps>(
  ({ theme, $variant, $color, $size, $clickable, $disabled }) => ({
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(0.75),
    maxWidth: '100%',
    boxSizing: 'border-box',
    height: $size === 'sm' ? 26 : 32,
    paddingInline: theme.spacing($size === 'sm' ? 1 : 1.5),
    borderRadius: theme.shape.radius.pill,
    fontFamily: theme.typography.fontFamily,
    fontSize: $size === 'sm' ? '0.75rem' : '0.8125rem',
    fontWeight: 700,
    lineHeight: 1,
    whiteSpace: 'nowrap',
    verticalAlign: 'middle',
    userSelect: 'none',
    ...colors(theme, $variant, $color),
    opacity: $disabled ? 0.5 : undefined,
    pointerEvents: $disabled ? 'none' : undefined,
    cursor: $clickable ? 'pointer' : 'default',
    WebkitTapHighlightColor: 'transparent',
    transition: transition(theme, ['transform', 'box-shadow', 'filter']),
    [reducedMotion]: { transition: 'none' },
    ...($clickable && {
      '&:hover': { filter: 'brightness(1.05)', boxShadow: theme.shadows[1] },
      '&:active': { transform: 'scale(0.96)' },
    }),
    '&:focus-visible': focusRing(theme),
  }),
  applySx,
);

const Label = styled.span({ overflow: 'hidden', textOverflow: 'ellipsis' });

const Icon = styled.span({ display: 'inline-flex', flexShrink: 0, marginInlineStart: -2, fontSize: '1.15em' });

const DeleteButton = styled.button(({ theme }) => ({
  display: 'grid',
  placeItems: 'center',
  flexShrink: 0,
  width: 18,
  height: 18,
  marginInlineEnd: -4,
  padding: 0,
  border: 0,
  borderRadius: '50%',
  background: 'transparent',
  color: 'inherit',
  opacity: 0.7,
  cursor: 'pointer',
  transition: transition(theme, ['opacity', 'background-color']),
  '&:hover': { opacity: 1, background: theme.palette.action.hover },
  '&:focus-visible': { ...focusRing(theme), outlineOffset: 0 },
}));

/** A compact element for a tag, a filter, a choice or a small piece of information. */
export const Chip = forwardRef<HTMLDivElement, ChipProps>(function Chip(
  {
    label,
    variant = 'soft',
    color = 'neutral',
    size = 'md',
    icon,
    onClick,
    onDelete,
    deleteLabel = 'Delete',
    disabled = false,
    onKeyDown,
    ...rest
  },
  ref,
) {
  const clickable = Boolean(onClick) && !disabled;

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (event.defaultPrevented || disabled || event.target !== event.currentTarget) return;
    if (onClick && (event.key === 'Enter' || event.key === ' ')) {
      event.preventDefault();
      onClick(event);
    } else if (onDelete && (event.key === 'Backspace' || event.key === 'Delete')) {
      event.preventDefault();
      onDelete();
    }
  };

  return (
    <Root
      ref={ref}
      role={clickable ? 'button' : undefined}
      tabIndex={clickable ? 0 : undefined}
      aria-disabled={disabled || undefined}
      onClick={clickable ? onClick : undefined}
      onKeyDown={handleKeyDown}
      $variant={variant}
      $color={color}
      $size={size}
      $clickable={clickable}
      $disabled={disabled}
      {...rest}
    >
      {icon && <Icon aria-hidden>{icon}</Icon>}
      <Label>{label}</Label>
      {onDelete && (
        <DeleteButton
          type="button"
          aria-label={deleteLabel}
          disabled={disabled}
          onClick={(event) => {
            event.stopPropagation();
            onDelete();
          }}
        >
          <svg width="10" height="10" viewBox="0 0 14 14" aria-hidden focusable="false">
            <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
          </svg>
        </DeleteButton>
      )}
    </Root>
  );
});
