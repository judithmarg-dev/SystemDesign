import styled from '@emotion/styled';
import { applySx } from '@core';
import type { SxProp } from '@core';

/** Building blocks shared by the label-wrapped toggles (Checkbox, Radio, Switch). Internal to the inputs module. */

export const ChoiceRoot = styled.label<SxProp & { $disabled: boolean }>(
  ({ theme, $disabled }) => ({
    position: 'relative',
    display: 'inline-flex',
    alignItems: 'center',
    gap: theme.spacing(1.25),
    fontFamily: theme.typography.fontFamily,
    ...theme.typography.body1,
    color: $disabled ? theme.palette.text.disabled : theme.palette.text.primary,
    cursor: $disabled ? 'not-allowed' : 'pointer',
    userSelect: 'none',
    WebkitTapHighlightColor: 'transparent',
  }),
  applySx,
);

/** Positioning box for the native input and its visual replacement. */
export const ChoiceControl = styled.span({
  position: 'relative',
  display: 'inline-flex',
  flexShrink: 0,
});

/** The native input: invisible but still focusable, clickable and announced. It covers its visual replacement. */
export const ChoiceInput = styled.input({
  position: 'absolute',
  inset: 0,
  width: '100%',
  height: '100%',
  margin: 0,
  padding: 0,
  opacity: 0,
  cursor: 'inherit',
  zIndex: 1,
});
