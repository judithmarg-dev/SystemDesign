import styled from '@emotion/styled';
import { forwardRef, useId } from 'react';
import type { InputHTMLAttributes, ReactNode, Ref } from 'react';
import type { Size, SxProp } from '@core';
import { FIELD_HEIGHT, FieldAdornment, FieldControl, FieldHelperText, FieldLabel, FieldRoot } from '../internal/field';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>, SxProp {
  label?: ReactNode;
  /** Hint shown below the field; also announced as its description. */
  helperText?: ReactNode;
  /** Marks the field as invalid. */
  error?: boolean;
  /** Content before the text, e.g. an icon. */
  startAdornment?: ReactNode;
  /** Content after the text, e.g. an icon or unit. */
  endAdornment?: ReactNode;
  /** Renders a `<textarea>` instead of an `<input>`. */
  multiline?: boolean;
  /** Visible lines when `multiline`. */
  rows?: number;
  fullWidth?: boolean;
  size?: Size;
}

const Input = styled.input<{ $size: Size; $multiline: boolean }>(({ theme, $size, $multiline }) => ({
  flex: 1,
  minWidth: 0,
  width: '100%',
  minHeight: $multiline ? undefined : FIELD_HEIGHT[$size] - 3,
  margin: 0,
  padding: $multiline ? `${theme.spacing(1.25)} 0` : 0,
  border: 0,
  outline: 'none',
  background: 'transparent',
  color: 'inherit',
  font: 'inherit',
  lineHeight: 1.5,
  resize: $multiline ? 'vertical' : undefined,
  '&::placeholder': { color: theme.palette.text.disabled, opacity: 1 },
  '&:disabled': { cursor: 'not-allowed' },
}));

/** A single- or multi-line text input in a glass field. */
export const TextField = forwardRef<HTMLInputElement | HTMLTextAreaElement, TextFieldProps>(function TextField(
  {
    label,
    helperText,
    error = false,
    startAdornment,
    endAdornment,
    multiline = false,
    rows = 3,
    fullWidth = false,
    size = 'md',
    id: idProp,
    disabled = false,
    className,
    style,
    sx,
    'aria-describedby': describedBy,
    ...rest
  },
  ref,
) {
  const generatedId = useId();
  const id = idProp ?? generatedId;
  const helperId = helperText ? `${id}-helper` : undefined;

  return (
    <FieldRoot $fullWidth={fullWidth} className={className} style={style} sx={sx}>
      {label && (
        <FieldLabel htmlFor={id} $error={error} $disabled={disabled}>
          {label}
        </FieldLabel>
      )}
      <FieldControl $size={size} $error={error} $disabled={disabled} $multiline={multiline}>
        {startAdornment && <FieldAdornment>{startAdornment}</FieldAdornment>}
        <Input
          as={multiline ? 'textarea' : 'input'}
          ref={ref as Ref<HTMLInputElement>}
          id={id}
          disabled={disabled}
          aria-invalid={error || undefined}
          aria-describedby={[describedBy, helperId].filter(Boolean).join(' ') || undefined}
          $size={size}
          $multiline={multiline}
          {...(multiline ? { rows } : {})}
          {...rest}
        />
        {endAdornment && <FieldAdornment>{endAdornment}</FieldAdornment>}
      </FieldControl>
      {helperText && (
        <FieldHelperText id={helperId} $error={error}>
          {helperText}
        </FieldHelperText>
      )}
    </FieldRoot>
  );
});
