import styled from '@emotion/styled';
import type { ButtonHTMLAttributes } from 'react';
import { focusRing, transition } from '@core';

const Root = styled.button(({ theme }) => ({
  display: 'grid',
  placeItems: 'center',
  flexShrink: 0,
  width: 28,
  height: 28,
  padding: 0,
  border: 0,
  borderRadius: '50%',
  background: 'transparent',
  color: theme.palette.text.secondary,
  cursor: 'pointer',
  transition: transition(theme, ['background-color']),
  '&:hover': { background: theme.palette.action.hover },
  '&:focus-visible': focusRing(theme),
}));

/** Small round "×" button shared by the feedback components. Internal to the module. */
export function CloseButton({ label, ...rest }: ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) {
  return (
    <Root type="button" aria-label={label} {...rest}>
      <svg width="12" height="12" viewBox="0 0 14 14" aria-hidden focusable="false">
        <path d="M2 2l10 10M12 2L2 12" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    </Root>
  );
}
