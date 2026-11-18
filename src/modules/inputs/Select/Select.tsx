import { keyframes } from '@emotion/react';
import styled from '@emotion/styled';
import { Children, forwardRef, isValidElement, useEffect, useId, useRef, useState } from 'react';
import type { ForwardedRef, HTMLAttributes, KeyboardEvent, ReactElement, ReactNode, Ref } from 'react';
import { glass, reducedMotion, transition } from '@core';
import type { Size, SxProp } from '@core';
import { Portal, mergeRefs, useClickOutside, useControlled, useIsomorphicLayoutEffect } from '@shared';
import { FIELD_HEIGHT, FieldAdornment, FieldControl, FieldHelperText, FieldLabel, FieldRoot } from '../internal/field';

export type SelectValue = string | number;

export interface SelectOption<V extends SelectValue = SelectValue> {
  value: V;
  label: ReactNode;
  /** Text used for typeahead when `label` is not a string. */
  textValue?: string;
  disabled?: boolean;
}

/* --------------------------------- Option --------------------------------- */

export interface OptionProps<V extends SelectValue = SelectValue> {
  value: V;
  disabled?: boolean;
  /** Text used for typeahead when the children are not a string. */
  textValue?: string;
  children: ReactNode;
}

/**
 * Declares one choice of a `Select`. It renders nothing by itself: `Select` reads its props.
 * Use it instead of the `options` prop when the labels are JSX.
 */
export function Option<V extends SelectValue = SelectValue>(_props: OptionProps<V>): null {
  return null;
}

/* --------------------------------- Select --------------------------------- */

interface SelectBaseProps<V extends SelectValue>
  extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange' | 'defaultValue' | 'children'>,
    SxProp {
  label?: ReactNode;
  /** Hint shown below the field; also announced as its description. */
  helperText?: ReactNode;
  error?: boolean;
  disabled?: boolean;
  /** Text shown while nothing is selected. */
  placeholder?: ReactNode;
  /** Choices, as data. Alternatively pass `<Option>` children. */
  options?: SelectOption<V>[];
  children?: ReactNode;
  fullWidth?: boolean;
  size?: Size;
  /** Content before the value, e.g. an icon. */
  startAdornment?: ReactNode;
  /** Name of a hidden input, so the value takes part in form submissions. */
  name?: string;
  /** Props for the popup listbox. */
  listboxProps?: HTMLAttributes<HTMLUListElement>;
}

export interface SingleSelectProps<V extends SelectValue = SelectValue> extends SelectBaseProps<V> {
  multiple?: false;
  value?: V | null;
  defaultValue?: V | null;
  onChange?: (value: V | null) => void;
}

export interface MultipleSelectProps<V extends SelectValue = SelectValue> extends SelectBaseProps<V> {
  multiple: true;
  value?: V[];
  defaultValue?: V[];
  onChange?: (value: V[]) => void;
}

export type SelectProps<V extends SelectValue = SelectValue> = SingleSelectProps<V> | MultipleSelectProps<V>;

const GAP = 6;
const MARGIN = 8;
const TYPEAHEAD_RESET = 600;

const pop = keyframes({ from: { transform: 'scale(0.92)' }, to: { transform: 'none' } });

const Trigger = styled.div<{ $size: Size; $disabled: boolean }>(({ theme, $size, $disabled }) => ({
  flex: 1,
  minWidth: 0,
  display: 'flex',
  alignItems: 'center',
  minHeight: FIELD_HEIGHT[$size] - 3,
  outline: 'none',
  cursor: $disabled ? 'not-allowed' : 'pointer',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  whiteSpace: 'nowrap',
  userSelect: 'none',
  // The ring goes on the whole field, see `FieldControl:focus-within`.
  '&:focus-visible': { outline: 'none' },
  color: theme.palette.text.primary,
}));

const Placeholder = styled.span(({ theme }) => ({ color: theme.palette.text.disabled }));

const Chevron = styled.svg<{ $open: boolean }>(({ theme, $open }) => ({
  width: '1.1em',
  height: '1.1em',
  transform: $open ? 'rotate(180deg)' : 'none',
  transition: transition(theme, ['transform'], { easing: 'bounce' }),
  [reducedMotion]: { transition: 'none' },
}));

