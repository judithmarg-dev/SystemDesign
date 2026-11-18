import styled from '@emotion/styled';
import { createContext, forwardRef, useContext, useId, useMemo } from 'react';
import type { ChangeEvent, HTMLAttributes, InputHTMLAttributes, ReactNode } from 'react';
import { applySx, focusRing, reducedMotion, transition } from '@core';
import type { ColorName, SxProp } from '@core';
import { useControlled } from '@shared';
import { ChoiceControl, ChoiceInput, ChoiceRoot } from '../internal/choice';

interface RadioGroupContextValue {
  name: string;
  value: string | undefined;
  disabled: boolean;
  color: ColorName | undefined;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

const RadioGroupContext = createContext<RadioGroupContextValue | null>(null);

/* ---------------------------------- Radio --------------------------------- */

export interface RadioProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type' | 'size' | 'value'>, SxProp {
  /** Value reported by the group when this option is picked. */
  value: string;
  /** Text next to the dot. Without it, pass `aria-label`. */
  label?: ReactNode;
  color?: ColorName;
}

const Dot = styled.span<{ $color: ColorName }>(({ theme, $color }) => {
  const c = theme.palette[$color];
  return {
    display: 'grid',
    placeItems: 'center',
    width: 24,
    height: 24,
    borderRadius: '50%',
    border: `2px solid ${theme.palette.text.secondary}`,
    background: theme.glass.tint.regular,
    transition: transition(theme, ['border-color', 'transform'], { easing: 'bounce' }),
    '&::after': {
      content: '""',
      width: 12,
      height: 12,
      borderRadius: '50%',
      background: `linear-gradient(180deg, ${c.light} -40%, ${c.main} 70%)`,
      boxShadow: `0 1px 0 ${c.dark}`,
      transform: 'scale(0)',
      transition: transition(theme, ['transform'], { duration: 'medium', easing: 'bounce' }),
    },
    [reducedMotion]: { transition: 'none', '&::after': { transition: 'none' } },
    'input:checked + &': { borderColor: theme.mode === 'dark' ? c.light : c.dark },
    'input:checked + &::after': { transform: 'scale(1)' },
    'input:active:not(:disabled) + &': { transform: 'scale(0.88)' },
    'input:focus-visible + &': focusRing(theme),
    'input:disabled + &': {
      borderColor: theme.palette.action.disabled,
      background: theme.palette.action.disabledBackground,
    },
    'input:disabled + &::after': { background: theme.palette.action.disabled, boxShadow: 'none' },
  };
});

/** One option of a set. Usually rendered inside a `RadioGroup`, which supplies name, selection and change handling. */
export const Radio = forwardRef<HTMLInputElement, RadioProps>(function Radio(
  { value, label, color, disabled, checked, name, onChange, className, style, sx, ...rest },
  ref,
) {
  const group = useContext(RadioGroupContext);
  const isDisabled = disabled ?? group?.disabled ?? false;

  return (
    <ChoiceRoot $disabled={isDisabled} className={className} style={style} sx={sx}>
      <ChoiceControl>
        <ChoiceInput
          ref={ref}
          type="radio"
          value={value}
          name={name ?? group?.name}
          disabled={isDisabled}
          {...(group ? { checked: group.value === value } : { checked })}
          onChange={(event) => {
            onChange?.(event);
            group?.onChange(event);
          }}
          {...rest}
        />
        <Dot $color={color ?? group?.color ?? 'primary'} aria-hidden />
      </ChoiceControl>
      {label}
    </ChoiceRoot>
  );
});

/* ------------------------------- RadioGroup ------------------------------- */

export interface RadioGroupProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue'>, SxProp {
  /** Selected value (controlled). */
  value?: string;
  /** Initially selected value (uncontrolled). */
  defaultValue?: string;
  onChange?: (value: string, event: ChangeEvent<HTMLInputElement>) => void;
  /** Form field name shared by the radios. Generated when omitted. */
  name?: string;
  /** Visible group label. Alternatively pass `aria-label` or `aria-labelledby`. */
  label?: ReactNode;
  /** Lays the options out horizontally. */
  row?: boolean;
  disabled?: boolean;
  /** Color for every radio in the group. */
  color?: ColorName;
}

const GroupRoot = styled.div<SxProp>(
  ({ theme }) => ({
    display: 'inline-flex',
    flexDirection: 'column',
    gap: theme.spacing(1),
    fontFamily: theme.typography.fontFamily,
  }),
  applySx,
);

const GroupLabel = styled.span(({ theme }) => ({
  ...theme.typography.caption,
  fontSize: '0.8125rem',
  fontWeight: 700,
  color: theme.palette.text.secondary,
}));

const Options = styled.div<{ $row: boolean }>(({ theme, $row }) => ({
  display: 'flex',
  flexDirection: $row ? 'row' : 'column',
  flexWrap: 'wrap',
  gap: $row ? theme.spacing(1, 3) : theme.spacing(1.25),
}));

/** Groups `Radio` options so that exactly one can be selected. */
export const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>(function RadioGroup(
  { value: valueProp, defaultValue, onChange, name: nameProp, label, row = false, disabled = false, color, children, ...rest },
  ref,
) {
  const generatedName = useId();
  const labelId = useId();
  const name = nameProp ?? generatedName;
  const [value, setValue] = useControlled<string | undefined>(valueProp, defaultValue);

  const context = useMemo<RadioGroupContextValue>(
    () => ({
      name,
      value,
      disabled,
      color,
      onChange: (event) => {
        setValue(event.target.value);
        onChange?.(event.target.value, event);
      },
    }),
    [name, value, disabled, color, setValue, onChange],
  );

  return (
    <GroupRoot ref={ref} role="radiogroup" aria-labelledby={label ? labelId : undefined} aria-disabled={disabled || undefined} {...rest}>
      {label && <GroupLabel id={labelId}>{label}</GroupLabel>}
      <Options $row={row}>
        <RadioGroupContext.Provider value={context}>{children}</RadioGroupContext.Provider>
      </Options>
    </GroupRoot>
  );
});
