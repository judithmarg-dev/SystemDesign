import styled from '@emotion/styled';
import { applySx, glass, reducedMotion, transition } from '@core';
import type { Size, SxProp } from '@core';

/** Building blocks shared by the text-like fields (TextField, Select). Internal to the inputs module. */

export const FIELD_HEIGHT: Record<Size, number> = { sm: 34, md: 42, lg: 52 };
export const FIELD_PADDING: Record<Size, number> = { sm: 14, md: 18, lg: 22 };
export const FIELD_FONT: Record<Size, string> = { sm: '0.8125rem', md: '0.9375rem', lg: '1.0625rem' };

export const FieldRoot = styled.div<SxProp & { $fullWidth: boolean }>(
  ({ theme, $fullWidth }) => ({
    display: $fullWidth ? 'flex' : 'inline-flex',
    flexDirection: 'column',
    gap: theme.spacing(0.75),
    width: $fullWidth ? '100%' : undefined,
    minWidth: 0,
    fontFamily: theme.typography.fontFamily,
  }),
  applySx,
);

export const FieldLabel = styled.label<{ $error: boolean; $disabled: boolean }>(({ theme, $error, $disabled }) => ({
  ...theme.typography.caption,
  fontSize: '0.8125rem',
  fontWeight: 700,
  paddingInline: theme.spacing(1.5),
  color: $disabled
    ? theme.palette.text.disabled
    : $error
      ? theme.palette.error[theme.mode === 'dark' ? 'light' : 'dark']
      : theme.palette.text.secondary,
}));

export interface FieldControlProps {
  $size: Size;
  $error: boolean;
  $disabled: boolean;
  /** Multi-line fields use a softer corner instead of a pill. */
  $multiline?: boolean;
}

export const FieldControl = styled.div<FieldControlProps>(({ theme, $size, $error, $disabled, $multiline }) => {
  const error = theme.palette.error[theme.mode === 'dark' ? 'light' : 'main'];
  return {
    position: 'relative',
    display: 'flex',
    alignItems: $multiline ? 'flex-start' : 'center',
    gap: theme.spacing(1),
    minHeight: FIELD_HEIGHT[$size],
    paddingInline: FIELD_PADDING[$size],
    borderRadius: $multiline ? theme.shape.radius.md : theme.shape.radius.pill,
    color: theme.palette.text.primary,
    fontSize: FIELD_FONT[$size],
    ...glass(theme, { blur: 'sm', tint: 'regular' }),
    borderWidth: 1.5,
    borderStyle: 'solid',
    borderColor: $error ? error : theme.glass.border,
    transition: transition(theme, ['border-color', 'box-shadow', 'background-color']),
    [reducedMotion]: { transition: 'none' },
    ...(!$disabled && {
      '&:hover': { borderColor: $error ? error : theme.palette.text.secondary },
      '&:focus-within': {
        borderColor: $error ? error : theme.palette.action.focus,
        boxShadow: `inset 0 1px 0 ${theme.glass.highlight}, 0 0 0 3px ${
          $error ? theme.palette.error.soft : theme.palette.primary.soft
        }`,
        background: theme.glass.tint.strong,
      },
    }),
    ...($disabled && {
      background: theme.palette.action.disabledBackground,
      backdropFilter: 'none',
      WebkitBackdropFilter: 'none',
      color: theme.palette.text.disabled,
      cursor: 'not-allowed',
    }),
  };
});

export const FieldAdornment = styled.span(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
  color: theme.palette.text.secondary,
}));

export const FieldHelperText = styled.p<{ $error: boolean }>(({ theme, $error }) => ({
  margin: 0,
  paddingInline: theme.spacing(1.5),
  ...theme.typography.caption,
  color: $error ? theme.palette.error[theme.mode === 'dark' ? 'light' : 'dark'] : theme.palette.text.secondary,
}));