const Listbox = styled.ul<{ $above: boolean }>(({ theme, $above }) => ({
  position: 'fixed',
  zIndex: theme.zIndex.modal,
  margin: 0,
  padding: theme.spacing(0.75),
  listStyle: 'none',
  maxHeight: 280,
  overflowY: 'auto',
  borderRadius: theme.shape.radius.md,
  ...glass(theme, { blur: 'lg', tint: 'strong', elevation: 4 }),
  fontFamily: theme.typography.fontFamily,
  outline: 'none',
  transformOrigin: $above ? 'bottom center' : 'top center',
  animation: `${pop} ${theme.motion.duration.medium}ms ${theme.motion.easing.bounce} both`,
  [reducedMotion]: { animation: 'none' },
}));

const OptionRoot = styled.li<{ $selected: boolean; $active: boolean; $disabled: boolean }>(
  ({ theme, $selected, $active, $disabled }) => ({
    display: 'flex',
    alignItems: 'center',
    gap: theme.spacing(1),
    minHeight: 36,
    padding: `${theme.spacing(0.75)} ${theme.spacing(1.5)}`,
    borderRadius: theme.shape.radius.sm,
    ...theme.typography.body2,
    fontWeight: $selected ? 800 : 600,
    color: $disabled ? theme.palette.action.disabled : theme.palette.text.primary,
    background: $selected ? theme.palette.action.selected : $active ? theme.palette.action.hover : 'transparent',
    cursor: $disabled ? 'not-allowed' : 'pointer',
    ...($active && !$disabled && { boxShadow: `inset 0 0 0 2px ${theme.palette.action.focus}` }),
  }),
);

const Check = styled.span<{ $visible: boolean }>(({ $visible }) => ({
  display: 'inline-flex',
  width: '1em',
  flexShrink: 0,
  visibility: $visible ? 'visible' : 'hidden',
}));

const textOf = (node: ReactNode): string => {
  if (typeof node === 'string' || typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(textOf).join('');
  if (isValidElement<{ children?: ReactNode }>(node)) return textOf(node.props.children);
  return '';
};

function collectOptions<V extends SelectValue>(options: SelectOption<V>[] | undefined, children: ReactNode): SelectOption<V>[] {
  if (options) return options;
  const result: SelectOption<V>[] = [];
  Children.forEach(children, (child) => {
    if (!isValidElement(child) || child.type !== Option) return;
    const props = (child as ReactElement<OptionProps<V>>).props;
    result.push({ value: props.value, label: props.children, textValue: props.textValue, disabled: props.disabled });
  });
  return result;
}

/**
 * Picks one (or several, with `multiple`) values from a list that opens in a glass popup.
 * Keyboard: arrows/Home/End move, Enter or Space choose, Escape closes, typing jumps to a matching option.
 */
function SelectInner<V extends SelectValue>(props: SelectProps<V>, ref: ForwardedRef<HTMLDivElement>) {
  const {
    label,
    helperText,
    error = false,
    disabled = false,
    placeholder,
    options: optionsProp,
    children,
    fullWidth = false,
    size = 'md',
    startAdornment,
    name,
    listboxProps,
    multiple = false,
    value: valueProp,
    defaultValue,
    onChange,
    id: idProp,
    className,
    style,
    sx,
    'aria-describedby': describedBy,
    'aria-label': ariaLabel,
    onKeyDown,
    ...rest
  } = props;

  const generatedId = useId();
  const id = idProp ?? generatedId;
  const labelId = `${id}-label`;
  const listboxId = `${id}-listbox`;
  const helperId = helperText ? `${id}-helper` : undefined;
  const optionId = (index: number) => `${id}-option-${index}`;

  const options = collectOptions(optionsProp, children);
  const empty = (multiple ? [] : null) as V[] | V | null;
  const [value, setValue] = useControlled<V[] | V | null>(
    valueProp as V[] | V | null | undefined,
    (defaultValue as V[] | V | null | undefined) ?? empty,
  );
  const selectedValues: V[] = multiple ? ((value as V[] | null) ?? []) : value === null || value === undefined ? [] : [value as V];
  const isSelected = (option: SelectOption<V>) => selectedValues.includes(option.value);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const triggerRef = useRef<HTMLDivElement>(null);
  const controlRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [list, setList] = useState<HTMLUListElement | null>(null);
  const [position, setPosition] = useState<{ top: number; left: number; width: number; above: boolean } | null>(null);
  const typeahead = useRef({ text: '', timer: undefined as ReturnType<typeof setTimeout> | undefined });

  const enabledIndexes = options.flatMap((option, index) => (option.disabled ? [] : [index]));
  const firstSelected = options.findIndex((option) => isSelected(option) && !option.disabled);

  const openList = (index?: number) => {
    if (disabled) return;
    setOpen(true);
    setActiveIndex(index ?? (firstSelected >= 0 ? firstSelected : (enabledIndexes[0] ?? -1)));
  };
  const closeList = (refocus = true) => {
    setOpen(false);
    setActiveIndex(-1);
    if (refocus) triggerRef.current?.focus();
  };

  const choose = (index: number) => {
    const option = options[index];
    if (!option || option.disabled) return;
    if (multiple) {
      const next = isSelected(option)
        ? selectedValues.filter((v) => v !== option.value)
        : [...selectedValues, option.value];
      setValue(next);
      (onChange as ((value: V[]) => void) | undefined)?.(next);
    } else {
      if (value !== option.value) {
        setValue(option.value);
        (onChange as ((value: V | null) => void) | undefined)?.(option.value);
      }
      closeList();
    }
  };

  useClickOutside([controlRef, listRef], () => closeList(false), open);
  useEffect(() => () => clearTimeout(typeahead.current.timer), []);

  useIsomorphicLayoutEffect(() => {
    const anchorEl = controlRef.current;
    if (!open || !list || !anchorEl) {
      setPosition(null);
      return;
    }
    const update = () => {
      const a = anchorEl.getBoundingClientRect();
      const h = list.offsetHeight;
      const fitsBelow = a.bottom + GAP + h <= window.innerHeight - MARGIN;
      const fitsAbove = a.top - GAP - h >= MARGIN;
      const above = !fitsBelow && fitsAbove;
      const top = above ? a.top - GAP - h : a.bottom + GAP;
      const left = Math.max(MARGIN, Math.min(a.left, window.innerWidth - a.width - MARGIN));
      setPosition((prev) =>
        prev && prev.top === top && prev.left === left && prev.width === a.width && prev.above === above
          ? prev
          : { top, left, width: a.width, above },
      );
    };
    update();
    window.addEventListener('resize', update);
    window.addEventListener('scroll', update, true);
    return () => {
      window.removeEventListener('resize', update);
      window.removeEventListener('scroll', update, true);
    };
  }, [open, list]);

  // Keep the active option in view.
  useEffect(() => {
    if (!open || activeIndex < 0) return;
    document.getElementById(optionId(activeIndex))?.scrollIntoView?.({ block: 'nearest' });
  }, [open, activeIndex]);

  const move = (from: number, delta: 1 | -1) => {
    if (enabledIndexes.length === 0) return -1;
    const position = enabledIndexes.indexOf(from);
    if (position === -1) return delta === 1 ? enabledIndexes[0]! : enabledIndexes[enabledIndexes.length - 1]!;
    return enabledIndexes[Math.min(enabledIndexes.length - 1, Math.max(0, position + delta))]!;
  };

  const search = (char: string) => {
    const state = typeahead.current;
    clearTimeout(state.timer);
    state.text += char.toLowerCase();
    state.timer = setTimeout(() => (state.text = ''), TYPEAHEAD_RESET);
    const start = open ? activeIndex : firstSelected;
    // A repeated single letter cycles through the options starting with it.
    const cycling = [...state.text].every((c) => c === state.text[0]);
    const query = cycling ? state.text[0]! : state.text;
    // A new search starts after the current option; a longer query keeps refining the current one.
    const from = cycling ? start + 1 : start;
    const candidates = [...enabledIndexes.filter((i) => i >= from), ...enabledIndexes.filter((i) => i < from)];
    const match = candidates.find((i) => {
      const option = options[i]!;
      return (option.textValue ?? textOf(option.label)).toLowerCase().startsWith(query);
    });
    if (match === undefined) return;
    if (open) setActiveIndex(match);
    else if (!multiple) choose(match);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    onKeyDown?.(event);
    if (disabled || event.defaultPrevented) return;
    const { key } = event;

    if (!open) {
      if (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ') {
        event.preventDefault();
        if (key === 'ArrowUp') openList(firstSelected >= 0 ? firstSelected : enabledIndexes[enabledIndexes.length - 1]);
        else openList();
        return;
      }
      if (key === 'Home' || key === 'End') {
        event.preventDefault();
        openList(key === 'Home' ? enabledIndexes[0] : enabledIndexes[enabledIndexes.length - 1]);
        return;
      }
    } else {
      switch (key) {
        case 'ArrowDown':
          event.preventDefault();
          setActiveIndex((i) => move(i, 1));
          return;
        case 'ArrowUp':
          event.preventDefault();
          setActiveIndex((i) => move(i, -1));
          return;
        case 'Home':
          event.preventDefault();
          setActiveIndex(enabledIndexes[0] ?? -1);
          return;
        case 'End':
          event.preventDefault();
          setActiveIndex(enabledIndexes[enabledIndexes.length - 1] ?? -1);
          return;
        case 'Enter':
        case ' ':
          if (key === ' ' && typeahead.current.text) break;
          event.preventDefault();
          choose(activeIndex);
          return;
        case 'Escape':
          event.preventDefault();
          event.stopPropagation();
          closeList();
          return;
        case 'Tab':
          closeList(false);
          return;
      }
    }

    if (key.length === 1 && !event.ctrlKey && !event.metaKey && !event.altKey) {
      if (key === ' ' && !typeahead.current.text) return;
      event.preventDefault();
      search(key);
    }
  };

  const selectedOptions = options.filter(isSelected);
  const display =
    selectedOptions.length === 0 ? (
      placeholder ? <Placeholder>{placeholder}</Placeholder> : ' '
    ) : multiple ? (
      selectedOptions.map((option, i) => (
        <span key={String(option.value)}>
          {i > 0 && ', '}
          {option.label}
        </span>
      ))
    ) : (
      selectedOptions[0]!.label
    );

  return (
    <FieldRoot $fullWidth={fullWidth} className={className} style={style} sx={sx}>
      {label && (
        <FieldLabel
          as="span"
          id={labelId}
          $error={error}
          $disabled={disabled}
          onClick={() => triggerRef.current?.focus()}
        >
          {label}
        </FieldLabel>
      )}
      <FieldControl
        ref={controlRef}
        $size={size}
        $error={error}
        $disabled={disabled}
        onClick={() => (open ? closeList() : (triggerRef.current?.focus(), openList()))}
      >
        {startAdornment && <FieldAdornment>{startAdornment}</FieldAdornment>}
        <Trigger
          ref={mergeRefs(ref, triggerRef)}
          id={id}
          role="combobox"
          tabIndex={disabled ? -1 : 0}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-controls={open ? listboxId : undefined}
          aria-activedescendant={open && activeIndex >= 0 ? optionId(activeIndex) : undefined}
          aria-labelledby={ariaLabel ? undefined : [label ? labelId : null, id].filter(Boolean).join(' ')}
          aria-label={ariaLabel}
          aria-describedby={[describedBy, helperId].filter(Boolean).join(' ') || undefined}
          aria-invalid={error || undefined}
          aria-disabled={disabled || undefined}
          $size={size}
          $disabled={disabled}
          onKeyDown={handleKeyDown}
          {...rest}
        >
          {display}
        </Trigger>
        <FieldAdornment aria-hidden>
          <Chevron $open={open} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round">
            <path d="M6 9l6 6 6-6" />
          </Chevron>
        </FieldAdornment>
      </FieldControl>
      {helperText && (
        <FieldHelperText id={helperId} $error={error}>
          {helperText}
        </FieldHelperText>
      )}
      {name &&
        (selectedValues.length > 0 ? selectedValues : ['']).map((v) => (
          <input key={String(v)} type="hidden" name={name} value={String(v)} />
        ))}
      {open && (
        <Portal>
          <Listbox
            ref={mergeRefs(listRef, setList)}
            id={listboxId}
            role="listbox"
            aria-labelledby={label ? labelId : undefined}
            aria-label={label ? undefined : ariaLabel}
            aria-multiselectable={multiple || undefined}
            tabIndex={-1}
            $above={position?.above ?? false}
            {...listboxProps}
            style={{
              ...listboxProps?.style,
              ...(position
                ? { top: position.top, left: position.left, minWidth: position.width }
                : { top: 0, left: 0, visibility: 'hidden' }),
            }}
            // Keep focus on the combobox while clicking options.
            onPointerDown={(event) => event.preventDefault()}
          >
            {options.map((option, index) => {
              const selected = isSelected(option);
              return (
                <OptionRoot
                  key={String(option.value)}
                  id={optionId(index)}
                  role="option"
                  aria-selected={selected}
                  aria-disabled={option.disabled || undefined}
                  $selected={selected}
                  $active={index === activeIndex}
                  $disabled={Boolean(option.disabled)}
                  onPointerMove={() => !option.disabled && activeIndex !== index && setActiveIndex(index)}
                  onClick={() => choose(index)}
                >
                  {multiple && (
                    <Check $visible={selected} aria-hidden>
                      ✓
                    </Check>
                  )}
                  {option.label}
                </OptionRoot>
              );
            })}
          </Listbox>
        </Portal>
      )}
    </FieldRoot>
  );
}

export const Select = forwardRef(SelectInner) as <V extends SelectValue = SelectValue>(
  props: SelectProps<V> & { ref?: Ref<HTMLDivElement> },
) => ReturnType<typeof SelectInner>;
